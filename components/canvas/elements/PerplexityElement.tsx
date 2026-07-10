"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";
import LogoCard from "../LogoCard";
import ParallaxGroup from "../ParallaxGroup";
import { FORMATION } from "@/lib/three/layout";
import { STRUCTURE_MATERIAL_PROPS } from "@/lib/three/materials";

const RING_RADII = [0.9, 1.15, 1.4] as const;

/**
 * Pristine, no-human multi-ring structure (per spec) — three concentric tori,
 * each on a different initial tilt with an independent per-axis angular
 * velocity, all driven by useFrame delta-time (continuous/unbounded motion,
 * no authored sequence needed).
 */
export default function PerplexityElement() {
  const { position, rotation, scale } = FORMATION.perplexity;
  const ringRefs = useRef<(Mesh | null)[]>([]);

  useFrame((_, delta) => {
    ringRefs.current.forEach((ring, i) => {
      if (!ring) return;
      const direction = i % 2 === 0 ? 1 : -1;
      ring.rotation.x += delta * (0.12 + i * 0.05) * direction;
      ring.rotation.y += delta * (0.18 - i * 0.03);
      ring.rotation.z += delta * (0.05 + i * 0.02) * direction;
    });
  });

  return (
    <group position={position} rotation={[rotation.x, rotation.y, rotation.z]} scale={scale}>
      <ParallaxGroup>
        {RING_RADII.map((radius, i) => (
          <mesh
            key={radius}
            ref={(el) => {
              ringRefs.current[i] = el;
            }}
            castShadow
            receiveShadow
            rotation={[i * 0.6, i * 0.3, 0]}
          >
            <torusGeometry args={[radius, 0.035, 16, 96]} />
            <meshStandardMaterial {...STRUCTURE_MATERIAL_PROPS} />
          </mesh>
        ))}

        <group position={[0, -RING_RADII[2] - 0.5, 0]}>
          <LogoCard brand="perplexity" size={[0.9, 0.35]} />
        </group>
      </ParallaxGroup>
    </group>
  );
}
