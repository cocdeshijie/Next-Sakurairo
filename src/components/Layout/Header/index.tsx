"use client"

import { cn } from "@/utils/cn";
import Logo from "@/components/Layout/Header/Logo";
import HeaderDialog from "@/components/Layout/Header/HeaderDialog";
import { config } from "#site/content";
import type { Config } from "#site/content";
import * as HoverCard from "@radix-ui/react-hover-card";
import { atom, useAtom } from "jotai";
import { useEffect } from "react";

const hoverAtom = atom(false);
const scrollAtom = atom(false);

const Header = () => {
    const [isHovered, setIsHovered] = useAtom(hoverAtom);
    const [isScrolled, setIsScrolled] = useAtom(scrollAtom);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [setIsScrolled]);

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 p-5 md:py-3 md:px-8 md:top-4 md:left-16 md:right-16 z-50",
                "bg-theme-100/50 dark:bg-theme-800/50 backdrop-blur-lg duration-500",
                "rounded-none md:rounded-xl shadow-md flex justify-between items-center",
                {"md:backdrop-blur-none md:bg-transparent md:dark:bg-transparent md:shadow-none": !(isHovered || isScrolled)}
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <HeaderDialog />

            <div className={"absolute left-1/2 transform -translate-x-1/2 md:static md:transform-none"}>
                <Logo />
            </div>

            <div className={cn("hidden md:flex w-full absolute items-center", "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2")}>
                <nav className={"relative w-full"}>
                    <ul className={"flex justify-center items-center space-x-4"}>
                        {config.header_navigation.map((item: Config) => (
                            <li key={item.title}>
                                {item.children ? (
                                    <HoverCard.Root>
                                        <HoverCard.Trigger href={item.href}
                                                           className={"dark:text-white cursor-pointer"}
                                        >
                                            {item.title}
                                        </HoverCard.Trigger>
                                        <HoverCard.Portal>
                                            <HoverCard.Content
                                                className={cn(
                                                    "min-w-max max-w-[calc(100vw-40px)]",
                                                    "rounded-md shadow-md p-1 mt-8",
                                                    "bg-theme-100/75 dark:bg-theme-800/75 backdrop-blur-md"
                                                )}
                                            >
                                                <ul className={"space-y-1"}>
                                                    {item.children.map((child: Config) => (
                                                        <li key={child.title} className={"text-center"}>
                                                            <a href={child.href} className={cn("block px-3 py-1 list-none", "dark:text-white")}>
                                                                {child.title}
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </HoverCard.Content>
                                        </HoverCard.Portal>
                                    </HoverCard.Root>
                                ) : (
                                    <a href={item.href} className={"dark:text-white"}>
                                        {item.title}
                                    </a>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;