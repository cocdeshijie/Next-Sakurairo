"use client";

import Image from "next/image";
import { cn } from "@/utils/cn";
import { atom, useAtom } from "jotai";
import Tag from "@/components/ui/Tags";
import { HiMiniTag, HiMiniCalendarDays } from "react-icons/hi2";
import { useId } from "react";
import Link from "next/link";

interface Post {
    title: string;
    cover: string;
    date: string;
    tags: string[];
    permalink: string;
}

interface PostCardProps {
    post: Post;
    index: number;
}

// Define a global atom to store the currently hovered card's unique ID
const hoveredCardAtom = atom<string | null>(null);

const PostCard = ({ post, index }: PostCardProps) => {
    const uniqueCardId = useId(); // Generate a unique ID for each card instance
    const [hoveredCard, setHoveredCard] = useAtom(hoveredCardAtom); // Global atom for the hovered card's unique ID

    const handleMouseEnter = () => {
        setHoveredCard(uniqueCardId); // Set the hovered card to the current uniqueCardId
    };

    const handleMouseLeave = () => {
        setHoveredCard(null); // Clear the hovered card when the mouse leaves
    };

    const isEvenIndex = index % 2 === 0;
    const isHovered = hoveredCard === uniqueCardId; // Check if this card is the one being hovered

    return (
        <Link
            key={index}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            href={post.permalink}
            className={cn(
                "relative h-52 rounded-lg shadow-lg overflow-hidden mb-4 md:mb-6 md:flex cursor-pointer",
                "shadow-theme-500/50 duration-200",
                isHovered ? "shadow-2xl" : "shadow-none"
            )}
        >
            <div className={"absolute inset-0 z-0 overflow-hidden rounded-lg"}>
                <Image
                    src={post.cover}
                    alt={post.title}
                    layout={"fill"}
                    objectFit={"cover"}
                    objectPosition={"center"}
                    className={"blur-sm md:blur-lg brightness-95 dark:brightness-75"}
                />
            </div>
            <div className={cn("relative z-10 md:w-2/3", isEvenIndex ? "md:order-2" : "")}>
                <div className={"p-6"}>
                    <h3 className={cn(
                        "text-xl font-bold text-theme-950 dark:text-theme-50",
                        "line-clamp-3 md:line-clamp-2 mb-2"
                    )}>{post.title}</h3>
                    <div className="flex items-center mb-4 cursor-auto">
                        <div
                            className={cn(
                                "text-white p-1 mr-2 rounded-full",
                                "bg-theme-300 dark:bg-theme-700 border border-theme-400 dark:border-theme-800"
                            )}>
                            <HiMiniCalendarDays />
                        </div>
                        <p className={"text-theme-900 dark:text-theme-100 text-sm"}>
                            {new Date(post.date).toLocaleDateString()}
                        </p>
                    </div>
                    <div className={"flex cursor-auto "}>
                        <div
                            className={cn(
                                "text-white p-1 mr-2 rounded-full text-sm h-fit",
                                "bg-theme-400 dark:bg-theme-600 border border-theme-300 dark:border-theme-700"
                            )}>
                            <HiMiniTag />
                        </div>
                        <div className={"flex flex-wrap overflow-hidden max-h-7 gap-1"}>
                            {Array.isArray(post.tags) && post.tags.map((tag: string, index: number) => (
                                <Tag key={index} tag={tag}/>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className={cn(
                "relative z-0 md:w-5/12 hidden md:block overflow-hidden",
                isEvenIndex ? "clip-path-articleImageLeft" : "clip-path-articleImageRight"
            )}>
                <Image
                    src={post.cover}
                    alt={post.title}
                    layout={"fill"}
                    objectFit={"cover"}
                    objectPosition={"center"}
                    className={cn(
                        "transition duration-300 ease-in-out",
                        isHovered ? "transform scale-125" : ""
                    )}
                />
            </div>
        </Link>
    );
};

export default PostCard;
