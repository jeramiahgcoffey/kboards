import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // legacy/ holds the v1 Vue + Express code during migration; keep it out of the build.
  outputFileTracingExcludes: { "*": ["./legacy/**"] },
};

export default nextConfig;
