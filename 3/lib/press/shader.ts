/**
 * The press — fragment shader for a live two-ink risograph.
 *
 * This is not a filter over artwork. It simulates the print, in the
 * order a duplicator actually does it:
 *
 *   1. a coverage field per ink   (how much ink wants to be here)
 *   2. a halftone screen per ink  (that field broken into dots, each
 *                                  ink screened at its own angle)
 *   3. registration offset        (the sheet doesn't land in quite the
 *                                  same place on the second pass)
 *   4. multiply compositing       (riso inks are transparent, so
 *                                  overlaps make a real third colour)
 *
 * The coverage field has exactly two states and one monotonic journey
 * between them, which is the whole behavioural system:
 *
 *   GATHERED (uDisperse = 0) — the landing page. Both drums lay down
 *   one converged mass. It is never static: a volume-preserving squash
 *   and an angular surface wobble give it the soft-body wobble of set
 *   jelly. Screens are converged here too, so the mass carries live
 *   moiré.
 *
 *   DISPERSED (uDisperse = 1) — everywhere after. The ink has split to
 *   the two trim edges: Forge left, Spark right, matching the column
 *   order the Tracks section uses. Each band's inner edge runs a
 *   travelling wave, and the bands stay for the rest of the page.
 *
 * uDisperse is driven straight off scroll position and only ever
 * increases. That is deliberate. An earlier version gave every section
 * its own coverage, including near-zero for the text-heavy ones, so ink
 * vanished between sections and slammed back in at the next one. Ink
 * now never leaves the sheet — sections may only lean it left or right
 * and thicken or thin it, and every one of those is a bounded nudge
 * around a floor that is never near zero.
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

  uniform float uDisperse;    // 0 = gathered on the landing page, 1 = at the edges
  uniform vec2  uForgeAt;     // gathered-state centre, x as a fraction of half-width
  uniform vec2  uSparkAt;
  uniform float uSpread;      // gathered-state radius
  uniform float uJelly;       // soft-body wobble depth

  uniform float uBand;        // dispersed band width, fraction of viewport width
  uniform float uWaveAmp;     // how far the band's inner edge travels
  uniform float uWavePhase;   // scroll-driven, so scrolling pushes the wave along

  uniform sampler2D uMark;    // the club's AI mark, alpha channel is the artwork
  uniform float uMarkAspect;  // its own width/height
  uniform float uForm;        // 0 = bands, 1 = the mark fully struck

  uniform float uForgeInk;    // final coverage multiplier per drum
  uniform float uSparkInk;
  uniform float uConverge;    // 0 = screens at 75/15, 1 = converged into moiré
  uniform vec2  uReg;         // registration drift, in screen cells
  uniform float uFreq;        // screen ruling

  // --- noise ------------------------------------------------------
  // Value noise, cheap on purpose: this runs full-viewport every frame
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

  // Three octaves. A fourth isn't visible once screened.
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
   * GATHERED state: the landing-page mass, wobbling like a soft solid.
   *
   * Two deformations, because either alone reads wrong. The squash is
   * volume-preserving — as x swells y pinches — which is what stops it
   * looking like something simply scaling up and down. The wobble is a
   * radial displacement that varies with ANGLE, so different parts of
   * the rim lead and lag each other; that phase difference around the
   * edge is the whole difference between jelly and a pulsing circle.
   */
  float gathered(vec2 p, vec2 centre, float aspect, float seed) {
    vec2 q = p - vec2(centre.x * aspect * 0.5, centre.y);

    float t = uTime * 0.75 + seed;

    float s = sin(t * 0.9);
    q.x *= 1.0 + 0.17 * s * uJelly;
    q.y *= 1.0 - 0.14 * s * uJelly;

    // Ink climbs, and this also keeps the mass off the horizontal
    // centre line where the type sits.
    q.y *= 0.82;

    float r = length(q);
    float a = atan(q.y, q.x);

    // Three harmonics at unrelated speeds. Related speeds resynchronise
    // on a visible cycle and the wobble starts to look like a loop.
    r -= (0.034 * sin(a * 3.0 + t * 1.60)
        + 0.021 * sin(a * 5.0 - t * 1.15)
        + 0.013 * sin(a * 8.0 + t * 2.10)) * uJelly;

    float body = 1.0 - smoothstep(uSpread * 0.25, uSpread, r);

    // Break the outer edge so the mass never terminates on a clean
    // circle — real flood coverage feathers out unevenly.
    body *= 0.55 + 0.62 * fbm(p * 2.4 + seed * 3.1);
    return clamp(body, 0.0, 1.0);
  }

  /**
   * DISPERSED state: a band hugging one trim edge, its inner boundary
   * running a travelling wave.
   *
   * side = -1 pins to the left edge, +1 to the right. Two components at
   * an irrational frequency ratio moving in opposite directions, so the
   * crest pattern doesn't repeat on any period a reader can catch.
   */
  float dispersed(vec2 uv, float side, float aspect, float narrow, float seed) {
    // How far inward from that edge we are, in viewport widths.
    float dx = side < 0.0 ? uv.x : 1.0 - uv.x;

    float t = uTime * 0.55 + uWavePhase + seed;

    float w = sin(uv.y * 7.0 + t) * 0.62
            + sin(uv.y * 11.3 - t * 0.77) * 0.38;

    // Band widths are authored against a desktop sheet, where the text
    // column leaves 0.122 of clear margin. A phone leaves about 0.05,
    // so the same fraction reaches well under the copy. Narrow it.
    float scale = mix(1.0, 0.7, narrow);

    float inner = (uBand + w * uWaveAmp) * scale;

    // Feather scaled to the band so the edge stays equally soft at any
    // width, rather than turning hard as the band thickens.
    float feather = uBand * scale * 0.55;
    float body = 1.0 - smoothstep(inner - feather, inner + feather, dx);

    body *= 0.60 + 0.58 * fbm(vec2(uv.x * aspect, uv.y) * 2.6 + seed * 3.1);
    return clamp(body, 0.0, 1.0);
  }

  /**
   * FORMED state: the ink leaves both trim edges and reassembles into
   * the club's lockup, then comes apart again.
   *
   * The mark is sampled from the real logo's alpha channel rather than
   * redrawn, so what the halftone renders is the actual artwork.
   *
   * The assembly is by horizontal strips, each sliding in along its own
   * axis from alternating sides and locking into place — machine parts
   * arriving on rails, not a dissolve.
   *
   * Strips, specifically, because the transform has to be exactly
   * invertible. A fragment shader only gets to ask "what belongs at this
   * pixel", so a scatter of free-flying pieces has no closed-form
   * answer. Strips move on one axis only and never move vertically, so a
   * strip's row is a function of screen y alone and its source is just
   * x minus travel — every pixel resolves in one sample, and the pieces
   * genuinely fly across open sheet rather than being clipped to a slot.
   * (No backticks in here: this whole shader is a template literal.)
   *
   * The bounds test is on the SOURCE coordinate, not the screen one,
   * which is what lets a strip be drawn far outside the mark's final box
   * while it is still travelling.
   */
  float formed(vec2 uv, float aspect, float narrow, float seed) {
    if (uForm <= 0.002) return 0.0;

    vec2 q = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);

    // Struck a little above centre, leaving the lower sheet for the
    // tagline that sits under it in the DOM.
    q.y -= 0.07;

    // Sized off the sheet's WIDTH, since the lockup is a wide horizontal
    // line: near full width on a phone so it fills the frame, and a
    // comfortable measure on a laptop.
    float mw = mix(0.66, 0.92, narrow) * aspect;
    vec2 box = vec2(mw, mw / uMarkAspect);

    vec2 m = q / box + 0.5;

    // ---- the strips ----
    const float ROWS = 18.0;
    float row = floor(clamp(m.y, 0.0, 0.9999) * ROWS);
    float rh = hash(vec2(row, 3.7));

    // Alternating rows come from opposite edges, so the lockup closes
    // from both sides at once rather than sweeping across.
    float side = mod(row, 2.0) < 0.5 ? -1.0 : 1.0;

    // Staggered starts, so the strips don't arrive as one slab.
    float delay = rh * 0.42;
    float local = clamp((uForm - delay) / max(1.0 - delay, 0.001), 0.0, 1.0);

    // Hard deceleration: fast across the sheet, then settling into the
    // last few percent. This is what gives each strip the sense of being
    // driven into place and stopping dead rather than drifting in.
    local = 1.0 - pow(1.0 - local, 4.0);

    // Measured in mark widths, so every strip clears the sheet entirely
    // at the start of its run regardless of how wide the mark is.
    float travel = (1.0 - local) * (1.7 + rh * 1.3) * side;
    m.x -= travel;

    if (m.x < 0.0 || m.x > 1.0 || m.y < 0.0 || m.y > 1.0) return 0.0;

    // Sampled with v as-is. three.js already applies flipY when it
    // uploads the image, so inverting here as well flips it back and the
    // mark strikes upside down.
    float a = texture2D(uMark, m).a;

    // Same fbm break-up as the other states, so the mark is struck in the
    // same ink and doesn't read as a pasted-in graphic.
    return clamp(a * (0.72 + 0.44 * fbm(vec2(uv.x * aspect, uv.y) * 2.6 + seed * 3.1)), 0.0, 1.0);
  }

  /**
   * One halftone screen. Rotates into the screen's own frame, finds the
   * cell, and grows a dot whose AREA tracks coverage — hence the sqrt,
   * since area goes as r^2. Without it the midtones print far too dark.
   */
  float screenDot(vec2 p, float angle, float cov, vec2 reg) {
    if (cov <= 0.002) return 0.0;

    vec2 sp = rot(angle) * p * uFreq + reg;
    vec2 cell = fract(sp) - 0.5;

    // A square cell is fully covered once r reaches 0.707, so capping
    // well under that guarantees stock still shows through at maximum
    // coverage. Solid flood is something riso can't hold anyway — it
    // roller-marks — so real work is all screens and tints.
    float r = sqrt(clamp(cov, 0.0, 1.0)) * 0.50;

    // Antialias against the on-screen size of one cell, so dots stay
    // crisp at any DPR instead of shimmering.
    float aa = fwidth(length(cell)) * 0.9 + 0.0025;
    return smoothstep(r + aa, r - aa, length(cell));
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uRes.x / max(uRes.y, 1.0);

    // Aspect-corrected space for the gathered mass so it is never
    // stretched by the viewport. The screens, though, are computed in
    // raw uv — a real screen is fixed to the sheet, not to the image.
    vec2 p = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);

    // 0 on a landscape display, 1 on a phone held upright. A phone has
    // barely any margin for the bands to live in — the measure is very
    // nearly the whole sheet — so there the press narrows and lightens
    // into a tint at the trim rather than a composition beside the type.
    float narrow = smoothstep(1.05, 0.70, aspect);

    // Blend the two states. Because the gathered centres sit off to one
    // side and the bands sit at both edges, this reads as the mass
    // splitting and travelling outward rather than as a crossfade.
    float covF = mix(
      gathered(p, uForgeAt, aspect, 0.0),
      dispersed(uv, -1.0, aspect, narrow, 0.0),
      uDisperse
    );
    float covS = mix(
      gathered(p, uSparkAt, aspect, 11.3),
      dispersed(uv, 1.0, aspect, narrow, 11.3),
      uDisperse
    );

    // The mark is struck over whatever state is underneath and then
    // released, so the page returns to exactly the bands it left.
    // Both drums strike it, offset only by their seeds — two passes of
    // the same plate, which is what puts the overprint colour through
    // the middle of the letterforms.
    float mark  = formed(uv, aspect, narrow, 0.0);
    float markS = formed(uv, aspect, narrow, 11.3);
    covF = mix(covF, mark, uForm) * uForgeInk;
    covS = mix(covS, markS, uForm) * uSparkInk;

    float tint = mix(1.0, 0.42, narrow);
    covF *= tint;
    covS *= tint;

    // Screen angles. Apart: the textbook 75/15 separation that exists
    // precisely to kill moiré. Converged: both drift toward 45 and the
    // interference blooms.
    const float DEG = 0.0174532925;
    float angF = mix(75.0, 47.0, uConverge) * DEG;
    float angS = mix(15.0, 43.0, uConverge) * DEG;

    // Each drum is a separate pass, so each gets its own offset and they
    // move against each other.
    float dotF = screenDot(uv, angF, covF,  uReg);
    float dotS = screenDot(uv, angS, covS, -uReg * 1.35);

    // Stock. Uncoated paper is never flat — the fibre showing through is
    // what makes this read as printed rather than rendered.
    float fibre = fbm(uv * vec2(aspect, 1.0) * 420.0) - 0.5;
    vec3 col = uPaper * (1.0 + fibre * 0.045);

    // Multiply, one drum at a time, in pass order. Where both dots land
    // you get Federal Blue x Fluoro Pink for free — the overprint colour
    // is never specified here, it just happens.
    col *= mix(vec3(1.0), uForge, dotF);
    col *= mix(vec3(1.0), uSpark, dotS);

    gl_FragColor = vec4(col, 1.0);
  }
`;
