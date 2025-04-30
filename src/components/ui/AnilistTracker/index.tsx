"use client";

/**
 *  AnilistTracker
 *  ---------------
 *  MDX-ready tracker for an AniList user.
 *  – Jotai only (atomFamily from jotai/utils) — no useState.
 *  – Cards open the anime’s AniList page in a new tab.
 *  – Skeletons while loading, mini-TOC on top, centred layout.
 *  – Each status is an <h3> so it nests correctly in your page-level TOC.
 *  – Wrapped in `not-prose` so Tailwind-Typography styles don’t leak in.
 */

import React, { useEffect } from "react";
import Image from "next/image";
import { atom, useAtom } from "jotai";
import { atomFamily } from "jotai/utils";
import { cn } from "@/utils/cn";
import { H3 } from "@/components/ui/MDX/MDXHeading";
import { useScroll } from "@/providers/scroll-provider";

/* ------------------------------------------------------------------ */
/* 🔖 Types                                                            */
/* ------------------------------------------------------------------ */

interface AnilistTrackerProps {
    username: string;
}

interface Media {
    id: number;
    title: { romaji?: string | null; english?: string | null };
    coverImage: { large: string };
}

type ListsByStatus = Record<string, Media[]>;

interface TrackerState {
    loading: boolean;
    data: ListsByStatus | null;
    error: string | null;
}

/* ------------------------------------------------------------------ */
/* 🧪 Atoms                                                             */
/* ------------------------------------------------------------------ */

const trackerAtomFamily = atomFamily((username: string) =>
    atom<TrackerState>({
        loading: true,
        data: null,
        error: null,
    }),
);

/* ------------------------------------------------------------------ */
/* 🛠 Helpers                                                           */
/* ------------------------------------------------------------------ */

const slugify = (str: string) =>
    str
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

const SkeletonCard: React.FC = () => (
    <div
        className={cn(
            "animate-pulse rounded-lg aspect-[3/4] w-full",
            "bg-theme-200/25 dark:bg-theme-800/25",
            "border border-theme-200/30 dark:border-theme-800/30",
        )}
    />
);

/* ─────────────────────────────────────────────────────────── Card ── */

const AnimeCard: React.FC<{ media: Media }> = ({ media }) => (
    <a
        href={`https://anilist.co/anime/${media.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
            "group relative overflow-hidden rounded-lg aspect-[3/4]",
            "bg-theme-100/50 dark:bg-theme-900/50",
            "border border-theme-200/25 dark:border-theme-700/25",
            "shadow shadow-theme-500/10 hover:shadow-theme-500/20",
            "transition-all duration-300",
        )}
    >
        {/* Poster */}
        <Image
            src={media.coverImage.large}
            alt={media.title.english ?? media.title.romaji ?? "cover"}
            fill
            sizes="(max-width: 768px) 50vw, 20vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Gradient + title */}
        <div
            className={cn(
                "absolute bottom-0 left-0 right-0 p-2",
                "bg-gradient-to-t",
                "from-theme-50/95 via-theme-900/50 to-transparent",
                "dark:from-theme-950/95 dark:via-theme-950/50"
            )}
        >
            <p
                className={cn(
                    "text-xs font-medium line-clamp-2 drop-shadow-sm",
                    "text-theme-950 dark:text-theme-50",
                )}
            >
                {media.title.english ?? media.title.romaji}
            </p>
        </div>
    </a>
);

/* ------------------------------------------------------------------ */
/* 🎬 Component                                                         */
/* ------------------------------------------------------------------ */

export function AnilistTracker({ username }: AnilistTrackerProps) {
    const [state, setState] = useAtom(trackerAtomFamily(username));
    const { handleScrollTo } = useScroll();

    /* -------------------------------------------------------------- */
    /* 🔄 Fetch                                                       */
    /* -------------------------------------------------------------- */
    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                setState((prev): TrackerState => ({ ...prev, loading: true, error: null }));

                const query = `
          query ($userName: String) {
            MediaListCollection(userName: $userName, type: ANIME) {
              lists {
                name
                entries {
                  media {
                    id
                    title { romaji english }
                    coverImage { large }
                  }
                }
              }
            }
          }`;

                const res = await fetch("https://graphql.anilist.co", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Accept: "application/json" },
                    body: JSON.stringify({ query, variables: { userName: username } }),
                });

                if (!res.ok) throw new Error(`Network error: ${res.status}`);
                const json = await res.json();

                const transformed: ListsByStatus = {};
                json.data?.MediaListCollection?.lists?.forEach((list: any) => {
                    transformed[list.name] = list.entries.map((e: any) => e.media as Media);
                });

                if (!cancelled) setState({ loading: false, data: transformed, error: null });
            } catch (err: unknown) {
                if (!cancelled)
                    setState({
                        loading: false,
                        data: null,
                        error: (err as Error).message ?? "Unknown error",
                    });
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [username, setState]);

    /* -------------------------------------------------------------- */
    /* 🚦 Error                                                       */
    /* -------------------------------------------------------------- */

    if (state.error)
        return (
            <p className="not-prose text-red-600 dark:text-red-400">
                Failed to load AniList data: {state.error}
            </p>
        );

    /* -------------------------------------------------------------- */
    /* 🗂 Data                                                         */
    /* -------------------------------------------------------------- */

    const placeholderStatuses = ["Watching", "Completed", "Planning"];
    const content: Record<string, (Media | null)[]> =
        state.loading || !state.data
            ? Object.fromEntries(
                placeholderStatuses.map((k) => [k, Array<null>(6).fill(null)]),
            )
            : state.data;

    const statusOrder = Object.keys(content);

    /* -------------------------------------------------------------- */
    /* 🖼 Render                                                       */
    /* -------------------------------------------------------------- */

    return (
        <div className="not-prose space-y-12 mx-auto max-w-5xl">
            {/* ─────────────── Mini-TOC */}
            <nav className="flex flex-wrap gap-3 mb-4 justify-center">
                {statusOrder.map((status) => {
                    const href = `#${slugify(status)}`;
                    return (
                        <a
                            key={status}
                            href={href}
                            onClick={(e) => {
                                e.preventDefault();
                                handleScrollTo(href);
                            }}
                            className={cn(
                                "px-3 py-1.5 rounded-lg text-xs font-semibold",
                                "bg-theme-100/60 dark:bg-theme-800/60",
                                "border border-theme-200/30 dark:border-theme-700/30",
                                "text-theme-700 dark:text-theme-200",
                                "hover:bg-theme-100/80 dark:hover:bg-theme-800/80",
                                "transition-colors",
                            )}
                        >
                            {status}
                        </a>
                    );
                })}
            </nav>

            {/* ──────────── Sections */}
            {statusOrder.map((status) => {
                const mediaArr = content[status];
                const safeId = slugify(status);

                return (
                    <section key={status} className="space-y-4 text-center">
                        <H3 id={safeId} className="!mt-0">
                            {status}
                        </H3>

                        <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(140px,1fr))] justify-center">
                            {mediaArr.length === 0 && !state.loading && (
                                <p className="col-span-full italic opacity-75">Nothing here 🙂</p>
                            )}

                            {mediaArr.map((media, i) =>
                                !media ? (
                                    <SkeletonCard key={i} />
                                ) : (
                                    <AnimeCard key={media.id} media={media} />
                                ),
                            )}
                        </div>
                    </section>
                );
            })}
        </div>
    );
}
