// Talencia Global "tg" mark (vector from talenciaglobal.com), redrawn in the site's monochrome: it takes
// currentColor, so it can be a solid glyph beside the wordmark or a hairline outline watermark.
import * as React from "react";

const T =
  "M10.39 8.094v3.656H.204V8.094h10.188zM2.345 3.89H7.61v15.593q0 .672.157 1.047.155.36.53.516.392.14 1.032.14.453 0 .75-.015.297-.032.563-.078v3.765a8.7 8.7 0 0 1-1.407.328 9 9 0 0 1-1.562.125q-1.688 0-2.89-.53a3.77 3.77 0 0 1-1.813-1.673q-.625-1.14-.625-2.968z";
const G =
  "M25.318 8.094H30.1v16.25q0 2.343-1.078 3.968-1.079 1.64-3.015 2.485-1.923.86-4.5.86-1.14 0-2.329-.298a9 9 0 0 1-2.218-.843 6 6 0 0 1-1.735-1.391l2.203-3.094q.642.72 1.61 1.219.969.516 2.281.516 1.14 0 1.906-.407a2.72 2.72 0 0 0 1.188-1.187q.406-.765.406-1.86V12.095l.5-4zM14.084 16.75v-.328q0-1.922.469-3.5.483-1.594 1.374-2.735a6.2 6.2 0 0 1 2.188-1.78q1.282-.626 2.89-.626 1.735 0 2.844.672a4.85 4.85 0 0 1 1.797 1.844q.688 1.187 1.063 2.781.39 1.578.656 3.406v.391a23 23 0 0 1-.734 3.25q-.454 1.515-1.188 2.688a5.6 5.6 0 0 1-1.844 1.843q-1.094.657-2.625.657-1.593 0-2.875-.641a6.4 6.4 0 0 1-2.171-1.797q-.891-1.155-1.376-2.719-.468-1.562-.468-3.406m5.265-.328v.328q0 .953.172 1.766.188.811.563 1.437.375.61.922.953.562.345 1.312.344 1.14 0 1.844-.484.703-.485 1.015-1.375.313-.891.266-2.094v-1.235q.031-1.03-.14-1.812-.172-.797-.547-1.328a2.2 2.2 0 0 0-.97-.797q-.592-.281-1.437-.281-.735 0-1.297.344a2.8 2.8 0 0 0-.937.968q-.375.609-.578 1.453a8.2 8.2 0 0 0-.188 1.813";

export function TalenciaMark({ variant = "solid", className, title }: { variant?: "solid" | "outline" | "brand"; className?: string; title?: string }) {
  const outline = variant === "outline";
  const brand = variant === "brand";
  return (
    <svg
      viewBox="0 0 31 32"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      fill={outline ? "none" : "currentColor"}
      stroke={outline ? "currentColor" : "none"}
      strokeWidth={outline ? 1 : 0}
      strokeLinejoin="round"
    >
      <path d={T} vectorEffect="non-scaling-stroke" className={brand ? "fill-brand-tg-t" : undefined} />
      <path d={G} vectorEffect="non-scaling-stroke" className={brand ? "fill-brand-tg-g" : undefined} />
    </svg>
  );
}
