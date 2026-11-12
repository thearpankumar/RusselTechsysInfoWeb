"use client";

// Forms for changing the register in this browser: a rule's details (create or edit), its state history, and a
// section. Validation is field by field (lib/rules.ts); errors show beside each field once Save is tried, with a
// summary that names the fields to fix. Nothing is saved until the form is valid.
import * as React from "react";
import { Plus, X } from "lucide-react";
import type { RuleContext, RuleDetails, RuleLifecycle, RuleRecord, RuleStateChange, RuleStrength } from "@/content/types-extra";
import { RULE_CONTEXTS, RULE_CONTEXT_ORDER, RULE_OWNERS, RULE_STATE_ORDER, RULE_STRENGTHS, currentSections, ruleSectionLabel } from "@/content/rules";
import { openQuestions } from "@/content/openQuestions";
import { Button, IconButton, Marker } from "@/components/ui-rt";
import { dataBg } from "@/lib/dataColors";
import {
  FIELD_LABEL,
  STATE_LABEL,
  addDays,
  sectionParts,
  suggestNextState,
  suggestRuleId,
  validateHistory,
  validateRuleDetails,
  validateSection,
  type DetailErrors,
} from "@/lib/rules";
import { cn } from "@/lib/utils";
import { DateField, StateMarker } from "./shared";

/* ---------- field building blocks ---------- */

const control =
  "w-full rounded-lg border border-border bg-transparent px-3 t-body-md text-on-surface placeholder:text-muted transition-colors duration-150 hover:border-chart-past focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary aria-invalid:border-on-surface";

function Field({ id, label, hint, error, children, optional }: { id: string; label: string; hint?: string; error?: string; children: React.ReactNode; optional?: boolean }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="t-body-sm text-body">
        {label}
        {optional && <span className="text-muted"> (optional)</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="t-body-sm text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="flex items-start gap-2 t-body-sm text-on-surface">
          <Marker shape="hatch" size={8} className="mt-1.5" />
          {error}
        </p>
      )}
    </div>
  );
}

const describedBy = (id: string, error?: string, hint?: string) => (error ? `${id}-error` : hint ? `${id}-hint` : undefined);

/** Toggle chip used for contexts, strength and open questions (aria-pressed / radio semantics set by caller). */
function ChoiceChip({ on, disabled, children, ...rest }: { on: boolean; disabled?: boolean; children: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      disabled={disabled}
      {...rest}
      className={cn(
        "inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border px-3 t-body-md transition-colors duration-150 hover:border-chart-past focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-default disabled:opacity-40",
        on ? "border-chart-past bg-surface-raised text-on-surface" : "border-border text-body"
      )}
    >
      {children}
    </button>
  );
}

/* ---------- state history rows (controlled) ---------- */

/** Editable rows (state + start date), add/remove; the caller owns the rows and saving. */
export function HistoryRows({ idPrefix, rows, onChange, supersededBy }: { idPrefix: string; rows: RuleStateChange[]; onChange: (rows: RuleStateChange[]) => void; supersededBy?: string }) {
  const states = RULE_STATE_ORDER.filter((st) => st !== "superseded" || supersededBy);
  const set = (i: number, patch: Partial<RuleStateChange>) => onChange(rows.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  const add = () => {
    const last = rows[rows.length - 1];
    onChange([...rows, { state: suggestNextState(last.state), from: addDays(last.from, 7) }]);
  };
  return (
    <div>
      <ol className="flex flex-col gap-2">
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
              <DateField id={`${idPrefix}-${i}`} value={h.from} onChange={(d) => set(i, { from: d })} label={`${STATE_LABEL[h.state]} from`} />
            </span>
            {rows.length > 1 && <IconButton label={`Remove ${STATE_LABEL[h.state]}`} icon={<X />} onClick={() => onChange(rows.filter((_, j) => j !== i))} />}
          </li>
        ))}
      </ol>
      <Button variant="ghost" size="sm" icon={<Plus aria-hidden />} onClick={add} className="mt-2">
        Add a state change
      </Button>
    </div>
  );
}

