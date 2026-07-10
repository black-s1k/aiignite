"use client";

import { useMemo, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { CatmullRomCurve3, ExtrudeGeometry, Group, Path, Shape, Vector3 } from "three";
import MinionCharacter from "../MinionCharacter";
import LogoCard from "../LogoCard";
import ParallaxGroup from "../ParallaxGroup";
import { A_HOLE, A_OUTER, I_LEFT_EDGE_BOTTOM, I_LEFT_EDGE_TOP, I_OUTER } from "@/lib/three/aiGlyphPaths";
import { FORMATION } from "@/lib/three/layout";
import { AI_LOGO_MATERIAL_PROPS } from "@/lib/three/materials";

const GLYPH_HEIGHT = 3.2;
const GLYPH_DEPTH = 0.3;
const FRONT_Z = GLYPH_DEPTH / 2 + 0.03;

function polygonToShape(points: readonly [number, number][]) {
  const shape = new Shape();
  points.forEach(([x, y], i) => (i === 0 ? shape.moveTo(x, y) : shape.lineTo(x, y)));
  shape.closePath();
  return shape;
}

/**
 * The real "AI" wordmark (public/logo-ai.png), extruded from outline data
 * pulled directly off the actual image (see lib/three/aiGlyphPaths.ts) — not a
 * generic placeholder bar. Both shapes share one un-recentered coordinate space
 * so the real gap between "A" and the standalone line is preserved exactly.
 */
function useAIGlyphGeometries() {
  return useMemo(() => {
    const aShape = polygonToShape(A_OUTER);
    const aHole = new Path();
    A_HOLE.forEach(([x, y], i) => (i === 0 ? aHole.moveTo(x, y) : aHole.lineTo(x, y)));
    aHole.closePath();
    aShape.holes.push(aHole);

    const aGeometry = new ExtrudeGeometry(aShape, { depth: GLYPH_DEPTH, bevelEnabled: false, steps: 1 });
    const iGeometry = new ExtrudeGeometry(polygonToShape(I_OUTER), {
      depth: GLYPH_DEPTH,
      bevelEnabled: false,
      steps: 1,
    });

    return { aGeometry, iGeometry };
  }, []);
}

/**
 * Slide down the standalone line's inner face, then climb back up through the
 * real negative-space gap between "A" and the line — the two curves share exact
 * endpoints, so the loop closes with no teleport/snap between repeats.
 */
function useCharacterPaths() {
  return useMemo(() => {
    const [topX, topY] = I_LEFT_EDGE_TOP;
    const [bottomX, bottomY] = I_LEFT_EDGE_BOTTOM;
    const top = new Vector3(topX, topY, FRONT_Z);
    const bottom = new Vector3(bottomX, bottomY, FRONT_Z);

    const slideCurve = new CatmullRomCurve3([
      top,
      new Vector3((topX + bottomX) / 2 - 0.05, (topY + bottomY) / 2, FRONT_Z),
      bottom,
    ]);

    // Bows left into the actual empty gap between "A" and the line, then back
    // up to precisely `top` — the shared endpoint with slideCurve is what
    // makes the loop seamless.
    const climbCurve = new CatmullRomCurve3([
      bottom,
      new Vector3(bottomX - 0.45, bottomY + 0.35, FRONT_Z + 0.12),
      new Vector3(topX - 0.4, topY - 0.35, FRONT_Z + 0.12),
      top,
    ]);

    return { slideCurve, climbCurve };
  }, []);
}

export default function AnthropicElement() {
  const { position, rotation, scale } = FORMATION.anthropic;
  const characterRef = useRef<Group>(null);
  const { aGeometry, iGeometry } = useAIGlyphGeometries();
  const { slideCurve, climbCurve } = useCharacterPaths();

  useGSAP(() => {
    if (!characterRef.current) return;
    const progress = { t: 0 };
    const tl = gsap.timeline({ repeat: -1 });

    const followCurve = (curve: CatmullRomCurve3) => () => {
      const character = characterRef.current;
      if (!character) return;
      character.position.copy(curve.getPointAt(progress.t));
      // lean slightly into the direction of travel for a more organic feel
      const tangent = curve.getTangentAt(progress.t);
      character.rotation.z = -tangent.x * 0.5;
    };

    tl.to(progress, {
      t: 1,
      duration: 2.2,
      ease: "power1.inOut",
      onUpdate: followCurve(slideCurve),
    })
      .to({}, { duration: 0.5 }) // brief hang at the bottom edge
      .set(progress, { t: 0 })
      .to(progress, {
        t: 1,
        duration: 2.6,
        ease: "sine.inOut",
        onUpdate: followCurve(climbCurve),
      })
      .to({}, { duration: 0.3 })
      .set(progress, { t: 0 });
  }, [slideCurve, climbCurve]);

  return (
    <group position={position} rotation={[rotation.x, rotation.y, rotation.z]} scale={scale}>
      <ParallaxGroup>
        <mesh castShadow receiveShadow geometry={aGeometry}>
          <meshStandardMaterial {...AI_LOGO_MATERIAL_PROPS} />
        </mesh>
        <mesh castShadow receiveShadow geometry={iGeometry}>
          <meshStandardMaterial {...AI_LOGO_MATERIAL_PROPS} />
        </mesh>

        <MinionCharacter ref={characterRef} />

        <group position={[0, -GLYPH_HEIGHT / 2 - 0.5, 0.02]}>
          <LogoCard brand="anthropic" size={[0.9, 0.35]} />
        </group>
      </ParallaxGroup>
    </group>
  );
}
