---
version: alpha
name: Silo Gateway of Intelligence
description: Warm near-black, monochrome, editorial data UI. White is the only emphasis colour; muted pastels are reserved for data categories.
colors:
  # Neutrals — surfaces, darkest to lightest
  canvas: "#121111"
  background: "#191818"
  surface: "#20201F"
  surface-raised: "#282727"
  border: "#393938"
  # Text
  on-surface: "#FEFDF8"
  body: "#C5C4C1"
  muted: "#9FA6AE"
  # Emphasis: inverse (warm white). Used for active / selected / current.
  primary: "#FEFDF8"
  on-primary: "#191818"
  # Chart neutrals (past periods, tracks, inactive cells)
  chart-past: "#595857"
  chart-mid: "#9F9E98"
  chart-light: "#C3C3BD"
  # Categorical data palette — data encoding ONLY
  data-sage: "#96AD95"
  data-slate: "#95A2BF"
  data-tan: "#BC9F7E"
  data-lavender: "#AB9BB9"
  data-olive: "#C0B684"
  data-teal: "#8BADAA"
  data-rose: "#B79298"
  data-moss: "#A4A97E"
typography:
  headline-display:
    fontFamily: Inter Display
    fontSize: 5.5rem
    fontWeight: 500
    lineHeight: 1
    letterSpacing: -0.045em
  headline-xl:
    fontFamily: Inter Display
    fontSize: 4rem
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: -0.04em
  metric-xl:
    fontFamily: Inter Display
    fontSize: 6rem
    fontWeight: 500
    lineHeight: 0.95
    letterSpacing: -0.05em
    fontFeature: "\"tnum\" 1"
  metric-lg:
    fontFamily: Inter Display
    fontSize: 3.25rem
    fontWeight: 500
    lineHeight: 1
    letterSpacing: -0.05em
    fontFeature: "\"tnum\" 1"
  headline-lg:
    fontFamily: Inter Display
    fontSize: 2.5rem
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: -0.035em
  headline-md:
    fontFamily: Inter Display
    fontSize: 1.75rem
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: -0.03em
  body-lg:
    fontFamily: Inter
    fontSize: 1.25rem
    fontWeight: 400
    lineHeight: 1.5
  body-md:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.45
  label-md:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: 500
    lineHeight: 1.25
  label-caps:
    fontFamily: Inter
    fontSize: 0.8125rem
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: 0.12em
  mono-sm:
    fontFamily: JetBrains Mono
    fontSize: 0.8125rem
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: 0.04em
rounded:
  sm: 6px
  md: 10px
  lg: 16px
  xl: 28px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  2xl: 32px
  3xl: 48px
  4xl: 64px
components:
  panel-recessed:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.body}"
  page:
    backgroundColor: "{colors.background}"
    textColor: "{colors.on-surface}"
  toolbar:
    backgroundColor: "{colors.background}"
    textColor: "{colors.body}"
    typography: "{typography.body-lg}"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.xl}"
    padding: 40px
  card-header:
    textColor: "{colors.on-surface}"
    typography: "{typography.body-lg}"
    height: 48px
  card-nested:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
    padding: 24px
  nav-item:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.body}"
    typography: "{typography.body-lg}"
    rounded: "{rounded.lg}"
    height: 56px
  nav-item-active:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-lg}"
    rounded: "{rounded.lg}"
    height: 56px
  tab-track:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.body}"
    rounded: "{rounded.full}"
    padding: 6px
  tab:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.body}"
    typography: "{typography.body-lg}"
    rounded: "{rounded.full}"
    height: 48px
  tab-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-lg}"
    rounded: "{rounded.full}"
    height: 48px
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-lg}"
    rounded: "{rounded.full}"
    padding: 20px
    height: 48px
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-lg}"
    rounded: "{rounded.full}"
    padding: 20px
    height: 48px
  button-icon:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.full}"
    size: 48px
  chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.full}"
    padding: 12px
    height: 40px
  chip-count:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.full}"
    padding: 12px
  search-field:
    backgroundColor: "{colors.background}"
    textColor: "{colors.muted}"
    typography: "{typography.body-lg}"
    rounded: "{rounded.lg}"
    height: 56px
  kbd:
    textColor: "{colors.muted}"
    typography: "{typography.mono-sm}"
    rounded: "{rounded.sm}"
    padding: 6px
    height: 28px
  count-badge:
    textColor: "{colors.muted}"
    typography: "{typography.mono-sm}"
    rounded: "{rounded.sm}"
    size: 28px
  eyebrow:
    textColor: "{colors.muted}"
    typography: "{typography.label-caps}"
  stat-label:
    textColor: "{colors.muted}"
    typography: "{typography.mono-sm}"
  stat-value:
    textColor: "{colors.on-surface}"
    typography: "{typography.metric-lg}"
  stat-hero:
    textColor: "{colors.on-surface}"
    typography: "{typography.metric-xl}"
  workflow-node:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 16px
  role-badge:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.on-surface}"
    typography: "{typography.mono-sm}"
    rounded: "{rounded.sm}"
    size: 24px
  logo-tile:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
    size: 96px
  heat-cell-high:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
  heat-cell-mid:
    backgroundColor: "{colors.chart-light}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
  heat-cell-low:
    backgroundColor: "{colors.chart-mid}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
  bar-current:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.sm}"
  bar-past:
    backgroundColor: "{colors.chart-past}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.sm}"
  divider:
    backgroundColor: "{colors.border}"
    height: 1px
  modal:
    backgroundColor: "{colors.background}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.xl}"
    padding: 48px
