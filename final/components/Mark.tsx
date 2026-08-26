/**
 * The club's flame, traced from the real logo artwork.
 *
 * This was a PNG alpha plate used as a CSS mask, so that the colour came
 * from the stylesheet and could never drift out of step with the palette.
 * It is an inline SVG now for the same reason — `fill` reads the flame
 * token — and for one thing the mask could not do: a mask is a single
 * image, so nothing inside it can move on its own. The artwork is FIVE
 * disjoint shapes, and the mark only comes alive if each one can be
 * driven separately.
 *
 * The paths are traced from `public/logo-flame.png`'s alpha channel
 * (find_contours + approximate_polygon at tolerance 0.5), not redrawn.
 *
 * Traced from the ANTI-ALIASED alpha at level 127.5, not from a
 * thresholded copy of it. Tracing the binary costs a systematic half
 * pixel and, worse, follows the staircase — the body came out at 342
 * vertices that way against 145 this way, for a worse fit.
 *
 * Polylines rather than beziers, and the reason is a measurement rather
 * than a preference: the largest this mark can ever render is the
 * intro's, 179 CSS px tall, which is 0.506 px per user unit — so half a
 * unit of tolerance is 0.76 device px at DPR 3. Under one pixel at the
 * biggest size it can reach. If the mark is ever set above ~340 device
 * px tall, re-emit at a lower tolerance or fit curves; this data is not
 * verified past that.
 *
 * `public/logo-flame.png` stays in the repo even though nothing loads it
 * now. It is the source these were traced from and the thing any future
 * check has to be run against.
 *
 * The five parts, named rather than numbered:
 *
 *   BODY    the outer sweep, the tall right blade, the left curl
 *   LICK_*  three DETACHED tongues, already separate in the artwork
 *   CORE    the rounded inner blob — and, with `face`, the head
 *
 * `alive` burns it; the keyframes are in globals.css. `face` opens two
 * eyes in the core. Both default off, so every static instance of the
 * mark on the site renders exactly as it always has.
 */

/* Traced from the plate. Do not hand-edit these — re-run the trace. */

const BODY =
  `M77.5 325.8 68.5 323.6 60.6 319.5 50.5 312.8 40.5 304.5 30.3 293.5
    22.4 282.5 14.3 265.5 10.3 253.5 8.3 243.5 7.2 234.5 7.1 217.5
    10.2 198.5 16.5 179.5 25.3 162.5 34.4 149.5 41.1 141.5 50.5 132.2
    52.5 130.7 55.5 130.1 55.3 133.5 49.2 147.5 46.1 158.5 45.0 167.5
    44.8 180.5 46.1 189.5 47.5 191.0 54.1 177.5 63.2 163.5 72.5 152.5
    88.5 138.3 98.5 131.4 109.5 125.1 122.5 118.3 145.5 107.9
    162.5 98.9 174.5 90.8 182.0 84.5 190.6 75.5 195.9 67.5 199.8 59.5
    202.9 50.5 204.9 39.5 205.0 25.5 204.0 18.5 201.5 9.5 202.5 7.7
    204.5 7.8 208.7 12.5 217.6 27.5 220.9 34.5 224.7 46.5 226.7 56.5
    227.5 66.5 227.0 78.5 225.8 86.5 220.9 101.5 212.6 116.5
    203.9 127.5 177.1 155.5 172.2 161.5 167.1 169.5 163.0 180.5
    162.0 193.5 163.0 201.5 165.0 207.5 170.5 216.4 174.7 220.5
    181.5 223.9 189.5 223.9 195.2 220.5 199.0 215.5 200.8 209.5
    202.4 189.5 206.5 180.7 208.5 179.0 210.5 179.9 211.2 191.5
    219.0 215.5 221.9 231.5 221.9 243.5 220.9 251.5 218.8 260.5
    214.8 272.5 209.8 282.5 201.6 294.5 191.3 305.5 181.5 313.7
    171.2 320.5 165.5 323.7 161.7 323.5 162.4 320.5 166.5 317.5
    176.9 305.5 184.3 294.5 190.9 277.5 192.1 268.5 191.5 267.3
    187.8 274.5 182.8 281.5 175.5 289.0 173.5 289.4 172.2 287.5
    172.9 272.5 171.0 261.5 166.7 251.5 158.7 240.5 156.5 238.1
    153.3 236.5 152.7 243.5 151.0 248.5 147.5 252.8 144.5 253.5
    142.5 253.1 138.0 248.5 129.2 232.5 125.2 218.5 125.2 200.5
    129.1 186.5 131.5 182.4 133.6 176.5 131.5 177.1 119.5 183.9
    97.7 201.5 85.1 215.5 77.2 227.5 71.9 237.5 66.2 254.5 64.1 266.5
    64.3 285.5 63.5 289.8 61.5 290.3 59.5 289.0 48.3 276.5 42.1 267.5
    34.8 252.5 33.9 252.5 35.1 262.5 39.2 275.5 48.2 293.5 58.5 307.3
    64.5 313.6 77.6 324.5 78.3 325.5 77.5 325.8Z`;

