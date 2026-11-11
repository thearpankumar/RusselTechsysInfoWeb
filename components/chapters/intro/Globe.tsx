"use client";

// Dot-matrix globe: Three.js when WebGL and motion are available, static SVG otherwise.
// Shared by the Intro chapter (scroll-settled) and the gate page (auto-settled, dimmed).
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import * as React from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { GlobeStatic } from "./GlobeStatic";
import type { ProgressSource } from "./GlobeCanvas";

const GlobeCanvas = dynamic(() => import("./GlobeCanvas"), { ssr: false });

function hasWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export interface GlobeProps {
  /** Land bitmask from getLandMask() (server). */
  mask: string;
  settle?: "scroll" | "auto" | "none";
  progress?: ProgressSource;
  dim?: boolean;
  /** Page surface behind the globe (gate page sits on canvas). */
  surface?: "background" | "canvas";
  className?: string;
}

export function Globe({ mask, settle = "auto", progress, dim, surface, className }: GlobeProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduce = useReducedMotionSafe();
  const [mode, setMode] = React.useState<"pending" | "webgl" | "static">("pending");
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    // Decide once on the client; deferred so the first paint stays light.
    const id = requestAnimationFrame(() => setMode(!reduce && hasWebGL() ? "webgl" : "static"));
    return () => cancelAnimationFrame(id);
  }, [reduce]);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "10% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} aria-hidden className={cn("relative aspect-square", className)}>
      {mode === "static" && <GlobeStatic mask={mask} dim={dim} />}
      {mode === "webgl" && (
        <div className="absolute inset-0 animate-in fade-in-0 duration-200">
          <GlobeCanvas mask={mask} settle={settle} progress={progress} active={visible} dim={dim} surface={surface} />
        </div>
      )}
    </div>
  );
}
