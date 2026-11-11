"use client";

import * as React from "react";
import Link from "next/link";
import { LayoutGrid, LogOut, Menu, PanelLeftClose, PanelLeftOpen, Search, X } from "lucide-react";
import { acts, chapters } from "@/lib/journeyChapters";
import { sectionHref, sectionsOf } from "@/lib/structure";
import { cn } from "@/lib/utils";
import { Kbd } from "@/components/ui-rt/Kbd";
import { IconButton } from "@/components/ui-rt/IconButton";
import { MAP_ICON, chapterIcon } from "@/lib/chapterIcons";
import { TalenciaMark } from "./TalenciaMark";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useJourney } from "./JourneyProvider";

/** Rail width — main content must offset by the same amount on desktop (see JourneyMain: lg:pl-72 / lg:pl-18). */
export const RAIL_WIDTH_CLASS = "lg:w-72";
export const RAIL_COLLAPSED_CLASS = "lg:w-18";

const focusRing = "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

/** Slim rail: one line icon per chapter; the active one gets surface-raised + the 2px white leading bar; titles in tooltips. */
function CompactNavList() {
  const { active } = useJourney();
  const items = [{ id: "map", index: "··", label: "Journey map", href: "/" }, ...chapters.map((c) => ({ id: c.id, index: c.index, label: c.label, href: `/${c.id}` }))];
  return (
    <ol className="flex flex-col items-center gap-0.5">
      {items.map((c) => {
        const isActive = c.id === (active ?? "map");
        return (
          <li key={c.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={c.href}
                  aria-current={isActive ? "page" : undefined}
                  aria-label={c.label}
                  className={cn(
                    "relative flex size-11 items-center justify-center rounded-lg t-mono-sm tnum transition-colors duration-150 ease-out",
                    focusRing,
                    isActive ? "bg-surface-raised text-on-surface" : "text-muted hover:bg-background hover:text-on-surface"
                  )}
                >
                  {isActive && <span aria-hidden className="absolute top-1/2 left-0 h-6 w-0.5 -translate-y-1/2 rounded-full bg-primary" />}
                  {(() => {
                    const Icon = c.id === "map" ? MAP_ICON : chapterIcon(c.id);
                    return <Icon className="size-5" strokeWidth={1.5} aria-hidden />;
                  })()}
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{c.label}</TooltipContent>
            </Tooltip>
          </li>
        );
      })}
    </ol>
  );
}

/** Clears the gate cookie (DELETE /api/gate) and returns to the passcode screen. */
async function signOut() {
  try {
    await fetch("/api/gate", { method: "DELETE" });
  } finally {
    // Full reload on purpose: drops all client state and cached RSC payloads after the cookie is cleared.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign("/gate");
  }
}

function SignOutButton({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <IconButton label="Sign out" icon={<LogOut />} size="sm" variant="bare" onClick={signOut} />
        </TooltipTrigger>
        <TooltipContent side="right">Sign out</TooltipContent>
      </Tooltip>
    );
  }
  return (
    <button
      type="button"
      onClick={signOut}
      className={cn("inline-flex h-10 cursor-pointer items-center gap-3 rounded-full px-3 t-body-sm text-muted transition-colors duration-150 ease-out hover:bg-background hover:text-on-surface", focusRing)}
    >
      <LogOut className="size-4" strokeWidth={1.5} aria-hidden />
      Sign out
    </button>
  );
}

function RailToggle() {
  const { railCollapsed, toggleRail } = useJourney();
  const label = railCollapsed ? "Expand chapter rail" : "Collapse chapter rail";
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={toggleRail}
          aria-label={label}
          aria-expanded={!railCollapsed}
          aria-controls="chapter-rail"
          className={cn(
            "inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-body transition-colors duration-150 ease-out hover:bg-surface-raised hover:text-on-surface [&_svg]:size-5 [&_svg]:stroke-[1.5]",
            focusRing
          )}
        >
          {railCollapsed ? <PanelLeftOpen aria-hidden /> : <PanelLeftClose aria-hidden />}
        </button>
      </TooltipTrigger>
      <TooltipContent side="right" className="flex items-center gap-2">
        {railCollapsed ? "Expand" : "Collapse"} <Kbd>[</Kbd>
      </TooltipContent>
    </Tooltip>
  );
}

