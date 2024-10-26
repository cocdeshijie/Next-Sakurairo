"use client";

import React, { createContext, useContext, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

interface ScrollContextProps {
    handleScrollTo: (url: string) => void;
}

export const ScrollContext = createContext<ScrollContextProps | undefined>(undefined);

export const ScrollProvider = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const scrollbarThumbRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number>();
    const lastUpdate = useRef<{ height: number; scroll: number }>({ height: 0, scroll: 0 });
    const observerRef = useRef<MutationObserver>();

    const updateScrollbarThumb = () => {
        if (!scrollbarThumbRef.current) return;

        const currentScroll = window.scrollY;
        const currentHeight = document.documentElement.scrollHeight;
        const windowHeight = window.innerHeight;

        // Skip update if values haven't changed significantly
        if (Math.abs(currentScroll - lastUpdate.current.scroll) < 5 &&
            currentHeight === lastUpdate.current.height) {
            return;
        }

        lastUpdate.current = { height: currentHeight, scroll: currentScroll };

        const thumbHeight = Math.max(
            (windowHeight / currentHeight) * windowHeight,
            40
        );

        // Calculate thumb position
        const scrollRange = currentHeight - windowHeight;
        const scrollRatio = scrollRange > 0 ? currentScroll / scrollRange : 0;
        const maxThumbTravel = windowHeight - thumbHeight;
        const thumbPosition = scrollRatio * maxThumbTravel;

        const thumb = scrollbarThumbRef.current.style;
        thumb.height = `${thumbHeight}px`;
        thumb.transform = `translateY(${thumbPosition}px)`;
    };

    useEffect(() => {
        // Reset scroll position when pathname changes
        window.scrollTo(0, 0);

        // Throttled scroll handler
        const handleScroll = () => {
            if (rafRef.current) return;
            rafRef.current = requestAnimationFrame(() => {
                updateScrollbarThumb();
                rafRef.current = undefined;
            });
        };

        // Debounced resize handler
        let resizeTimeout: NodeJS.Timeout;
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(updateScrollbarThumb, 100);
        };

        // Set up mutation observer
        observerRef.current = new MutationObserver((mutations) => {
            const hasSizeChange = mutations.some(mutation =>
                mutation.type === 'childList' ||
                mutation.type === 'attributes' ||
                mutation.target instanceof HTMLImageElement
            );

            if (hasSizeChange) {
                if (rafRef.current) return;
                rafRef.current = requestAnimationFrame(() => {
                    updateScrollbarThumb();
                    rafRef.current = undefined;
                });
            }
        });

        // Start observing
        observerRef.current.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            characterData: true
        });

        // Add event listeners
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleResize, { passive: true });

        // Initial update
        const initialTimeout = setTimeout(updateScrollbarThumb, 100);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
            clearTimeout(initialTimeout);
            clearTimeout(resizeTimeout);
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [pathname]);

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