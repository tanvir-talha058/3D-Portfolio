"use client";

import { Sun, Moon } from "lucide-react";
import { usePortfolioStore } from "@/lib/store";
import { toggleTheme } from "@/hooks/useTheme";

export function ThemeToggle() {
  const theme = usePortfolioStore((s) => s.theme);
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      className="ml-1 flex h-7 w-7 items-center justify-center rounded-sm text-paper/60 transition-colors hover:text-brass"
    >
      {isDark ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  );
}
