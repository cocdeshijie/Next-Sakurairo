"use client";

import React from "react";
import { useScroll } from "@/providers/scroll-provider";
import { cn } from "@/utils/cn";

export const AnchorLink = ({ href, className, children, ...props }: { href?: string; className?: string; children: React.ReactNode }) => {
    const { handleScrollTo } = useScroll();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (href) {
            e.preventDefault();
            handleScrollTo(href);
        }
    };

    return (
        <a
            href={href}
            className={cn("text-theme-500/65 hover:text-theme-500 hover:underline", className)}
            onClick={handleClick}
            {...props}
        >
            {children}
        </a>
    );
};
