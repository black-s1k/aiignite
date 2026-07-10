"use client";

import LightingRig from "./LightingRig";

/**
 * All 4 element components (Anthropic/ChatGPT/n8n/Perplexity) are removed from
 * the render tree — the page's one "AI" mark is now solely the flat 2D
 * components/layout/SideLogo.tsx image, not a 3D canvas glyph. Source for all 4
 * stays intact in components/canvas/elements/ if 3D figures come back later.
 */
export default function Scene() {
  return (
    <>
      <LightingRig />
    </>
  );
}
