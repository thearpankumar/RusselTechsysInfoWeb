"use client";

// Local changes to the business-rules register, kept in this browser (the site is static; there is no backend):
//   • edits to published rules: only the fields that differ (title, statement, list, plain words, section, contexts,
//     strength, owner, entities, open questions, state history);
//   • rules added here, with their own state history;
//   • published rules deleted here (hidden, restorable);
//   • sections added, renamed / moved, or deleted here (a deleted published section hides its rules; restorable).
// Applied over the published register everywhere (status, filters, timeline, exports) by lib/rules.ts applyLocal,
// and carried out of the browser by the Excel download, where they are highlighted and listed.
// Read with useSyncExternalStore: the server and the first client render see no changes (no hydration mismatch).
import * as React from "react";
import type { LocalChanges, LocalRule, LocalSection, RuleDetails, RulePatch, RuleStateChange, SectionPatch } from "@/content/types-extra";
import { RULE_SECTIONS, getRule, ruleRegister, setCurrentSections } from "@/content/rules";
import { DETAIL_FIELDS, EMPTY_LOCAL, applySections, diffPatch, isEmptyLocal, todayISO, validateHistory, validateRuleDetails, validateSection } from "@/lib/rules";

const KEY = "rt:rules-local:v2";
/** Earlier format: { [ruleId]: history } (date edits only). Migrated on first read, then removed. */
const KEY_V1 = "rt:rules-edits:v1";

let cache: LocalChanges | null = null;
const listeners = new Set<() => void>();

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
const strings = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : undefined);

function cleanHistory(v: unknown): RuleStateChange[] | undefined {
  if (!Array.isArray(v)) return undefined;
  return v
    .filter((x) => isObj(x) && typeof x.state === "string" && typeof x.from === "string")
    .map((x) => ({ state: x.state as RuleStateChange["state"], from: x.from as string, ...(typeof x.note === "string" ? { note: x.note } : {}) }));
}

/** Pick the known detail fields from an untrusted object. */
function cleanDetails(v: Record<string, unknown>): Partial<RuleDetails> {
  const out: Record<string, unknown> = {};
  for (const k of DETAIL_FIELDS) {
    if (!(k in v)) continue;
    const x = v[k];
    if (k === "list" || k === "contexts" || k === "entities" || k === "questions") {
      const arr = strings(x);
      if (arr) out[k] = arr;
    } else if (typeof x === "string") out[k] = x;
  }
  return out as Partial<RuleDetails>;
}

/** Keep only well-formed, valid changes (storage can hold anything, including old or hand-edited data). */
function sanitize(raw: unknown): LocalChanges {
  if (!isObj(raw)) return EMPTY_LOCAL;
  const publishedSectionIds = new Set(RULE_SECTIONS.map((s) => s.id));

  // Sections first: rules are checked against the sections in use.
  const rawSec = isObj(raw.sections) ? raw.sections : {};
  const secEdits: Record<string, SectionPatch> = {};
  if (isObj(rawSec.edits))
    for (const [id, p] of Object.entries(rawSec.edits)) {
      const base = RULE_SECTIONS.find((s) => s.id === id);
      if (!base || !isObj(p)) continue;
      const patch: SectionPatch = {};
      if (typeof p.label === "string" && p.label !== base.label) patch.label = p.label;
      if (typeof p.part === "string" && p.part !== base.part) patch.part = p.part;
      if (Object.keys(patch).length && !Object.keys(validateSection({ ...base, ...patch })).length) secEdits[id] = patch;
    }
  const secAdded: LocalSection[] = [];
  const secTaken = new Set(publishedSectionIds);
  if (Array.isArray(rawSec.added))
    for (const a of rawSec.added) {
      if (!isObj(a) || typeof a.id !== "string" || typeof a.label !== "string" || typeof a.part !== "string") continue;
      if (Object.keys(validateSection({ label: a.label, part: a.part }, { id: a.id, takenIds: secTaken })).length) continue;
      secTaken.add(a.id);
      secAdded.push({ id: a.id, label: a.label, part: a.part, createdAt: typeof a.createdAt === "string" ? a.createdAt : todayISO() });
    }
  const secDeleted = (strings(rawSec.deleted) ?? []).filter((id, i, arr) => publishedSectionIds.has(id) && arr.indexOf(id) === i);
  const sections = { edits: secEdits, added: secAdded, deleted: secDeleted };
  // Validation of rule details looks up the sections in use.
  setCurrentSections(applySections(RULE_SECTIONS, { ...EMPTY_LOCAL, sections }));

  const edits: Record<string, RulePatch> = {};
  if (isObj(raw.edits)) {
    for (const [id, p] of Object.entries(raw.edits)) {
      const rule = getRule(id);
      if (!rule || !isObj(p)) continue;
      const patch: RulePatch = { ...cleanDetails(p) };
      const h = cleanHistory(p.history);
      if (h?.length) patch.history = h;
      if (patch.history && validateHistory(patch.history, rule)) continue;
      if (Object.keys(validateRuleDetails({ ...rule, ...patch })).length) continue;
      const diff = diffPatch(rule, patch);
      if (Object.keys(diff).length) edits[id] = diff;
    }
  }
  const added: LocalRule[] = [];
  const taken = new Set(ruleRegister.map((r) => r.id));
  if (Array.isArray(raw.added)) {
    for (const a of raw.added) {
      if (!isObj(a) || typeof a.id !== "string") continue;
      const d = { list: undefined, plain: undefined, entities: undefined, questions: undefined, ...cleanDetails(a) } as RuleDetails;
      const history = cleanHistory(a.history) ?? [];
      if (Object.keys(validateRuleDetails(d, { id: a.id, takenIds: taken })).length || !history.length || validateHistory(history, {})) continue;
      taken.add(a.id);
      added.push({ ...d, id: a.id, history, createdAt: typeof a.createdAt === "string" ? a.createdAt : todayISO() });
    }
  }
  const deleted = (strings(raw.deleted) ?? []).filter((id, i, arr) => !!getRule(id) && arr.indexOf(id) === i);
  const out = { edits, added, deleted, sections };
  return isEmptyLocal(out) ? EMPTY_LOCAL : out;
}

