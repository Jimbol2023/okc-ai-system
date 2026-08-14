import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { NextRequest } from "next/server";

import { createSessionToken } from "@/lib/auth";
import { isGovernedCronRequest, proxy } from "@/proxy";

const previousEnv = { ...process.env };

function restoreEnv() {
  process.env = { ...previousEnv };
}

function request(path: string, headers: HeadersInit = {}) {
  return new NextRequest(`https://jcapital.test${path}`, { headers });
}

describe("proxy cron boundary", () => {
  it("allows valid CRON_SECRET auth to reach the governed daily-startup route boundary", () => {
    process.env.CRON_SECRET = "cron-secret-at-least-32-characters";
    const req = request("/api/company/executive-autonomy/daily-startup", {
      authorization: "Bearer cron-secret-at-least-32-characters",
    });

    assert.equal(isGovernedCronRequest(req), true);
    restoreEnv();
  });

  it("rejects missing cron auth at the proxy boundary", async () => {
    process.env.CRON_SECRET = "cron-secret-at-least-32-characters";
    const response = await proxy(request("/api/company/executive-autonomy/daily-startup"));

    assert.equal(response.status, 401);
    restoreEnv();
  });

  it("rejects invalid cron auth at the proxy boundary", async () => {
    process.env.CRON_SECRET = "cron-secret-at-least-32-characters";
    const response = await proxy(request("/api/company/executive-autonomy/daily-startup", {
      authorization: "Bearer wrong-token",
    }));

    assert.equal(response.status, 401);
    restoreEnv();
  });

  it("does not let a valid cron token access unrelated authenticated API routes", async () => {
    process.env.CRON_SECRET = "cron-secret-at-least-32-characters";
    const response = await proxy(request("/api/admin/infrastructure-health", {
      authorization: "Bearer cron-secret-at-least-32-characters",
    }));

    assert.equal(response.status, 401);
    restoreEnv();
  });

  it("keeps normal browser session auth unchanged", async () => {
    process.env.AUTH_SECRET = "test-auth-secret-at-least-32-characters";
    process.env.ADMIN_EMAIL = "admin@jcapital.test";
    process.env.ADMIN_PASSWORD = "password-at-least-12";
    const token = await createSessionToken("admin@jcapital.test");
    const response = await proxy(request("/api/admin/infrastructure-health", {
      cookie: `okcWholesaleAdminSession=${token}`,
    }));

    assert.equal(response.status, 200);
    restoreEnv();
  });
});
