"use client";

import React, { useId } from "react";
import { atom, useAtom } from "jotai";
import { cn } from "@/utils/cn";
import { useRouter } from "next/navigation";


interface TagProps {
    tag: string;
    sizeLevel?: number;
}

// Define a global atom to store the currently hovered tag's unique ID
const hoveredTagAtom = atom<string | null>(null);

const sizeClassMap: Record<number, { textSize: string; padding: string }> = {
    1: { textSize: "text-xs", padding: "px-1 py-0.5" },
    2: { textSize: "text-sm", padding: "px-1.5 py-0.5" },
    3: { textSize: "text-base", padding: "px-2 py-0.5" },
    4: { textSize: "text-lg", padding: "px-2.5 py-1" },
    5: { textSize: "text-xl", padding: "px-3 py-1" },
    6: { textSize: "text-2xl", padding: "px-3.5 py-1" },
};

const Tag: React.FC<TagProps> = ({ tag, sizeLevel = 2 }) => {
    const [hoveredTag, setHoveredTag] = useAtom(hoveredTagAtom); // Global atom for the hovered tag's unique ID
    const uniqueTagId = useId(); // Generate a unique ID for each tag instance
    const router = useRouter();

    const handleMouseEnter = () => {
        setHoveredTag(uniqueTagId); // Set the hovered tag to the current uniqueTagId
    };
    const handleMouseLeave = () => {
        setHoveredTag(null); // Clear the hovered tag when the mouse leaves
    };

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault() // Prevent the click event from reaching the outer Link
        router.push(`/tags/${tag}`);  // Navigate to the tag page
    };

    const { textSize, padding } = sizeClassMap[sizeLevel];
    const isHovered = hoveredTag === uniqueTagId; // Check if this tag is the one being hovered

    return (
        <div className="relative inline-block w-[max-content] flex-shrink-0">
            <div
                className={cn(
                    "inline-flex items-end cursor-pointer ",
                    "text-theme-600 dark:text-theme-300 rounded-lg transition-all duration-300",
                    "bg-theme-100/75 dark:bg-theme-800/75 backdrop-blur-sm",
                    "shadow-sm hover:shadow-md",
                    "border border-theme-200/25 dark:border-theme-700/25",
                    "hover:border-theme-500/25 hover:text-theme-500 dark:hover:text-theme-500",
                    "transform origin-bottom",
                    isHovered ? "scale-110 translate-y-[-1px] mx-0.5 bg-theme-100/90 dark:bg-theme-800/90" : "scale-100",
                    textSize,
                    padding
                )}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
            >
                {tag}
            </div>
        </div>
    );
};

export default Tag;
