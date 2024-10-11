"use client"

import { LuCopy, LuCheck } from "react-icons/lu";
import { atom, useAtom } from "jotai";
import { atomFamily } from "jotai/utils";
import { cn } from "@/utils/cn";

interface CopyButtonProps {
    text: string;
    className?: string; // Optional className prop
}

// Atom family to create an atom for each instance of CopyButton
const copiedAtomFamily = atomFamily(() => {
    return atom(false);
});

export function CopyButton({ text, className }: CopyButtonProps) {
    // Using Jotai atom with Jotai family to manage the copied state for each instance
    const [copied, setCopied] = useAtom(copiedAtomFamily(text));

    return (
        <button
            className={cn(
                "z-50 p-1 rounded",
                "text-theme-900 dark:text-theme-100",
                "hover:bg-theme-800/20 dark:hover:bg-theme-200/20",
                className // Apply additional classes
            )}
            aria-label={"Copy to clipboard"}
            onClick={() => {
                navigator.clipboard.writeText(text);
                setCopied(true);
                setTimeout(() => setCopied(false), 1200);
            }}
        >
            {copied ? <LuCheck size={16} /> : <LuCopy size={16} />}
        </button>
    );
}