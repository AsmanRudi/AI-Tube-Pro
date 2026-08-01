import { LabelHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Label = forwardRef<HTMLLabelElement, LabelHTMLAttributes<HTMLLabelElement>>(
  function Label({ className, ...props }, ref) {
    return (
      <label
        ref={ref}
        className={cn(
          "mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300",
          className
        )}
        {...props}
      />
    );
  }
);

