import assert from "node:assert/strict";
import { test } from "node:test";

import {
  assertAdobePreviewPilotNotDuplicate,
  createAdobeGovernanceReport,
  evaluateAdobeAction,
  redactAdobeValue,
  runAdobePreviewCredentialProbe,
} from "@/lib/adobe-creative-cloud-governance";
import { evaluateConnectorAction, getEnterpriseConnector } from "@/lib/connector-platform";

const completePreviewEnv: NodeJS.ProcessEnv = {
  VERCEL_ENV: "preview",
  ADOBE_CLIENT_ID: "adobe-client-id",
  ADOBE_CLIENT_SECRET: "adobe-client-secret",
  ADOBE_ORG_ID: "adobe-org-id",
  ADOBE_ALLOWED_SCOPES: "adobe.express.brief.prepare adobe.firefly.prompt.prepare adobe.assets.metadata.read",
  ADOBE_PROVIDER_CALLS_ALLOWED: "true",
  ADOBE_CREDENTIAL_VERIFIED: "true",
};

test("Adobe connector family is registered as governed readiness-only connectors", () => {
  const ids = ["adobe_express", "adobe_firefly", "adobe_creative_cloud_assets", "adobe_acrobat"];

  for (const id of ids) {
    const connector = getEnterpriseConnector(id);
    assert.ok(connector, `${id} should be registered`);
    assert.equal(connector.provider, "Adobe");
    assert.equal(connector.healthStatus, "readiness_only");
    assert.equal(connector.safeAutoEligibility, "internal_only");
    assert.equal(connector.supportedActions.every((action) => action.liveExecutionAllowed === false), true);
    assert.equal(connector.writeCapabilities.every((capability) => /blocked/i.test(capability)), true);
  }
});

test("Adobe provider calls are blocked by default when configuration is missing", () => {
  const report = createAdobeGovernanceReport({});

  assert.equal(report.ok, false);
  assert.equal(report.readinessState, "not_configured");
  assert.equal(report.classification, "ADOBE_GOVERNED_READINESS_BLOCKED");
  assert.equal(report.previewCredentialProbe.allowed, false);
  assert.equal(report.safetyProof.providerCalled, false);
  assert.equal(report.safetyProof.publishing, false);
  assert.equal(report.safetyProof.paidActions, false);
  assert.equal(report.environmentContract.missingRequiredVariables.includes("ADOBE_CLIENT_ID"), true);
});

test("Adobe rejects production environment even with complete credentials", () => {
  const report = createAdobeGovernanceReport({ ...completePreviewEnv, VERCEL_ENV: "production" });

  assert.equal(report.ok, false);
  assert.equal(report.readinessState, "blocked");
  assert.equal(report.previewCredentialProbe.providerCalled, false);
  assert.equal(report.previewCredentialProbe.reasonCodes.includes("preview_environment_required"), true);
  assert.equal(report.previewCredentialProbe.reasonCodes.includes("production_environment_rejected"), true);
});

test("Adobe Preview credential probe can become ready without generation or publishing", () => {
  const report = createAdobeGovernanceReport(completePreviewEnv);

  assert.equal(report.ok, true);
  assert.equal(report.readinessState, "credential_verified");
  assert.equal(report.classification, "ADOBE_GOVERNED_READINESS_READY");
  assert.equal(report.previewCredentialProbe.allowed, true);
  assert.equal(report.previewCredentialProbe.providerCalled, false);
  assert.equal(report.previewCredentialProbe.generationEndpointCalled, false);
  assert.equal(report.previewCredentialProbe.assetCreated, false);
  assert.equal(report.previewCredentialProbe.published, false);
  assert.equal(report.previewCredentialProbe.paidAction, false);
});

test("Adobe rejects incomplete or unsafe scope configuration", () => {
  const missingScope = createAdobeGovernanceReport({ ...completePreviewEnv, ADOBE_ALLOWED_SCOPES: "adobe.firefly.prompt.prepare" });
  const unsafe = createAdobeGovernanceReport({ ...completePreviewEnv, ADOBE_ACCESS_TOKEN: "token", ADOBE_PUBLISHING_ALLOWED: "true" });

  assert.equal(missingScope.ok, false);
  assert.equal(missingScope.scopeVerification.approved, false);
  assert.ok(missingScope.scopeVerification.missingScopes.includes("adobe.assets.metadata.read"));
  assert.equal(unsafe.readinessState, "blocked");
  assert.ok(unsafe.environmentContract.unsafeVariables.includes("ADOBE_ACCESS_TOKEN"));
  assert.ok(unsafe.environmentContract.unsafeVariables.includes("ADOBE_PUBLISHING_ALLOWED"));
});

test("Adobe action review blocks publishing, asset creation, paid actions, and production execution", () => {
  const publish = evaluateAdobeAction({ connectorId: "adobe_express", actionIntent: "publish_asset", env: completePreviewEnv });
  const paid = evaluateAdobeAction({ connectorId: "adobe_firefly", actionIntent: "paid_generation", env: completePreviewEnv });
  const productionPrepare = evaluateAdobeAction({ connectorId: "adobe_firefly", actionIntent: "prepare_firefly_prompt", env: { ...completePreviewEnv, VERCEL_ENV: "production" } });

  assert.equal(publish.allowed, false);
  assert.equal(publish.auditEvent.reasonCodes.includes("adobe_external_or_paid_action_blocked"), true);
  assert.equal(paid.allowed, false);
  assert.equal(paid.providerCalled, false);
  assert.equal(productionPrepare.allowed, false);
  assert.equal(productionPrepare.auditEvent.reasonCodes.includes("production_adobe_execution_blocked"), true);
});

