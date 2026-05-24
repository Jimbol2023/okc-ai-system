import type { StoredLead } from "./leads-storage";
import {
  createRealManualLeadDecision,
  createRealManualLeadOperationsDecisionList,
  createRealManualLeadOperationsUsabilityPassSummary,
  createZ10DecisionInputFromStoredLead,
  getRealManualLeadMissingData,
} from "./real-manual-lead-operations-decision-adapter";

function makeLead(overrides: Partial<StoredLead> = {}): StoredLead {
  return {
    id: "lead-1",
    timestamp: "2026-05-24T12:00:00.000Z",
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
    status: "new",
    notes: [],
    followUps: [],
    analyzer: {
      arv: "",
      estimatedRepairs: "",
      desiredProfit: "20000",
    },
    distressFlags: {
      absenteeOwner: false,
      highEquity: false,
      codeViolation: false,
      taxDelinquent: false,
      vacant: false,
      tiredLandlord: false,
      inherited: false,
      divorce: false,
      foreclosure: false,
      unknown: false,
    },
    opportunityScore: "Medium",
    score: 55,
    priority: "Medium",
    scoreBreakdown: "Moderate lead score.",
    ...overrides,
  };
}

describe("real manual lead operations decision adapter", () => {
  it("maps DNC and rejected leads to stop decisions", () => {
    const dncDecision = createRealManualLeadDecision(makeLead({ doNotContact: true }));
    const rejectedDecision = createRealManualLeadDecision(makeLead({ approvalStatus: "rejected" }));

    expect(dncDecision.decisionLane).toBe("stop_do_not_work");
    expect(rejectedDecision.decisionLane).toBe("stop_do_not_work");
    expect(dncDecision.flags.decisionExecuted).toBe(false);
    expect(dncDecision.flags.providerCalled).toBe(false);
    expect(dncDecision.flags.sent).toBe(false);
  });

  it("maps missing source, contact, and property data to cleanup decisions", () => {
    const lead = makeLead({
      source: "",
      phone: "",
      email: "",
      propertyAddress: "",
    });

    expect(getRealManualLeadMissingData(lead)).toEqual(expect.arrayContaining(["source", "contact", "property address"]));
    expect(createRealManualLeadDecision(lead).decisionLane).toBe("cleanup_before_decision");
  });

  it("maps high score, hot, or high priority leads to revenue review", () => {
    expect(createRealManualLeadDecision(makeLead({ score: 82 })).decisionLane).toBe("review_revenue_now");
    expect(createRealManualLeadDecision(makeLead({ priority: "High" })).decisionLane).toBe("review_revenue_now");
    expect(createRealManualLeadDecision(makeLead({ isHot: true })).decisionLane).toBe("review_revenue_now");
  });

  it("maps closed leads to terminal no-decision", () => {
    const decision = createRealManualLeadDecision(makeLead({ status: "closed" }));

    expect(decision.decisionLane).toBe("terminal_no_decision");
    expect(decision.summaryState).toBe("terminal_no_decision");
  });

  it("maps low-value low-quality leads to defer and monitor-oriented decisions", () => {
    const lowLead = makeLead({
      priority: "Low",
      score: 20,
      analyzer: { arv: "", estimatedRepairs: "", desiredProfit: "1000" },
    });

    expect(createRealManualLeadDecision(lowLead).decisionLane).toBe("defer_low_value");
  });

  it("keeps source tracking visible and exposes no mutation authorization", () => {
    const input = createZ10DecisionInputFromStoredLead(makeLead({ source: "county-import" }));
    const decision = createRealManualLeadDecision(makeLead({ source: "county-import" }));

    expect(input.source).toBe("county-import");
    expect(decision.sourceVisible).toBe("county-import");
    expect(decision.flags.crmMutationAllowed).toBe(false);
    expect(decision.flags.storageAuthorized).toBe(false);
    expect(decision.flags.decisionPersisted).toBe(false);
    expect(decision.flags.leadStatusChanged).toBe(false);
  });

  it("creates deterministic list and final usability summary without mutating inputs", () => {
    const leads = [
      makeLead({ id: "c", firstName: "Monitor", score: 45 }),
      makeLead({ id: "a", firstName: "Hot", priority: "High" }),
      makeLead({ id: "b", firstName: "Stop", doNotContact: true }),
    ];
    const before = JSON.stringify(leads);
    const list = createRealManualLeadOperationsDecisionList(leads);
    const summary = createRealManualLeadOperationsUsabilityPassSummary(leads);

    expect(JSON.stringify(leads)).toBe(before);
    expect(list.ranked[0]?.inputId).toBe("b");
    expect(summary.realLeadOperationsUsabilityReady).toBe(true);
    expect(summary.z10ConsolidationReady).toBe(true);
    expect(summary.recommendedNextExactStep).toBe("Manual Follow-Up Workspace Usability");
    expect(summary.flags.decisionExecuted).toBe(false);
  });
});
