"use client";

// Rule detail as a side panel (non-modal "side peek"): the list stays visible and clickable, so prev/next and
// clicking another row visibly walk the register. Leads with the rule as written, then its state history,
// details, open questions, replacements and same-section rules. ←/→ or j/k step; Esc closes and returns focus.
// "Edit dates" turns the state history into editable rows (state + date); edits are saved in this browser.
import * as React from "react";
import Link from "next/link";
import { Dialog as DialogPrimitive } from "radix-ui";
import { Check, ChevronLeft, ChevronRight, Link2, Pencil, Plus, X } from "lucide-react";
import type { RuleLifecycle, RuleRecord, RuleStateChange } from "@/content/types-extra";
import { RULE_ORIGINS, RULE_STATE_ORDER, RULE_STRENGTHS, ruleRegister, ruleSectionLabel } from "@/content/rules";
import { openQuestions } from "@/content/openQuestions";
import { Button, Cite, ConfidenceTag, IconButton, Marker, buttonClasses } from "@/components/ui-rt";
import { STATE_LABEL, addDays, formatDate, pendingQuestions, stateAt, suggestNextState, validateHistory } from "@/lib/rules";
import { cn } from "@/lib/utils";
import { ChangeTag, ContextTag, DateField, EditedTag, SampleTag, StateMarker, StatusLabel } from "./shared";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-1 py-3 sm:grid-cols-[8rem_minmax(0,1fr)]">
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

