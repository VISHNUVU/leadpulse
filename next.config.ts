import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    useWasmBinary: true
  }
};

export default nextConfig;
