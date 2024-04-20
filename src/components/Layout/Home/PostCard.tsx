"use client";

import Image from "next/image";
import {atom, useAtom} from "jotai/index";
import {cn} from "@/utils/cn";
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

const cardHoverAtom = atom(false);

// TODO: alternate left and right based on even and odd index
const PostCard = ({ post, index }: PostCardProps) => {
    const [cardHover, setCardHover] = useAtom(cardHoverAtom);

    const handleMouseEnter = () => {
        setCardHover(true);
    };

    const handleMouseLeave = () => {
        setCardHover(false);
    };

    return (
        <Link
            href={post.permalink}
            key={index}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={"relative md:h-36 rounded-lg shadow-lg overflow-hidden md:flex"}
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
            <div className={"relative z-10 md:w-2/3"}>
                <div className={"p-6 h-48 md:h-64"}>
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
            <div className={"relative z-0 md:w-1/3 clip-path-articleImage hidden md:block overflow-hidden"}>
                <Image
                    src={post.cover}
                    alt={post.title}
                    layout={"fill"}
                    objectFit={"cover"}
                    objectPosition={"center"}
                    className={cn(
                        "transition duration-300 ease-in-out",
                            cardHover ? "transform scale-125" : ""
                    )}
                />
            </div>
        </Link>
    )
}

export default PostCard;