"use client";

// Rule detail as a side panel (non-modal "side peek"): the list stays visible and clickable, so prev/next and
// clicking another row visibly walk the register. Leads with the rule as written, then its state history,
// details, open questions, replacements and same-section rules. ←/→ or j/k step; Esc closes and returns focus.
//
// Changing the register in this browser (useLocalRules):
//   • "Edit details": title, statement, list, plain words, section, contexts, strength, owner, entities, questions;
//   • "Edit dates": the state history;
//   • "Delete rule": an added rule goes for good; a published one is hidden here and can be restored;
//   • create mode ("Add rule"): the same details form with an id and an initial state history.
// While a form is open, clicks outside do not close the panel, and Esc asks before dropping unsaved changes.
import * as React from "react";
import Link from "next/link";
import { Dialog as DialogPrimitive } from "radix-ui";
import { Check, ChevronLeft, ChevronRight, Link2, Pencil, RotateCcw, Trash2, X } from "lucide-react";
import type { RuleRecord } from "@/content/types-extra";
import { RULE_ORIGINS, RULE_STRENGTHS, ruleSectionLabel } from "@/content/rules";
import { openQuestions } from "@/content/openQuestions";
import { Button, Cite, ConfidenceTag, IconButton, Marker, buttonClasses } from "@/components/ui-rt";
import { FIELD_LABEL, STATE_LABEL, formatDate, pendingQuestions, stateAt } from "@/lib/rules";
import { RULE_CONTEXTS } from "@/content/rules";
import { cn } from "@/lib/utils";
import { HistoryEditor, RuleDetailsForm } from "./RuleForms";
import { AddedTag, ChangeTag, ContextTag, EditedTag, SampleTag, StateMarker, StatusLabel } from "./shared";
import type { LocalRulesApi } from "./useLocalRules";

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

/** A changed field's published value, in words. */
function publishedValue(r: RuleRecord, field: string): string {
  const o = r.original;
  if (!o) return "";
  switch (field) {
    case "contexts":
      return o.contexts.map((c) => RULE_CONTEXTS[c].label).join(", ");
    case "section":
      return ruleSectionLabel(o.section);
    case "strength":
      return RULE_STRENGTHS[o.strength].label;
    case "list":
      return o.list?.join(" · ") ?? "—";
    case "entities":
      return o.entities?.join(", ") || "—";
    case "questions":
      return o.questions?.join(", ") || "—";
    case "history":
      return o.history.map((h) => `${STATE_LABEL[h.state]} ${formatDate(h.from)}`).join(" → ");
    default:
      return String((o as unknown as Record<string, unknown>)[field] ?? "—");
  }
}

const panelClass = cn(
  "fixed inset-2 z-50 flex flex-col overflow-hidden rounded-xl border border-border bg-background text-on-surface outline-none sm:inset-y-3 sm:right-3 sm:left-auto sm:w-[min(36rem,calc(100vw-1.5rem))]",
  "duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-right-4 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-right-4"
);

