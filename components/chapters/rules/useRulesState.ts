"use client";

// Register state (query, view, open rule) mirrored into the URL so any view can be shared.
// Read from window.location after mount and written with history.replaceState, which Next integrates with its
// router. useSearchParams is avoided on purpose: on these prerendered pages it would client-render the tree
// up to a Suspense boundary.
import * as React from "react";
import { getRule } from "@/content/rules";
import { DEFAULT_QUERY, parseRuleQuery, parseView, writeRuleParams, type RuleQuery, type RuleView } from "@/lib/rules";

const VIEW_KEY = "rt:rules-view";

interface State {
  query: RuleQuery;
  view: RuleView;
  openId: string | null;
  ready: boolean;
}

function readStoredView(): RuleView | null {
  try {
    return parseView(window.localStorage.getItem(VIEW_KEY));
  } catch {
    return null;
  }
}

export function useRulesState() {
  const [state, setState] = React.useState<State>({ query: DEFAULT_QUERY, view: "table", openId: null, ready: false });

  // Mount: URL first, then the saved view, then a small-screen default of cards.
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const rule = params.get("rule");
    const view = parseView(params.get("view")) ?? readStoredView() ?? (window.matchMedia("(min-width: 768px)").matches ? "table" : "cards");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({ query: parseRuleQuery(params), view, openId: rule && getRule(rule) ? rule : null, ready: true });
  }, []);

  // Mirror into the URL (debounced, so typing does not flood the history API).
  React.useEffect(() => {
    if (!state.ready) return;
    const t = window.setTimeout(() => {
      const url = new URL(window.location.href);
      writeRuleParams(url.searchParams, state.query, state.view, state.openId);
      const next = url.pathname + url.search + url.hash;
      if (next !== window.location.pathname + window.location.search + window.location.hash) {
        window.history.replaceState(window.history.state, "", next);
      }
    }, 250);
    return () => window.clearTimeout(t);
  }, [state]);

  const setQuery = React.useCallback((patch: Partial<RuleQuery> | ((q: RuleQuery) => Partial<RuleQuery>)) => {
    setState((s) => ({ ...s, query: { ...s.query, ...(typeof patch === "function" ? patch(s.query) : patch) } }));
  }, []);

  /** Clear every filter; keep sort and as-of. */
  const clearFilters = React.useCallback(() => {
    setState((s) => ({ ...s, query: { ...DEFAULT_QUERY, sort: s.query.sort, dir: s.query.dir, asOf: s.query.asOf } }));
  }, []);

  const setView = React.useCallback((view: RuleView) => {
    try {
      window.localStorage.setItem(VIEW_KEY, view);
    } catch {
      /* storage blocked: the URL still carries the view */
    }
    setState((s) => ({ ...s, view }));
  }, []);

  const openRule = React.useCallback((id: string | null) => {
    setState((s) => ({ ...s, openId: id && getRule(id) ? id : null }));
  }, []);

  return { ...state, setQuery, clearFilters, setView, openRule };
}

export type RulesState = ReturnType<typeof useRulesState>;