/** The inner blob. It reads as a head, which is the whole reason the
 *  mascot could be the logo waking up rather than a character drawn to
 *  stand next to it. */
const CORE =
  `M124.5 333.7 115.5 333.8 110.5 332.8 102.5 329.7 95.5 324.7
    87.3 315.5 81.0 304.5 77.2 288.5 77.2 277.5 78.1 269.5 82.2 254.5
    87.2 244.5 94.3 234.5 104.5 223.3 107.5 221.7 109.0 222.5
    109.5 224.5 108.1 232.5 107.6 241.5 108.0 251.5 109.0 256.5
    113.0 267.5 119.4 276.5 126.5 281.8 136.5 283.9 141.5 282.9
    145.5 281.0 150.7 276.5 154.5 270.1 156.5 269.7 157.7 270.5
    158.7 273.5 159.7 279.5 159.8 291.5 157.7 301.5 153.7 311.5
    150.8 316.5 144.5 323.6 136.5 329.6 129.5 332.7 124.5 333.7Z`;

const LICK_TIP =
  `M161.5 84.8 158.5 85.2 157.5 83.5 162.9 71.5 165.2 57.5 173.9 43.5
    176.5 36.7 178.5 34.7 179.5 35.1 181.5 38.7 182.8 44.5 183.0 54.5
    181.6 61.5 175.5 72.5 169.5 78.8 161.5 84.8Z`;

const LICK_LEFT =
  `M76.5 130.5 75.4 130.5 74.9 129.5 77.5 121.6 80.3 116.5 86.5 108.5
    97.5 99.4 107.5 93.2 111.5 91.5 121.5 84.8 127.1 79.5 132.5 71.0
    133.5 70.1 135.5 70.4 136.1 75.5 133.8 85.5 130.9 91.5 124.7 99.5
    114.5 107.9 94.5 118.0 76.5 130.5Z`;

const LICK_RIGHT =
  `M183.5 188.9 181.5 188.9 181.1 187.5 181.3 178.5 182.3 173.5
    186.5 164.9 191.5 158.2 215.0 139.5 219.7 133.5 225.5 121.5
    226.5 120.3 227.5 120.4 228.8 123.5 228.8 134.5 226.9 142.5
    222.7 150.5 214.5 159.0 201.5 168.1 194.0 174.5 188.2 181.5
    183.5 188.9Z`;

/** The glare.
 *
 * Not two ovals — those read as a sleepy emoji, which is exactly what
 * "boring and dead" meant. Each eye is an ellipse with its top sliced
 * off flat and the whole shape rotated 28 degrees, so the straight brow
 * edge falls TOWARD the nose. Inner corners low is the entire difference
 * between angry and sad, and getting the sign backwards produces a face
 * that looks sorry for itself.
 *
 * Solved against the real head, not eyeballed: the largest pair keeping
 * 3.5 units of clearance from the head's outer edge AND 4 units of gap
 * between the two eyes, so they never merge into one slot at small
 * sizes. Landed at 4.47 / 3.61 clearance with a 5.08 gap.
 */
