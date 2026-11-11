// ⌘K items for chapter "clients". Content-only imports (this module is lazy-loaded by the palette on every page).
// hrefs: "#<anchor>" (resolved to the owning section by lib/searchCatalog) or a full "/clients/<section>#x".
import type { SearchItem } from "@/lib/searchIndex";
import { clients, programs, DOMAIN_LABEL } from "@/content/clients";

export const searchItems: SearchItem[] = [
  ...clients.map((c) => ({
    id: `client:${c.id}`,
    label: c.name,
    group: "Clients",
    hint: c.domain.map((d) => DOMAIN_LABEL[d]).join(" · "),
    keywords: [...(c.programs ?? []), c.country ?? "", c.wordmark],
    href: "#clients-wall",
    open: { type: "client", id: c.id },
  })),
  ...programs.map((p) => ({
    id: `program:${p.id}`,
    label: `${p.name} · ${p.what}`,
    group: "Programs",
    hint: clients.find((c) => c.id === p.customer)?.wordmark,
    href: "#clients-programs",
    open: { type: "client", id: p.customer },
  })),
  { id: "clients:mapping", label: "Clients, services and financials", group: "Clients", hint: "Diagram and table", href: "#clients-mapping", keywords: ["value", "revenue share", "Boeing 40%"] },
  { id: "clients:matrix", label: "Clients and services matrix", group: "Clients", hint: "Who buys what", href: "#clients-matrix", keywords: ["services"] },
];
