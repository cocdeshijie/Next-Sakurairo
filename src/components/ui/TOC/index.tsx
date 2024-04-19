import React from "react";
import { cn } from "@/utils/cn";

interface TOCProps {
    toc: any[];
}

export default function TOC({ toc }: TOCProps) {
    const renderTOCItems = (items: any[], depth = 0) => {
        return (
            <ul>
                {items.map((item, index) => (
                    <li key={index} className="relative leading-none" style={{ paddingLeft: `${depth * 0.25}rem` }}>
                        {item.url && (
                            <span className="absolute inset-y-[3px] left-0 w-[2px] rounded-sm bg-accent"></span>
                        )}
                        <a
                            href={item.url}
                            className={cn(
                                "relative mb-[1.5px] inline-block min-w-0 max-w-full leading-normal text-neutral-content truncate text-left tabular-nums transition-all duration-500 hover:opacity-80",
                                item.url ? "opacity-100 ml-2" : "opacity-50",
                            )}
                            data-depth={item.depth}
                            title={item.title}
                        >
                            <span className="cursor-pointer">{item.title}</span>
                        </a>
                        {item.items && item.items.length > 0 && renderTOCItems(item.items, depth + 1)}
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <aside className="sticky top-[120px] mt-[120px] h-[calc(100vh-6rem-4.5rem-150px-120px)]">
            <div className="relative h-full">
                <div className="st-toc z-[3] font-sans static ml-4">
                    <ul
                        className="scrollbar-none grow scroll-smooth px-2 max-h-[75vh] absolute h-full min-h-[120px] flex flex-col max-w-52"
                    >
                        {renderTOCItems(toc)}
                    </ul>
                </div>
            </div>
        </aside>
    );
}