const EYE_L =
  `M85.8 289.7 86.8 288.5 116.1 304.0 115.7 305.5 115.0 307.0
    114.2 308.3 113.2 309.5 112.0 310.6 110.7 311.6 109.2 312.3
    107.6 312.9 106.0 313.4 104.2 313.6 102.4 313.7 100.6 313.6
    98.8 313.3 96.9 312.8 95.1 312.2 93.4 311.4 91.8 310.4 90.3 309.3
    88.8 308.0 87.6 306.7 86.4 305.2 85.5 303.7 84.7 302.1 84.2 300.5
    83.8 298.8 83.6 297.2 83.7 295.5 83.9 294.0 84.3 292.5 85.0 291.0Z`;

const EYE_R =
  `M151.2 291.7 150.2 290.5 120.9 306.0 121.3 307.5 122.0 309.0
    122.8 310.3 123.8 311.5 125.0 312.6 126.3 313.6 127.8 314.3
    129.4 314.9 131.0 315.4 132.8 315.6 134.6 315.7 136.4 315.6
    138.2 315.3 140.1 314.8 141.9 314.2 143.6 313.4 145.2 312.4
    146.7 311.3 148.2 310.0 149.4 308.7 150.6 307.2 151.5 305.7
    152.3 304.1 152.8 302.5 153.2 300.8 153.4 299.2 153.3 297.5
    153.1 296.0 152.7 294.5 152.0 293.0Z`;

/** Only the intro's flame ever wears the face, so one constant id is
 *  enough and it saves making this a client component for `useId`. If a
 *  second faced mark is ever mounted alongside it this has to become a
 *  prop — two identical ids would both resolve to the first. */
const FACE_MASK = "flame-face";

export function Mark({
  className = "",
  /** Burn continuously. The nav's mark, and nothing else. */
  alive = false,
  /** Open two eyes in the core. The intro's flight, and nothing else. */
  face = false,
}: {
  className?: string;
  alive?: boolean;
  face?: boolean;
}) {
  return (
    <svg
      aria-hidden
      /* The heat field writes `transform` and `filter` on THIS element
         every frame, so nothing inside it may be animated from here.
         The burn lives on the paths below, which the field never
         touches, and the two compose instead of fighting. */
      data-heat="mark"
      viewBox="0 0 236 341"
      className={`flame inline-block ${alive ? "flame-alive " : ""}${className}`}
    >
      {face && (
        /* A mask, not two void-coloured ellipses laid over the flame.
           The eyes have to be real negative space: nothing is ever
           painted on top of the mark, and at the `fly` phase the intro's
           background goes transparent, so anything relying on a black
           ground behind it would stop being a hole at exactly the moment
           it is most visible. */
        <mask id={FACE_MASK}>
          <rect width="236" height="341" fill="#fff" />
          <path className="flame-eye flame-eye-l" d={EYE_L} />
          <path className="flame-eye flame-eye-r" d={EYE_R} />
        </mask>
      )}

      <path className="flame-body" d={BODY} />
      <path className="flame-lick flame-lick-a" d={LICK_TIP} />
      <path className="flame-lick flame-lick-b" d={LICK_LEFT} />
      <path className="flame-lick flame-lick-c" d={LICK_RIGHT} />
      {/* The mask hangs on this path directly, in the plate's own
          coordinates. A mask resolves in the user space of the element
          that references it, so putting it on a transformed ancestor
          slides the eyes off the head. */}
      <path
        className="flame-core"
        d={CORE}
        mask={face ? `url(#${FACE_MASK})` : undefined}
      />
    </svg>
  );
}
