import assert from "node:assert/strict";
import { describe, it } from "node:test";

import nextConfig from "@/next.config";

describe("HTTP security headers", () => {
  it("applies CSP and browser hardening to every route", async () => {
    assert.equal(typeof nextConfig.headers, "function");
    const entries = await nextConfig.headers!();
    const headers = Object.fromEntries(entries[0]!.headers.map((header) => [header.key, header.value]));
    assert.match(headers["Content-Security-Policy"], /frame-ancestors 'none'/);
    assert.equal(headers["X-Content-Type-Options"], "nosniff");
    assert.equal(headers["X-Frame-Options"], "DENY");
    assert.equal(headers["Referrer-Policy"], "strict-origin-when-cross-origin");
    assert.match(headers["Permissions-Policy"], /camera=\(\)/);
    if (process.env.NODE_ENV === "production") assert.doesNotMatch(headers["Content-Security-Policy"], /unsafe-eval/);
  });
});
