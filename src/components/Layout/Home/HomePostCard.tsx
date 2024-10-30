"use client";

import Image from "next/image";
import { cn } from "@/utils/cn";
import { atom, useAtom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import Tag from "@/components/ui/Tags";
import { HiMiniCalendarDays, HiMiniTag } from "react-icons/hi2";
import Link from "next/link";
import { type Posts } from "#site/content";

interface PostCardProps {
    post: Posts;
    index: number;
}

// Create atom family to manage hover state for each post card
const isHoveredAtomFamily = atomFamily(() => atom<boolean>(false));

const PostCard = ({ post, index }: PostCardProps) => {
    const [isHovered, setIsHovered] = useAtom(isHoveredAtomFamily(index));

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const isEvenIndex = index % 2 === 0;

    return (
        <Link
            key={index}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            href={post.permalink}
            className={cn(
                "relative h-44 md:h-36 rounded-lg overflow-hidden mb-4 md:mb-6 md:flex cursor-pointer",
                "transition-all duration-200 ease-out",
                "ring-1 ring-transparent",
                isHovered ? [
                    "ring-theme-500/50",
                    "shadow-xl shadow-theme-500/15"
                ] : "shadow-md shadow-theme-950/5"
            )}
        >
            <div className={"absolute inset-0 z-0 overflow-hidden rounded-lg"}>
                <Image
                    src={post.cover}
                    alt={post.title}
                    layout={"fill"}
                    objectFit={"cover"}
                    objectPosition={"center"}
                    className={cn(
                        "transition-all duration-500",
                        "blur-sm md:blur-xl",
                        isHovered ? "scale-110 brightness-95" : "scale-100"
                    )}
                />
                <div className={cn(
                    "absolute inset-0",
                    "bg-gradient-to-br from-theme-100/75 via-theme-200/50 to-theme-100/75",
                    "dark:from-theme-900/75 dark:via-theme-800/50 dark:to-theme-900/75",
                    "transition-opacity duration-300",
                    isHovered ? "opacity-75" : "opacity-95"
                )}/>
            </div>


            <div className={cn(
                "relative z-10 md:w-[60%] flex flex-col justify-between",
                isEvenIndex ? "md:order-2" : ""
            )}>
                <div className={"p-4"}>
                    <h3 className={cn(
                        "text-lg font-bold text-theme-950 dark:text-theme-50",
                        "line-clamp-3 md:line-clamp-2 mb-1",
                        "transition-colors duration-200",
                        isHovered && "text-theme-500 dark:text-theme-500"
                    )}>{
                        post.title}
                    </h3>
                    <div className={"flex items-center mb-2 cursor-auto"}>
                        <div className={cn(
                            "flex items-center gap-1.5 px-1 py-0.5 rounded-md",
                            "bg-theme-100/50 dark:bg-theme-900/50",
                            "border border-theme-200/25 dark:border-theme-700/25",
                            "transition-colors duration-200",
                            isHovered && "bg-theme-100/75 dark:bg-theme-900/75"
                        )}>
                            <HiMiniCalendarDays className={cn(
                                "text-theme-700 dark:text-theme-300 text-sm",
                                "transition-colors duration-200",
                                isHovered && "text-theme-800 dark:text-theme-200"
                            )}/>
                            <p className={cn(
                                "text-theme-700 dark:text-theme-300 text-xs",
                                "transition-colors duration-200",
                                isHovered && "text-theme-800 dark:text-theme-200"
                            )}>
                                {new Date(post.date).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric"
                                })}
                            </p>
                        </div>
                    </div>
                    <div className={"flex items-center gap-1"}>
                        <div className={cn(
                            "flex items-center justify-center",
                            "p-1 rounded-full flex-shrink-0",
                            "bg-theme-100/75 dark:bg-theme-800/75",
                            "border border-theme-200/25 dark:border-theme-700/25",
                            "transition-colors duration-200"
                        )}>
                            <HiMiniTag className={cn(
                                "text-theme-600 dark:text-theme-400 text-sm",
                                "transition-colors duration-200"
                            )}/>
                        </div>
                        <div className={"overflow-hidden py-0.5"}>
                            <div className={"flex items-center gap-1 w-full"}>
                                {Array.isArray(post.tags) && post.tags.map((tag: string, index: number) => (
                                    <Tag
                                        key={index}
                                        tag={tag}
                                        sizeLevel={1}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={cn(
                "relative z-0 md:w-1/2 hidden md:block overflow-hidden",
                isEvenIndex ? "clip-path-articleImageLeft" : "clip-path-articleImageRight",
                "after:absolute after:inset-0",
                "after:bg-gradient-to-r",
                isEvenIndex
                    ? "after:from-transparent after:via-theme-500/5 after:to-theme-500/10"
                    : "after:from-theme-500/10 after:via-theme-500/5 after:to-transparent",
                "after:transition-opacity after:duration-300",
                isHovered ? "after:opacity-100" : "after:opacity-0"
            )}>
                <Image
                    src={post.cover}
                    alt={post.title}
                    layout={"fill"}
                    objectFit={"cover"}
                    objectPosition={"center"}
                    className={cn(
                        "transition-all duration-400 ease-in-out",
                        isHovered ? "transform scale-110" : "scale-100"
                    )}
                />
            </div>
        </Link>
    );
};

export default PostCard;