import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildOfferReadinessAudit,
  classifyOfferReadiness,
  getOfferReadinessAssumptionRoi,
  getOfferReadinessMissingFacts,
  offerReadinessSafetyFlags,
  type OfferReadinessLeadInput,
  type OfferReadinessOutcomeInput,
} from "./offer-readiness-core.ts";

const completePayload = JSON.stringify({
  analyzer: {
    arv: "175000",
    estimatedRepairs: "25000",
    desiredProfit: "20000",
  },
  occupancy: "vacant",
  titleNotes: "Seller says title needs manual review.",
});

const baseLead: OfferReadinessLeadInput = {
  status: "negotiating",
  score: 72,
  priority: "High",
  doNotContact: false,
  approvalStatus: "approved_for_outreach",
  payload: completePayload,
};

const strongOutcome: OfferReadinessOutcomeInput = {
  outcome: "wants_offer",
  sellerMotivationSignal: "high",
  sellerTimelineSignal: "high",
  propertyConditionSignal: "medium",
  priceExpectationSignal: "medium",
  manualNextStep: "manual_offer_readiness_review",
};

describe("offer readiness", () => {
  it("classifies a strong seller outcome with complete analyzer fields as ready for manual offer review", () => {
    assert.equal(classifyOfferReadiness(baseLead, strongOutcome), "ready_for_manual_offer_review");
    assert.deepEqual(getOfferReadinessMissingFacts(baseLead, strongOutcome), []);
  });

  it("requires ARV repairs and desired profit before offer readiness", () => {
    const lead = {
      ...baseLead,
      payload: JSON.stringify({
        analyzer: {
          desiredProfit: "20000",
        },
        occupancy: "vacant",
        titleNotes: "Manual review needed.",
      }),
    };

    const missingFacts = getOfferReadinessMissingFacts(lead, strongOutcome);

    assert.equal(classifyOfferReadiness(lead, strongOutcome), "needs_underwriting_facts");
    assert.ok(missingFacts.includes("ARV"));
    assert.ok(missingFacts.includes("repair estimate"));
  });

  it("requires seller motivation timeline condition and price context", () => {
    const weakOutcome = {
      ...strongOutcome,
      sellerMotivationSignal: "not_captured",
      sellerTimelineSignal: "not_captured",
      propertyConditionSignal: "not_captured",
      priceExpectationSignal: "not_captured",
    };
    const missingFacts = getOfferReadinessMissingFacts(baseLead, weakOutcome);

    assert.equal(classifyOfferReadiness(baseLead, weakOutcome), "needs_seller_context");
    assert.ok(missingFacts.includes("seller motivation"));
    assert.ok(missingFacts.includes("seller timeline"));
    assert.ok(missingFacts.includes("property condition"));
    assert.ok(missingFacts.includes("seller price expectation"));
  });

  it("keeps DNC and rejected leads visible but blocked", () => {
    assert.equal(classifyOfferReadiness({ ...baseLead, doNotContact: true }, strongOutcome), "blocked_or_suppressed");
    assert.equal(classifyOfferReadiness({ ...baseLead, approvalStatus: "rejected" }, strongOutcome), "blocked_or_suppressed");
  });

  it("shows assumption-only ROI only when internal analyzer inputs exist", () => {
    const available = getOfferReadinessAssumptionRoi(completePayload);
    const unavailable = getOfferReadinessAssumptionRoi(JSON.stringify({ analyzer: { arv: "175000" } }));

    assert.equal(available.available, true);
    assert.match(available.reviewNote ?? "", /not a valuation claim/i);
    assert.equal(unavailable.available, false);
  });

  it("keeps audit and safety flags non-executing", () => {
    const audit = buildOfferReadinessAudit({
      totalLeads: 4,
      readyCount: 1,
      blockedCount: 1,
      missingFactCount: 6,
    });

    assert.equal(audit.status, "manual_offer_readiness_review_only");
    assert.deepEqual(offerReadinessSafetyFlags, {
      offerSent: false,
      contractGenerated: false,
      valuationClaimed: false,
      externalPropertyDataUsed: false,
      providerCalled: false,
      crmAutoMutation: false,
      automationTriggered: false,
    });
  });
});
