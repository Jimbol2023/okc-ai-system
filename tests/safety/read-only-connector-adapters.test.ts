import assert from "node:assert/strict";
import { test } from "node:test";

import { createAiEmployeeToolboxReadinessFromInputs } from "@/lib/ai-employee-toolbox-readiness";
import { createAiWorkforceReportFromInputs } from "@/lib/ai-workforce";
import { createConnectorActivationGateFromInputs } from "@/lib/connector-activation-gate";
import { createConnectorActivationReportFromInputs } from "@/lib/connector-activation-report";
import { createReadOnlyConnectorAdapterReport, createReadOnlyConnectorAdaptersFromGate } from "@/lib/read-only-connector-adapters";

const generatedAt = "2026-07-09T16:00:00.000Z";

function gate(env: NodeJS.ProcessEnv = {}) {
  const workforce = createAiWorkforceReportFromInputs({ generatedAt });
  const activation = createConnectorActivationReportFromInputs({ snapshots: [], leads: [], env });
  const toolbox = createAiEmployeeToolboxReadinessFromInputs({ workforce, connectorActivationReport: activation, generatedAt });

  return createConnectorActivationGateFromInputs({ toolbox, connectorActivationReport: activation, generatedAt });
}

test("read-only connector adapters expose no write method", () => {
  const adapters = createReadOnlyConnectorAdaptersFromGate(gate());

  assert.equal(adapters.length, 7);
  for (const adapter of adapters) {
    assert.equal(adapter.mode, "read_only");
    assert.equal("write" in adapter, false);
    assert.equal("execute" in adapter, false);
    assert.ok(adapter.requiredScopes.length > 0);
  }
});

test("missing credentials block adapter reads into data-gap snapshots", async () => {
  const report = await createReadOnlyConnectorAdapterReport(gate());

  assert.equal(report.providerCalled, false);
  assert.equal(report.liveExecutionAllowed, false);
  assert.equal(report.safety.adapterWritesExposed, false);
  assert.ok(report.health.every((health) => health.status === "not_configured"));
  assert.ok(report.snapshots.every((snapshot) => snapshot.status === "data_gap"));
  assert.ok(report.snapshots.every((snapshot) => snapshot.providerCalled === false));
});

test("ready gate still does not perform live provider reads in Sprint 6", async () => {
  const report = await createReadOnlyConnectorAdapterReport(gate({
    GOOGLE_OAUTH_CLIENT_ID: "client-id",
    GOOGLE_OAUTH_CLIENT_SECRET: "client-secret",
    GOOGLE_OAUTH_REFRESH_TOKEN: "refresh-token",
    GOOGLE_SEARCH_CONSOLE_SITE_URL: "https://example.com/",
    GOOGLE_ANALYTICS_PROPERTY_ID: "123",
    GOOGLE_BUSINESS_PROFILE_LOCATION_ID: "locations/123",
    YOUTUBE_CHANNEL_ID: "channel",
  }));

  assert.equal(report.providerCalled, false);
  assert.ok(report.snapshots.every((snapshot) => snapshot.providerCalled === false));
  assert.ok(report.snapshots.every((snapshot) => snapshot.dataGaps.some((gap) => /disabled|approval|Sprint 6/i.test(gap))));
});
