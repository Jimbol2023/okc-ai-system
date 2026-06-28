import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildSalesWorkspaceAudit,
  getLatestSalesWorkspaceOutcome,
  getSalesWorkspaceMissingFacts,
  getSalesWorkspaceNextManualAction,
  getSalesWorkspaceRank,
  salesWorkspaceSafetyFlags,
  type SalesWorkspaceOutcomeInput,
} from "./sales-workspace-core.ts";

const baseLead = {
  status: "new",
  score: 60,
  priority: "High",
  doNotContact: false,
  approvalStatus: "pending_review",
  nextFollowUpAt: null,
  createdAt: new Date("2026-06-01T12:00:00.000Z"),
  phone: "4055551212",
  propertyAddress: "123 Main St",
  source: "facebook_message",
  payload: null,
};

function makeOutcome(overrides: Partial<SalesWorkspaceOutcomeInput> = {}): SalesWorkspaceOutcomeInput {
  return {
    id: "outcome-1",
    leadId: "lead-1",
    outcome: "interested",
    callCompletedAt: "2026-06-10T12:00:00.000Z",
    operatorSummary: "Seller gave enough context for manual review.",
    sellerMotivationSignal: "medium",
    sellerTimelineSignal: "medium",
    propertyConditionSignal: "medium",
    priceExpectationSignal: "medium",
    manualNextStep: "operator_review",
    ...overrides,
  };
}

describe("sales workspace", () => {
  it("prioritizes new manual-source leads with attribution and missing call outcomes", () => {
    const missingFacts = getSalesWorkspaceMissingFacts(baseLead, null);
    const rank = getSalesWorkspaceRank({
      lead: baseLead,
      missingFacts,
      latestOutcome: null,
      attributionCount: 1,
      manualIntakeCount: 1,
    });

    assert.ok(rank > 90);
    assert.ok(missingFacts.includes("seller motivation"));
  });

  it("keeps DNC and rejected leads visible but blocked from work priority", () => {
    const dncRank = getSalesWorkspaceRank({
      lead: { ...baseLead, doNotContact: true },
      missingFacts: [],
      latestOutcome: makeOutcome(),
    });
    const rejectedRank = getSalesWorkspaceRank({
      lead: { ...baseLead, approvalStatus: "rejected" },
      missingFacts: [],
      latestOutcome: makeOutcome(),
    });

    assert.equal(dncRank, 0);
    assert.equal(rejectedRank, 0);
    assert.match(
      getSalesWorkspaceNextManualAction({ lead: { ...baseLead, doNotContact: true }, missingFacts: [], latestOutcome: makeOutcome() }),
      /Do not contact/i,
    );
  });

  it("labels missing phone address source and seller facts", () => {
    const missingFacts = getSalesWorkspaceMissingFacts(
      {
        ...baseLead,
        phone: "",
        propertyAddress: "",
        source: "",
      },
      makeOutcome({
        sellerMotivationSignal: "not_captured",
        sellerTimelineSignal: "not_captured",
        propertyConditionSignal: "not_captured",
        priceExpectationSignal: "not_captured",
      }),
    );

    assert.deepEqual(
      missingFacts,
      ["phone", "property address", "source", "seller motivation", "seller timeline", "property condition", "price expectation"],
    );
  });

  it("selects the latest seller call outcome", () => {
    const latest = getLatestSalesWorkspaceOutcome([
      makeOutcome({ id: "old", callCompletedAt: "2026-06-09T12:00:00.000Z" }),
      makeOutcome({ id: "new", callCompletedAt: "2026-06-11T12:00:00.000Z" }),
    ]);

    assert.equal(latest?.id, "new");
  });

  it("creates audit summary and keeps safety flags false", () => {
    const audit = buildSalesWorkspaceAudit({
      totalLeads: 5,
      queueCount: 3,
      blockedCount: 1,
      missingFactCount: 4,
      outcomeCount: 2,
    });

    assert.equal(audit.status, "manual_sales_workspace_ready");
    assert.match(audit.summary, /3 lead/i);
    assert.deepEqual(salesWorkspaceSafetyFlags, {
      sent: false,
      wouldSend: false,
      providerCalled: false,
      automationTriggered: false,
      crmAutoMutation: false,
      externalFetch: false,
    });
  });
});
