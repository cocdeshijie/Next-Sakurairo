import Image from "next/image";
import React from "react";
import { cn } from "@/utils/cn";

interface IconProps {
    src: string;
    className?: string;
    size?: number;
    alt?: string;
}

const Icon: React.FC<IconProps> = ({ src, className = '',size = 24, alt= "Icon" }) => {
    return (
        <div className={cn(
            "flex", className
        )}>
            <Image
                src={src}
                alt={alt}
                width={size}
                height={size}
                className={"object-contain rounded-full"}
            />
        </div>
    );
};

interface HomeIconProps {
    src: string;
    link: string
    alt?: string;
}

const HomeIcon: React.FC<HomeIconProps> = ({ src, link, alt = "Icon" }) => {
    return (
        <a href={link}
           target="_blank"
           className={cn(
               "group relative",
               "bg-theme-200/25 dark:bg-theme-800/25",
               "hover:bg-theme-300/25 dark:hover:bg-theme-700/25",
               "backdrop-blur-md p-2 rounded-lg",
               "ring-1 ring-theme-500/50",
               "transform hover:-translate-y-0.5",
               "transition-all duration-300"
           )}>
            <Icon src={src} size={26} alt={alt} className="hidden md:block"/>
            <Icon src={src} size={18} alt={alt} className="block md:hidden"/>
            <span className={cn(
                "absolute -top-10 left-1/2 -translate-x-1/2",
                "whitespace-nowrap px-3 py-1.5 text-xs",
                "bg-theme-100/75 dark:bg-theme-800/75",
                "text-theme-900 dark:text-theme-100",
                "rounded-lg",
                "opacity-0 group-hover:opacity-100",
                "scale-95 group-hover:scale-100",
                "transition-all duration-200",
                "pointer-events-none",
                "ring-1 ring-theme-200/50 dark:ring-theme-700/50",
                "backdrop-blur-sm"
            )}>
                {alt}
            </span>
        </a>
    )
}

export {Icon, HomeIcon};
