import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  PUBLIC_INTAKE_INTERNAL_ONLY_CLASSIFICATION,
  buildPublicLeadInternalFields,
  createPublicLeadIntakeAuditMetadata
} from "@/lib/public-lead-intake";
import { storedLeadToDbData } from "@/lib/lead-record";
import type { StoredLead } from "@/lib/leads-storage";
import type { LeadIntakeInput } from "@/lib/validations/lead";

const intake: LeadIntakeInput = {
  firstName: "Moses",
  lastName: "Owner",
  email: "moses@example.com",
  phone: "4055550100",
  propertyAddress: "123 Main St",
  city: "Oklahoma City",
  state: "OK",
  zipCode: "73102",
  message: "Inherited property discussion.",
  source: "website_form",
  referralCode: "PARTNER01",
  referralCampaign: "probate-guide",
  referralSource: "facebook",
  referralLandingPage: "/sell-inherited-house-oklahoma-city"
};

const lead = {
  id: "lead-1",
  timestamp: "2026-08-02T12:00:00.000Z",
  source: "website_form",
  referralCode: "PARTNER01",
  referralCampaign: "probate-guide",
  referralSource: "facebook",
  referralLandingPage: "/sell-inherited-house-oklahoma-city"
} satisfies Pick<
  StoredLead,
  "id" | "source" | "timestamp" | "referralCode" | "referralCampaign" | "referralSource" | "referralLandingPage"
>;

describe("public lead intake internal-only contract", () => {
  it("keeps website intake idle and human-reviewed instead of scheduled", () => {
    assert.deepEqual(buildPublicLeadInternalFields(), {
      status: "new",
      nextFollowUpAt: null,
      automationStatus: "idle",
      followUpCount: 0,
      approvalStatus: "needs_human_review",
      requiresHumanApproval: true
    });
  });

  it("preserves public intake approval gates in the database write", () => {
    const dbData = storedLeadToDbData({
      ...intake,
      ...lead,
      ...buildPublicLeadInternalFields(),
      ownerName: "",
      mailingAddress: "",
      county: "",
      parcelId: "",
      situationDetails: intake.message ?? "",
      notes: [],
      followUps: [],
      analyzer: { arv: "", estimatedRepairs: "", desiredProfit: "20000" },
      distressFlags: {
        taxDelinquent: false,
        inheritedProperty: false,
        vacantProperty: false,
        foreclosureRisk: false,
        majorRepairs: false,
        tiredLandlord: false,
        urgentTimeline: false,
        outOfStateOwner: false
      },
      opportunityScore: "Low",
      score: 0,
      priority: "Low",
      scoreBreakdown: ""
    });

    assert.equal(dbData.approvalStatus, "needs_human_review");
    assert.equal(dbData.requiresHumanApproval, true);
  });

  it("captures source, UTM, referral, consent, and safety evidence for dashboard-visible intake", () => {
    const metadata = createPublicLeadIntakeAuditMetadata({
      payload: {
        sourcePage: "/contact",
        utm_source: "google",
        utm_medium: "organic",
        utm_campaign: "seller-help",
        utm_term: "sell inherited house",
        utm_content: "hero-form",
        consentNotice: "Manual review only; no automatic outreach."
      },
      intake,
      lead,
      created: true,
      referer: "https://jcapitalpropertygroup.com/"
    });

    assert.equal(metadata.classification, PUBLIC_INTAKE_INTERNAL_ONLY_CLASSIFICATION);
    assert.equal(metadata.sourcePage, "/contact");
    assert.equal(metadata.utmSource, "google");
    assert.equal(metadata.utmMedium, "organic");
    assert.equal(metadata.utmCampaign, "seller-help");
    assert.equal(metadata.utmTerm, "sell inherited house");
    assert.equal(metadata.utmContent, "hero-form");
    assert.equal(metadata.referralCode, "PARTNER01");
    assert.equal(metadata.consentNotice, "Manual review only; no automatic outreach.");
    assert.equal(metadata.dashboardVisible, true);
    assert.equal(metadata.automationStatus, "idle");
    assert.equal(metadata.nextFollowUpAt, null);
    assert.equal(metadata.requiresHumanApproval, true);
  });

  it("keeps every external execution flag false for created and deduped public intake", () => {
    for (const created of [true, false]) {
      const metadata = createPublicLeadIntakeAuditMetadata({
        payload: {},
        intake,
        lead,
        created
      });

      assert.equal(metadata.providerCalled, false);
      assert.equal(metadata.sent, false);
      assert.equal(metadata.published, false);
      assert.equal(metadata.crmMutation, false);
      assert.equal(metadata.outreach, false);
      assert.equal(metadata.scraping, false);
      assert.equal(metadata.recurringAutomation, false);
      assert.equal(metadata.syntheticLeads, false);
      assert.equal(metadata.liveExecution, false);
      assert.equal(metadata.externalExecutionAllowed, false);
    }
  });
});
