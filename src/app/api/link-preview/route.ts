import { NextResponse } from "next/server";
import sharp from "sharp";

/* ----------------------------- Types & Config ----------------------------- */

type LinkPreviewColorSource = "image" | "favicon" | "theme" | "manifest" | "fallback";

type LinkPreviewPayload = {
    url: string;
    finalUrl: string;
    domain: string;
    title: string;
    description: string;
    image?: string | null;
    favicon?: string | null;
    accent: string;
    accentSecondary: string;
    accentHighlight: string;
    foreground: string;
    mutedForeground: string;
    colorSource: LinkPreviewColorSource;
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const CACHE_DURATION_MS = 1000 * 60 * 30; // 30 minutes
const REQUEST_TIMEOUT_MS = 8000;
const MAX_IMAGE_BYTES = 1024 * 1024 * 4; // 4 MB
const metadataCache = new Map<string, { expires: number; payload: LinkPreviewPayload }>();

/* --------------------------------- Route --------------------------------- */

export async function GET(request: Request) {
    const url = new URL(request.url);
    const targetUrl = url.searchParams.get("url");

    if (!targetUrl) {
        return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
    }

    let parsedUrl: URL;
    try {
        parsedUrl = new URL(targetUrl);
    } catch {
        return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const cacheKey = parsedUrl.toString();
    const cached = metadataCache.get(cacheKey);
    if (cached && cached.expires > Date.now()) {
        return NextResponse.json(cached.payload);
    }

    try {
        const response = await fetchWithTimeout(parsedUrl.toString(), REQUEST_TIMEOUT_MS);
        if (!response.ok) throw new Error(`Failed to fetch URL: ${response.statusText}`);

        const finalUrl = response.url || parsedUrl.toString();
        const html = await response.text();
        const metadata = await extractMetadata(html, new URL(finalUrl));

        metadataCache.set(cacheKey, {
            expires: Date.now() + CACHE_DURATION_MS,
            payload: metadata,
        });

        return NextResponse.json(metadata);
    } catch (error) {
        console.error("Link preview error", error);
        return NextResponse.json({ error: "Failed to generate link preview" }, { status: 500 });
    }
}

/* ----------------------------- Core Extraction ---------------------------- */

async function extractMetadata(html: string, baseUrl: URL): Promise<LinkPreviewPayload> {
    const { JSDOM } = await import("jsdom");
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    const rawTitle =
        getFirstTruthy([
            getMetaContent(doc, ["og:title", "twitter:title", "title"]),
            doc.title,
            baseUrl.hostname,
        ]) || baseUrl.hostname;

    const rawDescription = getFirstTruthy([
        getMetaContent(doc, ["og:description", "twitter:description", "description"]),
    ]);

    const title = decodeHtmlEntities(cleanText(rawTitle));
    const description = rawDescription ? decodeHtmlEntities(cleanText(rawDescription)) : "";

    const imageUrl = resolveUrl(
        baseUrl,
        getMetaContent(doc, ["og:image", "og:image:url", "twitter:image", "twitter:image:src", "image"])
    );

    const faviconHref = getFaviconHref(doc);
    const faviconUrl = resolveUrl(baseUrl, faviconHref || undefined) ?? `${baseUrl.origin}/favicon.ico`;

    const themeColor =
        pickBestThemeColor(doc) ||
        normalizeColor(getMetaContent(doc, ["msapplication-TileColor", "msapplication-navbutton-color"]));

    let manifestColor: string | null = null;
    const manifestHref = doc.querySelector("link[rel='manifest']")?.getAttribute("href");
    const manifestUrl = resolveUrl(baseUrl, manifestHref || undefined);
    if (manifestUrl) {
        manifestColor = await loadManifestColor(manifestUrl);
    }

    // Gather candidates and score them (prefer vivid, mid-lightness)
    let colorSource: LinkPreviewColorSource;
    let accentBase: string | null;
    const candidates: { hex: string; source: LinkPreviewColorSource }[] = [];

    if (imageUrl) {
        const c = await extractImageColor(imageUrl);
        if (c) candidates.push({ hex: c, source: "image" });
    }

    if (faviconUrl) {
        const c = await extractImageColor(faviconUrl);
        if (c) candidates.push({ hex: c, source: "favicon" });
    }

    if (themeColor) candidates.push({ hex: themeColor, source: "theme" });
    if (manifestColor) candidates.push({ hex: manifestColor, source: "manifest" });

    if (candidates.length) {
        candidates.sort((a, b) => scoreHex(b.hex) - scoreHex(a.hex));
        colorSource = candidates[0].source;
        accentBase = candidates[0].hex;
    } else {
        accentBase = "#CBD5F5"; // graceful fallback
        colorSource = "fallback";
    }

    const palette = createPalette(accentBase);

    return {
        url: baseUrl.toString(),
        finalUrl: baseUrl.toString(),
        domain: baseUrl.hostname,
        title,
        description,
        image: imageUrl,
        favicon: faviconUrl,
        accent: palette.primary,
        accentSecondary: palette.secondary,
        accentHighlight: palette.highlight,
        foreground: palette.foreground,
        mutedForeground: palette.muted,
        colorSource,
    };
}

/* ------------------------------- Fetch Utils ------------------------------ */

async function fetchWithTimeout(resource: string, timeout: number, referer?: string) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
        return await fetch(resource, {
            redirect: "follow",
            signal: controller.signal,
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
                Accept:
                    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
                ...(referer ? { Referer: referer } : {}),
            },
        });
    } finally {
        clearTimeout(id);
    }
}

