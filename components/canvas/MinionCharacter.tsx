"use client";

import { forwardRef, useRef } from "react";
import { useFrame, type ThreeElements } from "@react-three/fiber";
import type { Group } from "three";

const SCALE = 0.16;

type MinionCharacterProps = ThreeElements["group"] & { idlePhase?: number };

/**
 * Generic "little yellow worker" mascot — capsule body, plain dot eyes, simple
 * blue overalls. Deliberately an original, generic silhouette rather than a
 * reproduction of any specific copyrighted character design: the reference art
 * supplied for this task was a detailed render of a recognizable, copyrighted
 * movie character (Illumination/Universal), which isn't something to freehand
 *-recreate for a public site. This shares only the general "small yellow
 * helper" shape language — no goggles, no franchise-specific proportions/details.
 */
const MinionCharacter = forwardRef<Group, MinionCharacterProps>(function MinionCharacter(
  { idlePhase = 0, ...groupProps },
  forwardedRef
) {
  const bobRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!bobRef.current) return;
    const t = clock.getElapsedTime() * 5 + idlePhase;
    bobRef.current.rotation.z = Math.sin(t) * 0.08;
    bobRef.current.position.y = Math.sin(t * 2) * 0.015;
  });

  return (
    <group ref={forwardedRef} scale={SCALE} {...groupProps}>
      <group ref={bobRef}>
        {/* body — tall rounded capsule, no separate head/neck */}
        <mesh castShadow position={[0, 0.75, 0]}>
          <capsuleGeometry args={[0.32, 0.85, 6, 12]} />
          <meshStandardMaterial color="#f2c94c" roughness={0.5} metalness={0.05} />
        </mesh>

        {/* overalls — simple blue block over the lower body */}
        <mesh castShadow position={[0, 0.45, 0.24]}>
          <boxGeometry args={[0.5, 0.55, 0.18]} />
          <meshStandardMaterial color="#2f5fd6" roughness={0.6} />
        </mesh>

        {/* eyes — plain dots, not goggles */}
        <mesh position={[-0.13, 1.25, 0.3]}>
          <sphereGeometry args={[0.055, 12, 12]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        <mesh position={[0.13, 1.25, 0.3]}>
          <sphereGeometry args={[0.055, 12, 12]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>

        {/* arms */}
        <mesh castShadow position={[-0.4, 0.7, 0]} rotation={[0, 0, 0.3]}>
          <capsuleGeometry args={[0.09, 0.45, 4, 8]} />
          <meshStandardMaterial color="#f2c94c" roughness={0.5} />
        </mesh>
        <mesh castShadow position={[0.4, 0.7, 0]} rotation={[0, 0, -0.3]}>
          <capsuleGeometry args={[0.09, 0.45, 4, 8]} />
          <meshStandardMaterial color="#f2c94c" roughness={0.5} />
        </mesh>

        {/* legs */}
        <mesh castShadow position={[-0.14, 0.12, 0]}>
          <capsuleGeometry args={[0.1, 0.22, 4, 8]} />
          <meshStandardMaterial color="#2f5fd6" roughness={0.6} />
        </mesh>
        <mesh castShadow position={[0.14, 0.12, 0]}>
          <capsuleGeometry args={[0.1, 0.22, 4, 8]} />
          <meshStandardMaterial color="#2f5fd6" roughness={0.6} />
        </mesh>

        {/* shoes */}
        <mesh castShadow position={[-0.14, -0.03, 0.05]}>
          <boxGeometry args={[0.18, 0.1, 0.24]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.7} />
        </mesh>
        <mesh castShadow position={[0.14, -0.03, 0.05]}>
          <boxGeometry args={[0.18, 0.1, 0.24]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.7} />
        </mesh>
      </group>
    </group>
  );
});

export default MinionCharacter;
