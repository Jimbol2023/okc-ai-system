import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { classifyPublicIntakeSpam, normalizePublicIntakeSource } from "@/lib/governed-lead-intake";

describe("governed lead intake", () => {
  it("normalizes public source on the server while preserving referral classification", () => {
    assert.equal(normalizePublicIntakeSource({}), "public_seller_website");
    assert.equal(normalizePublicIntakeSource({ referralSource: "google" }), "website_campaign");
    assert.equal(normalizePublicIntakeSource({ referralCode: "partner-1" }), "website_referral");
  });

  it("rejects honeypots and bounded non-business fixtures", () => {
    assert.equal(classifyPublicIntakeSpam({ honeypot: "bot", text: "real seller" }).accepted, false);
    for (const marker of ["acceptance", "test", "synthetic", "demo", "fixture", "sample", "seed", "seeded"]) {
      assert.equal(classifyPublicIntakeSpam({ text: `submission ${marker} record` }).accepted, false);
    }
    assert.equal(classifyPublicIntakeSpam({ text: "Seller owns 123 Main Street" }).accepted, true);
  });
});
