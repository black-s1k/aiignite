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
 *   GATHERED (uDisperse = 0) — the landing page. Both drums strike the
 *   club's flame, from the real logo artwork, one drum slightly off
 *   register from the other. It is never static: the sample coordinate
 *   is warped so the tips lick and the body draws up and settles.
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
  uniform vec2  uGatherAt;    // where the flame stands, x as a fraction of half-width
  uniform float uSpread;      // the flame's half-height
  uniform float uTrap;        // how much larger the cold plate is struck
  uniform float uJelly;       // soft-body wobble depth

  uniform float uBand;        // dispersed band width, fraction of viewport width
  uniform float uWaveAmp;     // how far the band's inner edge travels
  uniform float uWavePhase;   // scroll-driven, so scrolling pushes the wave along

  uniform sampler2D uMark;    // the club's lockup, alpha channel is the artwork
  uniform float uMarkAspect;  // its own width/height
  uniform sampler2D uFlame;   // the flame alone, same deal
  uniform float uFlameAspect;
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
   * GATHERED state: the club's flame, struck from the real logo and
   * burning.
   *
   * This used to be an abstract mass wobbling like set jelly. The
   * motion was right and the shape was wrong — the club's mark IS a
   * flame, so that is what the landing page should be holding before it
   * disperses, and there is no reason to approximate a shape the logo
   * already provides.
   *
   * The deformation is applied to the SAMPLE COORDINATE, not to a
   * distance field. That is what lets real artwork move like fire: the
   * plate stays fixed and the sheet warps underneath it, so every lick
   * and every gap between licks deforms correctly without any of them
   * being modelled.
   *
   * Two motions, and the weighting is the whole trick. A flame is
   * anchored at its base and free at its tips, so the lateral lick is
   * scaled by h*h — quadratic in height up the plate — which pins the
   * bottom and lets the tips swing. An unweighted displacement just
   * slides the whole flame sideways, which reads as a logo on a wobble
   * rather than as something burning.
   *
   * No bounds test: the plate carries a transparent border and is
   * sampled ClampToEdge, so anywhere off the artwork returns alpha 0 on
   * its own. A hard test would put a straight cut across the licks at
   * exactly the moment they swing furthest.
   */
  float gathered(vec2 p, float aspect, float narrow, float side, float trap, float seed) {
    // A phone is narrow and tall, and the flame is sized off height, so
    // the same numbers that stand it beside the headline on a laptop
    // make it wider than the whole sheet on a handset. It shrinks AND
    // walks back toward the middle — shrinking alone leaves it pinned to
    // a trim edge it no longer reaches.
    float scale = mix(1.0, 0.66, narrow);
    float cx = uGatherAt.x * mix(1.0, 0.35, narrow);

    // ---- the exit ------------------------------------------------
    // Dispersal is a JOURNEY, not a crossfade. This drum's flame is
    // dragged off toward its own trim edge, and everything below is
    // shaped so that what arrives there is already band-like: the ink
    // in the band is visibly the ink that was in the flame.
    //
    // Eased, so it lets go slowly and then runs — a linear exit reads as
    // the flame being slid across by a hand. The exponent is 1.5 rather
    // than 2: squared looked better in isolation but left the flame only
    // half way across at the point the bands had to start arriving, and
    // getting there first is what makes the handoff read as one motion.
    float go = pow(uDisperse, 1.5);

    // Forge starts beside Spark on the right, so it crosses the whole
    // sheet — straight through the headline — while Spark only has to
    // reach the near edge. That asymmetry is the composition: one ink
    // travels through the word THE SPARK to get where it is going.
    float from = cx * aspect * 0.5;
    float to   = side * aspect * 0.5 * 1.04;

    // Drawn to the vertical middle as it goes, because a band is
    // centred on the sheet and the flame is not.
    vec2 q = p - vec2(mix(from, to, go), uGatherAt.y * (1.0 - go));

    float t = uTime * 0.75 + seed;

    // Volume-preserving breath: as it widens it shortens. Kept from the
    // mass, and gentler than it was — on a shape this recognisable a
    // big squash reads as the logo being stretched.
    float s = sin(t * 0.9);
    q.x *= 1.0 + 0.10 * s * uJelly;
    q.y *= 1.0 - 0.08 * s * uJelly;

    // Plate space. Sized off HEIGHT, because a flame is a tall shape and
    // its width should follow from the artwork rather than be set.
    //
    // The box also MORPHS as the flame travels: squeezed in x and drawn
    // out in y, so a compact flame becomes a tall thin column by the
    // time it reaches the trim. Squeezing the box squeezes the artwork
    // inside it, which is what turns the licks into speed lines. This is
    // the whole reason the handoff to the band is invisible — the two
    // shapes agree at the moment they swap.
    //
    // The trap is a SPREAD: the cold plate is struck fractionally larger
    // than the warm one, both on the same centre. That is how a press
    // stops a hairline of stock showing at a colour boundary, and here
    // it is what makes the second ink read as an even rim around the
    // whole flame. The drums used to be offset from each other instead,
    // which put the whole fringe on one side — it looked like a drop
    // shadow, not like registration.
    float sp = uSpread * scale * (1.0 + trap);
    vec2 box = vec2(sp * 2.0 * uFlameAspect * mix(1.0, 0.30, go),
                    sp * 2.0 * mix(1.0, 2.75, go));
    vec2 m = q / box + 0.5;

    float h = clamp(m.y, 0.0, 1.0);
    float taper = h * h;

    // The lick. Three harmonics at unrelated speeds — related speeds
    // resynchronise on a visible cycle and it starts to look like a loop.
    //
    // The SPATIAL frequencies are the load-bearing part, not the
    // amplitudes. These are in radians across the full height, so the
    // slowest term still runs 1.5 cycles from base to tip: at any
    // instant the upper flame leans one way and the part below it leans
    // the other, which is a ripple travelling up. An earlier version
    // used 4.6 — under one cycle — so across the whole upper flame it
    // was effectively a constant offset, and with the h*h weighting on
    // top of it the entire top translated sideways as a slab. Measured
    // 44px of centroid drift on a 440px-wide flame, which read as the
    // logo leaning over rather than as fire.
    //
    // Keep every one of these above ~9.0. Amplitude controls how much
    // it moves; spatial frequency controls whether that movement is a
    // lick or a lean.
    m.x -= (0.020 * sin(h * 9.4 + t * 2.10)
          + 0.013 * sin(h * 15.1 - t * 1.45)
          + 0.008 * sin(h * 23.3 + t * 3.05)) * taper * uJelly;

    // Fire rises. The body draws up and settles back, again strongest at
    // the tips, so the flame gains and loses height instead of bobbing.
    m.y -= 0.045 * sin(t * 1.70 + 1.1) * taper * uJelly;

    float a = texture2D(uFlame, m).a;

    // Same break-up as every other state, so the flame is struck in the
    // same ink and does not read as a pasted-in graphic.
    a *= 0.62 + 0.55 * fbm(p * 2.4 + seed * 3.1);

    // Ink is conserved, so a shape drawn out over more sheet has to get
    // thinner. Without this the flame arrives at the trim heavier than
    // it left, which is the one thing that would give the trick away.
    //
    // Taken further than conservation alone needs, because the cold
    // drum's route to its edge runs straight across the measure. A dense
    // column parked over body copy mid-scroll is a legibility problem
    // however briefly it is there, and a light one reads as speed.
    a *= mix(1.0, 0.40, go);
    return clamp(a, 0.0, 1.0);
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

    // The bands print as a TINT, not as a solid. Deliberately applied
    // here rather than by lowering the chapter ink columns, because
    // those same columns drive the flame and the mark — and those are
    // objects, where the bands are atmosphere running down the margin
    // beside 900px of body copy. Thinning the waves must not thin the
    // logo. Keeping it here also leaves the ink columns comparable
    // across all three states, which is what makes them readable as the
    // argument the page is making.
    body *= 0.56;
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

    // Hand the sheet over from the flame to the bands.
    //
    // NOT a mix(). A mix between two coverage fields is a crossfade by
    // construction: the bands are already fading up while the flame is
    // still fading out, so both are on screen at once and nothing ever
    // appears to have MOVED. That is the difference between an
    // animation and two things taking turns.
    //
    // Instead each state gets its own envelope and they are combined
    // with max(). The windows still overlap — they have to, or there is
    // a hole — but the ORDER is what matters: the band does not start
    // until 0.58, by which point the flame is already two thirds of the
    // way to that same edge and squeezed into a column. So the overlap
    // happens in the SAME PLACE, late, and reads as a handoff rather
    // than as two things at opposite sides of the sheet taking turns.
    // max() rather than a sum, so the shared region does not print
    // double where they agree.
    float leaving  = 1.0 - smoothstep(0.74, 1.0, uDisperse);
    float arriving = smoothstep(0.58, 0.98, uDisperse);

    // Only the white drum carries the trap. Spreading both would just
    // make one bigger flame with no rim at all.
    float covF = max(
      gathered(p, aspect, narrow, -1.0, uTrap, 0.0) * leaving,
      dispersed(uv, -1.0, aspect, narrow, 0.0) * arriving
    );
    float covS = max(
      gathered(p, aspect, narrow, 1.0, 0.0, 11.3) * leaving,
      dispersed(uv, 1.0, aspect, narrow, 11.3) * arriving
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

    // The narrow-viewport tint is a margin guard: on a phone the bands
    // sit almost against the measure, so they drop to a tint rather than
    // printing beside the type. It is released as the mark forms, because
    // the mark is struck in the middle of an otherwise empty sheet and
    // has no measure to crowd — without this the lockup arrives at 42%
    // on exactly the screens where it is the only thing on the page.
    float tint = mix(mix(1.0, 0.42, narrow), 1.0, uForm);
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

    // Stock. Uncoated board is never flat — the tooth showing through is
    // what makes this read as printed rather than rendered.
    //
    // ADDED, not multiplied. A proportional variation on black is
    // arithmetically nothing — any percentage of #000 is #000 — so on
    // this stock the tooth has to be an offset.
    //
    // And ONE-SIDED. The stock is true black, which is the floor: there
    // is nothing below it for the troughs to fall into, so a symmetric
    // offset would just clamp its lower half away and quietly raise the
    // mean. Tooth is grain catching the light, which only ever adds, so
    // the negative half is dropped on purpose rather than by clipping.
    // The result is a sheet that sits at exactly #000 between specks.
    float fibre = max(fbm(uv * vec2(aspect, 1.0) * 420.0) - 0.5, 0.0);
    vec3 col = uPaper + fibre * 0.055;

    // Screen, one drum at a time, in pass order.
    //
    // This is the one line that makes it a screenprint rather than a
    // duplicator. Translucent ink on light stock filters what passes
    // through it, so it multiplies and overlaps go dark. Ink on black
    // stock has nothing to filter — it only adds — so it screens and
    // overlaps go hot. Where both dots land you get the club's colour
    // for free, exactly as before; it is simply the flame's white core
    // now instead of the black field it sat on.
    col = 1.0 - (1.0 - col) * (1.0 - uForge * dotF);
    col = 1.0 - (1.0 - col) * (1.0 - uSpark * dotS);

    gl_FragColor = vec4(col, 1.0);
  }
`;
