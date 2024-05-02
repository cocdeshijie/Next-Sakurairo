"use client";

import Image from "next/image";
import { cn } from "@/utils/cn";
import { useState } from "react";

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
            className={"relative md:h-52 rounded-lg shadow-lg overflow-hidden md:flex cursor-pointer"}
        >
            <div className={"absolute inset-0 z-0 overflow-hidden"}>
                <Image
                    src={post.cover}
                    alt={post.title}
                    layout={"fill"}
                    objectFit={"cover"}
                    objectPosition={"center"}
                    className={"filter blur-sm md:blur-lg dark:brightness-75"}
                />
            </div>
            <div className={cn("relative z-10 md:w-2/3", isEvenIndex ? "md:order-2" : "")}>
                <div className={"p-6 h-52 md:h-64"}>
                    <h3 className={"text-xl font-bold text-white mb-2"}>{post.title}</h3>
                    <p className={"text-gray-300 text-sm mb-4"}>{new Date(post.date).toLocaleDateString()}</p>
                    <div className={"flex space-x-2"}>
                        {Array.isArray(post.tags) && post.tags.map((tag: string, tagIndex: number) => (
                            <span key={tagIndex} className={"bg-blue-500 text-white px-2 py-1 rounded-full text-xs"}>
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
            <div className={cn(
                "relative z-0 md:w-1/3 hidden md:block overflow-hidden",
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