import assert from "node:assert/strict";
import { test } from "node:test";

import { GET as getPreviewDatabaseFingerprintDiagnosisRoute } from "@/app/api/admin/preview-database-fingerprint-diagnosis/route";
import {
  createBranchAwareDatabaseFingerprint,
  diagnosePreviewDatabaseFingerprint,
  type NeonDatabaseIdentityMetadata,
} from "@/lib/preview-database-fingerprint-diagnosis";
import { createDatabaseFingerprint } from "@/lib/preview-live-dry-run-test";

const metadata = {
  databaseName: "jcapital_ai_os",
  currentSchema: "public",
  currentUser: "jcapital_ai_os_owner",
  serverAddress: "10.0.0.20",
  serverPort: 5432,
};
const productionMetadata = {
  ...metadata,
  currentUser: "production_user",
};
const previewV1Fingerprint = createDatabaseFingerprint(metadata);
const productionV1Fingerprint = createDatabaseFingerprint(productionMetadata);
const previewIdentity: NeonDatabaseIdentityMetadata = {
  provider: "neon",
  projectId: "summer-star-72148368",
  branchId: "br-billowing-dawn-atehl28m",
  endpointId: "ep-shiny-glitter-at7sr22n",
  branchName: "vercel-preview",
  databaseName: "jcapital_ai_os",
  role: "jcapital_ai_os_owner",
  region: "aws-us-east-1",
  productionProjectId: "summer-star-72148368",
  productionBranchId: "br-curly-rice-atbrf142",
  productionEndpointId: "ep-summer-star-atn2t27x",
};
const productionIdentity: NeonDatabaseIdentityMetadata = {
  ...previewIdentity,
  branchId: "br-curly-rice-atbrf142",
  endpointId: "ep-summer-star-atn2t27x",
  branchName: "main",
};
const previewV2Fingerprint = createBranchAwareDatabaseFingerprint({
  identity: previewIdentity,
  currentSchema: metadata.currentSchema,
  currentUser: metadata.currentUser,
});
const productionV2Fingerprint = createBranchAwareDatabaseFingerprint({
  identity: productionIdentity,
  currentSchema: metadata.currentSchema,
  currentUser: metadata.currentUser,
});
const matchingPreviewUrls = {
  DATABASE_URL: "postgresql://jcapital_ai_os_owner:secret@ep-shiny-glitter-at7sr22n-pooler.c-9.us-east-1.aws.neon.tech/jcapital_ai_os",
  DIRECT_URL: "postgresql://jcapital_ai_os_owner:other-secret@ep-shiny-glitter-at7sr22n.c-9.us-east-1.aws.neon.tech/jcapital_ai_os",
};
const v2MetadataEnv = {
  UEIP_PREVIEW_NEON_PROJECT_ID: previewIdentity.projectId,
  UEIP_PREVIEW_NEON_BRANCH_ID: previewIdentity.branchId,
  UEIP_PREVIEW_NEON_ENDPOINT_ID: previewIdentity.endpointId,
  UEIP_PREVIEW_NEON_BRANCH_NAME: previewIdentity.branchName,
  UEIP_PREVIEW_NEON_DATABASE_NAME: previewIdentity.databaseName,
  UEIP_PREVIEW_NEON_ROLE: previewIdentity.role,
  UEIP_PREVIEW_NEON_REGION: previewIdentity.region,
  UEIP_PRODUCTION_NEON_PROJECT_ID: productionIdentity.projectId,
  UEIP_PRODUCTION_NEON_BRANCH_ID: productionIdentity.branchId,
  UEIP_PRODUCTION_NEON_ENDPOINT_ID: productionIdentity.endpointId,
};
const baseEnv = {
  VERCEL_ENV: "preview",
  UEIP_PREVIEW_ENVIRONMENT_ID: "vercel:preview:test",
  UEIP_PREVIEW_DATABASE_FINGERPRINT: "legacy-stale-preview-fingerprint",
  UEIP_PRODUCTION_DATABASE_FINGERPRINT: productionV1Fingerprint,
  UEIP_PRODUCTION_DATABASE_FINGERPRINT_V2: productionV2Fingerprint,
  ...matchingPreviewUrls,
  ...v2MetadataEnv,
} as NodeJS.ProcessEnv;

