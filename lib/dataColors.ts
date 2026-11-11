// Categorical data palette helpers. data-* colours encode categories ONLY (DESIGN.md).
// Class strings are spelled out in full so Tailwind can detect them.

export const DATA_COLORS = ["sage", "slate", "tan", "lavender", "olive", "teal", "rose", "moss"] as const;
export type DataColor = (typeof DATA_COLORS)[number];

/** Background classes for 8–10px dots, chart marks and 3px stripes. */
export const dataBg: Record<DataColor, string> = {
  sage: "bg-data-sage",
  slate: "bg-data-slate",
  tan: "bg-data-tan",
  lavender: "bg-data-lavender",
  olive: "bg-data-olive",
  teal: "bg-data-teal",
  rose: "bg-data-rose",
  moss: "bg-data-moss",
};

/** ~25% tint for role badges. */
export const dataTint: Record<DataColor, string> = {
  sage: "bg-data-sage/25",
  slate: "bg-data-slate/25",
  tan: "bg-data-tan/25",
  lavender: "bg-data-lavender/25",
  olive: "bg-data-olive/25",
  teal: "bg-data-teal/25",
  rose: "bg-data-rose/25",
  moss: "bg-data-moss/25",
};

/** 1px connector lines / outlines. */
export const dataBorder: Record<DataColor, string> = {
  sage: "border-data-sage",
  slate: "border-data-slate",
  tan: "border-data-tan",
  lavender: "border-data-lavender",
  olive: "border-data-olive",
  teal: "border-data-teal",
  rose: "border-data-rose",
  moss: "border-data-moss",
};

/** SVG fill / stroke classes. */
export const dataFill: Record<DataColor, string> = {
  sage: "fill-data-sage",
  slate: "fill-data-slate",
  tan: "fill-data-tan",
  lavender: "fill-data-lavender",
  olive: "fill-data-olive",
  teal: "fill-data-teal",
  rose: "fill-data-rose",
  moss: "fill-data-moss",
};
export const dataStroke: Record<DataColor, string> = {
  sage: "stroke-data-sage",
  slate: "stroke-data-slate",
  tan: "stroke-data-tan",
  lavender: "stroke-data-lavender",
  olive: "stroke-data-olive",
  teal: "stroke-data-teal",
  rose: "stroke-data-rose",
  moss: "stroke-data-moss",
};

/** CSS variable for inline styles / canvas / three.js: e.g. `var(--color-data-sage)`. */
export const dataVar = (c: DataColor) => `var(--color-data-${c})`;

/** Stable colour for the nth category (assign in DESIGN.md order). */
export const dataColorAt = (i: number): DataColor => DATA_COLORS[((i % 8) + 8) % 8];
