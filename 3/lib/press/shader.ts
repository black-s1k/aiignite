/**
 * The press — fragment shader for a live two-ink risograph.
 *
 * This is not a filter applied to artwork. It simulates the print
 * itself, in the same order a real duplicator does it:
 *
 *   1. a coverage field per ink   (how much ink wants to be here)
 *   2. a halftone screen per ink  (the field broken into dots, each
 *                                  ink screened at its own angle)
 *   3. registration offset        (the sheet doesn't land in exactly
 *                                  the same place on the second pass)
 *   4. multiply compositing       (riso inks are transparent, so
 *                                  overlaps make a real third colour)
 *
 * Step 2 is where the signature lives. Two halftone screens at close
 * angles interfere and produce moiré — the printer's classic defect.
 * Here it is the point: when the two tracks are apart on the page the
 * screens sit at their correct, clean angles (75 deg / 15 deg, the real
 * separation a printer uses precisely to avoid this). As the tracks
 * converge, so do the angles, and the sheet blooms into live moiré.
 * Two things igniting each other, rendered as an actual print artifact.
 */

export const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

export const FRAG = /* glsl */ `
  precision highp float;

  varying vec2 vUv;

  uniform vec2  uRes;
  uniform float uTime;
  uniform vec3  uPaper;
  uniform vec3  uForge;
  uniform vec3  uSpark;

  // Per-ink state, lerped on the CPU from the section score.
  uniform vec2  uForgeAt;     // coverage centre, aspect-corrected space
  uniform vec2  uSparkAt;
  uniform float uForgeGain;   // 0 = drum lifted, 1 = full flood
  uniform float uSparkGain;
  uniform float uSpread;      // how far the field reaches from centre
  uniform float uTurb;        // domain-warp strength
  uniform float uConverge;    // 0 = screens at clean angles, 1 = moiré
  uniform float uMargin;      // 1 = hold ink out of the centre column
  uniform vec2  uReg;         // registration drift, in screen cells
  uniform float uFreq;        // screen ruling (dots across the sheet)

  // --- noise ------------------------------------------------------
  // Value noise. Cheap on purpose: this runs full-viewport every frame
  // on phones, and the halftone screen destroys most of the detail
  // anyway, so gradient noise would be paying for nothing.
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  // Three octaves. A fourth is not visible once screened.
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 3; i++) {
      v += a * vnoise(p);
      p *= 2.03;
      a *= 0.5;
    }
    return v;
  }

  mat2 rot(float a) {
    float c = cos(a), s = sin(a);
    return mat2(c, -s, s, c);
  }

  /**
   * Ink coverage at p for one drum. Returns 0..1 = fraction of the
   * cell that should carry ink.
   *
   * The shape is a soft radial mass pushed around by a domain-warped
   * fbm, which is what keeps it reading as spreading ink rather than
   * a gradient. The warp is seeded per ink so the two drums are
   * related but never identical.
   */
  float coverage(vec2 p, vec2 centre, float gain, float seed, float aspect) {
    if (gain <= 0.001) return 0.0;

    // centre.x is a fraction of the half-width, not an absolute
    // coordinate: 1.0 means "at the right trim edge" on any screen.
    // Absolute placement looks correct on the display it was tuned on
    // and then walks off the side of a phone, taking the entire
    // signature element with it.
    vec2 q = p - vec2(centre.x * aspect * 0.5, centre.y);

    // Domain warp. Time moves slowly — this is ink soaking into stock,
    // not a lava lamp.
    vec2 w = vec2(
      fbm(p * 1.6 + vec2(seed, uTime * 0.045)),
      fbm(p * 1.6 + vec2(seed + 4.7, uTime * 0.038))
    ) - 0.5;
    q += w * uTurb;

    // Vertical bias: ink climbs. A spark rises, and it also keeps the
    // mass off the horizontal centre where the type sits.
    q.y *= 0.78;

    float d = length(q);
    // Falls off from a solid core rather than from the centre point, so
    // the mass has a body and an edge instead of being one long ramp.
    float body = 1.0 - smoothstep(uSpread * 0.22, uSpread, d);

    // Break the outer edge up so the mass never terminates on a clean
    // circle — real flood coverage feathers out unevenly.
    float edge = fbm(p * 2.4 + seed * 3.1);
    body *= 0.55 + 0.62 * edge;

    return clamp(body * gain, 0.0, 1.0);
  }

  /**
   * One halftone screen. Rotates into the screen's own frame, finds
   * the cell, and grows a dot whose AREA tracks coverage — hence the
   * sqrt, since area goes as r^2. Without it the midtones print far
   * too dark.
   */
  float screenDot(vec2 p, float angle, float cov, vec2 reg) {
    if (cov <= 0.002) return 0.0;

    vec2 sp = rot(angle) * p * uFreq + reg;
    vec2 cell = fract(sp) - 0.5;

    // A square cell is fully covered once r reaches 0.707, so capping
    // well under that is what guarantees stock still shows through at
    // maximum coverage. Solid flood is something riso can't hold
    // anyway — it roller-marks — so real work is all screens and tints.
    float r = sqrt(clamp(cov, 0.0, 1.0)) * 0.50;

    // Antialias against the actual on-screen size of one cell, so the
    // dots stay crisp at any DPR instead of shimmering.
    float aa = fwidth(length(cell)) * 0.9 + 0.0025;
    return smoothstep(r + aa, r - aa, length(cell));
  }

  void main() {
    // Aspect-corrected space so the field is never stretched by the
    // viewport. Screens, though, are computed in raw uv — a real screen
    // is fixed to the sheet, not to the image.
    vec2 uv = vUv;
    float aspect = uRes.x / max(uRes.y, 1.0);
    vec2 p = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);

    float covF = coverage(p, uForgeAt, uForgeGain, 0.0, aspect);
    float covS = coverage(p, uSparkAt, uSparkGain, 11.3, aspect);

    // 0 on a landscape display, 1 on a phone held upright.
    float narrow = smoothstep(1.05, 0.70, aspect);

    // Reading sections pull ink out to the margins and leave the
    // measure clean. This is what a printed page does: the type block
    // is the one place ink is deliberately withheld.
    //
    // The band has to match where the type actually is. The content
    // column is max-w-6xl, which lands its edges near 0.60 in this
    // aspect-corrected space — so a hold that releases at 0.46 releases
    // *inside* the measure and prints dots under the body copy. Hold
    // right through the column and only let ink back in past its edge.
    float centre = 1.0 - smoothstep(0.34, 0.62, abs(uv.x - 0.5) * aspect);

    // A phone has no margins to bleed into — the measure is the whole
    // sheet. Holding ink out of it there would leave nothing on screen
    // at all, so the hold is released and the coverage dropped instead:
    // on a narrow screen the press stops being a composition beside the
    // type and becomes a tint behind it.
    float hold = mix(1.0, 1.0 - centre * 0.92, uMargin * (1.0 - narrow));
    float tint = mix(1.0, 0.38, narrow);
    covF *= hold * tint;
    covS *= hold * tint;

    // Screen angles. Apart: the textbook 75/15 separation that exists
    // precisely to kill moiré. Converged: both drift toward 45 and the
    // interference pattern blooms.
    const float DEG = 0.0174532925;
    float angF = mix(75.0, 47.0, uConverge) * DEG;
    float angS = mix(15.0, 43.0, uConverge) * DEG;

    // Registration drift. Each drum is a separate pass, so each gets
    // its own offset, and they move against each other.
    float dotF = screenDot(uv, angF, covF,  uReg);
    float dotS = screenDot(uv, angS, covS, -uReg * 1.35);

    // Stock. Uncoated paper is never flat — the fibre shows through
    // and is the reason the whole thing reads as printed rather than
    // rendered.
    float fibre = fbm(uv * vec2(aspect, 1.0) * 420.0) - 0.5;
    vec3 col = uPaper * (1.0 + fibre * 0.045);

    // Multiply, one drum at a time, in pass order. Where both dots
    // land you get Federal Blue x Fluoro Pink for free — the overprint
    // colour is never specified here, it just happens.
    col *= mix(vec3(1.0), uForge, dotF);
    col *= mix(vec3(1.0), uSpark, dotS);

    gl_FragColor = vec4(col, 1.0);
  }
`;
