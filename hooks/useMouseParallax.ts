import { useEffect } from "react";
import { createStore, useStore } from "zustand";

type PointerState = {
  x: number;
  y: number;
  setPointer: (x: number, y: number) => void;
};

/**
 * Vanilla (non-React-bound) store so useFrame loops can read the latest pointer
 * position via pointerStore.getState() every frame without subscribing — writes
 * here never trigger a React re-render anywhere in the tree.
 */
export const pointerStore = createStore<PointerState>((set) => ({
  x: 0,
  y: 0,
  setPointer: (x, y) => set({ x, y }),
}));

/** Only useful if a component needs pointer position reactively (rare — prefer getState() in useFrame). */
export function usePointerStore<T>(selector: (state: PointerState) => T): T {
  return useStore(pointerStore, selector);
}

/**
 * Mount once (in SceneCanvas). The <Canvas> is pointer-events-none so it can sit
 * under clickable header text, which means R3F's own pointer tracking never
 * fires — we track the cursor at the window level instead and normalize to NDC.
 */
export function useMouseParallaxListener() {
  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      pointerStore.getState().setPointer(x, y);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);
}
