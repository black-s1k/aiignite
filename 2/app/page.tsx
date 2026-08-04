import IgniteVideoScroll from "@/components/IgniteVideoScroll";
import { Problem } from "@/components/sections/Problem";
import { Tracks } from "@/components/sections/Tracks";
import { Forge } from "@/components/sections/Forge";
import { Spark } from "@/components/sections/Spark";
import { Glance } from "@/components/sections/Glance";
import { Timeline } from "@/components/sections/Timeline";
import { Team } from "@/components/sections/Team";
import { Signup } from "@/components/sections/Signup";
import { SiteFooter } from "@/components/sections/SiteFooter";

export default function Home() {
  return (
    <>
      <a
        href="#mission"
        className="bg-accent text-bg sr-only rounded-sm px-4 py-2 text-sm font-medium focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50"
      >
        Skip to content
      </a>

      <IgniteVideoScroll />

      <main>
        <Problem />
        <Tracks />
        <Forge />
        <Spark />
        <Glance />
        <Timeline />
        <Team />
        <Signup />
      </main>

      <SiteFooter />
    </>
  );
}