/** Set the cache and the sections in use together. */
function commit(next: LocalChanges) {
  cache = isEmptyLocal(next) ? EMPTY_LOCAL : next;
  setCurrentSections(applySections(RULE_SECTIONS, cache));
}

function read(): LocalChanges {
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) commit(sanitize(JSON.parse(raw)));
    else {
      // Migrate date edits saved by the earlier version.
      const v1 = window.localStorage.getItem(KEY_V1);
      const old = v1 ? JSON.parse(v1) : null;
      commit(isObj(old) ? sanitize({ edits: Object.fromEntries(Object.entries(old).map(([id, history]) => [id, { history }])) }) : EMPTY_LOCAL);
      if (v1) {
        window.localStorage.removeItem(KEY_V1);
        if (cache !== EMPTY_LOCAL) window.localStorage.setItem(KEY, JSON.stringify(cache));
      }
    }
  } catch {
    commit(EMPTY_LOCAL);
  }
  return cache!;
}

function write(next: LocalChanges) {
  commit(next);
  try {
    if (cache === EMPTY_LOCAL) window.localStorage.removeItem(KEY);
    else window.localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {
    /* storage blocked: changes still apply for this page view */
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  // Changes made in another tab.
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      read();
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

/** Save a patch for a published rule (merged with earlier changes; fields back to published drop out). */
function patchPublished(id: string, patch: RulePatch) {
  const rule = getRule(id);
  if (!rule) return;
  const cur = read();
  const merged = diffPatch(rule, { ...cur.edits[id], ...patch });
  const edits = { ...cur.edits };
  if (Object.keys(merged).length) edits[id] = merged;
  else delete edits[id];
  write({ ...cur, edits });
}

const withAdded = (cur: LocalChanges, id: string, f: (a: LocalRule) => LocalRule) => ({ ...cur, added: cur.added.map((a) => (a.id === id ? f(a) : a)) });

export function useLocalRules() {
  const local = React.useSyncExternalStore(subscribe, read, () => EMPTY_LOCAL);

  /* ---- rules ---- */

  /** Save edited details (title, statement, …) for a published or an added rule. */
  const saveDetails = React.useCallback((id: string, details: RuleDetails) => {
    const cur = read();
    if (cur.added.some((a) => a.id === id)) write(withAdded(cur, id, (a) => ({ ...a, ...details })));
    else patchPublished(id, details);
  }, []);

  /** Save an edited state history for a published or an added rule. */
  const saveHistory = React.useCallback((id: string, history: RuleStateChange[]) => {
    const cur = read();
    const h = history.map((x) => ({ ...x }));
    if (cur.added.some((a) => a.id === id)) write(withAdded(cur, id, (a) => ({ ...a, history: h })));
    else patchPublished(id, { history: h });
  }, []);

  const addRule = React.useCallback((rule: Omit<LocalRule, "createdAt">) => {
    const cur = read();
    write({ ...cur, added: [...cur.added, { ...rule, createdAt: todayISO() }] });
  }, []);

  /** Delete a rule: an added one is removed for good; a published one is hidden here (restorable). */
  const deleteRule = React.useCallback((id: string) => {
    const cur = read();
    if (cur.added.some((a) => a.id === id)) write({ ...cur, added: cur.added.filter((a) => a.id !== id) });
    else if (getRule(id) && !cur.deleted.includes(id)) write({ ...cur, deleted: [...cur.deleted, id] });
  }, []);

  /** Restore a deleted published rule (and its section, if that was deleted too). */
  const restoreRule = React.useCallback((id: string) => {
    const cur = read();
    const section = cur.edits[id]?.section ?? getRule(id)?.section;
    write({
      ...cur,
      deleted: cur.deleted.filter((x) => x !== id),
      sections: { ...cur.sections, deleted: cur.sections.deleted.filter((x) => x !== section) },
    });
  }, []);

  /** Back to the published rule (drops every local edit to it; a deleted rule stays deleted). */
  const reset = React.useCallback((id: string) => {
    const cur = read();
    const edits = { ...cur.edits };
    delete edits[id];
    write({ ...cur, edits });
  }, []);

  /* ---- sections ---- */

  const addSection = React.useCallback((sec: Omit<LocalSection, "createdAt">) => {
    const cur = read();
    write({ ...cur, sections: { ...cur.sections, added: [...cur.sections.added, { ...sec, createdAt: todayISO() }] } });
  }, []);

  /** Rename or move a section (published: stored as a patch; added: updated in place). */
  const saveSection = React.useCallback((id: string, patch: SectionPatch) => {
    const cur = read();
    if (cur.sections.added.some((a) => a.id === id)) {
      write({ ...cur, sections: { ...cur.sections, added: cur.sections.added.map((a) => (a.id === id ? { ...a, ...patch } : a)) } });
      return;
    }
    const base = RULE_SECTIONS.find((s) => s.id === id);
    if (!base) return;
    const merged: SectionPatch = { ...cur.sections.edits[id], ...patch };
    if (merged.label === base.label) delete merged.label;
    if (merged.part === base.part) delete merged.part;
    const edits = { ...cur.sections.edits };
    if (Object.keys(merged).length) edits[id] = merged;
    else delete edits[id];
    write({ ...cur, sections: { ...cur.sections, edits } });
  }, []);

  /** Delete a section: an added one goes for good with the rules added in it; a published one is hidden with its rules. */
  const deleteSection = React.useCallback((id: string) => {
    const cur = read();
    if (cur.sections.added.some((a) => a.id === id)) {
      write({
        ...cur,
        added: cur.added.filter((a) => a.section !== id),
        // Published rules moved into this section go back to their own section.
        edits: Object.fromEntries(
          Object.entries(cur.edits).map(([rid, p]) => {
            if (p.section !== id) return [rid, p];
            const rest = { ...p };
            delete rest.section;
            return [rid, rest];
          })
        ),
        sections: { ...cur.sections, added: cur.sections.added.filter((a) => a.id !== id) },
      });
    } else if (!cur.sections.deleted.includes(id)) {
      write({ ...cur, sections: { ...cur.sections, deleted: [...cur.sections.deleted, id] } });
    }
  }, []);

  const restoreSection = React.useCallback((id: string) => {
    const cur = read();
    write({ ...cur, sections: { ...cur.sections, deleted: cur.sections.deleted.filter((x) => x !== id) } });
  }, []);

  const resetAll = React.useCallback(() => write(EMPTY_LOCAL), []);

  const editedCount = Object.keys(local.edits).length;
  const addedCount = local.added.length;
  const deletedCount = local.deleted.length;
  const sectionChanges = Object.keys(local.sections.edits).length + local.sections.added.length + local.sections.deleted.length;
  return {
    local,
    editedCount,
    addedCount,
    deletedCount,
    sectionChanges,
    /** Rules edited or added here (the "Local changes" filter). */
    changedRules: editedCount + addedCount,
    /** Everything changed here. */
    count: editedCount + addedCount + deletedCount + sectionChanges,
    saveDetails,
    saveHistory,
    addRule,
    deleteRule,
    restoreRule,
    reset,
    addSection,
    saveSection,
    deleteSection,
    restoreSection,
    resetAll,
  };
}

export type LocalRulesApi = ReturnType<typeof useLocalRules>;
