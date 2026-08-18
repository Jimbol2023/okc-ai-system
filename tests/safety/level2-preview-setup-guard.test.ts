import assert from "node:assert/strict";
import test from "node:test";

import { activatePreviewLevel2Policy, assertPreviewLevel2SetupEnvironment } from "@/scripts/setup-level2-autonomy-preview";

const previewEnv = { VERCEL_ENV: "preview", LEVEL2_SETUP_TENANT: "default", DATABASE_URL: "postgresql://preview/db", DIRECT_URL: "postgresql://preview/db", PRODUCTION_DATABASE_URL: "postgresql://production/db" };

test("Preview setup rejects Production and uncertified database identity", () => {
  assert.throws(() => assertPreviewLevel2SetupEnvironment({ VERCEL_ENV: "production", LEVEL2_SETUP_TENANT: "default", DATABASE_URL: "postgresql://preview/db", DIRECT_URL: "postgresql://preview/db" }));
  assert.throws(() => assertPreviewLevel2SetupEnvironment({ VERCEL_ENV: "preview", LEVEL2_SETUP_TENANT: "other", DATABASE_URL: "postgresql://preview/db", DIRECT_URL: "postgresql://preview/db" }));
  assert.throws(() => assertPreviewLevel2SetupEnvironment({ VERCEL_ENV: "preview", LEVEL2_SETUP_TENANT: "default", DATABASE_URL: "postgresql://preview/db" }));
  assert.deepEqual(assertPreviewLevel2SetupEnvironment(previewEnv), { tenantId: "default" });
});

test("Preview setup performs zero writes unless branch-aware identity is certified", async () => {
  let transactions = 0;
  await assert.rejects(() => activatePreviewLevel2Policy(previewEnv, {
    diagnose: async () => ({ classification: "PREVIEW_DATABASE_URL_MISMATCH", activeDatabaseIdentityClassification: "production_database" }) as never,
    db: { $transaction: async () => { transactions += 1; } } as never,
  }));
  assert.equal(transactions, 0);
});
