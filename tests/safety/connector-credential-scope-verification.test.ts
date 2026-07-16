import assert from "node:assert/strict";
import { test } from "node:test";

import { createAiEmployeeToolboxReadinessFromInputs } from "@/lib/ai-employee-toolbox-readiness";
import { createAiWorkforceReportFromInputs } from "@/lib/ai-workforce";
import { createConnectorActivationGateFromInputs } from "@/lib/connector-activation-gate";
import { createConnectorActivationReportFromInputs } from "@/lib/connector-activation-report";
import {
  assertConnectorCredentialScopeVerificationSafety,
  classifySecretConfig,
  createConnectorCredentialScopeVerificationFromInputs,
} from "@/lib/connector-credential-scope-verification";
import { readOnlyBusinessSafetyFlags, type BusinessDataSnapshotRecord } from "@/lib/read-only-business-connections";

const generatedAt = "2026-07-09T15:00:00.000Z";

function snapshot(connectorId: string, category: string): BusinessDataSnapshotRecord {
  return {
    snapshotDate: generatedAt,
    provider: "Google",
    connectorId,
    category,
    status: "fresh",
    sourceLabel: `test:${connectorId}`,
    provenance: "test fixture",
    freshness: generatedAt,
    summary: `${connectorId} read-only fixture`,
    metrics: {},
    records: [],
    dataGaps: [],
    assumptions: [],
    safetyFlags: readOnlyBusinessSafetyFlags,
    providerCalled: true,
    sent: false,
    published: false,
    crmMutated: false,
    liveExecutionAllowed: false,
  };
}

function report(env: NodeJS.ProcessEnv = {}, snapshots: BusinessDataSnapshotRecord[] = []) {
  const workforce = createAiWorkforceReportFromInputs({ generatedAt });
  const activation = createConnectorActivationReportFromInputs({
    snapshots,
    leads: [],
    env,
  });
  const toolbox = createAiEmployeeToolboxReadinessFromInputs({
    workforce,
    connectorActivationReport: activation,
    generatedAt,
  });
  const gate = createConnectorActivationGateFromInputs({
    toolbox,
    connectorActivationReport: activation,
    generatedAt,
  });

  return createConnectorCredentialScopeVerificationFromInputs({
    gate,
    env,
    generatedAt,
  });
}

test("missing Google env keys are reported safely without provider calls", () => {
  const verification = report();
  const gmail = verification.checklist.find((item) => item.connectorId === "gmail");

  assert.equal(verification.ok, true);
  assert.equal(verification.mode, "local_config_only");
  assert.ok(gmail);
  assert.ok(gmail.missingConfig.includes("GOOGLE_OAUTH_CLIENT_ID"));
  assert.ok(gmail.missingConfig.includes("GOOGLE_OAUTH_CLIENT_SECRET"));
  assert.ok(gmail.missingConfig.includes("GOOGLE_OAUTH_REFRESH_TOKEN"));
  assert.equal(verification.safety.providerCalled, false);
  assert.equal(verification.safety.oauthStarted, false);
  assert.equal(verification.safety.credentialsChanged, false);
});

test("placeholder and malformed values are not treated as valid credentials", () => {
  assert.equal(classifySecretConfig("GOOGLE_OAUTH_REFRESH_TOKEN", "replace-with-your-token"), "placeholder");
  assert.equal(classifySecretConfig("GOOGLE_OAUTH_CLIENT_SECRET", "your-client-secret"), "placeholder");
  assert.equal(classifySecretConfig("GOOGLE_SEARCH_CONSOLE_SITE_URL", "not a url"), "malformed");
  assert.equal(classifySecretConfig("GOOGLE_ANALYTICS_PROPERTY_ID", "property-abc"), "malformed");

  const verification = report({
    GOOGLE_OAUTH_CLIENT_ID: "client-id",
    GOOGLE_OAUTH_CLIENT_SECRET: "your-client-secret",
    GOOGLE_OAUTH_REFRESH_TOKEN: "replace-with-your-token",
    GOOGLE_SEARCH_CONSOLE_SITE_URL: "not a url",
    GOOGLE_ANALYTICS_PROPERTY_ID: "property-abc",
  });
  const searchConsole = verification.checklist.find((item) => item.connectorId === "google_search_console");
  const analytics = verification.checklist.find((item) => item.connectorId === "google_analytics");

  assert.ok(searchConsole?.credentialChecks.some((check) => check.key === "GOOGLE_SEARCH_CONSOLE_SITE_URL" && check.classification === "malformed"));
  assert.ok(analytics?.credentialChecks.some((check) => check.key === "GOOGLE_ANALYTICS_PROPERTY_ID" && check.classification === "malformed"));
  assert.ok(verification.summary.placeholderCredentialChecks > 0);
  assert.ok(verification.summary.malformedCredentialChecks > 0);
});

