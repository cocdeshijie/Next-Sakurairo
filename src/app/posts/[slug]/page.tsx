import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { posts } from "#site/content";
import Image from "next/image";
import {cn} from "@/utils/cn";

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
    const post = getPostBySlug(params.slug)

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
                <div className={"absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white"}>
                    <h1 className={"text-xl md:text-4xl px-6 md:px-60 font-bold mb-4"}>{post.title}</h1>
                    <div className={"text-lg md:text-xl"}>
                        <span>{post.date}</span> | <span>{post.wordCount} words</span> | <span>{post.tags.join(', ')}</span>
                    </div>
                </div>
            </div>
            <section className={"py-6 bg-gradient-to-br from-theme-50 to-theme-100 dark:from-theme-900 dark:to-theme-950"}>
                <div className={cn(
                    "mx-4 md:mx-auto px-4 py-12 md:w-1/2",
                    "rounded-lg border border-theme-300/50 dark:border-theme-700/50 shadow-md shadow-theme-200/50 dark:shadow-theme-800/50",
                    "bg-theme-50/75 dark:bg-theme-950/75 backdrop-blur-sm"
                )}>
                    {post.content}
                </div>
            </section>
        </article>
    )
}