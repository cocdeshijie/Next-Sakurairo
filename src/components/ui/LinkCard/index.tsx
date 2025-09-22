"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
import { cn } from "@/utils/cn";

/* ------------------------------- Types ------------------------------- */

type LinkCardSize = "small" | "medium" | "large";

interface LinkCardProps {
    url: string;
    className?: string;
    showPreviewImage?: boolean;
    size?: LinkCardSize;
}

interface LinkPreviewResponse {
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
    foreground: string; // provided but not used for text (we force light/dark text)
    mutedForeground: string; // provided but not used for text (we force light/dark text)
    colorSource: "image" | "favicon" | "theme" | "manifest" | "fallback";
}

const fetcher = async (endpoint: string) => {
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error("Failed to load link preview");
    return (await response.json()) as LinkPreviewResponse;
};

/* ------------------------------ Sizes ------------------------------ */

const SIZE_VARIANTS: Record<
    LinkCardSize,
    {
        wrapper: string;
        body: string;
        content: string;
        header: string;
        faviconWrapper: string;
        faviconImage: string;
        title: string;
        description: string;
        meta: string;
        badge: string;
        previewWrapper: string;
        previewAspect: string;
        previewSizes: string;
        initial: string;
        skeletonHeader: string;
        skeletonAvatar: string;
        skeletonStack: string;
        skeletonTitle: string;
        skeletonLineWidths: string[];
        skeletonPadding: string;
        showPreview: boolean;
    }
> = {
    small: {
        wrapper: "mx-auto w-full my-2 md:max-w-[20rem]",
        body: "gap-2.5 p-2.5 flex-col", // small stays stacked
        content: "gap-1.5",
        header: "items-center gap-2",
        faviconWrapper: "h-7 w-7",
        faviconImage: "h-4 w-4",
        title: "text-xs font-medium leading-tight",
        description: "text-[10px] m-0 leading-snug line-clamp-2",
        meta: "text-[10px] leading-tight",
        badge: "px-1.5 py-0.5 text-[10px]",
        previewWrapper: "",
        previewAspect: "",
        previewSizes: "",
        initial: "text-base",
        skeletonHeader: "items-center gap-2",
        skeletonAvatar: "h-7 w-7",
        skeletonStack: "space-y-1",
        skeletonTitle: "h-3 w-2/3",
        skeletonLineWidths: ["h-2.5 w-3/4"],
        skeletonPadding: "p-2.5",
        showPreview: false,
    },
    medium: {
        wrapper: "mx-auto w-full my-4 md:max-w-[26rem]",
        // force side-by-side at ALL breakpoints to keep preview on the right on mobile
        body: "gap-2.5 p-3 flex-row items-start",
        content: "gap-1.5",
        header: "items-start gap-2.5",
        faviconWrapper: "h-7 w-7",
        faviconImage: "h-4 w-4",
        title: "text-sm font-semibold leading-snug",
        description: "text-[11px] my-2 leading-snug line-clamp-2",
        meta: "text-[10px] leading-tight",
        badge: "px-2 py-0.5 text-[10px]",
        // fixed width even on mobile so it sits to the right
        previewWrapper: "w-24 shrink-0",
        previewAspect: "aspect-[4/3]",
        previewSizes: "(max-width: 768px) 96px, 96px",
        initial: "text-base",
        skeletonHeader: "items-start gap-2.5",
        skeletonAvatar: "h-7 w-7",
        skeletonStack: "space-y-1",
        skeletonTitle: "h-3 w-1/2",
        skeletonLineWidths: ["h-2.5 w-3/4", "h-2.5 w-2/3"],
        skeletonPadding: "p-3",
        showPreview: true,
    },
    large: {
        wrapper: "mx-auto w-full my-6 md:max-w-[36rem]",
        // force side-by-side at ALL breakpoints to keep preview on the right on mobile
        body: "gap-3 p-3.5 flex-row items-start",
        content: "gap-2",
        header: "items-start gap-3",
        faviconWrapper: "h-8 w-8",
        faviconImage: "h-5 w-5",
        title: "text-base font-semibold leading-snug",
        description: "text-sm my-4 leading-snug line-clamp-4",
        meta: "text-[11px] leading-tight",
        badge: "px-2.5 py-0.5 text-xs",
        // a bit wider, but still fixed on mobile to remain on the right
        previewWrapper: "w-36 shrink-0 sm:w-48",
        previewAspect: "aspect-[4/3]",
        previewSizes: "(max-width: 640px) 144px, (max-width: 768px) 192px, 192px",
        initial: "text-lg",
        skeletonHeader: "items-start gap-3",
        skeletonAvatar: "h-8 w-8",
        skeletonStack: "space-y-1.5",
        skeletonTitle: "h-3.5 w-2/3",
        skeletonLineWidths: ["h-3 w-5/6", "h-3 w-2/3"],
        skeletonPadding: "p-3.5",
        showPreview: true,
    },
};

