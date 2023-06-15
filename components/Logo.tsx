"use client";

import { cn } from "@/lib/utils";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

export default function Logo({logoHover}: {logoHover: boolean}) {
    const controls = useAnimation();
    const textControls = useAnimation();

    useEffect(() => {
        if (logoHover) {
            controls.start("rotate");
            textControls.start({ scale: 1, opacity: 1 });
        } else {
            controls.stop();
            textControls.start({ scale: 1, opacity: 0 });
        }
    }, [logoHover, controls, textControls]);

    const rotationVariant = {
        rotate: {
            rotate: [0, 360],
            transition: {
                repeat: Infinity,
                ease: "linear",
                duration: 1,
            },
        },
    };

    return (
        <div className="flex flex-col items-center -space-y-1 font-medium">
            <div className="flex items-center space-x-3">
                <div className={cn({
                        "bg-primary_color dark:bg-primary_color-dark": logoHover,
                        "bg-white/40": !logoHover,
                    },
                    "pt-3 pb-2 rounded-xl items-center"
                )}>
                    Next Sakurairo
                </div>
                <motion.div
                    className={"text-primary_color dark:text-primary_color-dark"}
                    animate={controls}
                    variants={rotationVariant}
                >
                    の
                </motion.div>
                <div className={"text-primary_color dark:text-primary_color-dark"}>Site</div>
            </div>
            <motion.div
                className={"text-[10px] font-normal text-primary_color dark:text-primary_color-dark"}
                animate={textControls}
                transition={{ type: "ease", duration: 0.5 }}
                initial={{ opacity: 0 }}
            >
                qwq qwq~
            </motion.div>
        </div>
    )
}