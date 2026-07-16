import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { afterEach, describe, it } from "node:test";

import { GET } from "../../app/api/admin/google-business-profile-discovery/route";

const originalFetch = globalThis.fetch;
const originalEnv = {
  AUTH_SECRET: process.env.AUTH_SECRET,
  GOOGLE_OAUTH_CLIENT_ID: process.env.GOOGLE_OAUTH_CLIENT_ID,
  GOOGLE_OAUTH_CLIENT_SECRET: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
};

function jsonResponse(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...headers },
  });
}

function createValidState(issuedAt: string) {
  const signature = createHmac("sha256", process.env.AUTH_SECRET ?? "").update(issuedAt).digest("base64url");

  return `${issuedAt}.${signature}`;
}

afterEach(() => {
  globalThis.fetch = originalFetch;

  if (originalEnv.AUTH_SECRET === undefined) delete process.env.AUTH_SECRET;
  else process.env.AUTH_SECRET = originalEnv.AUTH_SECRET;

  if (originalEnv.GOOGLE_OAUTH_CLIENT_ID === undefined) delete process.env.GOOGLE_OAUTH_CLIENT_ID;
  else process.env.GOOGLE_OAUTH_CLIENT_ID = originalEnv.GOOGLE_OAUTH_CLIENT_ID;

  if (originalEnv.GOOGLE_OAUTH_CLIENT_SECRET === undefined) delete process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  else process.env.GOOGLE_OAUTH_CLIENT_SECRET = originalEnv.GOOGLE_OAUTH_CLIENT_SECRET;
});

describe("Google Business Profile discovery rate limits", () => {
  it("classifies account-management 429s without attempting location discovery", async () => {
    process.env.AUTH_SECRET = "test-auth-secret-for-gbp-discovery-rate-limit";
    process.env.GOOGLE_OAUTH_CLIENT_ID = "google-client";
    process.env.GOOGLE_OAUTH_CLIENT_SECRET = "google-secret";

    const calls: string[] = [];

    globalThis.fetch = async (input) => {
      const url = String(input);
      calls.push(url);

      if (url.includes("oauth2.googleapis.com/token")) {
        return jsonResponse({
          access_token: "access-token",
          scope: "openid email https://www.googleapis.com/auth/business.manage",
        });
      }

      if (url.includes("openidconnect.googleapis.com/v1/userinfo")) {
        return jsonResponse({ email: "hello@jcapitalpropertygroup.com" });
      }

      if (url.includes("mybusiness.googleapis.com/v4/accounts")) {
        return jsonResponse({ error: { status: "NOT_FOUND", message: "Legacy endpoint unavailable." } }, 404);
      }

      if (url.includes("mybusinessaccountmanagement.googleapis.com/v1/accounts")) {
        return jsonResponse(
          {
            error: {
              status: "RESOURCE_EXHAUSTED",
              message: "Quota exceeded.",
              details: [{ reason: "RATE_LIMIT_EXCEEDED", domain: "googleapis.com" }],
            },
          },
          429,
          { "retry-after": "123" },
        );
      }

      return jsonResponse({});
    };

    const state = createValidState(Date.now().toString());
    const response = await GET(new Request(`https://preview.example.test/api/admin/google-business-profile-discovery?code=oauth-code&state=${state}`));
    const body = (await response.json()) as {
      ok: boolean;
      errorType?: string;
      retryAfterSeconds?: number;
      safeNextAction?: string;
      accounts: unknown[];
      locations: unknown[];
      locationAttempts: unknown[];
      providerCalled: boolean;
      liveExecutionAllowed: boolean;
    };

    assert.equal(response.status, 200);
    assert.equal(body.ok, false);
    assert.equal(body.errorType, "google_business_profile_rate_limited");
    assert.equal(body.retryAfterSeconds, 123);
    assert.match(body.safeNextAction ?? "", /Wait before/i);
    assert.deepEqual(body.accounts, []);
    assert.deepEqual(body.locations, []);
    assert.deepEqual(body.locationAttempts, []);
    assert.equal(body.providerCalled, true);
    assert.equal(body.liveExecutionAllowed, false);
    assert.equal(calls.some((url) => url.includes("mybusinessbusinessinformation.googleapis.com")), false);
  });
});
