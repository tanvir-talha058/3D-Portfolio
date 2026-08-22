import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type ButtonProps = {
  variant?: "primary" | "ghost";
} & ComponentProps<"a">;

export function Button({ variant = "primary", className, children, ...props }: ButtonProps) {
  return (
    <a
      className={cn(
        "inline-flex items-center gap-2 rounded-sm px-6 py-3 text-sm font-medium tracking-wide transition-colors duration-200",
        variant === "primary"
          ? "bg-brass text-ink hover:bg-brass-bright"
          : "border border-line text-paper hover:border-brass/70 hover:text-brass",
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
}
