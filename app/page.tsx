import Header from "@/components/layout/Header";
import SideLogo from "@/components/layout/SideLogo";
import SceneCanvas from "@/components/canvas/SceneCanvas";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black">
      <SceneCanvas />
      <Header />
      <SideLogo />
    </main>
  );
}
