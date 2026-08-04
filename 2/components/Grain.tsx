import { GRAIN } from "@/lib/grain";

/**
 * Fixed noise overlay at 5%. Sits above the background, below content.
 * The hero renders its own copy inside its sticky container (it has to —
 * a fixed overlay would sit behind the sticky stacking context), but both
 * pull from the same GRAIN constant.
 */
export function Grain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 opacity-[0.05] mix-blend-overlay"
      style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat" }}
    />
  );
}
