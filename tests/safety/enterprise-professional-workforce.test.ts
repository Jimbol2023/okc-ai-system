import assert from "node:assert/strict";
import { test } from "node:test";

import {
  createAcquisitionDecisionBrief,
  createCanonicalPropertyIdentity,
  createProfessionalWorkforceReport,
  evaluateProfessionalPilot,
  propertyIntelligenceProfessionalProfiles,
  scoreMarginalPropertySource,
  type PilotComparisonRecord,
  type PropertyEvidenceItemV1,
} from "@/lib/enterprise-professional-workforce";
import type { StoredLead } from "@/lib/leads-storage";

function lead(overrides: Partial<StoredLead> = {}): StoredLead {
  return {
    id: "lead-1", timestamp: "2026-07-11T12:00:00.000Z", firstName: "Test", lastName: "Seller", email: "", phone: "", propertyAddress: "123 Main St", city: "Oklahoma City", state: "OK", zipCode: "73102", ownerName: "", mailingAddress: "", county: "Oklahoma", parcelId: "P-123", situationDetails: "Seller reports the property needs work.", source: "inbound_web", status: "new", notes: [], followUps: [], analyzer: { arv: "200000", estimatedRepairs: "40000", desiredProfit: "25000" }, distressFlags: { vacantProperty: false, inheritedProperty: false, taxDelinquent: false, outOfStateOwner: false, absenteeOwner: false, highEquity: false, codeViolation: false, foreclosure: false, tiredLandlord: false, unknown: false } as never, opportunityScore: "Medium", score: 50, priority: "Medium", scoreBreakdown: "Internal score; not reused as PWE readiness.", requiresHumanApproval: true, ...overrides,
  };
}

test("professional kernel extends existing workforce roles without granting execution", () => {
  const report = createProfessionalWorkforceReport();
  assert.equal(report.profileCount, 5);
  assert.ok(report.architectureInventory.some((item) => item.capability === "AI workforce registry" && item.classification === "reuse"));
  assert.ok(report.architectureInventory.some((item) => item.classification === "deprecated"));
  for (const profile of propertyIntelligenceProfessionalProfiles) {
    assert.equal(profile.certification.state, "draft");
    assert.equal(profile.certification.certifiedAt, null);
    assert.equal(profile.certification.certifiedFor, "internal_advisory_only");
    assert.equal(profile.humanReviewRequired, true);
    assert.equal(profile.titleDoesNotImplyHumanLicensure, true);
    assert.ok(profile.sourceWorkforceIds.length > 0);
    assert.ok(profile.capabilityGrants.every((grant) => !grant.providerExecutionGranted && !grant.externalWritesGranted));
  }
});

test("canonical property identity is deterministic and exposes missing identity", () => {
  const complete = createCanonicalPropertyIdentity(lead());
  assert.equal(complete.matchMethod, "address_and_parcel");
  assert.equal(complete.confidence, 100);
  const incomplete = createCanonicalPropertyIdentity(lead({ propertyAddress: "", parcelId: "", county: "" }));
  assert.equal(incomplete.matchMethod, "insufficient_identity");
  assert.equal(incomplete.confidence, 0);
});

test("Acquisition Decision Brief labels assumptions, gaps, provenance, and remains advisory", () => {
  const brief = createAcquisitionDecisionBrief({ lead: lead(), buyerDemand: { hotZips: [{ label: "73102", count: 5 }], hotPriceRanges: [], hotPropertyTypes: [], byBuyerTier: { A: 1, B: 0, C: 0, D: 0 } }, generatedAt: new Date("2026-07-11T13:00:00.000Z") });
  assert.equal(brief.disposition, "research_next");
  assert.equal(brief.providerCalled, false);
  assert.equal(brief.liveExecutionAllowed, false);
  assert.equal(brief.externalWritesAllowed, false);
  assert.equal(brief.qa.status, "certified_for_internal_executive_review");
  assert.ok(brief.evidence.every((item) => item.sourceAuthority && item.sourceRecordReference));
  assert.ok(brief.evidence.filter((item) => ["arv", "estimatedRepairs", "desiredProfit"].includes(item.field)).every((item) => item.verificationState === "assumption"));
  assert.ok(brief.sections.find((item) => item.id === "public-records")?.missingData.includes("verified official public-record evidence"));
  assert.ok(brief.scenarioSensitivity.limitations.some((item) => item.includes("not an appraisal")));
  assert.ok(!JSON.stringify(brief).includes("approval_required"));
});

