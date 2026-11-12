"use client";

import { useSyncExternalStore } from "react";

export type Theme = "dark" | "light";

// Also read pre-paint by the inline script in app/layout.tsx; keep the key in sync.
const KEY = "theme";

const read = (): Theme => (document.documentElement.dataset.theme === "light" ? "light" : "dark");

function subscribe(onChange: () => void) {
  const mo = new MutationObserver(onChange);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}

/** Current theme; re-renders when <html data-theme> changes (WebGL scenes re-read token colours on it). */
export const useTheme = () => useSyncExternalStore(subscribe, read, (): Theme => "dark");

export function setTheme(theme: Theme) {
  if (theme === "light") document.documentElement.dataset.theme = "light";
  else delete document.documentElement.dataset.theme;
  try {
    localStorage.setItem(KEY, theme);
  } catch {}
}
