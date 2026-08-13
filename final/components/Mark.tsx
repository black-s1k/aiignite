/**
 * The club's flame, from the real logo artwork.
 *
 * The file is an alpha plate — white pixels, real transparency — so it
 * is used as a CSS MASK rather than as an <img>. That way the colour
 * comes from the stylesheet and the mark can never drift out of step
 * with the palette: change the flame token and every instance follows.
 * An <img> would bake one colour into the asset forever.
 */
export function Mark({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      data-heat="mark"
      className={`inline-block bg-flame ${className}`}
      style={{
        WebkitMaskImage: "url(/logo-flame.png)",
        maskImage: "url(/logo-flame.png)",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}
