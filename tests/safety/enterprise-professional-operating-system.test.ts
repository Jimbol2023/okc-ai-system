import assert from "node:assert/strict";
import test from "node:test";

import {
  assertValidProfessionalOperatingSystem,
  canonicalProfessionalIdentityRegistry,
  canonicalProfessionalProfileIds,
  companyOrgUnitRegistry,
  createConnectorDemandPortfolio,
  createEnterpriseProfessionalOperatingSystemReport,
  createExecutiveProfessionalPortfolio,
  createGovernedProfessionalDeliverable,
  evaluateDepartmentPromotion,
  industryProfessionalizationPacks,
  professionalCapabilityQualifications,
  professionalCompetencyContracts,
  professionalDeliverableContracts,
  professionalProfileContracts,
  professionalPromotionContracts,
} from "../../lib/enterprise-professional-operating-system";
import { aiWorkforceEmployees } from "../../lib/ai-workforce";

const passingMetrics = {
  calibrationCaseCount: 10,
  blindValidationCaseCount: 20,
  inventedFacts: 0,
  unauthorizedActions: 0,
  seededCriticalDefects: 4,
  detectedSeededCriticalDefects: 4,
  medianTimeImprovementPercent: 25,
  usefulOrBetterPercent: 80,
  harmfulErrorIncreased: false,
  outcomeEvidenceReferences: ["cohort:evidence:1"],
};

test("professional operating system provides reusable enterprise contracts", () => {
  assert.equal(assertValidProfessionalOperatingSystem(), true);
  const report = createEnterpriseProfessionalOperatingSystemReport();
  assert.ok(report.contracts.profiles.length >= 20);
  assert.ok(report.contracts.competencies.some((item) => item.layer === "enterprise_core"));
  assert.ok(report.contracts.competencies.some((item) => item.layer === "functional"));
  assert.ok(report.contracts.competencies.some((item) => item.layer === "industry"));
  assert.equal(report.providerCalled, false);
  assert.equal(report.liveExecutionAllowed, false);
  assert.equal(report.externalWritesAllowed, false);
});

test("each new department has accountable professionals, deliverables, scorecards, and promotion", () => {
  for (const department of ["Revenue Operations", "Marketing Intelligence", "Finance and Executive Analytics", "Creative Studio"] as const) {
    assert.ok(professionalProfileContracts.some((item) => item.department === department));
    assert.ok(professionalProfileContracts.some((item) => item.department === department && item.title.includes("Reviewer")));
    assert.ok(professionalDeliverableContracts.some((item) => item.department === department));
    assert.ok(professionalPromotionContracts.some((item) => item.department === department));
  }
  assert.ok(professionalCompetencyContracts.some((item) => item.id === "marketing-attribution-analysis"));
  assert.ok(professionalDeliverableContracts.some((item) => item.id === "seo-optimization-plan"));
  assert.ok(professionalDeliverableContracts.some((item) => item.id === "executive-seo-brief"));
  assert.ok(professionalDeliverableContracts.some((item) => item.id === "local-visibility-report"));
  assert.ok(professionalDeliverableContracts.some((item) => item.id === "content-opportunity-report"));
  assert.ok(professionalProfileContracts.some((item) => item.professionalId === "senior-analytics-specialist"));
  assert.ok(professionalProfileContracts.some((item) => item.professionalId === "local-visibility-specialist"));
});

test("promotion remains sequential and requires real balanced evidence", () => {
  const blocked = evaluateDepartmentPromotion("Revenue Operations", passingMetrics, []);
  assert.equal(blocked.status, "failed");
  assert.ok(blocked.failures.includes("predecessor_not_passed:Property Intelligence"));
  const passed = evaluateDepartmentPromotion("Revenue Operations", passingMetrics, ["Property Intelligence"]);
  assert.equal(passed.status, "passed");
  assert.equal(passed.automaticPromotion, false);
  const unsafe = evaluateDepartmentPromotion("Marketing Intelligence", { ...passingMetrics, inventedFacts: 1, outcomeEvidenceReferences: [] }, ["Revenue Operations"]);
  assert.equal(unsafe.status, "failed");
  assert.ok(unsafe.failures.includes("invented_facts_detected"));
  assert.ok(unsafe.failures.includes("outcome_evidence_required"));
});

