import * as React from "react";
import Image from "next/image";
import { getPhoto, type PhotoAsset } from "@/content/assets";
import { cn } from "@/lib/utils";

export interface PhotoCardProps {
  /** A PhotoAsset or its id from content/assets.ts. */
  asset: PhotoAsset | string;
  /** Override the name on the photo (defaults to asset.title). */
  title?: React.ReactNode;
  /** Override the line under the name (defaults to asset.caption). */
  caption?: React.ReactNode;
  /** Aspect ratio of the frame. 3:2 matches the files; 16:9 and 4:5 crop. */
  ratio?: "3/2" | "16/9" | "4/5" | "1/1";
  /** Show the mono credit line under the photo (default true). Hide only where a grouped credit is shown. */
  showCredit?: boolean;
  /** next/image `sizes`; defaults to a half-width card. */
  sizes?: string;
  /** Eager-load (above the fold only). */
  priority?: boolean;
  /** Makes the photo a door (opens an overlay). */
  onClick?: () => void;
  className?: string;
}

const RATIO: Record<NonNullable<PhotoCardProps["ratio"]>, string> = {
  "3/2": "aspect-[3/2]",
  "16/9": "aspect-video",
  "4/5": "aspect-[4/5]",
  "1/1": "aspect-square",
};

/**
 * DESIGN.md photo card: full-bleed photo, rounded.lg, name (body-lg 500) and role (body-sm body)
 * over a dark bottom scrim (the only permitted gradient). Files are pre-toned warm monochrome;
 * a grayscale filter keeps any future colour file on-palette. Credit sits under the frame in mono-sm.
 */
export function PhotoCard({ asset, title, caption, ratio = "3/2", showCredit = true, sizes, priority, onClick, className }: PhotoCardProps) {
  const a = typeof asset === "string" ? getPhoto(asset) : asset;
  if (!a) return null;
  const name = title ?? a.title;
  const line = caption ?? a.caption;

  const frame = (
    <span className={cn("relative block w-full overflow-hidden rounded-lg border border-border bg-canvas", RATIO[ratio])}>
      <Image
        src={a.src}
        alt={a.alt}
        fill
        sizes={sizes ?? "(min-width: 1280px) 560px, (min-width: 768px) 50vw, 100vw"}
        priority={priority}
        className="object-cover grayscale"
      />
      {/* Warm tone: pulls highlights down so photos sit inside the near-black palette. */}
      <span aria-hidden className="absolute inset-0 bg-scrim/10" />
      {/* Bottom scrim (DESIGN.md: the only permitted gradient). */}
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-3/5 bg-linear-to-t from-scrim/95 via-scrim/60 to-transparent" />
      {(name || line) && (
        <span className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-4 text-left sm:p-6">
          {name && <span className="t-body-lg font-medium text-on-surface">{name}</span>}
          {line && <span className="t-body-sm text-body">{line}</span>}
        </span>
      )}
    </span>
  );

  return (
    <figure className={cn("m-0 flex flex-col gap-3", className)}>
      {onClick ? (
        <button
          type="button"
          onClick={onClick}
          className="block w-full cursor-pointer rounded-lg text-left hover:[&>span]:border-chart-past [&>span]:transition-colors [&>span]:duration-150"
        >
          {frame}
        </button>
      ) : (
        frame
      )}
      {showCredit && (
        <figcaption className="t-mono-sm text-muted">
          <a href={a.sourceUrl} target="_blank" rel="noreferrer noopener" className="underline-offset-4 hover:text-body hover:underline">
            {a.credit}
          </a>
        </figcaption>
      )}
    </figure>
  );
}

export interface PhotoStripProps {
  /** Asset ids (or assets), shown left to right. 2–4 reads best. */
  assets: (PhotoAsset | string)[];
  /** Optional eyebrow-level label above the strip (label-caps, muted). */
  label?: React.ReactNode;
  /** One shared credit block under the strip instead of a line per card. */
  groupedCredit?: boolean;
  ratio?: PhotoCardProps["ratio"];
  onOpen?: (id: string) => void;
  className?: string;
  /** Load the first photo eagerly (use when the strip is above the fold). */
  priority?: boolean;
}

/** A grid of photo cards (24px gutters): 2 or 3 per row from tablets up (4 photos = 2 × 2), 1 on phones. */
export function PhotoStrip({ assets, label, groupedCredit = true, ratio = "3/2", onOpen, priority, className }: PhotoStripProps) {
  const list = assets.map((x) => (typeof x === "string" ? getPhoto(x) : x)).filter((x): x is PhotoAsset => !!x);
  const cols = list.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2";
  return (
    <section className={cn("flex flex-col gap-6", className)}>
      {label && <p className="t-label-caps text-muted">{label}</p>}
      <ul className={cn("grid grid-cols-1 gap-6", cols)}>
        {list.map((a, i) => (
          <li key={a.id}>
            <PhotoCard
              asset={a}
              priority={priority && i === 0}
              ratio={ratio}
              showCredit={!groupedCredit}
              sizes={list.length === 3 ? "(min-width: 1280px) 380px, (min-width: 768px) 33vw, 100vw" : "(min-width: 1280px) 560px, (min-width: 768px) 50vw, 100vw"}
              onClick={onOpen ? () => onOpen(a.id) : undefined}
            />
          </li>
        ))}
      </ul>
      {groupedCredit && (
        <p className="t-mono-sm text-muted">
          Photos:{" "}
          {list.map((a, i) => (
            <React.Fragment key={a.id}>
              {i > 0 && " · "}
              <a href={a.sourceUrl} target="_blank" rel="noreferrer noopener" className="underline-offset-4 hover:text-body hover:underline">
                {a.author}
              </a>
            </React.Fragment>
          ))}
          {" · "}
          {Array.from(new Set(list.map((a) => a.licence))).join(" / ")} · via Wikimedia Commons
        </p>
      )}
    </section>
  );
}
