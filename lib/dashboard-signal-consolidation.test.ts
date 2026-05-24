import type { StoredLead } from "./leads-storage";
import { deriveManualRevenueMetrics, type R53ManualRevenueMetricsResult } from "./r53-manual-revenue-metrics-helper";
import {
  createDashboardSignalConsolidation,
  createDashboardSignalConsolidationSummary,
  dashboardSignalConsolidationFlags,
} from "./dashboard-signal-consolidation";

const now = new Date("2026-05-24T12:00:00.000Z");

function makeLead(overrides: Partial<StoredLead> = {}): StoredLead {
  return {
    id: "lead-1",
    timestamp: "2026-05-24T10:00:00.000Z",
    firstName: "Ada",
    lastName: "Seller",
    email: "ada@example.com",
    phone: "4055551212",
    propertyAddress: "123 Main St",
    city: "Oklahoma City",
    state: "OK",
    zipCode: "73102",
    ownerName: "",
    mailingAddress: "",
    county: "Oklahoma",
    parcelId: "",
    situationDetails: "Needs a simple sale.",
    source: "website",
    status: "contacted",
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
    opportunityScore: "Medium",
    score: 55,
    priority: "Medium",
    scoreBreakdown: "Moderate lead score.",
    ...overrides,
  };
}

function metricsFor(leads: StoredLead[]): R53ManualRevenueMetricsResult {
  return deriveManualRevenueMetrics({
    referenceDate: now,
    leads: leads.map((lead) => ({
      ...lead,
      address: lead.propertyAddress,
      motivation: lead.situationDetails,
      timeline: lead.nextFollowUpAt ?? "",
      stage: lead.status,
      blocked: lead.approvalStatus === "rejected",
      dnc: lead.doNotContact,
      buyerReady: lead.status === "under_contract" || lead.approvalStatus === "approved_for_outreach",
      buyerPackageComplete: lead.status === "under_contract" || lead.status === "closed",
      humanReviewRequired: lead.requiresHumanApproval,
    })),
  });
}

describe("dashboard signal consolidation", () => {
  it("surfaces blocked and DNC leads as stop-first signals", () => {
    const leads = [makeLead({ doNotContact: true })];
    const result = createDashboardSignalConsolidation(leads, metricsFor(leads));

    expect(result.topOperatorPriority).toBe("blocked_stop_first");
    expect(result.blockedDncCount).toBe(1);
    expect(result.safeNextDashboardStep).toContain("blocked or DNC");
  });

  it("surfaces missing source, contact, property, or seller context as cleanup", () => {
    const leads = [
      makeLead({
        source: "",
        phone: "",
        email: "",
        propertyAddress: "",
        situationDetails: "",
      }),
    ];
    const result = createDashboardSignalConsolidation(leads, metricsFor(leads));

    expect(result.topOperatorPriority).toBe("cleanup_before_work");
    expect(result.cleanupCount).toBeGreaterThan(0);
  });

  it("counts overdue and due follow-up pressure from existing follow-up fields", () => {
    const leads = [
      makeLead({ id: "overdue", nextFollowUpAt: "2026-05-24T11:00:00.000Z" }),
      makeLead({ id: "soon", nextFollowUpAt: "2026-05-24T18:00:00.000Z" }),
    ];
    const result = createDashboardSignalConsolidation(leads, metricsFor(leads));

    expect(result.overdueFollowUpCount).toBe(1);
    expect(result.dueFollowUpCount).toBe(2);
    expect(result.signalCards.find((card) => card.label === "Follow-up pressure")?.value).toBe(3);
  });

  it("surfaces high-priority review-now leads without creating assignments", () => {
    const leads = [makeLead({ priority: "High", score: 82 })];
    const result = createDashboardSignalConsolidation(leads, metricsFor(leads));

    expect(result.topOperatorPriority).toBe("review_revenue_now");
    expect(result.reviewNowCount).toBe(1);
    expect(result.flags.operatorAssignmentCreated).toBe(false);
    expect(result.flags.dashboardQueueCreated).toBe(false);
  });

  it("keeps near-close and buyer-ready signals advisory", () => {
    const leads = [makeLead({ status: "under_contract" })];
    const result = createDashboardSignalConsolidation(leads, metricsFor(leads));

    expect(result.nearCloseBuyerReadyCount).toBeGreaterThan(0);
    expect(result.flags.dashboardCrmMutationAllowed).toBe(false);
  });

  it("returns a safe empty state with no urgent signals", () => {
    const metrics = metricsFor([]);
    const result = createDashboardSignalConsolidation([], metrics);
    const summary = createDashboardSignalConsolidationSummary();

    expect(result.topOperatorPriority).toBe("no_urgent_signals");
    expect(result.safeNextDashboardStep).toContain("No urgent dashboard signal");
    expect(summary.recommendedNextExactStep).toBe("Operator Work Queue Practicalization");
  });

  it("keeps execution, provider, communication, persistence, polling, reminder, calendar, and CRM mutation flags blocked", () => {
    expect(dashboardSignalConsolidationFlags.providerCalled).toBe(false);
    expect(dashboardSignalConsolidationFlags.sent).toBe(false);
    expect(dashboardSignalConsolidationFlags.runtimeActivationAllowed).toBe(false);
    expect(dashboardSignalConsolidationFlags.storageAuthorized).toBe(false);
    expect(dashboardSignalConsolidationFlags.auditWritingAllowed).toBe(false);
    expect(dashboardSignalConsolidationFlags.dashboardQueueCreated).toBe(false);
    expect(dashboardSignalConsolidationFlags.dashboardReminderCreated).toBe(false);
    expect(dashboardSignalConsolidationFlags.dashboardCalendarItemCreated).toBe(false);
    expect(dashboardSignalConsolidationFlags.dashboardPollingEnabled).toBe(false);
    expect(dashboardSignalConsolidationFlags.dashboardAutomationTriggered).toBe(false);
    expect(dashboardSignalConsolidationFlags.dashboardCrmMutationAllowed).toBe(false);
  });
});
