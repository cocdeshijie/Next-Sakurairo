export type BlogConfig = {
    header_logo: {
        text_front: string;
        text_middle: string;
        text_end: string;
        text_bottom: string;
    }

    header_navigation: Array<{
        title: string;
        href: string;
        children?: Array<{
            title: string;
            href: string;
        }>;
    }>;
}