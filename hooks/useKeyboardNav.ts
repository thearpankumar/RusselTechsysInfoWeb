"use client";

import { useEffect } from "react";

const isTyping = (t: EventTarget | null) => {
  const el = t as HTMLElement | null;
  if (!el) return false;
  return el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName);
};

export interface KeyboardNavHandlers {
  onPrev: () => void;
  onNext: () => void;
  onSearch: () => void;
  /** "[" — collapse / expand the desktop chapter rail. */
  onToggleRail?: () => void;
  /** "p" — presenter mode on / off. */
  onTogglePresent?: () => void;
  /** Esc (no dialog open): leave presenter mode, else back to the map. */
  onEscape?: () => void;
  /** "m" — back to the map (hub). */
  onMap?: () => void;
  /** Home / End — first / last chapter. */
  onFirst?: () => void;
  onLast?: () => void;
}

/**
 * Global keys: ←/→ = previous/next chapter, "/" or ⌘K / Ctrl+K = search, "[" = collapse rail, "p" = presenter mode,
 * Esc / "m" = back to the map, Home/End = first/last section. Ignored while typing or when a dialog is open.
 */
export function useKeyboardNav({ onPrev, onNext, onSearch, onToggleRail, onTogglePresent, onEscape, onMap, onFirst, onLast }: KeyboardNavHandlers) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onSearch();
        return;
      }
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
      if (isTyping(e.target)) return;
      if (document.querySelector('[role="dialog"][data-state="open"]')) return;
      switch (e.key) {
        case "/":
          e.preventDefault();
          onSearch();
          break;
        case "ArrowRight":
          e.preventDefault();
          onNext();
          break;
        case "ArrowLeft":
          e.preventDefault();
          onPrev();
          break;
        case "[":
          if (onToggleRail) {
            e.preventDefault();
            onToggleRail();
          }
          break;
        case "p":
        case "P":
          if (onTogglePresent) {
            e.preventDefault();
            onTogglePresent();
          }
          break;
        case "Escape":
          onEscape?.();
          break;
        case "m":
        case "M":
          if (onMap) {
            e.preventDefault();
            onMap();
          }
          break;
        case "Home":
          if (onFirst) {
            e.preventDefault();
            onFirst();
          }
          break;
        case "End":
          if (onLast) {
            e.preventDefault();
            onLast();
          }
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onPrev, onNext, onSearch, onToggleRail, onTogglePresent, onEscape, onMap, onFirst, onLast]);
}
