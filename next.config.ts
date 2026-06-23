import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  serverExternalPackages: ["@0gfoundation/0g-compute-ts-sdk"],
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;