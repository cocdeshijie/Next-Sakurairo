"use client";

import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import * as Dialog from "@radix-ui/react-dialog";
import { atom, useAtom } from "jotai";
import { useTransition, animated, easings } from "@react-spring/web";
import { config } from "#site/content";
import { BiMenu } from "react-icons/bi";
import type { Config } from "#site/content";
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
                                    "fixed bottom-0 left-0 right-0 rounded-t-lg p-4 h-5/6 z-50",
                                    "bg-theme-100/75 dark:bg-theme-900/75 backdrop-blur-xl"
                                )}>
                                <Dialog.Title />
                                <Dialog.Description />
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
                            </animated.div>
                        </Dialog.Content>
                    </Dialog.Portal>
                ) : null,
            )}
        </Dialog.Root>
    );
};

export default HeaderDialog;
