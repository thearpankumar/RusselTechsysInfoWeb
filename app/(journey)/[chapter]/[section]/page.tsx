import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { chapters, getChapter, isChapterId } from "@/lib/journeyChapters";
import { sectionsOf } from "@/lib/structure";
import { SectionProvider } from "@/components/journey/Section";
import { chapterComponents } from "@/components/chapters/registry";

export const dynamicParams = false;

export function generateStaticParams() {
  return chapters.flatMap((c) => sectionsOf(c.id).map((s) => ({ chapter: c.id, section: s.id })));
}

type Params = Promise<{ chapter: string; section: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { chapter, section } = await params;
  if (!isChapterId(chapter)) return {};
  const s = sectionsOf(chapter).find((x) => x.id === section);
  return { title: `${getChapter(chapter).label}${s ? ` · ${s.label}` : ""}` };
}

// One focused view per section: the chapter body renders only the routed <Section>.
export default async function SectionPage({ params }: { params: Params }) {
  const { chapter, section } = await params;
  if (!isChapterId(chapter) || !sectionsOf(chapter).some((s) => s.id === section)) notFound();
  const Body = chapterComponents[chapter];
  return (
    <SectionProvider key={`${chapter}/${section}`} chapter={chapter} section={section}>
      <Body />
    </SectionProvider>
  );
}
