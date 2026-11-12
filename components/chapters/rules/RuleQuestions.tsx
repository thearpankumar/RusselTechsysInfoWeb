"use client";

// Open questions that gate rules: each lists the rules waiting on it and filters the register to them.
import * as React from "react";
import type { OpenQuestion } from "@/content/types-extra";
import { ruleQuestions } from "@/content/rules";
import { Button, Cite, Marker } from "@/components/ui-rt";

const STATUS: Record<OpenQuestion["status"], { label: string; shape: "dot" | "hollow" }> = {
  open: { label: "Open", shape: "hollow" },
  "partly-answered": { label: "Partly answered", shape: "dot" },
  answered: { label: "Answered", shape: "dot" },
};

export function RuleQuestions({ onFilter, onOpenRule }: { onFilter: (questionId: string) => void; onOpenRule: (id: string) => void }) {
  return (
    <ol className="border-t border-border">
      {ruleQuestions.map(({ question: q, rules }) => {
        const st = STATUS[q.status];
        return (
          <li key={q.id} className="grid grid-cols-[3rem_minmax(0,1fr)] gap-x-4 gap-y-4 border-b border-border py-6 lg:grid-cols-[3rem_minmax(0,1fr)_minmax(0,22rem)]">
            <span className="pt-1 t-mono-sm text-muted">{q.id}</span>
            <div className="min-w-0">
              <p className="t-body-lg text-on-surface">{q.question}</p>
              {q.note && <p className="mt-2 t-body-sm text-muted">{q.note}</p>}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex h-6 items-center gap-2 rounded-full border border-border px-2 t-mono-sm text-on-surface">
                  <Marker tone="past" shape={st.shape} size={8} />
                  {st.label}
                </span>
                <Cite ids={q.sources} />
              </div>
            </div>
            <div className="col-start-2 flex flex-col gap-3 lg:col-start-auto lg:items-end">
              <div className="flex flex-wrap gap-2 lg:justify-end">
                {rules.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => onOpenRule(r.id)}
                    title={r.title}
                    className="inline-flex h-8 cursor-pointer items-center rounded-full border border-border px-3 t-mono-sm text-body transition-colors duration-150 hover:border-chart-past hover:bg-surface-raised hover:text-on-surface"
                  >
                    {r.id}
                  </button>
                ))}
              </div>
              <Button size="sm" variant="ghost" arrow onClick={() => onFilter(q.id)}>
                Show {rules.length} {rules.length === 1 ? "rule" : "rules"}
              </Button>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
