"use client";

import { useState } from "react";
import { Article } from "contentlayer/generated";
import ArticleCard from "@/components/ArticleCard";
import { cn } from "@/lib/utils";
import { useScrollContext } from "@/components/ScrollProgress";
import { motion } from "framer-motion";

type ArticleLoaderProps = {
    articles: Article[];
    articlesPerLoad: number;
};

export default function ArticleLoader({ articles, articlesPerLoad }: ArticleLoaderProps) {
    const { setContentLoaded } = useScrollContext(); // Use context here
    const [displayedArticles, setDisplayedPosts] = useState(articles.slice(0, articlesPerLoad));
    const [hasMore, setHasMore] = useState(articles.length > displayedArticles.length);

    const loadMore = () => {
        const nextPosts = articles.slice(displayedArticles.length, displayedArticles.length+articlesPerLoad);
        setDisplayedPosts([...displayedArticles, ...nextPosts]);
        if (articles.length <= displayedArticles.length + articlesPerLoad) {
            setHasMore(false);
        }
        setContentLoaded(false);
        setTimeout(() => setContentLoaded(true), 100);
    };

    const cardVariants = {
        offscreen: {
            y: 300
        },
        onscreen: {
            y: 0,
            rotate: 0,
            transition: {
                type: "spring",
                bounce: 0.1,
                duration: 0.5
            }
        }
    };

    return (
        <>
            {displayedArticles.map((article: Article, idx: number) => (
                <motion.div
                    key={idx}
                    initial="offscreen"
                    whileInView="onscreen"
                    variants={cardVariants}
                    viewport={{ once: true }}
                >
                    <ArticleCard idx={idx} article={article} />
                </motion.div>
            ))}
            <div className={"p-6 flex justify-center"}>
                {hasMore ? (
                    <button type={"button"}
                            onClick={loadMore}
                            className={cn(
                                "rounded-full px-5 py-2",
                                "bg-white dark:bg-slate-800/75",
                                "text-primary_color dark:text-primary_color-dark",
                                "hover:ring-1 hover:ring-accent_color hover:dark:ring-accent_color-dark"
                            )}>Load more</button>
                ) : (
                    <a>You&apos;ve reached the end :)</a>
                )}
            </div>

        </>
    )
}
