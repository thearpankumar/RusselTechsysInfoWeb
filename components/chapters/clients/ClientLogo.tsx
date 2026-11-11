import type { CSSProperties } from "react";
import { getClientLogo } from "@/content/clientLogos";
import { cn } from "@/lib/utils";

export { getClientLogo };

/**
 * Display height (px) for a logo of the given aspect ratio: every mark gets roughly the same area,
 * so wide wordmarks sit shorter and square emblems taller and they read at a similar weight.
 */
const LOGO_AREA = 1100;
function displayHeight(ratio: number) {
  return Math.min(36, Math.sqrt(LOGO_AREA / ratio));
}

/**
 * A client's logo drawn in the current text colour (the file is used as a mask), so the tile
 * decides the tone: on-primary on white tiles, muted grey on dimmed ones. Decorative: the caller
 * provides the accessible name. Renders nothing when the client has no logo.
 */
export function ClientLogoMark({ id, scale = 1, maxWidth = "86%", className }: { id: string; scale?: number; maxWidth?: string; className?: string }) {
  const logo = getClientLogo(id);
  if (!logo) return null;
  const ratio = logo.width / logo.height;
  const width = displayHeight(ratio) * (logo.caption ? 0.85 : 1) * scale * ratio;
  const mask = `url("${logo.src}") center / contain no-repeat`;
  const style: CSSProperties = {
    width: `calc(${Math.round(width)}px * var(--logo-scale, 1))`,
    maxWidth,
    aspectRatio: `${logo.width} / ${logo.height}`,
    mask,
    WebkitMask: mask,
  };
  return <span aria-hidden data-logo={id} className={cn("block shrink-0 bg-current", className)} style={style} />;
}