/** Editable state history: one row per state (state + start date), add or remove rows, validated before saving. */
function HistoryEditor({ rule, onSave, onCancel }: { rule: RuleRecord; onSave: (history: RuleStateChange[]) => void; onCancel: () => void }) {
  const [rows, setRows] = React.useState<RuleStateChange[]>(() => rule.history.map((h) => ({ ...h })));
  const error = validateHistory(rows, rule);
  const unchanged = rows.length === rule.history.length && rows.every((h, i) => h.state === rule.history[i].state && h.from === rule.history[i].from);
  const states = RULE_STATE_ORDER.filter((st) => st !== "superseded" || rule.supersededBy);
  const set = (i: number, patch: Partial<RuleStateChange>) => setRows((rs) => rs.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  const add = () =>
    setRows((rs) => {
      const last = rs[rs.length - 1];
      return [...rs, { state: suggestNextState(last.state), from: addDays(last.from, 7) }];
    });

  return (
    <div className="mt-4 rounded-lg border border-border p-4" role="group" aria-label={`Edit the dates of ${rule.id}`}>
      <p className="t-body-sm text-muted">
        Set when each state starts; dates must move forward. Saved in this browser only. The Excel download carries them, highlighted yellow.
      </p>
      <ol className="mt-4 flex flex-col gap-2">
        {rows.map((h, i) => (
          <li key={i} className="flex flex-wrap items-center gap-2">
            <StateMarker state={h.state} />
            <select
              aria-label={`State ${i + 1}`}
              value={h.state}
              // A different state no longer matches the published note, so drop it.
              onChange={(e) => set(i, { state: e.target.value as RuleLifecycle, note: undefined })}
              className="h-10 cursor-pointer rounded-full border border-border bg-background px-3 t-body-md text-on-surface transition-colors duration-150 hover:border-chart-past focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {states.map((st) => (
                <option key={st} value={st}>
                  {STATE_LABEL[st]}
                </option>
              ))}
            </select>
            <span className="inline-flex h-10 items-center rounded-full border border-border px-3 transition-colors duration-150 hover:border-chart-past has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-primary">
              <DateField id={`edit-${rule.id}-${i}`} value={h.from} onChange={(d) => set(i, { from: d })} label={`${STATE_LABEL[h.state]} from`} />
            </span>
            {rows.length > 1 && <IconButton label={`Remove ${STATE_LABEL[h.state]}`} icon={<X />} onClick={() => setRows((rs) => rs.filter((_, j) => j !== i))} />}
          </li>
        ))}
      </ol>
      <Button variant="ghost" size="sm" icon={<Plus aria-hidden />} onClick={add} className="mt-2">
        Add a state change
      </Button>
      {error && (
        <p role="alert" className="mt-3 flex items-start gap-2 t-body-sm text-on-surface">
          <Marker shape="hatch" size={8} className="mt-1.5" />
          {error}
        </p>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="primary" size="sm" disabled={!!error || unchanged} onClick={() => onSave(rows)}>
          Save dates
        </Button>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

export function RulePanel({
  rule,
  asOf,
  vs,
  index,
  total,
  onClose,
  onPrev,
  onNext,
  onOpenRule,
  onSaveHistory,
  onResetHistory,
  onCloseAutoFocus,
}: {
  rule: RuleRecord | null;
  asOf: string;
  vs: string | null;
  index: number;
  total: number;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  onOpenRule: (id: string) => void;
  /** Save an edited state history for a rule (kept in this browser). */
  onSaveHistory: (id: string, history: RuleStateChange[]) => void;
  /** Drop a rule's edits (back to the published dates). */
  onResetHistory: (id: string) => void;
  /** Where focus goes when the panel closes (Radix would otherwise drop it on <body>). */
  onCloseAutoFocus?: (e: Event) => void;
}) {
  const body = React.useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  // Which rule's dates are being edited (stepping to another rule leaves edit mode).
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const editButton = React.useRef<HTMLButtonElement>(null);

  // A new rule starts at the top, even if the last one was scrolled down.
  React.useEffect(() => {
    if (body.current) body.current.scrollTop = 0;
  }, [rule?.id]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const t = e.target as HTMLElement;
    const typing = ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName);
    if (!typing && (e.key === "ArrowLeft" || e.key === "k") && onPrev) {
      e.preventDefault();
      onPrev();
    } else if (!typing && (e.key === "ArrowRight" || e.key === "j") && onNext) {
      e.preventDefault();
      onNext();
    }
    // Keep ←/→, "/" and the rest from reaching chapter navigation.
    e.stopPropagation();
  };

  const current = rule ? stateAt(rule, asOf) : null;
  const waits = rule
    ? pendingQuestions(rule)
        .map((id) => openQuestions.find((q) => q.id === id))
        .filter((q): q is NonNullable<typeof q> => !!q)
    : [];
  const replacedBy = rule?.supersededBy ? ruleRegister.find((r) => r.id === rule.supersededBy) : undefined;
  const replaces = rule ? ruleRegister.filter((r) => r.supersededBy === rule.id) : [];
  const siblings = rule ? ruleRegister.filter((r) => r.section === rule.section && r.id !== rule.id) : [];

  const copyLink = async () => {
    if (!rule) return;
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
    <DialogPrimitive.Root open={!!rule} onOpenChange={(o) => !o && onClose()} modal={false}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Content
          onKeyDown={onKeyDown}
          onCloseAutoFocus={onCloseAutoFocus}
          // Clicking another rule in the list switches the panel instead of closing it; moving focus back to the
          // list keeps it open (it is a side peek, not a modal).
          onInteractOutside={(e) => {
            const target = e.target as HTMLElement | null;
            if (e.type === "dismissableLayer.focusOutside" || target?.closest("[data-rules-list]")) e.preventDefault();
          }}
          className={cn(
            "fixed inset-2 z-50 flex flex-col overflow-hidden rounded-xl border border-border bg-background text-on-surface outline-none sm:inset-y-3 sm:right-3 sm:left-auto sm:w-[min(36rem,calc(100vw-1.5rem))]",
            "duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-right-4 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-right-4"
          )}
        >
          {rule && (
            <>
              <div className="flex items-center gap-2 border-b border-border px-6 py-4 sm:px-8">
                <span className="t-mono-sm text-muted tnum">{index >= 0 && total > 0 ? `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}` : "Not in this view"}</span>
                <span className="ml-auto flex items-center gap-2">
                  {onPrev && <IconButton label="Previous rule" icon={<ChevronLeft />} onClick={onPrev} />}
                  {onNext && <IconButton label="Next rule" icon={<ChevronRight />} onClick={onNext} />}
                  <DialogPrimitive.Close asChild>
                    <IconButton label="Close" icon={<X />} />
                  </DialogPrimitive.Close>
                </span>
              </div>

              <div ref={body} data-lenis-prevent className="flex-1 overflow-y-auto overscroll-contain px-6 py-8 sm:px-8">
                <p className="t-label-caps text-muted">
                  {rule.id} · {ruleSectionLabel(rule.section)}
                </p>
                <DialogPrimitive.Title className="mt-3 t-headline-md text-on-surface">{rule.title}</DialogPrimitive.Title>

                {/* The rule as written leads; the title above is only a handle for it. */}
                <DialogPrimitive.Description asChild>
                  <blockquote className="mt-6 border-l-2 border-chart-past pl-4">
                    <p className="t-body-lg text-on-surface">{rule.text}</p>
                    {rule.list && (
                      <ul className="mt-3 flex list-disc flex-col gap-1 pl-5 t-body-md text-body marker:text-muted">
                        {rule.list.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    )}
                    <footer className="mt-3 t-body-sm text-muted">{rule.origin === "spec" ? "Business-rules specification, as written" : "Working-session notes, as recorded"}</footer>
                  </blockquote>
                </DialogPrimitive.Description>

                {rule.plain && (
                  <p className="mt-6 rounded-lg bg-surface-raised p-4 t-body-md text-on-surface">
                    <span className="text-muted">In plain words: </span>
                    {rule.plain}
                  </p>
                )}

                <dl className="mt-8 divide-y divide-border border-y border-border">
                  <Row label="Status">
                    <StatusLabel rule={rule} asOf={asOf} />
                    {vs && <ChangeTag rule={rule} vs={vs} asOf={asOf} className="mt-2" />}
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

                <section className="mt-8" aria-labelledby="rule-history">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 id="rule-history" className="t-label-caps text-muted">
                      State history
                    </h3>
                    {rule.edited && <EditedTag />}
                    {editingId !== rule.id && (
                      <span className="ml-auto flex flex-wrap gap-2">
                        {rule.edited && (
                          <Button variant="ghost" size="sm" onClick={() => onResetHistory(rule.id)}>
                            Reset to published dates
                          </Button>
                        )}
                        <button ref={editButton} type="button" onClick={() => setEditingId(rule.id)} className={buttonClasses({ size: "sm" })}>
                          <Pencil aria-hidden />
                          Edit dates
                        </button>
                      </span>
                    )}
                  </div>
                  {editingId === rule.id ? (
                    <HistoryEditor
                      key={rule.id}
                      rule={rule}
                      onSave={(history) => {
                        onSaveHistory(rule.id, history);
                        setEditingId(null);
                        requestAnimationFrame(() => editButton.current?.focus());
                      }}
                      onCancel={() => {
                        setEditingId(null);
                        requestAnimationFrame(() => editButton.current?.focus());
                      }}
                    />
                  ) : (
                  <ol className="mt-4 flex flex-col">
                    {rule.history.map((h, i) => {
                      const isCurrent = current?.from === h.from;
                      const future = h.from > asOf;
                      return (
                        <li key={h.from} className="grid grid-cols-[1.25rem_minmax(0,1fr)] gap-3">
                          <span className="flex flex-col items-center">
                            <StateMarker state={h.state} className="mt-1.5" />
                            {i < rule.history.length - 1 && <span aria-hidden className="w-px flex-1 bg-border" />}
                          </span>
                          <span className={cn("pb-4", future && "opacity-60")}>
                            <span className={cn("t-body-md", isCurrent ? "text-on-surface" : "text-body")}>{STATE_LABEL[h.state]}</span>
                            <span className="ml-2 t-mono-sm text-muted tnum">{formatDate(h.from)}</span>
                            {isCurrent && <span className="ml-2 inline-flex h-5 items-center rounded-sm bg-primary px-1.5 t-mono-sm text-on-primary">On {formatDate(asOf)}</span>}
                            {future && <span className="ml-2 t-mono-sm text-muted">upcoming</span>}
                            {h.note && <span className="mt-0.5 block t-body-sm text-muted">{h.note}</span>}
                          </span>
                        </li>
                      );
                    })}
                  </ol>
                  )}
                  {rule.edited && rule.originalHistory && editingId !== rule.id && (
                    <p className="t-body-sm text-muted">
                      Published:{" "}
                      {rule.originalHistory.map((h) => `${STATE_LABEL[h.state]} ${formatDate(h.from)}`).join(" → ")}
                    </p>
                  )}
                </section>

                {waits.length > 0 && (
                  <section className="mt-6" aria-labelledby="rule-waits">
                    <h3 id="rule-waits" className="mb-3 inline-flex items-center gap-2 t-label-caps text-muted">
                      <Marker shape="hatch" size={8} /> Needs confirmation
                    </h3>
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
                  </section>
                )}

                {(replacedBy || replaces.length > 0) && (
                  <section className="mt-8">
                    <h3 className="mb-3 t-label-caps text-muted">{replacedBy ? "Replaced by" : "Replaces"}</h3>
                    <div className="flex flex-wrap gap-2">
                      {replacedBy && <RuleLink rule={replacedBy} onOpen={onOpenRule} />}
                      {replaces.map((r) => (
                        <RuleLink key={r.id} rule={r} onOpen={onOpenRule} />
                      ))}
                    </div>
                  </section>
                )}

                {siblings.length > 0 && (
                  <section className="mt-8">
                    <h3 className="mb-3 t-label-caps text-muted">Also in {ruleSectionLabel(rule.section)}</h3>
                    <div className="flex flex-wrap gap-2">
                      {siblings.map((r) => (
                        <RuleLink key={r.id} rule={r} onOpen={onOpenRule} />
                      ))}
                    </div>
                  </section>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 border-t border-border px-6 py-4 sm:px-8">
                <ConfidenceTag confidence={rule.confidence} />
                <Cite ids={rule.sources} />
                <SampleTag />
                <Button variant="ghost" size="sm" className="ml-auto" icon={copiedId === rule.id ? <Check aria-hidden /> : <Link2 aria-hidden />} onClick={copyLink}>
                  {copiedId === rule.id ? "Link copied" : "Copy link"}
                </Button>
              </div>
            </>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
