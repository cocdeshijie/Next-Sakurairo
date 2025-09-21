"use client";

import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import * as Dialog from "@radix-ui/react-dialog";
import { atom, useAtom } from "jotai";
import { useTransition, animated, easings } from "@react-spring/web";
import { config } from "#site/content";
import { BiMenu, BiChevronDown } from "react-icons/bi";
import { cn } from "@/utils/cn";

const dialogOpenAtom = atom(false);

const HeaderDialog = () => {
    const [isOpen, setIsOpen] = useAtom(dialogOpenAtom);

    const transitions = useTransition(isOpen, {
        from: { opacity: 0, y: 100 },
        enter: { opacity: 1, y: 0 },
        leave: { opacity: 0, y: 100 },
        config: {
            duration: 300,
            easing: easings.easeInOutCubic
        },
    });

    return (
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <Dialog.Trigger className={"md:hidden"}>
                <BiMenu size={24} />
            </Dialog.Trigger>
            {transitions((styles, item) =>
                item ? (
                    <Dialog.Portal forceMount>
                        <Dialog.Overlay forceMount asChild>
                            <animated.div
                                style={styles}
                                className={"fixed inset-0 bg-theme-950/25 dark:bg-theme-50/25 z-10"}
                            />
                        </Dialog.Overlay>

                        <Dialog.Content forceMount asChild>
                            <animated.div
                                style={styles}
                                className={cn(
                                    "fixed bottom-0 left-0 right-0 rounded-t-xl p-4 h-5/6 z-50",
                                    "bg-theme-100/75 dark:bg-theme-900/75 backdrop-blur-xl"
                                )}>
                                <Dialog.Title/>
                                <BiChevronDown onClick={() => setIsOpen(false)}
                                               className={"w-12 h-12 cursor-pointer mx-auto text-theme-50 dark:text-theme-950"}/>
                                <NavigationMenu.Root>
                                    <NavigationMenu.List className={"flex flex-col space-y-3"}>
                                        {config.header_navigation.map((item) => (
                                            <NavigationMenu.Item key={item.title} className="flex-col">
                                                <NavigationMenu.Trigger className={cn(
                                                    "flex justify-between items-center w-full p-3 rounded-lg",
                                                    "text-theme-900 dark:text-theme-100",
                                                    "hover:bg-theme-200/50 dark:hover:bg-theme-800/50"
                                                )}>
                                                    {item.title}
                                                </NavigationMenu.Trigger>
                                                {item.children && (
                                                    <div className={"grid grid-cols-2 gap-2 mt-1 mx-6"}>
                                                        {item.children.map((child) => (
                                                            <NavigationMenu.Link
                                                                key={child.title}
                                                                href={child.href}
                                                                className={cn(
                                                                    "p-2 rounded-lg text-theme-800 dark:text-theme-200",
                                                                    "hover:bg-theme-200/25 dark:hover:bg-theme-800/25"
                                                                )}>
                                                                {child.title}
                                                            </NavigationMenu.Link>
                                                        ))}
                                                    </div>
                                                )}
                                            </NavigationMenu.Item>
                                        ))}
                                    </NavigationMenu.List>
                                </NavigationMenu.Root>
                            </animated.div>
                        </Dialog.Content>

                    </Dialog.Portal>
                ) : null,
            )}
        </Dialog.Root>
    );
};

export default HeaderDialog;