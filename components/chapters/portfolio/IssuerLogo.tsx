import type { CSSProperties } from "react";
import { getIssuerLogo } from "@/content/orgLogos";
import { cn } from "@/lib/utils";

export { getIssuerLogo };

/**
 * An issuer's logo drawn in the current text colour (the file is used as a mask), sized by area like
 * ClientLogoMark so wide wordmarks sit shorter and square emblems taller. Resolves org marks
 * (content/orgLogos.ts) and client marks (content/clientLogos.ts). Decorative: the caller names it.
 */
export function IssuerLogoMark({
  id,
  area = 1100,
  maxHeight = 36,
  maxWidth = "100%",
  className,
}: {
  id: string;
  area?: number;
  maxHeight?: number;
  maxWidth?: string;
  className?: string;
}) {
  const logo = getIssuerLogo(id);
  if (!logo) return null;
  const ratio = logo.width / logo.height;
  const height = Math.min(maxHeight, Math.sqrt(area / ratio));
  const mask = `url("${logo.src}") center / contain no-repeat`;
  const style: CSSProperties = {
    width: `${Math.round(height * ratio)}px`,
    maxWidth,
    aspectRatio: `${logo.width} / ${logo.height}`,
    mask,
    WebkitMask: mask,
  };
  return <span aria-hidden data-logo={id} className={cn("block shrink-0 bg-current", className)} style={style} />;
}