test("v2 fingerprints distinguish two Neon branches with the same database/user/schema", () => {
  const branchClone = createBranchAwareDatabaseFingerprint({
    identity: {
      ...previewIdentity,
      branchId: "br-other-preview-1234",
      endpointId: "ep-other-preview-1234",
    },
    currentSchema: metadata.currentSchema,
    currentUser: metadata.currentUser,
  });

  assert.notEqual(previewV2Fingerprint, productionV2Fingerprint);
  assert.notEqual(previewV2Fingerprint, branchClone);
});

test("diagnosis returns v2 pending approval when branch identity is proven but v2 fingerprint is not configured", async () => {
  const report = await diagnosePreviewDatabaseFingerprint({
    env: baseEnv,
    loadMetadata: async () => metadata,
  });

  assert.equal(report.v1.status, "legacy_stale");
  assert.equal(report.v2.activeFingerprintPrefix, previewV2Fingerprint.slice(0, 8));
  assert.equal(report.v2.configuredPreviewFingerprintPrefix, null);
  assert.equal(report.v2.branchName, "vercel-preview");
  assert.equal(report.v2.previewBranchDiffersFromProduction, true);
  assert.equal(report.v2.previewEndpointDiffersFromProduction, true);
  assert.equal(report.diagnostics.databaseUrlDirectUrlEndpointMatch, true);
  assert.equal(report.diagnostics.providerCalled, false);
  assert.equal(report.classification, "PREVIEW_DATABASE_IDENTITY_V2_PENDING_APPROVAL");
  assert.equal(report.safeRemediation, "approve_preview_v2_fingerprint");
  assert.equal(report.v2.approvalPhraseRequired, `APPROVE_PREVIEW_DATABASE_IDENTITY_V2_${previewV2Fingerprint.slice(0, 8).toUpperCase()}`);
});

test("diagnosis certifies Preview identity only when approved v2 fingerprint is configured", async () => {
  const report = await diagnosePreviewDatabaseFingerprint({
    env: {
      ...baseEnv,
      UEIP_PREVIEW_DATABASE_FINGERPRINT_V2: previewV2Fingerprint,
    } as NodeJS.ProcessEnv,
    loadMetadata: async () => metadata,
  });

  assert.equal(report.activeDatabaseIdentityClassification, "approved_preview_database");
  assert.equal(report.classification, "PREVIEW_DATABASE_IDENTITY_CERTIFIED");
  assert.equal(report.safeRemediation, "none_required");
});

test("pooled and direct URLs for the same Neon endpoint normalize to the same identity", async () => {
  const report = await diagnosePreviewDatabaseFingerprint({
    env: baseEnv,
    loadMetadata: async () => metadata,
  });

  assert.equal(report.databaseUrlDirectUrlLogicalDatabaseMatch, true);
  assert.equal(report.diagnostics.databaseUrlDirectUrlEndpointMatch, true);
  assert.equal(report.diagnostics.databaseUrlEndpointIdPrefix, report.diagnostics.directUrlEndpointIdPrefix);
  assert.match(report.diagnostics.databaseUrlEndpointIdPrefix ?? "", /^ep-shiny-.+\.\.\.r22n$/u);
});

test("Preview branch ID matching Production is blocked", async () => {
  const report = await diagnosePreviewDatabaseFingerprint({
    env: {
      ...baseEnv,
      UEIP_PREVIEW_NEON_BRANCH_ID: productionIdentity.branchId,
      UEIP_PREVIEW_NEON_ENDPOINT_ID: "ep-unique-preview-1234",
    } as NodeJS.ProcessEnv,
    loadMetadata: async () => metadata,
  });

  assert.equal(report.activeDatabaseIdentityClassification, "production_database");
  assert.equal(report.classification, "PREVIEW_DATABASE_URL_MISMATCH");
  assert.equal(report.safeRemediation, "correct_DATABASE_URL");
});

