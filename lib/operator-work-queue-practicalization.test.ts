import type { StoredLead } from "./leads-storage";
import {
  createPracticalOperatorWorkQueue,
  createPracticalOperatorWorkQueueSummary,
  practicalOperatorWorkQueueFlags,
} from "./operator-work-queue-practicalization";
import { deriveManualRevenueMetrics, type R53ManualRevenueMetricsResult } from "./r53-manual-revenue-metrics-helper";

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
      nextFollowUpAt: lead.nextFollowUpAt,
      stage: lead.status,
      blocked: lead.approvalStatus === "rejected",
      dnc: lead.doNotContact,
      buyerReady: lead.status === "under_contract" || lead.approvalStatus === "approved_for_outreach",
      buyerPackageComplete: lead.status === "under_contract" || lead.status === "closed",
      humanReviewRequired: lead.requiresHumanApproval,
    })),
  });
}

describe("operator work queue practicalization", () => {
  it("sorts DNC and rejected leads into stop-first rows", () => {
    const leads = [
      makeLead({ id: "dnc", doNotContact: true }),
      makeLead({ id: "rejected", approvalStatus: "rejected" }),
    ];
    const result = createPracticalOperatorWorkQueue(leads, metricsFor(leads), 8, now);

    expect(result.rows.map((row) => row.queueLane)).toEqual(["stop_first", "stop_first"]);
    expect(result.rows[0]?.blockerLabels.join(" ")).toContain("DNC");
    expect(result.rows[1]?.blockerLabels.join(" ")).toContain("rejected");
  });

  it("sorts missing source, contact, property, and seller context into cleanup-first rows", () => {
    const leads = [
      makeLead({
        id: "cleanup",
        source: "",
        phone: "",
        email: "",
        propertyAddress: "",
        situationDetails: "",
      }),
    ];
    const result = createPracticalOperatorWorkQueue(leads, metricsFor(leads), 8, now);

    expect(result.rows[0]?.queueLane).toBe("cleanup_first");
    expect(result.rows[0]?.cleanupLabels).toEqual(
      expect.arrayContaining(["source", "contact", "property address", "seller context"]),
    );
    expect(result.rows[0]?.sourceVisible).toBe("missing source");
  });

  it("sorts overdue follow-ups into overdue-follow-up rows", () => {
    const leads = [makeLead({ id: "overdue", nextFollowUpAt: "2026-05-24T11:00:00.000Z" })];
    const result = createPracticalOperatorWorkQueue(leads, metricsFor(leads), 8, now);

    expect(result.rows[0]?.queueLane).toBe("overdue_follow_up");
    expect(result.rows[0]?.followUpLabel).toBe("overdue manual review");
    expect(result.rows[0]?.safeManualReview).toContain("overdue");
  });

  it("sorts high-priority review-now leads into review-now rows", () => {
    const leads = [makeLead({ id: "hot", priority: "High", score: 86, nextFollowUpAt: "2026-05-30T12:00:00.000Z" })];
    const result = createPracticalOperatorWorkQueue(leads, metricsFor(leads), 8, now);

    expect(result.rows[0]?.queueLane).toBe("review_now");
    expect(result.rows[0]?.reason).toContain("High-value");
  });

  it("sorts under-contract and buyer-ready leads into conversion review lanes", () => {
    const leads = [
      makeLead({ id: "near-close", status: "under_contract" }),
      makeLead({ id: "buyer-ready", approvalStatus: "approved_for_outreach", status: "contacted" }),
    ];
    const result = createPracticalOperatorWorkQueue(leads, metricsFor(leads), 8, now);

    expect(result.rows.find((row) => row.leadId === "near-close")?.queueLane).toBe("near_close_review");
    expect(result.rows.find((row) => row.leadId === "buyer-ready")?.queueLane).toBe("buyer_ready_review");
  });

  it("sorts clean low-value leads into monitor rows and keeps them last", () => {
    const leads = [
      makeLead({ id: "monitor", priority: "Low", score: 10, followUpCount: 1 }),
      makeLead({ id: "hot", priority: "High", score: 88 }),
    ];
    const result = createPracticalOperatorWorkQueue(leads, metricsFor(leads), 8, now);

    expect(result.rows.at(-1)?.leadId).toBe("monitor");
    expect(result.rows.at(-1)?.queueLane).toBe("monitor");
  });

  it("returns a safe empty queue and does not mutate caller input", () => {
    const leads = [
      makeLead({ id: "z", priority: "Low", score: 10 }),
      makeLead({ id: "a", doNotContact: true }),
    ];
    const before = JSON.stringify(leads);
    const empty = createPracticalOperatorWorkQueue([], metricsFor([]), 8, now);
    const result = createPracticalOperatorWorkQueue(leads, metricsFor(leads), 1, now);

    expect(empty.rows).toEqual([]);
    expect(empty.visibleRows).toEqual([]);
    expect(empty.emptyState).toContain("No manual work queue rows");
    expect(JSON.stringify(leads)).toBe(before);
    expect(result.visibleRows).toHaveLength(1);
    expect(result.recommendedNextExactStep).toBe("Seller Call Outcome Usability");
  });

  it("keeps queue, routing, assignment, provider, communication, storage, audit, polling, automation, and CRM mutation flags blocked", () => {
    const summary = createPracticalOperatorWorkQueueSummary();

    expect(practicalOperatorWorkQueueFlags.providerCalled).toBe(false);
    expect(practicalOperatorWorkQueueFlags.sent).toBe(false);
    expect(practicalOperatorWorkQueueFlags.runtimeActivationAllowed).toBe(false);
    expect(practicalOperatorWorkQueueFlags.storageAuthorized).toBe(false);
    expect(practicalOperatorWorkQueueFlags.auditWritingAllowed).toBe(false);
    expect(practicalOperatorWorkQueueFlags.practicalQueuePersisted).toBe(false);
    expect(practicalOperatorWorkQueueFlags.queueCreated).toBe(false);
    expect(practicalOperatorWorkQueueFlags.practicalQueueItemCreated).toBe(false);
    expect(practicalOperatorWorkQueueFlags.operatorTaskCreated).toBe(false);
    expect(practicalOperatorWorkQueueFlags.operatorRouted).toBe(false);
    expect(practicalOperatorWorkQueueFlags.operatorWorkAssigned).toBe(false);
    expect(practicalOperatorWorkQueueFlags.operatorAssignmentCreated).toBe(false);
    expect(practicalOperatorWorkQueueFlags.queueReminderCreated).toBe(false);
    expect(practicalOperatorWorkQueueFlags.queueCalendarItemCreated).toBe(false);
    expect(practicalOperatorWorkQueueFlags.queuePollingEnabled).toBe(false);
    expect(practicalOperatorWorkQueueFlags.queueAutomationTriggered).toBe(false);
    expect(practicalOperatorWorkQueueFlags.queueCrmMutationAllowed).toBe(false);
    expect(summary.recommendedNextExactStep).toBe("Seller Call Outcome Usability");
  });
});
