"use client";

import * as React from "react";
import Image from "next/image";
import { photoFor } from "@/content/peoplePhotos";
import { ArrowUpRight } from "lucide-react";
import {
  Button,
  ChartFrame,
  Chip,
  Cite,
  ConfidenceTag,
  DetailOverlay,
  Eyebrow,
  KeyValueRows,
  Legend,
  Marker,
  Stat,
} from "@/components/ui-rt";
import { Section } from "@/components/journey/Section";
import { dataBg, dataTint, type DataColor } from "@/lib/dataColors";
import {
  board,
  coreDepartmentIds,
  departments,
  designationLadder,
  COMPANY_LINKEDIN_URL,
  latestWorkforce,
  linkedinCompany,
  people,
  reportingLines,
  scmChain,
  workforce,
  type BoardMember,
  type PersonProfile,
} from "@/content/people";
import { cn } from "@/lib/utils";
import { useIndexedOverlay } from "../portfolio/useIndexedOverlay";
import { WorkforceChart } from "./WorkforceChart";

/* ---------- helpers ---------- */

const CONTACT_COLOR: Record<"sponsor" | "day-to-day" | "working", DataColor> = {
  sponsor: "sage",
  "day-to-day": "slate",
  working: "tan",
};
const CONTACT_LABEL: Record<"sponsor" | "day-to-day" | "working", string> = {
  sponsor: "Project sponsor",
  "day-to-day": "Day-to-day contact",
  working: "Working contact",
};

function contactRole(id: string): "sponsor" | "day-to-day" | "working" | undefined {
  return scmChain.find((c) => c.personId === id)?.contact;
}

