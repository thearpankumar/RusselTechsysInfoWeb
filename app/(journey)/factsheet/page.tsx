import type { Metadata } from "next";
import { FactSheet } from "@/components/journey/FactSheet";

export const metadata: Metadata = { title: "Fact sheet" };

// One-page printable summary of key figures with sources (print stylesheet via Tailwind print: variants).
export default function FactSheetPage() {
  return <FactSheet />;
}
