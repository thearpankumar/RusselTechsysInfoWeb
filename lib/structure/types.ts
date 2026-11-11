// Act → Chapter (page) → Section (route /<chapter>/<section>) → Sub-section (#anchor inside the section).

export interface SubsectionDef {
  /** DOM id inside the section (used as #anchor and for in-section chips). Must be unique on the page. */
  id: string;
  label: string;
}

export interface SectionDef {
  /** URL segment: /<chapter>/<id>. Lowercase, hyphenated. */
  id: string;
  /** Short label for tabs, the rail and chips ("Revenue"). */
  label: string;
  /** Statement headline for the section view (sentence case, may end with a full stop). */
  statement: string;
  /** One-line purpose under the statement. */
  purpose: string;
  subsections: SubsectionDef[];
  /** Extra DOM ids that live in this section (old anchors), so search/deep links resolve here. */
  anchors?: string[];
}