test("cross-property evidence is rejected, remains visible, and forces manager review", () => {
  const identity = createCanonicalPropertyIdentity(lead());
  const foreign: PropertyEvidenceItemV1 = {
    evidenceId: "foreign", propertyIdentityId: "property:other", category: "public_record", field: "assessedValue", value: 150000, unit: "USD", sourceAuthority: "official assessor", sourceRecordReference: "parcel-other", observedAt: "2026-07-01", retrievedAt: "2026-07-11", freshnessPolicy: "annual", confidence: 90, verificationState: "verified", permittedUse: "internal_acquisition_review_only", sensitivity: "internal", responsibleProfessionalId: "property-records-gis-analyst", contradictsEvidenceIds: [], supersedesEvidenceId: null,
  };
  assert.notEqual(foreign.propertyIdentityId, identity.identityId);
  const brief = createAcquisitionDecisionBrief({ lead: lead(), additionalEvidence: [foreign] });
  assert.equal(brief.evidence.some((item) => item.evidenceId === "foreign"), false);
  assert.equal(brief.disposition, "manager_review");
  assert.ok(brief.sections.find((item) => item.id === "identity")?.conflicts.some((item) => item.includes("rejected")));
});

test("insufficient identity cannot be certified for executive use", () => {
  const brief = createAcquisitionDecisionBrief({ lead: lead({ propertyAddress: "", parcelId: "", county: "" }) });
  assert.equal(brief.disposition, "not_actionable_with_current_evidence");
  assert.equal(brief.qa.status, "not_certified_for_executive_use");
  assert.ok(brief.missingInformation.includes("normalized address"));
});

function pilotRecords(): PilotComparisonRecord[] {
  const calibration = Array.from({ length: 10 }, (_, index) => ({ cohort: "calibration" as const, briefId: `cal-${index}`, baselineResearchMinutes: 40, assistedResearchMinutes: 25, usefulnessRating: 4 as const, initialDecision: "hold_missing_data" as const, finalDecision: "research_next" as const, inventedFacts: 0, crossPropertyLeaks: 0, unauthorizedActions: 0, seededIssues: 1, detectedSeededIssues: 1, falseHighPriorityIncrease: false }));
  const validation = Array.from({ length: 20 }, (_, index) => ({ cohort: "validation" as const, briefId: `val-${index}`, baselineResearchMinutes: 40, assistedResearchMinutes: 25, usefulnessRating: index < 16 ? 4 as const : 3 as const, initialDecision: "hold_missing_data" as const, finalDecision: "research_next" as const, inventedFacts: 0, crossPropertyLeaks: 0, unauthorizedActions: 0, seededIssues: 0, detectedSeededIssues: 0, falseHighPriorityIncrease: false }));
  return [...calibration, ...validation];
}

test("pilot promotion requires calibration, blind validation, safety, usefulness, and time thresholds", () => {
  const passing = evaluateProfessionalPilot(pilotRecords());
  assert.equal(passing.status, "promotion_ready");
  assert.equal(passing.medianImprovementPercent, 38);
  const failing = evaluateProfessionalPilot(pilotRecords().map((item, index) => index === 15 ? { ...item, inventedFacts: 1 } : item));
  assert.equal(failing.status, "calibration_required");
  assert.equal(failing.criteria.zeroInventedFacts, false);
});

test("source expansion is gated by marginal decision value rather than connector availability", () => {
  const high = scoreMarginalPropertySource({ id: "county_assessor", decisionImpact: 100, sectionCoverage: 90, dataGapFrequency: 90, authority: 100, freshness: 70, reuse: 90, integrationCost: 20, maintenanceCost: 20, licensingRisk: 5, privacyRisk: 20 });
  const low = scoreMarginalPropertySource({ id: "places", decisionImpact: 20, sectionCoverage: 20, dataGapFrequency: 10, authority: 50, freshness: 60, reuse: 30, integrationCost: 70, maintenanceCost: 60, licensingRisk: 40, privacyRisk: 50 });
  assert.equal(high.decision, "prepare_ueip_intake");
  assert.equal(low.decision, "defer");
  assert.equal(high.providerCalled, false);
});
