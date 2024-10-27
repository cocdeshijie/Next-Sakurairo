"use client";

import React from "react";
import { LinkButton } from "@/components/ui/Buttons";

const NotFound = () => {
    return (
        <div className={"min-h-screen flex flex-col items-center justify-center relative"}>
            <div className={"absolute top-0 w-full h-screen bg-theme-50 dark:bg-theme-950"}/>

            <div className={"container mx-auto px-4 z-10"}>
                <div className={"text-center space-y-8"}>
                    <div className={"space-y-1"}>
                        <p className={"text-lg font-medium text-theme-500"}>404</p>
                        <h1 className={"text-3xl font-bold text-theme-800 dark:text-theme-200"}>
                            This page does not exist
                        </h1>
                    </div>

                    <div>
                        <LinkButton href={"/"}>
                            Return to Home
                        </LinkButton>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;