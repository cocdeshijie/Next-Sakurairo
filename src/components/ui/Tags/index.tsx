"use client";

import React, { useState } from "react";
import { cn } from "@/utils/cn";
import Link from "next/link";
import { tagSlug } from "@/utils/tagSlug";

interface TagProps {
    tag: string;
    sizeLevel?: number;
}

const sizeClassMap: Record<number, { textSize: string; padding: string }> = {
    1: { textSize: "text-xs", padding: "px-1 py-0.5" },
    2: { textSize: "text-sm", padding: "px-1.5 py-0.5" },
    3: { textSize: "text-base", padding: "px-2 py-0.5" },
    4: { textSize: "text-lg", padding: "px-2.5 py-1" },
    5: { textSize: "text-xl", padding: "px-3 py-1" },
    6: { textSize: "text-2xl", padding: "px-3.5 py-1" },
};

const Tag: React.FC<TagProps> = ({ tag, sizeLevel = 2 }) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };
    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const { textSize, padding } = sizeClassMap[sizeLevel];

    return (
        <div className="relative inline-block w-[max-content]">
            <Link href={`/tags/${tagSlug(tag)}`}>
                <div
                    className={cn(
                        "inline-flex items-end cursor-pointer",
                        "text-white rounded-md transition-all duration-200",
                        "border border-theme-400 dark:border-theme-600",
                        "bg-theme-400/50 dark:bg-theme-600/50 hover:bg-theme-400 hover:dark:bg-theme-600",
                        "transform origin-bottom",
                        isHovered ? "scale-110 ml-0.5 mr-0.5" : "scale-100",
                        textSize,
                        padding
                    )}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    {tag}
                </div>
            </Link>
        </div>
    );
};

export default Tag;