test("missing Neon branch metadata is blocked fail-closed", async () => {
  const env = { ...baseEnv };
  delete env.UEIP_PREVIEW_NEON_BRANCH_ID;
  const report = await diagnosePreviewDatabaseFingerprint({
    env: env as NodeJS.ProcessEnv,
    loadMetadata: async () => metadata,
  });

  assert.equal(report.v2.metadataAvailable, false);
  assert.equal(report.classification, "PREVIEW_DATABASE_IDENTITY_UNVERIFIED");
  assert.equal(report.safeRemediation, "stop_database_identity_unknown");
});

test("production URL variables remain blocked without exposing URLs", async () => {
  const report = await diagnosePreviewDatabaseFingerprint({
    env: {
      ...baseEnv,
      PROD_READONLY_DATABASE_URL: "postgresql://user:secret@production.example.test/jcapital_production",
    } as NodeJS.ProcessEnv,
    loadMetadata: async () => metadata,
  });
  const serialized = JSON.stringify(report);

  assert.equal(report.classification, "PREVIEW_DATABASE_URL_MISMATCH");
  assert.equal(report.diagnostics.productionDatabaseUrlVariablePresent, true);
  assert.equal(serialized.includes("production.example.test"), false);
  assert.equal(serialized.includes("secret"), false);
});

test("diagnosis detects DATABASE_URL and DIRECT_URL endpoint mismatch without printing URLs", async () => {
  const report = await diagnosePreviewDatabaseFingerprint({
    env: {
      ...baseEnv,
      DIRECT_URL: "postgresql://jcapital_ai_os_owner:other-secret@ep-different-preview.c-9.us-east-1.aws.neon.tech/jcapital_ai_os",
    } as NodeJS.ProcessEnv,
    loadMetadata: async () => metadata,
  });

  assert.equal(report.diagnostics.databaseUrlDirectUrlEndpointMatch, false);
  assert.equal(report.classification, "PREVIEW_DATABASE_URL_MISMATCH");
  assert.equal(JSON.stringify(report).includes("postgresql://"), false);
});

test("diagnosis reports URL mismatch when Preview database URLs are absent", async () => {
  const report = await diagnosePreviewDatabaseFingerprint({
    env: {
      VERCEL_ENV: "preview",
      UEIP_PREVIEW_ENVIRONMENT_ID: "vercel:preview:test",
      UEIP_PREVIEW_DATABASE_FINGERPRINT: previewV1Fingerprint,
      UEIP_PRODUCTION_DATABASE_FINGERPRINT: productionV1Fingerprint,
      DATABASE_URL: "",
      DIRECT_URL: "",
      ...v2MetadataEnv,
    } as NodeJS.ProcessEnv,
    loadMetadata: async () => {
      throw new Error("metadata unavailable");
    },
  });

  assert.equal(report.activeDatabaseIdentityClassification, "unknown_database");
  assert.equal(report.activeFingerprintPrefix, null);
  assert.equal(report.databaseUrlDirectUrlLogicalDatabaseMatch, null);
  assert.equal(report.safeRemediation, "correct_DATABASE_URL");
  assert.equal(report.diagnostics.metadataReadOnlyQuerySucceeded, false);
  assert.equal(report.diagnostics.migrationsRun, false);
  assert.equal(report.diagnostics.databaseAltered, false);
  assert.equal(report.diagnostics.dryRunExecuted, false);
  assert.equal(report.classification, "PREVIEW_DATABASE_URL_MISMATCH");
});

test("Preview database fingerprint diagnosis API is admin-only", async () => {
  const response = await getPreviewDatabaseFingerprintDiagnosisRoute(
    new Request("https://example.test/api/admin/preview-database-fingerprint-diagnosis"),
  );
  const body = (await response.json()) as { ok: boolean; error: string };

  assert.equal(response.status, 401);
  assert.equal(body.ok, false);
  assert.equal(body.error, "Unauthorized");
});
