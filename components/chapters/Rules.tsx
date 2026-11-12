"use client";

// 14 · Business rules: every agreed rule in one register, with status (derived from its active period on an
// as-of date), context, section, strength and owner. Table, cards and timeline share one state, mirrored in the URL.
import * as React from "react";
import { ChapterShell } from "@/components/journey/ChapterShell";
import { Section } from "@/components/journey/Section";
import { Button, Eyebrow } from "@/components/ui-rt";
import { getRule, ruleRegister } from "@/content/rules";
import type { RuleContext } from "@/content/types-extra";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import { useSearchOpen } from "@/lib/searchIndex";
import { DEFAULT_QUERY, filterRules, searchTokens, sortRules, timelineDomain, type RuleQuery, type RuleSortKey } from "@/lib/rules";
import { RuleOverlay } from "./rules/RuleOverlay";
import { RuleQuestions } from "./rules/RuleQuestions";
import { RulesCards } from "./rules/RulesCards";
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

export default function Rules() {
  const state = useRulesState();
  const { query, setQuery, openRule, openId, view } = state;
  const today = useToday();
  const reduce = useReducedMotionSafe();

  // Filtering trails typing slightly so the input never lags.
  const deferred = React.useDeferredValue(query);
  const asOf = deferred.asOf ?? today;
  const list = React.useMemo(() => sortRules(filterRules(ruleRegister, deferred, asOf), deferred.sort, deferred.dir, asOf), [deferred, asOf]);
  const axis = React.useMemo(() => timelineDomain(asOf), [asOf]);
  const tokens = React.useMemo(() => searchTokens(deferred.q), [deferred.q]);

  useSearchOpen("rule", React.useCallback((id: string) => openRule(id), [openRule]));

  const current = openId ? (getRule(openId) ?? null) : null;
  const index = current ? list.findIndex((r) => r.id === current.id) : -1;
  const canStep = index >= 0 && list.length > 1;
  const step = (dir: 1 | -1) => openRule(list[(index + dir + list.length) % list.length].id);

  const scrollToRegister = () => document.getElementById("rules-register")?.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" });

  /** Replace every filter with `patch` (keeps sort and as-of), then bring the register into view. */
  const preset = (patch: Partial<RuleQuery>) => {
    setQuery((q) => ({ ...DEFAULT_QUERY, sort: q.sort, dir: q.dir, asOf: q.asOf, ...patch }));
    scrollToRegister();
  };
  // Functional update: two quick clicks on one header always flip the direction.
  const sortBy = (key: RuleSortKey) => setQuery((q) => ({ sort: key, dir: q.sort === key && q.dir === "asc" ? "desc" : "asc" }));
  const toggleContext = (c: RuleContext) => setQuery((q) => ({ ctx: q.ctx.includes(c) ? q.ctx.filter((x) => x !== c) : [...q.ctx, c] }));

  return (
    <ChapterShell
      id="rules"
      statement="Every rule in one register: what applies, to what, and since when."
      lead={`${ruleRegister.length} rules from the business-rules specification and the working sessions, each with its status, active period and context. Search, filter and sort them; read them as a table, cards or a timeline; open any rule for the detail.`}
    >
      <Section id="register">
        <Block id="rules-overview" eyebrow="At a glance" title="Most rules are in force; some still wait on an answer.">
          <RulesOverview asOf={asOf} query={query} onPreset={preset} onToggleContext={toggleContext} />
        </Block>

        <Block id="rules-register" eyebrow="All rules" lead="Status is worked out from each rule's active period on the as-of date; move the date to see the register as it stood, or will stand. Press F to search.">
          <div className="flex flex-col gap-6">
            <RulesToolbar state={state} asOf={asOf} today={today} list={list} />
            {list.length === 0 ? (
              <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-surface px-6 py-16 text-center">
                <p className="t-body-lg text-on-surface">No rule matches these filters.</p>
                <p className="t-body-md text-muted">Try fewer words, or remove a filter.</p>
                <Button size="sm" onClick={state.clearFilters}>
                  Clear filters
                </Button>
              </div>
            ) : view === "cards" ? (
              <RulesCards rules={list} asOf={asOf} domain={axis} tokens={tokens} onOpen={openRule} />
            ) : view === "timeline" ? (
              <RulesTimeline rules={list} asOf={asOf} axis={axis} tokens={tokens} sort={deferred.sort} onOpen={openRule} />
            ) : (
              <RulesTable rules={list} asOf={asOf} domain={axis} tokens={tokens} sort={query.sort} dir={query.dir} onSort={sortBy} onOpen={openRule} />
            )}
          </div>
        </Block>

        <Block
          id="rules-questions"
          eyebrow="Open questions"
          title="These questions decide the rules that cannot switch on yet."
          lead="Each answer either confirms the rules waiting on it or changes them. Select a question's rules to see them in the register."
        >
          <RuleQuestions
            onOpenRule={openRule}
            onFilter={(id) => preset({ question: id })}
          />
        </Block>
      </Section>

      <RuleOverlay
        rule={current}
        asOf={asOf}
        domain={axis}
        index={index}
        total={list.length}
        onOpenChange={(o) => !o && openRule(null)}
        onPrev={canStep ? () => step(-1) : undefined}
        onNext={canStep ? () => step(1) : undefined}
        onOpenRule={openRule}
      />
    </ChapterShell>
  );
}
