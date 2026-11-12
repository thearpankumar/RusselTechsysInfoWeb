// Chapter 13 — Files & data dictionary: inventory, report flow, a template view per file, the data dictionary and the entity map.
import { ChapterShell } from "@/components/journey/ChapterShell";
import { DataChapter } from "./data/DataChapter";

export default function DataFiles() {
  return (
    <ChapterShell
      id="data"
      statement="Sixteen reports feed the planning floor. Seven arrived as Rossell's own column sheets."
      lead="Each morning IQMS, the enterprise resource planning (ERP) system, runs its Crystal reports, and the buyers, planners and engineers start from them. These sections cover every file: what it holds, where it comes from, who reads it and its columns as Rossell named them, with what each one means and what is still to confirm. One dictionary then ties every column, in every file, to the field it carries."
    >
      <DataChapter />
    </ChapterShell>
  );
}
