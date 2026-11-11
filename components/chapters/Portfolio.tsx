// 01 · Portfolio: who Rossell is, fifteen years of milestones, how the work arrives, approvals and awards.
import { ChapterShell } from "@/components/journey/ChapterShell";
import { PortfolioBody } from "./portfolio/PortfolioBody";

export default function Portfolio() {
  return (
    <ChapterShell
      id="portfolio"
      statement="A build-to-print specialist Boeing has twice named supplier of the year."
      lead="Rossell Techsys makes the wire harnesses, EWIS, panels and electro-mechanical assemblies that other companies design. It began as a division of the Rossell tea group, became a separate listed company in 2024, and now builds for aerospace, defence, semiconductor and space customers on three continents."
    >
      <PortfolioBody />
    </ChapterShell>
  );
}