/* ------------------------------ Color Sources ----------------------------- */

async function loadManifestColor(manifestUrl: string): Promise<string | null> {
    try {
        const res = await fetchWithTimeout(manifestUrl, REQUEST_TIMEOUT_MS, new URL(manifestUrl).origin);
        if (!res.ok) return null;
        const manifest = await res.json();
        const candidates = [manifest.theme_color, manifest.background_color].filter(Boolean) as string[];
        let best: { c: string; score: number } | null = null;
        for (const c of candidates) {
            const norm = normalizeColor(c);
            if (!norm) continue;
            const { s, l } = hexToHsl(norm);
            const score = s * (1 - Math.abs(l - 0.5) * 1.2);
            if (!best || score > best.score) best = { c: norm, score };
        }
        return best?.c ?? null;
    } catch (e) {
        console.warn("Failed to load manifest color", e);
        return null;
    }
}

function pickBestThemeColor(doc: Document): string | null {
    const metas = Array.from(doc.querySelectorAll("meta[name='theme-color']"));
    let best: { c: string; score: number } | null = null;
    for (const m of metas) {
        const c = normalizeColor(m.getAttribute("content"));
        if (!c) continue;
        const { s, l } = hexToHsl(c);
        const score = s * (1 - Math.abs(l - 0.5) * 1.2);
        if (!best || score > best.score) best = { c, score };
    }
    return best?.c ?? null;
}

function getMetaContent(doc: Document, names: string[]): string | null {
    const found: string[] = [];
    for (const name of names) {
        const nodes = [
            ...doc.querySelectorAll(`meta[name='${name}']`),
            ...doc.querySelectorAll(`meta[property='${name}']`),
        ];
        for (const meta of nodes) {
            const content = meta.getAttribute("content");
            if (content) found.push(content.trim());
        }
    }
    return found.length ? found[0] : null;
}

function getFaviconHref(doc: Document): string | null {
    const links = Array.from(doc.querySelectorAll("link[rel*='icon'], link[rel='mask-icon']"));
    if (!links.length) return null;

    const parsed = links.map((link) => {
        const href = link.getAttribute("href") || "";
        const sizesAttr = (link.getAttribute("sizes") || "").toLowerCase();
        const sizes =
            sizesAttr && sizesAttr.includes("x")
                ? sizesAttr.split("x").map((n) => Number(n))
                : [0, 0];
        const area =
            sizes.length === 2 && !sizes.some(Number.isNaN) ? sizes[0] * sizes[1] : 0;
        const isMask = (link.getAttribute("rel") || "").includes("mask");
        return { href, area, isMask };
    });

    parsed.sort((a, b) => {
        if (a.isMask !== b.isMask) return a.isMask ? 1 : -1; // prefer non-mask
        return b.area - a.area; // prefer bigger
    });

    return parsed[0]?.href || null;
}

/* ---------------------------- Image Color Logic --------------------------- */

type Swatch = { r: number; g: number; b: number; a?: number };

function isLikelyBackground({ r, g, b }: Swatch) {
    const { s, l } = rgbToHsl(r, g, b);
    return s < 0.12 || l < 0.07 || l > 0.93; // skip gray/black/white-ish
}

function hueBin(h: number) {
    return Math.max(0, Math.min(35, Math.floor((h % 360) / 10))); // 36 bins (10°)
}

function extractColorFromSVG(svg: string): string | null {
    const candidates: string[] = [];
    const attrRegex = /(fill|stroke|stop-color)\s*=\s*["']([^"']+)["']/gi;
    let m: RegExpExecArray | null;
    while ((m = attrRegex.exec(svg))) {
        candidates.push(m[2]);
    }
    for (const c of candidates) {
        const norm = normalizeColor(c);
        if (norm) return norm;
    }
    return null;
}

