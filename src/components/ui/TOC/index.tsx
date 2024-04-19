"use client"

import React, { useEffect } from "react";
import { cn } from "@/utils/cn";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { atom, useAtom } from 'jotai';

interface TOCProps {
    toc: any[];
}

const activeIdsAtom = atom<string[]>([]);

export default function TOC({ toc }: TOCProps) {
    const [activeIds, setActiveIds] = useAtom(activeIdsAtom);

    useEffect(() => {
        const headers = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const headerElements = Array.from(headers).map(header => ({
            element: header,
            id: header.id,
            intersecting: false
        }));

        const observer = new IntersectionObserver(
            entries => {
                let atLeastOneIntersecting = false;
                entries.forEach(entry => {
                    const header = headerElements.find(h => h.id === entry.target.id);
                    if (header) {
                        header.intersecting = entry.isIntersecting;
                        if (entry.isIntersecting) {
                            atLeastOneIntersecting = true;
                            if (!activeIds.includes(header.id)) {
                                setActiveIds(prev => [...prev, header.id]);
                            }
                        } else {
                            setActiveIds(prev => prev.filter(id => id !== header.id));
                        }
                    }
                });

                if (!atLeastOneIntersecting) {
                    const nearestHeader = headerElements.reduce((nearest, header) => {
                        const rect = header.element.getBoundingClientRect();
                        const top = Math.abs(rect.top);
                        if (nearest === null || top < nearest.top) {
                            return { id: header.id, top: top };
                        }
                        return nearest;
                    }, { id: '', top: Number.POSITIVE_INFINITY } as { id: string, top: number });

                    if (nearestHeader && nearestHeader.id) {
                        setActiveIds([nearestHeader.id]);
                    }
                }
            },
            { rootMargin: "0px", threshold: 0.1 }
        );

        headerElements.forEach(header => {
            observer.observe(header.element);
        });

        return () => {
            observer.disconnect();
        };
    }, [activeIds, setActiveIds]);



    const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, url: string) => {
        event.preventDefault();
        const targetId = url.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            const topOffset = window.innerHeight * 0.15; // 15% from the top of the screen
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - topOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    };

    const renderTOCItems = (items: any[], depth = 0) => {
        return (
            <ul>
                {items.map((item, index) => {
                    const isActive = typeof item.url === "string" && activeIds.includes(item.url.substring(1));
                    return (
                        <li key={index} className={"relative leading-none"} style={{ paddingLeft: `${depth * 0.25}rem` }}>
                            {item.url && (
                                <span className={"absolute inset-y-1 left-0 w-1 rounded-sm"}></span>
                            )}
                            <a
                                href={item.url as string}
                                onClick={(e) => handleClick(e, item.url as string)}
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
