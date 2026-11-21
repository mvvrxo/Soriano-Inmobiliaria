import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: { root: process.cwd() },
  // Owners' form: standalone static pages in public/hablemos, reachable only by direct link (no menu entry).
  async rewrites() {
    return [
      { source: "/hablemos", destination: "/hablemos/index.html" },
      { source: "/hablemos/privacidad", destination: "/hablemos/privacidad.html" },
    ];
  },
};

export default nextConfig;
