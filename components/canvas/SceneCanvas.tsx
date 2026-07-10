"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import Scene from "./Scene";
import { useMouseParallaxListener } from "@/hooks/useMouseParallax";
import { CAMERA_FOV, CAMERA_POSITION } from "@/lib/three/layout";

/**
 * Global background 3D layer. pointer-events must go through the `style` prop,
 * not a Tailwind className — R3F's <Canvas> sets an inline style.pointerEvents
 * = 'auto' on its own wrapper div by default, and inline styles beat stylesheet
 * classes in the cascade, so a "pointer-events-none" class here would silently
 * do nothing.
 */
export default function SceneCanvas() {
  useMouseParallaxListener();

  return (
    <Canvas
      className="fixed inset-0 z-0"
      style={{ pointerEvents: "none" }}
      gl={{ alpha: true, antialias: true }}
      shadows="variance"
      dpr={[1, 2]}
      camera={{ position: CAMERA_POSITION.toArray(), fov: CAMERA_FOV }}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}
