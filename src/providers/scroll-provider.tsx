"use client";

import React, { createContext, useContext } from "react";

interface ScrollContextProps {
    handleScrollTo: (url: string) => void;
}

export const ScrollContext = createContext<ScrollContextProps | undefined>(undefined);

export const ScrollProvider = ({ children }: { children: React.ReactNode }) => {
    const handleScrollTo = (url: string) => {
        const targetId = url.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            const topOffset = window.innerHeight * 0.15; // 15% from the top of the screen
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - topOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
            });
        }
    };

    return (
        <ScrollContext.Provider value={{ handleScrollTo }}>
            {children}
        </ScrollContext.Provider>
    );
};

export const useScroll = () => {
    const context = useContext(ScrollContext);
    if (!context) {
        throw new Error("useScroll must be used within a ScrollProvider");
    }
    return context;
};
