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

function hexToRgba(hex: string, alpha: number): string {
    const { r, g, b } = hexToRgb(hex);
    return `rgba(${r},${g},${b},${alpha})`;
}

export function createOgImage({ title, subtitle, align = "start" }: OgImageOptions) {
    const baseColor = config.site_info?.theme_color ?? DEFAULT_THEME_COLOR;
    const accentLight = lighten(baseColor, 0.35);
    const accentDark = darken(baseColor, 0.25);
    const accentHighlight = lighten(baseColor, 0.6);
    const accentShadow = darken(baseColor, 0.45);
    const accentMid = lighten(baseColor, 0.1);
    const accentGlassTint = lighten(baseColor, 0.55);
    const accentGlassShadow = darken(baseColor, 0.32);

    const isCentered = align === "center";

    const trimmedTitle = title.trim();
    const trimmedSubtitle = subtitle?.trim();

    const normalisedTitleLength = Math.max(
        1,
        Math.max(
            ...trimmedTitle
                .split(/\s+/)
                .filter(Boolean)
                .map((word) => word.length),
            trimmedTitle.length
        )
    );

    const subtitleLength = trimmedSubtitle?.length ?? 0;
    const longestLine = Math.max(normalisedTitleLength, Math.floor(subtitleLength * 0.85));

    const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

    const baseWidth = isCentered ? 560 : 640;
    const widthGrowFactor = isCentered ? 24 : 22;
    const maxWidth = isCentered ? 1020 : 1120;
    const cardWidth = Math.round(clamp(baseWidth + longestLine * widthGrowFactor, baseWidth, maxWidth));

    const baseTitleSize = isCentered ? 112 : 92;
    const minTitleSize = isCentered ? 56 : 52;
    const titlePenaltyStart = isCentered ? 18 : 24;
    const titlePenaltySlope = isCentered ? 1.45 : 1.15;
    const titleSize = Math.round(
        clamp(
            baseTitleSize - Math.max(0, trimmedTitle.length - titlePenaltyStart) * titlePenaltySlope,
            minTitleSize,
            baseTitleSize
        )
    );

    const baseSubtitleSize = isCentered ? 44 : 36;
    const minSubtitleSize = 26;
    const subtitlePenaltyStart = 32;
    const subtitlePenaltySlope = 0.55;
    const subtitleSize = Math.round(
        clamp(
            baseSubtitleSize - Math.max(0, subtitleLength - subtitlePenaltyStart) * subtitlePenaltySlope,
            minSubtitleSize,
            baseSubtitleSize
        )
    );

    const horizontalPadding = Math.round(
        clamp(cardWidth * (isCentered ? 0.16 : 0.18), isCentered ? 88 : 96, isCentered ? 170 : 188)
    );
    const verticalPadding = Math.round(clamp(titleSize * 0.92 + 64 + (subtitle ? subtitleSize * 0.45 : 0), 82, 168));

    const estimatedTitleHeight = titleSize * (isCentered ? 1.18 : 1.12);
    const estimatedSubtitleHeight = subtitle ? subtitleSize * 1.35 : 0;
    const baseHeight = verticalPadding * 2 + estimatedTitleHeight + estimatedSubtitleHeight;
    const cardHeight = Math.round(clamp(baseHeight, 320, 560));

    const contentGap = subtitle ? Math.round(clamp(titleSize * 0.22, 18, 42)) : 0;

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
                        display: "flex",
                        flexDirection: "column",
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
                        position: "relative",
                        borderRadius: 52,
                        width: cardWidth,
                        minHeight: cardHeight,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: `${verticalPadding}px ${horizontalPadding}px`,
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            borderRadius: 52,
                            backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.82), rgba(255,255,255,0.18))`,
                            border: "1.2px solid rgba(255,255,255,0.62)",
                            boxShadow: `0 68px 160px ${hexToRgba(accentShadow, 0.38)}, 0 32px 80px ${hexToRgba(accentShadow, 0.28)}, inset 0 1px 0 rgba(255,255,255,0.82), inset 0 -46px 88px ${hexToRgba(accentShadow, 0.32)}`,
                        }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            inset: 18,
                            borderRadius: 44,
                            backgroundImage: `linear-gradient(125deg, rgba(255,255,255,0.32), rgba(255,255,255,0.08)), linear-gradient(155deg, ${hexToRgba(accentGlassTint, 0.28)}, ${hexToRgba(accentGlassShadow, 0.36)})`,
                            border: "1px solid rgba(255,255,255,0.32)",
                            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.58), inset 0 -32px 72px ${hexToRgba(accentShadow, 0.38)}`,
                            backdropFilter: "blur(18px)",
                            opacity: 0.95,
                        }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            borderRadius: 52,
                            backgroundImage: `radial-gradient(115% 140% at 20% 15%, rgba(255,255,255,0.9), transparent 58%), radial-gradient(140% 160% at 88% 92%, ${hexToRgba(accentDark, 0.35)}, transparent 64%)`,
                            mixBlendMode: "screen",
                            opacity: 0.7,
                        }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            top: 32,
                            left: Math.max(52, horizontalPadding - 24),
                            right: Math.max(52, horizontalPadding - 24),
                            height: Math.round(clamp(titleSize * 1.1, 120, 200)),
                            borderRadius: 480,
                            backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.82), ${hexToRgba(accentLight, 0.16)})`,
                            opacity: 0.6,
                            filter: "blur(30px)",
                        }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            bottom: 42,
                            left: Math.max(42, horizontalPadding - 36),
                            right: Math.max(42, horizontalPadding - 36),
                            height: Math.round(clamp(cardHeight * 0.18, 90, 160)),
                            borderRadius: 40,
                            backgroundImage: `linear-gradient(180deg, ${hexToRgba(accentShadow, 0.58)}, rgba(15,23,42,0))`,
                            opacity: 0.45,
                            filter: "blur(30px)",
                        }}
                    />
                    <div
                        style={{
                            position: "relative",
                            display: "flex",
                            flexDirection: "column",
                            gap: contentGap,
                            textAlign: isCentered ? "center" : "left",
                            alignItems: isCentered ? "center" : "flex-start",
                            width: "100%",
                            maxWidth: cardWidth - horizontalPadding * 2,
                        }}
                    >
                        <span
                            style={{
                                fontSize: titleSize,
                                fontWeight: 700,
                                lineHeight: 1.05,
                                color: "#0b1120",
                                textShadow: `0 28px 60px ${hexToRgba(accentShadow, 0.42)}, 0 12px 28px rgba(255,255,255,0.3)`,
                                letterSpacing: "-0.6px",
                                wordBreak: "break-word",
                                hyphens: "auto",
                            }}
                        >
                            {title}
                        </span>
                        {subtitle ? (
                            <span
                                style={{
                                    fontSize: subtitleSize,
                                    fontWeight: 500,
                                    color: "rgba(15,23,42,0.72)",
                                    textShadow: `0 20px 42px ${hexToRgba(accentShadow, 0.32)}`,
                                    lineHeight: 1.3,
                                    maxWidth: cardWidth - horizontalPadding * 2,
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
