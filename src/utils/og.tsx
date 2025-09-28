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
    const accentHighlight = lighten(baseColor, 0.6);
    const accentShadow = darken(baseColor, 0.45);
    const accentMid = lighten(baseColor, 0.1);

    const isCentered = align === "center";

    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    position: "relative",
                    backgroundImage: `radial-gradient(circle at 18% 24%, ${accentHighlight}, ${accentMid} 42%, ${accentDark} 92%)`,
                    color: "#0f172a",
                    fontFamily: "'Inter', 'Plus Jakarta Sans', 'Noto Sans JP', sans-serif",
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        overflow: "hidden",
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            top: -220,
                            left: -160,
                            width: 620,
                            height: 620,
                            backgroundImage: `radial-gradient(circle at 30% 30%, ${accentHighlight}, rgba(255,255,255,0) 65%)`,
                            opacity: 0.85,
                            filter: "blur(18px)",
                            transform: "rotate(-8deg)",
                        }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            bottom: -260,
                            right: -120,
                            width: 720,
                            height: 720,
                            backgroundImage: `radial-gradient(circle at 72% 68%, ${accentShadow}, rgba(15,23,42,0) 60%)`,
                            opacity: 0.65,
                            filter: "blur(24px)",
                            transform: "rotate(12deg)",
                        }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            top: -140,
                            right: -280,
                            width: 540,
                            height: 540,
                            backgroundImage: `linear-gradient(140deg, rgba(255,255,255,0.32), rgba(255,255,255,0) 60%)`,
                            filter: "blur(26px)",
                            opacity: 0.8,
                        }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            bottom: 120,
                            left: -260,
                            width: 520,
                            height: 520,
                            backgroundImage: `linear-gradient(120deg, rgba(255,255,255,0.22), rgba(255,255,255,0))`,
                            filter: "blur(32px)",
                            opacity: 0.75,
                            transform: "rotate(-18deg)",
                        }}
                    />
                </div>
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
                            backgroundImage: "linear-gradient(135deg, rgba(255,255,255,0.82), rgba(255,255,255,0.18))",
                            border: "1px solid rgba(255,255,255,0.58)",
                            boxShadow: "0 60px 140px rgba(15,23,42,0.34), inset 0 1px 0 rgba(255,255,255,0.75), inset 0 -36px 60px rgba(15,23,42,0.2)",
                        }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            inset: "32px 36px 40px",
                            borderRadius: 34,
                            backgroundImage: "linear-gradient(120deg, rgba(255,255,255,0.48), rgba(255,255,255,0.05))",
                            border: "1px solid rgba(255,255,255,0.32)",
                            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -24px 55px rgba(15,23,42,0.18)",
                            opacity: 0.95,
                        }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            borderRadius: 46,
                            backgroundImage: `radial-gradient(120% 140% at 18% 12%, rgba(255,255,255,0.85), transparent 60%), radial-gradient(160% 140% at 88% 92%, rgba(148,163,184,0.45), transparent 62%)`,
                            mixBlendMode: "screen",
                            opacity: 0.6,
                        }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            top: 38,
                            left: 120,
                            right: 120,
                            height: 12,
                            borderRadius: 999,
                            backgroundImage: "linear-gradient(90deg, rgba(255,255,255,0.92), rgba(255,255,255,0.3))",
                            opacity: 0.88,
                            filter: "blur(0.6px)",
                        }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            bottom: 54,
                            left: 96,
                            right: 96,
                            height: 120,
                            borderRadius: 36,
                            backgroundImage: "linear-gradient(180deg, rgba(15,23,42,0.35), rgba(15,23,42,0))",
                            opacity: 0.38,
                            filter: "blur(28px)",
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