async function extractImageColor(imageUrl: string): Promise<string | null> {
    try {
        const res = await fetchWithTimeout(imageUrl, REQUEST_TIMEOUT_MS, new URL(imageUrl).origin);
        if (!res.ok) return null;

        const contentType = res.headers.get("content-type")?.toLowerCase() ?? "";
        const contentLength = res.headers.get("content-length");
        if (contentLength && Number(contentLength) > MAX_IMAGE_BYTES) return null;

        const buf = Buffer.from(await res.arrayBuffer());
        if (buf.byteLength > MAX_IMAGE_BYTES) return null;

        // SVG path
        if (contentType.includes("image/svg")) {
            const svg = buf.toString("utf8");
            const svgColor = extractColorFromSVG(svg);
            if (svgColor) return svgColor;
            // fallback: rasterize + dominant
            try {
                const stats = await sharp(buf, { limitInputPixels: 4096 * 4096 })
                    .resize({ width: 96, height: 96, fit: "inside", withoutEnlargement: true })
                    .stats();
                return stats.dominant ? rgbToHex(stats.dominant.r, stats.dominant.g, stats.dominant.b) : null;
            } catch {
                return null;
            }
        }

        // Raster: compute weighted hue histogram
        const { data, info } = await sharp(buf, { limitInputPixels: 4096 * 4096 })
            .resize({ width: 96, height: 96, fit: "inside", withoutEnlargement: true })
            .removeAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true });

        const bins: { w: number; sumR: number; sumG: number; sumB: number }[] = Array.from(
            { length: 36 },
            () => ({ w: 0, sumR: 0, sumG: 0, sumB: 0 })
        );

        for (let i = 0; i < data.length; i += info.channels) {
            const r = data[i]!;
            const g = data[i + 1]!;
            const b = data[i + 2]!;
            const sw: Swatch = { r, g, b };
            if (isLikelyBackground(sw)) continue;

            const { h, s, l } = rgbToHsl(r, g, b);
            const weight = Math.pow(s, 1.5) * (1 - Math.abs(l - 0.5) * 1.4); // vivid + mid-lightness
            if (weight <= 0) continue;

            const bin = hueBin(h);
            bins[bin].w += weight;
            bins[bin].sumR += r * weight;
            bins[bin].sumG += g * weight;
            bins[bin].sumB += b * weight;
        }

        const best = bins.reduce(
            (acc, cur, idx) => (cur.w > acc.w ? { ...cur, idx } : acc),
            { w: 0, sumR: 0, sumG: 0, sumB: 0, idx: -1 }
        );

        if (best.w > 0) {
            const r = Math.round(best.sumR / best.w);
            const g = Math.round(best.sumG / best.w);
            const b = Math.round(best.sumB / best.w);
            return rgbToHex(r, g, b);
        }

        // final fallback to sharp dominant
        const stats = await sharp(buf, { limitInputPixels: 4096 * 4096 })
            .resize({ width: 64, height: 64, fit: "inside", withoutEnlargement: true })
            .stats();
        return stats.dominant ? rgbToHex(stats.dominant.r, stats.dominant.g, stats.dominant.b) : null;
    } catch (error) {
        console.warn("Failed to extract image color", error);
        return null;
    }
}

/* ------------------------------ Color Helpers ----------------------------- */

function resolveUrl(base: URL, value?: string | null): string | null {
    if (!value) return null;
    try {
        return new URL(value, base).toString();
    } catch {
        return null;
    }
}

function normalizeColor(input?: string | null): string | null {
    if (!input) return null;
    const value = input.trim();

    // hex
    if (/^#([0-9a-fA-F]{3,4}){1,2}$/.test(value)) {
        return expandHex(value);
    }

    // rgb/rgba
    const rgbMatch = value.match(/^rgba?\(([^)]+)\)$/i);
    if (rgbMatch) {
        const parts = rgbMatch[1].split(",").map((p) => p.trim());
        if (parts.length >= 3) {
            const [r, g, b] = parts.slice(0, 3).map((p) => parseFloat(p));
            if ([r, g, b].every((n) => !Number.isNaN(n))) {
                return rgbToHex(
                    clamp(Math.round(r), 0, 255),
                    clamp(Math.round(g), 0, 255),
                    clamp(Math.round(b), 0, 255)
                );
            }
        }
    }

    // hsl/hsla
    const hslMatch = value.match(/^hsla?\(([^)]+)\)$/i);
    if (hslMatch) {
        const parts = hslMatch[1].split(",").map((p) => p.trim());
        if (parts.length >= 3) {
            const h = parseFloat(parts[0]);
            const s = parseFloat(parts[1]);
            const l = parseFloat(parts[2]);
            if (![h, s, l].some(Number.isNaN)) {
                return hslToHex(h, s, l);
            }
        }
    }

    return null;
}

