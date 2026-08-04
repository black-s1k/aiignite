import { Hero } from "@/components/sections/Hero";
import { Problem } from "@/components/sections/Problem";
import { Tracks } from "@/components/sections/Tracks";
import { Forge } from "@/components/sections/Forge";
import { Spark } from "@/components/sections/Spark";
import { Schedule } from "@/components/sections/Schedule";
import { Signup } from "@/components/sections/Signup";
import { Colophon } from "@/components/sections/Colophon";

export default function Home() {
  return (
    <>
      <a
        href="#why"
        className="sr-only rounded-none bg-overprint px-4 py-2 text-sm text-paper focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50"
      >
        Skip to content
      </a>

      <Hero />

      <main>
        <Problem />
        <Tracks />
        <Forge />
        <Spark />
        <Schedule />
        <Signup />
      </main>

      <Colophon />
    </>
  );
}
