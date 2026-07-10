import { Vector3 } from "three";

export type Brand = "anthropic" | "chatgpt" | "n8n" | "perplexity";

type ElementLayout = {
  position: Vector3;
  rotation: Vector3;
  scale: number;
};

export const GROUND_Y = -1.6;

export const CAMERA_POSITION = new Vector3(0, 0.6, 9);
export const CAMERA_FOV = 42;

export const FORMATION: Record<Brand, ElementLayout> = {
  // Centered — with the other 3 figures currently removed (see Scene.tsx), this
  // is the sole subject on screen, not one of four spread across the formation.
  anthropic: {
    position: new Vector3(0, 0.3, 0),
    rotation: new Vector3(0, 0.1, 0),
    scale: 1,
  },
  chatgpt: {
    position: new Vector3(-1.4, 0.9, 0.8),
    rotation: new Vector3(0, 0, 0),
    scale: 1,
  },
  n8n: {
    position: new Vector3(1.6, 0.2, -0.2),
    rotation: new Vector3(0, -0.2, 0),
    scale: 1,
  },
  perplexity: {
    position: new Vector3(4.3, 0.7, 0.4),
    rotation: new Vector3(0.3, 0, 0.1),
    scale: 1,
  },
};

/** Bounding box (world units) the formation spans, used to size the directional light's shadow frustum. */
export const FORMATION_BOUNDS = {
  halfWidth: 5.5,
  halfHeight: 2.5,
};
