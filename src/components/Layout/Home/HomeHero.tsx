"use client";

import Image from "next/image";
import { atom, useAtom } from "jotai";
import { useEffect } from "react";
import { HomeIcon } from "@/components/ui/Icons";
import {Config, config} from "#site/content";

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
    }, [setBgOpacity]);

    return (
        <div className={"min-h-screen flex items-center justify-center relative"}>
            <div
                className={"absolute top-0 w-full h-screen bg-theme-50 dark:bg-theme-950"}
                style={{opacity: bgOpacity}}/>
            <div className={"container mx-auto px-4 z-0"}>
                <div className={"md:flex md:justify-between items-center"}>
                    <div className={"md:w-1/2 flex flex-col items-center mb-8 md:mb-0"}>
                        <Image
                            src="https://qwq.xyz/cocdeshijie.gif"
                            alt="Profile"
                            width={160}
                            height={160}
                            className={"rounded-full mb-4 transition-transform duration-500 hover:rotate-[360deg] transform-gpu"}
                        />
                        <div className={"flex space-x-3"}>
                            {config.home_social.map((item: Config) => (
                                <HomeIcon src={item.src} link={item.href} key={item.name} alt={item.name} />
                            ))}
                        </div>
                    </div>
                    <div className={"md:w-1/2 text-center"}>
                        <h1 className={"text-4xl font-bold"}>Giant Placeholder Text</h1>
                    </div>
                </div>
            </div>
            <div className={"absolute bottom-0 w-full h-[20vh] bg-gradient-to-b from-transparent to-theme-50 dark:to-theme-950 z-10"}/>
        </div>
    )
}

export default HomeHero;