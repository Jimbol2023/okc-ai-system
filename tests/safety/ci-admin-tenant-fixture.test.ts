import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

import { POST as login } from "../../app/api/auth/login/route";
import { createSignedSessionToken, verifySessionTokenClaims } from "../../lib/auth-token";
import { requireTenantId } from "../../lib/tenant-context";

function source(path: string) {
  return readFileSync(join(process.cwd(), path), "utf8");
}

describe("synthetic CI admin tenant fixture", () => {
  it("keeps the tracked CI fixture complete and synthetic", () => {
    const workflow = source(".github/workflows/ci.yml");

    assert.match(workflow, /ADMIN_EMAIL: "ci-admin@jcapital\.test"/u);
    assert.match(workflow, /ADMIN_PASSWORD: "ci-password-not-a-secret"/u);
    assert.match(workflow, /ADMIN_TENANT_ID: "default"/u);
    assert.doesNotMatch(workflow, /ADMIN_(?:EMAIL|PASSWORD|TENANT_ID):\s*\$\{\{/u);
  });

  it("fails closed without the governed admin tenant and exposes no configuration", async () => {
    const priorTenant = process.env.ADMIN_TENANT_ID;
    delete process.env.ADMIN_TENANT_ID;
    try {
      assert.throws(() => requireTenantId(process.env.ADMIN_TENANT_ID, "admin_login_configuration"), /tenant_id_required/u);
      const response = await login(new Request("http://127.0.0.1:3020/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json", origin: "http://127.0.0.1:3020" },
        body: JSON.stringify({ email: "ci-admin@jcapital.test", password: "ci-password-not-a-secret", tenantId: "attacker" }),
      }));
      assert.equal(response.status, 500);
      assert.deepEqual(await response.json(), { ok: false, error: "Unable to sign in right now." });
    } finally {
      if (priorTenant === undefined) delete process.env.ADMIN_TENANT_ID;
      else process.env.ADMIN_TENANT_ID = priorTenant;
    }
  });

  it("binds signed sessions to default and never reads tenant ownership from the request", async () => {
    const priorSecret = process.env.AUTH_SECRET;
    process.env.AUTH_SECRET = "ci-build-only-auth-secret-not-for-runtime";
    try {
      const token = await createSignedSessionToken("ci-admin@jcapital.test", { tenantId: "default" });
      const claims = await verifySessionTokenClaims(token);
      assert.equal(claims?.tenantId, "default");

      const loginRoute = source("app/api/auth/login/route.ts");
      assert.match(loginRoute, /requireTenantId\(process\.env\.ADMIN_TENANT_ID, "admin_login_configuration"\)/u);
      assert.doesNotMatch(loginRoute, /payload\.tenantId|searchParams.*tenant|headers\.get\(["']x-tenant/u);
    } finally {
      if (priorSecret === undefined) delete process.env.AUTH_SECRET;
      else process.env.AUTH_SECRET = priorSecret;
    }
  });
});
