import assert from "node:assert/strict";
import { test } from "node:test";

import { evaluateConnectorAction, evaluateConnectorLifecycle, getConnectorHealth, listEnterpriseConnectors } from "@/lib/connector-platform";
import { getFeatureFlagSnapshot, isFeatureEnabled } from "@/lib/feature-flags";
import { createDemandDiscoveryReport, createExecutiveBriefing, createMarketIntelligenceReport } from "@/lib/phase2-intelligence";

test("feature flags allow governed read-only connectors while keeping execution disabled", () => {
  const snapshot = getFeatureFlagSnapshot();

  assert.equal(isFeatureEnabled("connector_platform"), true);
  assert.equal(isFeatureEnabled("safe_auto_internal"), true);
  assert.equal(isFeatureEnabled("connector_live_reads"), true);
  assert.equal(isFeatureEnabled("connector_google"), true);
  assert.equal(isFeatureEnabled("connector_marketing"), true);
  assert.equal(isFeatureEnabled("connector_communication"), true);
  assert.equal(isFeatureEnabled("safe_auto_limited"), false);
  assert.equal(snapshot.providerCalled, false);
  assert.equal(snapshot.liveExecutionAllowed, false);
});

test("enterprise connectors expose required metadata and no live execution", () => {
  const connectors = listEnterpriseConnectors();
  const gbp = connectors.find((connector) => connector.connectorId === "google_business_profile");

  assert.ok(gbp);
  assert.ok(gbp.requiredPermissions.length > 0);
  assert.ok(gbp.supportedActions.length > 0);
  assert.ok(gbp.readCapabilities.length > 0);
  assert.ok(gbp.humanApprovalRequirements.length > 0);
  assert.equal(gbp.supportedActions.some((action) => action.liveExecutionAllowed), false);
});

test("connector action evaluation falls back when ATTOM is unavailable", () => {
  const plan = evaluateConnectorAction({
    connectorId: "attom",
    actionKey: "verify_ownership",
    module: "Property Intelligence AI",
  });

  assert.equal(plan.decision, "fallback_required");
  assert.equal(plan.fallbackConnectorId, "county_assessor");
  assert.equal(plan.providerCalled, false);
  assert.equal(plan.liveExecutionAllowed, false);
});

test("connector lifecycle external enable remains approval gated", () => {
  const result = evaluateConnectorLifecycle({
    connectorId: "google_business_profile",
    lifecycleAction: "enable",
  });

  assert.equal(result.ok, true);
  assert.equal(result.status, "approval_required");
  assert.equal(result.providerCalled, false);
  assert.equal(result.liveExecutionAllowed, false);
});

test("market and demand intelligence preserve provenance and no-provider boundary", () => {
  const market = createMarketIntelligenceReport();
  const demand = createDemandDiscoveryReport();

  assert.equal(market.providerCalled, false);
  assert.equal(market.liveExecutionAllowed, false);
  assert.ok(market.signals.every((signal) => signal.sourceLabel && signal.provenance && signal.providerCalled === false));
  assert.equal(demand.providerCalled, false);
  assert.ok(demand.opportunities.every((opportunity) => opportunity.sourceLabel && opportunity.explanation && opportunity.providerCalled === false));
});

test("executive briefing includes priorities, connector health, and safety flags", () => {
  const briefing = createExecutiveBriefing("daily");
  const health = getConnectorHealth();

  assert.equal(briefing.providerCalled, false);
  assert.equal(briefing.liveExecutionAllowed, false);
  assert.ok(briefing.priorities.length > 0);
  assert.ok(briefing.connectorHealth.length === health.length);
  assert.ok(briefing.priorities.every((priority) => priority.reason && priority.confidence > 0));
});