test("required scopes are listed for every Sprint 6B Google connector", () => {
  const verification = report();
  const scopes = new Set(verification.checklist.flatMap((item) => item.scopeChecks.map((check) => check.scope)));

  assert.ok(scopes.has("https://www.googleapis.com/auth/gmail.readonly"));
  assert.ok(scopes.has("https://www.googleapis.com/auth/drive.metadata.readonly"));
  assert.ok(scopes.has("https://www.googleapis.com/auth/calendar.events.readonly"));
  assert.ok(scopes.has("https://www.googleapis.com/auth/webmasters.readonly"));
  assert.ok(scopes.has("https://www.googleapis.com/auth/analytics.readonly"));
  assert.ok(scopes.has("https://www.googleapis.com/auth/business.manage"));
  assert.ok(scopes.has("https://www.googleapis.com/auth/youtube.readonly"));
  assert.ok(scopes.has("https://www.googleapis.com/auth/yt-analytics.readonly"));
});

test("local granted-scope evidence marks present scopes valid and absent scopes missing", () => {
  const verification = report({
    GOOGLE_OAUTH_GRANTED_SCOPES: "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/drive.metadata.readonly",
  });
  const gmail = verification.checklist.find((item) => item.connectorId === "gmail");
  const analytics = verification.checklist.find((item) => item.connectorId === "google_analytics");

  assert.equal(gmail?.scopeChecks[0]?.status, "valid");
  assert.equal(analytics?.scopeChecks[0]?.status, "missing");
  assert.equal(verification.summary.validScopeChecks, 2);
  assert.ok(verification.summary.missingScopeChecks > 0);
});

test("verification never exposes raw secret values", () => {
  const secretValues = {
    GOOGLE_OAUTH_CLIENT_ID: "client-id-visible-only-in-env",
    GOOGLE_OAUTH_CLIENT_SECRET: "GOCSPX-super-secret-client-secret",
    GOOGLE_OAUTH_REFRESH_TOKEN: "ya29.refresh-token-that-must-not-render",
    GOOGLE_SEARCH_CONSOLE_SITE_URL: "https://example.com/",
    GOOGLE_ANALYTICS_PROPERTY_ID: "123456",
    GOOGLE_BUSINESS_PROFILE_LOCATION_ID: "locations/123",
    YOUTUBE_CHANNEL_ID: "youtube-channel-secret-ish",
  };
  const verification = report(secretValues, [
    snapshot("gmail", "gmail_inbox"),
  ]);
  const serialized = JSON.stringify(verification);

  assert.equal(serialized.includes(secretValues.GOOGLE_OAUTH_CLIENT_SECRET), false);
  assert.equal(serialized.includes(secretValues.GOOGLE_OAUTH_REFRESH_TOKEN), false);
  assert.equal(serialized.includes(secretValues.YOUTUBE_CHANNEL_ID), false);
  assert.equal(verification.safety.rawSecretValuesExposed, false);
  assert.equal(assertConnectorCredentialScopeVerificationSafety(verification), true);
});

test("verification remains local-only and does not unlock Level 4 or Level 5", () => {
  const verification = report({
    GOOGLE_OAUTH_CLIENT_ID: "client-id",
    GOOGLE_OAUTH_CLIENT_SECRET: "client-secret",
    GOOGLE_OAUTH_REFRESH_TOKEN: "refresh-token",
    GOOGLE_OAUTH_GRANTED_SCOPES: "https://www.googleapis.com/auth/gmail.readonly",
  }, [
    snapshot("gmail", "gmail_inbox"),
  ]);

  assert.equal(verification.providerCalled, false);
  assert.equal(verification.liveExecutionAllowed, false);
  assert.equal(verification.safety.localOnly, true);
  assert.equal(verification.safety.externalProviderWritesAllowed, false);
  assert.equal(verification.safety.level4Unlocked, false);
  assert.equal(verification.safety.level5Unlocked, false);
  assert.equal(verification.checklist.some((item) => item.providerCalled || item.liveExecutionAllowed), false);
});
