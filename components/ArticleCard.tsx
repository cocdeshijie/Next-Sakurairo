"use client";

import Image from "next/image";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { Article } from "contentlayer/generated";
import { cn } from "@/lib/utils";
import { HashtagIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

type ArticleCardProps = {
    article: Article;
    idx: number;
}

export default function ArticleCard({ article, idx }: ArticleCardProps) {
    const [hover, setHover] = useState(false);

    return (
        <div onMouseEnter={() => setHover(true)}
             onMouseLeave={() => setHover(false)}
             className={cn({
                     "md:flex-row-reverse": idx % 2 !== 0,
                     "md:flex-row": idx % 2 === 0
                 },
                 {
                     "shadow-lg  shadow-primary_color/50 dark:shadow-primary_color-dark/50": hover,
                 },
                 "bg-slate-50 dark:bg-gray-900/75 ",
                 "mb-4 md:mb-6 md:h-72",
                 "flex w-full flex-col rounded-xl overflow-hidden duration-500"
             )}>
            <div className="w-full md:w-7/12 overflow-hidden">
                <Link href={article.url}>
                    <Image src={article.image}
                           alt={article.title}
                           className={cn({
                               "scale-110": hover
                           },
                               "w-full h-64 md:h-full object-cover duration-500",
                           )}
                           width={1920}
                           height={1080}/>
                </Link>
            </div>

            <div className="w-full md:w-5/12 p-4 lg:px-8">
                <div className={"flex mb-2"}>
                    <div className={"bg-accent_color/50 dark:bg-accent_color-dark/70 rounded-md"}>
                        <div className={"text-xs py-1 px-2"}>Posted on {format(parseISO(article.date), 'LLLL d, yyyy')}</div>
                    </div>
                </div>
                <div className={"flex mb-3"}>
                    {(() => {
                        if (!article.tags || article.tags.length === 0) {
                            return (
                                <div className={cn(
                                    "inline-flex text-xs rounded-md mr-2 items-center",
                                    "bg-secondary_color/20 dark:bg-secondary_color-dark/20"
                                )}>
                                    <div className={"text-xs py-1 px-1 opacity-70"}>No tags</div>
                                </div>
                            )
                        } else {
                            return article.tags.map((tag) => (
                                <div key={tag}
                                     className={cn(
                                    "inline-flex text-xs rounded-md mr-2 items-center",
                                    "bg-secondary_color/50 dark:bg-secondary_color-dark/70"
                                )}>
                                    <HashtagIcon className={"w-3 h-3 ml-1"}/>
                                    <div className={"text-xs py-1 px-1"}>{tag}</div>
                                </div>
                            ))
                        }
                    })()}
                </div>

                <div className={cn({
                        "lg:justify-items-end lg:text-end": idx % 2 === 0,
                        "lg:justify-items-start": idx % 2 !== 0
                    },
                    "lg:grid"
                )}>
                    <h2 className={cn({
                        "text-primary_color dark:text-primary_color-dark": hover
                    },
                        "font-bold text-lg mb-2 line-clamp-2 duration-200",
                    )}>
                        <Link href={article.url}>{article.title}</Link>
                    </h2>
                    <p className="text-sm line-clamp-4">
                        {article.excerpt}
                    </p>
                </div>
            </div>
        </div>
    )
}