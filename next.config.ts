import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output for the Hetzner Docker deploy — copies only the
  // traced files (plus select node_modules) into .next/standalone, so the
  // runtime image doesn't need the full node_modules tree.
  output: "standalone",
};

export default nextConfig;
