"use client";

import { FORMATION_BOUNDS } from "@/lib/three/layout";

/**
 * Directional (not spot) key light: the formation is deliberately spread/
 * unclustered, and a directional light's orthographic shadow frustum gives even
 * coverage across the whole formation. A spotlight's cone would risk clipping
 * outlying elements or producing uneven shadow resolution across the spread.
 * The shadow-camera bounds are sized explicitly to FORMATION_BOUNDS — the default
 * frustum is small and will crop shadows if left unset.
 */
export default function LightingRig() {
  const { halfWidth, halfHeight } = FORMATION_BOUNDS;

  return (
    <>
      <ambientLight intensity={0.45} color="#ffffff" />

      <directionalLight
        castShadow
        position={[4, 6, 5]}
        intensity={1.6}
        color="#ffffff"
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-halfWidth}
        shadow-camera-right={halfWidth}
        shadow-camera-top={halfHeight}
        shadow-camera-bottom={-halfHeight}
        shadow-camera-near={0.5}
        shadow-camera-far={20}
        shadow-bias={-0.0005}
      />

      {/* dim rim/fill light from the opposite side, purely for edge separation */}
      <directionalLight position={[-5, 2, -4]} intensity={0.35} color="#9fb4ff" />
    </>
  );
}
