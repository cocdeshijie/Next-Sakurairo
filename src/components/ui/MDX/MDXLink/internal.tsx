import React from "react";
import { cn } from "@/utils/cn";

interface InternalLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
    className?: string;
}

const InternalLink: React.FC<InternalLinkProps> = ({ href, className, children, ...props }) => {
    return (
        <a
            href={href}
            className={cn(
                "text-red-600 underline underline-gray-400 hover:underline-theme-color-500",
                className
            )}
            {...props}
        >
            {children}
        </a>
    );
};

export { InternalLink };