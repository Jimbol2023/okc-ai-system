import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  businessActivationSafetyFlags,
  createCampaign001WorkProduct,
  opportunityQueueInputSchema,
} from "./business-activation";
import { createInheritedPropertyCampaignDirective } from "./company-orchestrator";

describe("Business Activation", () => {
  it("creates Campaign 001 work products with source labels, CTA, and blocked execution", () => {
    const workProduct = createCampaign001WorkProduct("SEO keyword targets") as Record<string, unknown>;

    assert.equal(workProduct.sourceLabel, "executive_directive:campaign-001");
    assert.match(String(workProduct.targetSellerProblem), /Oklahoma homeowners/i);
    assert.match(String(workProduct.leadCaptureCta), /Contact J Capital Property Group/i);
    assert.deepEqual(workProduct.safetyFlags, businessActivationSafetyFlags);
    assert.equal(businessActivationSafetyFlags.providerCalled, false);
    assert.equal(businessActivationSafetyFlags.liveExecutionAllowed, false);
    assert.equal(businessActivationSafetyFlags.published, false);
    assert.equal(businessActivationSafetyFlags.sent, false);
    assert.equal(businessActivationSafetyFlags.scrapingBlocked, true);
    assert.equal(businessActivationSafetyFlags.outreachBlocked, true);
  });

  it("keeps Campaign 001 broad enough for real internal business work", () => {
    const directive = createInheritedPropertyCampaignDirective();

    assert.ok(directive.requested_outputs.includes("Website draft"));
    assert.ok(directive.requested_outputs.includes("SEO keyword targets"));
    assert.ok(directive.requested_outputs.includes("Internal link plan"));
    assert.ok(directive.requested_outputs.includes("Lead capture CTA plan"));
    assert.ok(directive.requested_outputs.includes("Thumbnail concept"));
    assert.ok(directive.requested_outputs.includes("Governance Review"));
  });

  it("requires opportunity queue source tracking and address evidence", () => {
    const missingAddress = opportunityQueueInputSchema.safeParse({
      source: "Referral",
      sourceLabel: "referral_manual_test",
      opportunityType: "Inherited property",
      motivationSignal: "Seller asked for options.",
      recommendedAction: "Review manually.",
    });

    assert.equal(missingAddress.success, false);

    const valid = opportunityQueueInputSchema.safeParse({
      source: "Referral",
      sourceLabel: "referral_manual_test",
      addressMissingReason: "Seller has not shared the address yet.",
      opportunityType: "Inherited property",
      motivationSignal: "Seller asked for options.",
      recommendedAction: "Review manually.",
      confidence: 45,
      leadScore: 35,
    });

    assert.equal(valid.success, true);
  });
});
