/**
 * Clean geometry for the fifteen decorative hero marks' younger half —
 * the ten added when the scatter grew past the four-corner version.
 *
 * `node tools/marks/hero-marks.mjs` prints them as MARKS entries ready
 * to paste into components/Draw.tsx. That file says not to hand-edit the
 * path data, and this is what it means: change the shape HERE, re-run,
 * replace the block. Editing a "C" by hand desyncs the drawing from its
 * source and the next roughening pass silently throws the edit away.
 *
 * The five older decorative marks (chip, nodes, code, orbit, bot) and
 * every section mark above them predate this file and have no clean
 * source checked in. Redrafting one means writing its geometry here
 * first.
 */
import { line, poly, arc, circle, ellipse, quad, spline, draw } from "./rough.mjs";

const D = Math.PI / 180;

/** Elliptical arc, y-down degrees. */
function earc(cx, cy, rx, ry, a0, a1, closed = false) {
  const n = Math.max(10, Math.ceil((Math.abs(a1 - a0) / 360) * 72));
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const a = (a0 + ((a1 - a0) * i) / n) * D;
    pts.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]);
  }
  return { pts, closed };
}

function rrect(x0, y0, x1, y1, r) {
  const pts = [];
  const push = (s) => pts.push(...s.pts);
  pts.push([x0 + r, y0], [x1 - r, y0]);
  push(arc(x1 - r, y0 + r, r, 270, 360));
  pts.push([x1, y1 - r]);
  push(arc(x1 - r, y1 - r, r, 0, 90));
  pts.push([x0 + r, y1]);
  push(arc(x0 + r, y1 - r, r, 90, 180));
  pts.push([x0, y0 + r]);
  push(arc(x0 + r, y0 + r, r, 180, 270));
  return { pts, closed: true };
}

/** The AI four-point star: tips on the axes, pinched between them. */
function star(cx, cy, R, pinch) {
  const tip = (a) => [cx + R * Math.cos(a * D), cy + R * Math.sin(a * D)];
  const mid = (a) => [cx + pinch * Math.cos(a * D), cy + pinch * Math.sin(a * D)];
  const pts = [];
  for (let i = 0; i < 4; i++) {
    const a0 = 270 + i * 90;
    const seg = quad(tip(a0), mid(a0 + 45), tip(a0 + 90), 14);
    pts.push(...(i ? seg.slice(1) : seg));
  }
  pts.pop();
  return { pts, closed: true };
}

function gear(cx, cy, rOut, rRoot, teeth, half, halfRoot) {
  const pts = [];
  const at = (a, r) => [cx + r * Math.cos(a * D), cy + r * Math.sin(a * D)];
  const step = 360 / teeth;
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    pts.push(at(a - halfRoot, rRoot), at(a - half, rOut), at(a + half, rOut), at(a + halfRoot, rRoot));
    for (let g = a + halfRoot + 4; g < a + step - halfRoot; g += 4) pts.push(at(g, rRoot));
  }
  return { pts, closed: true };
}

