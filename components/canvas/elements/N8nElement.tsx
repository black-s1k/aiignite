"use client";

import { useMemo, useRef } from "react";
import { Tube } from "@react-three/drei";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { CatmullRomCurve3, type Group, Vector3 } from "three";
import TinyHuman from "../TinyHuman";
import LogoCard from "../LogoCard";
import ParallaxGroup from "../ParallaxGroup";
import { FORMATION } from "@/lib/three/layout";
import { PLACEHOLDER_COLORS, STRUCTURE_MATERIAL_PROPS } from "@/lib/three/materials";

const NODES: Vector3[] = [
  new Vector3(-0.85, 0.32, 0),
  new Vector3(0.15, 0.72, 0.32),
  new Vector3(0.92, -0.08, -0.22),
  new Vector3(-0.05, -0.58, 0.4),
];

const EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 0],
];

const NODE_RADIUS = 0.17;
const PIPE_RADIUS = 0.035;

function buildPipeCurve(a: Vector3, b: Vector3) {
  const mid = a.clone().lerp(b, 0.5);
  mid.y -= 0.16;
  return new CatmullRomCurve3([a, mid, b]);
}

export default function N8nElement() {
  const { position, rotation, scale } = FORMATION.n8n;

  const pipeCurves = useMemo(() => EDGES.map(([a, b]) => buildPipeCurve(NODES[a], NODES[b])), []);

  // The dangling human hangs from the midpoint of edge 1 (index into pipeCurves).
  const pendulumAnchor = useMemo(() => pipeCurves[1].getPointAt(0.5), [pipeCurves]);

  const pendulumPivotRef = useRef<Group>(null);
  const sitterRefs = useRef<(Group | null)[]>([]);

  useGSAP(() => {
    if (pendulumPivotRef.current) {
      gsap.to(pendulumPivotRef.current.rotation, {
        z: 0.5,
        duration: 1.6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    }

    sitterRefs.current.forEach((sitter, i) => {
      if (!sitter) return;
      gsap.to(sitter.scale, {
        y: 1.08,
        duration: 0.7,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: i * 0.18,
      });
    });
  }, [pipeCurves]);

  return (
    <group position={position} rotation={[rotation.x, rotation.y, rotation.z]} scale={scale}>
      <ParallaxGroup>
        {NODES.map((p, i) => (
          <mesh key={i} castShadow receiveShadow position={p}>
            <sphereGeometry args={[NODE_RADIUS, 24, 24]} />
            <meshStandardMaterial {...STRUCTURE_MATERIAL_PROPS} />
          </mesh>
        ))}

        {pipeCurves.map((curve, i) => (
          <Tube key={i} args={[curve, 24, PIPE_RADIUS, 8, false]} castShadow receiveShadow>
            <meshStandardMaterial {...STRUCTURE_MATERIAL_PROPS} color={PLACEHOLDER_COLORS.structureDark} />
          </Tube>
        ))}

        {/* pendulum human, hanging and swinging from a pipe midpoint */}
        <group ref={pendulumPivotRef} position={pendulumAnchor}>
          <TinyHuman position={[0, -0.55, 0]} idlePhase={0} />
        </group>

        {/* idle "sitting" humans on two of the node spheres */}
        <group ref={(el) => { sitterRefs.current[0] = el; }} position={NODES[0].clone().add(new Vector3(0, NODE_RADIUS, 0))}>
          <TinyHuman idlePhase={1.2} />
        </group>
        <group ref={(el) => { sitterRefs.current[1] = el; }} position={NODES[2].clone().add(new Vector3(0, NODE_RADIUS, 0))}>
          <TinyHuman idlePhase={2.4} />
        </group>

        <group position={[0, -1.4, 0.6]}>
          <LogoCard brand="n8n" size={[0.9, 0.35]} />
        </group>
      </ParallaxGroup>
    </group>
  );
}
