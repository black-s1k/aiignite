/**
 * What the press is doing at each point in the page.
 *
 * The ink is not ambient decoration that happens to sit behind the
 * text — it is running the same argument the copy is. Read down the
 * `converge` and gain columns and you get the structure of the pitch:
 * the two tracks start fused, separate so each can be explained on its
 * own terms, and fuse again at the point where the reader is asked to
 * pick one.
 */

export type Chapter = {
  /**
   * Coverage centre for each drum. x is a fraction of the half-width, so
   * 0 is the middle of the sheet and ±1 is the trim edge at any viewport;
   * values past ±1 park the drum off the sheet entirely. y is absolute,
   * −0.5 to 0.5, bottom to top. Keeping x proportional is what stops the
   * composition sliding off the side of a phone.
   */
  forgeAt: [number, number];
  sparkAt: [number, number];
  /** 0 = drum lifted off the sheet, 1 = full flood. */
  forgeGain: number;
  sparkGain: number;
  /** How far coverage reaches from its centre. */
  spread: number;
  /** Domain-warp strength — how much the ink wanders. */
  turb: number;
  /** 0 = screens at the clean 75/15 separation, 1 = converged into moiré. */
  converge: number;
  /** 1 = hold ink out of the centre column so the type block stays clean. */
  margin: number;
  /** Screen ruling. Coarse reads as a poster, fine reads as a photograph. */
  freq: number;
};

export const CHAPTERS: Record<string, Chapter> = {
  /* Both drums heavy and screens converged — the loudest the sheet ever
     gets. Held in the upper right so the headline block prints on clean
     stock: the ink and the type share the sheet on a diagonal rather
     than fighting over the middle of it. */
  hero: {
    forgeAt: [0.475, 0.02],
    sparkAt: [0.65, 0.09],
    forgeGain: 0.62,
    sparkGain: 0.56,
    spread: 0.33,
    turb: 0.3,
    converge: 0.86,
    margin: 0.0,
    freq: 108,
  },

  /* The one section that is only an argument. Ink drops to a stain in
     the margins and gets out of the way of the sentence. */
  problem: {
    forgeAt: [-1.187, -0.18],
    sparkAt: [1.212, 0.22],
    forgeGain: 0.16,
    sparkGain: 0.14,
    spread: 0.3,
    turb: 0.16,
    converge: 0.0,
    margin: 1.0,
    freq: 122,
  },

  /* The fork. Both drums equal, pushed to opposite edges, screens at
     their clean angles — this is the moment the two tracks are most
     clearly two separate things. */
  tracks: {
    forgeAt: [-1.05, 0.0],
    sparkAt: [1.05, 0.0],
    forgeGain: 0.44,
    sparkGain: 0.4,
    spread: 0.32,
    turb: 0.2,
    converge: 0.0,
    margin: 0.55,
    freq: 100,
  },

  /* Forge alone. Blue only, held left against the numbered rail,
     tight and low-turbulence — this track is a sequence and the ink
     should feel like it knows where it's going. */
  forge: {
    forgeAt: [-1.1, 0.02],
    sparkAt: [2.375, 0.0],
    forgeGain: 0.36,
    sparkGain: 0.0,
    spread: 0.3,
    turb: 0.14,
    converge: 0.0,
    margin: 0.85,
    freq: 116,
  },

  /* Spark alone. Pink only, held right, and the most turbulent state
     on the page — these sessions are chosen by a live vote, so the
     ink genuinely does not know where it is going either. */
  spark: {
    forgeAt: [-2.375, 0.0],
    sparkAt: [1.1, 0.0],
    forgeGain: 0.0,
    sparkGain: 0.38,
    spread: 0.32,
    turb: 0.46,
    converge: 0.0,
    margin: 0.85,
    freq: 96,
  },

  /* Dates and facts. Thinnest coverage on the sheet — a fine screen
     reads as a document rather than a poster. */
  schedule: {
    forgeAt: [-1.15, -0.12],
    sparkAt: [1.175, 0.14],
    forgeGain: 0.14,
    sparkGain: 0.12,
    spread: 0.27,
    turb: 0.12,
    converge: 0.12,
    margin: 1.0,
    freq: 150,
  },

  /* Everything back on the sheet at once, screens fully converged, the
     coarsest ruling of the page — the only place the reader is asked to
     do something, and the only place both drums run at max.

     Set high and right, on the same diagonal as the hero, so the page
     bookends. Centring the bloom instead puts the densest moiré on the
     page directly under the supporting copy and the button, which is
     the one place legibility cannot be traded for effect. The headline
     is 15rem of graphite and can sit on the pattern quite happily; a
     17px paragraph cannot. */
  signup: {
    forgeAt: [0.25, 0.18],
    sparkAt: [0.425, 0.26],
    forgeGain: 0.7,
    sparkGain: 0.66,
    spread: 0.42,
    turb: 0.34,
    converge: 1.0,
    margin: 0.1,
    freq: 88,
  },

  /* Colophon. The drums come off. */
  colophon: {
    forgeAt: [-1.187, -0.28],
    sparkAt: [1.212, 0.3],
    forgeGain: 0.11,
    sparkGain: 0.09,
    spread: 0.26,
    turb: 0.1,
    converge: 0.0,
    margin: 0.9,
    freq: 132,
  },
};

export const FIRST_CHAPTER = CHAPTERS.hero;
