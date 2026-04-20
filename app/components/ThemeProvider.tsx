"use client";

import { useEffect } from "react";

export type ColorScheme = "light" | "dark" | "system";

const STORAGE_KEY = "color-scheme";

export function applyScheme(scheme: ColorScheme) {
  const root = document.documentElement;
  if (scheme === "system") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", scheme);
  }
}

export function getSavedScheme(): ColorScheme {
  if (typeof window === "undefined") return "system";
  return (localStorage.getItem(STORAGE_KEY) as ColorScheme) ?? "system";
}

export function saveScheme(scheme: ColorScheme) {
  localStorage.setItem(STORAGE_KEY, scheme);
  applyScheme(scheme);
  window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY, newValue: scheme }));
}

export function ThemeProvider() {
  useEffect(() => {
    applyScheme(getSavedScheme());

    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        applyScheme(e.newValue as ColorScheme);
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  return null;
}
