"use client";

import React from "react";
import { cn } from "@/utils/cn";
import { config } from "#site/content";
import { atom, useAtom } from "jotai";
import Link from "next/link";

const logoHoverAtom = atom(false);

const Logo = () => {
    const [logoHover, setLogoHover] = useAtom(logoHoverAtom);

    const handleMouseEnter = () => {
        setLogoHover(true);
    };

    const handleMouseLeave = () => {
        setLogoHover(false);
    };

    return (
        <Link href="/">
            <div
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className={"relative z-10 flex justify-center w-full"}
            >
                <div className={"flex flex-col items-center font-medium"}>
                    <div className={"flex items-end space-x-1.5 md:text-xl"}>
                        <div className={"relative"}>
                            <div
                                className={cn(
                                    "pt-3 pb-0.5 rounded-xl items-center",
                                    "bg-theme-100/25 text-theme-500 dark:text-theme-500",
                                    logoHover ? "bg-theme-500 text-white dark:text-white" : "text-theme-500"
                                )}
                            >
                                {config.header_logo.text_front}
                            </div>
                        </div>
                        <div
                            className={cn(
                                "pb-0.5 text-theme-500 dark:text-white",
                                logoHover && "animate-spin"
                            )}
                        >
                            {config.header_logo.text_middle}
                        </div>
                        <div className={"pb-0.5 text-theme-500 dark:text-white"}>
                            {config.header_logo.text_end}
                        </div>
                    </div>
                    {logoHover && (
                        <div className={cn(
                            "absolute -bottom-2.5 left-1/2 transform -translate-x-1/2 duration-500 transition-opacity",
                            "text-[10px] font-normal text-theme-500 dark:text-white whitespace-nowrap"
                        )}>
                            {config.header_logo.text_bottom}
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}

export default Logo;