/* ----------------------------- Component ----------------------------- */

const LinkCard = ({
                      url,
                      className,
                      showPreviewImage = true,
                      size = "medium",
                  }: LinkCardProps) => {
    const sizeStyles = SIZE_VARIANTS[size];
    const { data, error, isLoading } = useSWR<LinkPreviewResponse>(
        url ? `/api/link-preview?url=${encodeURIComponent(url)}` : null,
        fetcher,
        { revalidateOnFocus: false, shouldRetryOnError: false }
    );

    const safeUrl = data?.finalUrl ?? url;
    const domain = data?.domain ?? getHostname(url);

    // Only pass brand colors down as CSS vars; text color comes from theme (white in dark, black in light).
    const colorVars: CSSProperties | undefined = data
        ? ({
            "--lc-a": data.accent,
            "--lc-b": data.accentSecondary,
            "--lc-c": data.accentHighlight,
        } as CSSProperties)
        : undefined;

    if (isLoading || (!data && !error)) {
        return (
            <div
                className={cn(
                    "relative overflow-hidden rounded-2xl border border-theme-300/50 bg-theme-50",
                    "shadow-[0_18px_36px_-28px_rgba(15,23,42,0.45)]",
                    "dark:border-theme-700/50 dark:bg-theme-950",
                    sizeStyles.wrapper,
                    sizeStyles.skeletonPadding,
                    className
                )}
            >
                <div className={cn("flex", sizeStyles.skeletonHeader)}>
                    <div
                        className={cn(
                            "rounded-xl bg-white/15 dark:bg-white/10 animate-pulse",
                            sizeStyles.skeletonAvatar
                        )}
                    />
                    <div className={cn("flex-1", sizeStyles.skeletonStack)}>
                        <div
                            className={cn(
                                "rounded bg-white/20 dark:bg-white/10 animate-pulse",
                                sizeStyles.skeletonTitle
                            )}
                        />
                        {sizeStyles.skeletonLineWidths.map((line, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "rounded bg-white/15 dark:bg-white/5 animate-pulse",
                                    line
                                )}
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div
                className={cn(
                    "relative overflow-hidden rounded-2xl border border-theme-300/50 bg-theme-50 text-sm text-theme-900",
                    "shadow-[0_18px_36px_-28px_rgba(15,23,42,0.35)]",
                    "dark:border-theme-700/50 dark:bg-theme-950 dark:text-theme-100",
                    sizeStyles.wrapper,
                    sizeStyles.skeletonPadding,
                    className
                )}
            >
                Unable to load preview for {domain}.
            </div>
        );
    }

    const previewImage =
        showPreviewImage && sizeStyles.showPreview ? data.image : null;

    return (
        <Link
            href={safeUrl}
            target="_blank"
            rel="noopener noreferrer"
            prefetch={false}
            style={colorVars}
            className={cn(
                // Frame: glassy, light in light mode, darker in dark; crisp edges, no blur fuzziness
                "group relative block overflow-hidden rounded-2xl border border-theme-300/50 bg-theme-50",
                "shadow-[0_20px_44px_-26px_rgba(15,23,42,0.45)]",
                "dark:border-theme-700/50 dark:bg-theme-950",
                "text-left transition-transform duration-200 hover:-translate-y-0.5",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-theme-100/70 focus-visible:ring-offset-2",
                "focus-visible:ring-offset-theme-100 dark:focus-visible:ring-offset-theme-900",
                "text-theme-950 dark:text-theme-50", // force text: black in light, white in dark
                sizeStyles.wrapper,
                className
            )}
        >
            {/* Soft brand tint (low opacity) so it never overpowers */}
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    backgroundImage:
                        "linear-gradient(135deg, var(--lc-a, #CBD5F5) 0%, var(--lc-b, #B7C6EE) 55%, var(--lc-c, #E0E8FB) 100%)",
                    opacity: 0.5,
                }}
            />
            {/* Gentle specular highlight for glass feel, no mix-blend to avoid fuzz */}
            <div
                className={cn(
                    "pointer-events-none absolute inset-0 bg-gradient-to-br",
                    "from-theme-100/25 via-theme-500/10 to-transparent opacity-20 dark:from-theme-900/10 dark:via-theme-900/5"
                )}
            />

            {/* Body: always side-by-side for medium/large so preview stays on the right even on mobile */}
            <div className={cn("relative z-10 flex", sizeStyles.body)}>
                {/* TEXT CONTENT (flex-1 so the preview stays narrow on the right) */}
                <div className={cn("flex flex-1 flex-col", sizeStyles.content)}>
                    <div className={cn("flex", sizeStyles.header)}>
                        <div
                            className={cn(
                                "flex shrink-0 items-center justify-center rounded-xl border border-theme-200/50 bg-theme-50/50",
                                "dark:border-theme-800/50 dark:bg-theme-950/50",
                                sizeStyles.faviconWrapper
                            )}
                        >
                            {data.favicon ? (
                                <Image
                                    src={data.favicon}
                                    alt={`${domain} favicon`}
                                    width={32}
                                    height={32}
                                    className={cn("rounded", sizeStyles.faviconImage)}
                                />
                            ) : (
                                <span className={cn("font-semibold", sizeStyles.initial)}>
                  {domain.charAt(0).toUpperCase()}
                </span>
                            )}
                        </div>

                        <div className="flex flex-1 flex-col">
                            <div className="space-y-0.5">
                                <p
                                    title={safeUrl}
                                    className="text-[10px] font-semibold my-1 uppercase tracking-[0.08em] text-theme-800 dark:text-theme-200"
                                >
                                    {domain}
                                </p>
                                <h3 className={cn("font-semibold leading-snug", sizeStyles.title)}>
                                    {data.title}
                                </h3>
                            </div>

                            {data.description && (
                                <p
                                    className={cn(
                                        "text-theme-800 dark:text-theme-200",
                                        sizeStyles.description
                                    )}
                                >
                                    {data.description}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* PREVIEW IMAGE (fixed width, always on the right) */}
                {previewImage && (
                    <div
                        className={cn(
                            "relative overflow-hidden rounded-xl border border-theme-100/25 bg-theme-800/20",
                            "shadow-[0_14px_25px_-25px_rgba(15,23,42,0.55)] self-center",
                            "dark:border-theme-100/20 dark:bg-theme-900/40",
                            sizeStyles.previewWrapper
                        )}
                    >
                        <div className={cn("relative w-full", sizeStyles.previewAspect)}>
                            <Image
                                src={previewImage}
                                alt={data.title}
                                fill
                                sizes={sizeStyles.previewSizes}
                                className="object-cover"
                                style={{ objectFit: "cover", margin: 0 }}
                            />
                        </div>
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-theme-900/45 via-theme-800/15 to-transparent dark:from-theme-900/55" />
                    </div>
                )}
            </div>
        </Link>
    );
};

/* ----------------------------- Utilities ----------------------------- */

function getHostname(raw: string) {
    try {
        return new URL(raw).hostname;
    } catch {
        return raw;
    }
}

export default LinkCard;
