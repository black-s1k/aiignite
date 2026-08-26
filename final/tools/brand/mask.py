#!/usr/bin/env python3
"""
Turn a vendor logo file into an alpha mask for components/Brand.tsx.

The masters live in `assets/brand/` and are never edited; this writes the
derived file into `public/brand/`. Same rule the video clips follow.

---- What this does, and what it deliberately does not ----
The page paints logos with a CSS mask, which reads the file's ALPHA. Every
logo a vendor hands you is opaque — black on white, or a lockup on a dark
card — so it masks as a solid rectangle until the ground is keyed out.
That is the entire job here:

  1. sample the four corners to learn the background colour
  2. alpha = how far each pixel is from that colour, with a soft edge so
     the anti-aliased rim of the artwork does not come out jagged
  3. trim to the ink's bounding box, so `mask-size: contain` fits the mark
     itself rather than the whitespace the vendor shipped around it

It does NOT redraw, restyle or recolour the mark. Keying a background and
cropping a lockup to its icon are both things the vendor's own kit does
for you when it offers an icon-only transparent variant; this only gets
you there from a file that did not.

---- The one case it cannot help with ----
A mark whose identity lives in COLOUR rather than in shape. Silhouette a
flat single-colour glyph and you still have the glyph; silhouette a
gradient-shaded 3D cube or a yellow face with dark eyes and you have a
hexagon and a blob. There is no threshold that fixes that — the
information is not in the file. Get the vendor's monochrome variant.

Run:
  python3 tools/brand/mask.py openai   assets/brand/openai.jpeg
  python3 tools/brand/mask.py n8n      assets/brand/n8n.png --keep-left 0.55
"""

import argparse
import pathlib
import sys

import numpy as np
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT_DIR = ROOT / "public" / "brand"


def build(src: pathlib.Path, keep_left: float | None, soft: float, pad: int, floor: float):
    im = Image.open(src).convert("RGB")
    a = np.asarray(im).astype(np.float32)
    h, w, _ = a.shape

    # The background is whatever the corners agree on. Median of the four,
    # so one corner clipped by the artwork cannot drag the answer.
    k = max(2, min(h, w) // 40)
    corners = np.stack([
        a[:k, :k].reshape(-1, 3),
        a[:k, -k:].reshape(-1, 3),
        a[-k:, :k].reshape(-1, 3),
        a[-k:, -k:].reshape(-1, 3),
    ])
    bg = np.median(corners.reshape(-1, 3), axis=0)

    # Distance from the background, normalised. A soft ramp rather than a
    # hard threshold: the artwork's anti-aliased edge carries real
    # coverage, and thresholding it throws that away and leaves stairs.
    dist = np.linalg.norm(a - bg, axis=2) / (255.0 * np.sqrt(3))

    # A JPEG's ringing around hard edges is real signal to a distance
    # test, and it keys in as a speckled halo around the mark. `floor`
    # is the noise gate: everything under it is ground, and the ramp
    # starts above it rather than at zero.
    alpha = np.clip((dist - floor) / max(soft, 1e-6), 0.0, 1.0)

    # Crop a lockup down to its icon before trimming, or the wordmark
    # stays in the bounding box and the icon ends up a third of the height
    # of the marks beside it.
    if keep_left is not None:
        alpha[:, int(w * keep_left):] = 0.0

    ink = alpha > 0.06
    if not ink.any():
        sys.exit(f"{src.name}: nothing found against the background — check the file")

    ys, xs = np.where(ink)
    y0, y1 = max(0, ys.min() - pad), min(h, ys.max() + 1 + pad)
    x0, x1 = max(0, xs.min() - pad), min(w, xs.max() + 1 + pad)
    alpha = alpha[y0:y1, x0:x1]

    # The mask only reads alpha, so the colour channels are free. White
    # keeps it legible if anyone opens the file to look at it.
    out = np.zeros((*alpha.shape, 4), dtype=np.uint8)
    out[..., :3] = 255
    out[..., 3] = (alpha * 255).astype(np.uint8)

    coverage = float((alpha > 0.5).mean())
    return Image.fromarray(out, "RGBA"), coverage


def main():
    p = argparse.ArgumentParser()
    p.add_argument("name", help="output slug, e.g. openai -> public/brand/openai.png")
    p.add_argument("src", type=pathlib.Path)
    p.add_argument("--keep-left", type=float, default=None,
                   help="keep only this fraction of the width, to drop a wordmark")
    p.add_argument("--soft", type=float, default=0.10,
                   help="width of the alpha ramp; raise it if the edge looks hard")
    p.add_argument("--pad", type=int, default=2)
    p.add_argument("--floor", type=float, default=0.05,
                   help="noise gate; raise it for a JPEG with a speckled halo")
    args = p.parse_args()

    img, coverage = build(args.src, args.keep_left, args.soft, args.pad, args.floor)
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    dst = OUT_DIR / f"{args.name}.png"
    img.save(dst, optimize=True)

    print(f"{dst.relative_to(ROOT)}  {img.width}x{img.height}  ink covers {coverage:.0%} of the box")
    if coverage > 0.75:
        print("  WARNING: nearly the whole box is solid. That is what a colour-dependent")
        print("  logo looks like once silhouetted — check it before shipping it.")


if __name__ == "__main__":
    main()
