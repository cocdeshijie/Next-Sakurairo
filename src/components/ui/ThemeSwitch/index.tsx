import React, { useRef, useEffect } from "react";
import { atom, useAtom } from "jotai";
import { FaMoon, FaSun, FaDesktop } from "react-icons/fa";
import { useTheme } from "next-themes";

type ThemeOption = "dark" | "light" | "system";

const themeAtom = atom<ThemeOption>(
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
);
const isHoldingAtom = atom(false);
const highlightedOptionAtom = atom<ThemeOption | null>(null);
const positionAtom = atom<"top" | "bottom" | "left" | "right">("bottom");

const ThemeSwitch = () => {
    const [switchTheme, setSwitchTheme] = useAtom(themeAtom);
    const [isHolding, setIsHolding] = useAtom(isHoldingAtom);
    const [highlightedOption, setHighlightedOption] = useAtom(highlightedOptionAtom);
    const [position, setPosition] = useAtom(positionAtom);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const stadiumRef = useRef<HTMLDivElement | null>(null);
    const holdTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isClickedRef = useRef(false);
    const { setTheme, resolvedTheme } = useTheme();

    useEffect(() => {
        const updatePosition = () => {
            if (buttonRef.current && stadiumRef.current) {
                const { bottom, top, right } = buttonRef.current.getBoundingClientRect();
                const { height, width } = stadiumRef.current.getBoundingClientRect();
                const { innerHeight, innerWidth } = window;

                setPosition(
                    bottom + height <= innerHeight
                        ? "bottom"
                        : top - height >= 0
                            ? "top"
                            : right + width <= innerWidth
                                ? "right"
                                : "left"
                );
            }
        };

        if (isHolding) {
            updatePosition();
            window.addEventListener("resize", updatePosition);
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
        }

        return () => {
            window.removeEventListener("resize", updatePosition);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isHolding]);

    const getSelectedOption = (mouseX: number, mouseY: number): ThemeOption | null => {
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
    };

    const handleMouseDown = () => {
        isClickedRef.current = true;
        holdTimeoutRef.current = setTimeout(() => {
            if (isClickedRef.current) {
                setIsHolding(true);
            }
        }, 500);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (isHolding) {
            const selectedOption = getSelectedOption(e.clientX, e.clientY);
            setHighlightedOption(selectedOption);
        }
    };

    const handleMouseUp = () => {
        if (holdTimeoutRef.current) {
            clearTimeout(holdTimeoutRef.current);
        }
        if (isHolding) {
            const selectedOption = getSelectedOption(
                (window.event as MouseEvent)?.clientX || 0,
                (window.event as MouseEvent)?.clientY || 0
            );
            const newTheme = selectedOption === "system"
                ? window.matchMedia("(prefers-color-scheme: dark)").matches
                    ? "dark"
                    : "light"
                : (selectedOption as ThemeOption) || switchTheme;
            setSwitchTheme(newTheme);
            setTheme(newTheme);
            setIsHolding(false);
        }
        isClickedRef.current = false;
    };

    const handleClick = () => {
        if (!isHolding) {
            const newTheme = switchTheme === "dark" ? "light" : "dark";
            setSwitchTheme(newTheme);
            setTheme(newTheme);
        }
    };

    const themeIcons: Record<ThemeOption, JSX.Element> = {
        dark: <FaMoon size={24} />,
        light: <FaSun size={24} />,
        system: <FaDesktop size={24} />,
    };

    return (
        <div className="relative">
            <button
                ref={buttonRef}
                className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none"
                onMouseDown={handleMouseDown}
                onClick={handleClick}
                onMouseUp={handleMouseUp}
            >
                {themeIcons[switchTheme]}
            </button>
            {isHolding && (
                <div
                    ref={stadiumRef}
                    className={`absolute ${
                        position === "bottom" ? "top-full" : position === "top" ? "bottom-full" : ""
                    } left-1/2 transform -translate-x-1/2 ${
                        position === "right" ? "translate-x-full" : position === "left" ? "-translate-x-full" : ""
                    } w-40 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex justify-between items-center px-4`}
                >
                    {(["dark", "system", "light"] as ThemeOption[]).map((option) => (
                        <span
                            key={option}
                            className={`${
                                highlightedOption === option ? "text-blue-500" : "text-gray-500 dark:text-gray-400"
                            }`}
                        >
                            {themeIcons[option]}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ThemeSwitch;