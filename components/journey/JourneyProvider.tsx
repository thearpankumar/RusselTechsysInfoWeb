"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { chapters, type ChapterId } from "@/lib/journeyChapters";
import { parsePath, sequence, sequenceIndex } from "@/lib/structure";
import { useKeyboardNav } from "@/hooks/useKeyboardNav";
import { CommandPalette } from "./CommandPalette";

interface JourneyState {
  /** Chapter of the current route (null on the hub). */
  active: ChapterId | null;
  /** Section of the current route (null on the hub). */
  section: string | null;
  /** 0..1 position in the whole journey (section by section). */
  progress: number;
  /** Navigate to a route ("/clients/matrix") or, for backwards compatibility, a chapter id. */
  goTo: (hrefOrId: string) => void;
  openSearch: () => void;
  /** Desktop rail collapsed to the slim index-only form ("[" toggles; persisted in localStorage). */
  railCollapsed: boolean;
  toggleRail: () => void;
  /** Presenter mode ("p"): rail hidden, slim counter, section-by-section stepping. */
  presenting: boolean;
  togglePresent: () => void;
}

const RAIL_KEY = "rt:rail-collapsed";

const JourneyContext = React.createContext<JourneyState | null>(null);

/** Access journey state. Must be inside <JourneyProvider>. */
export function useJourney() {
  const ctx = React.useContext(JourneyContext);
  if (!ctx) throw new Error("useJourney must be used inside <JourneyProvider>");
  return ctx;
}

/** Route-aware journey state + keyboard navigation + command palette. Lives in the (journey) layout. */
export function JourneyProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { chapter: active, section } = parsePath(pathname);
  const pos = sequenceIndex(active, section);
  const progress = pos < 0 ? 0 : (pos + 1) / sequence.length;

  const [searchOpen, setSearchOpen] = React.useState(false);
  const [railCollapsed, setRailCollapsed] = React.useState(false);
  const [presenting, setPresenting] = React.useState(false);

  // Read the persisted rail state after mount (no hydration mismatch: the server always renders expanded).
  React.useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (localStorage.getItem(RAIL_KEY) === "1") setRailCollapsed(true);
    } catch {}
  }, []);
  const toggleRail = React.useCallback(() => {
    setRailCollapsed((c) => {
      try {
        localStorage.setItem(RAIL_KEY, c ? "0" : "1");
      } catch {}
      return !c;
    });
  }, []);

  // Canvases (globe, harness) and measured charts listen for window resize; nudge them after the offset animates.
  React.useEffect(() => {
    const t = window.setTimeout(() => window.dispatchEvent(new Event("resize")), 220);
    return () => window.clearTimeout(t);
  }, [railCollapsed, presenting]);

  const togglePresent = React.useCallback(() => {
    setPresenting((p) => {
      const next = !p;
      try {
        if (next && !document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => {});
        if (!next && document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
      } catch {}
      return next;
    });
  }, []);
  // Leaving browser fullscreen (Esc is swallowed by the browser there) also leaves presenter mode.
  React.useEffect(() => {
    const onFs = () => {
      if (!document.fullscreenElement) setPresenting(false);
    };
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const goTo = React.useCallback(
    (target: string) => {
      const href = target.startsWith("/") ? target : chapters.some((c) => c.id === target) ? `/${target}` : `#${target}`;
      if (href.startsWith("#")) document.getElementById(target)?.scrollIntoView({ block: "start" });
      else router.push(href);
    },
    [router]
  );

  const onPrev = React.useCallback(() => {
    if (pos < 0) return;
    router.push(pos === 0 ? "/" : sequence[pos - 1].href);
  }, [pos, router]);
  const onNext = React.useCallback(() => {
    const next = sequence[pos + 1];
    if (next) router.push(next.href);
  }, [pos, router]);
  const toMap = React.useCallback(() => {
    if (presenting) {
      setPresenting(false);
      if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
      return;
    }
    if (pathname !== "/") router.push("/");
  }, [presenting, pathname, router]);
  const openSearch = React.useCallback(() => setSearchOpen(true), []);
  const onFirst = React.useCallback(() => router.push(sequence[0].href), [router]);
  const onLast = React.useCallback(() => router.push(sequence[sequence.length - 1].href), [router]);
  useKeyboardNav({ onPrev, onNext, onSearch: openSearch, onToggleRail: toggleRail, onTogglePresent: togglePresent, onEscape: toMap, onFirst, onLast });

  // Warm the neighbours so ←/→ feel instant.
  React.useEffect(() => {
    for (const s of [sequence[pos - 1], sequence[pos + 1]]) if (s) router.prefetch(s.href);
  }, [pos, router]);

  const value = React.useMemo(
    () => ({ active, section, progress, goTo, openSearch, railCollapsed, toggleRail, presenting, togglePresent }),
    [active, section, progress, goTo, openSearch, railCollapsed, toggleRail, presenting, togglePresent]
  );
  return (
    <JourneyContext.Provider value={value}>
      {children}
      <CommandPalette open={searchOpen} onOpenChange={setSearchOpen} />
    </JourneyContext.Provider>
  );
}