---

<!-- Design language only: tokens, visual rules and how each component LOOKS and BEHAVES.
     It deliberately does not prescribe page structure (what goes in a nav bar, which page shows what) — that is the designer's call per screen.
     Colours were pixel-sampled from the live app and are exact. Fonts, sizes, radii and spacing are estimated from screenshots; items marked [CONFIRM] need checking against the codebase. -->

## Overview

**Product brief.** Silo Gateway of Intelligence is an internal intelligence workspace that turns dense business data (company, market, clients, workflows, technology, initiatives) into calm, scannable, presentation-ready screens that people can drill into. [CONFIRM audience: leadership / strategy / sales teams]

**Personality.** Calm, editorial, precise — an annual report rendered as software. NOT playful, NOT colourful, NOT a generic "SaaS dashboard" (no gradients, glows, neon, or busy chrome).

**Principles.**
1. **Numbers are the hero.** Large, tightly tracked numerals with a short plain-English label. Chrome stays quiet.
2. **Monochrome by default; white means "this one".** Warm white (`primary`) is the only emphasis colour: active, selected, current, highest.
3. **Colour is data, never decoration.** Pastel `data-*` colours only encode categories.
4. **Everything is a door.** Figures, chips, tiles and rows are interactive and lead somewhere deeper.
5. **Keyboard-friendly.** Where a shortcut exists, show it next to its control in a `kbd`.
6. **Explain in one line.** Charts carry a one-sentence plain-language subtitle saying how to read them.

## Colors

Warm (slightly yellow/brown) near-black, not blue-grey. Never pure `#000` or `#FFF`.

