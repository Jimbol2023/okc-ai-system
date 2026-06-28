import assert from "node:assert/strict";
import test from "node:test";

import { normalizeGlobalSearchQuery, searchGlobalRecords } from "@/lib/global-search";
import type { KnowledgeItemRecord } from "@/lib/knowledge";
import type { StoredLead } from "@/lib/leads-storage";

const baseLead: StoredLead = {
  id: "lead-1",
  timestamp: new Date().toISOString(),
  firstName: "Moses",
  lastName: "Seller",
  email: "seller@example.com",
  phone: "4055551212",
  propertyAddress: "123 Probate Ave",
  city: "Oklahoma City",
  state: "OK",
  zipCode: "73102",
  ownerName: "Estate Owner",
  mailingAddress: "PO Box 1",
  county: "Oklahoma",
  parcelId: "parcel-1",
  situationDetails: "Inherited property with executor review.",
  source: "referral",
  status: "new",
  notes: [],
  followUps: [],
  analyzer: { arv: "", estimatedRepairs: "", desiredProfit: "20000" },
  distressFlags: {
    taxDelinquent: false,
    inheritedProperty: true,
    vacantProperty: false,
    foreclosureRisk: false,
    majorRepairs: false,
    tiredLandlord: false,
    urgentTimeline: false,
    outOfStateOwner: false,
  },
  opportunityScore: "Medium",
  score: 25,
  priority: "Medium",
  scoreBreakdown: "Inherited lead signal.",
};

const knowledgeItem: KnowledgeItemRecord = {
  id: "knowledge-1",
  title: "Probate Seller SOP",
  category: "sop",
  content: "Manual review checklist for inherited property conversations.",
  tags: ["probate", "executor"],
  status: "active",
  source: "manual",
  createdAt: new Date(),
  updatedAt: new Date(),
};

test("normalizeGlobalSearchQuery trims repeated spaces", () => {
  assert.equal(normalizeGlobalSearchQuery("  probate   seller  "), "probate seller");
});

test("searchGlobalRecords returns normalized internal results and safety flags", () => {
  const response = searchGlobalRecords({
    query: "probate",
    leads: [baseLead],
    knowledgeItems: [knowledgeItem],
    docReferences: [],
    marketingDrafts: [
      {
        id: "draft-1",
        channel: "facebook",
        topic: "Probate education campaign",
        sourceLabel: "manual",
        status: "pending_approval",
        draftCopy: "Educational content for inherited property owners.",
        assetNotes: null,
      },
    ],
  });

  assert.equal(response.ok, true);
  assert.equal(response.providerCalled, false);
  assert.equal(response.outreachSent, false);
  assert.equal(response.generatedPropertyFacts, false);
  assert.ok(response.resultCounts.sop >= 1);
  assert.ok(response.resultCounts.property >= 1);
  assert.ok(response.resultCounts.marketing >= 1);
  assert.ok(response.results.some((result) => result.sourceType === "sop" && result.title === "Probate Seller SOP"));
  assert.ok(response.results.some((result) => result.sourceType === "property" && result.title === "123 Probate Ave"));
  assert.ok(response.results.every((result) => result.providerCalled === false));
  assert.ok(response.results.every((result) => result.generatedPropertyFacts === false));
});
