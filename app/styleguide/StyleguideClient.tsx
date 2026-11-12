"use client";

import * as React from "react";
import { Building2, Plus, Search } from "lucide-react";
import {
  BarChart,
  Button,
  Card,
  CardNested,
  ChartFrame,
  Chip,
  ChipCount,
  Cite,
  ConfidenceTag,
  CountBadge,
  DetailOverlay,
  Eyebrow,
  HBar,
  HeatCell,
  heatLevel,
  IconButton,
  Kbd,
  KeyValueRows,
  Legend,
  Marker,
  Reveal,
  SegmentBar,
  Stat,
  StatRow,
  StatusTrack,
  TabTrack,
} from "@/components/ui-rt";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DATA_COLORS } from "@/lib/dataColors";
import { PhotoCard, PhotoStrip } from "@/components/ui-rt/PhotoCard";
import { PROGRAM_PHOTOS } from "@/content/assets";

const swatches = [
  ["canvas", "bg-canvas"],
  ["background", "bg-background"],
  ["surface", "bg-surface"],
  ["surface-raised", "bg-surface-raised"],
  ["border", "bg-border"],
  ["chart-past", "bg-chart-past"],
  ["chart-mid", "bg-chart-mid"],
  ["chart-light", "bg-chart-light"],
  ["primary", "bg-primary"],
] as const;

const people = ["Chief executive", "Chief financial officer", "Head of supply chain"];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-border py-16">
      <Eyebrow>{title}</Eyebrow>
      <div className="mt-8">{children}</div>
    </section>
  );
}

