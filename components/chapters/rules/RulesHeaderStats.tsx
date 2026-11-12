"use client";

// Key figures beside the chapter header (fills the empty right side on wide screens). Live: they follow the as-of
// date and this browser's date edits. Each figure is a door to the rules behind it.
import * as React from "react";
import type { RuleRecord } from "@/content/types-extra";
import { formatDate, isActive, needsConfirmation, type RuleQuery } from "@/lib/rules";
import { cn } from "@/lib/utils";

export function RulesHeaderStats({ rules, asOf, onPreset }: { rules: RuleRecord[]; asOf: string; onPreset: (patch: Partial<RuleQuery>) => void }) {
  const active = rules.filter((r) => isActive(r, asOf)).length;
  const changed = rules.filter((r) => r.edited || r.added).length;
  const cells: { label: string; value: number; patch: Partial<RuleQuery> }[] = [
    { label: "Active", value: active, patch: { status: ["active"] } },
    { label: "Inactive", value: rules.length - active, patch: { status: ["inactive"] } },
    { label: "Need confirmation", value: rules.filter(needsConfirmation).length, patch: { flag: true } },
    changed ? { label: "Changed here", value: changed, patch: { edited: true } } : { label: "In the register", value: rules.length, patch: {} },
  ];
  return (
    <div className="w-full lg:w-88">
      <p className="mb-3 t-mono-sm text-muted">On {formatDate(asOf)}</p>
      <ul className="grid grid-cols-2 border-t border-l border-border sm:grid-cols-4 lg:grid-cols-2">
        {cells.map((c) => (
          <li key={c.label} className="border-r border-b border-border">
            <button
              type="button"
              onClick={() => onPreset(c.patch)}
              className={cn("flex w-full cursor-pointer flex-col gap-1 px-4 py-3 text-left transition-colors duration-150 ease-out hover:bg-surface-raised")}
            >
              <span className="t-headline-md text-on-surface tnum">{c.value}</span>
              <span className="t-body-sm text-muted">{c.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
