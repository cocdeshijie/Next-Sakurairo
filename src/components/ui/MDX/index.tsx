import * as runtime from "react/jsx-runtime";
import { cn } from "@/utils/cn";
import { H1, H2, H3, H4, H5, H6 } from "@/components/ui/MDX/MDXHeading";
import { MDXCode, MDXInlineCode } from "@/components/ui/MDX/MDXCode";
import { MDXLink } from "@/components/ui/MDX/MDXLink";
import { tableComponents } from "@/components/ui/MDX/MDXTable";
import { listComponents } from "@/components/ui/MDX/MDXList";

const useMDXComponents = (code: string) => {
    const fn = new Function(code);
    return fn({ ...runtime }).default;
};

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
                "text-theme-800 dark:text-theme-200 bg-theme-200/50 dark:bg-theme-800/50",
                className
            )}
            {...props}
        >
            {children}
        </blockquote>
    ),
    ...tableComponents,
    ...listComponents,
};

const sharedComponents = {
    MDXCode,
    MDXInlineCode,
    ...components,
};

interface MDXProps {
    code: string;
    components?: Record<string, React.ComponentType>;
    [key: string]: any;
}

export function MDX({ code, components, ...props }: MDXProps) {
    const Component = useMDXComponents(code);

    return <Component components={{ ...sharedComponents }} {...props} />;
}