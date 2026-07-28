import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { createConnectorActivationReportFromInputs } from "./connector-activation-report";
import type { BusinessDataSnapshotRecord } from "./read-only-business-connections";
import type { StoredLead } from "./leads-storage";

const safetyFlags = {
  readOnly: true,
  liveExecutionAllowed: false,
  externalWritesBlocked: true,
  publishingBlocked: true,
  emailSendingBlocked: true,
  smsBlocked: true,
  adsBlocked: true,
  crmMutationBlocked: true,
  providerExecutionBlocked: true,
  oauthWritesBlocked: true,
} as const;

function snapshot(overrides: Partial<BusinessDataSnapshotRecord>): BusinessDataSnapshotRecord {
  return {
    snapshotDate: new Date("2026-07-06T00:00:00.000Z"),
    provider: "Google Search Console",
    connectorId: "google_search_console",
    category: "search_console_performance",
    status: "fresh",
    sourceLabel: "search_console:search_analytics:readonly",
    provenance: "Test read-only snapshot.",
    freshness: "2026-07-06T12:00:00.000Z",
    summary: "20 impressions and 2 clicks.",
    metrics: {},
    records: [],
    dataGaps: [],
    assumptions: [],
    safetyFlags,
    providerCalled: true,
    sent: false,
    published: false,
    crmMutated: false,
    liveExecutionAllowed: false,
    ...overrides,
  };
}

function lead(overrides: Partial<StoredLead> = {}): StoredLead {
  return {
    id: "lead-1",
    timestamp: "2026-07-06T10:00:00.000Z",
    firstName: "Moses",
    lastName: "Seller",
    email: "",
    phone: "4055551212",
    propertyAddress: "123 Main St",
    city: "Oklahoma City",
    state: "OK",
    zipCode: "73102",
    ownerName: "Moses Seller",
    mailingAddress: "",
    county: "Oklahoma",
    parcelId: "",
    situationDetails: "",
    source: "website",
    status: "new",
    notes: [],
    followUps: [],
    analyzer: { arv: "150000", estimatedRepairs: "25000", desiredProfit: "15000" },
    distressFlags: [],
    opportunityScore: "High",
    score: 82,
    priority: "High",
    scoreBreakdown: "Test lead.",
    approvalStatus: "pending_review",
    doNotContact: false,
    requiresHumanApproval: true,
    ...overrides,
  };
}

describe("connector activation report", () => {
  it("classifies implemented provider, internal, and missing-credential connectors without provider calls", () => {
    const report = createConnectorActivationReportFromInputs({
      snapshots: [
        snapshot({ connectorId: "google_search_console", category: "search_console_performance" }),
        snapshot({
          provider: "Internal Lead Database",
          connectorId: "lead_database",
          category: "internal_lead_database",
          sourceLabel: "internal_crm:lead_database:readonly",
          providerCalled: false,
          summary: "1 stored lead.",
        }),
      ],
      leads: [lead()],
      env: {
        GOOGLE_OAUTH_CLIENT_ID: "client",
        GOOGLE_OAUTH_CLIENT_SECRET: "secret",
        GOOGLE_OAUTH_REFRESH_TOKEN: "refresh",
        GOOGLE_SEARCH_CONSOLE_SITE_URL: "https://jcapitalpropertygroup.com",
      },
    });

    const searchConsole = report.connectors.find((connector) => connector.connectorId === "google_search_console");
    const leadDatabase = report.connectors.find((connector) => connector.connectorId === "lead_database");
    const canva = report.connectors.find((connector) => connector.connectorId === "canva");

    assert.equal(report.providerCalled, false);
    assert.equal(report.liveExecutionAllowed, false);
    assert.equal(report.workflowStarted, false);
    assert.equal(report.published, false);
    assert.equal(report.sent, false);
    assert.equal(searchConsole?.status, "connected");
    assert.equal(searchConsole?.implementationStatus, "implemented_read_adapter");
    assert.equal(searchConsole?.roiPriority, 1);
    assert.equal(searchConsole?.dealFlowImpact, "high");
    assert.match(searchConsole?.nextRevenueAction ?? "", /SEO|seller|draft/i);
    assert.equal(leadDatabase?.status, "internal_ready");
    assert.equal(leadDatabase?.implementationStatus, "internal_read_source");
    assert.equal(leadDatabase?.roiPriority, 1);
    assert.equal(canva?.status, "credentials_missing");
    assert.equal(canva?.credentialsPresent, false);
    assert.equal(canva?.roiPriority, 3);
    assert.ok(canva?.blockingRevenueData.some((gap) => gap.includes("ROI tier 3")));
  });

  it("keeps every connector read-only and exposes next required actions", () => {
    const report = createConnectorActivationReportFromInputs({ snapshots: [], leads: [], env: {} });

    assert.ok(report.connectors.length >= 12);
    assert.ok(report.connectors.every((connector) => connector.readOnly));
    assert.ok(report.connectors.every((connector) => connector.safetyFlags.providerCalled === false));
    assert.ok(report.connectors.every((connector) => connector.safetyFlags.liveExecutionAllowed === false));
    assert.ok(report.connectors.every((connector) => connector.nextRequiredAction.length > 0));
    assert.ok(report.connectors.every((connector) => connector.nextRevenueAction.length > 0));
    assert.deepEqual(
      report.connectors.filter((connector) => ["gmail", "google_search_console", "google_analytics", "lead_database", "crm", "property_pipeline"].includes(connector.connectorId)).map((connector) => connector.roiPriority),
      [1, 1, 1, 1, 1, 1],
    );
    assert.ok(report.dataGaps.some((gap) => gap.includes("Gmail") || gap.includes("Google Workspace")));
  });
});
