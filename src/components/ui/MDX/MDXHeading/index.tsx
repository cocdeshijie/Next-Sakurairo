"use client";

import { cn } from "@/utils/cn";
import React, { ElementType } from "react";
import { useScroll } from "@/providers/scroll-provider";

interface HeadingProps {
    className?: string;
    children: React.ReactNode;
    id?: string;
}

const HeadingAnchor = ({ href }: { href?: string }) => {
    const { handleScrollTo } = useScroll();

    const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
        if (href) {
            handleScrollTo(href);
        }
    };

    return (
        <a
            href={href}
            onClick={handleClick}
            className={cn(
                "ml-2 hover:underline hover:cursor-pointer",
                "opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                "text-theme-400 dark:text-theme-600"
            )}
        >
            #
        </a>
    );
};

const createHeadingComponent = (
    tag: ElementType,
    baseClassName: string
) => {
    const HeadingComponent = ({ className, children, id, ...props }: HeadingProps) => {
        const href = id ? `#${id}` : undefined;
        const HeadingTag = tag;

        return (
            <HeadingTag className={cn(baseClassName, className)} id={id} {...props}>
                <span>{children}</span>
                <HeadingAnchor href={href} />
            </HeadingTag>
        );
    };
    HeadingComponent.displayName = `Heading(${tag})`;
    return HeadingComponent;
};

export const H1 = createHeadingComponent("h1", "text-4xl font-semibold group mt-10 mb-4");
export const H2 = createHeadingComponent("h2", "text-3xl font-semibold group mt-10 mb-4");
export const H3 = createHeadingComponent("h3", "text-2xl font-semibold group mt-10 mb-4");
export const H4 = createHeadingComponent("h4", "text-xl font-semibold group mt-10 mb-4");
export const H5 = createHeadingComponent("h5", "text-lg font-semibold group mt-10 mb-4");
export const H6 = createHeadingComponent("h6", "text-base font-semibold group mt-10 mb-4");