/** Panel block: edit a rule's dates, validated, Save / Cancel. */
export function HistoryEditor({ rule, onSave, onCancel }: { rule: RuleRecord; onSave: (history: RuleStateChange[]) => void; onCancel: () => void }) {
  const [rows, setRows] = React.useState<RuleStateChange[]>(() => rule.history.map((h) => ({ ...h })));
  const error = validateHistory(rows, rule);
  const unchanged = rows.length === rule.history.length && rows.every((h, i) => h.state === rule.history[i].state && h.from === rule.history[i].from);
  return (
    <div className="mt-4 rounded-lg border border-border p-4" role="group" aria-label={`Edit the dates of ${rule.id}`}>
      <p className="mb-4 t-body-sm text-muted">Set when each state starts; dates must move forward. Saved in this browser; the Excel download carries them, highlighted.</p>
      <HistoryRows idPrefix={`edit-${rule.id}`} rows={rows} onChange={setRows} supersededBy={rule.supersededBy} />
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

/* ---------- rule details (create / edit) ---------- */

export interface RuleFormValue {
  id?: string;
  details: RuleDetails;
  history?: RuleStateChange[];
}

const splitList = (s: string) =>
  s
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);
const splitEntities = (s: string) => s.split(/[\s,;]+/).map((x) => x.trim()).filter(Boolean);
const orUndefined = <T,>(arr: T[]) => (arr.length ? arr : undefined);

/**
 * Create or edit a rule's details. Create also asks for an id (suggested from the section, editable) and the
 * initial state history (Draft today by default).
 */
export function RuleDetailsForm({
  mode,
  rule,
  rules,
  today,
  onSubmit,
  onCancel,
  onDirtyChange,
}: {
  mode: "create" | "edit";
  /** The rule being edited (edit mode). */
  rule?: RuleRecord;
  /** Rules in use (ids taken, id suggestions). */
  rules: RuleRecord[];
  today: string;
  onSubmit: (value: RuleFormValue) => void;
  onCancel: () => void;
  onDirtyChange?: (dirty: boolean) => void;
}) {
  const sections = currentSections();
  const firstSection = rule?.section ?? sections[0]?.id ?? "";
  const initial = React.useMemo(
    () => ({
      id: mode === "create" ? suggestRuleId(firstSection, rules) : (rule?.id ?? ""),
      title: rule?.title ?? "",
      text: rule?.text ?? "",
      list: (rule?.list ?? []).join("\n"),
      plain: rule?.plain ?? "",
      section: firstSection,
      contexts: rule?.contexts ?? ([] as RuleContext[]),
      strength: rule?.strength ?? ("must" as RuleStrength),
      owner: rule?.owner ?? RULE_OWNERS[0],
      entities: (rule?.entities ?? []).join(", "),
      questions: rule?.questions ?? ([] as string[]),
      history: rule?.history ?? [{ state: "draft" as const, from: today }],
    }),
    // Initial values are fixed for the life of the form.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const [v, setV] = React.useState(initial);
  const [idTouched, setIdTouched] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);
  const set = <K extends keyof typeof v>(k: K, value: (typeof v)[K]) => setV((x) => ({ ...x, [k]: value }));

  const dirty = JSON.stringify(v) !== JSON.stringify(initial);
  React.useEffect(() => onDirtyChange?.(dirty), [dirty, onDirtyChange]);

  const details: RuleDetails = {
    title: v.title.trim(),
    text: v.text.trim(),
    list: orUndefined(splitList(v.list)),
    plain: v.plain.trim() || undefined,
    section: v.section,
    contexts: v.contexts,
    strength: v.strength,
    owner: v.owner,
    entities: orUndefined(splitEntities(v.entities)),
    questions: orUndefined(v.questions),
  };
  const takenIds = React.useMemo(() => new Set(rules.map((r) => r.id)), [rules]);
  const errors: DetailErrors = validateRuleDetails(details, mode === "create" ? { id: v.id.trim(), takenIds } : {});
  const historyError = mode === "create" ? validateHistory(v.history, {}) : null;
  const errorKeys = Object.keys(errors) as (keyof DetailErrors)[];
  const shown = (k: keyof DetailErrors) => (submitted ? errors[k] : undefined);

  const changeSection = (section: string) => {
    setV((x) => ({ ...x, section, id: mode === "create" && !idTouched ? suggestRuleId(section, rules) : x.id }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (errorKeys.length || historyError) {
      // Take people to the first field that needs fixing.
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']")?.focus());
      return;
    }
    onSubmit({ id: mode === "create" ? v.id.trim() : undefined, details, history: mode === "create" ? v.history : undefined });
  };

  const parts = sectionParts(sections);
  const fid = (k: string) => `rule-form-${k}`;

  return (
    <form ref={formRef} onSubmit={submit} noValidate className="flex flex-col gap-5" aria-label={mode === "create" ? "New rule" : `Edit ${rule?.id}`}>
      {submitted && (errorKeys.length > 0 || historyError) && (
        <div role="alert" className="rounded-lg border border-dashed border-border p-3 t-body-sm text-on-surface">
          Fix {errorKeys.length + (historyError ? 1 : 0)} {errorKeys.length + (historyError ? 1 : 0) === 1 ? "field" : "fields"} to save:{" "}
          {[...errorKeys.map((k) => (k === "id" ? "ID" : FIELD_LABEL[k])), ...(historyError ? ["State history"] : [])].join(", ")}.
        </div>
      )}

      {mode === "create" && (
        <Field id={fid("id")} label="Rule ID" hint="Suggested from the section; change it if you like. Must be unique." error={shown("id")}>
          <input
            id={fid("id")}
            value={v.id}
            onChange={(e) => {
              setIdTouched(true);
              set("id", e.target.value);
            }}
            aria-invalid={!!shown("id")}
            aria-describedby={describedBy(fid("id"), shown("id"), "x")}
            className={cn(control, "h-10 t-mono-sm")}
            autoComplete="off"
          />
        </Field>
      )}

      <Field id={fid("title")} label="Title" hint="A short handle shown in lists (under 80 characters)." error={shown("title")}>
        <input
          id={fid("title")}
          value={v.title}
          onChange={(e) => set("title", e.target.value)}
          aria-invalid={!!shown("title")}
          aria-describedby={describedBy(fid("title"), shown("title"), "x")}
          className={cn(control, "h-10")}
          maxLength={120}
        />
      </Field>

      <Field id={fid("text")} label="Rule statement" hint="The rule as written." error={shown("text")}>
        <textarea
          id={fid("text")}
          value={v.text}
          onChange={(e) => set("text", e.target.value)}
          aria-invalid={!!shown("text")}
          aria-describedby={describedBy(fid("text"), shown("text"), "x")}
          rows={4}
          className={cn(control, "min-h-24 py-2")}
        />
      </Field>

      <Field id={fid("list")} label="List items" optional hint="If the statement ends in a list, one item per line." error={shown("list")}>
        <textarea id={fid("list")} value={v.list} onChange={(e) => set("list", e.target.value)} aria-invalid={!!shown("list")} rows={3} className={cn(control, "py-2")} />
      </Field>

      <Field id={fid("plain")} label="In plain words" optional error={shown("plain")}>
        <textarea id={fid("plain")} value={v.plain} onChange={(e) => set("plain", e.target.value)} aria-invalid={!!shown("plain")} rows={2} className={cn(control, "py-2")} />
      </Field>

      <Field id={fid("section")} label="Section" error={shown("section")}>
        <select id={fid("section")} value={v.section} onChange={(e) => changeSection(e.target.value)} aria-invalid={!!shown("section")} className={cn(control, "h-10 cursor-pointer bg-background")}>
          {parts.map((part) => (
            <optgroup key={part} label={part}>
              {sections
                .filter((x) => x.part === part)
                .map((x) => (
                  <option key={x.id} value={x.id}>
                    {ruleSectionLabel(x.id)}
                  </option>
                ))}
            </optgroup>
          ))}
        </select>
      </Field>

      <div className="flex flex-col gap-1.5" role="group" aria-labelledby={fid("contexts-label")}>
        <p id={fid("contexts-label")} className="t-body-sm text-body">
          Context <span className="text-muted">(1 to 3)</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {RULE_CONTEXT_ORDER.map((c) => {
            const on = v.contexts.includes(c);
            return (
              <ChoiceChip
                key={c}
                on={on}
                aria-pressed={on}
                aria-invalid={!!shown("contexts")}
                disabled={!on && v.contexts.length >= 3}
                onClick={() => set("contexts", on ? v.contexts.filter((x) => x !== c) : [...v.contexts, c])}
              >
                <span aria-hidden className={cn("size-2 rounded-full", dataBg[RULE_CONTEXTS[c].colour])} />
                {RULE_CONTEXTS[c].label}
              </ChoiceChip>
            );
          })}
        </div>
        {shown("contexts") && <p className="t-body-sm text-on-surface">{errors.contexts}</p>}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5" role="radiogroup" aria-labelledby={fid("strength-label")}>
          <p id={fid("strength-label")} className="t-body-sm text-body">
            Strength
          </p>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(RULE_STRENGTHS) as RuleStrength[]).map((st) => (
              <ChoiceChip key={st} on={v.strength === st} role="radio" aria-checked={v.strength === st} onClick={() => set("strength", st)} title={RULE_STRENGTHS[st].blurb}>
                {RULE_STRENGTHS[st].label}
              </ChoiceChip>
            ))}
          </div>
        </div>
        <Field id={fid("owner")} label="Owner" error={shown("owner")}>
          <select id={fid("owner")} value={v.owner} onChange={(e) => set("owner", e.target.value)} className={cn(control, "h-10 cursor-pointer bg-background")}>
            {RULE_OWNERS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field id={fid("entities")} label="Entities" optional hint="Logical entities it touches, e.g. bom.bom_revision (comma separated)." error={shown("entities")}>
        <input id={fid("entities")} value={v.entities} onChange={(e) => set("entities", e.target.value)} aria-invalid={!!shown("entities")} className={cn(control, "h-10 t-mono-sm")} autoComplete="off" />
      </Field>

      <div className="flex flex-col gap-1.5" role="group" aria-labelledby={fid("questions-label")}>
        <p id={fid("questions-label")} className="t-body-sm text-body">
          Waits on open questions <span className="text-muted">(optional)</span>
        </p>
        <div className="flex flex-wrap gap-1.5">
          {openQuestions.map((q) => {
            const on = v.questions.includes(q.id);
            return (
              <ChoiceChip key={q.id} on={on} aria-pressed={on} title={q.question} onClick={() => set("questions", on ? v.questions.filter((x) => x !== q.id) : [...v.questions, q.id])}>
                <span className="t-mono-sm">{q.id}</span>
              </ChoiceChip>
            );
          })}
        </div>
      </div>

      {mode === "create" && (
        <div className="flex flex-col gap-2">
          <p className="t-body-sm text-body">State history</p>
          <HistoryRows idPrefix="new-rule" rows={v.history} onChange={(rows) => set("history", rows)} />
          {submitted && historyError && (
            <p role="alert" className="flex items-start gap-2 t-body-sm text-on-surface">
              <Marker shape="hatch" size={8} className="mt-1.5" />
              {historyError}
            </p>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2 border-t border-border pt-4">
        <Button type="submit" variant="primary" size="sm" disabled={mode === "edit" && !dirty}>
          {mode === "create" ? "Add rule" : "Save changes"}
        </Button>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

/* ---------- section (create / edit) ---------- */

export function SectionForm({
  mode,
  initial,
  suggestedId,
  takenIds,
  onSubmit,
  onCancel,
}: {
  mode: "create" | "edit";
  initial?: { id: string; label: string; part: string };
  suggestedId?: string;
  takenIds: Set<string>;
  onSubmit: (value: { id: string; label: string; part: string }) => void;
  onCancel: () => void;
}) {
  const parts = sectionParts(currentSections());
  const [label, setLabel] = React.useState(initial?.label ?? "");
  const [part, setPart] = React.useState(initial?.part ?? parts[0] ?? "");
  const [newPart, setNewPart] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const id = initial?.id ?? suggestedId ?? "";
  const errors = validateSection({ label: label.trim(), part: part.trim() }, mode === "create" ? { id, takenIds } : {});
  const fid = (k: string) => `section-form-${mode}-${id}-${k}`;

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
        if (Object.keys(errors).length) return;
        onSubmit({ id, label: label.trim(), part: part.trim() });
      }}
      className="flex flex-col gap-4 rounded-lg border border-border p-4"
      aria-label={mode === "create" ? "New section" : `Edit section ${id}`}
    >
      {mode === "create" && <p className="t-mono-sm text-muted">New section {id}</p>}
      <Field id={fid("label")} label="Section name" error={submitted ? errors.label : undefined}>
        <input id={fid("label")} value={label} onChange={(e) => setLabel(e.target.value)} aria-invalid={submitted && !!errors.label} className={cn(control, "h-10")} maxLength={80} />
      </Field>
      <Field id={fid("part")} label="Spec part" hint="Groups the section in the filters and the coverage matrix." error={submitted ? errors.part : undefined}>
        {newPart ? (
          <div className="flex gap-2">
            <input id={fid("part")} value={part} onChange={(e) => setPart(e.target.value)} aria-invalid={submitted && !!errors.part} className={cn(control, "h-10")} placeholder="New part name" maxLength={60} />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setNewPart(false);
                setPart(parts[0] ?? "");
              }}
            >
              Pick existing
            </Button>
          </div>
        ) : (
          <select
            id={fid("part")}
            value={part}
            onChange={(e) => {
              if (e.target.value === "__new") {
                setNewPart(true);
                setPart("");
              } else setPart(e.target.value);
            }}
            className={cn(control, "h-10 cursor-pointer bg-background")}
          >
            {parts.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
            <option value="__new">New part…</option>
          </select>
        )}
      </Field>
      <div className="flex flex-wrap gap-2">
        <Button type="submit" variant="primary" size="sm">
          {mode === "create" ? "Add section" : "Save section"}
        </Button>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
