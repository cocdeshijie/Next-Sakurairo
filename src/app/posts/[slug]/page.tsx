import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { posts } from "#site/content";
import Image from "next/image";
import { cn } from "@/utils/cn";
import { MDX } from "@/components/ui/MDX";
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
            <div className={"relative h-80 md:h-[50vh]"}>
                <Image
                    src={post.cover}
                    alt={post.title}
                    layout={"fill"}
                    objectFit={"cover"}
                    className={"w-full h-full"}
                />
                <div
                    className={cn(
                        "absolute inset-0 flex flex-col items-center justify-center",
                        "bg-black bg-opacity-50 text-white"
                    )}>
                    <h1 className={"text-xl md:text-4xl px-6 my-10 md:px-60 font-bold mb-4"}>{post.title}</h1>
                    <div className={"flex flex-col items-center gap-3 px-4 text-center"}>
                        <time className={"text-lg md:text-xl font-medium"} dateTime={post.date}>
                            {new Date(post.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                            })}
                        </time>
                        <div className={"flex flex-wrap justify-center gap-2"}>
                            {Array.isArray(post.tags) && post.tags.map((tag: string, index: number) => (
                                <Tag key={index} tag={tag} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <section className={cn(
                "py-6 md:grid md:grid-cols-4",
                "bg-gradient-to-br from-theme-50 to-theme-100 dark:from-theme-900 dark:to-theme-950"
            )}>
                <div className={"hidden md:block md:col-span-1"}></div>
                <div className={cn(
                    "mx-4 px-4 py-12 prose-base dark:prose-invert rounded-lg md:col-span-2",
                    "border border-theme-300/50 dark:border-theme-700/50",
                    "shadow-md shadow-theme-200/50 dark:shadow-theme-800/50",
                    "bg-theme-50/75 dark:bg-theme-950/75 backdrop-blur-sm"
                )}>
                    <MDX code={post.content}/>
                </div>
                <div className={"sticky top-20 hidden md:block md:col-start-4"}>
                    <TOC toc={post.toc}/>
                </div>
            </section>
        </article>
    )
}
