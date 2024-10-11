import React, { forwardRef, ReactNode, InputHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

// Define props for unordered and ordered lists by extending React's HTML attributes
interface ListProps extends React.HTMLAttributes<HTMLUListElement | HTMLOListElement> {
    children: ReactNode;
}

// Define props for list items by extending React's HTML attributes
interface ListItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
    children: ReactNode;
}

/**
 * Type Guard to check if a ReactNode is a ReactElement<HTMLInputElement> with type checkbox
 * @param element - The ReactNode to check
 * @returns True if the element is an input of type checkbox, false otherwise
 */
function isCheckboxInput(element: React.ReactNode): element is React.ReactElement<InputHTMLAttributes<HTMLInputElement>> {
    return React.isValidElement(element) &&
        element.type === 'input' &&
        element.props.type === 'checkbox';
}

// Unordered List Component
const Ul = forwardRef<HTMLUListElement, ListProps>(
    ({ className, children, ...props }, ref) => (
        <ul
            ref={ref}
            className={cn("list-disc pl-5 space-y-2", className)}
            {...props}
        >
            {children}
        </ul>
    )
);
Ul.displayName = "Ul";

// Ordered List Component
const Ol = forwardRef<HTMLOListElement, ListProps>(
    ({ className, children, ...props }, ref) => (
        <ol
            ref={ref}
            className={cn("list-decimal pl-5 space-y-2", className)}
            {...props}
        >
            {children}
        </ol>
    )
);
Ol.displayName = "Ol";

// List Item Component
const Li = forwardRef<HTMLLIElement, ListItemProps>(
    ({ className, children, ...props }, ref) => {
        const childrenArray = React.Children.toArray(children);
        const firstChild = childrenArray[0];
        const isTaskList = isCheckboxInput(firstChild);

        if (isTaskList) {
            // Determine if the checkbox is checked
            const isChecked = firstChild.props.checked;

            // Clone the existing checkbox to apply custom classes and set disabled
            const clonedCheckbox = React.cloneElement(firstChild, {
                className: cn(
                    "mt-1 accent-theme-500 opacity-75 dark:opacity-85", // Tailwind accent-* utility
                    firstChild.props.className
                ),
                disabled: !isChecked, // Disable if not checked
            });

            // Extract the rest of the children (task description)
            const restChildren = childrenArray.slice(1);

            return (
                <li className={cn("mb-1 flex items-start", className)} {...props} ref={ref}>
                    <span className="mr-2 flex-shrink-0">
                        {clonedCheckbox}
                    </span>
                    <span className="flex-1">
                        {restChildren}
                    </span>
                </li>
            );
        }

        // Regular list item without task list
        return (
            <li className={cn("mb-1", className)} {...props} ref={ref}>
                {children}
            </li>
        );
    }
);
Li.displayName = "Li";

// Export the list components
export const listComponents = {
    ul: Ul,
    ol: Ol,
    li: Li,
};