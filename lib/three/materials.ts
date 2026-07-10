/**
 * Neutral placeholder palette — deliberately unbranded (no company colors) since
 * these stand in for structures until real logo textures/.glb models are dropped in.
 * See public/logos/ and public/models/ + lib/three/assets.ts for the swap-in path.
 */
export const PLACEHOLDER_COLORS = {
  structure: "#d4d4d8",
  structureDark: "#71717a",
  human: "#e4e4e7",
  humanAccent: "#a1a1aa",
  ground: "#000000",
} as const;

export const STRUCTURE_MATERIAL_PROPS = {
  color: PLACEHOLDER_COLORS.structure,
  metalness: 0.35,
  roughness: 0.4,
} as const;

export const HUMAN_MATERIAL_PROPS = {
  color: PLACEHOLDER_COLORS.human,
  metalness: 0.1,
  roughness: 0.7,
} as const;

/** For the club's actual "AI" wordmark extruded in 3D — this is real brand
 * material (matches the white logo mark), not an unbranded placeholder. */
export const AI_LOGO_MATERIAL_PROPS = {
  color: "#f5f5f5",
  metalness: 0.25,
  roughness: 0.32,
} as const;
