import * as runtime from "react/jsx-runtime";
import { cn } from "@/utils/cn";

const useMDXComponent = (code: string) => {
    const fn = new Function(code)
    return fn({ ...runtime }).default
}

const components = {
    h1: ({className, ...props}: {className?: string}) => (
        <h1
            className={cn(
                "",
                className
            )}
            {...props}
        />
    )
}

interface MDXProps {
    code: string
}

export function MDX({ code }: MDXProps) {
    const Component = useMDXComponent(code)

    return (
        <div className="mdx">
            <Component components={components} />
        </div>
    )
}