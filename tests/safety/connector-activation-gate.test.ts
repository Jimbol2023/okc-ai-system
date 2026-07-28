import assert from "node:assert/strict";
import { test } from "node:test";

import {
  assertConnectorActivationGateSafety,
  createConnectorActivationGateFromInputs,
} from "@/lib/connector-activation-gate";
import { createConnectorActivationReportFromInputs } from "@/lib/connector-activation-report";
import { createAiEmployeeToolboxReadinessFromInputs } from "@/lib/ai-employee-toolbox-readiness";
import { createAiWorkforceReportFromInputs } from "@/lib/ai-workforce";
import { readOnlyBusinessSafetyFlags, type BusinessDataSnapshotRecord } from "@/lib/read-only-business-connections";

function snapshot(connectorId: string, category: string): BusinessDataSnapshotRecord {
  return {
    snapshotDate: "2026-07-09T14:00:00.000Z",
    provider: "Google",
    connectorId,
    category,
    status: "fresh",
    sourceLabel: `test:${connectorId}`,
    provenance: "test fixture",
    freshness: "2026-07-09T14:00:00.000Z",
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
  const generatedAt = "2026-07-09T14:00:00.000Z";
  const workforce = createAiWorkforceReportFromInputs({ generatedAt });
  const connectorActivationReport = createConnectorActivationReportFromInputs({
    snapshots,
    leads: [],
    env,
  });
  const toolbox = createAiEmployeeToolboxReadinessFromInputs({
    workforce,
    connectorActivationReport,
    generatedAt,
  });

  return createConnectorActivationGateFromInputs({
    toolbox,
    connectorActivationReport,
    generatedAt,
  });
}

test("connector activation gate exposes Google Workspace read-only foundation records", () => {
  const gate = report();
  const connectorIds = gate.records.map((record) => record.connectorId);

  assert.equal(gate.ok, true);
  assert.equal(gate.company, "J Capital Property Group");
  assert.deepEqual(connectorIds.sort(), ["gmail", "google_analytics", "google_business_profile", "google_calendar", "google_drive", "google_search_console", "youtube"]);
  assert.equal(gate.googleWorkspaceFoundation.length, 7);
  assert.ok(gate.highestImpactNext.length > 0);
});

test("missing credentials keep connectors not configured without starting OAuth", () => {
  const gate = report();
  const gmail = gate.records.find((record) => record.connectorId === "gmail");

  assert.ok(gmail);
  assert.equal(gmail.credentialStatus, "missing");
  assert.equal(gmail.healthStatus, "not_configured");
  assert.match(gmail.nextSafeAction, /Set required read-only env\/configuration|Configure read-only credentials/i);
  assert.equal(gate.safety.oauthStarted, false);
  assert.equal(gate.safety.credentialsChanged, false);
});

test("read-only actions are policy-visible but write and prepare actions stay blocked", () => {
  const gate = report({
    GOOGLE_OAUTH_CLIENT_ID: "client-id",
    GOOGLE_OAUTH_CLIENT_SECRET: "client-secret",
    GOOGLE_OAUTH_REFRESH_TOKEN: "refresh-token",
    GOOGLE_SEARCH_CONSOLE_SITE_URL: "https://example.com/",
    GOOGLE_ANALYTICS_PROPERTY_ID: "123456",
    GOOGLE_BUSINESS_PROFILE_LOCATION_ID: "locations/123",
    YOUTUBE_CHANNEL_ID: "channel",
  });
  const gmail = gate.records.find((record) => record.connectorId === "gmail");
  const gbp = gate.records.find((record) => record.connectorId === "google_business_profile");

  assert.ok(gmail);
  assert.ok(gbp);
  assert.ok(gmail.allowedActions.includes("read_gmail_inbox"));
  assert.ok(gbp.allowedActions.includes("read_gbp_performance"));
  assert.ok(gbp.allowedActions.includes("read_gbp_reviews"));
  assert.ok(gmail.forbiddenActions.includes("draft_email"));
  assert.ok(gbp.forbiddenActions.includes("prepare_gbp_post"));
  assert.ok(gate.records.every((record) => record.actionPolicies.every((policy) => !(policy.externalWrite && policy.allowed))));
});

test("certification impact unlocks only read-only levels and blocks Level 4 and Level 5", () => {
  const gate = report({
    GOOGLE_OAUTH_CLIENT_ID: "client-id",
    GOOGLE_OAUTH_CLIENT_SECRET: "client-secret",
    GOOGLE_OAUTH_REFRESH_TOKEN: "refresh-token",
    GOOGLE_SEARCH_CONSOLE_SITE_URL: "https://example.com/",
    GOOGLE_ANALYTICS_PROPERTY_ID: "123456",
    GOOGLE_BUSINESS_PROFILE_LOCATION_ID: "locations/123",
    YOUTUBE_CHANNEL_ID: "channel",
  }, [
    snapshot("gmail", "gmail_inbox"),
    snapshot("google_drive", "google_drive_documents"),
    snapshot("google_search_console", "search_console_performance"),
  ]);

  assert.ok(gate.employeeCertificationImpact.level2UnlockedEmployees.length > 0);
  assert.ok(gate.employeeCertificationImpact.level4BlockedEmployees.length > 0);
  assert.deepEqual(gate.records.map((record) => record.certificationImpact.blockedLevels), gate.records.map(() => [4, 5]));
  assert.ok(gate.records.every((record) => record.certificationImpact.levelUnlocked <= 3));
});

test("connector activation gate safety contract prevents execution drift", () => {
  const gate = report();

  assert.equal(assertConnectorActivationGateSafety(gate), true);
  assert.equal(gate.providerCalled, false);
  assert.equal(gate.liveExecutionAllowed, false);
  assert.equal(gate.safety.readOnly, true);
  assert.equal(gate.safety.providerCalled, false);
  assert.equal(gate.safety.liveExecutionAllowed, false);
  assert.equal(gate.safety.externalProviderWritesAllowed, false);
  assert.equal(gate.safety.connectorActivationEqualsExecution, false);
  assert.equal(gate.records.some((record) => record.providerCalled || record.liveExecutionAllowed), false);
});
