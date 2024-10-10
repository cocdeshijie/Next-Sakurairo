"use client";

import Image from "next/image";
import { cn } from "@/utils/cn";
import { atom, useAtom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import Tag from "@/components/ui/Tags";
import { HiMiniCalendarDays, HiMiniTag } from "react-icons/hi2";

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

    const handleClick = () => {
        window.location.href = post.permalink;
    };

    const isEvenIndex = index % 2 === 0;

    return (
        <div
            key={index}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            className={cn(
                "relative h-44 md:h-36 rounded-lg shadow-lg overflow-hidden md:flex cursor-pointer",
                "shadow-theme-500/50 dark:shadow-theme-500/25 duration-200",
                isHovered ? "shadow-xl" : "shadow-none"
            )}
        >
            <div className={"absolute inset-0 z-0 overflow-hidden"}>
                <Image
                    src={post.cover}
                    alt={post.title}
                    fill
                    className={"blur-sm md:blur-md brightness-95 dark:brightness-75 object-cover object-center"}
                />
            </div>
            <div className={cn(
                "relative z-10 md:w-5/6",
                isEvenIndex ? "md:order-2" : ""
            )}>
                <div className={"p-4"}>
                    <h3 className={cn(
                        "text-lg font-bold text-theme-950 dark:text-theme-50",
                        "line-clamp-3 md:line-clamp-2 mb-1"
                    )}>{post.title}</h3>
                    <div className="flex items-center mb-2 cursor-auto">
                        <div
                            className={cn(
                                "text-white p-1 mr-2 rounded-full",
                                "bg-theme-300 dark:bg-theme-700 border border-theme-400 dark:border-theme-800"
                            )}>
                            <HiMiniCalendarDays/>
                        </div>
                        <p className={"text-theme-900 dark:text-theme-100 text-sm"}>
                            {new Date(post.date).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="flex cursor-auto">
                        <div
                            className={cn(
                                "text-white p-1 mr-1 rounded-full",
                                "bg-theme-400 dark:bg-theme-600 border border-theme-300 dark:border-theme-700"
                            )}>
                            <HiMiniTag/>
                        </div>
                        <ul className={"list-none"}>
                            {Array.isArray(post.tags) && post.tags.map((tag: string, index: number) => (
                                <Tag key={index} tag={tag}/>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <div className={cn(
                "relative z-0 md:w-1/2 hidden md:block overflow-hidden",
                isEvenIndex ? "clip-path-articleImageLeft" : "clip-path-articleImageRight"
            )}>
                <Image
                    src={post.cover}
                    alt={post.title}
                    fill
                    className={cn(
                        "transition duration-300 ease-in-out object-cover object-center",
                        isHovered ? "transform scale-125" : ""
                    )}
                />
            </div>
        </div>
    );
};

export default PostCard;