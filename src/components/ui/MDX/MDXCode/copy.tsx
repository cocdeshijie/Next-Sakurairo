"use client"

import { LuCopy, LuCheck } from "react-icons/lu";
import { useState } from "react"
import { cn } from "@/utils/cn";

export function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false)

    return (
        <button
            className={cn(
                "z-50 p-1 rounded absolute top-1 right-1",
                "text-theme-900 dark:text-theme-100",
                "hover:bg-theme-800/20 dark:hover:bg-theme-200/20",
            )}
            aria-label={"Copy to clipboard"}
            onClick={() => {
                navigator.clipboard.writeText(text)
                setCopied(true)
                setTimeout(() => setCopied(false), 1200)
            }}
        >
            {copied ? <LuCheck size={16} /> : <LuCopy size={16} />}
        </button>
    )
}