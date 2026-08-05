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
 * SPARK LEADS EVERYWHERE EXCEPT ITS OWN SECTION'S OPPOSITE. On light
 * stock the ratio between the two columns was compensation — the pale
 * ink needed more area to weigh the same. Here the two inks are close
 * enough in weight (12.5:1 and 7.8:1 on black) that compensation barely
 * applies, so the ratio is doing something else: the flame is the
 * club's colour and the sheet should read green-forward, with the cold
 * ink as counterpoint rather than as an equal.
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
   * usable floors differ because the inks do: Forge stays above ~0.22,
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
  /* The landing page, where the ink is still gathered. Heaviest
     coverage and near-converged screens, so the mass carries live moiré
     while it wobbles. */
  hero: {
    forgeInk: 0.3,
    sparkInk: 0.46,
    band: 0.09,
    waveAmp: 0.028,
    converge: 0.86,
    freq: 108,
  },

  /* The one section that is only an argument. Narrowest bands and the
     calmest wave — it gets out of the way of the sentence. */
  problem: {
    forgeInk: 0.2,
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
     coverage bleaches the result to white; at 0.22 the cold drum lands
     as a sparse offset ghost against the flame instead, which is also
     what a second plate does on a real two-colour print. */
  mark: {
    forgeInk: 0.22,
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
    forgeInk: 0.32,
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
    forgeInk: 0.48,
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
    forgeInk: 0.2,
    sparkInk: 0.56,
    band: 0.068,
    waveAmp: 0.034,
    converge: 0.0,
    freq: 96,
  },

  /* Dates and facts. Thin bands and the finest screen on the page — a
     fine halftone reads as a document, a coarse one as a poster. */
  schedule: {
    forgeInk: 0.19,
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
    forgeInk: 0.42,
    sparkInk: 0.56,
    band: 0.088,
    waveAmp: 0.03,
    converge: 0.85,
    freq: 88,
  },

  /* Colophon. The drums ease off, but they do not come off. */
  colophon: {
    forgeInk: 0.17,
    sparkInk: 0.24,
    band: 0.052,
    waveAmp: 0.018,
    converge: 0.0,
    freq: 132,
  },
};

export const FIRST_CHAPTER = CHAPTERS.hero;

/**
 * Where the gathered mass sits on the landing page, x as a fraction of
 * the half-width so the composition holds on any viewport. Offset from
 * each other so the two drums overlap without coinciding — the overlap
 * is what produces the overprint colour and the moiré.
 *
 * The y values sit low enough that the mass clears the header slug at
 * the top trim. It used to ride higher and bleed over "Fall 2026",
 * which was survivable when the dots were dark on light stock and the
 * type was dark too — on black the dots are the bright thing and they
 * were landing on 11px letter-spaced mono at about 1.7:1.
 */
export const GATHERED = {
  forgeAt: [0.475, -0.04] as [number, number],
  sparkAt: [0.65, 0.0] as [number, number],
  spread: 0.33,
};
