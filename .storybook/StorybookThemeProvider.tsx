import React, { useEffect } from "react";
import { Decorator } from "@storybook/react";
import { DecoratorHelpers } from '@storybook/addon-themes';
import { ThemeProvider } from 'next-themes';

const { initializeThemeState, pluckThemeFromContext, useThemeParameters } = DecoratorHelpers;

interface ThemeDecoratorOptions {
    themes: Record<string, string>;
    defaultTheme: string;
}

export const withNextThemes: (options: ThemeDecoratorOptions) => Decorator = ({
                                                                                  themes,
                                                                                  defaultTheme,
                                                                              }) => {
    initializeThemeState(Object.keys(themes), defaultTheme);

    return (story, context) => {
        const selectedTheme = pluckThemeFromContext(context);
        const { themeOverride } = useThemeParameters();

        const selected = themeOverride || selectedTheme || defaultTheme;

        useEffect(() => {
            const handleSystemThemeChange = (e: MediaQueryListEvent) => {
                const systemTheme = e.matches ? "dark" : "light";
                if (selected === "system") {
                    document.documentElement.classList.remove(...Object.values(themes));
                    document.documentElement.classList.add(systemTheme);
                }
            };

            const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
            mediaQuery.addEventListener("change", handleSystemThemeChange);

            // Apply the initial system theme
            handleSystemThemeChange(mediaQuery as unknown as MediaQueryListEvent);

            return () => {
                mediaQuery.removeEventListener("change", handleSystemThemeChange);
            };
        }, [selected, themes]);

        useEffect(() => {
            if (selected !== "system") {
                document.documentElement.classList.remove(...Object.values(themes));
                document.documentElement.classList.add(selected);
            }
        }, [selected, themes]);

        return (
            <ThemeProvider attribute="class" defaultTheme={selected}>
                <div>{story(context)}</div>
            </ThemeProvider>
        );
    };
};