"use client";

// Small helpers shared by chapters 06, 09, 11 and 12 (builder C).
import * as React from "react";

/** Overlay over a list: open by id, step prev/next with wrap-around. */
export function useIndexOverlay<T extends { id: string }>(items: T[]) {
  const [openId, setOpenId] = React.useState<string | null>(null);
  const index = openId ? items.findIndex((i) => i.id === openId) : -1;
  const current = index >= 0 ? items[index] : null;
  const step = (dir: 1 | -1) => {
    if (index < 0 || !items.length) return;
    setOpenId(items[(index + dir + items.length) % items.length].id);
  };
  return {
    current,
    index,
    total: items.length,
    open: setOpenId,
    close: () => setOpenId(null),
    onOpenChange: (o: boolean) => {
      if (!o) setOpenId(null);
    },
    prev: () => step(-1),
    next: () => step(1),
  };
}

let webglCache: boolean | null = null;
function detectWebGL(): boolean {
  if (webglCache !== null) return webglCache;
  try {
    const c = document.createElement("canvas");
    webglCache = !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    webglCache = false;
  }
  return webglCache;
}
const noopSubscribe = () => () => {};

/** true once on the client if WebGL is available; false on the server. */
export function useWebGL(): boolean {
  return React.useSyncExternalStore(noopSubscribe, detectWebGL, () => false);
}

/** true when mounted on the client (avoids hydration mismatch for client-only branches). */
export function useMounted(): boolean {
  return React.useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );
}

/** Element size via ResizeObserver. */
export function useSize<E extends HTMLElement>(): [React.RefObject<E | null>, { width: number; height: number }] {
  const ref = React.useRef<E>(null);
  const [size, setSize] = React.useState({ width: 0, height: 0 });
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const r = entry.contentRect;
      setSize((s) => (s.width === r.width && s.height === r.height ? s : { width: r.width, height: r.height }));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, size];
}

/** Two-digit mono index. */
export const pad2 = (n: number) => String(n).padStart(2, "0");