function initials(name: string) {
  const parts = name.replace(/^Dr\.?\s+/i, "").split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

const personById = new Map(people.map((p) => [p.id, p]));
const leadership = people.filter((p) => p.group !== "contact");
const directReports = (id: string) => reportingLines.filter((l) => l.to === id).map((l) => l.from);

const coreDepartments = departments.filter((d) => (coreDepartmentIds as readonly string[]).includes(d.id));
const buyers = departments.find((d) => d.id === "buying");
const management = departments.find((d) => d.id === "management");
const deptList = [...coreDepartments, ...(buyers ? [buyers] : []), ...(management ? [management] : [])];

const boardOnly = board.filter((b) => !b.personId);

function Monogram({ name, className }: { name: string; className?: string }) {
  return (
    <span aria-hidden className={cn("inline-flex size-12 shrink-0 items-center justify-center rounded-md bg-surface-raised t-body-md tracking-wide text-on-surface", className)}>
      {initials(name)}
    </span>
  );
}

/** Portrait from Rossell's own website when we have one; otherwise the initials tile. */
function Portrait({ ids, name, className, sizes = "96px" }: { ids: (string | undefined)[]; name: string; className?: string; sizes?: string }) {
  const photo = photoFor(...ids);
  if (!photo) return <Monogram name={name} className={className} />;
  return (
    <span aria-hidden className={cn("relative inline-block size-12 shrink-0 overflow-hidden rounded-md bg-surface-raised", className)}>
      <Image src={photo.src} alt="" fill sizes={sizes} className="object-cover object-top" />
    </span>
  );
}

function ContactTag({ role }: { role?: "sponsor" | "day-to-day" | "working" }) {
  if (!role) return null;
  return (
    <span className={cn("inline-flex h-6 items-center gap-2 rounded-sm px-2 t-mono-sm text-on-surface", dataTint[CONTACT_COLOR[role]])}>
      <span aria-hidden className={cn("size-2 rounded-full", dataBg[CONTACT_COLOR[role]])} />
      {CONTACT_LABEL[role]}
    </span>
  );
}

const linkedinSearchUrl = (name: string) => `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(`${name} Rossell`)}`;

const textLink = "t-body-sm text-body underline decoration-border underline-offset-4 transition-colors duration-150 hover:text-on-surface hover:decoration-on-surface";

/** Matched profile → LinkedIn button (+ "Probable match" when not verified). No match → quiet note + a LinkedIn people search. */
function LinkedinButton({ person }: { person: PersonProfile }) {
  if (!person.linkedin || !person.linkedinConfidence) {
    return (
      <span className="inline-flex flex-wrap items-center gap-2">
        <span className="t-body-sm text-muted">No verified profile</span>
        <span aria-hidden className="text-muted">·</span>
        <a href={linkedinSearchUrl(person.name)} target="_blank" rel="noopener noreferrer" className={textLink} aria-label={`Search LinkedIn for ${person.name} (opens in a new tab)`}>
          Search LinkedIn
        </a>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-2">
      <Button size="sm" href={person.linkedin} external aria-label={`${person.name} on LinkedIn (opens in a new tab)`}>
        LinkedIn
        <ArrowUpRight aria-hidden />
      </Button>
      {person.linkedinConfidence === "probable" && (
        <span title="Matched from a search snippet with one open caveat" className="inline-flex h-6 items-center rounded-full border border-dashed border-border px-2 t-mono-sm text-muted">
          Probable match
        </span>
      )}
    </span>
  );
}

/* ---------- sections ---------- */

function LeadershipGrid({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <section id="people-leadership" aria-labelledby="people-leadership-title" className="scroll-mt-24">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-3xl">
          <Eyebrow>Leadership</Eyebrow>
          <h3 id="people-leadership-title" className="mt-3 t-headline-md text-on-surface">
            {leadership.length} leaders, from the promoters to the US arm
          </h3>
          <p className="mt-2 t-body-md text-muted">
            Portraits are from Rossell&rsquo;s own leadership and board pages. A LinkedIn button appears where the profile matches Rossell Techsys; where we found no match, a search link lets you look yourself.
          </p>
          <span className="mt-3 inline-flex items-center gap-2 t-mono-sm text-muted">
            Photos <Cite ids={["IMG-RT-LEADERSHIP", "IMG-RT-BOARD"]} />
          </span>
        </div>
        <span className="inline-flex flex-wrap items-center gap-3">
          <Button size="sm" href={COMPANY_LINKEDIN_URL} external aria-label="Rossell Techsys company page on LinkedIn (opens in a new tab)">
            Company on LinkedIn
            <ArrowUpRight aria-hidden />
          </Button>
          <span className="t-body-sm text-muted">{linkedinCompany.followers.display} followers</span>
          <Cite ids={linkedinCompany.followers.sources} />
        </span>
      </div>
      <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {leadership.map((p) => {
          const role = contactRole(p.id);
          return (
            <li key={p.id} id={`person-${p.id}`} className="flex scroll-mt-24 flex-col gap-4 rounded-lg border border-transparent bg-surface p-6 transition-colors duration-150 hover:border-chart-past">
              <button type="button" onClick={() => onOpen(p.id)} className="group flex cursor-pointer flex-col gap-4 text-left">
                {photoFor(p.id) ? (
                  <span className="relative block aspect-[4/5] w-full overflow-hidden rounded-lg bg-surface-raised">
                    <Image
                      src={photoFor(p.id)!.src}
                      alt={`Portrait of ${p.name}`}
                      fill
                      sizes="(min-width: 1280px) 22vw, (min-width: 640px) 40vw, 90vw"
                      className="object-contain object-bottom transition-transform duration-200 ease-out group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                  </span>
                ) : (
                  <span className="flex aspect-[4/5] w-full items-center justify-center rounded-lg bg-surface-raised">
                    <Monogram name={p.name} className="size-16 bg-surface t-headline-md" />
                  </span>
                )}
                <span className="min-w-0">
                  <span className="block t-body-lg text-on-surface">{p.name}</span>
                  <span className="mt-1 block t-body-sm text-body">{p.title}</span>
                </span>
              </button>
              {p.background && <p className="line-clamp-3 t-body-sm text-muted">{p.background}</p>}
              <div className="mt-auto flex flex-wrap items-center gap-2">
                <ContactTag role={role ?? (p.isContact ? "working" : undefined)} />
                <Button size="sm" onClick={() => onOpen(p.id)}>
                  Profile →
                </Button>
                <LinkedinButton person={p} />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Board({ onOpenPerson, onOpenDirector }: { onOpenPerson: (id: string) => void; onOpenDirector: (id: string) => void }) {
  const independent = board.filter((b) => b.category === "Independent").length;
  return (
    <section id="people-board" aria-labelledby="people-board-title" className="scroll-mt-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow>Board of directors</Eyebrow>
          <h3 id="people-board-title" className="mt-3 t-headline-md text-on-surface">
            Six directors, three independent, including a former HAL chairman
          </h3>
        </div>
        <span className="flex items-center gap-2">
          <Cite ids={["R-ppl-2", "R-ppl-3"]} />
        </span>
      </div>
      <ul className="mt-8 divide-y divide-border border-y border-border">
        {board.map((b) => (
          <li key={b.id}>
            <button
              type="button"
              onClick={() => (b.personId ? onOpenPerson(b.personId) : onOpenDirector(b.id))}
              className="grid w-full cursor-pointer grid-cols-[auto_1fr] items-center gap-4 py-4 text-left transition-colors duration-150 hover:bg-surface md:grid-cols-[auto_2fr_2fr_3fr]"
            >
              <Portrait ids={[b.personId, b.id]} name={b.name} className="size-12" />
              <span>
                <span className="block t-body-lg text-on-surface">{b.name}</span>
                <span className="block t-body-sm text-body">{b.designation}</span>
              </span>
              <span className="col-start-2 t-body-sm text-muted md:col-start-auto">{b.category}</span>
              <span className="col-start-2 flex flex-wrap gap-2 md:col-start-auto">
                {b.committees.length ? (
                  b.committees.map((c) => (
                    <span key={c} className="inline-flex h-6 items-center rounded-full border border-border px-2 t-mono-sm text-muted">
                      {c}
                    </span>
                  ))
                ) : (
                  <span className="t-body-sm text-muted">—</span>
                )}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-4 t-body-sm text-muted">
        {independent} of {board.length} are independent. Committees: Audit, NRC (nomination and remuneration), SRC (stakeholders relationship), CSR.
      </p>
    </section>
  );
}

function OrgChain({ onOpen }: { onOpen: (id: string) => void }) {
  const [focus, setFocus] = React.useState<string>("vp-scm");
  return (
    <section id="people-org" aria-labelledby="people-org-title" className="scroll-mt-24">
      <Eyebrow>Where we work</Eyebrow>
      <h3 id="people-org-title" className="mt-3 t-headline-md text-on-surface">
        From the CEO to the buyer who reads the morning reports
      </h3>
      <p className="mt-2 t-body-md text-muted">Select a level to see who sits beside it; select a name for the full profile.</p>
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[3fr_2fr]">
        <ol className="dot-grid relative rounded-xl bg-canvas p-6 sm:p-10">
          {scmChain.map((c, i) => {
            const person = c.personId ? personById.get(c.personId) : undefined;
            const active = focus === c.id;
            return (
              <li key={c.id} className="relative">
                {i > 0 && (
                  <span aria-hidden className="mx-auto block h-6 w-px bg-chart-mid sm:ml-12" />
                )}
                <button
                  type="button"
                  onClick={() => setFocus(c.id)}
                  aria-pressed={active}
                  className={cn(
                    "relative flex w-full cursor-pointer items-center gap-4 overflow-hidden rounded-md border bg-surface py-4 pr-4 pl-6 text-left transition-colors duration-150",
                    active ? "border-chart-mid bg-surface-raised" : "border-border hover:border-chart-past"
                  )}
                >
                  <span aria-hidden className={cn("absolute inset-y-0 left-0 w-0.75", c.contact ? dataBg[CONTACT_COLOR[c.contact]] : "bg-border")} />
                  <span className="t-mono-sm text-muted">{String(i + 1).padStart(2, "0")}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block t-mono-sm text-muted">{c.role}</span>
                    <span className="mt-1 block t-body-md text-on-surface">{person?.name ?? c.who}</span>
                  </span>
                  {c.contact && <span className="hidden sm:inline-flex"><ContactTag role={c.contact} /></span>}
                </button>
              </li>
            );
          })}
        </ol>
        <OrgFocus focus={focus} onOpen={onOpen} />
      </div>
      <Legend
        className="mt-6"
        items={[
          { label: CONTACT_LABEL.sponsor, tone: CONTACT_COLOR.sponsor },
          { label: CONTACT_LABEL["day-to-day"], tone: CONTACT_COLOR["day-to-day"] },
          { label: CONTACT_LABEL.working, tone: CONTACT_COLOR.working },
        ]}
      />
    </section>
  );
}

function OrgFocus({ focus, onOpen }: { focus: string; onOpen: (id: string) => void }) {
  const c = scmChain.find((x) => x.id === focus)!;
  const person = c.personId ? personById.get(c.personId) : undefined;
  const reports = person ? directReports(person.id).map((id) => personById.get(id)).filter((p): p is PersonProfile => !!p) : [];
  const line = person ? reportingLines.find((l) => l.from === person.id) : undefined;
  return (
    <div className="rounded-xl bg-surface p-6 sm:p-10" aria-live="polite">
      <p className="t-mono-sm text-muted">{c.role}</p>
      <p className="mt-3 t-headline-md text-on-surface">{person?.name ?? c.who}</p>
      {person && <p className="mt-2 t-body-md text-body">{person.title}</p>}
      {person?.background && <p className="mt-4 t-body-sm text-muted">{person.background}</p>}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Cite ids={c.sources} />
        <ConfidenceTag confidence={c.confidence} />
        {line && (
          <span className="inline-flex items-center gap-2 t-body-sm text-muted">
            Reporting line <ConfidenceTag confidence={line.confidence} showReported />
          </span>
        )}
      </div>
      {reports.length > 0 && (
        <div className="mt-8 border-t border-border pt-6">
          <p className="mb-3 t-label-caps text-muted">Also reporting here</p>
          <div className="flex flex-wrap gap-2">
            {reports.map((r) => (
              <Chip key={r.id} onClick={() => onOpen(r.id)} marker={<Marker tone={contactRole(r.id) ? CONTACT_COLOR[contactRole(r.id)!] : "past"} size={8} />}>
                {r.name}
              </Chip>
            ))}
          </div>
          <p className="mt-3 t-body-sm text-muted">Lines other than the SCM chain are our estimate from titles.</p>
        </div>
      )}
      {person && (
        <Button size="sm" className="mt-8" onClick={() => onOpen(person.id)}>
          Full profile →
        </Button>
      )}
    </div>
  );
}

function Ladder() {
  const [sel, setSel] = React.useState(1);
  const level = designationLadder.find((l) => l.rank === sel)!;
  const holders: Record<number, string> = { 1: "Manian Rajaram (SCM & Logistics)", 2: "Vinayak (SCM)", 6: "Purna and the buyers" };
  return (
    <section id="people-ladder" aria-labelledby="people-ladder-title" className="scroll-mt-24">
      <Eyebrow>Designation ladder</Eyebrow>
      <h3 id="people-ladder-title" className="mt-3 t-headline-md text-on-surface">
        Eight levels below the C-suite
      </h3>
      <p className="mt-2 t-body-md text-muted">Top to bottom, as described in the working sessions. Select a level.</p>
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <ol className="relative">
          <span aria-hidden className="absolute top-3 bottom-3 left-1.25 w-px bg-border" />
          <span
            aria-hidden
            className="absolute top-3 left-1.25 w-px bg-primary transition-[height] duration-200 ease-out"
            style={{ height: `calc((100% - 1.5rem) * ${(sel - 1) / (designationLadder.length - 1)})` }}
          />
          {designationLadder.map((l) => {
            const current = l.rank === sel;
            const above = l.rank < sel;
            return (
              <li key={l.rank}>
                <button
                  type="button"
                  aria-current={current ? "step" : undefined}
                  onClick={() => setSel(l.rank)}
                  className="flex w-full cursor-pointer items-center gap-4 py-2 text-left"
                >
                  <span
                    className={cn(
                      "relative z-10 block size-2.5 shrink-0 rounded-full border",
                      current ? "border-primary bg-primary" : above ? "border-primary bg-background" : "border-chart-mid bg-background"
                    )}
                  />
                  <span className="t-mono-sm text-muted">{String(l.rank).padStart(2, "0")}</span>
                  <span className={cn("t-body-lg", current ? "text-on-surface" : "text-body")}>{l.title}</span>
                  {holders[l.rank] && <span aria-label="Our contact sits here" className={cn("ml-auto size-2 rounded-full", dataBg.slate)} />}
                </button>
              </li>
            );
          })}
        </ol>
        <div className="rounded-xl bg-surface p-6 sm:p-10" aria-live="polite">
          <p className="t-mono-sm text-muted">
            Level {String(level.rank).padStart(2, "0")} of {String(designationLadder.length).padStart(2, "0")}
          </p>
          <p className="mt-3 t-headline-md text-on-surface">{level.title}</p>
          <p className="mt-3 t-body-md text-body">{level.plain}</p>
          <p className="mt-6 t-body-sm text-muted">{holders[level.rank] ? `Who we know here: ${holders[level.rank]}.` : "None of our contacts sits at this level."}</p>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Cite ids={level.sources} />
            <ConfidenceTag confidence={level.confidence} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Departments({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <section id="people-departments" aria-labelledby="people-dept-title" className="scroll-mt-24">
      <Eyebrow>Departments</Eyebrow>
      <h3 id="people-dept-title" className="mt-3 t-headline-md text-on-surface">
        Twelve departments, one approval layer above them
      </h3>
      <p className="mt-2 t-body-md text-muted">As named in the working sessions. Buyers sit inside SCM. Select a department for what it does and the files it uses.</p>
      {management && (
        <button
          type="button"
          onClick={() => onOpen(management.id)}
          className="mt-8 flex w-full cursor-pointer flex-wrap items-center gap-4 rounded-md border border-border bg-surface px-6 py-4 text-left transition-colors duration-150 hover:border-chart-past"
        >
          <span className="t-mono-sm text-muted">00</span>
          <span className="t-body-lg text-on-surface">{management.name}</span>
          <span className="t-body-sm text-muted">{management.does}</span>
        </button>
      )}
      <ul className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {coreDepartments.map((d, i) => (
          <li key={d.id} className="flex flex-col gap-3 rounded-md border border-border bg-surface p-4">
            <button type="button" onClick={() => onOpen(d.id)} className="flex cursor-pointer flex-col gap-3 text-left">
              <span className="t-mono-sm text-muted">{String(i + 1).padStart(2, "0")}</span>
              <span className="t-body-md text-on-surface">{d.name}</span>
              <span className="line-clamp-3 t-body-sm text-muted">{d.does}</span>
            </button>
            {d.id === "scm" && buyers && (
              <Chip onClick={() => onOpen(buyers.id)} marker={CONTACT_COLOR.working} className="mt-auto self-start">
                Buyers
              </Chip>
            )}
          </li>
        ))}
      </ul>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Cite ids={["WS"]} />
        <ConfidenceTag confidence="session" />
      </div>
    </section>
  );
}

/* ---------- body ---------- */

export function PeopleBody() {
  const personOverlay = useIndexedOverlay(people, "person");
  const directorOverlay = useIndexedOverlay(boardOnly, "director");
  const deptOverlay = useIndexedOverlay(deptList, "department");
  const wfOverlay = useIndexedOverlay(workforce);
  const p = personOverlay.item;
  const d: BoardMember | null = directorOverlay.item;
  const dept = deptOverlay.item;
  const wf = wfOverlay.item;

  return (
    <>
      {/* 1 · Overview: how many people, on what basis. */}
      <Section id="overview">
        <div id="people-headcount" className="flex scroll-mt-24 flex-col gap-10">
          <div className="flex flex-col gap-8 rounded-xl bg-surface p-6 sm:p-10 lg:flex-row lg:items-end lg:justify-between">
            <Stat
              size="xl"
              label="Workforce · Jun 2026"
              value={latestWorkforce.value.toLocaleString("en-IN")}
              unit="people"
              caption="Total employees, the latest figure"
              sub="Includes contract staff and trainees"
              meta={<Cite ids={latestWorkforce.sources} />}
            />
            <Button size="sm" arrow href="/people/workforce#people-workforce" className="self-start">
              How it grew
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <Stat label="Permanent staff" value="253" unit="people" caption="On the rolls, Mar 2025" sub="Statutory count; excludes contract staff" meta={<Cite ids={["R-ppl-4"]} />} />
            <Stat
              label="On LinkedIn"
              value={String(linkedinCompany.employeesOnLinkedIn.value)}
              unit="people"
              caption="Employees listing Rossell"
              sub={`Company size band ${linkedinCompany.employeesOnLinkedIn.sizeBand}`}
              meta={<Cite ids={linkedinCompany.employeesOnLinkedIn.sources} />}
            />
            <Stat
              label="Target"
              value="2,000"
              unit="people"
              caption="By 2027"
              sub="2,500 by 2029"
              meta={
                <>
                  <Cite ids={["R-scl-11", "R-scl-1"]} />
                  <ConfidenceTag confidence="estimate" />
                </>
              }
            />
          </div>
        </div>
        <p className="max-w-3xl t-body-md text-muted">
          The three counts measure different things: everyone on site (1,281), permanent employees on the statutory rolls (253), and people who name Rossell on their LinkedIn profile ({linkedinCompany.employeesOnLinkedIn.value}). None of them is wrong; they are not comparable.
        </p>
      </Section>

      {/* 2 · Leadership. */}
      <Section id="leadership">
        <LeadershipGrid onOpen={personOverlay.openId} />
      </Section>

      {/* 3 · The reporting chain we work in; 4 · the designation ladder and departments. */}
      <Section id="structure">
        <OrgChain onOpen={personOverlay.openId} />
      </Section>

      <Section id="roles">
        <Ladder />
        <Departments onOpen={deptOverlay.openId} />
      </Section>

      {/* 4 · Workforce over time. */}
      <Section id="workforce">
        <div id="people-workforce" className="scroll-mt-24">
          <ChartFrame
            title="A workforce that has nearly doubled in a year"
            subtitle="People at each disclosure. Definitions differ: grey bars count everyone on site, the hatched bar counts permanent staff only, dashed bars are company targets."
            footer={
              <>
                <Legend
                  items={[
                    { label: "Total workforce", tone: "past" },
                    { label: "Latest", tone: "primary" },
                    { label: "Permanent only", tone: "mid", shape: "hatch" },
                    { label: "Company target", tone: "mid", shape: "hollow" },
                  ]}
                />
                <Cite ids={["R-ppl-7", "R-ppl-4", "R-scl-19", "R-scl-18", "R-ppl-8", "R-scl-11"]} max={6} />
                <span className="t-body-sm text-muted">Aug 2025 has three versions: 960 (call), 950 (press release), 850 (annual report). Select a bar for detail.</span>
              </>
            }
          >
            <WorkforceChart data={workforce} latestId={latestWorkforce.id} onSelect={wfOverlay.open} />
          </ChartFrame>
        </div>
      </Section>

      {/* 5 · Board. */}
      <Section id="board">
        <Board onOpenPerson={personOverlay.openId} onOpenDirector={directorOverlay.openId} />
      </Section>

      {/* Overlays live outside the sections so search can open them from any section. */}
      <DetailOverlay {...personOverlay.overlayProps} eyebrow={p?.function} title={p?.name ?? ""} description={p?.title}>
        {p && (
          <div className="space-y-8">
            {photoFor(p.id) && (
              <figure className="flex items-end gap-6">
                <span className="relative block aspect-[4/5] w-40 shrink-0 overflow-hidden rounded-lg bg-surface-raised">
                  <Image src={photoFor(p.id)!.src} alt={`Portrait of ${p.name}`} fill sizes="160px" className="object-contain object-bottom" />
                </span>
                <figcaption className="flex flex-wrap items-center gap-2 t-mono-sm text-muted">
                  Photo · Rossell Techsys website <Cite ids={[photoFor(p.id)!.sourceId]} />
                </figcaption>
              </figure>
            )}
            <div className="flex flex-wrap items-center gap-2">
              <ContactTag role={contactRole(p.id) ?? (p.isContact ? "working" : undefined)} />
              <LinkedinButton person={p} />
              {p.profileUrl && (
                <Button size="sm" href={p.profileUrl} external>
                  Company page
                  <ArrowUpRight aria-hidden />
                </Button>
              )}
            </div>
            {p.background && <p className="t-body-md text-body">{p.background}</p>}
            <KeyValueRows
              rows={[
                { label: "Joined", value: p.joined },
                { label: "Reports to", value: p.reportsTo ? personById.get(p.reportsTo)?.name : undefined, onClick: p.reportsTo ? () => personOverlay.openId(p.reportsTo!) : undefined },
                {
                  label: "Reporting line",
                  value: (() => {
                    const l = reportingLines.find((x) => x.from === p.id);
                    return l ? <ConfidenceTag confidence={l.confidence} showReported /> : undefined;
                  })(),
                },
              ]}
            />
            {p.previously && p.previously.length > 0 && (
              <div>
                <p className="mb-3 t-label-caps text-muted">Previously</p>
                <div className="flex flex-wrap gap-2">
                  {p.previously.map((x) => (
                    <Chip key={x}>{x}</Chip>
                  ))}
                </div>
              </div>
            )}
            {p.titleSource && (
              <p className="t-body-sm text-muted">
                <span className="text-body">Title source:</span> {p.titleSource}
              </p>
            )}
            {p.notes && p.notes.length > 0 && (
              <div className="rounded-lg border border-dashed border-border p-4">
                <p className="mb-2 t-label-caps text-muted">Notes</p>
                <ul className="space-y-2">
                  {p.notes.map((n) => (
                    <li key={n} className="t-body-sm text-body">
                      {n}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex flex-wrap items-center gap-2">
              <Cite ids={p.sources} max={5} />
              <ConfidenceTag confidence={p.confidence} />
            </div>
          </div>
        )}
      </DetailOverlay>

      <DetailOverlay {...directorOverlay.overlayProps} eyebrow="Board of directors" title={d?.name ?? ""} description={d?.designation}>
        {d && (
          <div className="space-y-6">
            {photoFor(d.personId, d.id) && (
              <figure className="flex items-end gap-6">
                <span className="relative block aspect-[4/5] w-40 shrink-0 overflow-hidden rounded-lg bg-surface-raised">
                  <Image src={photoFor(d.personId, d.id)!.src} alt={`Portrait of ${d.name}`} fill sizes="160px" className="object-contain object-bottom" />
                </span>
                <figcaption className="flex flex-wrap items-center gap-2 t-mono-sm text-muted">
                  Photo · Rossell Techsys website <Cite ids={[photoFor(d.personId, d.id)!.sourceId]} />
                </figcaption>
              </figure>
            )}
            {d.background && <p className="t-body-md text-body">{d.background}</p>}
            <KeyValueRows rows={[{ label: "Category", value: d.category }, { label: "Committees", value: d.committees.join(" · ") }]} />
            <div className="flex flex-wrap items-center gap-2">
              <Cite ids={d.sources} />
              <Button size="sm" href="https://rosselltechsys.com/investor-relations/board-of-directors/" external>
                Board page
                <ArrowUpRight aria-hidden />
              </Button>
            </div>
          </div>
        )}
      </DetailOverlay>

      <DetailOverlay {...deptOverlay.overlayProps} eyebrow="Department" title={dept?.name ?? ""} description={dept?.does}>
        {dept && (
          <div className="space-y-6">
            <div>
              <p className="mb-3 t-label-caps text-muted">Files it uses</p>
              {dept.usesFiles?.length ? (
                <div className="flex flex-wrap gap-2">
                  {dept.usesFiles.map((f) => (
                    <Chip key={f}>{f}</Chip>
                  ))}
                </div>
              ) : (
                <p className="t-body-md text-muted">—</p>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Cite ids={dept.sources} />
              <ConfidenceTag confidence={dept.confidence} />
            </div>
          </div>
        )}
      </DetailOverlay>

      <DetailOverlay
        {...wfOverlay.overlayProps}
        eyebrow={wf ? `Workforce · ${wf.label}` : undefined}
        title={wf ? `${wf.value.toLocaleString("en-IN")} people` : ""}
        description={wf?.definition}
      >
        {wf && (
          <div className="space-y-6">
            <KeyValueRows
              rows={[
                { label: "Definition", value: wf.basis === "total" ? "Total workforce" : wf.basis === "permanent" ? "Permanent employees only" : "Company target" },
                { label: "As of", value: wf.id === "wf-baseline" ? "Before the 2025 ramp (date not stated)" : wf.asOf },
              ]}
            />
            {wf.note && <p className="t-body-sm text-muted">{wf.note}</p>}
            <div className="flex flex-wrap items-center gap-2">
              <Cite ids={wf.sources} />
              <ConfidenceTag confidence={wf.confidence} />
            </div>
          </div>
        )}
      </DetailOverlay>
    </>
  );
}
