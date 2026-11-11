import { SmoothScroll } from "@/components/journey/SmoothScroll";
import { JourneyProvider } from "@/components/journey/JourneyProvider";
import { ChapterRail } from "@/components/journey/ChapterRail";
import { JourneyMain } from "@/components/journey/JourneyMain";

// Shared frame for the hub and every chapter section: rail, command palette, keyboard navigation.
export default function JourneyLayout({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScroll>
      <JourneyProvider>
        <ChapterRail />
        <JourneyMain>{children}</JourneyMain>
      </JourneyProvider>
    </SmoothScroll>
  );
}
