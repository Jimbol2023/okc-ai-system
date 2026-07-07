import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { businessActivationSafetyFlags, createCampaign001WorkProduct } from "@/lib/business-activation";

describe("Business activation safety", () => {
  it("blocks every external execution path for Campaign 001 work products", () => {
    const workProduct = createCampaign001WorkProduct("Email draft");
    const serialized = JSON.stringify(workProduct);

    assert.equal(businessActivationSafetyFlags.providerCalled, false);
    assert.equal(businessActivationSafetyFlags.liveExecutionAllowed, false);
    assert.equal(businessActivationSafetyFlags.published, false);
    assert.equal(businessActivationSafetyFlags.sent, false);
    assert.equal(businessActivationSafetyFlags.emailBlocked, true);
    assert.equal(businessActivationSafetyFlags.smsBlocked, true);
    assert.equal(businessActivationSafetyFlags.adsBlocked, true);
    assert.equal(businessActivationSafetyFlags.scrapingBlocked, true);
    assert.equal(businessActivationSafetyFlags.providerLookupBlocked, true);
    assert.equal(businessActivationSafetyFlags.skipTracingBlocked, true);
    assert.doesNotMatch(serialized, /send now|publish now|scrape now|provider call authorized|outreach authorized/i);
  });
});
