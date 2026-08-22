"use client";

import { useEffect } from "react";
import { usePortfolioStore, type Theme } from "@/lib/store";

const THEME_KEY = "pf:theme";

function readStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    return stored === "light" || stored === "dark" ? stored : null;
  } catch {
    return null;
  }
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
}

export function toggleTheme() {
  const current = usePortfolioStore.getState().theme;
  const next: Theme = current === "dark" ? "light" : "dark";
  applyTheme(next);
  usePortfolioStore.getState().setTheme(next);
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch {
    // Safari private mode etc. can throw on write — non-critical, ignore.
  }
}

// Mount once (in PortfolioApp) — syncs the store with the theme the inline
// bootstrap script in layout.tsx already applied before first paint, and
// keeps following system-preference changes until the user explicitly
// toggles (readStoredTheme() becoming non-null after that point).
export function useTheme() {
  const setTheme = usePortfolioStore((s) => s.setTheme);

  useEffect(() => {
    const initial = (document.documentElement.dataset.theme as Theme | undefined) ?? "dark";
    setTheme(initial);

    if (readStoredTheme()) return;

    const query = window.matchMedia("(prefers-color-scheme: light)");
    const followSystem = () => {
      const next: Theme = query.matches ? "light" : "dark";
      applyTheme(next);
      setTheme(next);
    };
    query.addEventListener("change", followSystem);
    return () => query.removeEventListener("change", followSystem);
  }, [setTheme]);
}
