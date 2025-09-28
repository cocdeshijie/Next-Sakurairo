import { ImageResponse } from "next/og";
import { config } from "#site/content";

const DEFAULT_THEME_COLOR = "#6366F1";

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

const white = { r: 255, g: 255, b: 255 } as const;
const black = { r: 0, g: 0, b: 0 } as const;

type RGB = { r: number; g: number; b: number };

export type OgImageAlign = "center" | "start";

export type OgImageOptions = {
    title: string;
    subtitle?: string;
    align?: OgImageAlign;
};

const OG_IMAGE_ROUTE = "/og" as const;

function normaliseHex(hex: string): string {
    const trimmed = hex.trim();
    if (/^#?[0-9a-fA-F]{3}$/.test(trimmed)) {
        const withoutHash = trimmed.replace(/^#/, "");
        const [r, g, b] = withoutHash.split("");
        return `#${r}${r}${g}${g}${b}${b}`;
    }

    if (/^#?[0-9a-fA-F]{6}$/.test(trimmed)) {
        return trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
    }

    return DEFAULT_THEME_COLOR;
}

function hexToRgb(hex: string): RGB {
    const normalised = normaliseHex(hex).replace("#", "");
    return {
        r: parseInt(normalised.slice(0, 2), 16),
        g: parseInt(normalised.slice(2, 4), 16),
        b: parseInt(normalised.slice(4, 6), 16),
    };
}

function rgbToHex({ r, g, b }: RGB): string {
    const clamp = (value: number) => Math.max(0, Math.min(255, Math.round(value)));
    return `#${clamp(r).toString(16).padStart(2, "0")}${clamp(g).toString(16).padStart(2, "0")}${clamp(b).toString(16).padStart(2, "0")}`;
}

function mix(base: RGB, target: RGB, amount: number): RGB {
    return {
        r: base.r + (target.r - base.r) * amount,
        g: base.g + (target.g - base.g) * amount,
        b: base.b + (target.b - base.b) * amount,
    };
}

function lighten(hex: string, amount: number): string {
    return rgbToHex(mix(hexToRgb(hex), white, amount));
}

function darken(hex: string, amount: number): string {
    return rgbToHex(mix(hexToRgb(hex), black, amount));
}

export function createOgImage({ title, subtitle, align = "start" }: OgImageOptions) {
    const baseColor = config.site_info?.theme_color ?? DEFAULT_THEME_COLOR;
    const accentLight = lighten(baseColor, 0.35);
    const accentDark = darken(baseColor, 0.25);

    const isCentered = align === "center";

    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    position: "relative",
                    backgroundImage: `linear-gradient(135deg, ${accentDark}, ${baseColor}, ${accentLight})`,
                    color: "#0f172a",
                    fontFamily: "'Inter', 'Plus Jakarta Sans', 'Noto Sans JP', sans-serif",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        inset: 48,
                        borderRadius: 40,
                        border: "4px solid rgba(255,255,255,0.25)",
                        backgroundColor: "rgba(255,255,255,0.82)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        padding: "72px 96px",
                        boxShadow: "0 30px 80px rgba(15,23,42,0.25)",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 24,
                            textAlign: isCentered ? "center" : "left",
                            alignItems: isCentered ? "center" : "flex-start",
                        }}
                    >
                        <span
                            style={{
                                fontSize: isCentered ? 96 : 78,
                                fontWeight: 700,
                                lineHeight: 1.05,
                                color: "#111827",
                                textShadow: "0 14px 30px rgba(148,163,184,0.45)",
                                maxWidth: isCentered ? 820 : 920,
                                wordBreak: "break-word",
                            }}
                        >
                            {title}
                        </span>
                        {subtitle ? (
                            <span
                                style={{
                                    fontSize: isCentered ? 40 : 34,
                                    fontWeight: 500,
                                    color: "rgba(30,41,59,0.75)",
                                    maxWidth: 880,
                                }}
                            >
                                {subtitle}
                            </span>
                        ) : null}
                    </div>
                </div>
            </div>
        ),
        {
            width: OG_WIDTH,
            height: OG_HEIGHT,
        }
    );
}

export const ogImageSize = { width: OG_WIDTH, height: OG_HEIGHT } as const;
export const ogImageContentType = "image/png" as const;

export function getOgImageUrl({ title, subtitle, align }: OgImageOptions): string {
    const params = new URLSearchParams({ title });

    if (subtitle) {
        params.set("subtitle", subtitle);
    }

    if (align === "center") {
        params.set("align", align);
    }

    const query = params.toString();
    return query ? `${OG_IMAGE_ROUTE}?${query}` : OG_IMAGE_ROUTE;
}
