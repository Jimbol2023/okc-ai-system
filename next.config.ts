import type { NextConfig } from "next";

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "production" ? "" : " 'unsafe-eval'"} https://www.googletagmanager.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com",
  "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com",
  "media-src 'self' https:",
  ...(process.env.NODE_ENV === "production" ? ["upgrade-insecure-requests"] : []),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  ...(process.env.NODE_ENV === "production"
    ? [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" }]
    : []),
];

const nonRuntimeTracePatterns = [
  "./.env*",
  "./.git/**/*",
  "./docs/**/*",
  "./tests/**/*",
  "./accessibility-results/**/*",
  "./storybook-static/**/*",
  "./test-results/**/*",
  "./reports/**/*",
  "./**/*.test.ts",
  "./**/*.test.tsx",
  "./**/*.spec.ts",
  "./**/*.spec.tsx",
  "./**/*.db",
  "./**/*.sqlite*",
  "./generated/prisma/query_engine-windows*.node",
];

const nextConfig: NextConfig = {
  typedRoutes: true,
  allowedDevOrigins: ["127.0.0.1"],
  outputFileTracingExcludes: {
    "/*": nonRuntimeTracePatterns,
    "/middleware": nonRuntimeTracePatterns,
    "/proxy": nonRuntimeTracePatterns,
  },
  outputFileTracingIncludes: {
    "/*": [
      "./generated/prisma/schema.prisma",
      "./generated/prisma/libquery_engine-*.so.node",
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
