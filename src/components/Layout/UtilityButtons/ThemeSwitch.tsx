"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { atom, useAtom } from "jotai";
import { BiMoon, BiSun } from "react-icons/bi";
import { useTheme } from "next-themes";

type ThemeOption = "dark" | "light" | "system";

const themeAtom = atom<ThemeOption>("system");
const themeReadyAtom = atom(false);

type DocumentWithViewTransition = Document & {
    startViewTransition?: (callback: () => void | Promise<void>) => {
        finished: Promise<void>;
    };
};

const ThemeSwitch = () => {
    const [currentTheme, setCurrentTheme] = useAtom(themeAtom);
    const [isThemeReady, setIsThemeReady] = useAtom(themeReadyAtom);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const { resolvedTheme, setTheme, theme } = useTheme();

    useEffect(() => {
        if (!resolvedTheme) {
            return;
        }

        const nextTheme = (theme === "system" ? "system" : resolvedTheme) as ThemeOption;
        setCurrentTheme(nextTheme);
        setIsThemeReady(true);
    }, [resolvedTheme, setCurrentTheme, setIsThemeReady, theme]);

    const getIconTheme = useCallback((): ThemeOption | null => {
        if (!resolvedTheme) {
            return null;
        }

        if (currentTheme === "system") {
            return resolvedTheme as ThemeOption;
        }

        return currentTheme;
    }, [currentTheme, resolvedTheme]);

    const toggleTheme = useCallback(() => {
        if (!resolvedTheme) {
            return;
        }

        const nextTheme = (resolvedTheme === "dark" ? "light" : "dark") as ThemeOption;
        const applyTheme = () => {
            setTheme(nextTheme);
            setCurrentTheme(nextTheme);
        };

        if (typeof document === "undefined") {
            applyTheme();
            return;
        }

        const doc = document as DocumentWithViewTransition;
        const button = buttonRef.current;

        if (button && doc.startViewTransition) {
            const rect = button.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;

            document.documentElement.style.setProperty("--theme-transition-x", `${x}px`);
            document.documentElement.style.setProperty("--theme-transition-y", `${y}px`);

            const transition = doc.startViewTransition(async () => {
                applyTheme();

                await new Promise<void>((resolve) => {
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => resolve());
                    });
                });
            });

            transition.finished.finally(() => {
                document.documentElement.style.removeProperty("--theme-transition-x");
                document.documentElement.style.removeProperty("--theme-transition-y");
            });

            return;
        }

        applyTheme();
    }, [resolvedTheme, setTheme, setCurrentTheme]);

    const iconTheme = getIconTheme();

    if (!isThemeReady || !iconTheme) {
        return null;
    }

    return (
        <button
            ref={buttonRef}
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className={"flex items-center justify-center p-1.5"}
        >
            {iconTheme === "dark"
                ? <BiMoon className={"w-8 h-8 text-theme-500"} />
                : <BiSun className={"w-8 h-8 text-theme-500"} />}
        </button>
    );
};

export default ThemeSwitch;