"use client";

import React from "react";
import { cn } from "@/utils/cn";
import Link from "next/link";
import { AnchorLink} from "@/components/ui/MDX/MDXLink/anchor";

interface MDXLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
    className?: string;
}

const MDXLink: React.FC<MDXLinkProps> = ({ href, className, children, ...props }) => {
    // Determine the link type: external, internal, or anchor link
    const isExternal = href.startsWith("http");
    const isAnchor = href.startsWith("#");
    const isInternal = !isExternal && !isAnchor;

    if (isExternal) {
        return (
            <a
                href={href}
                className={cn("text-blue-600 hover:underline", className)}
                target="_blank"
                rel="noopener noreferrer"
                {...props}
            >
                {children}
            </a>
        );
    }

    if (isAnchor) {
        return (
            <AnchorLink href={href} className={className} {...props}>
                {children}
            </AnchorLink>
        );
    }

    if (isInternal) {
        return (
            <Link href={href} passHref>
                <a className={cn("text-red-600 hover:underline", className)} {...props}>
                    {children}
                </a>
            </Link>
        );
    }

    return null;
};

export { MDXLink };