export function RulePanel({
  rule,
  creating,
  rules,
  today,
  asOf,
  vs,
  index,
  total,
  api,
  onClose,
  onPrev,
  onNext,
  onOpenRule,
  onCreated,
  onCloseAutoFocus,
}: {
  rule: RuleRecord | null;
  /** Show the "Add rule" form instead of a rule. */
  creating: boolean;
  /** Rules in use (with local changes), for links and id checks. */
  rules: RuleRecord[];
  today: string;
  asOf: string;
  vs: string | null;
  index: number;
  total: number;
  api: LocalRulesApi;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  onOpenRule: (id: string) => void;
  /** A rule was added: show it. */
  onCreated: (id: string) => void;
  /** Where focus goes when the panel closes (Radix would otherwise drop it on <body>). */
  onCloseAutoFocus?: (e: Event) => void;
}) {
  const body = React.useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  // Which rule's dates / details are being edited (stepping to another rule leaves edit mode).
  const [editingDates, setEditingDates] = React.useState<string | null>(null);
  const [editingDetails, setEditingDetails] = React.useState<string | null>(null);
  const [formDirty, setFormDirty] = React.useState(false);
  const editDatesButton = React.useRef<HTMLButtonElement>(null);
  const editDetailsButton = React.useRef<HTMLButtonElement>(null);

  const detailsForm = !!rule && editingDetails === rule.id;
  const datesForm = !!rule && editingDates === rule.id;
  const formOpen = creating || detailsForm || datesForm;
  const open = creating || !!rule;

  // A new rule starts at the top, even if the last one was scrolled down.
  React.useEffect(() => {
    if (body.current) body.current.scrollTop = 0;
  }, [rule?.id, creating, editingDetails]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const t = e.target as HTMLElement;
    const typing = ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName);
    if (!typing && !formOpen && (e.key === "ArrowLeft" || e.key === "k") && onPrev) {
      e.preventDefault();
      onPrev();
    } else if (!typing && !formOpen && (e.key === "ArrowRight" || e.key === "j") && onNext) {
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
  const replacedBy = rule?.supersededBy ? rules.find((r) => r.id === rule.supersededBy) : undefined;
  const replaces = rule ? rules.filter((r) => r.supersededBy === rule.id) : [];
  const siblings = rule ? rules.filter((r) => r.section === rule.section && r.id !== rule.id) : [];

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

  const remove = () => {
    if (!rule) return;
    const msg = rule.added
      ? `Delete ${rule.id} "${rule.title}"? It was added in this browser, so it is removed for good.`
      : `Delete ${rule.id} "${rule.title}"? It is hidden in this browser; restore it from ⋯ → Deleted here.`;
    if (window.confirm(msg)) {
      api.deleteRule(rule.id);
      onClose();
    }
  };

  const closeDetails = () => {
    setEditingDetails(null);
    setFormDirty(false);
    requestAnimationFrame(() => editDetailsButton.current?.focus());
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(o) => !o && onClose()} modal={false}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Content
          onKeyDown={onKeyDown}
          onCloseAutoFocus={onCloseAutoFocus}
          onEscapeKeyDown={(e) => {
            if (formOpen && formDirty && !window.confirm("Discard your unsaved changes?")) e.preventDefault();
          }}
          // Clicking another rule in the list switches the panel instead of closing it; moving focus back to the
          // list keeps it open (it is a side peek, not a modal). With a form open, nothing outside closes it.
          onInteractOutside={(e) => {
            const target = e.target as HTMLElement | null;
            if (formOpen || e.type === "dismissableLayer.focusOutside" || target?.closest("[data-rules-list]")) e.preventDefault();
          }}
          className={panelClass}
        >
          <div className="flex items-center gap-2 border-b border-border px-6 py-4 sm:px-8">
            <span className="t-mono-sm text-muted tnum">
              {creating ? "New rule" : index >= 0 && total > 0 ? `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}` : "Not in this view"}
            </span>
            <span className="ml-auto flex items-center gap-2">
              {!formOpen && onPrev && <IconButton label="Previous rule" icon={<ChevronLeft />} onClick={onPrev} />}
              {!formOpen && onNext && <IconButton label="Next rule" icon={<ChevronRight />} onClick={onNext} />}
              <DialogPrimitive.Close asChild>
                <IconButton label="Close" icon={<X />} />
              </DialogPrimitive.Close>
            </span>
          </div>

          {creating ? (
            <div ref={body} data-lenis-prevent className="flex-1 overflow-y-auto overscroll-contain px-6 py-8 sm:px-8">
              <p className="t-label-caps text-muted">Add a rule</p>
              <DialogPrimitive.Title className="mt-3 t-headline-md text-on-surface">New rule</DialogPrimitive.Title>
              <DialogPrimitive.Description className="mt-2 mb-6 t-body-md text-muted">
                Saved in this browser and tagged “Added”. It shows everywhere in the register and in the Excel download (highlighted).
              </DialogPrimitive.Description>
              <RuleDetailsForm
                mode="create"
                rules={rules}
                today={today}
                onDirtyChange={setFormDirty}
                onCancel={() => {
                  setFormDirty(false);
                  onClose();
                }}
                onSubmit={({ id, details, history }) => {
                  api.addRule({ ...details, id: id!, history: history! });
                  setFormDirty(false);
                  onCreated(id!);
                }}
              />
            </div>
          ) : (
            rule && (
              <>
                <div ref={body} data-lenis-prevent className="flex-1 overflow-y-auto overscroll-contain px-6 py-8 sm:px-8">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="t-label-caps text-muted">
                      {rule.id} · {ruleSectionLabel(rule.section)}
                    </p>
                    {rule.added && <AddedTag />}
                    {rule.edited && <EditedTag />}
                  </div>

                  {detailsForm ? (
                    <>
                      <DialogPrimitive.Title className="mt-3 t-headline-md text-on-surface">Edit {rule.id}</DialogPrimitive.Title>
                      <DialogPrimitive.Description className="mt-2 mb-6 t-body-md text-muted">
                        Changes stay in this browser{rule.added ? "" : "; the published wording is kept so you can reset"}.
                      </DialogPrimitive.Description>
                      <RuleDetailsForm
                        key={rule.id}
                        mode="edit"
                        rule={rule}
                        rules={rules}
                        today={today}
                        onDirtyChange={setFormDirty}
                        onCancel={closeDetails}
                        onSubmit={({ details }) => {
                          api.saveDetails(rule.id, details);
                          closeDetails();
                        }}
                      />
                    </>
                  ) : (
                    <>
                      <div className="mt-3 flex items-start gap-3">
                        <DialogPrimitive.Title className="min-w-0 flex-1 t-headline-md text-on-surface">{rule.title}</DialogPrimitive.Title>
                        <button ref={editDetailsButton} type="button" onClick={() => setEditingDetails(rule.id)} className={buttonClasses({ size: "sm" })}>
                          <Pencil aria-hidden />
                          Edit details
                        </button>
                      </div>

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
                          <footer className="mt-3 t-body-sm text-muted">
                            {rule.added
                              ? "Added in this browser"
                              : rule.changedFields?.some((f) => f === "text" || f === "list")
                                ? "Edited in this browser"
                                : rule.origin === "spec"
                                  ? "Business-rules specification, as written"
                                  : "Working-session notes, as recorded"}
                          </footer>
                        </blockquote>
                      </DialogPrimitive.Description>

                      {rule.plain && (
                        <p className="mt-6 rounded-lg bg-surface-raised p-4 t-body-md text-on-surface">
                          <span className="text-muted">In plain words: </span>
                          {rule.plain}
                        </p>
                      )}

                      {rule.edited && rule.changedFields?.length ? (
                        <section className="mt-6 rounded-lg border border-dashed border-border p-4" aria-labelledby="rule-changes">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 id="rule-changes" className="t-label-caps text-muted">
                              Changes in this browser
                            </h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="ml-auto"
                              icon={<RotateCcw aria-hidden />}
                              onClick={() => {
                                if (window.confirm(`Reset ${rule.id} to the published rule (drops all your changes to it)?`)) api.reset(rule.id);
                              }}
                            >
                              Reset to published
                            </Button>
                          </div>
                          <dl className="mt-2 flex flex-col gap-2">
                            {rule.changedFields.map((f) => (
                              <div key={f} className="t-body-sm">
                                <dt className="text-body">{FIELD_LABEL[f]}</dt>
                                <dd className="text-muted">Published: {publishedValue(rule, f)}</dd>
                              </div>
                            ))}
                          </dl>
                        </section>
                      ) : null}

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
                          {!datesForm && (
                            <button ref={editDatesButton} type="button" onClick={() => setEditingDates(rule.id)} className={cn(buttonClasses({ size: "sm" }), "ml-auto")}>
                              <Pencil aria-hidden />
                              Edit dates
                            </button>
                          )}
                        </div>
                        {datesForm ? (
                          <HistoryEditor
                            key={rule.id}
                            rule={rule}
                            onSave={(history) => {
                              api.saveHistory(rule.id, history);
                              setEditingDates(null);
                              requestAnimationFrame(() => editDatesButton.current?.focus());
                            }}
                            onCancel={() => {
                              setEditingDates(null);
                              requestAnimationFrame(() => editDatesButton.current?.focus());
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
                    </>
                  )}
                </div>

                {!detailsForm && (
                  <div className="flex flex-wrap items-center gap-2 border-t border-border px-6 py-4 sm:px-8">
                    {rule.added ? (
                      <AddedTag />
                    ) : (
                      <>
                        <ConfidenceTag confidence={rule.confidence} />
                        <Cite ids={rule.sources} />
                        <SampleTag />
                      </>
                    )}
                    <span className="ml-auto flex items-center gap-1">
                      <Button variant="ghost" size="sm" icon={<Trash2 aria-hidden />} onClick={remove}>
                        Delete
                      </Button>
                      {/* A rule added here only exists in this browser, so a link to it would not open elsewhere. */}
                      {!rule.added && (
                        <Button variant="ghost" size="sm" icon={copiedId === rule.id ? <Check aria-hidden /> : <Link2 aria-hidden />} onClick={copyLink}>
                          {copiedId === rule.id ? "Link copied" : "Copy link"}
                        </Button>
                      )}
                    </span>
                  </div>
                )}
              </>
            )
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
