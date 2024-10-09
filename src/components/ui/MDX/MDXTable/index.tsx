import { cn } from "@/utils/cn";

export const tableComponents = {
    table: ({ className, children, ...props }: { className?: string; children: React.ReactNode }) => (
        <div className="overflow-x-auto my-2">
            <div className={cn(
                "inline-block min-w-full rounded-md",
                "border border-theme-100 dark:border-theme-800",
                "shadow shadow-theme-800/15 dark:shadow-theme-200/15"
            )}>
                <table className={cn("table-auto w-full", className)} {...props}>
                    {children}
                </table>
            </div>
        </div>
    ),
    thead: ({ className, children, ...props }: { className?: string; children: React.ReactNode }) => (
        <thead className={cn("bg-theme-100/50 dark:bg-theme-800/50", className)} {...props}>
        {children}
        </thead>
    ),
    tbody: ({ className, children, ...props }: { className?: string; children: React.ReactNode }) => (
        <tbody className={cn("divide-y divide-theme-100 dark:divide-theme-800", className)} {...props}>
        {children}
        </tbody>
    ),
    tr: ({ className, children, ...props }: { className?: string; children: React.ReactNode }) => (
        <tr className={cn("leading-relaxed", className)} {...props}>
            {children}
        </tr>
    ),
    th: ({ className, children, ...props }: { className?: string; children: React.ReactNode }) => (
        <th className={cn(
            "px-4 py-2 text-left font-semibold",
            "text-theme-800 dark:text-theme-100",
            className
        )} {...props}>
            {children}
        </th>
    ),
    td: ({ className, children, ...props }: { className?: string; children: React.ReactNode }) => (
        <td className={cn(
            "px-4 py-2",
            "text-theme-900 dark:text-theme-100",
            className
        )} {...props}>
            {children}
        </td>
    )
};