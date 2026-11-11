import type { DataColor } from "@/lib/dataColors";
import type { WorkflowPhase } from "@/content/types-extra";

/** Workflow phase → data colour (3px accent stripes on workflow nodes). */
export const PHASE_COLOR: Record<WorkflowPhase["id"], DataColor> = {
  A: "sage",
  B: "slate",
  C: "tan",
  D: "lavender",
  E: "olive",
};
