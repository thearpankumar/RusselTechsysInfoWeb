"use client";

// 14 · Business rules: every rule in one register, with its dated state history, status on an as-of date (derived
// from that history), context, section, strength and owner. Table, cards and timeline share one state, mirrored in
// the URL; a side panel shows one rule; two dates can be compared; the whole register downloads as Excel.
import * as React from "react";
import { X } from "lucide-react";
import { ChapterShell } from "@/components/journey/ChapterShell";
import { Section } from "@/components/journey/Section";
import { Button, Eyebrow } from "@/components/ui-rt";
import { getRule, ruleRegister } from "@/content/rules";
import type { RuleContext } from "@/content/types-extra";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import { useSearchOpen } from "@/lib/searchIndex";
import { DEFAULT_QUERY, FACETS, FACET_LABEL, facetValueLabel, filterRules, formatDate, searchTokens, sortRules, timelineDomain, type RuleQuery, type RuleSortKey } from "@/lib/rules";
import { RulePanel } from "./rules/RulePanel";
import { RuleQuestions } from "./rules/RuleQuestions";
import { RulesCards } from "./rules/RulesCards";
import { RulesChanges } from "./rules/RulesChanges";
import { RulesCoverage } from "./rules/RulesCoverage";
import { RulesOverview } from "./rules/RulesOverview";
import { RulesTable } from "./rules/RulesTable";
import { RulesTimeline } from "./rules/RulesTimeline";
import { RulesToolbar } from "./rules/RulesToolbar";
import { useToday } from "./rules/shared";
import { useRulesState } from "./rules/useRulesState";

/** One sub-section block (same pattern as the Operations chapter). */
function Block({ id, eyebrow, title, lead, children }: { id: string; eyebrow?: string; title?: string; lead?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={title ? `${id}-title` : undefined} className="scroll-mt-24">
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      {title && (
        <h2 id={`${id}-title`} className="mt-4 max-w-3xl t-headline-md text-on-surface">
          {title}
        </h2>
      )}
      {lead && <p className={title || eyebrow ? "mt-3 max-w-3xl t-body-md text-muted" : "max-w-3xl t-body-md text-muted"}>{lead}</p>}
      <div className={title || eyebrow || lead ? "mt-8" : undefined}>{children}</div>
    </section>
  );
}

/** Each active filter as a label and the patch that removes it (zero-results state). */
function appliedFilters(q: RuleQuery): { key: string; label: string; patch: Partial<RuleQuery> }[] {
  const out: { key: string; label: string; patch: Partial<RuleQuery> }[] = [];
  for (const f of FACETS)
    for (const v of q[f] as string[]) out.push({ key: `${f}:${v}`, label: `${FACET_LABEL[f]}: ${facetValueLabel(f, v)}`, patch: { [f]: (q[f] as string[]).filter((x) => x !== v) } as Partial<RuleQuery> });
  if (q.q.trim()) out.push({ key: "q", label: `Search: “${q.q.trim()}”`, patch: { q: "" } });
  if (q.flag) out.push({ key: "flag", label: "Needs confirmation", patch: { flag: false } });
  if (q.question) out.push({ key: "question", label: `Waits on: ${q.question}`, patch: { question: null } });
  if (q.vs && q.changed) out.push({ key: "changed", label: `Changed since ${formatDate(q.vs)}`, patch: { changed: false } });
  return out;
}

const isTyping = (t: EventTarget | null) => {
  const el = t as HTMLElement | null;
  return !!el && (el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName));
};

