import { forwardRef, HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export const BaseNode = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & { selected?: boolean }
>(({ className, selected, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative rounded-md border bg-white p-5 text-gray-900 shadow",
      className,
      selected ? "border-gray-400 shadow-lg" : "",
      "hover:ring-1",
    )}
    tabIndex={0}
    {...props}
  />
));

BaseNode.displayName = "BaseNode";
