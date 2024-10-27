import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { posts } from "#site/content";
import Image from "next/image";
import { cn } from "@/utils/cn";
import { MDX } from "@/components/ui/MDX";
import { HiMiniCalendarDays } from "react-icons/hi2";
import TOC from "@/components/ui/TOC";
import Tag from "@/components/ui/Tags";

interface PostProps {
    params: {
        slug: string
    }
}

function getPostBySlug(slug: string) {
    return posts.find(post => post.slug === slug)
}

export function generateMetadata({ params }: PostProps): Metadata {
    const post = getPostBySlug(params.slug)
    if (post == null) return {}
    return { title: post.title, description: post.description }
}

export function generateStaticParams(): PostProps['params'][] {
    return posts.map(post => ({
        slug: post.slug
    }))
}

export default function PostPage({ params }: PostProps) {
    const post = getPostBySlug(params.slug);

    if (post == null) {
        return notFound();
    }

    return (
        <article>
            <div className={"relative"}>
                <div className={cn(
                    "absolute inset-0 bg-gradient-to-br",
                    "from-theme-500/15 via-theme-100/25 to-theme-300/15",
                    "dark:from-theme-500/15 dark:via-theme-900/25 dark:to-theme-700/15"
                )}/>
                <div className={"absolute inset-0 bg-gradient-to-br backdrop-blur-3xl"}/>
                <div className={cn(
                    "absolute bottom-0 left-0 right-0 h-3",
                    "bg-gradient-to-t from-theme-200/25 dark:from-theme-800/25 to-transparent backdrop-blur-3xl"
                )}/>


                <div className={"relative pt-20 pb-6 md:pt-24 md:pb-8"}>
                    <div className={"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"}>
                        <div className={cn(
                            "relative rounded-xl overflow-hidden backdrop-blur-sm",
                            "border border-theme-200/25 dark:border-theme-700/25",
                            "shadow-lg shadow-theme-500/10"
                        )}>
                            <div className={"absolute inset-0 -z-10"}>
                                <Image
                                    src={post.cover}
                                    alt={post.title}
                                    layout={"fill"}
                                    objectFit={"cover"}
                                    className={"scale-125 transition-all duration-1000 hover:scale-130"}
                                    priority
                                />
                                <div className={cn(
                                    "absolute inset-0 backdrop-blur-md",
                                    "bg-gradient-to-br",
                                    "from-theme-200/50 via-theme-200/75 to-theme-100/50",
                                    "dark:from-theme-800/50 dark:via-theme-800/75 dark:to-theme-900/50"
                                )}/>
                            </div>

                            <div className={"relative p-6 md:p-8"}>
                                <div className={"max-w-3xl"}>
                                    <div className={"flex items-center gap-3 mb-4"}>
                                        <time
                                            className={cn(
                                                "inline-flex items-center gap-2",
                                                "px-3 py-1.5 rounded-lg text-sm",
                                                "bg-theme-500/10 backdrop-blur-md",
                                                "text-theme-700 dark:text-theme-100",
                                                "border border-theme-500/20 shadow-sm"
                                            )}
                                            dateTime={post.date}
                                        >
                                            <HiMiniCalendarDays size={18}/>
                                            {new Date(post.date).toLocaleDateString('en-US', {
                                                month: "long",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </time>
                                    </div>

                                    <h1 className={cn(
                                        "text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold",
                                        "text-theme-950 dark:text-theme-50",
                                        "mb-6 leading-tight"
                                    )}>
                                        {post.title}
                                    </h1>

                                    <div className={"flex flex-wrap gap-2"}>
                                        {Array.isArray(post.tags) && post.tags.map((tag: string, index: number) => (
                                            <Tag key={index} tag={tag}/>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <section className="relative bg-theme-50 dark:bg-theme-950">
                <div className={cn(
                    "hidden md:block absolute inset-0",
                    "bg-gradient-to-b from-theme-200 dark:from-theme-800 to-transparent",
                    "opacity-10"
                )}/>
                <div className={"hidden md:block absolute inset-0 backdrop-blur-3xl"}/>

                <div className={cn(
                    "relative py-6 md:grid md:grid-cols-7",
                    "max-w-full mx-auto px-2"
                )}>
                    <div className="hidden md:block md:col-span-2"/>

                    <div className={cn(
                        "mx-0.5 md:mx-0 md:col-span-3",
                        "rounded-xl overflow-hidden",
                        "ring-2 ring-theme-200/25 dark:ring-theme-800/25",
                        "bg-theme-50 dark:bg-theme-950"
                    )}>
                        <div className="p-6 md:p-8 prose-base dark:prose-invert">
                            <MDX code={post.content}/>
                        </div>
                    </div>

                    <div className="hidden md:block md:col-start-6">
                        <div className="sticky top-10 pl-6">
                            <div className={cn(
                                "text-theme-800 dark:text-theme-200",
                                "max-h-[calc(80vh)]",
                                "overflow-y-auto"
                            )}>
                                <TOC toc={post.toc}/>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </article>
    )
}
