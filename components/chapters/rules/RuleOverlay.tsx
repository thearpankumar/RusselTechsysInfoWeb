"use client";

// Rule detail ("everything is a door"): the rule, its status on the as-of date, period, contexts, owner,
// open questions it waits on, replacements, entities and same-section rules. Prev/next walk the shown list.
import * as React from "react";
import Link from "next/link";
import { Check, Link2 } from "lucide-react";
import type { RuleRecord } from "@/content/types-extra";
import { RULE_ORIGINS, RULE_STRENGTHS, ruleRegister, ruleSectionLabel } from "@/content/rules";
import { openQuestions } from "@/content/openQuestions";
import { Button, Cite, ConfidenceTag, DetailOverlay, Marker } from "@/components/ui-rt";
import { formatDate, pendingQuestions, ruleState } from "@/lib/rules";
import { ContextTag, PeriodStrip, PeriodText, SampleTag, StatusLabel, type Domain } from "./shared";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-1 py-3 sm:grid-cols-[10rem_minmax(0,1fr)]">
      <dt className="t-body-md text-muted">{label}</dt>
      <dd className="min-w-0 t-body-md text-on-surface">{children}</dd>
    </div>
  );
}

function RuleLink({ rule, onOpen }: { rule: RuleRecord; onOpen: (id: string) => void }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(rule.id)}
      className="inline-flex h-8 max-w-full cursor-pointer items-center gap-2 rounded-full border border-border px-3 t-body-sm text-body transition-colors duration-150 hover:border-chart-past hover:bg-surface-raised hover:text-on-surface"
    >
      <span className="t-mono-sm text-muted">{rule.id}</span>
      <span className="truncate">{rule.title}</span>
    </button>
  );
}

export function RuleOverlay({
  rule,
  asOf,
  domain,
  index,
  total,
  onOpenChange,
  onPrev,
  onNext,
  onOpenRule,
}: {
  rule: RuleRecord | null;
  asOf: string;
  domain: Domain;
  index: number;
  total: number;
  onOpenChange: (open: boolean) => void;
  onPrev?: () => void;
  onNext?: () => void;
  onOpenRule: (id: string) => void;
}) {
  // Which rule's link was copied (resets itself when stepping to another rule).
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  if (!rule) return <DetailOverlay open={false} onOpenChange={onOpenChange} title="" />;

  const state = ruleState(rule, asOf);
  const copied = copiedId === rule.id;
  const waits = pendingQuestions(rule)
    .map((id) => openQuestions.find((q) => q.id === id))
    .filter((q): q is NonNullable<typeof q> => !!q);
  const replacedBy = rule.supersededBy ? ruleRegister.find((r) => r.id === rule.supersededBy) : undefined;
  const replaces = ruleRegister.filter((r) => r.supersededBy === rule.id);
  const siblings = ruleRegister.filter((r) => r.section === rule.section && r.id !== rule.id);

  const copyLink = async () => {
    const url = new URL(window.location.href);
    url.search = "";
    url.searchParams.set("rule", rule.id);
    url.hash = "rules-register";
    try {
      await navigator.clipboard.writeText(url.toString());
      setCopiedId(rule.id);
    } catch {
      window.prompt("Copy this link", url.toString());
    }
  };

  return (
    <DetailOverlay
      open
      onOpenChange={onOpenChange}
      eyebrow={`${rule.id} · ${ruleSectionLabel(rule.section)}${total > 1 && index >= 0 ? ` · ${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}` : ""}`}
      title={rule.title}
      description={rule.text}
      onPrev={onPrev}
      onNext={onNext}
    >
      {rule.plain && (
        <p className="mb-6 rounded-lg bg-surface-raised p-4 t-body-md text-on-surface">
          <span className="text-muted">In plain words: </span>
          {rule.plain}
        </p>
      )}

      <dl className="divide-y divide-border border-y border-border">
        <Row label="Status">
          <StatusLabel rule={rule} asOf={asOf} withReason />
        </Row>
        <Row label="Active period">
          <PeriodText rule={rule} className="text-on-surface" />
          <PeriodStrip rule={rule} asOf={asOf} domain={domain} className="mt-2 max-w-md" />
          <span className="mt-1 block t-body-sm text-muted">Status as of {formatDate(asOf)}.</span>
        </Row>
        <Row label="Context">
          <span className="flex flex-wrap gap-x-4 gap-y-1">
            {rule.contexts.map((c) => (
              <ContextTag key={c} ctx={c} size="md" />
            ))}
          </span>
        </Row>
        <Row label="Strength">
          {RULE_STRENGTHS[rule.strength].label}
          <span className="text-muted"> · {RULE_STRENGTHS[rule.strength].blurb}</span>
        </Row>
        <Row label="Owner">{rule.owner}</Row>
        <Row label="Source">{RULE_ORIGINS[rule.origin].label}</Row>
        {rule.entities?.length ? (
          <Row label="Entities">
            <span className="flex flex-wrap gap-2">
              {rule.entities.map((e) => (
                <span key={e} className="inline-flex h-7 items-center rounded-sm border border-border px-2 t-mono-sm text-body">
                  {e}
                </span>
              ))}
            </span>
          </Row>
        ) : null}
      </dl>

      {waits.length > 0 && (
        <div className="mt-8">
          <p className="mb-3 inline-flex items-center gap-2 t-label-caps text-muted">
            <Marker shape="hatch" size={8} /> Needs confirmation
          </p>
          <ul className="flex flex-col gap-3">
            {waits.map((q) => (
              <li key={q.id} className="rounded-lg border border-dashed border-border p-4">
                <p className="t-body-md text-on-surface">
                  <span className="mr-2 t-mono-sm text-muted">{q.id}</span>
                  {q.question}
                </p>
                {q.note && <p className="mt-1 t-body-sm text-muted">{q.note}</p>}
              </li>
            ))}
          </ul>
          <Link href="/sources/questions#sources-questions" className="mt-3 inline-flex t-body-sm text-body underline-offset-4 hover:text-on-surface hover:underline">
            All open questions →
          </Link>
        </div>
      )}

      {(replacedBy || replaces.length > 0) && (
        <div className="mt-8">
          <p className="mb-3 t-label-caps text-muted">{replacedBy ? (state === "retired" ? "Replaced by" : "Will be replaced by") : "Replaces"}</p>
          <div className="flex flex-wrap gap-2">
            {replacedBy && <RuleLink rule={replacedBy} onOpen={onOpenRule} />}
            {replaces.map((r) => (
              <RuleLink key={r.id} rule={r} onOpen={onOpenRule} />
            ))}
          </div>
        </div>
      )}

      {siblings.length > 0 && (
        <div className="mt-8">
          <p className="mb-3 t-label-caps text-muted">Also in {ruleSectionLabel(rule.section)}</p>
          <div className="flex flex-wrap gap-2">
            {siblings.map((r) => (
              <RuleLink key={r.id} rule={r} onOpen={onOpenRule} />
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-border pt-6">
        <ConfidenceTag confidence={rule.confidence} />
        <Cite ids={rule.sources} />
        <SampleTag />
        <Button variant="ghost" size="sm" className="ml-auto" icon={copied ? <Check aria-hidden /> : <Link2 aria-hidden />} onClick={copyLink}>
          {copied ? "Link copied" : "Copy link"}
        </Button>
      </div>
    </DetailOverlay>
  );
}
