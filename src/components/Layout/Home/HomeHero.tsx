"use client";

import { atom, useAtom } from "jotai";
import { useEffect } from "react";

const bgOpacityAtom = atom(0);


const HomeHero = () => {
    const [bgOpacity, setBgOpacity] = useAtom(bgOpacityAtom);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const halfScreenHeight = window.innerHeight / 3;
            const scrollPercentage = Math.min(scrollPosition / halfScreenHeight, 1);

            setBgOpacity(scrollPercentage);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <div className={"min-h-screen flex items-center justify-center relative"}>
            <div
                className={"absolute top-0 w-full h-screen bg-theme-50 z-[-1]"}
                style={{opacity: bgOpacity}}
            ></div>
            <div className={"text-center"}>
                <h1 className={"text-4xl font-bold"}>Screen Holder Text</h1>
            </div>
            <div
                className={"absolute bottom-0 w-full h-[20vh] bg-gradient-to-b from-transparent to-theme-50 z-10"}></div>
        </div>
    )
}

export default HomeHero;