test("deliverable runtime fails closed without scoped independent review", () => {
  const base = {
    deliverableId: "marketing-performance-decision-brief",
    tenantId: "tenant-a",
    businessQuestion: "Which verified marketing signal deserves manual review?",
    accountableOwner: "Marketing Intelligence Director",
    inputSnapshotVersion: "snapshot-1",
    observationCutoff: "2026-07-12T00:00:00.000Z",
    evidence: [{ evidenceId: "e-1", sourceReference: "normalized:search-console:1", observedAt: "2026-07-11T00:00:00.000Z", confidence: 80, verificationState: "verified" as const, claim: "A normalized search signal is available.", sensitivity: "internal" as const, permittedUse: "internal_executive_review_only" as const, conflicts: [] }],
    assumptions: [], missingData: [], expectedBusinessValue: "Reduce manual analysis time.", recommendedManualDecision: "Review the source-qualified search opportunity.", generatorProfessionalId: "marketing-intelligence-director", reviewerProfessionalId: "marketing-quality-reviewer",
  };
  const ready = createGovernedProfessionalDeliverable(base);
  assert.equal(ready.qa.status, "ready_for_internal_executive_review");
  assert.equal(ready.providerCalled, false);
  assert.equal(ready.externalWritesAllowed, false);
  const selfReviewed = createGovernedProfessionalDeliverable({ ...base, reviewerProfessionalId: "marketing-intelligence-director" });
  assert.equal(selfReviewed.qa.status, "blocked_remediation_required");
  const missingProvenance = createGovernedProfessionalDeliverable({ ...base, evidence: [{ ...base.evidence[0], sourceReference: "" }] });
  assert.equal(missingProvenance.qa.status, "blocked_remediation_required");
});

test("capability qualification is metadata-only and ranks connector demand", () => {
  assert.ok(professionalCapabilityQualifications.some((item) => item.connectorId === "google_search_console"));
  assert.ok(professionalCapabilityQualifications.some((item) => item.connectorId === "google_maps" && item.registrationState === "planned"));
  assert.ok(professionalCapabilityQualifications.every((item) => !item.providerAuthorityGranted && !item.externalExecutionGranted));
  const portfolio = createConnectorDemandPortfolio();
  assert.equal(portfolio.providerCalled, false);
  assert.equal(portfolio.connectorActivationAllowed, false);
  assert.ok(portfolio.demands.length >= 3);
});

test("executive portfolio and industry pack preserve authority boundaries", () => {
  const portfolio = createExecutiveProfessionalPortfolio({ "Property Intelligence": "passed", "Revenue Operations": "passed" });
  const marketing = portfolio.departments.find((item) => item.department === "Marketing Intelligence");
  assert.equal(marketing?.predecessorBlocker, null);
  assert.equal(portfolio.learningAuthority, "recommend_versioned_changes_only");
  assert.equal(portfolio.providerCalled, false);
  assert.equal(industryProfessionalizationPacks[0].businessModule, "real-estate");
  assert.equal(industryProfessionalizationPacks[0].externalExecutionGranted, false);
});

test("every workforce identity has a canonical professional mapping without inferred certification", () => {
  assert.equal(canonicalProfessionalIdentityRegistry.length, aiWorkforceEmployees.length);
  assert.equal(new Set(canonicalProfessionalIdentityRegistry.map((identity) => identity.workforceId)).size, aiWorkforceEmployees.length);
  assert.ok(canonicalProfessionalIdentityRegistry.every((identity) => identity.professionalProfileIds.length > 0));
  assert.ok(canonicalProfessionalIdentityRegistry.every((identity) => identity.professionalProfileIds.every((id) => canonicalProfessionalProfileIds.has(id))));
  assert.ok(canonicalProfessionalIdentityRegistry.every((identity) => identity.certificationSource === "persisted_assessment_and_human_decision_only"));
  assert.ok(canonicalProfessionalIdentityRegistry.every((identity) => !identity.connectorReadinessDefinesCertification && !identity.providerAuthorityGranted && !identity.externalExecutionGranted));
});

test("canonical company organization contains every approved command, control, and operating unit", () => {
  assert.equal(companyOrgUnitRegistry.length, 14);
  assert.equal(new Set(companyOrgUnitRegistry.map((unit) => unit.id)).size, 14);
  assert.ok(companyOrgUnitRegistry.some((unit) => unit.name === "Search and Market Intelligence" && unit.legacyAliases.includes("Marketing Intelligence")));
  assert.ok(companyOrgUnitRegistry.some((unit) => unit.name === "Creative and Design Studio" && unit.legacyAliases.includes("Creative Studio")));
});

test("property and DFD professionals live in the canonical registry and remain assessment-gated", () => {
  const property = professionalProfileContracts.filter((profile) => profile.department === "Property Intelligence");
  assert.ok(property.some((profile) => profile.professionalId === "dfd-virtual-property-scout"));
  assert.ok(property.some((profile) => profile.professionalId === "property-intelligence-quality-reviewer"));
  assert.ok(property.every((profile) => profile.businessModule === "real-estate" && profile.lifecycleState === "assessment_required"));
  assert.ok(property.every((profile) => profile.readinessDimensions.externalExecutionAuthorization === "blocked"));
});
