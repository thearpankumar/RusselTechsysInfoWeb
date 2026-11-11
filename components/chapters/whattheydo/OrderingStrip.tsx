"use client";

// One-line ordering pattern for each domain: small mono chips joined by hairlines, sitting under the domain photo.
// 64px tall, monochrome (DESIGN.md: progress/status tracks, 1px lines, 8–10px markers). Draws once on view;
// with reduced motion it renders finished.
import * as React from "react";
import { motion, useInView } from "motion/react";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import type { Domain } from "@/content/types-extra";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

type Anim = { on: boolean; reduce: boolean };

function Pill({
  children,
  strong,
}: {
  children: React.ReactNode;
  strong?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-7 shrink-0 items-center whitespace-nowrap rounded-full border px-3 t-mono-sm",
        strong
          ? "border-chart-past bg-surface-raised text-on-surface"
          : "border-border text-body",
      )}
    >
      {children}
    </span>
  );
}

/** A 1px line that draws from the left. `dotted` = fixed dates; `lit` = white (progress so far). */
function Line({
  a,
  delay = 0,
  dotted,
  lit,
  className,
  style,
}: {
  a: Anim;
  delay?: number;
  dotted?: boolean;
  lit?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <motion.span
      aria-hidden
      className={cn(
        "absolute top-1/2 block origin-left",
        dotted
          ? "h-0 border-t border-dotted border-chart-mid"
          : cn("h-px", lit ? "bg-on-surface" : "bg-chart-past"),
        className,
      )}
      style={style}
      initial={{ scaleX: a.reduce ? 1 : 0 }}
      animate={a.on ? { scaleX: 1 } : {}}
      transition={{ duration: 0.2, ease: EASE, delay: a.reduce ? 0 : delay }}
    />
  );
}

/** A stop on the track: marker centred on the line, optional value above and label below. */
function Stop({
  a,
  x,
  i,
  top,
  bottom,
  marker,
}: {
  a: Anim;
  x: number;
  i: number;
  top?: string;
  bottom?: string;
  marker: React.ReactNode;
}) {
  return (
    <motion.span
      className="absolute inset-y-0 flex -translate-x-1/2 flex-col items-center justify-between"
      style={{ left: `${x}%` }}
      initial={{ opacity: a.reduce ? 1 : 0 }}
      animate={a.on ? { opacity: 1 } : {}}
      transition={{
        duration: 0.2,
        ease: EASE,
        delay: a.reduce ? 0 : 0.2 + i * 0.08,
      }}
    >
      <span className="t-mono-sm whitespace-nowrap text-on-surface">
        {top ?? " "}
      </span>
      {marker}
      <span className="t-mono-sm whitespace-nowrap text-muted">
        {bottom ?? " "}
      </span>
    </motion.span>
  );
}

const dot = <span className="block size-2 rounded-full bg-on-surface" />;
const ring = (
  <span className="block size-2.5 rounded-full border border-chart-mid bg-surface" />
);
const diamond = (done: boolean) => (
  <span
    className={cn(
      "block size-2 rotate-45",
      done ? "bg-on-surface" : "border border-chart-mid bg-surface",
    )}
  />
);

// Semiconductor forecast: fluctuating, rising. Yesterday's download (dashed) vs today's (solid).
const TODAY =
  "M0 26 L10 22 L20 24 L30 17 L40 19 L50 13 L60 15 L70 9 L80 11 L90 6 L100 4";
const YESTERDAY =
  "M0 27 L10 25 L20 20 L30 21 L40 15 L50 17 L60 12 L70 13 L80 8 L90 9 L100 7";

const LABEL: Record<Domain["shape"], string> = {
  "one-po-many-schedules":
    "One PO with three schedule lines: 200 in January, 500 in March, 300 in June.",
  "many-pos-one-schedule":
    "Five POs roll into one schedule; the customer forecast is downloaded daily and changes every day.",
  "scheduled-deliveries":
    "A program schedule with fixed delivery dates every quarter.",
  "project-based":
    "One multi-year project paid against milestones M1 to M4; two reached.",
};

