"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { CornerDownLeft } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandShortcut } from "@/components/ui/command";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Kbd } from "@/components/ui-rt/Kbd";
import { OPEN_PARAM, emitSearchOpen, useSearchItems, type SearchItem } from "@/lib/searchIndex";
import { parsePath, resolveAnchor } from "@/lib/structure";

/** Results shown per group before a "Show all" row (keeps the palette fast with 600+ registered items). */
const PER_GROUP = 8;

const norm = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "");

interface Indexed {
  item: SearchItem;
  label: string;
  hay: string;
}

/** Drop structural chapter/part numbering ("02", "09 · 01 · …") from hints; keep real ids like S28 or R-scl-11. */
function cleanHint(hint?: string) {
  if (!hint) return "";
  return hint.replace(/^(\d{2}(\.\d+)*)(\s·\s\d{2})?(\s·\s)?/, "").trim();
}

/** Score an item against query tokens: every token must match; label hits rank above keyword/hint hits. */
function score(x: Indexed, tokens: string[], q: string): number {
  let s = 0;
  for (const t of tokens) {
    const li = x.label.indexOf(t);
    if (li === 0) s += 6;
    else if (li > 0) s += x.label[li - 1] === " " ? 4 : 3;
    else if (x.hay.includes(t)) s += 1;
    else return 0;
  }
  if (x.label === q) s += 20;
  else if (x.label.startsWith(q)) s += 8;
  return s;
}

/** ⌘K / "/" palette over every registered SearchItem (see lib/searchIndex.ts), grouped by `group`.
 *  Filtering is done here (cmdk's filter is off) and each group is capped at PER_GROUP rows with a "Show all" row. */
export function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const runtime = useSearchItems();
  const router = useRouter();
  const pathname = usePathname();
  const [catalog, setCatalog] = React.useState<SearchItem[] | null>(null);

  // Lazy-load the static catalog (all chapters) when idle, or immediately when the palette opens.
  React.useEffect(() => {
    if (catalog) return;
    let cancelled = false;
    const load = () => import("@/lib/searchCatalog").then((m) => !cancelled && setCatalog(m.catalog));
    if (open) load();
    else {
      const t = window.setTimeout(load, 2500);
      return () => {
        cancelled = true;
        window.clearTimeout(t);
      };
    }
    return () => {
      cancelled = true;
    };
  }, [open, catalog]);

  const items = React.useMemo(() => {
    const base = catalog ?? runtime;
    if (!catalog) return base;
    const ids = new Set(catalog.map((i) => i.id));
    const { chapter } = parsePath(pathname);
    const extra = runtime
      .filter((i) => !ids.has(i.id))
      .map((i) => (i.href?.startsWith("#") && chapter ? { ...i, href: resolveAnchor(chapter, i.href.slice(1)) } : i));
    return [...catalog, ...extra];
  }, [catalog, runtime, pathname]);
  const [query, setQuery] = React.useState("");
  const [expanded, setExpanded] = React.useState<Set<string>>(() => new Set());
  const deferredQuery = React.useDeferredValue(query);

  const indexed = React.useMemo<Indexed[]>(
    () =>
      items.map((item) => ({
        item,
        label: norm(item.label),
        hay: norm(`${item.label} ${item.group} ${item.hint ?? ""} ${(item.keywords ?? []).join(" ")} ${item.id}`),
      })),
    [items],
  );

  const groups = React.useMemo(() => {
    const q = norm(deferredQuery.trim());
    const tokens = q.split(/\s+/).filter(Boolean);
    const map = new Map<string, { list: SearchItem[]; best: number; order: number }>();
    let order = 0;
    const scored: { item: SearchItem; s: number }[] = [];
    for (const x of indexed) {
      const s = tokens.length ? score(x, tokens, q) : 1;
      if (s > 0) scored.push({ item: x.item, s });
    }
    if (tokens.length) scored.sort((a, b) => b.s - a.s);
    for (const { item, s } of scored) {
      let g = map.get(item.group);
      if (!g) map.set(item.group, (g = { list: [], best: s, order: order++ }));
      g.list.push(item);
      g.best = Math.max(g.best, s);
    }
    // "Chapters" first; with a query, groups with the strongest match come next; otherwise registration order.
    return [...map.entries()].sort(([a, ga], [b, gb]) => {
      if (a === "Chapters") return -1;
      if (b === "Chapters") return 1;
      return tokens.length ? gb.best - ga.best || ga.order - gb.order : ga.order - gb.order;
    });
  }, [indexed, deferredQuery]);

  const onOpenChangeAndReset = (next: boolean) => {
    if (!next) {
      setQuery("");
      setExpanded(new Set());
    }
    onOpenChange(next);
  };

  const select = (it: SearchItem) => {
    onOpenChangeAndReset(false);
    // Let the dialog close (and unlock scroll) before navigating.
    setTimeout(() => {
      if (it.onSelect) return it.onSelect();
      if (!it.href) return;
      const url = new URL(it.href, window.location.origin);
      const samePage = url.pathname === window.location.pathname;
      if (samePage) {
        if (url.hash) document.getElementById(url.hash.slice(1))?.scrollIntoView({ block: "start" });
        if (it.open) emitSearchOpen(it.open);
        return;
      }
      if (it.open) url.searchParams.set(OPEN_PARAM, `${it.open.type}:${it.open.id}`);
      router.push(url.pathname + url.search + url.hash);
    }, 50);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAndReset}>
      <DialogContent showCloseButton={false} className="top-[15vh] translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-2xl sm:p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Search</DialogTitle>
          <DialogDescription>Search chapters, people, clients, suppliers, files and fields.</DialogDescription>
        </DialogHeader>
        <Command shouldFilter={false}>
          <CommandInput
            value={query}
            onValueChange={(v) => {
              setQuery(v);
              setExpanded(new Set());
            }}
            placeholder="Search chapters, people, clients, suppliers, files, fields…"
            trailing={<Kbd>esc</Kbd>}
          />
          <CommandList>
            <CommandEmpty>Nothing matches that yet.</CommandEmpty>
            {groups.map(([group, { list }]) => {
              const all = group === "Chapters" || expanded.has(group);
              const shown = all ? list : list.slice(0, PER_GROUP);
              const rest = list.length - shown.length;
              return (
                <CommandGroup key={group} heading={group}>
                  {shown.map((it) => (
                    <CommandItem key={it.id} value={it.id} onSelect={() => select(it)}>
                      <span className="truncate">{it.label}</span>
                      {cleanHint(it.hint) && <CommandShortcut>{cleanHint(it.hint)}</CommandShortcut>}
                    </CommandItem>
                  ))}
                  {rest > 0 && (
                    <CommandItem value={`__more:${group}`} onSelect={() => setExpanded((s) => new Set(s).add(group))} className="text-muted">
                      <span className="truncate">
                        Show all {list.length} in {group.toLowerCase()}
                      </span>
                      <CommandShortcut>+{rest}</CommandShortcut>
                    </CommandItem>
                  )}
                </CommandGroup>
              );
            })}
          </CommandList>
          <div className="flex items-center gap-4 border-t border-border px-6 py-3 t-body-sm text-muted">
            <span className="inline-flex items-center gap-2">
              <Kbd>↑</Kbd>
              <Kbd>↓</Kbd> move
            </span>
            <span className="inline-flex items-center gap-2">
              <Kbd>
                <CornerDownLeft className="size-3.5" strokeWidth={1.5} />
              </Kbd>
              open
            </span>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
