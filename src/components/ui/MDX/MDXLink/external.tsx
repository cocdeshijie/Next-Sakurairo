"use client";

import React from "react";
import { GoArrowUpRight } from "react-icons/go";
import { TbWorld } from "react-icons/tb";
import { atom, useAtom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { cn } from "@/utils/cn";

interface ExternalLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
    className?: string;
}

// Create atom family to manage favicon state for each link
const faviconUrlAtomFamily = atomFamily((href: string) => atom<string | null>(null));

const ExternalLink: React.FC<ExternalLinkProps> = ({ href, className, children, ...props }) => {
    const [faviconUrl, setFaviconUrl] = useAtom(faviconUrlAtomFamily(href));

    React.useEffect(() => {
        let isMounted = true;

        try {
            const url = new URL(href);
            // Attempt to fetch the favicon from the head element
            fetch(url.origin)
                .then((response) => response.text())
                .then((html) => {
                    if (isMounted) {
                        const doc = new DOMParser().parseFromString(html, "text/html");
                        const faviconLink = doc.querySelector("link[rel~='icon']")?.getAttribute("href");
                        if (faviconLink) {
                            const fullFaviconUrl = faviconLink.startsWith("http") ? faviconLink : `${url.origin}${faviconLink}`;
                            setFaviconUrl(fullFaviconUrl);
                        } else {
                            setFaviconUrl(`${url.origin}/favicon.ico`);
                        }
                    }
                })
                .catch(() => {
                    if (isMounted) {
                        setFaviconUrl(`${url.origin}/favicon.ico`);
                    }
                });
        } catch (error) {
            console.error("Invalid URL", error);
        }

        return () => {
            isMounted = false;
        };
    }, [href, setFaviconUrl]);

    return (
        <a
            href={href}
            className={cn(
                "underline underline-offset-2 inline-flex items-center align-middle leading-none",
                "decoration-theme-200 dark:decoration-theme-700",
                "hover:decoration-theme-500 dark:hover:decoration-theme-500",
                className
            )}
            target="_blank"
            rel="noopener noreferrer"
            {...props}
        >
            {faviconUrl ? (
                <img
                    src={faviconUrl}
                    className="w-5 h-5 mr-1 inline-block align-middle opacity-75 m-0"
                    onError={() => setFaviconUrl(null)}
                    alt="favicon"
                />
            ) : (
                <TbWorld className="w-5 h-5 mr-1 inline-block align-middle opacity-75" />
            )}
            <span className="align-middle">{children}</span>
            <GoArrowUpRight className="ml-0 inline-block align-text-top text-sm" />
        </a>
    );
};

export { ExternalLink };