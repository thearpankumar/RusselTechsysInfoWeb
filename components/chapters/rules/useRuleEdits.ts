"use client";

// Local date edits for the business-rules register. The site is static (no backend), so edited state histories
// are kept in this browser's localStorage, applied over the published register everywhere (status, filters,
// timeline, exports) and carried out of the browser by the Excel download, where they are highlighted.
// Read with useSyncExternalStore: the server and the first client render see no edits (no hydration mismatch).
import * as React from "react";
import type { RuleStateChange } from "@/content/types-extra";
import { getRule } from "@/content/rules";
import { validateHistory, type RuleEdits } from "@/lib/rules";

const KEY = "rt:rules-edits:v1";
const EMPTY: RuleEdits = {};

let cache: RuleEdits | null = null;
const listeners = new Set<() => void>();

const same = (a: RuleStateChange[], b: RuleStateChange[]) =>
  a.length === b.length && a.every((h, i) => h.state === b[i].state && h.from === b[i].from && (h.note ?? "") === (b[i].note ?? ""));

/** Keep only edits for known rules whose history is still valid (storage can hold anything). */
function sanitize(raw: unknown): RuleEdits {
  if (!raw || typeof raw !== "object") return {};
  const out: RuleEdits = {};
  for (const [id, h] of Object.entries(raw as Record<string, unknown>)) {
    const rule = getRule(id);
    if (!rule || !Array.isArray(h)) continue;
    const history = h
      .filter((x): x is RuleStateChange => !!x && typeof x === "object" && typeof (x as RuleStateChange).state === "string" && typeof (x as RuleStateChange).from === "string")
      .map((x) => ({ state: x.state, from: x.from, ...(typeof x.note === "string" ? { note: x.note } : {}) }));
    if (history.length && !validateHistory(history, rule) && !same(history, rule.history)) out[id] = history;
  }
  return out;
}

function read(): RuleEdits {
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(KEY);
    cache = raw ? sanitize(JSON.parse(raw)) : EMPTY;
  } catch {
    cache = EMPTY;
  }
  return cache;
}

function write(next: RuleEdits) {
  cache = Object.keys(next).length ? next : EMPTY;
  try {
    if (cache === EMPTY) window.localStorage.removeItem(KEY);
    else window.localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {
    /* storage blocked: edits still apply for this page view */
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  // Edits made in another tab.
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function useRuleEdits() {
  const edits = React.useSyncExternalStore(subscribe, read, () => EMPTY);

  /** Save a rule's edited history; saving the published history again removes the edit. */
  const save = React.useCallback((id: string, history: RuleStateChange[]) => {
    const rule = getRule(id);
    if (!rule) return;
    const next = { ...read() };
    if (same(history, rule.history)) delete next[id];
    else next[id] = history.map((h) => ({ ...h }));
    write(next);
  }, []);

  const reset = React.useCallback((id: string) => {
    const next = { ...read() };
    delete next[id];
    write(next);
  }, []);

  const resetAll = React.useCallback(() => write({}), []);

  return { edits, count: Object.keys(edits).length, save, reset, resetAll };
}
