import type { Brand } from "./layout";

/**
 * Real asset registries — entries are intentionally ABSENT until a file actually
 * exists at that path. Suspense only covers the loading state; a missing/404 file
 * makes the loader promise reject, which Suspense does not catch. Consumers must
 * branch on "is a path configured" rather than relying on the Suspense fallback
 * alone. Swap-in is: drop the file into public/logos or public/models, then add
 * the corresponding key here.
 */
export const LOGO_PATHS: Partial<Record<Brand, string>> = {
  // anthropic: "/logos/anthropic.png",
};

export const MODEL_PATHS: Partial<Record<Brand, string>> = {
  // anthropic: "/models/anthropic.glb",
};
