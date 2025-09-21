"use client"

import Link from "next/link";
import { cn } from "@/utils/cn";
import Logo from "@/components/Layout/Header/Logo";
import HeaderDialog from "@/components/Layout/Header/HeaderDialog";
import { config } from "#site/content";
import type { Config } from "#site/content";
import * as HoverCard from "@radix-ui/react-hover-card";
import { atom, useAtom } from "jotai";
import { useEffect } from "react";
import { easings, useTransition, animated } from "@react-spring/web";

const hoverAtom = atom(false);
const scrollAtom = atom(false);
const hoverCardAtom = atom(false);

const Header = () => {
    const [isHovered, setIsHovered] = useAtom(hoverAtom);
    const [isScrolled, setIsScrolled] = useAtom(scrollAtom);
    const [hoverCardIsHovered, setHoverCardIsHovered] = useAtom(hoverCardAtom);

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

    const transitions = useTransition(hoverCardIsHovered, {
        from: { opacity: 0, y: -20 }, // Start from a slightly higher position (above)
        enter: { opacity: 1, y: 0 },  // Drop down to the default position
        leave: { opacity: 0, y: -20 }, // Move back up on exit
        config: {
            duration: 100,
            easing: easings.easeInOutCubic
        },
    });

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

            <div className={cn(
                "hidden md:flex w-full absolute items-center",
                "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            )}>
                <nav className={"relative w-full"}>
                    <ul className={"flex justify-center items-center space-x-4"}>
                        {config.header_navigation.map((item: Config) => (
                            <li key={item.title} className={"relative group"}>
                                {item.children ? (
                                    <HoverCard.Root openDelay={200}
                                                    closeDelay={100}
                                                    open={hoverCardIsHovered}
                                                    onOpenChange={setHoverCardIsHovered}>
                                        <span className={"hover:underline group-hover:no-underline"}>
                                            {item.href.startsWith("/") ? (
                                                <HoverCard.Trigger asChild>
                                                    <Link
                                                        href={item.href}
                                                        className="font-semibold text-theme-500 dark:text-white"
                                                    >
                                                        {item.title}
                                                    </Link>
                                                </HoverCard.Trigger>
                                            ) : (
                                                <HoverCard.Trigger asChild>
                                                    <a href={item.href}
                                                       className={"font-semibold text-theme-500 dark:text-white"}
                                                       target={"_blank"}>
                                                        {item.title}
                                                    </a>
                                                </HoverCard.Trigger>
                                            )}
                                        </span>
                                        <div className={cn(
                                            "absolute bottom-0 left-0 w-0 h-0.5 bg-theme-500 rounded-r",
                                            "transition-all duration-300 group-hover:w-full")}/>
                                        {transitions((styles, transitionsItem) =>
                                            transitionsItem ? (
                                                <HoverCard.Portal forceMount>
                                                    <HoverCard.Content forceMount asChild>
                                                        <animated.div
                                                            style={styles}
                                                            className={cn(
                                                            "min-w-max max-w-[calc(100vw-40px)]",
                                                            "rounded-md shadow-md p-1 mt-8 z-50",
                                                            "ring-1 ring-theme-700/15 dark:ring-theme-300/15",
                                                            "border border-transparent",
                                                            "bg-theme-100/50 dark:bg-theme-800/50 backdrop-blur-lg"
                                                        )}>
                                                            <ul className={"space-y-1"}>
                                                                {item.children.map((child: Config) => (
                                                                    <li key={child.title} className={"text-center"}>
                                                                        {item.href.startsWith('/') ? (
                                                                            <Link href={child.href}
                                                                               className={cn(
                                                                                   "block px-3 py-1 list-none",
                                                                                   "text-theme-500 dark:text-white rounded duration-200",
                                                                                   "hover:bg-theme-300/25 dark:hover:bg-theme-700/25"
                                                                               )}>
                                                                                {child.title}
                                                                            </Link>
                                                                            ) : (
                                                                            <a href={child.href}
                                                                               className={cn(
                                                                                   "block px-3 py-1 list-none",
                                                                                   "text-theme-500 dark:text-white rounded duration-200",
                                                                                   "hover:bg-theme-300/25 dark:hover:bg-theme-700/25"
                                                                               )}>
                                                                                {child.title}
                                                                            </a>
                                                                        )}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </animated.div>
                                                    </HoverCard.Content>
                                                </HoverCard.Portal>
                                            ) : null,
                                        )}
                                    </HoverCard.Root>
                                ) : (
                                    <>
                                        <span className={"hover:underline group-hover:no-underline"}>
                                             {item.href.startsWith('/') ? (
                                                 <Link href={item.href}
                                                       className={"font-semibold text-theme-500 dark:text-white"}>
                                                     {item.title}
                                                 </Link>
                                             ) : (
                                                 <a href={item.href}
                                                    className={"font-semibold text-theme-500 dark:text-white"}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                 >
                                                     {item.title}
                                                 </a>
                                             )}
                                        </span>
                                        <div className={cn(
                                            "absolute bottom-0 left-0 w-0 h-0.5 bg-theme-500 rounded-r",
                                            "transition-all duration-300 group-hover:w-full")}/>
                                    </>
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