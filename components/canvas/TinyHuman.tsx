"use client";

import { forwardRef, useRef } from "react";
import { useFrame, type ThreeElements } from "@react-three/fiber";
import type { Group } from "three";
import { HUMAN_MATERIAL_PROPS, PLACEHOLDER_COLORS } from "@/lib/three/materials";

const SCALE = 0.14;

type TinyHumanProps = ThreeElements["group"] & { idlePhase?: number };

/**
 * Shared "dumb" placeholder human — a capsule torso, sphere head, and four limb
 * boxes with a continuous idle bob driven by useFrame (unbounded motion belongs
 * in useFrame, not GSAP — see SKILL.md). Each brand element owns the *choreography*
 * (where/how this is positioned over time) via its own GSAP timeline on the ref
 * this component forwards. Accepts standard group props (position, rotation, ...)
 * so callers can place it directly without an extra wrapping group.
 */
const TinyHuman = forwardRef<Group, TinyHumanProps>(function TinyHuman(
  { idlePhase = 0, ...groupProps },
  forwardedRef
) {
  const bobRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!bobRef.current) return;
    const t = clock.getElapsedTime() * 4 + idlePhase;
    bobRef.current.position.y = Math.sin(t) * 0.02;
    bobRef.current.rotation.z = Math.sin(t * 0.5) * 0.05;
  });

  return (
    <group ref={forwardedRef} scale={SCALE} {...groupProps}>
      <group ref={bobRef}>
        {/* torso */}
        <mesh castShadow position={[0, 0.9, 0]}>
          <capsuleGeometry args={[0.28, 0.55, 4, 8]} />
          <meshStandardMaterial {...HUMAN_MATERIAL_PROPS} />
        </mesh>
        {/* head */}
        <mesh castShadow position={[0, 1.55, 0]}>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial {...HUMAN_MATERIAL_PROPS} color={PLACEHOLDER_COLORS.humanAccent} />
        </mesh>
        {/* arms */}
        <mesh castShadow position={[-0.42, 0.95, 0]} rotation={[0, 0, 0.35]}>
          <boxGeometry args={[0.14, 0.55, 0.14]} />
          <meshStandardMaterial {...HUMAN_MATERIAL_PROPS} />
        </mesh>
        <mesh castShadow position={[0.42, 0.95, 0]} rotation={[0, 0, -0.35]}>
          <boxGeometry args={[0.14, 0.55, 0.14]} />
          <meshStandardMaterial {...HUMAN_MATERIAL_PROPS} />
        </mesh>
        {/* legs */}
        <mesh castShadow position={[-0.16, 0.25, 0]}>
          <boxGeometry args={[0.16, 0.55, 0.16]} />
          <meshStandardMaterial {...HUMAN_MATERIAL_PROPS} color={PLACEHOLDER_COLORS.humanAccent} />
        </mesh>
        <mesh castShadow position={[0.16, 0.25, 0]}>
          <boxGeometry args={[0.16, 0.55, 0.16]} />
          <meshStandardMaterial {...HUMAN_MATERIAL_PROPS} color={PLACEHOLDER_COLORS.humanAccent} />
        </mesh>
      </group>
    </group>
  );
});

export default TinyHuman;
