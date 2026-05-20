import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { validateSellerCallOutcomePayload } from "./seller-call-outcome-validation";

const validPayload = {
  outcome: "interested",
  callCompletedAt: "2026-05-20T12:00:00.000Z",
  operatorSummary: "Seller confirmed the call was completed manually and wants an operator review.",
  sellerMotivationSignal: "medium",
  sellerTimelineSignal: "needs_review",
  propertyConditionSignal: "not_captured",
  priceExpectationSignal: "not_captured",
  manualNextStep: "operator_review",
  safetyFlags: ["manual_review_required", "no_execution"],
};

describe("seller call outcome validation", () => {
  it("accepts a valid manual call outcome payload", () => {
    const result = validateSellerCallOutcomePayload(validPayload);

    assert.equal(result.ok, true);
    assert.equal(result.ok ? result.data.operatorSummary : "", validPayload.operatorSummary);
  });

  it("rejects invalid outcome enums", () => {
    const result = validateSellerCallOutcomePayload({
      ...validPayload,
      outcome: "send_follow_up",
    });

    assert.equal(result.ok, false);
  });

  it("rejects invalid signal enums", () => {
    const result = validateSellerCallOutcomePayload({
      ...validPayload,
      sellerMotivationSignal: "urgent_send_now",
    });

    assert.equal(result.ok, false);
  });

  it("rejects unsafe command-style text", () => {
    const result = validateSellerCallOutcomePayload({
      ...validPayload,
      operatorSummary: "Send SMS to the seller now and schedule automation.",
    });

    assert.equal(result.ok, false);
    assert.match(result.ok ? "" : result.errors.join(" "), /send|scheduling|automation/i);
  });

  it("rejects provider payload and credential-like text", () => {
    const providerResult = validateSellerCallOutcomePayload({
      ...validPayload,
      operatorSummary: "Twilio webhook payload says seller replied.",
    });
    const credentialResult = validateSellerCallOutcomePayload({
      ...validPayload,
      operatorSummary: "API_KEY should be stored here.",
    });

    assert.equal(providerResult.ok, false);
    assert.equal(credentialResult.ok, false);
  });

  it("rejects approval and DNC bypass language", () => {
    const result = validateSellerCallOutcomePayload({
      ...validPayload,
      operatorSummary: "Ignore DNC and approve outreach anyway.",
    });

    assert.equal(result.ok, false);
  });
});