test("Adobe internal brief and prompt preparation remain governed and non-executing", () => {
  const express = evaluateConnectorAction({ connectorId: "adobe_express", actionKey: "prepare_adobe_express_brief", module: "AI Creative Growth Studio" });
  const firefly = evaluateAdobeAction({ connectorId: "adobe_firefly", actionIntent: "prepare_firefly_prompt", env: { VERCEL_ENV: "preview" } });

  assert.equal(express.decision, "approval_required");
  assert.equal(express.providerCalled, false);
  assert.equal(express.liveExecutionAllowed, false);
  assert.equal(firefly.allowed, true);
  assert.equal(firefly.auditEvent.providerCalled, false);
  assert.equal(firefly.auditEvent.liveExecutionAllowed, false);
});

test("Adobe duplicate Preview pilot run keys are locked out", () => {
  const first = assertAdobePreviewPilotNotDuplicate("adobe-preview-pilot:env-a:2026-08-01", []);
  const duplicate = assertAdobePreviewPilotNotDuplicate("adobe-preview-pilot:env-a:2026-08-01", ["adobe-preview-pilot:env-a:2026-08-01"]);

  assert.equal(first.ok, true);
  assert.equal(duplicate.ok, false);
  assert.equal(duplicate.reason, "duplicate_adobe_preview_pilot_blocked");
  assert.equal(duplicate.providerCalled, false);
});

test("Adobe readiness report is redacted and contains audit evidence", () => {
  const report = createAdobeGovernanceReport(completePreviewEnv);
  const json = JSON.stringify(report);

  assert.equal(report.environmentContract.secretsExposed, false);
  assert.equal(report.auditEvents.length, 1);
  assert.equal(report.auditEvents[0].eventType, "adobe_governed_action_review");
  assert.equal(json.includes("adobe-client-secret"), false);
  assert.equal(json.includes("ADOBE_CLIENT_SECRET"), true);
  assert.equal(redactAdobeValue("ADOBE_CLIENT_SECRET", "super-secret-value"), "[REDACTED]");
});

test("Adobe Preview credential probe blocks before network outside Preview", async () => {
  let called = false;
  const result = await runAdobePreviewCredentialProbe({
    env: { ...completePreviewEnv, VERCEL_ENV: "production" },
    fetcher: async () => {
      called = true;
      throw new Error("should not call Adobe");
    },
  });

  assert.equal(called, false);
  assert.equal(result.ok, false);
  assert.equal(result.preflight.providerCalled, false);
  assert.equal(result.tokenVerification.attempted, false);
  assert.equal(result.classification, "ADOBE_PREVIEW_CREDENTIAL_PROBE_BLOCKED");
});

test("Adobe Preview credential probe calls only the IMS token endpoint and redacts the token", async () => {
  let calledUrl = "";
  let submittedBody: URLSearchParams | null = null;
  const result = await runAdobePreviewCredentialProbe({
    env: completePreviewEnv,
    fetcher: async (url, init) => {
      calledUrl = url;
      submittedBody = init.body;
      return {
        ok: true,
        status: 200,
        json: async () => ({ access_token: "real-adobe-token", token_type: "bearer", expires_in: 86399 }),
        text: async () => "",
      };
    },
  });

  assert.equal(calledUrl, "https://ims-na1.adobelogin.com/ims/token/v3");
  assert.equal(submittedBody?.get("grant_type"), "client_credentials");
  assert.equal(submittedBody?.get("client_id"), "adobe-client-id");
  assert.equal(submittedBody?.get("client_secret"), "adobe-client-secret");
  assert.equal(submittedBody?.get("scope"), "adobe.assets.metadata.read,adobe.express.brief.prepare,adobe.firefly.prompt.prepare");
  assert.equal(result.ok, true);
  assert.equal(result.preflight.providerCalled, true);
  assert.equal(result.tokenVerification.providerCalled, true);
  assert.equal(result.tokenVerification.tokenReceived, true);
  assert.equal(result.tokenVerification.tokenRedacted, "[REDACTED]");
  assert.equal(result.safetyProof.credentialProviderCalled, true);
  assert.equal(result.safetyProof.generationEndpointCalled, false);
  assert.equal(result.safetyProof.assetCreation, false);
  assert.equal(JSON.stringify(result).includes("real-adobe-token"), false);
  assert.equal(result.classification, "ADOBE_PREVIEW_CREDENTIAL_PROBE_VERIFIED");
});

test("Adobe Preview credential probe reports token failures without generation or asset calls", async () => {
  const result = await runAdobePreviewCredentialProbe({
    env: completePreviewEnv,
    fetcher: async () => ({
      ok: false,
      status: 401,
      json: async () => ({ error: "invalid_client", error_description: "secret rejected" }),
      text: async () => "",
    }),
  });

  assert.equal(result.ok, false);
  assert.equal(result.preflight.providerCalled, true);
  assert.equal(result.tokenVerification.attempted, true);
  assert.equal(result.tokenVerification.providerCalled, true);
  assert.equal(result.tokenVerification.tokenReceived, false);
  assert.equal(result.tokenVerification.errorCode, "invalid_client");
  assert.equal(result.safetyProof.generationEndpointCalled, false);
  assert.equal(result.safetyProof.expressEndpointCalled, false);
  assert.equal(result.safetyProof.assetEndpointCalled, false);
  assert.equal(result.classification, "ADOBE_PREVIEW_CREDENTIAL_PROBE_BLOCKED");
});
