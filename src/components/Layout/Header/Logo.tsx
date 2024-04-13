"use client";

import React, { useState } from "react";
import { cn } from "@/utils/cn";
import { blogConfig } from "@/config";

const Logo = () => {
    const [logoHover, setLogoHover] = useState(false);

    const handleMouseEnter = () => {
        setLogoHover(true);
    };

    const handleMouseLeave = () => {
        setLogoHover(false);
    };

    return (
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
                                "pt-3 pb-1 rounded-xl items-center",
                                logoHover ? "bg-theme-500 text-white" : "bg-transparent text-theme-500 dark:text-white"
                            )}
                        >
                            {blogConfig.header_logo.text_front}
                        </div>
                    </div>
                    <div
                        className={cn(
                            "pb-1 text-theme-500 dark:text-white",
                            logoHover && "animate-spin"
                        )}
                    >
                        {blogConfig.header_logo.text_middle}
                    </div>
                    <div className={"pb-1 text-theme-500 dark:text-white"}>
                        {blogConfig.header_logo.text_end}
                    </div>
                </div>
                {logoHover && (
                    <div className={cn(
                        "absolute -bottom-2.5 left-1/2 transform -translate-x-1/2 duration-500 transition-opacity",
                        "text-[10px] font-normal text-theme-500 dark:text-white whitespace-nowrap"
                    )}>
                        {blogConfig.header_logo.text_bottom}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Logo;
