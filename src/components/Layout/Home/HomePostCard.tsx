"use client";

import Image from "next/image";
import { cn } from "@/utils/cn";
import { useState } from "react";
import Tag from "@/components/ui/Tags";
import { HiMiniTag } from "react-icons/hi2";

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

const PostCard = ({ post, index }: PostCardProps) => {
    const [isHovered, setIsHovered] = useState(false);

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
            className={"relative h-44 md:h-36 rounded-lg shadow-lg overflow-hidden md:flex cursor-pointer"}
        >
            <div className={"absolute inset-0 z-0 overflow-hidden"}>
                <Image
                    src={post.cover}
                    alt={post.title}
                    layout={"fill"}
                    objectFit={"cover"}
                    objectPosition={"center"}
                    className={"blur-sm md:blur-lg brightness-95 dark:brightness-75"}
                />
            </div>
            <div className={cn(
                "relative z-10 md:w-5/6",
                isEvenIndex ? "md:order-2" : ""
            )}>
                <div className={"p-4"}>
                    <h3 className={"text-lg font-bold text-white mb-1 line-clamp-3 md:line-clamp-2"}>{post.title}</h3>
                    <p className={"text-gray-300 text-sm mb-1"}>{new Date(post.date).toLocaleDateString()}</p>
                    <div className="flex">
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
                    layout={"fill"}
                    objectFit={"cover"}
                    objectPosition={"center"}
                    className={cn(
                        "transition duration-300 ease-in-out",
                        isHovered ? "transform scale-125" : ""
                    )}
                />
            </div>
        </div>
    );
};

export default PostCard;