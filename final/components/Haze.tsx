/**
 * The air over the headline.
 *
 * ---- Why this exists at all ----
 * The heat used to live INSIDE the letterforms: the weight and width
 * axes swelled with the field, which is the signature the whole build is
 * named for. The masthead is set solid now, so that channel is closed on
 * this one line — and the right place for the heat to go is the medium
 * rather than the object. The type holds still and the air over it
 * refracts, which is what hot air actually does.
 *
 * Running both at once would be mush. One after the other is the idea
 * arriving in two stages.
 *
 * ---- Why refraction and not a glow ----
 * The obvious "heat text" effect is a blurred copy behind the type,
 * lifted and faded. That is a glow with extra steps, and the palette
 * rule is that nothing on this page glows. Displacement is not a glow:
 * it moves light rather than adding it, and it is the only one of the
 * two that a physicist would recognise.
 *
 * ---- How it works ----
 * `feTurbulence` generates a fixed field of fractal noise, and
 * `feDisplacementMap` pushes each pixel of the text sideways and upward
 * by the amount that field says. The noise never changes; only `scale`
 * does, written by HeatField every frame from the same simulation that
 * drives everything else. So the headline warps harder where the reader
 * has just been, and breathes with the ambient standing wave when nobody
 * has touched it.
 *
 * ---- Four things that decide whether this looks expensive or cheap ----
 * The first two were found by building it wrong first. At the obvious
 * settings the headline did not shimmer, it ERODED — the letter edges
 * came out crunchy and chewed, like a badly resized JPEG.
 *
 *   - The noise must be very LOW frequency (0.004 x 0.012). High
 *     frequency means neighbouring pixels displace independently, which
 *     is exactly what eats an edge. Low frequency moves whole runs of
 *     edge together, which is a wave.
 *   - The displacement map is BLURRED before it is used. This is the
 *     other half of the same fix: a smooth field cannot tear an edge.
 *     It also costs amplitude — blurring pulls the noise toward the
 *     neutral 0.5 grey — which is why `scale` runs to 16 here and 7 was
 *     enough before it.
 *   - The noise is taller than it is wide. Isotropic noise reads as
 *     underwater; hot air is stretched vertically because it is going
 *     somewhere.
 *   - `scale` is the ONLY animated attribute. Touching `baseFrequency`
 *     or `seed` per frame regenerates the whole turbulence — it boils
 *     rather than shimmers, and it costs a great deal more.
 *
 * ---- It cannot move the layout ----
 * A filter is paint. The headline's box is identical with it on or off,
 * which is what keeps the cloud mark's measured 3.77em match to the
 * headline true. Anything that solved this with a transform or a font
 * axis would have broken that.
 */
export function Haze() {
  return (
    <svg
      aria-hidden
      focusable="false"
      width="0"
      height="0"
      style={{ position: "absolute" }}
    >
      <filter
        id="heat-haze"
        /* Generous region: displaced pixels leave the text's own box and
           are clipped to the filter region, so a tight one shears the
           tops off the letters at full amplitude. */
        x="-8%"
        y="-16%"
        width="116%"
        height="132%"
        colorInterpolationFilters="sRGB"
      >
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.004 0.012"
          numOctaves={1}
          seed={9}
          stitchTiles="stitch"
          result="noise"
        />
        <feGaussianBlur in="noise" stdDeviation={2} result="field" />
        <feDisplacementMap
          id="heat-haze-amount"
          in="SourceGraphic"
          in2="field"
          scale={0}
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </svg>
  );
}
