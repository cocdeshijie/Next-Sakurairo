import React from "react";
import { AnchorLink } from "@/components/ui/MDX/MDXLink/anchor";
import { ExternalLink } from "@/components/ui/MDX/MDXLink/external";
import { InternalLink } from "@/components/ui/MDX/MDXLink/internal";

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
            <ExternalLink href={href} className={className} {...props}>
                {children}
            </ExternalLink>
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
            <InternalLink href={href} className={className} {...props}>
                {children}
            </InternalLink>
        );
    }

    return null;
};

export { MDXLink };