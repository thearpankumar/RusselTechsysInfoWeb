"use client";

// Side panel for the register's structure and housekeeping, all kept in this browser:
//   • Sections: add one, rename or move any (to another spec part), delete (an added section goes for good with the
//     rules added in it; a published one is hidden with its rules and can be restored);
//   • Deleted here: published rules and sections that were deleted, each restorable;
//   • Discard every local change.
import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { Pencil, Plus, RotateCcw, Trash2, X } from "lucide-react";
import type { RuleRecord } from "@/content/types-extra";
import { RULE_SECTIONS, currentSections, getRule, ruleSectionLabel } from "@/content/rules";
import { Button, IconButton } from "@/components/ui-rt";
import { sectionParts, suggestSectionId } from "@/lib/rules";
import { cn } from "@/lib/utils";
import { SectionForm } from "./RuleForms";
import type { LocalRulesApi } from "./useLocalRules";

export type SectionsPanelView = "sections" | "add" | "deleted";

const tag = "inline-flex h-6 items-center rounded-full border px-2 t-mono-sm whitespace-nowrap";

export function SectionsPanel({
  open,
  view,
  onViewChange,
  onClose,
  rules,
  api,
  onCloseAutoFocus,
}: {
  open: boolean;
  view: SectionsPanelView;
  onViewChange: (v: SectionsPanelView) => void;
  onClose: () => void;
  /** Rules in use (counts per section). */
  rules: RuleRecord[];
  api: LocalRulesApi;
  onCloseAutoFocus?: (e: Event) => void;
}) {
  const [editing, setEditing] = React.useState<string | null>(null);
  const sections = currentSections();
  const parts = sectionParts(sections);
  const count = (id: string) => rules.filter((r) => r.section === id).length;
  const takenIds = new Set([...RULE_SECTIONS.map((s) => s.id), ...api.local.sections.added.map((s) => s.id)]);
  const deletedSections = api.local.sections.deleted.map((id) => RULE_SECTIONS.find((s) => s.id === id)!).filter(Boolean);
  const deletedRules = api.local.deleted.map((id) => getRule(id)!).filter(Boolean);

  const remove = (id: string) => {
    const s = sections.find((x) => x.id === id);
    if (!s) return;
    const n = count(id);
    const msg = s.added
      ? `Delete the section "${s.label}"${n ? ` and the ${n} ${n === 1 ? "rule" : "rules"} in it` : ""}? Rules you added there are removed for good; published rules moved there go back to their own section.`
      : `Delete "${ruleSectionLabel(id)}"${n ? ` and hide its ${n} ${n === 1 ? "rule" : "rules"}` : ""}? You can restore it from "Deleted here".`;
    if (window.confirm(msg)) api.deleteSection(id);
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(o) => !o && onClose()} modal={false}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Content
          onKeyDown={(e) => e.stopPropagation()}
          onInteractOutside={(e) => e.preventDefault()}
          onCloseAutoFocus={onCloseAutoFocus}
          className={cn(
            "fixed inset-2 z-50 flex flex-col overflow-hidden rounded-xl border border-border bg-background text-on-surface outline-none sm:inset-y-3 sm:right-3 sm:left-auto sm:w-[min(36rem,calc(100vw-1.5rem))]",
            "duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-right-4 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-right-4"
          )}
        >
          <div className="flex items-center gap-2 border-b border-border px-6 py-4 sm:px-8">
            <div role="tablist" aria-label="Manage" className="inline-flex gap-1 rounded-full bg-surface p-1">
              {(
                [
                  ["sections", "Sections"],
                  ["deleted", `Deleted here · ${api.deletedCount + api.local.sections.deleted.length}`],
                ] as const
              ).map(([v, label]) => (
                <button
                  key={v}
                  type="button"
                  role="tab"
                  aria-selected={view === v || (v === "sections" && view === "add")}
                  onClick={() => onViewChange(v)}
                  className={cn(
                    "h-8 cursor-pointer rounded-full px-3 t-body-sm transition-colors duration-150",
                    view === v || (v === "sections" && view === "add") ? "bg-primary text-on-primary" : "text-body hover:bg-surface-raised"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            <DialogPrimitive.Close asChild>
              <IconButton label="Close" icon={<X />} className="ml-auto" />
            </DialogPrimitive.Close>
          </div>

          <div data-lenis-prevent className="flex-1 overflow-y-auto overscroll-contain px-6 py-6 sm:px-8">
            {view !== "deleted" ? (
              <>
                <DialogPrimitive.Title className="t-headline-md text-on-surface">Sections</DialogPrimitive.Title>
                <DialogPrimitive.Description className="mt-2 t-body-md text-muted">
                  Add, rename or move sections. Changes stay in this browser and show in the filters, the coverage matrix and the Excel download.
                </DialogPrimitive.Description>

                <div className="mt-6">
                  {view === "add" ? (
                    <SectionForm
                      mode="create"
                      suggestedId={suggestSectionId(sections, api.local)}
                      takenIds={takenIds}
                      onCancel={() => onViewChange("sections")}
                      onSubmit={(v) => {
                        api.addSection(v);
                        onViewChange("sections");
                      }}
                    />
                  ) : (
                    <Button size="sm" icon={<Plus aria-hidden />} onClick={() => onViewChange("add")}>
                      Add section
                    </Button>
                  )}
                </div>

                {parts.map((part) => (
                  <section key={part} className="mt-8" aria-label={part}>
                    <h3 className="t-label-caps text-muted">{part}</h3>
                    <ul className="mt-3 divide-y divide-border border-y border-border">
                      {sections
                        .filter((s) => s.part === part)
                        .map((s) => (
                          <li key={s.id} className="py-3">
                            {editing === s.id ? (
                              <SectionForm
                                mode="edit"
                                initial={{ id: s.id, label: s.label, part: s.part }}
                                takenIds={takenIds}
                                onCancel={() => setEditing(null)}
                                onSubmit={(v) => {
                                  api.saveSection(s.id, { label: v.label, part: v.part });
                                  setEditing(null);
                                }}
                              />
                            ) : (
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="min-w-0 flex-1">
                                  <span className="block t-body-md text-on-surface">{ruleSectionLabel(s.id)}</span>
                                  <span className="block t-body-sm text-muted">
                                    {count(s.id)} {count(s.id) === 1 ? "rule" : "rules"}
                                    {s.edited && s.original && ` · was "${s.original.label}"${s.original.part !== s.part ? ` in ${s.original.part}` : ""}`}
                                  </span>
                                </span>
                                {s.added && <span className={cn(tag, "border-chart-past bg-surface-raised text-on-surface")}>Added</span>}
                                {s.edited && <span className={cn(tag, "border-chart-past bg-surface-raised text-on-surface")}>Edited</span>}
                                <IconButton label={`Edit ${s.label}`} icon={<Pencil />} onClick={() => setEditing(s.id)} />
                                {s.edited && (
                                  <IconButton
                                    label={`Reset ${s.label} to published`}
                                    icon={<RotateCcw />}
                                    onClick={() => api.saveSection(s.id, { label: s.original!.label, part: s.original!.part })}
                                  />
                                )}
                                <IconButton label={`Delete ${s.label}`} icon={<Trash2 />} onClick={() => remove(s.id)} />
                              </div>
                            )}
                          </li>
                        ))}
                    </ul>
                  </section>
                ))}
              </>
            ) : (
              <>
                <DialogPrimitive.Title className="t-headline-md text-on-surface">Deleted here</DialogPrimitive.Title>
                <DialogPrimitive.Description className="mt-2 t-body-md text-muted">
                  Published rules and sections you deleted are only hidden in this browser. Restore any of them; rules and sections you added and then deleted are gone for good.
                </DialogPrimitive.Description>

                <section className="mt-8" aria-labelledby="deleted-sections">
                  <h3 id="deleted-sections" className="t-label-caps text-muted">
                    Sections
                  </h3>
                  {deletedSections.length ? (
                    <ul className="mt-3 divide-y divide-border border-y border-border">
                      {deletedSections.map((s) => (
                        <li key={s.id} className="flex items-center gap-2 py-3">
                          <span className="min-w-0 flex-1 t-body-md text-on-surface">
                            §{s.id} {s.label}
                          </span>
                          <Button size="sm" variant="ghost" icon={<RotateCcw aria-hidden />} onClick={() => api.restoreSection(s.id)}>
                            Restore
                          </Button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 t-body-md text-muted">—</p>
                  )}
                </section>

                <section className="mt-8" aria-labelledby="deleted-rules">
                  <h3 id="deleted-rules" className="t-label-caps text-muted">
                    Rules
                  </h3>
                  {deletedRules.length ? (
                    <ul className="mt-3 divide-y divide-border border-y border-border">
                      {deletedRules.map((r) => (
                        <li key={r.id} className="flex items-center gap-2 py-3">
                          <span className="min-w-0 flex-1">
                            <span className="t-mono-sm text-muted">{r.id}</span> <span className="t-body-md text-on-surface">{r.title}</span>
                          </span>
                          <Button size="sm" variant="ghost" icon={<RotateCcw aria-hidden />} onClick={() => api.restoreRule(r.id)}>
                            Restore
                          </Button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 t-body-md text-muted">—</p>
                  )}
                </section>
              </>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-border px-6 py-4 sm:px-8">
            <span className="t-body-sm text-muted">
              {api.count ? `${api.count} local ${api.count === 1 ? "change" : "changes"} in this browser` : "No local changes"}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto"
              icon={<Trash2 aria-hidden />}
              disabled={!api.count}
              onClick={() => {
                if (window.confirm(`Discard all ${api.count} local changes (edits, added and deleted rules and sections)? This cannot be undone.`)) api.resetAll();
              }}
            >
              Discard all changes
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
