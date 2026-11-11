"use client";

import * as React from "react";
import { useSearchOpen } from "@/lib/searchIndex";

/**
 * State for a DetailOverlay that pages through a list (prev/next, counter) and opens when the
 * command palette asks for an entity of `searchType` by id.
 */
export function useIndexedOverlay<T extends { id: string }>(items: readonly T[], searchType?: string) {
  const [index, setIndex] = React.useState<number | null>(null);
  const openId = React.useCallback(
    (id: string) => {
      const i = items.findIndex((it) => it.id === id);
      if (i >= 0) setIndex(i);
    },
    [items]
  );
  useSearchOpen(searchType ?? "__none__", openId);
  const n = items.length;
  return {
    index,
    item: index === null ? null : items[index],
    open: (i: number) => setIndex(i),
    openId,
    close: () => setIndex(null),
    overlayProps: {
      open: index !== null,
      onOpenChange: (o: boolean) => {
        if (!o) setIndex(null);
      },
      index: index ?? 0,
      total: n,
      onPrev: n > 1 ? () => setIndex((i) => (i === null ? 0 : (i - 1 + n) % n)) : undefined,
      onNext: n > 1 ? () => setIndex((i) => (i === null ? 0 : (i + 1) % n)) : undefined,
    },
  };
}
