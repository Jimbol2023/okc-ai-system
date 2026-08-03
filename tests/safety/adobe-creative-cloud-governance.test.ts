import assert from "node:assert/strict";
import { test } from "node:test";

import {
  createAdobeGovernanceReport,
  evaluateAdobeAction,
  runAdobePreviewCredentialProbe,
} from "@/lib/adobe-creative-cloud-governance";
import { createUeipPortfolioReport, evaluateUeipGatewayRequest } from "@/lib/universal-enterprise-integration-platform";

test("Adobe UEIP manifests certify without granting live execution", () => {
  const report = createUeipPortfolioReport();
  const adobeManifests = report.manifests.filter((manifest) => manifest.provider === "Adobe");

  assert.equal(adobeManifests.length, 4);
  assert.equal(adobeManifests.every((manifest) => manifest.capabilities.every((capability) => capability.liveExecutionAllowed === false)), true);
  assert.equal(adobeManifests.every((manifest) => manifest.authentication.secretValuesExposed === false), true);
});

test("Adobe read capability still fails closed without feature and scope proof", () => {
  const report = createUeipPortfolioReport();
  const manifest = report.manifests.find((candidate) => candidate.connectorId === "adobe_creative_cloud_assets");
  assert.ok(manifest);

  const decision = evaluateUeipGatewayRequest(
    {
      tenantId: "tenant-a",
      actorId: "operator-1",
      businessModule: "ai_core",
      connectorId: "adobe_creative_cloud_assets",
      capabilityKey: "adobe.assets.metadata.read",
      environment: "preview",
      connectorHealth: "healthy",
      credentialScopes: [],
      featureFlagsVerified: false,
    },
    { manifest },
  );

  assert.equal(decision.decision, "blocked");
  assert.equal(decision.providerCalled, false);
  assert.equal(decision.liveExecutionAllowed, false);
});

test("Adobe safety proof forbids publishing, paid actions, assets, outreach, CRM mutation, scraping, and automation", () => {
  const report = createAdobeGovernanceReport({
    VERCEL_ENV: "preview",
    ADOBE_CLIENT_ID: "client",
    ADOBE_CLIENT_SECRET: "secret",
    ADOBE_ORG_ID: "org",
    ADOBE_ALLOWED_SCOPES: "adobe.express.brief.prepare adobe.firefly.prompt.prepare adobe.assets.metadata.read",
    ADOBE_PROVIDER_CALLS_ALLOWED: "true",
    ADOBE_CREDENTIAL_VERIFIED: "true",
  });

  assert.equal(report.safetyProof.providerCalled, false);
  assert.equal(report.safetyProof.providerWrites, false);
  assert.equal(report.safetyProof.publishing, false);
  assert.equal(report.safetyProof.externalDelivery, false);
  assert.equal(report.safetyProof.paidActions, false);
  assert.equal(report.safetyProof.assetCreation, false);
  assert.equal(report.safetyProof.outreach, false);
  assert.equal(report.safetyProof.crmMutation, false);
  assert.equal(report.safetyProof.scraping, false);
  assert.equal(report.safetyProof.recurringAutomation, false);
  assert.equal(report.safetyProof.liveExecutionAllowed, false);
});

test("Adobe external action attempts produce audit evidence and never call provider", () => {
  const result = evaluateAdobeAction({
    connectorId: "adobe_firefly",
    actionIntent: "paid_generation",
    env: { VERCEL_ENV: "preview", ADOBE_PROVIDER_CALLS_ALLOWED: "true" },
  });

  assert.equal(result.allowed, false);
  assert.equal(result.providerCalled, false);
  assert.equal(result.liveExecutionAllowed, false);
  assert.equal(result.auditEvent.decision, "blocked");
  assert.equal(result.auditEvent.providerCalled, false);
  assert.ok(result.auditEvent.reasonCodes.includes("adobe_external_or_paid_action_blocked"));
});

test("Adobe credential probe may call IMS in Preview but cannot create assets or enable execution", async () => {
  const result = await runAdobePreviewCredentialProbe({
    env: {
      VERCEL_ENV: "preview",
      ADOBE_CLIENT_ID: "client",
      ADOBE_CLIENT_SECRET: "secret",
      ADOBE_ORG_ID: "org",
      ADOBE_ALLOWED_SCOPES: "adobe.express.brief.prepare adobe.firefly.prompt.prepare adobe.assets.metadata.read",
      ADOBE_PROVIDER_CALLS_ALLOWED: "true",
    },
    fetcher: async () => ({
      ok: true,
      status: 200,
      json: async () => ({ access_token: "adobe-secret-token-value", token_type: "bearer", expires_in: 86399 }),
      text: async () => "",
    }),
  });

  assert.equal(result.classification, "ADOBE_PREVIEW_CREDENTIAL_PROBE_VERIFIED");
  assert.equal(result.tokenVerification.providerCalled, true);
  assert.equal(result.safetyProof.credentialProviderCalled, true);
  assert.equal(result.safetyProof.providerWrites, false);
  assert.equal(result.safetyProof.assetCreation, false);
  assert.equal(result.safetyProof.generationEndpointCalled, false);
  assert.equal(result.safetyProof.publishing, false);
  assert.equal(result.safetyProof.paidActions, false);
  assert.equal(result.safetyProof.liveExecutionAllowed, false);
  assert.equal(JSON.stringify(result).includes("adobe-secret-token-value"), false);
});
