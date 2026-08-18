import assert from "node:assert/strict";
import test from "node:test";

import { GET } from "@/app/api/company/autonomy/status/route";
import { setAutonomyStatusRouteDepsForTest } from "@/app/api/company/autonomy/status/route-support";
import { getAutonomyStatus } from "@/lib/autonomous-lead-qualification";

test("autonomy status GET delegates only to authenticated read projection", async () => {
  let reads = 0;
  const restore = setAutonomyStatusRouteDepsForTest({
    getAuth: async () => ({ email: "admin@example.test", tenantId: "default" }),
    getStatus: async (tenantId) => { reads += 1; return { ok: true, tenantId, readiness: "not_configured", ceoState: "MATERIAL_EXCEPTION_REQUIRED", exceptionCount: 1, policies: [], departmentSlas: [], latestRun: null, outcomes: [], safety: { providerCalled: false, providerWrite: false, sent: false, published: false, outreach: false, scraping: false, paidEnrichment: false, externalExecutionAllowed: false, liveExecutionAllowed: false } }; },
  });
  try { const response = await GET(new Request("https://example.test/api/company/autonomy/status")); assert.equal(response.status, 200); assert.equal(reads, 1); assert.equal(response.headers.get("cache-control"), "no-store"); } finally { restore(); }
});

test("status projection calls only the four read delegates", async () => {
  const calls: string[] = [];
  const db = {
    autonomyPolicy: { findMany: async () => { calls.push("policy.read"); return []; } },
    departmentSLA: { findMany: async () => { calls.push("sla.read"); return []; } },
    autonomousRunRecord: { findFirst: async () => { calls.push("run.read"); return null; } },
    businessOutcomeEvent: { findMany: async () => { calls.push("outcome.read"); return []; } },
  };
  const result = await getAutonomyStatus("default", db as never);
  assert.deepEqual(calls.sort(), ["outcome.read", "policy.read", "run.read", "sla.read"]);
  assert.equal(result.readiness, "not_configured");
  assert.equal(result.ceoState, "MATERIAL_EXCEPTION_REQUIRED");
});
