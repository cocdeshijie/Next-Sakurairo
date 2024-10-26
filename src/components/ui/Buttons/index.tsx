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
    "inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium",
    "bg-theme-500 text-white hover:bg-theme-600",
    "dark:bg-theme-400 dark:hover:bg-theme-500",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    "transform hover:-translate-y-0.5 transition duration-300 ease-in-out",
    "focus:outline-none focus:ring-2 focus:ring-theme-500 focus:ring-offset-2",
    "dark:focus:ring-theme-400 dark:focus:ring-offset-gray-900"
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
            scroll = {false}
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