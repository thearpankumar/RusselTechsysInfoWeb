import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

// Inter variable with the optical-size axis: large sizes get the display cut.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Rossell Techsys, as we understand it",
    template: "%s · Rossell Techsys",
  },
  description: "Prepared by Talencia Global for Rossell Techsys.",
  applicationName: "Rossell Techsys, as we understand it",
  // Share card: app/opengraph-image.png + app/twitter-image.png (static, served outside the gate).
  openGraph: {
    type: "website",
    siteName: "Talencia Global",
    title: "Rossell Techsys, as we understand it.",
    description: "Prepared by Talencia Global for Rossell Techsys. Private, passcode required.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rossell Techsys, as we understand it.",
    description: "Prepared by Talencia Global for Rossell Techsys.",
  },
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export const viewport: Viewport = {
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable} h-full`}>
      <body className="min-h-full bg-background text-on-surface">
        <TooltipProvider delayDuration={150}>{children}</TooltipProvider>
      </body>
    </html>
  );
}
