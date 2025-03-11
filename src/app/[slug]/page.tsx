import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { pages } from "#site/content";
import Image from "next/image";
import { cn } from "@/utils/cn";
import { MDX } from "@/components/ui/MDX";

interface PageProps {
    params: {
        slug: string
    }
}

function getPageBySlug(slug: string) {
    return pages.find(page => page.slug === slug)
}

export function generateMetadata({ params }: PageProps): Metadata {
    const page = getPageBySlug(params.slug)
    if (page == null) return {}
    return { title:  page.title, description: page.description }
}

export function generateStaticParams(): PageProps['params'][] {
    return pages.map(post => ({
        slug: post.slug
    }))
}

export default function Page({ params }: PageProps) {
    const page = getPageBySlug(params.slug);

    if (page == null) {
        return notFound();
    }

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
