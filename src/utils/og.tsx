import { ImageResponse } from "next/og";
import { config } from "#site/content";
import { generateColorPalette } from "@/utils/themeColor";

export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;
export const OG_IMAGE_CONTENT_TYPE = "image/png" as const;

const palette = generateColorPalette(
    config.site_info.theme_color,
    config.site_info.theme_color_hue_shift
);

function hexToRgb(hex: string) {
    const stripped = hex.replace("#", "");
    const normalized =
        stripped.length === 3
            ? stripped
                  .split("")
                  .map(char => char + char)
                  .join("")
            : stripped;
    const truncated = normalized.slice(0, 6);
    const bigint = parseInt(truncated, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
}

function rgba(hex: string, alpha: number) {
    const { r, g, b } = hexToRgb(hex);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

type CreateOgImageOptions = {
    title: string;
    subtitle?: string;
};

export function createOgImage({ title, subtitle }: CreateOgImageOptions) {
    const safeTitle = title || config.site_info.title;
    const showSubtitle = Boolean(subtitle);

    const gradient = `linear-gradient(135deg, ${palette[700]}, ${palette[400]})`;
    const backdrop = rgba(palette[900], 0.55);
    const accent = rgba(palette[100], 0.45);

    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundImage: gradient,
                    position: "relative",
                    fontFamily: '"Inter", "Noto Sans", "Segoe UI", sans-serif',
                    color: "#f8fafc",
                    letterSpacing: "0.02em",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background: `radial-gradient(circle at 20% 20%, ${rgba(palette[200], 0.35)}, transparent 60%)`,
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background: `radial-gradient(circle at 80% 30%, ${rgba(palette[500], 0.25)}, transparent 55%)`,
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        inset: 48,
                        borderRadius: 48,
                        backgroundColor: backdrop,
                        boxShadow: `0 40px 120px ${rgba(palette[900], 0.35)}`,
                        border: `2px solid ${accent}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "72px 64px",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            textAlign: "center",
                            width: "100%",
                            gap: showSubtitle ? 36 : 24,
                        }}
                    >
                        <div
                            style={{
                                fontSize: showSubtitle ? 88 : 104,
                                fontWeight: 700,
                                lineHeight: 1.05,
                                textShadow: `0 12px 32px ${rgba("#000000", 0.35)}`,
                                maxWidth: "90%",
                            }}
                        >
                            {safeTitle}
                        </div>
                        {showSubtitle ? (
                            <div
                                style={{
                                    fontSize: 36,
                                    fontWeight: 500,
                                    opacity: 0.85,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.16em",
                                }}
                            >
                                {subtitle}
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        ),
        {
            ...OG_IMAGE_SIZE,
        }
    );
}
