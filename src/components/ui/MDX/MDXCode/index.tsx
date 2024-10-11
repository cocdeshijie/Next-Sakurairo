"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { Pre, RawCode, highlight, HighlightedCode } from "codehike/code";
import { lineNumbers } from "@/components/ui/MDX/MDXCode/line-number";
import { CopyButton } from "@/components/ui/MDX/MDXCode/copy";
import { atom, useAtom } from "jotai";
import { atomFamily } from "jotai/utils";
import { cn } from "@/utils/cn";

interface MDXCodeProps {
    codeblock: RawCode;
}

// Create atom families to manage state for each codeblock
const highlightedCodeAtomFamily = atomFamily((codeblock: RawCode) =>
    atom<HighlightedCode | null>(null)
);
const isLoadingAtomFamily = atomFamily((codeblock: RawCode) =>
    atom<boolean>(true)
);

export function MDXCode({ codeblock }: MDXCodeProps) {
    const { theme, resolvedTheme } = useTheme();
    const currentTheme = theme === "system" ? resolvedTheme : theme;

    // Use Jotai atoms from families
    const [highlightedCode, setHighlightedCode] = useAtom(
        highlightedCodeAtomFamily(codeblock)
    );
    const [isLoading, setIsLoading] = useAtom(isLoadingAtomFamily(codeblock));

    useEffect(() => {
        let isMounted = true;

        const fetchHighlightedCode = async () => {
            setIsLoading(true);
            try {
                const selectedTheme =
                    currentTheme === "dark" ? "github-dark" : "slack-ochin";
                const highlighted: HighlightedCode = await highlight(
                    codeblock,
                    selectedTheme
                );

                if (isMounted) {
                    setHighlightedCode(highlighted);
                }
            } catch (error) {
                console.error("Error during code highlighting:", error);
                if (isMounted) {
                    setHighlightedCode(null);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchHighlightedCode();

        return () => {
            isMounted = false;
        };
    }, [codeblock, currentTheme, setHighlightedCode, setIsLoading]);

    const commonClasses = cn(
        "overflow-auto bg-theme-200/25 dark:bg-theme-800/25",
        codeblock.meta ? "rounded-t-none rounded-b-md mt-0" : "rounded-md",
        "p-4",
        "font-mono text-sm",
        "text-theme-800 dark:text-theme-200",
        "whitespace-pre-wrap",
    );

    if (isLoading) {
        return (
            <div className={"space-y-0 mt-8"}>
                {codeblock.meta && (
                    <div
                        className={cn(
                            "p-1 rounded-md rounded-b-none",
                            "text-center md:text-left md:pl-4 text-theme-800 dark:text-theme-200 text-sm font-light",
                            "bg-theme-200 dark:bg-theme-800"
                        )}
                    >
                        {codeblock.meta}
                    </div>
                )}
                <div className="relative group">
                    <div className={commonClasses}>
                        Loading...
                    </div>
                </div>
            </div>
        );
    }

    if (!highlightedCode) {
        return (
            <div className={"space-y-0 mt-8"}>
                <div className="relative group">
                    <div className={commonClasses}>
                        Failed to load code.
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={"space-y-0 mt-8"}>
            {highlightedCode.meta && (
                <div
                    className={cn(
                        "p-1 rounded-md rounded-b-none",
                        "text-center md:text-left md:pl-8 text-theme-800 dark:text-theme-200 text-sm font-light",
                        "bg-theme-200 dark:bg-theme-800"
                    )}
                >
                    {highlightedCode.meta}
                </div>
            )}
            {/* Wrapper for Pre and CopyButton */}
            <div className="relative group">
            {/* CopyButton positioned at top-right, visible on hover */}
                <CopyButton
                    text={highlightedCode.code}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                />
                <Pre
                    className={cn(
                        "overflow-auto bg-theme-200/25 dark:bg-theme-800/25",
                        highlightedCode.meta
                            ? "rounded-t-none rounded-b-md mt-0"
                            : "rounded-md"
                    )}
                    code={highlightedCode}
                    handlers={[lineNumbers]}
                />
            </div>
        </div>
    );
}