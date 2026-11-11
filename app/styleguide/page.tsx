import type { Metadata } from "next";
import { StyleguideClient } from "./StyleguideClient";

export const metadata: Metadata = { title: "Styleguide" };

// Visual QA for every ui-rt primitive (behind the gate).
export default function StyleguidePage() {
  return <StyleguideClient />;
}
