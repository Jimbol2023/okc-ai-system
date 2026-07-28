import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  allowedDevOrigins: ["127.0.0.1"],
  outputFileTracingExcludes: {
    "/*": ["./next.config.ts"],
  },
  outputFileTracingIncludes: {
    "/*": [
      "./generated/prisma/schema.prisma",
      "./generated/prisma/libquery_engine-*.so.node",
      "./generated/prisma/query_engine-windows.dll.node",
    ],
  },
};

export default nextConfig;
