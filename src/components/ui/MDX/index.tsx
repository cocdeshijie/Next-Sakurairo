import * as runtime from "react/jsx-runtime";
import { cn } from "@/utils/cn";
import { H1, H2, H3, H4, H5, H6 } from "@/components/ui/MDX/MDXHeading";
import { MDXCode, MDXInlineCode } from "@/components/ui/MDX/MDXCode";
import { MDXLink } from "@/components/ui/MDX/MDXLink";
import { tableComponents } from "@/components/ui/MDX/MDXTable";
import { listComponents } from "@/components/ui/MDX/MDXList";
import { AnilistTracker } from "@/components/ui/AnilistTracker";
import GiscusComments from "@/components/ui/Giscus";

/* -------------------------------------------------- */
/* 🔧 Dynamic compiler                                 */
/* -------------------------------------------------- */

const useMDXComponents = (code: string) => {
    // eslint-disable-next-line no-new-func
    const fn = new Function(code);
    return fn({ ...runtime }).default;
};

/* -------------------------------------------------- */
/* 🧩 Base components                                  */
/* -------------------------------------------------- */

const components = {
    h1: H1,
    h2: H2,
    h3: H3,
    h4: H4,
    h5: H5,
    h6: H6,
    p: ({
            className,
            children,
            ...props
        }: {
        className?: string;
        children: React.ReactNode;
    }) => (
        <p className={cn("text-theme-950 dark:text-theme-50", className)} {...props}>
            {children}
        </p>
    ),
    a: MDXLink,

    /* ——— Horizontal Rule ——— */
    hr: ({
             className,
             ...props
         }: React.HTMLAttributes<HTMLHRElement>) => (
        <hr
            className={cn(
                "my-8 border-0 border-t-2 mx-4",
                "border-theme-500 dark:border-theme-500/80",
                className
            )}
            {...props}
        />
    ),

    /* ——— Blockquote ——— */
    blockquote: ({
                     className,
                     children,
                     ...props
                 }: {
        className?: string;
        children: React.ReactNode;
    }) => (
        <blockquote
            className={cn(
                "border-l-4 border-theme-500/75 pl-4 py-0.5 rounded-r-md",
                "shadow shadow-theme-800/15 dark:shadow-theme-200/15",
                "text-theme-800 dark:text-theme-200",
                "bg-theme-200/50 dark:bg-theme-800/50",
                className
            )}
            {...props}
        >
            {children}
        </blockquote>
    ),

    /* ——— Tables & lists ——— */
    ...tableComponents,
    ...listComponents,
};

/* -------------------------------------------------- */
/* 🌐 Shared components (code, tracker, comments)      */
/* -------------------------------------------------- */

const sharedComponents = {
    MDXCode,
    MDXInlineCode,
    AnilistTracker,
    GiscusComments,
    ...components,
};

/* -------------------------------------------------- */
/* 🏗 MDX renderer                                     */
/* -------------------------------------------------- */

interface MDXProps {
    code: string;
    components?: Record<string, React.ComponentType>;
    [key: string]: any;
}

export function MDX({ code, components, ...props }: MDXProps) {
    const Component = useMDXComponents(code);
    return <Component components={{ ...sharedComponents, ...components }} {...props} />;
}
