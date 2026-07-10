"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { Group, Mesh } from "three";
import TinyHuman from "../TinyHuman";
import LogoCard from "../LogoCard";
import ParallaxGroup from "../ParallaxGroup";
import { FORMATION } from "@/lib/three/layout";
import { STRUCTURE_MATERIAL_PROPS } from "@/lib/three/materials";

const SPHERE_RADIUS = 0.85;
const SPIN_SPEED = 0.25; // rad/s, continuous — driven by useFrame, not GSAP

export default function ChatGptElement() {
  const { position, rotation, scale } = FORMATION.chatgpt;
  const sphereRef = useRef<Mesh>(null);
  const humanRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += delta * SPIN_SPEED;
    }
  });

  useGSAP(() => {
    if (!humanRef.current) return;
    // Static "running in place" loop: a quick bob + lean, with zero net
    // translation, so the human always reads as fixed on top of the sphere no
    // matter how far the sphere itself has spun beneath it.
    gsap
      .timeline({ repeat: -1, yoyo: true })
      .to(humanRef.current.position, { y: SPHERE_RADIUS + 0.05, duration: 0.22, ease: "power1.inOut" }, 0)
      .to(humanRef.current.rotation, { z: 0.14, duration: 0.22, ease: "power1.inOut" }, 0);
  }, []);

  return (
    <group position={position} rotation={[rotation.x, rotation.y, rotation.z]} scale={scale}>
      <ParallaxGroup>
        {/* The human below is a SIBLING of this mesh, never a child — it can
            never inherit the sphere's rotation no matter how the parenting
            elsewhere in the tree evolves. */}
        <mesh ref={sphereRef} castShadow receiveShadow>
          <sphereGeometry args={[SPHERE_RADIUS, 48, 48]} />
          <meshStandardMaterial {...STRUCTURE_MATERIAL_PROPS} />
        </mesh>

        <TinyHuman ref={humanRef} position={[0, SPHERE_RADIUS, 0]} />

        <group position={[0, -SPHERE_RADIUS - 0.5, 0.02]}>
          <LogoCard brand="chatgpt" size={[0.9, 0.35]} />
        </group>
      </ParallaxGroup>
    </group>
  );
}
