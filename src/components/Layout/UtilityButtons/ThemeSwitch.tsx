import React, { useRef, useEffect, useCallback } from "react";
import { atom, useAtom } from "jotai";
import { BiSun , BiMoon, BiDesktop, BiMobile } from "react-icons/bi";
import { useTheme } from "next-themes";
import { cn } from "@/utils/cn";
import * as Portal from "@radix-ui/react-portal";

type ThemeOption = "dark" | "light" | "system";

const themeAtom = atom<ThemeOption>("system");
const isHoldingAtom = atom(false);
const highlightedOptionAtom = atom<ThemeOption | null>(null);
const resolveThemeAtom = atom(false);

const ThemeSwitch = () => {
    const [switchTheme, setSwitchTheme] = useAtom(themeAtom);
    const [isHolding, setIsHolding] = useAtom(isHoldingAtom);
    const [highlightedOption, setHighlightedOption] = useAtom(highlightedOptionAtom);
    const [isThemeResolved, setIsThemeResolved] = useAtom(resolveThemeAtom);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const stadiumRef = useRef<HTMLDivElement | null>(null);
    const holdTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isClickedRef = useRef(false);
    const { setTheme, resolvedTheme } = useTheme();

    useEffect(() => {
        if (resolvedTheme) {
            setSwitchTheme(resolvedTheme as ThemeOption);
            setIsThemeResolved(true);
        }
    }, [resolvedTheme, setIsThemeResolved, setSwitchTheme]);

    const getSelectedOption = useCallback((mouseX: number, mouseY: number): ThemeOption | null => {
        if (stadiumRef.current) {
            const { left, top, width, height } = stadiumRef.current.getBoundingClientRect();
            const centerX = left + width / 2;
            const centerY = top + height / 2;

            const distances = [
                { option: "dark", distance: Math.sqrt(Math.pow(mouseX - (left + width / 6), 2) + Math.pow(mouseY - centerY, 2)) },
                { option: "system", distance: Math.sqrt(Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2)) },
                { option: "light", distance: Math.sqrt(Math.pow(mouseX - (left + width * 5 / 6), 2) + Math.pow(mouseY - centerY, 2)) },
            ];

            return distances.reduce((prev, curr) => (prev.distance < curr.distance ? prev : curr)).option as ThemeOption;
        }
        return null;
    }, []);

    const handleMouseDown = () => {
        isClickedRef.current = true;
        holdTimeoutRef.current = setTimeout(() => {
            if (isClickedRef.current) {
                setIsHolding(true);
            }
        }, 500);
    };

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (isHolding) {
            const selectedOption = getSelectedOption(e.clientX, e.clientY);
            setHighlightedOption(selectedOption);
        }
    }, [isHolding, getSelectedOption, setHighlightedOption]);

    const handleMouseUp = useCallback((e: MouseEvent) => {
        if (holdTimeoutRef.current) {
            clearTimeout(holdTimeoutRef.current);
        }
        if (isHolding) {
            const selectedOption = getSelectedOption(e.clientX, e.clientY);
            const newTheme = selectedOption || switchTheme;
            setSwitchTheme(newTheme);
            setTheme(newTheme);
            setIsHolding(false);
        }
        isClickedRef.current = false;
    }, [isHolding, getSelectedOption, switchTheme, setSwitchTheme, setTheme, setIsHolding]);

    useEffect(() => {
        if (isHolding) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
        }

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isHolding, handleMouseMove, handleMouseUp]);

    const handleClick = () => {
        if (!isHolding) {
            const newTheme = resolvedTheme === "dark" ? "light" : "dark";
            setSwitchTheme(newTheme);
            setTheme(newTheme);
        }
    };

    const getThemeIcon = (theme: ThemeOption) => {
        switch (theme) {
            case "dark":
                return <BiMoon className={"w-8 h-8 text-theme-500"}/>;
            case "light":
                return <BiSun className={"w-8 h-8 text-theme-500"}/>;
            case "system":
                return(
                    <>
                        <BiDesktop className={"w-8 h-8 text-theme-500 hidden md:block"}/>
                        <BiMobile className={"w-8 h-8 text-theme-500 block md:hidden"}/>
                    </>
                );
        }
    };

    const getButtonThemeIcon = () => {
        if (switchTheme === "system") {
            return resolvedTheme === "dark"
                ? <BiMoon className={"w-8 h-8 text-theme-500"} />
                : <BiSun className={"w-8 h-8 text-theme-500"} />;
        }
        return getThemeIcon(switchTheme);
    };

    if (!isThemeResolved) {
        return null; // Render nothing until the theme is resolved
    }

    return (
        <>
            <button
                ref={buttonRef}
                onMouseDown={handleMouseDown}
                onClick={handleClick}
                className={"flex items-center justify-center p-1.5"}
                onMouseUp={(e) => handleMouseUp(e.nativeEvent)}
            >
                {getButtonThemeIcon()}
            </button>
            <Portal.Root>
                <div
                    ref={stadiumRef}
                    className={cn(
                        "fixed mt-2 z-50",
                        "rounded-md flex justify-between items-center p-1.5",
                        "bg-theme-200/75 dark:bg-theme-800/75 backdrop-blur-3xl",
                        "transition-opacity duration-300",
                        isHolding ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
                    )}
                    style={{
                        top: buttonRef.current?.getBoundingClientRect().bottom ?? 0,
                        left: buttonRef.current ?
                            buttonRef.current.getBoundingClientRect().left +
                            buttonRef.current.offsetWidth / 2 -
                            (stadiumRef.current?.offsetWidth ?? 0) / 2
                            : 0,
                        transform: 'translateY(8px)',
                    }}
                >
                    {(["dark", "system", "light"] as ThemeOption[]).map((option) => (
                        <span
                            key={option}
                            className={cn(
                                highlightedOption === option && "text-blue-500 bg-theme-300/25",
                                "p-2 rounded-md"
                            )}>
                        {getThemeIcon(option)}
                    </span>
                    ))}
                </div>
            </Portal.Root>
        </>
    );
};

export default ThemeSwitch;