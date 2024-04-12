import { BlogConfig } from "@/config/type";

export const blogConfig: BlogConfig = {
    header_logo: {
        text_front: "cocdeshijie",
        text_middle: "の",
        text_end: "Blog",
        text_bottom: "qwq~"
    },

    header_navigation: [
        {
            title: "Home",
            href: ""
        },
        {
            title: "Placeholder",
            href: ""
        },
        {
            title: "Posts",
            href: ""
        },
        {
            title: "About",
            href: "",
            children: [
                {
                    title: "me",
                    href: ""
                },
                {
                    title: "this site",
                    href: ""
                }
            ]
        }
    ]
}
