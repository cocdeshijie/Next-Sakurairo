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
const highlightedCodeAtomFamily = atomFamily((codeblock: RawCode) => atom<HighlightedCode | null>(null));
const isLoadingAtomFamily = atomFamily((codeblock: RawCode) => atom<boolean>(true));

export function MDXCode({ codeblock }: MDXCodeProps) {
    const { theme, resolvedTheme } = useTheme();
    const currentTheme = theme === "system" ? resolvedTheme : theme;

    // Use Jotai atoms from families
    const [highlightedCode, setHighlightedCode] = useAtom(highlightedCodeAtomFamily(codeblock));
    const [isLoading, setIsLoading] = useAtom(isLoadingAtomFamily(codeblock));

    useEffect(() => {
        let isMounted = true;

        const fetchHighlightedCode = async () => {
            setIsLoading(true);
            try {
                const selectedTheme = currentTheme === "dark" ? "github-dark" : "slack-ochin";
                const highlighted: HighlightedCode = await highlight(codeblock, selectedTheme);

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

    const getBackgroundColor = (): string => {
        switch (currentTheme) {
            case "dark":
                return "bg-theme-800/25";
            case "light":
                return "bg-theme-200/25";
            default:
                return "bg-theme-800/25";
        }
    };

    const backgroundColor = getBackgroundColor();

    if (isLoading) {
        return (
            <div className={cn("overflow-auto", backgroundColor)}>
                Loading...
            </div>
        );
    }

    if (!highlightedCode) {
        return (
            <div className={cn("overflow-auto", backgroundColor)}>
                Failed to load code.
            </div>
        );
    }

    return (
        <div className={"relative space-y-0 mt-8"}>
            <div className={cn(
                "text-center text-zinc-400 text-sm pt-2 rounded-md rounded-b-none",
                backgroundColor
            )}>
                {highlightedCode.meta}
            </div>
            <CopyButton text={highlightedCode.code} />
            <Pre
                className={cn(
                    "overflow-auto rounded-md rounded-t-none",
                    backgroundColor
                )}
                code={highlightedCode}
                handlers={[lineNumbers]}
            />
        </div>
    );
}
