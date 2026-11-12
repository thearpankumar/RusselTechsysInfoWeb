"use client";

import * as React from "react";
import { businessRules } from "@/content/lifecycle";
import { ruleRegister } from "@/content/rules";
import { Button, Card, Cite, ConfidenceTag } from "@/components/ui-rt";

const GROUPS = [
  { id: "2.1 BOM identity" as const, title: "2.1 BOM identity", lead: "What makes a BOM unique." },
  { id: "2.2 BOM revision" as const, title: "2.2 BOM revisions", lead: "Which version applies, and when." },
];

/** Engineering & BOM business rules (info.md 2.1 / 2.2) as key-value rows. */
export function BomRules() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {GROUPS.map((g) => {
          const rules = businessRules.filter((r) => r.group === g.id);
          return (
            <Card key={g.id} title={`${g.title} · ${rules.length} rules`}>
              <p className="-mt-2 mb-4 t-body-md text-muted">{g.lead}</p>
              <dl className="divide-y divide-border">
                {rules.map((r) => (
                  <div key={r.id} className="grid grid-cols-[4.5rem_1fr] gap-4 py-3">
                    <dt className="t-mono-sm text-muted">{r.id.replace(/^R/, "")}</dt>
                    <dd className="t-body-md text-body">
                      {r.text}
                      {r.plain && <span className="mt-1 block t-body-sm text-on-surface">In plain words: {r.plain}</span>}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <ConfidenceTag confidence="rules" />
                <Cite ids={["RULES", "INFO"]} />
              </div>
            </Card>
          );
        })}
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <p className="t-body-md text-muted">These are two of the specification&apos;s sections. The register holds all {ruleRegister.length} rules with their status, period and context.</p>
        <Button href="/rules/register" size="sm" arrow>
          Open the rule register
        </Button>
      </div>
    </div>
  );
}
