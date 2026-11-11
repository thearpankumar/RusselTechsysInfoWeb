"use client";

// Command-palette search. The full static catalog (every chapter's items, hrefs resolved to section routes) lives in
// lib/searchCatalog.ts and is lazy-loaded by the palette. This module keeps the shared types, the open-intent
// plumbing, and a small runtime registry for items that only exist after mount.
//
// Open intent across pages: the palette navigates to "/<chapter>/<section>?open=<type>:<id>"; the chapter's
// useSearchOpen(type, handler) consumes the param after mount and strips it from the URL.
// Selecting an item on the current page scrolls to its #hash and broadcasts `open` (listen with useSearchOpen).

import { useEffect, useSyncExternalStore } from "react";
import { chapters } from "@/lib/journeyChapters";

export interface SearchItem {
  /** Unique id, e.g. "person:ravi". Re-registering the same id replaces it. */
  id: string;
  label: string;
  /** Group heading in the palette: "Chapters", "People", "Clients", "Suppliers", "Files", "Fields"… */
  group: string;
  /** Muted right-hand hint, e.g. role or chapter name. */
  hint?: string;
  keywords?: string[];
  /** In-page anchor ("#clients") or route ("/styleguide"). */
  href?: string;
  /** Ask a chapter to open a detail overlay after scrolling: { type: "person", id: "ravi" }. */
  open?: { type: string; id: string };
  onSelect?: () => void;
}

export const searchIndex: SearchItem[] = chapters.map((c) => ({
  id: `chapter:${c.id}`,
  label: c.label,
  group: "Chapters",
  hint: c.index,
  href: `/${c.id}`,
  keywords: [...c.covers, c.teaser],
}));

const registry = new Map<string, SearchItem>(searchIndex.map((i) => [i.id, i]));
let snapshot: SearchItem[] = [...registry.values()];
const listeners = new Set<() => void>();

function emit() {
  snapshot = [...registry.values()];
  listeners.forEach((l) => l());
}

/** Add or replace search items. Safe to call repeatedly (idempotent by id). */
export function registerSearchItems(items: SearchItem[]) {
  let changed = false;
  for (const item of items) {
    if (registry.get(item.id) !== item) {
      registry.set(item.id, item);
      changed = true;
    }
  }
  if (changed) emit();
}

export function unregisterSearchItems(ids: string[]) {
  let changed = false;
  for (const id of ids) changed = registry.delete(id) || changed;
  if (changed) emit();
}

/** Live list of all registered items (used by CommandPalette). */
export function useSearchItems(): SearchItem[] {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => snapshot,
    () => snapshot
  );
}

/** Register items for as long as the calling component is mounted. */
export function useRegisterSearchItems(items: SearchItem[]) {
  useEffect(() => {
    registerSearchItems(items);
  }, [items]);
}

const OPEN_EVENT = "rt:search-open";

/** Broadcast an "open this entity" request (fired by the palette). */
export function emitSearchOpen(target: { type: string; id: string }) {
  window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: target }));
}

export const OPEN_PARAM = "open";

/** Listen for palette requests to open an entity of `type` (e.g. "person"), including a pending ?open=type:id. */
export function useSearchOpen(type: string, handler: (id: string) => void) {
  useEffect(() => {
    const url = new URL(window.location.href);
    const pending = url.searchParams.get(OPEN_PARAM);
    if (pending) {
      const i = pending.indexOf(":");
      if (i > 0 && pending.slice(0, i) === type) {
        const id = pending.slice(i + 1);
        url.searchParams.delete(OPEN_PARAM);
        window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
        // Let the section's entrance settle before the overlay opens.
        window.setTimeout(() => handler(id), 250);
      }
    }
  }, [type, handler]);
  useEffect(() => {
    const fn = (e: Event) => {
      const d = (e as CustomEvent<{ type: string; id: string }>).detail;
      if (d?.type === type) handler(d.id);
    };
    window.addEventListener(OPEN_EVENT, fn);
    return () => window.removeEventListener(OPEN_EVENT, fn);
  }, [type, handler]);
}
