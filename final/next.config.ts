import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This project sits inside another Next app's directory, so root detection
  // walks up and finds the parent lockfile. Pin it to us.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
