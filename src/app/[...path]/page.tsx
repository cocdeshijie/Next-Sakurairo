import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { config, pages } from "#site/content";
import Image from "next/image";
import { cn } from "@/utils/cn";
import { MDX } from "@/components/ui/MDX";
import { getOgImageUrl, ogImageSize } from "@/utils/og";
import { buildSiteTitle } from "@/utils/site";

type Params = {
    path: string[];
};

type PageProps = {
    params: Promise<Params>;
};

type PageEntry = (typeof pages)[number];

type LegacyPageEntry = PageEntry & {
    originalPath?: string;
};

function getLegacyOriginalPath(page: PageEntry): string | undefined {
    const candidate = (page as LegacyPageEntry).originalPath;
    return typeof candidate === "string" ? candidate : undefined;
}
/* ------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------ */

function joinPath(segments: string[]): string {
    /* convert ["foo","bar"] → "foo/bar" */
    return segments.join("/");
}

function getPageByPath(segments: string[]) {
    const target = joinPath(segments);  // "folder/page-test"

    return pages.find(page => {
        const legacyOriginalPath = getLegacyOriginalPath(page);
        return page.path === target ||
            page.permalink === `/${target}` ||
            // For backward compatibility
            legacyOriginalPath === target ||
            legacyOriginalPath === `pages/${target}`;
    });
}

/* ------------------------------------------------------------ *
 * Metadata + static generation
 * ------------------------------------------------------------ */

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const { path } = resolvedParams;
    const page = getPageByPath(path);
    if (page == null) return {};
    const description = page.description;
    const siteTitle = buildSiteTitle(config.header_logo);
    const ogImage = getOgImageUrl({
        title: page.title,
        subtitle: siteTitle,
    });
    const ogAlt = `${page.title} – ${siteTitle}`;
    return {
        title: page.title,
        description,
        openGraph: {
            title: page.title,
            description,
            images: [
                {
                    url: ogImage,
                    width: ogImageSize.width,
                    height: ogImageSize.height,
                    alt: ogAlt,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: page.title,
            description,
            images: [ogImage],
        },
    };
}

export function generateStaticParams(): Params[] {
    /*  turn "foo/bar/baz" → ["foo","bar","baz"] so Next can
        pre-build every page at `next build` time                  */
    return pages.map(page => ({
        path: page.path.split("/"),
    }));
}

export default async function Page({ params }: PageProps) {
    const resolvedParams = await params;
    const { path } = resolvedParams;
    const page = getPageByPath(path) ?? notFound();

    return (
        <article>
            <div className={"relative bg-theme-50 dark:bg-theme-950"}>
                <div className={cn(
                    "hidden md:block absolute inset-0",
                    "bg-gradient-to-t from-theme-200 dark:from-theme-800 to-transparent",
                    "opacity-10"
                )}/>
                <div className={"max-w-full mx-auto"}>
                    <div className={cn(
                        "relative rounded-b-3xl overflow-hidden min-h-[33vh] content-center backdrop-blur-sm",
                        "border border-theme-200/25 dark:border-theme-700/25"
                    )}>
                        {page.cover ? (
                            <div className={"absolute inset-0 -z-10"}>
                                <Image
                                    src={page.cover}
                                    alt={page.title}
                                    layout={"fill"}
                                    objectFit={"cover"}
                                    className={"scale-125 transition-all duration-1000 hover:scale-130"}
                                    priority
                                />
                                <div className={cn(
                                    "absolute inset-0 backdrop-blur-md",
                                    "bg-theme-200/50 dark:bg-theme-800/50"
                                )}/>
                            </div>
                            ) : (
                            <div className={cn(
                                "absolute inset-0 backdrop-blur-md -z-20",
                                "bg-gradient-to-br opacity-15",
                                "from-theme-500 via-theme-100 to-theme-300",
                                "dark:from-theme-500 dark:via-theme-900 dark:to-theme-700"
                            )}/>
                        )}
                            <div className={"pt-6 max-w-3xl mx-4 md:mx-auto"}>
                                <h1 className={cn(
                                    "text-2xl md:text-3xl lg:text-4xl font-bold",
                                    "text-theme-900 dark:text-theme-100",
                                    "leading-tight text-center"
                                )}>
                                    {page.title}
                                </h1>
                            </div>
                    </div>
                </div>
            </div>
            <section className="relative bg-theme-50 dark:bg-theme-950">
                <div className={cn(
                    "hidden md:block absolute inset-0",
                    "bg-theme-100 dark:bg-theme-900",
                    "opacity-20"
                )}/>

                <div className={cn(
                    "relative py-6 md:grid md:grid-cols-10",
                    "max-w-full mx-auto px-2"
                )}>
                    <div className="hidden md:block md:col-span-2"/>

                    <div className={cn(
                        "mx-0.5 md:mx-0 md:col-span-6",
                        "rounded-xl overflow-hidden",
                        "ring-2 ring-theme-200/25 dark:ring-theme-800/25",
                        "bg-theme-50 dark:bg-theme-950"
                    )}>
                        <div className="p-6 md:p-8 prose-base dark:prose-invert">
                            <MDX code={page.content}/>
                        </div>
                    </div>
                </div>
            </section>
        </article>
    )
}
