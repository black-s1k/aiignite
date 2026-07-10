/**
 * Outline coordinates of the actual "AI" wordmark (public/logo-ai.png), extracted
 * via connected-component + contour analysis (scipy.ndimage.label + skimage
 * find_contours/approximate_polygon on the real alpha mask) rather than eyeballed
 * — so the extruded 3D glyph is a faithful match to the real logo, not a guess.
 * Coordinates are in local XY, already centered as a pair and scaled so the
 * combined "AI" shape spans a height of ~3.2 world units (see GLYPH_HEIGHT in
 * elements/AnthropicElement.tsx). Do not re-center these individually — the two
 * shapes' relative position (including the real gap between them) depends on
 * them sharing this one coordinate space.
 */

export const A_OUTER: [number, number][] = [
  [0.9858, -1.6],
  [0.285, -1.6],
  [0.0232, -0.933],
  [-1.2939, -0.933],
  [-1.5641, -1.6],
  [-2.2691, -1.5958],
  [-0.9984, 1.6],
  [-0.2681, 1.5873],
];

export const A_HOLE: [number, number][] = [
  [-0.2132, -0.3335],
  [-1.0702, -0.3293],
  [-0.6354, 0.781],
];

export const I_OUTER: [number, number][] = [
  [2.2691, -1.6],
  [1.5726, -1.5958],
  [0.3187, 1.6],
  [1.0153, 1.5873],
];

/** I_OUTER[1] and I_OUTER[2] — the bar's inner (left) edge, facing the gap toward "A". */
export const I_LEFT_EDGE_BOTTOM: [number, number] = I_OUTER[1];
export const I_LEFT_EDGE_TOP: [number, number] = I_OUTER[2];
