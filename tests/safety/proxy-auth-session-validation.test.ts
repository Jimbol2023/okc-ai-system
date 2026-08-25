import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import { NextRequest } from "next/server";

import { AUTH_COOKIE_NAME, createSessionToken } from "@/lib/auth";
import { setSessionRevocationLookupForTest } from "@/lib/security-controls";
import { proxy } from "@/proxy";

const originalEnv = { ...process.env };
const originalFetch = globalThis.fetch;
const originalDateNow = Date.now;
let restoreSessionRevocationLookup = () => undefined;

function replaceEnv(env: NodeJS.ProcessEnv) {
  for (const key of Object.keys(process.env)) {
    delete process.env[key];
  }
  Object.assign(process.env, env);
}

function request(path: string, token?: string) {
  return new NextRequest(`https://jcapital-preview.test${path}`, {
    headers: token ? { cookie: `${AUTH_COOKIE_NAME}=${token}` } : undefined,
  });
}

function tamperToken(token: string) {
  const replacement = token.endsWith("a") ? "b" : "a";
  return `${token.slice(0, -1)}${replacement}`;
}

beforeEach(() => {
  replaceEnv({
    ...originalEnv,
    AUTH_SECRET: "preview-auth-secret-at-least-32-chars",
    ADMIN_EMAIL: "admin@jcapital.test",
    ADMIN_PASSWORD: "preview-admin-password",
    ADMIN_TENANT_ID: "tenant-a",
    VERCEL: "1",
    VERCEL_ENV: "preview",
  });
  restoreSessionRevocationLookup = setSessionRevocationLookupForTest(async () => false);
  globalThis.fetch = originalFetch;
  Date.now = originalDateNow;
});

afterEach(() => {
  restoreSessionRevocationLookup();
  restoreSessionRevocationLookup = () => undefined;
  globalThis.fetch = originalFetch;
  Date.now = originalDateNow;
  replaceEnv(originalEnv);
});

describe("proxy application session validation", () => {
  it("allows a valid signed admin session without recursive self-fetch", async () => {
    let fetchCalls = 0;
    globalThis.fetch = async () => {
      fetchCalls += 1;
      throw new Error("Deployment Protection would block recursive self-fetch");
    };

    const token = await createSessionToken("admin@jcapital.test", { tenantId: "tenant-a", actorId: "admin-a" });
    const response = await proxy(request("/api/admin/infrastructure-health", token));

    assert.equal(response.status, 200);
    assert.equal(fetchCalls, 0);
  });

  it("keeps Preview Deployment Protection from breaking valid session validation", async () => {
    globalThis.fetch = async () => new Response("Deployment Authentication Required", { status: 401 });

    const token = await createSessionToken("admin@jcapital.test", { tenantId: "tenant-a", actorId: "admin-a" });
    const response = await proxy(request("/dashboard", token));

    assert.equal(response.status, 200);
  });

  it("rejects a tampered session signature", async () => {
    const token = await createSessionToken("admin@jcapital.test", { tenantId: "tenant-a" });
    const response = await proxy(request("/api/admin/infrastructure-health", tamperToken(token)));

    assert.equal(response.status, 401);
  });

  it("rejects an expired signed session", async () => {
    const token = await createSessionToken("admin@jcapital.test", { tenantId: "tenant-a" });
    Date.now = () => originalDateNow() + (8 * 24 * 60 * 60 * 1000);

    const response = await proxy(request("/api/admin/infrastructure-health", token));

    assert.equal(response.status, 401);
  });

  it("rejects a revoked signed session", async () => {
    restoreSessionRevocationLookup();
    restoreSessionRevocationLookup = setSessionRevocationLookupForTest(async () => true);

    const token = await createSessionToken("admin@jcapital.test", { tenantId: "tenant-a" });
    const response = await proxy(request("/api/admin/infrastructure-health", token));

    assert.equal(response.status, 401);
  });

  it("rejects a signed session from another tenant", async () => {
    const token = await createSessionToken("admin@jcapital.test", { tenantId: "tenant-b" });
    const response = await proxy(request("/api/admin/infrastructure-health", token));

    assert.equal(response.status, 401);
  });

  it("fails closed when revocation evidence cannot be checked", async () => {
    restoreSessionRevocationLookup();
    restoreSessionRevocationLookup = setSessionRevocationLookupForTest(async () => {
      throw new Error("revocation evidence unavailable");
    });

    const token = await createSessionToken("admin@jcapital.test", { tenantId: "tenant-a" });
    const response = await proxy(request("/api/admin/infrastructure-health", token));

    assert.equal(response.status, 401);
  });
});
