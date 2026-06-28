import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { createBusinessIntelligenceReport } from "./business-intelligence";
import type { StoredLead } from "./leads-storage";

function lead(overrides: Partial<StoredLead> = {}): StoredLead {
  return {
    id: "lead-1",
    timestamp: "2026-06-01T12:00:00.000Z",
    firstName: "Test",
    lastName: "Lead",
    email: "",
    phone: "4055550100",
    propertyAddress: "123 Main St",
    city: "Oklahoma City",
    state: "OK",
    zipCode: "73102",
    ownerName: "",
    mailingAddress: "",
    county: "",
    parcelId: "",
    situationDetails: "Seller wants a manual review.",
    source: "Facebook",
    status: "new",
    notes: [],
    followUps: [],
    analyzer: {
      arv: "",
      estimatedRepairs: "",
      desiredProfit: "20000",
    },
    distressFlags: {
      taxDelinquent: false,
      inheritedProperty: false,
      vacantProperty: false,
      foreclosureRisk: false,
      majorRepairs: false,
      tiredLandlord: false,
      urgentTimeline: false,
      outOfStateOwner: false,
    },
    opportunityScore: "Low",
    score: 0,
    priority: "Low",
    scoreBreakdown: "",
    ...overrides,
  };
}

describe("business intelligence KPI engine", () => {
  it("returns honest unavailable metrics and data gaps for empty data", () => {
    const report = createBusinessIntelligenceReport({
      leads: [],
      financeEntries: [],
      marketingWorkflow: null,
      knowledgeItems: [],
    });

    assert.equal(report.summary.totalLeads, 0);
    assert.equal(report.summary.closedLeads, 0);
    assert.ok(report.kpis.some((kpi) => kpi.id === "lead_to_offer_time" && kpi.value === "Unavailable"));
    assert.ok(report.kpis.some((kpi) => kpi.id === "offer_to_close_time" && kpi.value === "Unavailable"));
    assert.ok(report.dataGaps.some((gap) => /transition timestamps/i.test(gap)));
    assert.equal(report.safetyFlags.providerCalled, false);
    assert.equal(report.safetyFlags.schemaChanged, false);
  });

  it("calculates finance, conversion, and channel metrics from existing records", () => {
    const report = createBusinessIntelligenceReport({
      leads: [
        lead({ id: "lead-1", status: "closed", score: 90, priority: "High", source: "Facebook" }),
        lead({ id: "lead-2", status: "negotiating", score: 65, priority: "Medium", source: "Facebook" }),
        lead({ id: "lead-3", status: "new", score: 10, priority: "Low", source: "Website" }),
      ],
      financeEntries: [
        { entryType: "marketing_spend", amountCents: 90000, dealReference: null, leadId: null, entryDate: new Date("2026-06-01") },
        { entryType: "deal_revenue", amountCents: 300000, dealReference: "deal-1", leadId: "lead-1", entryDate: new Date("2026-06-02") },
      ],
      marketingWorkflow: null,
      knowledgeItems: [{ status: "active" }],
    });

    assert.equal(report.summary.totalLeads, 3);
    assert.equal(report.summary.qualifiedLeads, 2);
    assert.equal(report.summary.closedLeads, 1);
    assert.equal(report.kpis.find((kpi) => kpi.id === "lead_conversion_rate")?.value, "33%");
    assert.equal(report.kpis.find((kpi) => kpi.id === "cost_per_lead")?.value, "$300");
    assert.equal(report.kpis.find((kpi) => kpi.id === "cost_per_acquisition")?.value, "$900");
    assert.equal(report.channelPerformance[0]?.source, "Facebook");
    assert.equal(report.channelPerformance[0]?.qualifiedLeads, 2);
  });

  it("keeps department health scores bounded", () => {
    const report = createBusinessIntelligenceReport({
      leads: [lead({ score: 75, priority: "High" })],
      financeEntries: [],
      marketingWorkflow: {
        drafts: [{ status: "pending_approval", canvaAssetAssists: [{ manualApprovalStatus: "pending_manual_asset_approval" }] }],
      },
      knowledgeItems: [],
    });

    assert.ok(report.departmentHealth.length > 0);
    assert.ok(report.departmentHealth.every((department) => department.score >= 0 && department.score <= 100));
  });
});
