import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export function GlassPanel({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-sm border border-line bg-panel/90 backdrop-blur-sm transition-colors duration-300",
        "hover:border-brass/40",
        className
      )}
      {...props}
    />
  );
}
