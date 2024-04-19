"use client"

import React, { useEffect } from "react";
import { cn } from "@/utils/cn";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { atom, useAtom } from 'jotai';

interface TOCProps {
    toc: any[];
}

const activeIdsAtom = atom<string[]>([]);

// TODO: right now active item would not auto scroll (its rare to have so many headings in post)
export default function TOC({ toc }: TOCProps) {
    const [activeIds, setActiveIds] = useAtom(activeIdsAtom);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                const newActiveIds: string[] = [...activeIds];

                entries.forEach(entry => {
                    const id = entry.target.id;

                    if (entry.isIntersecting) {
                        if (!newActiveIds.includes(id)) {
                            newActiveIds.push(id);
                        }
                    } else {
                        const index = newActiveIds.indexOf(id);
                        if (index > -1) {
                            newActiveIds.splice(index, 1);
                        }
                    }
                });

                setActiveIds(newActiveIds);
            },
            { rootMargin: "0px", threshold: 0.1 }
        );

        document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(header => {
            observer.observe(header);
        });

        return () => {
            observer.disconnect();
        };
    }, [activeIds, setActiveIds]);

    const renderTOCItems = (items: any[], depth = 0) => {
        return (
            <ul>
                {items.map((item, index) => {
                    const isActive = typeof item.url === "string" && activeIds.includes(item.url.substring(1));
                    return (
                        <li key={index} className={"relative leading-none"} style={{ paddingLeft: `${depth * 0.25}rem` }}>
                            {item.url && (
                                <span className={"absolute inset-y-1 left-0 w-1 rounded-sm bg-theme-500/10"}></span>
                            )}
                            <a
                                href={item.url as string}
                                className={cn(
                                    "relative inline-block min-w-0 max-w-full",
                                    "truncate text-left leading-normal",
                                    "tabular-nums transition-all duration-500 hover:opacity-80",
                                    isActive ? "text-theme-500 opacity-100 ml-2" : "opacity-50",
                                )}
                                data-depth={item.depth}
                                title={item.title}
                            >
                                <span className={"cursor-pointer"}>{item.title}</span>
                            </a>
                            {item.items && item.items.length > 0 && renderTOCItems(item.items, depth + 1)}
                        </li>
                    );
                })}
            </ul>
        );
    };

    return (
        <aside className={"sticky top-28 mt-20"}>
            <div className={"relative h-full"}>
                <ScrollArea.Root className={"w-3/4"}>
                    <ScrollArea.Viewport className={"max-h-[60vh] flex flex-col px-2 rounded-lg"}>
                        <ul className={"grow scroll-smooth relative h-full"}>
                            {renderTOCItems(toc)}
                        </ul>
                    </ScrollArea.Viewport>
                    <ScrollArea.Scrollbar orientation={"vertical"}
                                          className={"bg-theme-200/50 dark:bg-theme-800/50 rounded p-0.5"}
                    >
                        <ScrollArea.Thumb className={"bg-theme-500/50 rounded p-0.5"}/>
                    </ScrollArea.Scrollbar>
                    <ScrollArea.Corner/>
                </ScrollArea.Root>
            </div>
        </aside>
    );
}