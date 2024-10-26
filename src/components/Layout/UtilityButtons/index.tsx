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
                className,
                "transition-all duration-300",
                useVisibility ? (
                        isVisible ?
                            "transform scale-100 opacity-100 translate-y-0" :
                            "transform scale-50 opacity-0 translate-y-4 pointer-events-none"
                    ) :
                    "transform scale-100 translate-y-0"
            )}
        >
            <div
                className={cn(
                    "inline-flex items-center justify-center cursor-pointer rounded-md",
                    "backdrop-blur drop-shadow-lg shadow-lg",
                    "border border-transparent bg-theme-200/25 dark:bg-theme-800/25",
                    "ring-1 ring-theme-700/15 dark:ring-theme-300/15",
                    "hover:scale-110 hover:shadow-md hover:shadow-theme-500/25 duration-200"
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
            <ButtonWrapper className="fixed z-30 bottom-8 right-0 mr-2 md:mr-8">
                <ThemeSwitch/>
            </ButtonWrapper>

            <ButtonWrapper className="fixed z-30 bottom-8 right-0 mr-2 md:mr-8 mb-14" useVisibility>
                <ToTop/>
            </ButtonWrapper>
        </>
    );
};
