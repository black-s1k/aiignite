/**
 * The roughening pass described at the top of components/Draw.tsx.
 *
 * Clean geometry in, hand-drawn path data out. Every rule from that
 * comment is implemented here:
 *   - amplitude scales with the feature, so a 2-unit pupil and a
 *     60-unit outline wobble by the same PROPORTION
 *   - corners are spikes in turn RATE, not large angles, and the
 *     displacement is damped to nothing across a window around them
 *   - only the runs between corners wander; vertices stay put
 */

// ---- primitives: clean geometry, as vertex lists -------------------

const D = Math.PI / 180;

export const line = (x1, y1, x2, y2) => ({ pts: [[x1, y1], [x2, y2]], closed: false });

export const poly = (pts, closed = false) => ({ pts, closed });

/** y-down angles in degrees: 0 = right, 90 = below, 270 = above. */
export function arc(cx, cy, r, a0, a1, closed = false) {
  const n = Math.max(8, Math.ceil((Math.abs(a1 - a0) / 360) * 64));
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const a = (a0 + ((a1 - a0) * i) / n) * D;
    pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  return { pts, closed };
}

export const circle = (cx, cy, r) => {
  const a = arc(cx, cy, r, 0, 360);
  a.pts.pop();
  a.closed = true;
  return a;
};

export const ellipse = (cx, cy, rx, ry) => {
  const pts = [];
  const n = 56;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * 2 * Math.PI;
    pts.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]);
  }
  return { pts, closed: true };
};

/** Quadratic bezier, as vertices. */
export function quad(p0, c, p1, n = 16) {
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n, u = 1 - t;
    pts.push([
      u * u * p0[0] + 2 * u * t * c[0] + t * t * p1[0],
      u * u * p0[1] + 2 * u * t * c[1] + t * t * p1[1],
    ]);
  }
  return pts;
}

/** Catmull-Rom through the given points — for organic outlines that
 *  would be miserable to write as arcs (a cloud, a bulb). */
export function spline(ctrl, closed = false, per = 12) {
  const p = ctrl.map((q) => q.slice());
  const n = p.length;
  const at = (i) => p[closed ? (i + n) % n : Math.max(0, Math.min(n - 1, i))];
  const out = [];
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
    for (let j = 0; j < per; j++) {
      const t = j / per, t2 = t * t, t3 = t2 * t;
      out.push([0, 1].map((k) =>
        0.5 * ((2 * p1[k]) + (-p0[k] + p2[k]) * t +
          (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 +
          (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3)));
    }
  }
  if (!closed) out.push(p[n - 1].slice());
  return { pts: out, closed };
}

// ---- the pass ------------------------------------------------------

/** Deterministic per-mark noise: three harmonics with fixed phases.
 *  Closed strokes get integer frequencies over the perimeter so the
 *  wobble meets itself at the seam instead of stepping. */
function noiser(seed, L, closed) {
  let s = seed * 2654435761 % 2147483647;
  const rnd = () => (s = (s * 48271) % 2147483647) / 2147483647;
  const base = closed
    ? [2, 3, 5].map((k) => (k * 2 * Math.PI) / L)
    : [1.9, 4.1, 7.3].map((k) => (k * 2 * Math.PI) / L);
  const ph = [rnd(), rnd(), rnd()].map((r) => r * 2 * Math.PI);
  const amp = [1, 0.46, 0.24];
  return (t) => {
    let v = 0;
    for (let i = 0; i < 3; i++) v += amp[i] * Math.sin(base[i] * t + ph[i]);
    return v / 1.7;
  };
}

const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);

/**
 * Uniform resampling in two passes, because the two rules pull against
 * each other: corners are only VISIBLE on a uniformly sampled line (a
 * corner is a spike in turn rate, and rate needs even spacing to mean
 * anything), but they have to survive into the output exactly, and a
 * uniform grid walks straight past them.
 *
 * So: subdivide finely, find the corners there, then lay the output
 * samples down run by run between corners — even spacing inside each
 * run, a sample exactly ON each corner.
 */
function resampleUniform(src, at) {
  const s = [0];
  for (let i = 1; i < src.length; i++) s.push(s[i - 1] + dist(src[i - 1], src[i]));
  const L = s[s.length - 1] || 1;
  const point = (t) => {
    let i = 1;
    while (i < s.length - 1 && s[i] < t) i++;
    const f = (t - s[i - 1]) / Math.max(s[i] - s[i - 1], 1e-9);
    return [src[i - 1][0] + (src[i][0] - src[i - 1][0]) * f,
            src[i - 1][1] + (src[i][1] - src[i - 1][1]) * f];
  };
  return { L, point, at: at.map(point) };
}

