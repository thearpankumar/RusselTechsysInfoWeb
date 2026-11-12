"use client";

// Card view: same fields in the same place on every card (id + status, title, statement, contexts, period).
import * as React from "react";
import type { RuleRecord } from "@/content/types-extra";
import { RULE_CONTEXTS, RULE_STRENGTHS } from "@/content/rules";
import { dataBg } from "@/lib/dataColors";
import { cn } from "@/lib/utils";
import { ConfirmFlag, ContextTag, Highlight, PeriodStrip, PeriodText, StatusLabel, type Domain } from "./shared";

export function RulesCards({ rules, asOf, domain, tokens, onOpen }: { rules: RuleRecord[]; asOf: string; domain: Domain; tokens: string[]; onOpen: (id: string) => void }) {
  return (
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {rules.map((r) => (
        <li key={r.id} className="min-w-0">
          <button
            type="button"
            onClick={() => onOpen(r.id)}
            className="relative flex h-full w-full cursor-pointer flex-col gap-4 overflow-hidden rounded-xl border border-transparent bg-surface p-6 text-left transition-colors duration-150 ease-out hover:border-chart-past"
          >
            {/* 3px stripe in the primary context's colour. */}
            <span aria-hidden className={cn("absolute inset-y-6 left-0 w-0.75 rounded-r-full", dataBg[RULE_CONTEXTS[r.contexts[0]].colour])} />
            <span className="flex items-start justify-between gap-4">
              <span className="t-mono-sm text-muted">
                <span className="text-on-surface">
                  <Highlight text={r.id} tokens={tokens} />
                </span>
                {" · "}
                {r.section.startsWith("WS") ? "Session" : `§${r.section}`}
              </span>
              <StatusLabel rule={r} asOf={asOf} className="shrink-0" />
            </span>
            <span className="flex flex-col gap-2">
              <span className="t-body-lg text-on-surface">
                <Highlight text={r.title} tokens={tokens} />
              </span>
              <span className="line-clamp-3 t-body-sm text-body">
                <Highlight text={r.text} tokens={tokens} />
              </span>
            </span>
            <span className="flex flex-wrap gap-x-4 gap-y-1">
              {r.contexts.map((c) => (
                <ContextTag key={c} ctx={c} />
              ))}
            </span>
            <span className="mt-auto flex flex-col gap-2 border-t border-border pt-4">
              <span className="flex flex-wrap items-center justify-between gap-2">
                <PeriodText rule={r} />
                <span className="t-mono-sm text-muted">
                  {RULE_STRENGTHS[r.strength].label} · {r.owner}
                </span>
              </span>
              <PeriodStrip rule={r} asOf={asOf} domain={domain} />
              <ConfirmFlag rule={r} />
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
