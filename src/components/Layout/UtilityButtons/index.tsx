"use client";

import { ReactNode, useCallback, useEffect, useId } from "react";
import { cn } from "@/utils/cn";
import { atom, useAtom } from "jotai";
import { atomFamily } from "jotai/utils";
import ToTop from "./ToTop";
import ThemeSwitch from "./ThemeSwitch";

interface ButtonWrapperProps {
    children: ReactNode;
    className?: string;
    useVisibility?: boolean; // Optional prop to control visibility logic
}

const isVisibleAtomFamily = atomFamily((id: string) => atom(false));

const ButtonWrapper = ({ children, className, useVisibility = false }: ButtonWrapperProps) => {
    const id = useId();
    const [isVisible, setIsVisible] = useAtom(isVisibleAtomFamily(id));

    const toggleVisibility = useCallback(() => {
        if (window.scrollY > 100) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [setIsVisible]);

    // Only run visibility logic if useVisibility is true
    useEffect(() => {
        if (useVisibility) {
            toggleVisibility();
            window.addEventListener("scroll", toggleVisibility);
            return () => {
                window.removeEventListener("scroll", toggleVisibility);
            };
        }
    }, [toggleVisibility, useVisibility]);

    return (
        <div
            className={cn(
                className, // External layout control (like margin) can be passed here
                "transition-opacity duration-300",
                useVisibility ? (isVisible ? "opacity-100" : "opacity-0 pointer-events-none") : "opacity-100" // Always show if useVisibility is false
            )}
        >
            <div
                className={cn(
                    "inline-flex items-center justify-center cursor-pointer rounded-md", // Flex centering and cursor styles are still provided
                    "backdrop-blur drop-shadow-lg", // Visual styles remain here
                    "bg-theme-200/50 dark:bg-theme-800/50",
                    "hover:scale-110 hover:shadow-md hover:shadow-theme-500/25 duration-200" // Hover effect and transitions
                )}
            >
                {children}
            </div>
        </div>
    );
};


export const UtilityButtons = () => {
    return (
        <>
            <ButtonWrapper className="fixed z-30 bottom-8 right-0 mr-2 lg:mr-8">
                <ThemeSwitch />
            </ButtonWrapper>

            <ButtonWrapper className="fixed z-30 bottom-8 right-0 mr-2 lg:mr-8 mb-14" useVisibility>
                <ToTop />
            </ButtonWrapper>
        </>
    );
};
