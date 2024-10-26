"use client";

import React, { createContext, useContext, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";

interface ScrollContextProps {
    handleScrollTo: (url: string) => void;
}

export const ScrollContext = createContext<ScrollContextProps | undefined>(undefined);

export const ScrollProvider = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const scrollbarThumbRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number>();

    const updateScrollbarThumb = useCallback(() => {
        if (!scrollbarThumbRef.current || typeof window === 'undefined') return;

        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrolled = window.scrollY;

        // Calculate dimensions
        const thumbHeight = Math.max((windowHeight / documentHeight) * windowHeight, 40);
        const scrollRange = documentHeight - windowHeight;
        const thumbPosition = scrollRange > 0 ? (scrolled / scrollRange) * (windowHeight - thumbHeight) : 0;

        // Apply changes
        const thumb = scrollbarThumbRef.current.style;
        thumb.height = `${thumbHeight}px`;
        thumb.transform = `translateY(${thumbPosition}px)`;
    }, []);

    // Setup scroll and resize handlers
    useEffect(() => {
        const onScroll = () => {
            if (rafRef.current) return;
            rafRef.current = requestAnimationFrame(() => {
                updateScrollbarThumb();
                rafRef.current = undefined;
            });
        };

        const resizeObserver = new ResizeObserver(() => {
            if (rafRef.current) return;
            rafRef.current = requestAnimationFrame(() => {
                updateScrollbarThumb();
                rafRef.current = undefined;
            });
        });

        // Add listeners
        window.addEventListener('scroll', onScroll, { passive: true });
        resizeObserver.observe(document.body);

        // Initial update
        const initTimeout = setTimeout(updateScrollbarThumb, 100);

        return () => {
            window.removeEventListener('scroll', onScroll);
            resizeObserver.disconnect();
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            clearTimeout(initTimeout);
        };
    }, [updateScrollbarThumb]);

    // Handle page changes
    useEffect(() => {
        // Reset scroll position
        window.scrollTo(0, 0);

        // Update scrollbar after a short delay to ensure content is rendered
        const timeout = setTimeout(() => {
            updateScrollbarThumb();
        }, 100);

        return () => clearTimeout(timeout);
    }, [pathname, updateScrollbarThumb]);

    const handleScrollTo = (url: string) => {
        const targetId = url.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            const topOffset = window.innerHeight * 0.15;
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
            <div className="custom-scrollbar">
                <div
                    ref={scrollbarThumbRef}
                    className="absolute top-0 left-0 right-0 bg-current rounded"
                    style={{
                        backgroundColor: 'var(--scrollbar)',
                        transition: 'height 0.5s ease-out, transform 0.3s ease-out'
                    }}
                />
            </div>
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