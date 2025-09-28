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
                        borderRadius: 46,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            borderRadius: 46,
                            backgroundImage: "linear-gradient(135deg, rgba(255,255,255,0.72), rgba(255,255,255,0.12))",
                            border: "1px solid rgba(255,255,255,0.55)",
                            boxShadow: "0 50px 120px rgba(15,23,42,0.32), inset 0 1px 0 rgba(255,255,255,0.75), inset 0 -28px 56px rgba(15,23,42,0.22)",
                        }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            inset: "24px 28px 32px",
                            borderRadius: 34,
                            backgroundImage: "linear-gradient(120deg, rgba(255,255,255,0.45), rgba(255,255,255,0.05))",
                            border: "1px solid rgba(255,255,255,0.3)",
                            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -20px 45px rgba(15,23,42,0.18)",
                            opacity: 0.92,
                        }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            borderRadius: 46,
                            backgroundImage: "radial-gradient(120% 120% at 18% 12%, rgba(255,255,255,0.7), transparent 62%), radial-gradient(120% 120% at 82% 88%, rgba(148,163,184,0.35), transparent 58%)",
                            mixBlendMode: "screen",
                            opacity: 0.55,
                        }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            top: 36,
                            left: 120,
                            right: 120,
                            height: 10,
                            borderRadius: 999,
                            backgroundImage: "linear-gradient(90deg, rgba(255,255,255,0.8), rgba(255,255,255,0.2))",
                            opacity: 0.85,
                        }}
                    />
                    <div
                        style={{
                            position: "relative",
                            display: "flex",
                            flexDirection: "column",
                            gap: 24,
                            textAlign: isCentered ? "center" : "left",
                            alignItems: isCentered ? "center" : "flex-start",
                            padding: "72px 96px",
                            width: "100%",
                            maxWidth: isCentered ? 820 : 920,
                        }}
                    >
                        <span
                            style={{
                                fontSize: isCentered ? 96 : 78,
                                fontWeight: 700,
                                lineHeight: 1.04,
                                color: "#0b1120",
                                textShadow: "0 24px 55px rgba(15,23,42,0.38), 0 10px 24px rgba(255,255,255,0.25)",
                                letterSpacing: "-0.5px",
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
                                    color: "rgba(15,23,42,0.7)",
                                    textShadow: "0 16px 36px rgba(15,23,42,0.25)",
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
