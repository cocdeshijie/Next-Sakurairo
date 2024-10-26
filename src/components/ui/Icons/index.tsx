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
               "bg-theme-500/25 hover:bg-theme-500/50 backdrop-blur-sm p-1 rounded-lg",
               "ring-1 ring-theme-700/25 dark:ring-theme-300/25",
               "transform hover:-translate-y-1.5 transition duration-300 ease-in-out"
           )}>
            <Icon src={src} size={26} alt={alt}/>
        </a>
    )
}

export { Icon, HomeIcon };
