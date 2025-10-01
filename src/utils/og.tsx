/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";
import { config } from "#site/content";
import { generateColorPalette } from "./themeColor";

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

export type OgImageAlign = "center" | "start";

export type OgImageOptions = {
    title: string;
    subtitle?: string;
    align?: OgImageAlign;
    assetBase?: string;
};

const OG_IMAGE_ROUTE = "/og" as const;

const FONT_FAMILY = "'Inter', 'Plus Jakarta Sans', 'Noto Sans JP', 'Noto Sans', sans-serif";

const ENVIRONMENT_BASE = (() => {
    const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
    if (explicit) {
        return explicit;
    }

    const vercel = process.env.VERCEL_URL?.trim();
    if (vercel) {
        const hasProtocol = /^https?:\/\//i.test(vercel);
        return hasProtocol ? vercel : `https://${vercel}`;
    }

    return undefined;
})();

function normalizeLocalhostProtocol(url: URL): URL {
    if (url.protocol === "https:" && /^(localhost|127\.|0\.0\.0\.0)/.test(url.hostname)) {
        url.protocol = "http:";
    }

    return url;
}

function tryResolve(path: string, base?: string): string | undefined {
    if (!base) {
        return undefined;
    }

    try {
        const resolved = normalizeLocalhostProtocol(new URL(path, base));
        return resolved.toString();
    } catch (error) {
        console.warn("Failed to resolve OG asset URL", { path, base, error });
        return undefined;
    }
}

function resolveAssetUrl(path?: string, base?: string): string | undefined {
    if (!path) {
        return undefined;
    }

    if (/^(data:|https?:)/i.test(path)) {
        return path;
    }

    const resolvedFromRequest = tryResolve(path, base);
    if (resolvedFromRequest) {
        return resolvedFromRequest;
    }

    const resolvedFromEnv = tryResolve(path, ENVIRONMENT_BASE);
    if (resolvedFromEnv) {
        return resolvedFromEnv;
    }

    const domain = config.site_info.domain?.trim();
    if (domain) {
        const withProtocol = domain.startsWith("http://") || domain.startsWith("https://") ? domain : `https://${domain}`;
        const resolvedFromDomain = tryResolve(path, withProtocol);
        if (resolvedFromDomain) {
            return resolvedFromDomain;
        }
    }

    return undefined;
}