function subdivide(src, step) {
  const out = [src[0].slice()];
  for (let i = 1; i < src.length; i++) {
    const a = src[i - 1], b = src[i];
    const n = Math.max(1, Math.ceil(dist(a, b) / step));
    for (let j = 1; j <= n; j++) {
      const t = j / n;
      out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
    }
  }
  return out;
}

function roughen(stroke, seed, { step = 1.6, k = 0.02, min = 0.1, max = 0.5 } = {}) {
  const src = stroke.pts.map((p) => p.slice());
  if (stroke.closed) src.push(src[0].slice());

  // Feature size drives amplitude: the smaller the mark, the smaller
  // the wander. A flat number turns a pupil into a potato.
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const [x, y] of src) {
    x0 = Math.min(x0, x); y0 = Math.min(y0, y);
    x1 = Math.max(x1, x); y1 = Math.max(y1, y);
  }
  const feature = Math.max(Math.hypot(x1 - x0, y1 - y0) * 0.62, 2);
  const A = Math.min(max, Math.max(min, k * feature));

  // ---- pass one: find the corners on an evenly sampled copy --------
  const fine = subdivide(src, 0.35);
  const fs = [0];
  for (let i = 1; i < fine.length; i++) fs.push(fs[i - 1] + dist(fine[i - 1], fine[i]));
  const L = fs[fs.length - 1] || 1;

  const cuts = [];
  for (let i = 1; i < fine.length - 1; i++) {
    const a = fine[i - 1], b = fine[i], c = fine[i + 1];
    const t1 = Math.atan2(b[1] - a[1], b[0] - a[0]);
    const t2 = Math.atan2(c[1] - b[1], c[0] - b[0]);
    const d = Math.abs(((t2 - t1 + Math.PI) % (2 * Math.PI)) - Math.PI);
    // Rate, not angle: judged against a flat threshold every sample on
    // a small circle reads as a corner and the circle comes out a
    // heptagon.
    if (d / Math.max((dist(a, b) + dist(b, c)) / 2, 1e-6) > 0.5 && d > 0.3) {
      if (!cuts.length || fs[i] - cuts[cuts.length - 1] > 0.8) cuts.push(fs[i]);
    }
  }

  // ---- pass two: lay the samples down, run by run ------------------
  const knots = [0, ...cuts, L];
  const at = [];
  for (let i = 1; i < knots.length; i++) {
    const a = knots[i - 1], b = knots[i];
    const n = Math.max(1, Math.round((b - a) / step));
    for (let j = 0; j < n; j++) at.push(a + ((b - a) * j) / n);
  }
  at.push(L);

  const { at: pts } = resampleUniform(fine, at);

  // Damping window around every corner, measured in arc length: only
  // the runs between corners wander.
  const W = Math.max(1.1, A * 3);
  const damp = at.map((t) => {
    let m = 1;
    for (const c of cuts) {
      let d = Math.abs(t - c);
      if (stroke.closed) d = Math.min(d, L - d);
      m = Math.min(m, Math.min(1, d / W));
    }
    if (stroke.closed) {
      // The seam is a corner too when the shape closes on one.
      for (const c of [0, L]) m = Math.min(m, Math.min(1, Math.abs(t - c) / W));
    }
    return m;
  });

  const n1 = noiser(seed, L, stroke.closed);
  const n2 = noiser(seed + 977, L, stroke.closed);

  const out = pts.map((p, i) => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
    let tx = b[0] - a[0], ty = b[1] - a[1];
    const m = Math.hypot(tx, ty) || 1;
    tx /= m; ty /= m;
    const w = A * damp[i] * n1(at[i]);
    // A touch along the tangent too, so the line does not run at an
    // even speed — that is the other half of looking drawn.
    const g = A * 0.35 * damp[i] * n2(at[i]);
    return [p[0] - ty * w + tx * g, p[1] + tx * w + ty * g];
  });

  if (stroke.closed) out[out.length - 1] = out[0].slice();
  return out;
}

// ---- emit ----------------------------------------------------------

const r1 = (v) => {
  const n = Math.round(v * 10) / 10;
  return String(Object.is(n, -0) ? 0 : n);
};

/** Catmull-Rom through the roughened samples, as cubics. */
function toPath(pts, closed) {
  const at = (i) => pts[Math.max(0, Math.min(pts.length - 1, i))];
  let d = `M${r1(pts[0][0])} ${r1(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${r1(c1[0])} ${r1(c1[1])} ${r1(c2[0])} ${r1(c2[1])} ${r1(p2[0])} ${r1(p2[1])}`;
  }
  return closed ? d + "Z" : d;
}

export function draw(strokes, seed = 1, opts) {
  return strokes.map((st, i) => toPath(roughen(st, seed + i * 131, opts), st.closed));
}