export default function Rules() {
  const state = useRulesState();
  const { query, setQuery, openRule, openId, view } = state;
  const today = useToday();
  const reduce = useReducedMotionSafe();
  const searchRef = React.useRef<HTMLInputElement>(null);

  // The list, counts and timeline trail typing slightly so the inputs never lag.
  const deferred = React.useDeferredValue(query);
  const asOf = deferred.asOf ?? today;
  const list = React.useMemo(() => sortRules(filterRules(ruleRegister, deferred, asOf), deferred.sort, deferred.dir, asOf), [deferred, asOf]);
  const axis = React.useMemo(() => timelineDomain(asOf, deferred.vs), [asOf, deferred.vs]);
  const tokens = React.useMemo(() => searchTokens(deferred.q), [deferred.q]);
  // The compare summary counts every change in this view, whether or not "changed only" is on.
  const forSummary = React.useMemo(() => (deferred.vs ? filterRules(ruleRegister, { ...deferred, changed: false }, asOf) : []), [deferred, asOf]);

  // Where focus returns when the panel closes: the control that first opened it.
  const opener = React.useRef<HTMLElement | null>(null);
  const openIdRef = React.useRef(openId);
  const lastViewed = React.useRef<string | null>(null);
  React.useEffect(() => {
    openIdRef.current = openId;
    if (openId) lastViewed.current = openId;
  }, [openId]);
  const open = React.useCallback(
    (id: string | null) => {
      if (id && !openIdRef.current) opener.current = document.activeElement as HTMLElement | null;
      openRule(id);
    },
    [openRule]
  );

  useSearchOpen("rule", React.useCallback((id: string) => open(id), [open]));

  const current = openId ? (getRule(openId) ?? null) : null;
  const index = current ? list.findIndex((r) => r.id === current.id) : -1;
  const canStep = index >= 0 && list.length > 1;
  const step = React.useCallback(
    (dir: 1 | -1) => {
      if (index >= 0 && list.length > 1) openRule(list[(index + dir + list.length) % list.length].id);
    },
    [index, list, openRule]
  );

  // j / k step through the shown rules while the panel is open and focus is in the list (the panel handles its own keys).
  React.useEffect(() => {
    if (!openId) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.key !== "j" && e.key !== "k") || e.metaKey || e.ctrlKey || e.altKey || isTyping(e.target)) return;
      e.preventDefault();
      step(e.key === "j" ? 1 : -1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openId, step]);

  const scrollToRegister = () => document.getElementById("rules-register")?.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" });

  /** Replace every filter with `patch` (keeps sort and dates), then bring the register into view. */
  const preset = (patch: Partial<RuleQuery>) => {
    setQuery((q) => ({ ...DEFAULT_QUERY, sort: q.sort, dir: q.dir, asOf: q.asOf, vs: q.vs, ...patch }));
    scrollToRegister();
  };
  const toggleContext = (c: RuleContext) => setQuery((q) => ({ ctx: q.ctx.includes(c) ? q.ctx.filter((x) => x !== c) : [...q.ctx, c] }));
  // Functional update: two quick clicks on one header always flip the direction.
  const sortBy = React.useCallback((key: RuleSortKey) => setQuery((q) => ({ sort: key, dir: q.sort === key && q.dir === "asc" ? "desc" : "asc" })), [setQuery]);

  const applied = appliedFilters(query);

  return (
    <ChapterShell
      id="rules"
      statement="Every rule in one register: what applies, to what, and since when."
      lead={`${ruleRegister.length} rules from the business-rules specification and the working sessions, each with its state history, status, active period and context. Search, filter and sort them; read them as a table, cards or a timeline; compare two dates; download the lot as Excel.`}
    >
      <Section id="register">
        <Block id="rules-overview" eyebrow="At a glance" title="Most rules are in force; some still wait on an answer.">
          <RulesOverview asOf={asOf} query={query} onPreset={preset} onToggleContext={toggleContext} />
        </Block>

        <Block
          id="rules-coverage"
          eyebrow="Coverage"
          title="Where the rules sit: each part of the spec against what it applies to."
          lead="Brighter cells hold more rules; a dash means none. Select a cell to see those rules in the register."
        >
          <RulesCoverage query={query} onSelect={(ctx, sections) => preset({ ctx: [ctx], sec: sections })} />
        </Block>

        <Block
          id="rules-register"
          eyebrow="All rules"
          title="Every rule, with its status on any date you pick."
          lead="Each rule moves through dated states (draft, review, approved, active, replaced); its status is Active only while it is in force on the as-of date. Move the date, or compare two dates, to see what changed. Press F to search."
        >
          <div className="flex flex-col gap-6">
            <RulesToolbar state={state} counted={deferred} asOf={asOf} today={today} list={list} searchRef={searchRef} />
            {deferred.vs && <RulesChanges rules={forSummary} vs={deferred.vs} asOf={asOf} onOpenRule={open} />}
            {list.length === 0 ? (
              <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-surface px-6 py-16 text-center">
                <p className="t-body-lg text-on-surface">No rule matches all of these filters.</p>
                <p className="t-body-md text-muted">Remove one to widen the list.</p>
                <ul className="flex flex-wrap justify-center gap-2">
                  {applied.map((f) => (
                    <li key={f.key}>
                      <button
                        type="button"
                        onClick={() => {
                          setQuery(f.patch);
                          searchRef.current?.focus();
                        }}
                        aria-label={`Remove filter ${f.label}`}
                        className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-chart-past bg-surface-raised px-3 t-body-md text-on-surface transition-colors duration-150 hover:border-primary"
                      >
                        {f.label}
                        <X aria-hidden className="size-4" strokeWidth={1.5} />
                      </button>
                    </li>
                  ))}
                </ul>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    state.clearFilters();
                    searchRef.current?.focus();
                  }}
                >
                  Clear all filters
                </Button>
              </div>
            ) : view === "cards" ? (
              <RulesCards rules={list} asOf={asOf} vs={deferred.vs} tokens={tokens} openId={openId} onOpen={open} />
            ) : view === "timeline" ? (
              <RulesTimeline rules={list} asOf={asOf} vs={deferred.vs} axis={axis} tokens={tokens} sort={deferred.sort} openId={openId} onOpen={open} />
            ) : (
              <RulesTable rules={list} asOf={asOf} vs={deferred.vs} tokens={tokens} sort={query.sort} dir={query.dir} openId={openId} onSort={sortBy} onOpen={open} />
            )}
          </div>
        </Block>

        <Block
          id="rules-questions"
          eyebrow="Open questions"
          title="These questions decide the rules that cannot switch on yet."
          lead="Each answer either confirms the rules waiting on it or changes them. Select a question's rules to see them in the register."
        >
          <RuleQuestions onOpenRule={open} onFilter={(id) => preset({ question: id })} />
        </Block>
      </Section>

      <RulePanel
        rule={current}
        asOf={asOf}
        vs={deferred.vs}
        index={index}
        total={list.length}
        onClose={() => openRule(null)}
        onPrev={canStep ? () => step(-1) : undefined}
        onNext={canStep ? () => step(1) : undefined}
        onOpenRule={open}
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          // Prefer the row of the rule just viewed (after stepping), else whatever opened the panel.
          const id = lastViewed.current;
          const row = id ? document.querySelector<HTMLElement>(`[data-rule-open="${CSS.escape(id)}"]`) : null;
          (row ?? opener.current)?.focus();
          opener.current = null;
        }}
      />
    </ChapterShell>
  );
}
