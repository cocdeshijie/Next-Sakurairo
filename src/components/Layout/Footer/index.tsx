import { cn } from "@/utils/cn";
import { config } from "#site/content";
import React from "react";

const Footer = () => {
    return (
        <footer className={"bg-theme-100 dark:bg-theme-900 dark:text-white"}>
            <div className={cn(
                "py-8",
                "bg-gradient-to-b from-theme-50 dark:from-theme-950 to-theme-100/50 dark:to-theme-900/50"
            )}>
                <div className={"container mx-auto px-4"}>
                    <div className={"md:flex md:justify-between md:items-center md:px-40 text-center md:text-left"}>
                        <div>
                            {config.footer.line_1 && (
                                <div className={"mb-4"}>
                                    <span className={"text-lg font-medium text-theme-700 dark:text-theme-200"}>
                                        {config.footer.line_1.map((item, index) => (
                                            <React.Fragment key={item.href || index}>
                                                <a href={item.href}>
                                                    {item.text}
                                                </a>
                                                {index < config.footer.line_1!.length - 1 && " | "}
                                            </React.Fragment>
                                        ))}
                                    </span>
                                </div>
                            )}
                            <div>
                                {config.footer.line_2 && (
                                    <h3 className={"text-xl font-bold text-theme-800 dark:text-theme-100"}>
                                        {config.footer.line_2}
                                    </h3>
                                )}
                                {config.footer.line_3 && (
                                    <p className={"mt-2 text-theme-600 dark:text-theme-300"}>
                                        {config.footer.line_3}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className={"mt-4 md:mt-0 md:flex md:items-center"}>
                            <p className={"text-theme-700 dark:text-theme-200"}>
                                &copy; {new Date().getFullYear()} {config.site_info.author}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;