export function OrderingStrip({
  shape,
  className,
}: {
  shape: Domain["shape"];
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotionSafe();
  const a: Anim = { on: inView || reduce, reduce };

  let body: React.ReactNode;
  if (shape === "one-po-many-schedules") {
    const stops = [
      { x: 18, q: "200", m: "Jan" },
      { x: 52, q: "500", m: "Mar" },
      { x: 86, q: "300", m: "Jun" },
    ];
    body = (
      <>
        <Pill strong>1 PO</Pill>
        <span className="relative h-full min-w-0 flex-1">
          <Line a={a} className="inset-x-0" />
          {stops.map((s, i) => (
            <Stop
              key={s.m}
              a={a}
              x={s.x}
              i={i}
              top={s.q}
              bottom={s.m}
              marker={dot}
            />
          ))}
        </span>
      </>
    );
  } else if (shape === "many-pos-one-schedule") {
    const ys = [4, 10, 16, 22, 28];
    body = (
      <>
        <span className="flex h-full shrink-0 flex-col items-start justify-between">
          <span className="t-mono-sm text-on-surface">5 POs</span>
          <svg
            viewBox="0 0 40 32"
            className="h-8 w-10 overflow-visible"
            aria-hidden
          >
            {ys.map((y, i) => (
              <g key={y}>
                <motion.circle
                  cx={2}
                  cy={y}
                  r={2}
                  className="fill-on-surface"
                  initial={{ opacity: a.reduce ? 1 : 0 }}
                  animate={a.on ? { opacity: 1 } : {}}
                  transition={{
                    duration: 0.2,
                    ease: EASE,
                    delay: a.reduce ? 0 : i * 0.05,
                  }}
                />
                <motion.path
                  d={`M4 ${y} C 22 ${y}, 24 16, 40 16`}
                  className="fill-none stroke-chart-mid"
                  strokeWidth={1}
                  initial={{ pathLength: a.reduce ? 1 : 0 }}
                  animate={a.on ? { pathLength: 1 } : {}}
                  transition={{
                    duration: 0.2,
                    ease: EASE,
                    delay: a.reduce ? 0 : 0.1 + i * 0.05,
                  }}
                />
              </g>
            ))}
          </svg>
          <span className="t-mono-sm text-muted">&nbsp;</span>
        </span>
        <Pill strong>1 schedule</Pill>
        <span className="flex h-full min-w-0 flex-1 flex-col justify-between">
          <span className="t-mono-sm whitespace-nowrap text-muted">
            <span className="hidden sm:inline">forecast · </span>daily
          </span>
          <span className="relative block h-8 w-full">
            <svg
              viewBox="0 0 100 32"
              preserveAspectRatio="none"
              className="absolute inset-0 size-full"
              aria-hidden
            >
              <path
                d={YESTERDAY}
                className="fill-none stroke-chart-past"
                strokeWidth={1}
                strokeDasharray="3 3"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            {/* Today's forecast reveals left to right (a clip, so the stroke stays 1.25px at any width). */}
            <motion.svg
              viewBox="0 0 100 32"
              preserveAspectRatio="none"
              className="absolute inset-0 size-full"
              aria-hidden
              initial={{
                clipPath: a.reduce ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
              }}
              animate={a.on ? { clipPath: "inset(0 0% 0 0)" } : {}}
              transition={{
                duration: 0.6,
                ease: EASE,
                delay: a.reduce ? 0 : 0.35,
              }}
            >
              <path
                d={TODAY}
                className="fill-none stroke-on-surface"
                strokeWidth={1.25}
                vectorEffect="non-scaling-stroke"
              />
            </motion.svg>
          </span>
          <span className="t-mono-sm text-muted">&nbsp;</span>
        </span>
      </>
    );
  } else if (shape === "scheduled-deliveries") {
    const qs = ["Q1", "Q2", "Q3", "Q4", "Q1", "Q2"];
    body = (
      <>
        <Pill strong>Program</Pill>
        <span className="relative h-full min-w-0 flex-1">
          <span className="absolute left-0 top-0 t-mono-sm whitespace-nowrap text-muted">
            fixed<span className="hidden sm:inline"> delivery</span> dates
          </span>
          <Line a={a} dotted className="inset-x-0" />
          {qs.map((q, i) => (
            <Stop
              key={i}
              a={a}
              x={8 + i * 16.8}
              i={i}
              bottom={q}
              marker={i < 2 ? dot : ring}
            />
          ))}
        </span>
      </>
    );
  } else {
    const ms = [16, 42, 68, 92];
    body = (
      <>
        <Pill strong>1 project</Pill>
        <span className="relative h-full min-w-0 flex-1">
          <span className="absolute left-0 top-0 t-mono-sm whitespace-nowrap text-muted">
            milestones<span className="hidden sm:inline"> · multi-year</span>
          </span>
          <Line a={a} className="inset-x-0" />
          <Line
            a={a}
            lit
            delay={0.15}
            className="left-0"
            style={{ width: `${ms[1]}%` }}
          />
          {ms.map((x, i) => (
            <Stop
              key={x}
              a={a}
              x={x}
              i={i}
              bottom={`M${i + 1}`}
              marker={diamond(i < 2)}
            />
          ))}
        </span>
      </>
    );
  }

  return (
    <div
      ref={ref}
      role="img"
      aria-label={LABEL[shape]}
      className={cn(
        "pointer-events-none flex h-16 items-center gap-3",
        className,
      )}
    >
      {body}
    </div>
  );
}
