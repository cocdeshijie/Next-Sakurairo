"use client";

import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { config } from "#site/content";
import type { Config } from "#site/content";
import { cn } from "@/utils/cn";

const HeaderDialog = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <Dialog.Trigger className={"md:hidden"}>
                <svg xmlns="http://www.w3.org/2000/svg" className={"h-6 w-6 dark:text-white"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className={"fixed inset-0 bg-theme-950/30 dark:bg-theme-50/20 z-50"} />
                <Dialog.Content className={cn(
                    "fixed bottom-0 left-0 right-0 rounded-t-lg p-4 h-5/6 z-50",
                    "bg-theme-50/70 dark:bg-theme-950/70",
                    "overflow-y-auto transform translate-y-full",
                    "motion-safe:transition-transform motion-safe:duration-300 data-[state=open]:transform-none"
                )}>
                    <NavigationMenu.Root>
                        <NavigationMenu.List className={"flex flex-col space-y-4 pt-14"}>
                            {config.header_navigation.map((item: Config) => (
                                <NavigationMenu.Item key={item.title} className={"flex-col"}>
                                    <NavigationMenu.Trigger className={"dark:text-white"}>
                                        {item.title}
                                    </NavigationMenu.Trigger>
                                    {item.children && (
                                        <div className={"grid grid-cols-2 gap-2 my-2"}>
                                            {item.children.map((child: Config) => (
                                                <NavigationMenu.Link key={child.title} href={child.href} className={"block px-2 py-1 dark:text-white"}>
                                                    {child.title}
                                                </NavigationMenu.Link>
                                            ))}
                                        </div>
                                    )}
                                </NavigationMenu.Item>
                            ))}
                        </NavigationMenu.List>
                    </NavigationMenu.Root>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}

export default HeaderDialog;
