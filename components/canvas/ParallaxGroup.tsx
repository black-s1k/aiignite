"use client";

import { useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, MathUtils } from "three";
import { pointerStore } from "@/hooks/useMouseParallax";

type ParallaxGroupProps = {
  children: ReactNode;
  positionStrength?: number;
  tiltStrength?: number;
  /** damp() decay constant — higher settles faster. Frame-rate independent, unlike a fixed-factor lerp. */
  lambda?: number;
};

/**
 * Wrap an element's content in this to get the "tilt/shift toward the cursor"
 * requirement. Reads the pointer position imperatively from pointerStore
 * (hooks/useMouseParallax.ts) every frame rather than subscribing reactively,
 * so mouse movement never triggers a React re-render — only direct Object3D
 * mutation via THREE.MathUtils.damp.
 */
export default function ParallaxGroup({
  children,
  positionStrength = 0.35,
  tiltStrength = 0.12,
  lambda = 4,
}: ParallaxGroupProps) {
  const ref = useRef<Group>(null);

  useFrame((_, delta) => {
    const group = ref.current;
    if (!group) return;
    const { x, y } = pointerStore.getState();
    group.position.x = MathUtils.damp(group.position.x, x * positionStrength, lambda, delta);
    group.position.y = MathUtils.damp(group.position.y, y * positionStrength * 0.5, lambda, delta);
    group.rotation.y = MathUtils.damp(group.rotation.y, x * tiltStrength, lambda, delta);
    group.rotation.x = MathUtils.damp(group.rotation.x, -y * tiltStrength, lambda, delta);
  });

  return <group ref={ref}>{children}</group>;
}
