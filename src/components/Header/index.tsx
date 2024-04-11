"use client";

import { cn } from "@/utils/cn";
import Logo from "@/components/Header/Logo";
import HeaderDialog from "@/components/Header/HeaderDialog";
import { blogConfig } from "@/config";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";

const Header = () => {
    return (
        <header className={cn(
            "fixed top-0 left-0 right-0 p-5 md:p-3 md:top-4 md:left-4 md:right-4",
            "bg-theme-50/30 dark:bg-theme-950/30 backdrop-filter backdrop-blur-lg",
            "rounded-none md:rounded-lg shadow-md flex justify-between items-center"
        )}>
            <HeaderDialog/>

            <div className={"absolute left-1/2 transform -translate-x-1/2 md:static md:transform-none"}>
                <Logo/>
            </div>

            <div className={"hidden md:flex w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center"}>
                <nav className={"relative w-full"}>
                    <NavigationMenu.Root>
                        <NavigationMenu.List className={"flex justify-center items-center space-x-4"}>
                            {blogConfig.header_navigation.map((item) => (
                                <NavigationMenu.Item key={item.title}>
                                    {item.children ? (
                                        <div className={"relative"}>
                                            <NavigationMenu.Trigger className={"dark:text-white"}>
                                                {item.title}
                                            </NavigationMenu.Trigger>
                                            <NavigationMenu.Content
                                                className={cn(
                                                    "absolute top-full min-w-max max-w-[calc(100vw-40px)]",
                                                    "right-1/2 transform translate-x-1/2",
                                                    "rounded-md shadow-md p-1 mt-8",
                                                    "bg-theme-50/30 dark:bg-theme-950/30"
                                                )}>
                                                <ul className={"space-y-1"}>
                                                    {item.children.map((child) => (
                                                        <li key={child.title} className={"text-center"}>
                                                            <NavigationMenu.Link
                                                                href={child.href}
                                                                className={cn(
                                                                    "block px-3 py-1 list-none",
                                                                    "dark:text-white"
                                                                )}
                                                            >
                                                                {child.title}
                                                            </NavigationMenu.Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </NavigationMenu.Content>
                                        </div>
                                    ) : (
                                        <NavigationMenu.Link href={item.href}
                                                             className={"dark:text-white"}>
                                            {item.title}
                                        </NavigationMenu.Link>
                                    )}
                                </NavigationMenu.Item>
                            ))}
                        </NavigationMenu.List>
                    </NavigationMenu.Root>
                </nav>
            </div>
        </header>
    )
}

export default Header;