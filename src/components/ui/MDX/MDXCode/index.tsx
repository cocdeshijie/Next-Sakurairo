"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { Pre, RawCode, Inline, highlight, HighlightedCode } from "codehike/code";
import { lineNumbers } from "@/components/ui/MDX/MDXCode/line-number";
import { CopyButton } from "@/components/ui/MDX/MDXCode/copy";
import { atom, useAtom } from "jotai";
import { atomFamily } from "jotai/utils";
import { cn } from "@/utils/cn";

interface MDXCodeblockProps {
    codeblock: RawCode;
}

// Create atom family to manage state for each codeblock
const codeblockAtomFamily = atomFamily((codeblock: RawCode) =>
    atom({
        highlightedCode: null as HighlightedCode | null,
        isLoading: true,
    })
);

const MDXCode = ({ codeblock }: MDXCodeblockProps) => {
    const { theme, resolvedTheme } = useTheme();
    const currentTheme = theme === "system" ? resolvedTheme : theme;

    // Use Jotai atoms from family
    const [codeblockState, setCodeblockState] = useAtom(codeblockAtomFamily(codeblock));

    useEffect(() => {
        let isMounted = true;

        const fetchHighlightedCode = async () => {
            setCodeblockState((prev) => ({ ...prev, isLoading: true }));
            try {
                const selectedTheme =
                    currentTheme === "dark" ? "github-dark" : "slack-ochin";
                const highlighted: HighlightedCode = await highlight(
                    codeblock,
                    selectedTheme
                );

                if (isMounted) {
                    setCodeblockState((prev) => ({ ...prev, highlightedCode: highlighted }));
                }
            } catch (error) {
                console.error("Error during code highlighting:", error);
                if (isMounted) {
                    setCodeblockState((prev) => ({ ...prev, highlightedCode: null }));
                }
            } finally {
                if (isMounted) {
                    setCodeblockState((prev) => ({ ...prev, isLoading: false }));
                }
            }
        };

        fetchHighlightedCode();

        return () => {
            isMounted = false;
        };
    }, [codeblock, currentTheme, setCodeblockState]);

    const commonClasses = cn(
        "overflow-auto bg-theme-200/25 dark:bg-theme-800/25",
        codeblock.meta ? "rounded-t-none rounded-b-md mt-0" : "rounded-md",
        "p-4",
        "font-mono text-sm",
        "text-theme-800 dark:text-theme-200",
        "whitespace-pre-wrap",
    );

    if (codeblockState.isLoading) {
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
                <div className={"relative group"}>
                    <div className={commonClasses}>
                        Loading...
                    </div>
                </div>
            </div>
        );
    }

    if (!codeblockState.highlightedCode) {
        return (
            <div className={"space-y-0 mt-8"}>
                <div className={"relative group"}>
                    <div className={commonClasses}>
                        Failed to load code.
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={"space-y-0 mt-8"}>
            {codeblockState.highlightedCode.meta && (
                <div
                    className={cn(
                        "p-1 rounded-md rounded-b-none",
                        "text-center md:text-left md:pl-8 text-theme-800 dark:text-theme-200 text-sm font-light",
                        "bg-theme-200 dark:bg-theme-800"
                    )}
                >
                    {codeblockState.highlightedCode.meta}
                </div>
            )}
            {/* Wrapper for Pre and CopyButton */}
            <div className={"relative group"}>
                {/* CopyButton positioned at top-right, visible on hover */}
                <CopyButton
                    text={codeblockState.highlightedCode.code}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                />
                <Pre
                    className={cn(
                        "overflow-auto bg-theme-200/25 dark:bg-theme-800/25",
                        codeblockState.highlightedCode.meta
                            ? "rounded-t-none rounded-b-md mt-0"
                            : "rounded-md"
                    )}
                    code={codeblockState.highlightedCode}
                    handlers={[lineNumbers]}
                />
            </div>
        </div>
    );
};

interface InlineCodeProps {
    codeblock: RawCode;
}

// Async inline code component
const MDXInlineCode = ({ codeblock }: InlineCodeProps) => {
    const { theme, resolvedTheme } = useTheme();
    const currentTheme = theme === "system" ? resolvedTheme : theme;

    // Use Jotai atom from family
    const [codeblockState, setCodeblockState] = useAtom(codeblockAtomFamily(codeblock));

    useEffect(() => {
        let isMounted = true;

        const fetchHighlightedCode = async () => {
            setCodeblockState((prev) => ({ ...prev, isLoading: true }));
            try {
                const selectedTheme = currentTheme === "dark" ? "github-dark" : "slack-ochin";
                const highlighted = await highlight(codeblock, selectedTheme);

                if (isMounted) {
                    setCodeblockState((prev) => ({ ...prev, highlightedCode: highlighted }));
                }
            } catch (error) {
                console.error("Error during inline code highlighting:", error);
                if (isMounted) {
                    setCodeblockState((prev) => ({ ...prev, highlightedCode: null }));
                }
            } finally {
                if (isMounted) {
                    setCodeblockState((prev) => ({ ...prev, isLoading: false }));
                }
            }
        };

        fetchHighlightedCode();

        return () => {
            isMounted = false;
        };
    }, [codeblock, currentTheme, setCodeblockState]);

    const defaultHighlightedCode: HighlightedCode = {
        code: "Loading...",
        value: "Loading...",
        lang: "text",
        annotations: [],
        tokens: [],
        meta: "",
        themeName: currentTheme || "light",
        style: {}
    };

    const commonClasses = cn(
        "bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200",
        "px-2 py-1 rounded text-sm"
    );

    if (codeblockState.isLoading) {
        return <Inline code={{ ...defaultHighlightedCode }} className={commonClasses} />;
    }

    if (!codeblockState.highlightedCode) {
        return <Inline code={{ ...defaultHighlightedCode, code: "Failed to load code.", value: "Failed to load code." }} className={commonClasses} />;
    }

    return <Inline code={{ ...codeblockState.highlightedCode }} className={commonClasses} />;
};

export { MDXCode, MDXInlineCode };