// ⌘K items for chapter "rules": one per rule; selecting one opens its detail overlay.
// Content-only imports (this module is lazy-loaded by the palette on every page).
import type { SearchItem } from "@/lib/searchIndex";
import { RULE_CONTEXTS, ruleRegister, ruleSectionLabel } from "@/content/rules";

export const searchItems: SearchItem[] = ruleRegister.map((r) => ({
  id: `rule:${r.id}`,
  label: `${r.id} ${r.title}`,
  group: "Business rules",
  hint: ruleSectionLabel(r.section),
  keywords: [r.text, ...(r.list ?? []), r.plain ?? "", ...r.contexts.map((c) => RULE_CONTEXTS[c].label), r.owner, ...(r.entities ?? []), ...(r.questions ?? [])],
  href: "#rules-register",
  open: { type: "rule", id: r.id },
}));
