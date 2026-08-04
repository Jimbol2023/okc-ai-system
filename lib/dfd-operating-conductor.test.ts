import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { createDfdOperatingReportFromInputs, dfdOperatingSafetyFlags } from "./dfd-operating-conductor";
import type { StoredLead } from "./leads-storage";
import type { BusinessDataSnapshotRecord } from "./read-only-business-connections";

const distressFlags = {
  taxDelinquent: false,
  inheritedProperty: false,
  vacantProperty: false,
  foreclosureRisk: false,
  majorRepairs: false,
  tiredLandlord: false,
  urgentTimeline: false,
  outOfStateOwner: false,
};

function lead(overrides: Partial<StoredLead> = {}): StoredLead {
  return {
    id: "lead-1",
    timestamp: "2026-06-01T10:00:00.000Z",
    firstName: "Moses",
    lastName: "Seller",
    email: "",
    phone: "4055551212",
    propertyAddress: "123 Main St",
    city: "Oklahoma City",
    state: "OK",
    zipCode: "73102",
    ownerName: "Moses Seller",
    mailingAddress: "PO Box 1, Oklahoma City, OK",
    county: "Oklahoma",
    parcelId: "parcel-1",
    situationDetails: "Needs repairs",
    source: "d4d_manual",
    status: "new",
    notes: [],
    followUps: [],
    analyzer: { arv: "150000", estimatedRepairs: "25000", desiredProfit: "15000" },
    distressFlags,
    opportunityScore: "High",
    score: 82,
    priority: "High",
    scoreBreakdown: "High-priority test lead.",
    approvalStatus: "pending_review",
    doNotContact: false,
    requiresHumanApproval: true,
    ...overrides,
  };
}

function snapshot(): BusinessDataSnapshotRecord {
  return {
    tenantId: "tenant-alpha",
    snapshotDate: new Date("2026-07-06T00:00:00.000Z"),
    provider: "Google Search Console",
    connectorId: "google_search_console",
    category: "search_console_performance",
    status: "fresh",
    sourceLabel: "search_console:search_analytics:readonly",
    provenance: "Test snapshot.",
    freshness: "2026-07-06T12:00:00.000Z",
    summary: "20 impressions and 2 clicks.",
    metrics: { impressions: 20, clicks: 2 },
    records: [{ page: "/sell-my-house" }],
    dataGaps: [],
    assumptions: [],
    safetyFlags: {
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
    },
    providerCalled: true,
    sent: false,
    published: false,
    crmMutated: false,
    liveExecutionAllowed: false,
  };
}

describe("DFD operating conductor", () => {
  it("ranks governance stops ahead of distress and revenue signals", () => {
    const report = createDfdOperatingReportFromInputs({
      tenantId: "tenant-alpha",
      leads: [
        lead({ id: "blocked", propertyAddress: "100 Stop St", doNotContact: true, score: 30, priority: "Low" }),
        lead({
          id: "distress",
          propertyAddress: "200 Distress St",
          distressFlags: { ...distressFlags, vacantProperty: true, majorRepairs: true },
          score: 90,
          priority: "High",
        }),
      ],
      snapshots: [snapshot()],
      generatedAt: "2026-07-06T12:00:00.000Z",
    });

    assert.equal(report.topPriorities[0]?.category, "governance_stop");
    assert.equal(report.topPriorities[0]?.leadId, "blocked");
    assert.ok(report.topPriorities.some((priority) => priority.category === "visible_distress" || priority.category === "acquisition_bottleneck"));
    assert.ok(report.departmentRoutes.some((route) => route.department === "Operations AI"));
    assert.ok(report.departmentRoutes.some((route) => route.department === "Acquisitions AI"));
  });

  it("keeps DFD operation internal and non-executing", () => {
    const report = createDfdOperatingReportFromInputs({ tenantId: "tenant-alpha", leads: [lead()], snapshots: [snapshot()] });

    assert.deepEqual(report.safetyFlags, dfdOperatingSafetyFlags);
    assert.equal(report.providerCalled, false);
    assert.equal(report.liveExecutionAllowed, false);
    assert.equal(report.workflowStarted, false);
    assert.equal(report.sent, false);
    assert.equal(report.published, false);
    assert.equal(report.safetyFlags.scrapingBlocked, true);
    assert.equal(report.safetyFlags.gpsTrackingBlocked, true);
    assert.equal(report.safetyFlags.crmMutationBlocked, true);
    assert.ok(report.connectorEvidence.some((item) => item.includes("google_search_console")));
    assert.ok(report.draftWorkspaceProof.length > 0);
  });

  it("blocks cross-tenant snapshot evidence from DFD rankings", () => {
    assert.throws(
      () => createDfdOperatingReportFromInputs({
        tenantId: "tenant-alpha",
        leads: [lead()],
        snapshots: [{ ...snapshot(), tenantId: "tenant-beta" }],
      }),
      /cross_tenant_dfd_snapshot_blocked/,
    );
  });
});
