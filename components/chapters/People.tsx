// 05 · People: leadership, board, the SCM chain we work in, designations, departments and headcount.
import { ChapterShell } from "@/components/journey/ChapterShell";
import { PeopleBody } from "./people/PeopleBody";

export default function People() {
  return (
    <ChapterShell
      id="people"
      statement="A promoter-led board, a new operating team, and a workforce growing faster than its floor space."
      lead="The leadership bench was largely rebuilt between 2020 and 2025 with people from Boeing, Collins, GE, Sanmina and Cyient. We work inside supply chain management, from the VP down to the buyers."
    >
      <PeopleBody />
    </ChapterShell>
  );
}
