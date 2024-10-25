"use client";

import { BiSolidArrowToTop } from "react-icons/bi";

const ToTop = () => {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <div
            onClick={scrollToTop}
            className={"flex items-center justify-center p-1.5"}
        >
            <BiSolidArrowToTop className="text-theme-500 w-8 h-8" />
        </div>
    );
};

export default ToTop;
