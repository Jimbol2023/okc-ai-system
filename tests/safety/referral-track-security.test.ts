import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { POST } from "@/app/api/referrals/track/route";
import { resetPublicRateLimitForTest } from "@/lib/public-request-guards";

function jsonRequest(body: unknown, headers: Record<string, string> = {}) {
  return new Request("https://jcapital.test/api/referrals/track", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": "203.0.113.7",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

describe("public referral tracking security", () => {
  it("rejects unsupported content types with a minimal safety response", async () => {
    resetPublicRateLimitForTest();
    const response = await POST(new Request("https://jcapital.test/api/referrals/track", {
      method: "POST",
      headers: { "content-type": "text/plain" },
      body: "ref=ABC",
    }));
    const body = await response.json() as { ok: boolean; providerCalled: boolean };

    assert.equal(response.status, 415);
    assert.equal(body.ok, false);
    assert.equal(body.providerCalled, false);
  });

  it("rejects oversized referral tracking payloads", async () => {
    resetPublicRateLimitForTest();
    const response = await POST(jsonRequest({ ref: "ABC", padding: "x".repeat(9000) }, {
      "content-length": "9000",
    }));

    assert.equal(response.status, 413);
  });

  it("rejects invalid schema without exposing validation internals", async () => {
    resetPublicRateLimitForTest();
    const response = await POST(jsonRequest({ ref: "A".repeat(80) }));
    const body = await response.json() as { error?: string; errors?: unknown };

    assert.equal(response.status, 400);
    assert.equal(body.error, "Invalid referral tracking request.");
    assert.equal("errors" in body, false);
  });

  it("rate limits abusive repeated referral tracking requests", async () => {
    resetPublicRateLimitForTest();
    let response = await POST(jsonRequest({ ref: "A".repeat(80), landingPage: "/sell-your-house" }));

    for (let index = 0; index < 61; index += 1) {
      response = await POST(jsonRequest({ ref: "A".repeat(80), landingPage: "/sell-your-house" }));
    }

    assert.equal(response.status, 429);
  });
});
