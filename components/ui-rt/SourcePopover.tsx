"use client";

import * as React from "react";
import Link from "next/link";
import { Popover as PopoverPrimitive } from "radix-ui";
import { ArrowUpRight } from "lucide-react";
import type { Source } from "@/content/types";
import { cn } from "@/lib/utils";

// Sources are loaded lazily (and defensively) the first time any popover opens.
let cache: Source[] | null = null;
let pending: Promise<Source[]> | null = null;
function loadSources(): Promise<Source[]> {
  if (cache) return Promise.resolve(cache);
  pending ??= import("@/content/sources")
    .then((m) => {
      const list = (m as { sources?: unknown }).sources;
      cache = Array.isArray(list) ? (list as Source[]) : [];
      return cache;
    })
    .catch(() => (cache = []));
  return pending;
}

/** Popover listing the titles/publishers/links of the given source ids, with a jump to the Sources chapter. */
export function SourcePopover({ ids, children }: { ids: string[]; children: React.ReactNode }) {
  const [list, setList] = React.useState<Source[] | null>(cache);
  const onOpenChange = (open: boolean) => {
    if (open && !list) loadSources().then(setList);
  };
  const found = (list ?? []).filter((s) => ids.includes(s.id));
  const missing = list ? ids.filter((id) => !found.some((s) => s.id === id)) : [];

  return (
    <PopoverPrimitive.Root onOpenChange={onOpenChange}>
      <PopoverPrimitive.Trigger asChild>{children}</PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          sideOffset={8}
          collisionPadding={16}
          data-lenis-prevent
          onKeyDown={(e) => e.stopPropagation()}
          className={cn(
            "z-50 max-h-96 w-80 overflow-y-auto rounded-lg border border-border bg-background p-4 text-on-surface sm:w-96",
            "duration-150 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0"
          )}
        >
          <p className="mb-3 t-label-caps text-muted">Sources</p>
          {!list && <p className="t-body-sm text-muted">Loading…</p>}
          <ul className="divide-y divide-border">
            {found.map((s) => (
              <li key={s.id} className="py-3 first:pt-0">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 t-mono-sm text-muted">{s.id}</span>
                  <div className="min-w-0 flex-1">
                    <p className="t-body-sm text-on-surface">{s.title}</p>
                    <p className="mt-1 t-body-sm text-muted">{[s.publisher, s.date].filter(Boolean).join(" · ")}</p>
                    {s.url && (
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex max-w-full items-center gap-1 t-body-sm text-body underline-offset-4 hover:text-on-surface hover:underline"
                      >
                        <span className="truncate">{s.url.replace(/^https?:\/\/(www\.)?/, "")}</span>
                        <ArrowUpRight className="size-4 shrink-0" strokeWidth={1.5} />
                      </a>
                    )}
                  </div>
                </div>
              </li>
            ))}
            {missing.map((id) => (
              <li key={id} className="py-3 first:pt-0 t-body-sm text-muted">
                <span className="t-mono-sm">{id}</span> · not yet listed
              </li>
            ))}
          </ul>
          <Link href={`/sources/library#source-${ids[0] ?? ""}`} className="mt-3 inline-flex t-body-sm text-body underline-offset-4 hover:text-on-surface hover:underline">
            All sources →
          </Link>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
