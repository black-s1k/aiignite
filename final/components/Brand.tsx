import fs from "node:fs";
import path from "node:path";

/**
 * Third-party tool logos, used unmodified.
 *
 * ---- Why these are not in Draw.tsx ----
 * Every other mark on this page is drafted as clean geometry and put
 * through a roughening pass. These CANNOT be: a roughened logo is an
 * ALTERED logo, and altering the mark is the one thing essentially every
 * brand guideline forbids outright. So the drawn set and the borrowed set
 * are two different components on purpose, and the seam between them is
 * honest rather than hidden — a redrawn Anthropic burst or OpenAI knot
 * would read as a knockoff even if nobody minded.
 *
 * They earn their place by being TRUE rather than decorative: six of the
 * seven are named in `lib/content.ts` already, in the Spark tool list or
 * the Forge stack. They are the tools the club actually teaches.
 *
 * ---- Why a CSS mask and not an <img> ----
 * The same argument Mark.tsx used when it was a PNG alpha plate: the
 * colour comes from the stylesheet, so it cannot drift out of step with
 * the palette. A full-colour logo dropped into this page would spend the
 * flame's saturation budget seven more times over, against the rule that
 * the accent is the one saturated colour here. Masked, they are ash like
 * every other mark and they warm with the heat field, because the wrapper
 * carries `data-heat="draw"` exactly like `.draw` does.
 *
 * This is use, not alteration: the shape is the vendor's own file,
 * untouched. Only the ink it is printed in belongs to this page.
 *
 * ---- Sourcing ----
 * Files go in `public/brand/<name>.(svg|png)` and must be:
 *   - the ICON/SYMBOL, not the wordmark. A wordmark in a 34px box is an
 *     unreadable smear, and `mask-size: contain` will letterbox it to
 *     roughly a third of the height the marks beside it have.
 *   - MONOCHROME on a TRANSPARENT ground. The mask reads the file's
 *     alpha, so a logo sitting on a white or coloured rectangle masks as
 *     a solid block — the rectangle is opaque too. Most brand kits ship a
 *     black-on-transparent variant for exactly this. If all you can get
 *     is an opaque file, `tools/brand/mask.py` keys the ground out and
 *     writes the derived PNG here from a master in `assets/brand/`.
 *   - a mark whose identity is its SHAPE. This paints one flat colour
 *     through an alpha channel, so anything carried by hue or gradient —
 *     a shaded 3D cube, a yellow face with dark eyes — silhouettes down
 *     to a featureless blob. There is no setting that recovers it.
 *
 * HuggingFace is NOT in this list, though it is one of the seven. Its
 * mark is a yellow face with dark features, so a one-colour mask fills
 * the eyes and mouth in and leaves a blob — the readable part is hue,
 * and a mask has no hue to give. It is drawn instead, in Draw.tsx.
 *
 * ---- Missing files are not an error ----
 * `present` is resolved ONCE, at module load, which under `output:
 * "export"` means at build time. A name with no file renders nothing at
 * all rather than a broken box, so the hero degrades to the fifteen drawn
 * marks and the build never fails on a logo nobody has downloaded yet.
 *
 * The cost of resolving once: `next dev` will not notice a file you add
 * while it is running. Restart it.
 */

const DIR = path.join(process.cwd(), "public", "brand");

/**
 * Slug -> filename, for whatever is actually on disk.
 *
 * SVG is better and PNG is accepted, because half of these vendors ship
 * their mark as a raster and nothing else. At 30-34px a 200px plate is
 * still oversampled on a 3x screen, so the difference does not show; it
 * would if these were ever set large.
 */
const present: ReadonlyMap<string, string> = new Map(
  (fs.existsSync(DIR) ? fs.readdirSync(DIR) : [])
    .filter((f) => f.endsWith(".svg") || f.endsWith(".png"))
    // SVG wins if both are present.
    .sort()
    .map((f) => [f.replace(/\.(svg|png)$/, ""), f] as const),
);

/** Every slot the page asks for, whether or not the file has landed yet. */
export type BrandName =
  | "anthropic"
  | "openai"
  | "perplexity"
  | "n8n"
  | "cursor"
  | "langchain";

/**
 * `size` is the box the logo is fitted into, in px. Logos are not square
 * — `mask-size: contain` keeps each one's own proportions inside that
 * box, so a wide mark is shorter than a tall one at the same `size`.
 * That is correct, and it is why these are specified a little larger
 * than the drawn marks they sit among.
 */
export function Brand({
  name,
  size,
  className = "",
}: {
  name: BrandName;
  size: number;
  className?: string;
}) {
  const file = present.get(name);
  if (!file) return null;

  return (
    <div
      data-heat="draw"
      aria-hidden
      className={`brand ${className}`}
      style={{
        width: size,
        height: size,
        ["--brand-src" as string]: `url(/brand/${file})`,
      }}
    />
  );
}