function longestWordLength(value: string): number {
    const segments = value
        .split(/\s+/)
        .map((segment) => segment.trim())
        .filter(Boolean);

    if (!segments.length) {
        return 0;
    }

    return segments.reduce((max, segment) => Math.max(max, segment.length), 0);
}

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export function createOgImage({ title, subtitle, align = "start", assetBase }: OgImageOptions) {
    const trimmedTitle = title.trim();
    const trimmedSubtitle = subtitle?.trim();
    const isCentered = align === "center";

    const maxTitleSegment = Math.max(longestWordLength(trimmedTitle), trimmedTitle.length);
    const subtitleLength = trimmedSubtitle?.length ?? 0;
    const longestLine = Math.max(maxTitleSegment, Math.floor(subtitleLength * 0.8));

    const baseWidth = isCentered ? 640 : 760;
    const widthFactor = isCentered ? 20 : 18;
    const maxWidth = isCentered ? 1040 : 1120;
    const cardWidth = Math.round(clamp(baseWidth + longestLine * widthFactor, baseWidth, maxWidth));

    const baseTitleSize = isCentered ? 116 : 96;
    const minTitleSize = isCentered ? 56 : 52;
    const penaltyStart = isCentered ? 20 : 28;
    const penaltySlope = isCentered ? 1.6 : 1.25;
    const titleSize = Math.round(
        clamp(baseTitleSize - Math.max(0, trimmedTitle.length - penaltyStart) * penaltySlope, minTitleSize, baseTitleSize)
    );

    const baseSubtitleSize = isCentered ? 42 : 34;
    const minSubtitleSize = 24;
    const subtitlePenaltyStart = 36;
    const subtitlePenaltySlope = 0.55;
    const subtitleSize = Math.round(
        clamp(
            baseSubtitleSize - Math.max(0, subtitleLength - subtitlePenaltyStart) * subtitlePenaltySlope,
            minSubtitleSize,
            baseSubtitleSize
        )
    );

    const horizontalPadding = Math.round(clamp(cardWidth * (isCentered ? 0.18 : 0.2), 92, 208));
    const verticalPadding = Math.round(clamp(titleSize * 0.85 + 72 + (subtitle ? subtitleSize * 0.5 : 0), 96, 188));

    const estimatedTitleHeight = titleSize * (isCentered ? 1.12 : 1.08);
    const estimatedSubtitleHeight = subtitle ? subtitleSize * 1.25 : 0;
    const cardHeight = Math.round(clamp(verticalPadding * 2 + estimatedTitleHeight + estimatedSubtitleHeight, 320, 520));

    const contentGap = subtitle ? Math.round(clamp(titleSize * 0.2, 18, 38)) : 0;

    const profileImagePath = config.site_info?.profile_image;
    const profileImageUrl = resolveAssetUrl(profileImagePath, assetBase);
    const palette = generateColorPalette(config.site_info.theme_color, config.site_info.theme_color_hue_shift ?? 0);
    const gradientBackground = `linear-gradient(140deg, ${palette[600]} 0%, ${palette[400]} 48%, ${palette[500]} 100%)`;
    const domain = config.site_info.domain?.trim();
    const domainLabel = domain ? domain.toUpperCase() : undefined;

    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundImage: gradientBackground,
                    backgroundColor: palette[500],
                    color: "#0f172a",
                    fontFamily: FONT_FAMILY,
                    position: "relative",
                    letterSpacing: "-0.01em",
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background: "radial-gradient(80% 120% at 20% 20%, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0) 68%)",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background: "radial-gradient(55% 70% at 82% 85%, rgba(15,23,42,0.2) 0%, rgba(15,23,42,0) 70%)",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        inset: 72,
                        borderRadius: 48,
                        border: "1.6px solid rgba(255,255,255,0.55)",
                        background: "linear-gradient(150deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.08) 100%)",
                        boxShadow: "0 48px 120px rgba(15,23,42,0.24)",
                    }}
                />
                <div
                    style={{
                        position: "relative",
                        width: cardWidth,
                        minHeight: cardHeight,
                        padding: `${verticalPadding}px ${horizontalPadding}px`,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: isCentered ? "center" : "flex-start",
                        justifyContent: "center",
                        gap: contentGap,
                        textAlign: isCentered ? "center" : "left",
                        color: "rgba(15,23,42,0.94)",
                    }}
                >
                    <span
                        style={{
                            fontSize: titleSize,
                            fontWeight: 700,
                            lineHeight: 1.05,
                            wordBreak: "break-word",
                        }}
                    >
                        {trimmedTitle}
                    </span>
                    {trimmedSubtitle ? (
                        <span
                            style={{
                                fontSize: subtitleSize,
                                fontWeight: 500,
                                color: "rgba(15,23,42,0.74)",
                                lineHeight: 1.3,
                                maxWidth: "100%",
                            }}
                        >
                            {trimmedSubtitle}
                        </span>
                    ) : null}
                </div>
                {profileImageUrl ? (
                    <img
                        src={profileImageUrl}
                        alt="Profile"
                        style={{
                            position: "absolute",
                            bottom: 32,
                            left: 36,
                            width: 72,
                            height: 72,
                            borderRadius: 20,
                            objectFit: "cover",
                            border: "1.2px solid rgba(255,255,255,0.6)",
                            background: "rgba(255,255,255,0.2)",
                            padding: 6,
                            boxShadow: "0 18px 36px rgba(15,23,42,0.16)",
                        }}
                    />
                ) : null}
                {domainLabel ? (
                    <div
                        style={{
                            position: "absolute",
                            bottom: 40,
                            right: 48,
                            padding: "10px 26px",
                            borderRadius: 999,
                            border: "1.4px solid rgba(255,255,255,0.5)",
                            background: "rgba(255,255,255,0.14)",
                            color: "rgba(15,23,42,0.8)",
                            fontSize: 22,
                            fontWeight: 600,
                            letterSpacing: "0.18em",
                            textTransform: "uppercase",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 18px 44px rgba(15,23,42,0.18)",
                        }}
                    >
                        {domainLabel}
                    </div>
                ) : null}
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
