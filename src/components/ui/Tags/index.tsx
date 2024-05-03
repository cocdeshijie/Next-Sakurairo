"use client";

import React from "react";
import { cn } from "@/utils/cn";

interface TagProps {
    tag: string;
}

const Tag: React.FC<TagProps> = ({ tag }) => {
    return (
        <span className={cn(
            "text-white px-1.5 py-0.5 rounded-md text-xs",
            "border border-theme-400 dark:border-theme-600",
            "bg-theme-400/50 dark:bg-theme-600/50 hover:bg-theme-400 hover:dark:bg-theme-600 duration-200"
        )}>
            {tag}
        </span>
    );
};

export default Tag;