import * as runtime from "react/jsx-runtime";
import { cn } from "@/utils/cn";

const useMDXComponents = (code: string) => {
    const fn = new Function(code)
    return fn({ ...runtime }).default
}

const HeadingAnchor = ({href}: {href?: string}) => {
    return (
        <a
            href={href}
            className={cn(
                "ml-2 hover:underline hover:cursor-pointer",
                "opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                "text-theme-400 dark:text-theme-600"
            )}
        >
            #
        </a>
    )
}

const components = {
    h1: ({className, children, ...props}: { className?: string; children: React.ReactNode }) => (
        <h1 className={cn("text-4xl font-semibold group mt-10 mb-4", className)} {...props}>
            <span>{children}</span>
            <HeadingAnchor />
        </h1>
    ),
    h2: ({ className, children, ...props }: { className?: string; children: React.ReactNode }) => (
        <h2 className={cn("text-3xl font-semibold group mt-10 mb-4", className)} {...props}>
            <span>{children}</span>
            <HeadingAnchor />
        </h2>
    ),
    h3: ({className, children, ...props}: { className?: string; children: React.ReactNode }) => (
        <h3 className={cn("text-2xl font-semibold group mt-10 mb-4", className)} {...props}>
            <span>{children}</span>
            <HeadingAnchor />
        </h3>
    ),
    h4: ({className, children, ...props}: { className?: string; children: React.ReactNode }) => (
        <h4 className={cn("text-xl font-semibold group mt-10 mb-4", className)} {...props}>
            <span>{children}</span>
            <HeadingAnchor />
        </h4>
    ),
    h5: ({className, children, ...props}: { className?: string; children: React.ReactNode }) => (
        <h5 className={cn("text-lg font-semibold group mt-10 mb-4", className)} {...props}>
            <span>{children}</span>
            <HeadingAnchor />
        </h5>
    ),
    h6: ({ className, children, ...props }: { className?: string; children: React.ReactNode }) => (
        <h6 className={cn("text-base font-semibold group mt-10 mb-4", className)} {...props}>
            <span>{children}</span>
            <HeadingAnchor />
        </h6>
    ),
    p: ({ className, children, ...props }: { className?: string; children: React.ReactNode }) => (
        <p className={cn("text-theme-900 dark:text-theme-100", className)} {...props}>
            {children}
        </p>
    ),
};

interface MDXProps {
    code: string
}

export function MDX({ code }: MDXProps) {
    const Component = useMDXComponents(code);

    return (
        <Component components={components} />
    )
}