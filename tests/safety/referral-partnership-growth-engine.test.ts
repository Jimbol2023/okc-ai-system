import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { createMobileCommandCenter } from "@/lib/phase3-production-execution";
import {
  buildReferralCopySuggestion,
  buildReferralLeadSource,
  getReferralDuplicateKey,
  normalizeReferralCode,
  referralSafetyFlags,
} from "@/lib/referrals";

test("mobile companion manifest starts at mobile command center", () => {
  const manifest = JSON.parse(readFileSync("public/manifest.webmanifest", "utf8")) as {
    name: string;
    short_name: string;
    start_url: string;
    display: string;
    theme_color: string;
    icons: unknown[];
  };

  assert.equal(manifest.name, "J Capital AI Operating System");
  assert.equal(manifest.short_name, "J Capital OS");
  assert.equal(manifest.start_url, "/dashboard/mobile-command");
  assert.equal(manifest.display, "standalone");
  assert.equal(manifest.theme_color, "#02213D");
  assert.ok(manifest.icons.length >= 2);
});

test("mobile command center remains review-only with live execution disabled", () => {
  const commandCenter = createMobileCommandCenter();

  assert.equal(commandCenter.providerCalled, false);
  assert.equal(commandCenter.sent, false);
  assert.equal(commandCenter.published, false);
  assert.equal(commandCenter.liveExecutionAllowed, false);
});

test("referral safety flags block outreach providers publishing payouts and live execution", () => {
  assert.equal(referralSafetyFlags.providerCalled, false);
  assert.equal(referralSafetyFlags.outreachSent, false);
  assert.equal(referralSafetyFlags.published, false);
  assert.equal(referralSafetyFlags.liveExecutionAllowed, false);
  assert.equal(referralSafetyFlags.paymentCreated, false);
  assert.equal(referralSafetyFlags.privateDealDataExposed, false);
  assert.equal(referralSafetyFlags.scrapingEnabled, false);
  assert.equal(referralSafetyFlags.connectorActivationAllowed, false);
});

test("unknown or invalid referral codes fail safely before lead attribution", () => {
  assert.equal(normalizeReferralCode("!"), null);
  assert.equal(buildReferralLeadSource({ referralCode: "!" }), null);
});

test("referral lead source is deterministic and advisory attribution only", () => {
  const source = buildReferralLeadSource({
    referralCode: "partner_01",
    referralCampaign: "probate-guide",
    referralSource: "facebook",
  });

  assert.deepEqual(source, {
    source: "referral_partner_01",
    sourceType: "referral",
    sourceDetail: "PARTNER_01",
    campaignName: "probate-guide",
    campaignMedium: "facebook",
  });
});

test("duplicate referral events use stable keys and do not require visitor identity", () => {
  const input = {
    eventType: "click" as const,
    ref: "partner_01",
    campaign: "probate-guide",
    source: "facebook",
    landingPage: "/sell-your-house",
  };

  assert.equal(getReferralDuplicateKey(input), getReferralDuplicateKey(input));
  assert.doesNotMatch(getReferralDuplicateKey(input), /phone|email|ip|user-agent|cookie/i);
});

test("marketing referral copy suggestions stay manual and do not publish", () => {
  const copy = buildReferralCopySuggestion("https://jcapitalpropertygroup.com/sell-your-house?ref=PARTNER_01");

  assert.match(copy ?? "", /share this J Capital link/i);
  assert.doesNotMatch(copy ?? "", /auto.?publish|send sms|send email|provider call/i);
});
