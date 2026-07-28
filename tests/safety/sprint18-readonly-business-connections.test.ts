import assert from "node:assert/strict";
import { test } from "node:test";

import { evaluateConnectorAction, listEnterpriseConnectors } from "@/lib/connector-platform";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { readOnlyAdapterDefinitions, readOnlyBusinessSafetyFlags, validateReadOnlyAdapterDefinitions } from "@/lib/read-only-business-connections";

test("Sprint 18 enables governed live reads while keeping execution blocked", () => {
  assert.equal(isFeatureEnabled("connector_live_reads"), true);
  assert.equal(isFeatureEnabled("connector_google"), true);
  assert.equal(isFeatureEnabled("connector_marketing"), true);
  assert.equal(isFeatureEnabled("connector_communication"), true);
  assert.equal(isFeatureEnabled("safe_auto_limited"), false);
  assert.equal(readOnlyBusinessSafetyFlags.liveExecutionAllowed, false);
  assert.equal(readOnlyBusinessSafetyFlags.externalWritesBlocked, true);
  assert.equal(readOnlyBusinessSafetyFlags.publishingBlocked, true);
  assert.equal(readOnlyBusinessSafetyFlags.emailSendingBlocked, true);
  assert.equal(readOnlyBusinessSafetyFlags.smsBlocked, true);
  assert.equal(readOnlyBusinessSafetyFlags.adsBlocked, true);
  assert.equal(readOnlyBusinessSafetyFlags.crmMutationBlocked, true);
});

test("Sprint 18 adapters declare only approved read-only HTTP methods", () => {
  const definitions = validateReadOnlyAdapterDefinitions();
  const forbiddenTerms = /\b(send|drafts\.send|insert|update|delete|patch|publish|upload|export|reply|create)\b/i;

  for (const definition of definitions) {
    assert.equal(definition.liveExecutionAllowed, false);
    assert.ok(definition.approvedRequests.length > 0);
    assert.ok(definition.approvedRequests.every((request) => request.method === "GET" || request.method === "POST"));
    assert.ok(definition.approvedRequests.every((request) => !forbiddenTerms.test(request.urlIncludes)));
  }
});

test("Sprint 18 connector registry keeps all write actions blocked", () => {
  const connectors = listEnterpriseConnectors().filter((connector) =>
    ["gmail", "google_calendar", "google_drive", "google_search_console", "google_analytics", "google_business_profile", "youtube", "canva"].includes(connector.connectorId),
  );

  assert.ok(connectors.length >= 8);
  for (const connector of connectors) {
    assert.ok(connector.supportedActions.some((action) => action.type === "read"));
    assert.ok(connector.supportedActions.filter((action) => action.type === "write").every((action) => action.risk === "blocked"));
    assert.ok(connector.supportedActions.every((action) => action.liveExecutionAllowed === false));
  }
});

test("Sprint 18 exact read connector actions are allowed only as non-executing plans", () => {
  const readActions = [
    ["gmail", "read_gmail_inbox"],
    ["google_calendar", "read_calendar_events"],
    ["google_drive", "read_drive_documents"],
    ["google_search_console", "read_search_console"],
    ["google_analytics", "read_ga4_traffic"],
    ["google_business_profile", "read_gbp_performance"],
    ["youtube", "read_youtube_channel"],
    ["canva", "read_canva_designs"],
  ] as const;

  for (const [connectorId, actionKey] of readActions) {
    const plan = evaluateConnectorAction({ connectorId, actionKey, module: "Executive AI" });

    assert.notEqual(plan.decision, "blocked");
    assert.equal(plan.providerCalled, false);
    assert.equal(plan.liveExecutionAllowed, false);
    assert.equal(plan.auditRequired, true);
  }
});

test("Sprint 18 adapter set covers requested business systems", () => {
  const categories = new Set(readOnlyAdapterDefinitions.map((definition) => definition.id));

  assert.ok(categories.has("gmail_inbox"));
  assert.ok(categories.has("google_calendar_events"));
  assert.ok(categories.has("google_drive_documents"));
  assert.ok(categories.has("search_console_performance"));
  assert.ok(categories.has("search_console_indexing"));
  assert.ok(categories.has("google_analytics_traffic"));
  assert.ok(categories.has("google_business_profile_performance"));
  assert.ok(categories.has("google_business_profile_reviews"));
  assert.ok(categories.has("youtube_channel"));
  assert.ok(categories.has("canva_designs"));
});
