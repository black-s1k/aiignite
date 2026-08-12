/**
 * How each section leans on the press.
 *
 * These are *nudges*, not states. The dispersal to the edges is handled
 * entirely by scroll position (see `Press.tsx`), and the ink never
 * leaves the sheet — so everything here is a bounded modulation around
 * a floor, and every `ink` value is well clear of zero.
 *
 * That constraint is the point. An earlier version let each section set
 * its own coverage outright, including near-zero for the text-heavy
 * ones, which made the ink vanish between sections and slam back in at
 * the next. Sections may lean the sheet left or right and thicken or
 * thin it. They may not empty it.
 *
 * Read the two ink columns top to bottom and you get the argument the
 * copy is making: even, even, both up at the fork, hard left through
 * Forge, hard right through Spark, settle, then both at maximum with
 * the screens converged at the one place the reader is asked to act.
 *
 * SPARK LEADS EVERYWHERE EXCEPT ITS OWN SECTION'S OPPOSITE, and the
 * gap between the columns got wider when Forge went white (2026-08-09).
 * Part of that is compensation and part is hierarchy, and they point the
 * same way now: white reads at 17.0:1 against black where the flame
 * reads 14.4:1, so Forge is the BRIGHTER ink and needs the smaller share
 * of the sheet — its whole column came down by about a third. And the
 * flame is the club's colour, so the sheet should read green-forward
 * with white as counterpoint rather than as an equal.
 *
 * Whichever ink is dimmer gets the area. That rule has now pointed in
 * three different directions across this file's life — pale pink on
 * light stock, ice blue on black, white on black — so work it out from
 * the current two values rather than copying any past arrangement.
 *
 * That matters more on black than it did on paper because of how the
 * inks composite. Screening two bright inks together drives the result
 * toward white, so anywhere the drums are balanced the colour is
 * destroyed rather than mixed. Keeping one drum clearly ahead is what
 * stops the page bleaching out — see `mark` below, where it is the
 * whole difference between a green flame and a white smudge.
 *
 * Every number here is also roughly half what it was on light stock.
 * Ink on black only adds, so a dot that was a tint on paper is a light
 * source here; the same coverage floods.
 */

export type Chapter = {
  /**
   * Coverage multiplier per drum. Never near zero — see above. The
   * usable floors differ because the inks do: Forge stays above ~0.10,
   * Spark above ~0.17, and both are still clearly on the sheet there.
   */
  forgeInk: number;
  sparkInk: number;
  /**
   * Band width at the trim edge, as a fraction of viewport width.
   *
   * HARD RULE: `band + waveAmp` must stay under 0.118. That sum is the
   * wave's furthest inward crest, and the content column starts at
   * 0.122 on a 1440 sheet — so anything past it prints dots under the
   * gutter slug and into the measure. Emphasise a section with ink
   * density, screen ruling or converge, not by widening past this.
   *
   * 0.118 assumes moderate coverage. A drum near 1.0 puts real ink at
   * the crest rather than a scatter, so a section that also runs type
   * to the edge of the measure needs more clearance than the ceiling
   * gives — see `spark` below.
   */
  band: number;
  /** How far the band's inner edge travels. Bounded with `band`, above. */
  waveAmp: number;
  /** 0 = screens at the clean 75/15 separation, 1 = converged into moiré. */
  converge: number;
  /** Screen ruling. Coarse reads as a poster, fine reads as a document. */
  freq: number;
};

