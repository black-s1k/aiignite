import path from "node:path";
import type { NextConfig } from "next";

/**
 * This site is STATIC. Nothing on it needs a server.
 *
 * There are no route handlers, no middleware, no server actions, no
 * `cookies()`/`headers()`, no `next/image`, and no dynamic routes — every
 * one of the six pages is prerendered at build time and the only thing
 * that runs at request time is the heat field, in the browser. So the
 * build emits plain HTML/CSS/JS to `out/` and the whole thing can be
 * hosted on anything that can serve a folder. That is what makes free
 * hosting a real option rather than a compromise.
 *
 * If any of those features ever gets added, `next build` will fail
 * rather than quietly shipping a broken page — which is the point of
 * pinning the output mode here instead of leaving it to the host.
 *
 * `trailingSlash` emits `out/forge/index.html` instead of
 * `out/forge.html`. Both work on some hosts; only the directory form
 * works on ALL of them, because every static server in existence
 * resolves a directory to its index. It costs one character on the URL
 * and buys the freedom to move hosts later without breaking links.
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,

  // This project sits inside another Next app's directory, so root detection
  // walks up and finds the parent lockfile. Pin it to us.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