const MARKS = {
  /** The AI sparkle — the one mark on the page that says which decade
   *  this is. Two stars, unequal, so it reads as drawn not stamped. */
  sparkle: [star(28, 35, 17, 5.4), star(46, 18, 8, 2.6)],

  /** A terminal — a prompt waiting for a line. */
  terminal: [
    rrect(12, 17, 52, 47, 3),
    line(12, 25, 52, 25),
    poly([[23, 32], [30, 37], [23, 42]]),
    line(34, 42, 43, 42),
  ],

  /** A cog. Lassonde is an engineering school before it is anything. */
  gear: [gear(32, 32, 21.5, 15.5, 6, 12, 20), circle(32, 32, 6.5)],

  /** Metrics — an axis and a line that climbs. */
  chart: [
    poly([[14, 15], [14, 48], [50, 48]]),
    poly([[18, 42], [25, 33], [31, 37], [38, 25], [46, 19]]),
    circle(46, 19, 2.5),
  ],

  /** The data it all runs on. */
  database: [
    ellipse(32, 18, 14, 5.5),
    line(18, 18, 18, 45),
    line(46, 18, 46, 45),
    earc(32, 45, 14, 5.5, 0, 180),
    earc(32, 31.5, 14, 5.5, 0, 180),
  ],

  /** Where the model actually lives. */
  cloud: [
    spline([
      [16, 41], [15.5, 36], [19, 32.5], [24, 31.5], [26, 26.5], [32, 24],
      [38, 26.5], [40, 31.5], [45, 32], [48, 36], [47, 41],
    ]),
    line(16, 41, 47, 41),
  ],

  /** A signal — the shape of something being measured. */
  pulse: [poly([[11, 32], [18, 32], [22, 20], [27, 45], [32, 26], [37, 36], [42, 32], [53, 32]])],

  /** A branch. Two people building the same thing at once. */
  branch: [
    circle(22, 16, 4),
    circle(22, 48, 4),
    circle(44, 26, 4),
    line(22, 20, 22, 44),
    spline([[22, 36], [28, 36], [33, 34], [38, 31], [41, 28]]),
  ],

  /** The idea before the build. */
  bulb: [
    spline([
      [27.5, 38], [23.5, 35.5], [21, 31], [22, 25.5], [26, 21], [32, 19.5],
      [38, 21], [42, 25.5], [42.5, 31], [40.5, 35.5], [36.5, 38],
    ]),
    line(27.5, 39.5, 36.5, 39.5),
    line(28.5, 43, 35.5, 43),
    line(30, 46.5, 34, 46.5),
    poly([[29, 33], [31, 28.5], [33, 32.5], [35, 27.5]]),
  ],

  /** HuggingFace, drawn rather than borrowed.
   *
   *  The only logo in the set that could not be masked: it is a YELLOW
   *  face with dark eyes and a dark mouth, so silhouetting it fills the
   *  features in and leaves a blob. What makes it readable is hue, and a
   *  one-colour mask has no hue to give it. So it is redrawn as line
   *  art in the same hand as everything else, at the client's direction.
   *
   *  Simplified deliberately: fingers at 34px are mush, so each hand is
   *  a palm with two creases rather than five digits, and the silhouette
   *  — round face flanked by two raised hands — is what carries it. */
  huggingface: [
    circle(32, 26, 12),
    circle(27, 23, 1.9),
    circle(37, 23, 1.9),
    arc(32, 24.5, 7, 32, 148),
    // The hands, raised. Ovals rather than outlined palms: an eight-point
    // spline came out leaf-shaped, because a closed spline through a
    // narrow shape puts a cusp wherever two control points face off.
    ellipse(14.5, 35.5, 5.4, 7.4),
    line(12.2, 29.8, 12, 33.6),
    line(15.6, 29.4, 15.6, 33.4),
    ellipse(49.5, 35.5, 5.4, 7.4),
    line(51.8, 29.8, 52, 33.6),
    line(48.4, 29.4, 48.4, 33.4),
  ],

  /** The hero's own mark: a cloud feeding a circuit.
   *
   *  Traced from the client's reference rather than invented, so the
   *  wiring is the reference's wiring: five terminals, the outer pair
   *  reached by a diagonal, the inner pair by a right-angled step, and
   *  the centre dropping straight down and hanging lowest.
   *
   *  The only mark on the page not drafted on a 64 box. It renders at
   *  the width of the headline rather than at 30-odd pixels, so it gets
   *  twice the room and the extra goes into the wiring, which is where
   *  all the detail is. Strokes are non-scaling, so it still carries
   *  exactly the same weight as a 30px logistics mark. */
  cloudnet: [
    spline([
      [3, 62], [2.3, 53], [2.5, 45], [5.2, 40], [14, 36.6], [16, 27.2],
      [24.7, 20.6], [34.3, 22.3], [39.3, 12.9], [50.9, 6.3], [65.5, 5.7],
      [78, 12], [82.9, 20], [93.1, 17.7], [104.8, 21.5], [111.2, 30],
      [117.9, 34.3], [124.5, 43], [125.1, 53], [122, 62],
    ]),
    line(3, 62, 122, 62),

    // Outer pair: straight down, then a diagonal out to the terminal.
    poly([[30.6, 62], [30.6, 76.6], [18.4, 84.2]]),
    poly([[98.6, 62], [98.6, 76.6], [110.8, 84.2]]),

    // Inner pair: down, a right-angled step outward, down again.
    poly([[43.6, 62], [43.6, 91], [35, 91], [35, 102.8]]),
    poly([[85.6, 62], [85.6, 91], [94.2, 91], [94.2, 102.8]]),

    // The centre runs straight through and hangs lowest.
    line(64.6, 62, 64.6, 111.8),

    circle(14, 87, 5.2),
    circle(115.2, 87, 5.2),
    circle(35, 108, 5.2),
    circle(94.2, 108, 5.2),
    circle(64.6, 117, 5.2),
  ],

  /** Layers — the one picture of a model everybody has seen. */
  layers: [
    poly([[32, 15], [48, 23], [32, 31], [16, 23]], true),
    poly([[16, 29], [32, 37], [48, 29]]),
    poly([[16, 35], [32, 43], [48, 35]]),
  ],
};

const BOXES = { cloudnet: "0 0 128 126" };

let seed = 17;
const out = [];
for (const [name, strokes] of Object.entries(MARKS)) {
  const paths = draw(strokes, (seed += 313), { step: 1.6 });
  // Everything is drafted on a 64 box except the hero's own mark, which
  // renders at headline width and gets twice the room for its wiring.
  const box = BOXES[name] ?? "0 0 64 64";
  out.push(`  ${name}: {\n    box: "${box}",\n    d: [\n${paths.map((p) => `      "${p}",`).join("\n")}\n    ],\n  },`);
}
console.log(out.join("\n\n"));
