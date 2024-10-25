"use client";

import { useEffect, useCallback } from "react";
import { atom, useAtom } from "jotai";
import { BiSolidArrowToTop } from "react-icons/bi";
import { cn } from "@/utils/cn";

const isVisibleAtom = atom(false);

const ToTop = () => {
    const [isVisible, setIsVisible] = useAtom(isVisibleAtom);

    const toggleVisibility = useCallback(() => {
        if (window.scrollY > 200) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [setIsVisible]);

    useEffect(() => {
        toggleVisibility();
        window.addEventListener("scroll", toggleVisibility);
        return () => {
            window.removeEventListener("scroll", toggleVisibility);
        };
    }, [toggleVisibility]);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    return (
        <div
            onClick={scrollToTop}
            className={cn(
                "fixed z-30 bottom-8 right-0 mr-4 lg:mr-8",
                "transition-opacity duration-300",
                isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
        >
            <div
                className={cn(
                    "inline-flex items-center justify-center rounded-md p-2.5 cursor-pointer",
                    "backdrop-blur drop-shadow-lg",
                    "bg-theme-200/50 dark:bg-theme-800/50",
                    "hover:scale-110 hover:shadow-md hover:shadow-theme-500/25 duration-200"
                )}
            >
                <BiSolidArrowToTop className={"text-theme-500 w-6 h-6"} />
            </div>
        </div>
    );
};

export { ToTop };
