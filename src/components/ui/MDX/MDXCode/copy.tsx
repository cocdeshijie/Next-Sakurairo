"use client"

import { LuCopy, LuCheck } from "react-icons/lu";
import { useState } from "react"

export function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false)

    return (
        <button
            className="hover:bg-gray-400/20 z-50 p-1 rounded absolute top-1 right-1 text-zinc-200"
            aria-label="Copy to clipboard"
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