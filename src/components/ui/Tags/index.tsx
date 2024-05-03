"use client";

import React, { useState } from "react";
import { cn } from "@/utils/cn";
import Link from "next/link";
import { tagSlug } from "@/utils/tagSlug";

interface TagProps {
    tag: string;
}

const Tag: React.FC<TagProps> = ({ tag }) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return (
        <Link href={`/tags/${tagSlug(tag)}`}>
            <li
                className={cn(
                    "inline-flex items-end cursor-pointer",
                    "text-white px-1.5 py-0.5 rounded-md text-xs mr-1 transition-all duration-200",
                    "border border-theme-400 dark:border-theme-600",
                    "bg-theme-400/50 dark:bg-theme-600/50 hover:bg-theme-400 hover:dark:bg-theme-600",
                    isHovered ? "transform scale-125 origin-bottom ml-1 mr-2" : ""
                )}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {tag}
            </li>
        </Link>
    );
};

export default Tag;