/** Presenter mode HUD: slim chapter counter "03 / 15", label, prev/next keys and exit. */
function PresenterBar() {
  const { active, section, presenting, togglePresent } = useJourney();
  if (!presenting) return null;
  const ci = active ? chapters.findIndex((c) => c.id === active) : -1;
  const c = ci >= 0 ? chapters[ci] : null;
  const secs = c ? sectionsOf(c.id) : [];
  const si = secs.findIndex((x) => x.id === section);
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 rounded-full border border-border bg-background/80 py-2 pr-2 pl-6 backdrop-blur-md print:hidden"
    >
      <span className="t-mono-sm tnum text-on-surface">
        {c ? c.label : "Journey map"}
      </span>
      <span className="hidden max-w-64 truncate t-body-md text-body sm:inline">{c && si >= 0 ? secs[si].label : ""}</span>
      <span className="hidden items-center gap-2 t-body-sm text-muted md:inline-flex">
        <Kbd keys={["←", "→"]} /> step
      </span>
      <IconButton label="Exit presenter mode (Esc or P)" size="sm" icon={<X />} onClick={togglePresent} />
    </div>
  );
}

function NavList({ onNavigate, compact }: { onNavigate?: () => void; compact?: boolean }) {
  const { active, section } = useJourney();
  const listRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>('[aria-current="page"]');
    el?.scrollIntoView({ block: "nearest" });
  }, [active, section]);

  const row = (on: boolean) =>
    cn(
      "relative flex items-center gap-4 rounded-lg px-4 transition-colors duration-150 ease-out",
      focusRing,
      compact ? "h-12 t-body-md" : "h-12 t-body-lg",
      on ? "bg-surface-raised text-on-surface" : "text-body hover:bg-background hover:text-on-surface"
    );
  const bar = <span aria-hidden className="absolute top-1/2 left-0 h-6 w-0.5 -translate-y-1/2 rounded-full bg-primary" />;

  return (
    <div ref={listRef} className="flex flex-col gap-6">
      <Link href="/" onClick={onNavigate} aria-current={active === null ? "page" : undefined} className={row(active === null)}>
        {active === null && bar}
        <LayoutGrid className="size-5 text-muted" strokeWidth={1.5} aria-hidden />
        Journey map
      </Link>
      {acts.map((act) => (
        <div key={act.id}>
          <p className="px-4 pb-2 t-label-caps text-muted">{act.label}</p>
          <ol className="flex flex-col gap-1">
            {chapters
              .filter((c) => c.act === act.id)
              .map((c) => {
                const isActive = c.id === active;
                const secs = sectionsOf(c.id);
                return (
                  <li key={c.id}>
                    <Link
                      href={sectionHref(c.id, secs[0].id)}
                      onClick={onNavigate}
                      aria-current={isActive && secs.length < 2 ? "page" : undefined}
                      className={row(isActive)}
                    >
                      {isActive && bar}
                      {(() => {
                        const Icon = chapterIcon(c.id);
                        return <Icon className={cn("size-5 shrink-0", isActive ? "text-on-surface" : "text-muted")} strokeWidth={1.5} aria-hidden />;
                      })()}
                      <span className="truncate" title={c.label}>
                        {"rail" in c ? c.rail : c.label}
                      </span>
                    </Link>
                    {isActive && secs.length > 1 && (
                      <ol className="mt-1 mb-2 ml-6 flex flex-col border-l border-border pl-2">
                        {secs.map((sx) => {
                          const on = sx.id === section;
                          return (
                            <li key={sx.id}>
                              <Link
                                href={sectionHref(c.id, sx.id)}
                                onClick={onNavigate}
                                aria-current={on ? "page" : undefined}
                                className={cn(
                                  "flex h-9 items-center gap-3 rounded-md px-3 t-body-sm transition-colors duration-150 ease-out",
                                  focusRing,
                                  on ? "bg-surface-raised text-on-surface" : "text-muted hover:text-on-surface"
                                )}
                              >
                                <span className="truncate">{sx.label}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ol>
                    )}
                  </li>
                );
              })}
          </ol>
        </div>
      ))}
    </div>
  );
}

/** Fixed left chapter rail (desktop, collapsible with "[") with route-based active state + journey progress; top progress bar + sheet menu on mobile. */
export function ChapterRail() {
  const { active, progress, openSearch, railCollapsed, presenting, togglePresent } = useJourney();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const current = chapters.find((c) => c.id === active) ?? { index: "00", label: "Journey map" };

  return (
    <>
      {/* Desktop rail */}
      <aside
        id="chapter-rail"
        aria-label="Chapter rail"
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-border bg-canvas transition-[width] duration-200 ease-out motion-reduce:transition-none print:hidden lg:flex",
          railCollapsed ? RAIL_COLLAPSED_CLASS : RAIL_WIDTH_CLASS,
          presenting && "lg:hidden"
        )}
      >
        {railCollapsed ? (
          <>
            <div className="flex flex-col items-center gap-4 px-2 pt-6 pb-4">
              <TalenciaMark variant="brand" title="Talencia Global" className="h-7 w-auto" />
              <RailToggle />
              <div className="h-px w-8 bg-chart-past" aria-hidden>
                <div className="h-px bg-primary" style={{ width: `${progress * 100}%` }} />
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={openSearch}
                    aria-label="Search"
                    className={cn(
                      "inline-flex size-12 cursor-pointer items-center justify-center rounded-lg border border-border text-muted transition-colors duration-150 hover:border-chart-past hover:text-body [&_svg]:size-5",
                      focusRing
                    )}
                  >
                    <Search strokeWidth={1.5} aria-hidden />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="flex items-center gap-2">
                  Search <Kbd>/</Kbd>
                </TooltipContent>
              </Tooltip>
            </div>
            <nav aria-label="Chapters" data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto px-2 pb-4">
              <CompactNavList />
            </nav>
            <div className="flex justify-center border-t border-border py-3">
              <SignOutButton compact />
            </div>
          </>
        ) : (
          <>
            <div className="relative isolate overflow-hidden px-6 pt-8 pb-6">
              {/* Talencia Global mark as a hairline watermark, cropped by the header edge. */}
              <TalenciaMark variant="outline" className="pointer-events-none absolute -top-6 -right-8 -z-10 h-44 text-chart-mid opacity-40" />
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="flex items-center gap-3">
                    <TalenciaMark variant="brand" title="Talencia Global" className="h-8 w-auto shrink-0" />
                    <span className="t-label-md text-on-surface">Talencia Global</span>
                  </p>
                  <p className="mt-3 t-mono-sm text-muted">for Rossell Techsys</p>
                </div>
                <span className="relative -mt-2 -mr-2">
                  <RailToggle />
                </span>
              </div>
              <div className="mt-6 h-px w-full bg-chart-past" aria-hidden>
                <div className="h-px bg-primary" style={{ width: `${progress * 100}%` }} />
              </div>
            </div>
            <div className="px-4 pb-4">
              <button
                type="button"
                onClick={openSearch}
                className={cn(
                  "flex h-12 w-full cursor-pointer items-center gap-3 rounded-lg border border-border px-4 t-body-md text-muted transition-colors duration-150 hover:border-chart-past hover:text-body",
                  focusRing
                )}
              >
                <Search className="size-5" strokeWidth={1.5} />
                <span>Search</span>
                <Kbd className="ml-auto">/</Kbd>
              </button>
            </div>
            <nav aria-label="Chapters" data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
              <NavList />
            </nav>
            <div className="flex flex-col gap-2 border-t border-border px-6 py-4 t-body-sm text-muted">
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center gap-2">
                  <Kbd keys={["←", "→"]} /> sections
                </span>
                <span className="inline-flex items-center gap-2">
                  <Kbd>/</Kbd> search
                </span>
              </div>
              <div className="flex items-center gap-4">
                <button type="button" onClick={togglePresent} className={cn("inline-flex cursor-pointer items-center gap-2 rounded-sm hover:text-body", focusRing)}>
                  <Kbd>P</Kbd> present
                </button>
                <span className="inline-flex items-center gap-2">
                  <Kbd>M</Kbd> map
                </span>
                <span className="-my-2 ml-auto -mr-2">
                  <SignOutButton compact />
                </span>
              </div>
            </div>
          </>
        )}
      </aside>
      <PresenterBar />

      {/* Mobile top bar */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md print:hidden lg:hidden">
        <div className="flex h-16 items-center gap-3 px-4">
          {React.createElement("id" in current ? chapterIcon(current.id) : MAP_ICON, {
            className: "size-5 shrink-0 text-muted",
            strokeWidth: 1.5,
            "aria-hidden": true,
          })}
          <span className="min-w-0 flex-1 truncate t-body-md text-on-surface">{current.label}</span>
          <IconButton label="Search" icon={<Search />} size="sm" variant="bare" onClick={openSearch} />
          <IconButton label="Chapters" icon={<Menu />} size="sm" onClick={() => setMenuOpen(true)} />
        </div>
        <div className="h-0.5 w-full bg-chart-past" aria-hidden>
          <div className="h-full bg-primary" style={{ width: `${progress * 100}%` }} />
        </div>
      </header>
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="bg-canvas">
          <SheetHeader>
            <SheetTitle>Chapters</SheetTitle>
            <SheetDescription>Rossell Techsys, as we understand it.</SheetDescription>
          </SheetHeader>
          <nav aria-label="Chapters" className="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
            <NavList compact onNavigate={() => setMenuOpen(false)} />
          </nav>
          <div className="border-t border-border px-4 py-3">
            <SignOutButton />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
