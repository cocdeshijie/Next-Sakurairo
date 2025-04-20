"use client";

import Image from "next/image";
import { atom, useAtom } from "jotai";
import { useEffect } from "react";
import { HomeIcon } from "@/components/ui/Icons";
import { type Config, config } from "#site/content";
import { cn } from "@/utils/cn";
import { TypeAnimation } from "react-type-animation";

const bgOpacityAtom = atom(0);
const showWordAtom = atom(false);

const HomeHero = () => {
    const [bgOpacity, setBgOpacity] = useAtom(bgOpacityAtom);
    const [showWord, setShowWord] = useAtom(showWordAtom);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const halfScreenHeight = window.innerHeight / 3;
            const scrollPercentage = Math.min(scrollPosition / halfScreenHeight, 0.9);

            setBgOpacity(scrollPercentage);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [setBgOpacity]);

    useEffect(() => {
        setShowWord(false);
    }, [setShowWord]);

    return (
        <div className={"min-h-screen flex items-center justify-center relative"}>
            <div
                className={"absolute top-0 w-full h-screen bg-theme-50 dark:bg-theme-950"}
                style={{opacity: bgOpacity}}
            />
            <div className={"container mx-auto px-4 z-0"}>
                <div className={"flex flex-col items-center"}>
                    <Image
                        src={config.site_info.profile_image}
                        alt={config.site_info.author}
                        width={160}
                        height={160}
                        className={
                            "rounded-full transition-transform duration-500 hover:rotate-[360deg] transform-gpu"
                        }
                    />

                    <div className={"mt-4 flex justify-center min-w-80"}>
                        <div className={cn(
                            "relative w-full overflow-hidden text-center",
                            "bg-theme-200/30 dark:bg-theme-800/60 backdrop-blur-xl",
                            "ring-1 ring-theme-500/40 rounded-2xl shadow-lg shadow-theme-500/10",
                            "hover:shadow-theme-500/20 hover:bg-theme-200/45 dark:hover:bg-theme-800/45",
                            "transition-all duration-300")}
                        >
                            <span className={cn(
                                "pointer-events-none absolute inset-px rounded-[calc(1rem-1px)]",
                                "bg-gradient-to-br from-theme-500/10 via-transparent to-theme-500/20")}
                            />
                            <div className="relative z-10 py-4 md:py-6">
                                <h2 className={cn(
                                    "px-6 md:px-12 font-semibold leading-tight text-[1.2em] md:text-[1.8em]",
                                    "whitespace-pre-line md:whitespace-normal",
                                    "text-theme-800 dark:text-theme-200"
                                )}
                                >
                                    <span className={"text-theme-800 dark:text-theme-300"}>"</span>
                                    <TypeAnimation
                                        sequence={[
                                            `Hi, I'm ${config.site_info.author}.\nWorking with `,
                                            () => setShowWord(true),
                                        ]}
                                        speed={25}
                                        wrapper="span"
                                        cursor={false}
                                    />
                                    {showWord && (
                                        <TypeAnimation
                                            key="tech"
                                            sequence={(
                                                config.home_working_on
                                                    .slice()
                                                    .sort(() => Math.random() - 0.5)
                                                    .flatMap<string | number>((item: string) => [item, 1000])
                                            )}
                                            speed={25}
                                            wrapper="span"
                                            className={"inline-block text-theme-500"}
                                            repeat={Infinity}
                                        />
                                    )}
                                    <span className={"text-theme-800 dark:text-theme-300"}>"</span>
                                </h2>
                            </div>
                        </div>
                    </div>

                    <div className={"mt-6 flex space-x-3"}>
                        {config.home_social.map((item: Config["home_social"], index: number) => (
                            <HomeIcon src={item.src} link={item.href} key={index} alt={item.name}/>
                        ))}
                    </div>
                </div>
            </div>
            <div
                className={cn(
                    "absolute bottom-0 w-full h-[20vh] z-10",
                    "bg-gradient-to-b from-transparent to-theme-50 dark:to-theme-950"
                )}
            />
        </div>
    );
};

export default HomeHero;