export const CHAPTERS: Record<string, Chapter> = {
  /* The landing page, where the ink is still gathered into the flame.

     The widest coverage gap on the page apart from the mark, and for
     the same reason: both drums strike the same artwork on one centre,
     so balanced drums would bleach it to white. Held far apart, the
     white drum reads as a rim around a green flame — which is the
     trap doing its job rather than a second colour competing.

     Finer ruling than it used to run, and the screens pulled back from
     full convergence. Both were tuned for an abstract mass, where a
     coarse screen and heavy moiré were the only texture it had. The
     flame has its own structure — narrow licks and the gaps between
     them — and a coarse screen eats it. */
  hero: {
    forgeInk: 0.13,
    sparkInk: 0.62,
    band: 0.09,
    waveAmp: 0.028,
    converge: 0.5,
    freq: 150,
  },

  /* The one section that is only an argument. Narrowest bands and the
     calmest wave — it gets out of the way of the sentence. */
  problem: {
    forgeInk: 0.13,
    sparkInk: 0.28,
    band: 0.06,
    waveAmp: 0.022,
    converge: 0.0,
    freq: 122,
  },

  /* The mark. The one place on the page below the fold where the ink
     leaves the edges — it reassembles off both sides as horizontal
     strips, strikes the club's lockup, and comes apart again, all
     within this one section.

     The finest ruling on the page: a mark struck in a coarse screen
     loses its corners, and this is the only moment that asks the
     halftone to render something with actual edges. Screens
     part-converged so the letterforms carry a little interference
     without it eating the shape.

     The widest gap between the two drums anywhere on the page, and it
     is not emphasis — it is the only thing keeping the logo green. Both
     drums strike the plate, and screening two bright inks at equal
     coverage bleaches the result to white; at 0.14 the white drum lands
     as a sparse rim against the flame instead, which is also
     what a second plate does on a real two-colour print. */
  mark: {
    forgeInk: 0.14,
    sparkInk: 0.8,
    band: 0.07,
    waveAmp: 0.024,
    converge: 0.35,
    freq: 270,
  },

  /* The fork. Both bands equal and thickened: this is the moment the
     two tracks are most clearly two separate things, one down each
     edge, in the same order as the columns between them. */
  tracks: {
    forgeInk: 0.2,
    sparkInk: 0.44,
    band: 0.085,
    waveAmp: 0.03,
    converge: 0.0,
    freq: 100,
  },

  /* Forge. The sheet leans hard left, and the wave calms — this track
     is a fixed sequence, so its ink should look like it knows where it
     is going. Spark drops but stays on the sheet. */
  forge: {
    forgeInk: 0.3,
    sparkInk: 0.22,
    band: 0.082,
    waveAmp: 0.026,
    converge: 0.0,
    freq: 116,
  },

  /* Spark. Leans right, and runs the largest wave on the page — these
     sessions are chosen by a live vote, so the ink genuinely does not
     know where it is going either.

     The band is pulled in tighter than the 0.118 ceiling because this
     is the one section that runs its heavy drum AND right-aligns labels
     to the edge of the measure. The ceiling assumes the crest arrives
     as a scatter; here it arrives as ink, and it was landing on the
     tools labels. */
  spark: {
    forgeInk: 0.13,
    sparkInk: 0.56,
    band: 0.068,
    waveAmp: 0.034,
    converge: 0.0,
    freq: 96,
  },

  /* Dates and facts. Thin bands and the finest screen on the page — a
     fine halftone reads as a document, a coarse one as a poster. */
  schedule: {
    forgeInk: 0.12,
    sparkInk: 0.26,
    band: 0.055,
    waveAmp: 0.02,
    converge: 0.12,
    freq: 150,
  },

  /* Both drums at maximum, the widest bands and the coarsest ruling of
     the page, with the screens converged so the edges bloom back into
     moiré. The only place the reader is asked to do something.

     The bands widen rather than travelling back to the centre: the ink
     stays where it dispersed to, which is the rule for the whole page
     below the fold. */
  signup: {
    forgeInk: 0.26,
    sparkInk: 0.56,
    band: 0.088,
    waveAmp: 0.03,
    converge: 0.85,
    freq: 88,
  },

  /* Colophon. The drums ease off, but they do not come off. */
  colophon: {
    forgeInk: 0.11,
    sparkInk: 0.24,
    band: 0.052,
    waveAmp: 0.018,
    converge: 0.0,
    freq: 132,
  },
};

export const FIRST_CHAPTER = CHAPTERS.hero;

/**
 * Where the flame stands on the landing page. x is a fraction of the
 * half-width, so the composition holds at any viewport; `spread` is its
 * HALF-HEIGHT, and the width follows from the plate's own aspect rather
 * than being set here.
 *
 * ONE centre for both drums. They used to sit a few thousandths apart,
 * which was meant to read as a second pass landing slightly out of
 * register — but an offset puts the entire fringe on one side, so it
 * read as a drop shadow instead. Registration is now exact and the
 * second ink is separated by `trap` below.
 *
 * `y` sits low enough that the flame clears the header slug at the top
 * trim. It used to ride higher and bleed over "Fall 2026", which was
 * survivable when the dots were dark on light stock and the type was
 * dark too — on black the dots are the bright thing and they were
 * landing on 11px letter-spaced mono at about 1.7:1.
 */
export const GATHERED = {
  at: [0.605, 0.0] as [number, number],
  spread: 0.31,

  /**
   * How much larger the cold plate is struck, as a fraction. A SPREAD,
   * in the printer's sense: the under-colour is deliberately fattened
   * so no hairline of stock can show at a colour boundary. Here it is
   * what turns the second ink into an even rim around the whole flame
   * rather than a shadow along one edge.
   *
   * It is applied to the white drum only — spreading both would just
   * make one larger flame with no rim at all — and the rim it produces
   * grows with distance from the centre, so it is finest where the
   * artwork is dense and widest at the tips. That is how a spread
   * behaves on a press too.
   *
   * Sharing one centre is also why the hero runs its drums so far apart
   * in coverage. Screening two bright inks bleaches toward white, and
   * these now overlap everywhere; the white drum is held right down so
   * the flame stays green with an edge instead of going pale.
   */
  trap: 0.05,
};