/** Sample-data rendering of every primitive for visual QA. Sample values only. */
export function StyleguideClient() {
  const [tab, setTab] = React.useState<"revenue" | "orders" | "mix">("revenue");
  const [selected, setSelected] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [i, setI] = React.useState(0);

  return (
    <main className="mx-auto max-w-6xl px-6 py-16 sm:px-12">
      <Eyebrow index="QA">Design system</Eyebrow>
      <h1 className="mt-6 t-headline-display">Styleguide.</h1>
      <p className="mt-6 max-w-2xl t-body-lg text-body">Every primitive in components/ui-rt with sample data. Values here are illustrative only.</p>

      <Section title="Colour tokens">
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-5 lg:grid-cols-9">
          {swatches.map(([name, cls]) => (
            <div key={name}>
              <div className={`h-16 rounded-md border border-border ${cls}`} />
              <p className="mt-2 t-mono-sm text-muted">{name}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-6">
          {DATA_COLORS.map((c) => (
            <span key={c} className="inline-flex items-center gap-2 t-body-md text-body">
              <Marker tone={c} /> data-{c}
            </span>
          ))}
        </div>
      </Section>

      <Section title="Typography">
        <div className="space-y-6">
          <p className="t-headline-display">Headline display</p>
          <p className="t-headline-xl">Headline xl</p>
          <p className="t-metric-xl">₹485</p>
          <p className="t-metric-lg">87%</p>
          <p className="t-headline-lg">Statement headline lg.</p>
          <p className="t-headline-md">Chart title md</p>
          <p className="t-body-lg text-body">Body lg — lead paragraphs, navigation labels, buttons.</p>
          <p className="t-body-md text-body">Body md — default UI text.</p>
          <p className="t-body-sm text-muted">Body sm — sub-labels and axis labels.</p>
          <p className="t-label-md">Label md</p>
          <p className="t-label-caps text-muted">Label caps eyebrow</p>
          <p className="t-mono-sm text-muted">01 · mono-sm · 02 / 07</p>
        </div>
      </Section>

      <Section title="Buttons, icon buttons, kbd, chips">
        <div className="flex flex-wrap items-center gap-3">
          <Button arrow>Open</Button>
          <Button variant="primary">Confirm</Button>
          <Button variant="ghost">Ghost</Button>
          <Button size="sm" arrow>
            Small
          </Button>
          <Button disabled>Disabled</Button>
          <IconButton label="Search" icon={<Search />} />
          <IconButton label="Add" icon={<Plus />} size="sm" />
          <IconButton label="Bare" icon={<Search />} variant="bare" />
          <Kbd keys={["⌘", "K"]} />
          <Kbd>/</Kbd>
          <CountBadge>14</CountBadge>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Chip>Aerospace</Chip>
          <Chip marker="sage" count={12} onClick={() => {}}>
            Manufacturers
          </Chip>
          <Chip marker="slate" selected onClick={() => {}}>
            Distributors
          </Chip>
          <Chip icon={<Building2 />}>Devanahalli</Chip>
          <Chip dashed icon={<Plus />} onClick={() => {}}>
            Add filter
          </Chip>
          <ChipCount>5 phases</ChipCount>
          <ChipCount onClick={() => {}}>+3</ChipCount>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Cite ids={["S1", "S2"]} />
          <Cite ids={["S10", "S11", "S12", "S13", "WS"]} />
          <ConfidenceTag confidence="estimate" />
          <ConfidenceTag confidence="industry-example" />
          <ConfidenceTag confidence="session" />
          <ConfidenceTag confidence="calc" />
          <ConfidenceTag confidence="rules" />
          <ConfidenceTag confidence="reported" showReported />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm">Tooltip</Button>
            </TooltipTrigger>
            <TooltipContent>Plain one-line tooltip.</TooltipContent>
          </Tooltip>
        </div>
      </Section>

      <Section title="Tabs">
        <TabTrack
          label="Metric"
          value={tab}
          onChange={setTab}
          options={[
            { value: "revenue", label: "Revenue" },
            { value: "orders", label: "Order book" },
            { value: "mix", label: "Mix" },
          ]}
        />
        <Tabs defaultValue="a" className="mt-8">
          <TabsList>
            <TabsTrigger value="a">shadcn tabs</TabsTrigger>
            <TabsTrigger value="b">Second</TabsTrigger>
          </TabsList>
          <TabsContent value="a" className="t-body-md text-body">
            First panel.
          </TabsContent>
          <TabsContent value="b" className="t-body-md text-body">
            Second panel.
          </TabsContent>
        </Tabs>
      </Section>

      <Section title="Stats">
        <StatRow>
          {[
            { label: "REVENUE FY26", value: "485", unit: "₹ Cr", caption: "Revenue", sub: "+87% year on year" },
            { label: "EBITDA", value: "62", unit: "₹ Cr", caption: "Operating profit", sub: "Sample" },
            { label: "MARGIN", value: "12.8", unit: "%", caption: "EBITDA margin", sub: "Sample" },
            { label: "HEADCOUNT", value: null, caption: "Employees", sub: "Not disclosed" },
          ].map((s, k) => (
            <Stat key={k} {...s} selected={selected === k} onClick={() => setSelected(k)} meta={k === 0 ? <Cite ids={["S1"]} /> : undefined} />
          ))}
        </StatRow>
        <Card className="mt-6" index="02" title="Hero figure">
          <Stat size="xl" label="ORDER BOOK" value="900" unit="₹ Cr" caption="Order book, latest" sub="Sample value" meta={<ConfidenceTag confidence="estimate" />} />
        </Card>
      </Section>

      <Section title="Cards">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card index="01" icon={<Building2 />} title="Card with header" action={<Button size="sm" arrow>Open</Button>}>
            <p className="t-headline-lg">One statement leads the card.</p>
            <CardNested className="mt-6">
              <p className="t-body-md text-body">Nested container on surface-raised.</p>
            </CardNested>
          </Card>
          <Card title="Card with nested doors" action={<Button size="sm" arrow onClick={() => setOpen(true)}>Open</Button>}>
            <p className="t-body-md text-body">Every card is a door; a clickable card never holds other buttons.</p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <CardNested onClick={() => setOpen(true)}>Nested door</CardNested>
              <CardNested selected>Selected</CardNested>
            </div>
          </Card>
        </div>
      </Section>

      <Section title="Charts">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ChartFrame
            title="Revenue"
            subtitle="Each bar is one financial year; the highlighted bar is the latest."
            footer={
              <>
                <Legend items={[{ label: "Past", tone: "past" }, { label: "Current", tone: "primary" }]} />
                <Cite ids={["S1"]} />
              </>
            }
          >
            <BarChart
              ariaLabel="Sample revenue by year"
              data={[
                { label: "FY23", value: 180 },
                { label: "FY24", value: 205 },
                { label: "FY25", value: 259 },
                { label: "FY26", value: 485 },
                { label: "H1 FY27", value: null },
              ]}
            />
          </ChartFrame>
          <ChartFrame title="Mix" subtitle="Longer bars mean a larger share of revenue.">
            <div className="space-y-6">
              <HBar label="Aerospace" value={70} display="70%" />
              <HBar label="Defence" value={25} display="25%" muted />
              <HBar label="Semiconductor" value={5} display="5%" muted />
            </div>
          </ChartFrame>
          <ChartFrame title="Heat map" subtitle="Whiter cells are higher; a dash means no data.">
            <div className="grid grid-cols-3 gap-2">
              {[12, 40, 75, 98, null, 55].map((v, k) => (
                <HeatCell key={k} value={v ?? undefined} name={`Cell ${k + 1}`} level={heatLevel(v, 0, 100)} />
              ))}
            </div>
          </ChartFrame>
          <ChartFrame title="Segments" subtitle="Width shows each stage's share of lead time.">
            <SegmentBar
              segments={[
                { label: "Quote", value: 2, display: "2 wk" },
                { label: "Procure", value: 8, display: "8 wk" },
                { label: "Build", value: 4, display: "4 wk" },
                { label: "Test & ship", value: 1, display: "1 wk" },
              ]}
            />
          </ChartFrame>
        </div>
        <ChartFrame className="mt-6" title="Status track" subtitle="The highlighted dot is where we are today.">
          <StatusTrack
            current={2}
            steps={[
              { label: "Founded", sub: "2011" },
              { label: "Demerger", sub: "2023" },
              { label: "Listed", sub: "Dec 2024" },
              { label: "15 years", sub: "Nov 2026" },
            ]}
          />
        </ChartFrame>
        <div className="mt-6">
          <Legend
            items={[
              { label: "Active", tone: "primary", count: 12 },
              { label: "Dormant", tone: "past", count: 4 },
              { label: "At risk", shape: "hatch", count: 1 },
              { label: "Ended", shape: "hollow", count: 2 },
              { label: "Plant", tone: "sage", shape: "diamond" },
            ]}
          />
        </div>
      </Section>

      <Section title="Key–value rows, table, scroll area">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card title="Key–value rows">
            <KeyValueRows
              rows={[
                { label: "Registered office", value: "Kolkata", meta: <Cite ids={["S3"]} /> },
                { label: "Plants", value: 2 },
                { label: "Floor area", value: "1,20,000 sq ft", meta: <ConfidenceTag confidence="estimate" /> },
                { label: "Headcount", value: null },
                { label: "Clickable row", value: "Open", onClick: () => setOpen(true) },
              ]}
            />
          </Card>
          <Card title="Table">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>FIELD</TableHead>
                  <TableHead>TYPE</TableHead>
                  <TableHead className="text-right">ROWS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  ["MPN", "string", 1200],
                  ["Qty per", "number", 840],
                  ["Revision", "string", 96],
                ].map(([a, b, c]) => (
                  <TableRow key={String(a)}>
                    <TableCell className="text-on-surface">{a}</TableCell>
                    <TableCell className="t-mono-sm">{b}</TableCell>
                    <TableCell className="text-right tnum">{c}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <ScrollArea className="mt-6 h-32 rounded-lg border border-border">
              <div className="space-y-2 p-4">
                {Array.from({ length: 12 }, (_, k) => (
                  <p key={k} className="t-body-sm text-body">
                    Scrollable line {k + 1}
                  </p>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </div>
      </Section>

      <Section title="Reveal + detail overlay">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {people.map((p, k) => (
            <Reveal key={p} delay={k * 0.06}>
              <Card
                onClick={() => {
                  setI(k);
                  setOpen(true);
                }}
              >
                <p className="t-mono-sm text-muted">0{k + 1}</p>
                <p className="mt-3 t-body-lg">{p}</p>
              </Card>
            </Reveal>
          ))}
        </div>
        <DetailOverlay
          open={open}
          onOpenChange={setOpen}
          eyebrow="Leadership"
          title={people[i]}
          description="One-line description of the entity in plain English."
          index={i}
          total={people.length}
          onPrev={() => setI((i - 1 + people.length) % people.length)}
          onNext={() => setI((i + 1) % people.length)}
        >
          <KeyValueRows
            rows={[
              { label: "Function", value: "Sample" },
              { label: "Based in", value: "Bengaluru" },
            ]}
          />
        </DetailOverlay>
      </Section>

      <Section title="Photo cards">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <PhotoCard asset="harness-board" />
          <PhotoCard asset="fa18-harness-install" />
        </div>
        <PhotoStrip className="mt-12" label="Programs Rossell supplies" assets={PROGRAM_PHOTOS} />
      </Section>
    </main>
  );
}
