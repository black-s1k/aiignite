/**
 * A heat field over the viewport.
 *
 * This is a real (if small) simulation rather than a set of hover
 * states, and the difference is the whole point: heat you add SPREADS,
 * COOLS, and RISES, so touching the page leaves a warm trail that drifts
 * upward and fades instead of a highlight that switches off the instant
 * the pointer moves. Persistence is what makes it read as a material.
 *
 * Deliberately framework-free — no React, no DOM. It is a grid of
 * numbers with a step function, which makes it testable on its own and
 * keeps the per-frame cost obvious.
 *
 * Grid, not per-element maths. Every element on the page samples one
 * shared field, so cost scales with the grid (fixed) rather than with
 * how much of the page opts in.
 */

export type HeatOpts = {
  cols?: number;
  rows?: number;
  /** How fast heat spreads to neighbours, per second. */
  spread?: number;
  /** Fraction of heat lost per second. */
  cool?: number;
  /** How strongly heat migrates upward, per second. */
  rise?: number;
};

export class HeatField {
  readonly cols: number;
  readonly rows: number;
  private a: Float32Array;
  private b: Float32Array;
  private spread: number;
  private cool: number;
  private rise: number;

  constructor(o: HeatOpts = {}) {
    // Coarse on purpose. This drives font axes and colour mixes, not
    // pixels, so resolution beyond this buys nothing visible and costs
    // real time every frame.
    this.cols = o.cols ?? 40;
    this.rows = o.rows ?? 24;
    this.spread = o.spread ?? 5.5;
    this.cool = o.cool ?? 0.92;
    this.rise = o.rise ?? 2.4;
    this.a = new Float32Array(this.cols * this.rows);
    this.b = new Float32Array(this.cols * this.rows);
  }

  /** Add heat at viewport-normalised x,y with a falloff radius. */
  inject(x: number, y: number, amount: number, radius = 0.09) {
    const { cols, rows, a } = this;
    const cx = x * cols;
    const cy = y * rows;
    const rx = radius * cols;
    const ry = radius * rows;
    const i0 = Math.max(0, Math.floor(cx - rx));
    const i1 = Math.min(cols - 1, Math.ceil(cx + rx));
    const j0 = Math.max(0, Math.floor(cy - ry));
    const j1 = Math.min(rows - 1, Math.ceil(cy + ry));

    for (let j = j0; j <= j1; j++) {
      for (let i = i0; i <= i1; i++) {
        const dx = (i + 0.5 - cx) / rx;
        const dy = (j + 0.5 - cy) / ry;
        const d2 = dx * dx + dy * dy;
        if (d2 > 1) continue;
        // Squared falloff: heat is local. A linear falloff warms the
        // whole neighbourhood evenly and reads as a brightness slider.
        const f = 1 - d2;
        const k = j * cols + i;
        a[k] = Math.min(1.6, a[k] + amount * f * f);
      }
    }
  }

  /**
   * Advance the simulation. `dt` is clamped by the caller — a
   * backgrounded tab returning with a two-second step would blow the
   * diffusion up rather than fast-forward it.
   */
  step(dt: number) {
    const { cols, rows, a, b, spread } = this;
    const s = Math.min(0.25, spread * dt);
    const r = Math.min(0.45, this.rise * dt);
    const decay = Math.exp(-this.cool * dt);

    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const k = j * cols + i;
        const c = a[k];

        // Clamped edges rather than wrapping: heat must not fall off the
        // right side and reappear on the left.
        const l = a[k - (i > 0 ? 1 : 0)];
        const rr = a[k + (i < cols - 1 ? 1 : 0)];
        const up = a[k - (j > 0 ? cols : 0)];
        const dn = a[k + (j < rows - 1 ? cols : 0)];

        // Diffusion, plus a buoyancy term that pulls from the cell
        // BELOW — which is what makes a trail drift upward instead of
        // blooming symmetrically. Without it this looks like a blur.
        let v = c + s * ((l + rr + up + dn) * 0.25 - c);
        v += r * (dn - c);
        b[k] = v * decay;
      }
    }
    // Swap the buffers rather than copying one into the other. Two
    // fixed arrays, reused every frame, so the simulation allocates
    // nothing after construction and never gives the collector a reason
    // to run mid-animation.
    this.a = b;
    this.b = a;
  }

  /** Bilinear sample at viewport-normalised x,y. Returns 0..~1.6. */
  sample(x: number, y: number): number {
    const { cols, rows, a } = this;
    const fx = Math.min(cols - 1.001, Math.max(0, x * cols - 0.5));
    const fy = Math.min(rows - 1.001, Math.max(0, y * rows - 0.5));
    const i = fx | 0;
    const j = fy | 0;
    const tx = fx - i;
    const ty = fy - j;
    const k = j * cols + i;
    const top = a[k] * (1 - tx) + a[k + 1] * tx;
    const bot = a[k + cols] * (1 - tx) + a[k + cols + 1] * tx;
    return top * (1 - ty) + bot * ty;
  }

  /** Seed some warmth so the page is never completely cold on arrival. */
  seed(amount = 0.35) {
    for (let i = 0; i < this.a.length; i++) this.a[i] = amount * Math.random();
  }
}
