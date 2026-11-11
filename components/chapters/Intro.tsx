// Hub ("/"): the title card with the dot-matrix globe, then the non-linear journey map (acts → chapters → sections).
import { getLandMask } from "./intro/landMask";
import { IntroBody } from "./intro/IntroBody";
import { JourneyMap } from "./intro/JourneyMap";

export default function Intro() {
  const mask = getLandMask();
  return (
    <>
      <section id="intro" aria-labelledby="intro-title" className="relative isolate overflow-clip px-6 pt-12 pb-16 sm:px-12 lg:px-16 lg:pt-16">
        <header className="max-w-4xl">
          <p className="flex items-center gap-3 t-label-caps text-muted">
            <span>Prepared by Talencia Global for Rossell Techsys</span>
          </p>
          <h1 id="intro-title" className="mt-6 block max-w-4xl t-headline-display text-on-surface">
            Rossell Techsys, as we understand it.
          </h1>
          <p className="mt-6 max-w-3xl t-body-lg text-body">
            A Bengaluru contract manufacturer that builds the wiring inside US defence aircraft, and increasingly inside chip-making tools and satellites. Fifteen years, seen from the outside in.
          </p>
        </header>
        <div className="mt-12 lg:mt-16">
          <IntroBody mask={mask} />
        </div>
      </section>
      <JourneyMap />
    </>
  );
}