**Surfaces — darkest to lightest; each nesting level steps up one:**
- **canvas (#121111):** Recessed areas that sit behind the page (e.g. a side panel).
- **background (#191818):** The page itself; also modals, inputs and toolbars.
- **surface (#20201F):** Cards and containers on the page; tab tracks; chips.
- **surface-raised (#282727):** Anything nested inside a card; selected/active rows and items; count chips.
- **border (#393938):** All 1px hairlines and outlines. Separate with borders, not shadows.

**Text:**
- **on-surface (#FEFDF8):** Headlines, numbers, primary labels, active items.
- **body (#C5C4C1):** Paragraphs and inactive labels.
- **muted (#9FA6AE):** Eyebrows, sub-labels, units, helper text, shortcut hints. This grey is slightly cool — keep it.

**Emphasis — primary (#FEFDF8) + on-primary (#191818):** inverse fill for the active tab/segment, hovered buttons, the current period in a chart, the highest value in a ramp, the current step in a progress track, logo tiles.

**Chart neutrals:** `chart-past` (previous periods, empty tracks), `chart-mid`, `chart-light` (intermediate intensities). Intensity is a grey ramp ending in white, never a hue ramp.

**Categorical palette (`data-*`):** for encoding categories only. Assign in order: sage, slate, tan, lavender, olive, teal, rose, moss. A category keeps the same colour everywhere. Use as 8–10px dots, chart marks, bubbles, 1px connector lines, 3px accent stripes, or ~25%-opacity badge tints. Never as large fills, backgrounds, text, or buttons.

**Status uses shape/fill, not hue:** solid white = active/high, grey = dormant/medium, dim = low, hatched = at risk, hollow outline = ended/churned. Always pair the marker with a text label.

**Theme:** Dark is the primary theme and the default. A light theme exists as an opt-in (rail toggle, persisted per browser); its tokens live in the `[data-theme="light"]` block of `app/theme.css` and keep the same roles: warm off-white surfaces (never `#FFF`), warm near-black emphasis, a chart ramp from light grey to near-black, and a darkened data palette. In copy, say "highlighted", not "white", for the emphasis colour.

## Typography

[CONFIRM exact families — display looks like Inter Display / a tight neo-grotesk; mono looks like JetBrains Mono.]

| Token | Use for | Never use for |
|---|---|---|
| headline-display | A single page hero statement — max once per screen | Cards, repeated titles |
| headline-xl | The title of an entity in a detail view | Lists |
| metric-xl | One dominant figure within a container — max one per container | Rows of figures |
| metric-lg | Key figures in rows or strips of stats | Body text, small counts |
| headline-lg | Statement headlines and screen/section titles | Navigation, buttons |
| headline-md | Titles of charts and content blocks | Paragraphs |
| body-lg | Lead paragraphs, navigation labels, tabs, buttons, row titles | Dense tables |
| body-md | Default UI text, chips, list rows | Headlines |
| body-sm | Sub-labels, secondary lines, chart axis/labels | Primary content |
| label-caps | Eyebrows and section kickers — ALWAYS uppercase | Sentences, anything not uppercase |
| mono-sm | Indices ("01"), stat labels, counters ("02 / 07"), keyboard keys | Prose, chart numbers |

Rules:
- Display and metric styles: weight 500 with tight negative tracking. Never bold 700.
- Numbers use tabular figures. Pair a big number with a smaller muted unit on the same baseline: **49** clients, **10.1** years, **$1M** USD.
- Sentence case everywhere except label-caps. Statement headlines may end with a full stop.
- Separate inline metadata with " · ".
- Labels under figures wrap; never truncate them. Truncate with an ellipsis only in dense lists, nodes and pills.

## Layout

Layout and page composition are open — these are the spatial rules any layout must follow.

- **Spacing:** only the spacing scale (4, 8, 12, 16, 24, 32, 48, 64px). No arbitrary values.
- **Rhythm:** 24px between sibling containers; 32–40px inside a container; 48–80px between major page sections. Generous whitespace — density comes from information, not from tight spacing.
- **Grouping:** within a container, separate sections with 1px `border` dividers and consistent vertical rhythm rather than with boxes.
- **Alignment:** left-aligned text; numbers right-aligned in rows and tables; figures and their labels share a left edge.
- **Rows of stats:** equal-width cells separated by 1px vertical borders, sitting on the page rather than inside a card.
- **Hierarchy within any container:** small label/eyebrow → large statement or figure → supporting detail. The container's own title is small; the content is what's large.

## Elevation & Depth

- Depth comes from surface steps (canvas → background → surface → surface-raised) and 1px borders — never drop shadows.
- No shadows on cards, chips, tiles or buttons.
- Overlays (modals, detail panels) sit on `background` with `rounded.xl` over the page, which is dimmed and blurred. [CONFIRM opacity/blur values.]
- Pinned/sticky regions blur and fade the content scrolling under them.

## Shapes

- **Large containers (cards, modals):** `rounded.xl` (28px) — big soft corners are part of the identity.
- **Nested containers, list items, inputs, photo cards:** `rounded.lg` (16px).
- **Tiles, heat-map cells, graph nodes, segments:** `rounded.md` (10px).
- **Keyboard keys, count badges, chart bars:** `rounded.sm` (6px).
- **Buttons, tabs, tab tracks, chips, tags, icon buttons:** `rounded.full`.
- **Icons:** thin line icons (1.5px stroke, lucide-style), 20–24px, inheriting text colour. No filled or multicolour icons.
- **Markers:** 8–10px circles; diamonds for a distinct location type.

## Components

How each component looks and behaves. Where and whether to use them is up to the screen design.

**Buttons**
- `button-secondary` is the default for actions: outline pill (1px `border`), label + optional arrow ("Open →"). Hover/focus inverts to white (`button-primary`).
- A white-filled `button-primary` at rest is reserved for a single committing action (e.g. confirming a dialog). White buttons hover to 90% opacity.
- `button-icon`: circular, outline; or a bare icon with no container when it sits in a toolbar.
- Action labels are short verbs, optionally with "→".

**Tabs & segmented controls:** a `tab-track` pill holding `tab`s; the active one is the white `tab-active`. Used to switch views; never for data.

**Chips & tags:** outline pills (fill matches the container, 1px `border`), 40px tall, 12px horizontal padding. `chip-count` (raised fill) for counts like "5 phases". Status chips lead with their status marker. A dashed outline marks an add/optional action. Overflow collapses to a "+N" chip.

**Navigation items:** label in body-lg `body`; optional mono index, line icon and right-aligned muted count. Hover = one surface step up. Active = `surface-raised` fill, `on-surface` text, optionally a 2px white indicator bar on the leading edge. Nested items are indented with a 1px `border` guide line.

**Inputs & search:** transparent fill, 1px `border`, `rounded.lg`, muted placeholder, leading search icon, trailing `kbd` hint for its shortcut.

**Keyboard keys (`kbd`) and count badges:** mono-sm, 1px `border` box, `rounded.sm`, one box per key.

**Cards:** `surface`, `rounded.xl`, 40px padding, no shadow. Header (when present) is small: optional mono index · line icon · title in body-lg · optional action on the right.

**Stats:** stat label (mono-sm or label-caps, muted) → figure (metric-lg / metric-xl) → label (body-lg `on-surface`) → sub-label (body-md `muted`). A selected stat gets a subtle `surface-raised` fade and a 2px white underline.

**Key–value rows:** label in `body` on the left, figure on the right, 1px dividers between rows.

**Tiles (logos/brands):** white `logo-tile`, `rounded.md`; inactive = dimmed grey; a small dot badge in the corner flags attention.

**Photo cards:** full-bleed photo, `rounded.lg`, name (body-lg 500) and role (body-sm `body`) over a dark bottom scrim — the only permitted gradient.

**Detail overlays:** modal on `background`, `rounded.xl`, 48px padding; counter + prev/next/close as circular icon buttons in the top-right.

**Data visualisation**
- **Bars:** past periods `chart-past`, current white; values above, period labels in mono-sm below; axis at zero; no gridlines; `rounded.sm` tops. Horizontal bars are 4px, white on a `chart-past` track, `rounded.full`.
- **Heat maps:** grey-to-white ramp (`chart-past` → `chart-mid` → `chart-light` → `primary`); value large, names small inside the cell; empty = "—".
- **Segment bars:** `surface-raised` pill segments with 1px `border`, each holding a mono index; width proportional to the value.
- **Progress / status tracks:** stops on a 1px line; current stop is a filled white dot with the line white up to it; other stops are hollow 10px circles.
- **Maps:** dot-matrix world (small dots on an even grid in `chart-past` at reduced opacity); markers in white when uncategorised, `data-*` when categorised; legend underneath with dot + label (+ count).
- **Scatter/bubble:** horizontal gridlines only (1px `border`), muted axis labels, bubbles in `data-*` at ~85% opacity with a 1px `background` outline.
- **Graphs & flows:** dot-grid canvas; nodes are `workflow-node` cards with a 3px left accent stripe in the category colour, a mono type eyebrow with icon, title and meta row; `role-badge`s tinted ~25% with their category colour; edges are 1px `chart-mid` with small arrowheads — solid = main, dashed = alternative, dotted = exception, dash-dot = loop.
- **Connection (sankey-style) diagrams:** 1px curved `data-*` connectors at ~40% opacity between outline pills / `surface` rows.
- **Legends:** dot/marker + label in body-md, optional count in `on-surface`.

**States (every interactive element):** default; hover (one surface step up, or border brightens to `chart-past`); focus-visible (2px `primary` outline, 2px offset); active/selected (white inverse for tabs/segments; `surface-raised` for items); disabled (40% opacity). Empty values show "—" in `muted`, never blank.

**Motion:** 150–200ms ease-out fades and slides. No bouncy, looping or decorative animation.

**Code mapping:** [CONFIRM framework, styling approach and component folder.] Tokens live in one theme file; components reference tokens, never raw hex values.

## Do's and Don'ts

**Do**
- Use surface steps for hierarchy and white for emphasis.
- Lead each container with one big number or one statement.
- Give charts a one-line plain-English subtitle.
- Keep a category's colour identical everywhere.
- Show shortcuts next to the controls they trigger.

**Don't**
- No gradients, glows, neon or saturated colours (exceptions: photo scrims and the selected-stat fade).
- No drop shadows.
- No `data-*` colours on buttons, text, backgrounds or chrome.
- No colour-only meaning — pair markers with labels.
- No bold (700) headlines.
- No pure black or pure white.
- No square-cornered cards; no pill radius on cards.
- Don't truncate figure labels; don't make container titles large.
- No emoji or exclamation marks; copy is plain, short, sentence case.
- No more than one white-filled button in a view at rest.