function expandHex(value: string): string {
    const hex = value.replace("#", "");
    if (hex.length === 3) {
        return `#${hex.split("").map((c) => c + c).join("")}`.toUpperCase();
    }
    if (hex.length === 4) {
        return `#${hex.split("").slice(0, 3).map((c) => c + c).join("")}`.toUpperCase();
    }
    if (hex.length === 6) {
        return `#${hex.toUpperCase()}`;
    }
    if (hex.length === 8) {
        return `#${hex.substring(0, 6).toUpperCase()}`;
    }
    return value.toUpperCase();
}

function createPalette(baseHex: string) {
    const { h, s, l } = hexToHsl(baseHex); // s,l ∈ [0,1]

    // normalize toward vivid + mid-lightness
    const sN = clampNumber(s, 0.25, 0.8);
    const lN = clampNumber(l, 0.32, 0.68);

    // analogous variation for richer set
    const hSecondary = (h + 12) % 360; // +12°
    const hHighlight = (h + 340) % 360; // -20°

    const primary = hslToHex(h, sN * 100, lN * 100);

    const secondary = hslToHex(
        hSecondary,
        clampNumber(sN * 100 - 8, 18, 78),
        clampNumber((lN - 0.10) * 100, 22, 62)
    );

    const highlight = hslToHex(
        hHighlight,
        clampNumber(sN * 100 + 10, 28, 88),
        clampNumber((lN + 0.14) * 100, 40, 86)
    );

    // foreground with contrast guard
    let foreground = getContrastColor(primary);
    if (contrastRatio(primary, foreground) < 4.0) {
        foreground = foreground === "#F8FAFC" ? "#0F172A" : "#F8FAFC";
    }

    const muted = blendHex(foreground, primary, 0.45);

    return { primary, secondary, highlight, foreground, muted };
}

function scoreHex(hex: string) {
    const { s, l } = hexToHsl(hex); // s,l ∈ [0,1]
    return s * (1 - Math.abs(l - 0.5)); // vivid + mid-lightness
}

/* ------------------------------ Color Math -------------------------------- */

function hexToHsl(hex: string) {
    const { r, g, b } = hexToRgb(hex);
    return rgbToHsl(r, g, b);
}

function hexToRgb(hex: string) {
    const sanitized = expandHex(hex).replace("#", "");
    const bigint = parseInt(sanitized, 16);
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255,
    };
}

function rgbToHex(r: number, g: number, b: number) {
    return `#${[r, g, b].map((v) => clamp(v, 0, 255).toString(16).padStart(2, "0")).join("").toUpperCase()}`;
}

function rgbToHsl(r: number, g: number, b: number) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }

    return { h: h * 360, s, l };
}

function hslToHex(h: number, s: number, l: number) {
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;

    let r = 0, g = 0, b = 0;
    if (0 <= h && h < 60) { r = c; g = x; b = 0; }
    else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
    else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
    else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
    else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
    else if (300 <= h && h < 360) { r = c; g = 0; b = x; }

    return rgbToHex(Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255));
}

function getContrastColor(hex: string) {
    const { r, g, b } = hexToRgb(hex);
    const luminance = getRelativeLuminance(r / 255, g / 255, b / 255);
    return luminance > 0.55 ? "#0F172A" : "#F8FAFC";
}

function blendHex(foreground: string, background: string, alpha: number) {
    const fg = hexToRgb(foreground);
    const bg = hexToRgb(background);
    const blend = (fgV: number, bgV: number) => Math.round(fgV * alpha + bgV * (1 - alpha));
    return rgbToHex(blend(fg.r, bg.r), blend(fg.g, bg.g), blend(fg.b, bg.b));
}

function getRelativeLuminance(r: number, g: number, b: number) {
    const lin = (v: number) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
    const R = lin(r), G = lin(g), B = lin(b);
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function contrastRatio(hex1: string, hex2: string) {
    const { r: r1, g: g1, b: b1 } = hexToRgb(hex1);
    const { r: r2, g: g2, b: b2 } = hexToRgb(hex2);
    const L1 = getRelativeLuminance(r1 / 255, g1 / 255, b1 / 255);
    const L2 = getRelativeLuminance(r2 / 255, g2 / 255, b2 / 255);
    const [a, b] = L1 > L2 ? [L1, L2] : [L2, L1];
    return (a + 0.05) / (b + 0.05);
}

/* ------------------------------- Misc Utils ------------------------------- */

function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}

function clampNumber(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}

function getFirstTruthy<T>(values: (T | null | undefined | "")[]): T | null {
    for (const value of values) if (value) return value;
    return null;
}

function decodeHtmlEntities(text: string) {
    return text
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
}

function cleanText(value: string) {
    return value.replace(/\s+/g, " ").trim();
}
