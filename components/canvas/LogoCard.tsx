"use client";

import { Suspense } from "react";
import { useTexture } from "@react-three/drei";
import { DoubleSide } from "three";
import type { Brand } from "@/lib/three/layout";
import { LOGO_PATHS } from "@/lib/three/assets";
import { PLACEHOLDER_COLORS } from "@/lib/three/materials";

type LogoCardProps = {
  brand: Brand;
  size?: [number, number];
};

function TexturedPlane({ path, size }: { path: string; size: [number, number] }) {
  const texture = useTexture(path);
  return (
    <mesh>
      <planeGeometry args={size} />
      <meshBasicMaterial map={texture} transparent side={DoubleSide} />
    </mesh>
  );
}

function PlaceholderPlane({ size }: { size: [number, number] }) {
  return (
    <mesh>
      <planeGeometry args={size} />
      <meshStandardMaterial
        color={PLACEHOLDER_COLORS.structureDark}
        wireframe
        side={DoubleSide}
      />
    </mesh>
  );
}

/**
 * Brand surface used by each element as a "plaque" for the real logo, once one is
 * supplied. A path only ever gets flipped on in LOGO_PATHS after the actual file
 * exists — see lib/three/assets.ts for why Suspense alone can't safely gate this.
 */
export default function LogoCard({ brand, size = [1, 1] }: LogoCardProps) {
  const path = LOGO_PATHS[brand];

  if (!path) {
    return <PlaceholderPlane size={size} />;
  }

  return (
    <Suspense fallback={<PlaceholderPlane size={size} />}>
      <TexturedPlane path={path} size={size} />
    </Suspense>
  );
}
