import { notFound, redirect } from "next/navigation";
import { chapters, isChapterId } from "@/lib/journeyChapters";
import { sectionHref, sectionsOf } from "@/lib/structure";

export const dynamicParams = false;

export function generateStaticParams() {
  return chapters.map((c) => ({ chapter: c.id }));
}

// /<chapter> opens its first section.
export default async function ChapterIndex({ params }: { params: Promise<{ chapter: string }> }) {
  const { chapter } = await params;
  if (!isChapterId(chapter)) notFound();
  redirect(sectionHref(chapter, sectionsOf(chapter)[0].id));
}
