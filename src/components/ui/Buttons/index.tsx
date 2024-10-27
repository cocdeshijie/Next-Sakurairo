import Link from "next/link";
import React from "react";
import { cn } from "@/utils/cn";

interface BaseButtonProps {
    children: React.ReactNode;
    className?: string;
    disabled?: boolean;
}

interface ButtonProps extends BaseButtonProps {
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
}

interface LinkButtonProps extends BaseButtonProps {
    href: string;
    external?: boolean;
}

const baseStyles = cn(
    "inline-flex items-center justify-center px-4 py-2 rounded-lg",
    "bg-white/5 dark:bg-theme-900/5 backdrop-blur-md",
    "hover:bg-white/15 dark:hover:bg-theme-900/15",
    "ring-2 ring-theme-800/25 dark:ring-theme-300/25",
    "hover:ring-theme-500/50 dark:hover:ring-theme-500/50",
    "text-theme-800 dark:text-theme-100",
    "shadow-md hover:shadow-lg shadow-theme-500/10",
    "transform hover:-translate-y-0.5 transition-all duration-200"
);

const Button: React.FC<ButtonProps> = ({
                                           children,
                                           className = "",
                                           disabled = false,
                                           onClick,
                                           type = "button"
                                       }) => {
    return (
        <button
            type={type}
            className={cn(baseStyles, className)}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

const LinkButton: React.FC<LinkButtonProps> = ({
                                                   children,
                                                   className = "",
                                                   disabled = false,
                                                   href,
                                                   external = false
                                               }) => {
    const linkProps = external ? {
        target: "_blank",
        rel: "noopener noreferrer"
    } : {};

    return external ? (
        <a
            href={href}
            className={cn(baseStyles, className)}
            {...linkProps}
        >
            {children}
        </a>
    ) : (
        <Link
            href={href}
            className={cn(baseStyles,
                disabled ? "pointer-events-none opacity-50" : "",
                className
            )}
            {...linkProps}
        >
            {children}
        </Link>
    );
};

export { Button, LinkButton };