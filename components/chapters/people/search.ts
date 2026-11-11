// ⌘K items for chapter "people". Content-only imports (this module is lazy-loaded by the palette on every page).
// hrefs: "#<anchor>" (resolved to the owning section by lib/searchCatalog) or a full "/people/<section>#x".
import type { SearchItem } from "@/lib/searchIndex";
import { board, coreDepartmentIds, departments, designationLadder, latestWorkforce, people } from "@/content/people";

const deptIds = [...coreDepartmentIds, "buying", "management"] as readonly string[];
const deptList = departments.filter((d) => deptIds.includes(d.id));

export const searchItems: SearchItem[] = [
  { id: "people:workforce", label: `Workforce ${latestWorkforce.value.toLocaleString("en-IN")} people (Jun 2026)`, group: "People", hint: "05", href: "#people-headcount", keywords: ["employees", "headcount", "staff"] },
  ...people.map((p) => ({ id: `person:${p.id}`, label: p.name, group: "People", hint: p.title, href: p.group === "contact" ? "#people-org" : "#people-leadership", open: { type: "person", id: p.id }, keywords: [p.function ?? "", ...(p.previously ?? []), "LinkedIn"] })),
  ...board.filter((b) => !b.personId).map((b) => ({ id: `director:${b.id}`, label: b.name, group: "People", hint: b.designation, href: "#people-board", open: { type: "director", id: b.id }, keywords: ["board", ...b.committees] })),
  ...deptList.map((d) => ({ id: `department:${d.id}`, label: d.name, group: "Departments", hint: "People", href: "#people-departments", open: { type: "department", id: d.id }, keywords: [d.does] })),
  ...designationLadder.map((l) => ({ id: `designation:${l.rank}`, label: l.title, group: "Designations", hint: `Level ${l.rank} of ${designationLadder.length}`, href: "#people-ladder", keywords: [l.plain] })),
  { id: "people:headcount-chart", label: "Workforce over time", group: "People", hint: "05", href: "#people-workforce", keywords: ["hiring", "target 2,000"] },
];
