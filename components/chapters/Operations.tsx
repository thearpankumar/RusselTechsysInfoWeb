"use client";

// 12 · How Rossell runs: lifecycle, drawing to cash, planning, workflows, systems and follow-up, rules and roles,
// and the glossary. Knowledge only.
import * as React from "react";
import { ChapterShell } from "@/components/journey/ChapterShell";
import { Section } from "@/components/journey/Section";
import { Eyebrow } from "@/components/ui-rt";
import { workflows } from "@/content/lifecycle";
import { useSearchOpen } from "@/lib/searchIndex";
import { useIndexOverlay } from "./anatomy/shared";
import { ActorsMap } from "./operations/ActorsMap";
import { BomRules } from "./operations/BomRules";
import { FollowUpLoop } from "./operations/FollowUpLoop";
import { Glossary } from "./operations/Glossary";
import { LifecycleFlow } from "./operations/LifecycleFlow";
import { NetDemandCalculator } from "./operations/NetDemandCalculator";
import { PipelineTrack } from "./operations/PipelineTrack";
import { PlanningParameters } from "./operations/PlanningParameters";
import { RequestToCash } from "./operations/RequestToCash";
import { SystemsMap } from "./operations/SystemsMap";
import { WorkflowOverlay, WorkflowsBoard } from "./operations/WorkflowsBoard";

/** One sub-section block. Title only when the section holds more than one block (the shell header names single ones). */
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

export default function Operations() {
  const wf = useIndexOverlay(workflows);
  const openWf = wf.open;
  useSearchOpen("workflow", React.useCallback((id: string) => openWf(id), [openWf]));

  return (
    <ChapterShell
      id="operations"
      statement="How Rossell runs, from a drawing to a delivered wire bundle."
      lead="Seven stages, eight planning steps, eleven parameters and twenty workflows, as we heard them in the working sessions and read them in the business rules. Every block opens deeper."
    >
      <Section id="overview">
        <Block id="operations-lifecycle" eyebrow="Business lifecycle" title="Seven stages, from the customer's requirement to reconciled cash." lead="Each stage lists its sub-steps in order; the last one is what the stage hands on. Open a stage to see its workflows.">
          <LifecycleFlow openWorkflow={wf.open} />
        </Block>
      </Section>

      <Section id="flow">
        <Block id="operations-pipeline" eyebrow="Drawing to delivered" title="Eight steps turn a drawing into a kitted, built and shipped wire bundle." lead="The track walks through the steps once; select any step to hold it.">
          <PipelineTrack />
        </Block>
        <Block id="operations-cash" eyebrow="Request to cash" title="Two purchase orders in play, and one purchase order can carry many invoices.">
          <RequestToCash />
        </Block>
      </Section>

      <Section id="planning">
        <Block id="operations-net-demand">
          <NetDemandCalculator />
        </Block>
        <Block id="operations-parameters" eyebrow="Planning parameters" title="Eleven numbers every planning decision depends on.">
          <PlanningParameters />
        </Block>
      </Section>

      <Section id="workflows">
        <Block id="operations-workflows" lead="Each card is one recurring piece of work; the stripe colour is its phase, the dot shows whether the working sessions covered it.">
          <WorkflowsBoard overlay={wf} />
        </Block>
      </Section>

      <Section id="systems">
        <Block id="operations-systems" eyebrow="Systems" title="One system of record, a morning report, and Excel and email in between.">
          <SystemsMap />
        </Block>
        <Block id="operations-loop" eyebrow="Supplier follow-up" title="The loop the buying team runs every day.">
          <FollowUpLoop />
        </Block>
      </Section>

      <Section id="rules">
        <Block id="operations-rules" eyebrow="Engineering and BOM rules" title="One bill of materials (BOM) per finished good and plant; the revision that applies is resolved by date.">
          <BomRules />
        </Block>
        <Block id="operations-actors" eyebrow="Actors" title="Customers, Rossell teams, suppliers, and the systems around them.">
          <ActorsMap />
        </Block>
      </Section>

      <Section id="glossary">
        <Block id="operations-glossary" lead="Twelve everyday terms from the sessions, plus the wider vocabulary. Every term is also in search.">
          <Glossary />
        </Block>
      </Section>

      <WorkflowOverlay overlay={wf} />
    </ChapterShell>
  );
}
