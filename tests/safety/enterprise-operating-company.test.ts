import assert from "node:assert/strict";
import test from "node:test";

import {
  createCompanyDecisionPacket,
  createCompanyOutcomeCase,
  createDepartmentWorkAssignments,
  createOperatingCompanyScorecard,
  createRevenueDepartmentContribution,
  evaluateOperatingCompanyPilot,
  type OperatingCompanyPilotCaseV1,
} from "../../lib/enterprise-operating-company";
import { createProfessionalDefinitionRegistry, deriveProfessionalLifecycle, resolveProfessionalCompetencyDefinition } from "../../lib/enterprise-professional-competency-library";

const evidence = [{ evidenceId: "e-1", sourceReference: "internal-lead:lead-1", observedAt: "2026-07-12T12:00:00.000Z", confidence: 80, verificationState: "verified" as const, claim: "The internal pipeline record exists.", sensitivity: "internal" as const, permittedUse: "internal_executive_review_only" as const, conflicts: [] }];

test("canonical EPC registry resolves the complete professional graph", () => {
  const registry = createProfessionalDefinitionRegistry();
  assert.equal(registry.graphValidation.valid, true, registry.graphValidation.failures.join(","));
  assert.ok(resolveProfessionalCompetencyDefinition("revenue-pipeline-analysis", "1.0.0"));
  assert.equal(registry.providerAuthorityGranted, false);
  assert.equal(registry.externalExecutionGranted, false);
});

test("company case requires attribution, immutable snapshot, and provenance", () => {
  assert.throws(() => createCompanyOutcomeCase({ tenantId: "tenant-a", caseId: "case-1", leadId: "lead-1", correlationId: "corr-1", businessQuestion: "What needs review?", intendedOutcome: "Improve decision quality.", leadSource: "", inputSnapshotVersion: "snapshot-1", observationCutoff: "2026-07-12T12:00:00.000Z", mode: "calibration", evidence }), /lead_source_attribution_required/);
  const companyCase = createCompanyOutcomeCase({ tenantId: "tenant-a", caseId: "case-1", leadId: "lead-1", correlationId: "corr-1", businessQuestion: "What needs review?", intendedOutcome: "Improve decision quality.", leadSource: "website", inputSnapshotVersion: "snapshot-1", observationCutoff: "2026-07-12T12:00:00.000Z", mode: "calibration", evidence });
  assert.equal(companyCase.immutableSnapshot, true);
  assert.equal(companyCase.assignments.length, 5);
  assert.ok(companyCase.assignments.find((item) => item.department === "Creative Studio")?.blockers.includes("approved_internal_business_brief_required"));
  assert.equal(companyCase.providerCalled, false);
});

test("Revenue Operations produces a deterministic, independently reviewed brief", () => {
  const certified = ["senior-revenue-analyst", "revenue-quality-reviewer"];
  const assignment = createDepartmentWorkAssignments({ caseId: "case-1", mode: "operational", certifiedProfessionalIds: certified }).find((item) => item.department === "Revenue Operations")!;
  const contribution = createRevenueDepartmentContribution({ caseId: "case-1", assignment, snapshot: { tenantId: "tenant-a", snapshotVersion: "snapshot-1", observedAt: "2026-07-12T12:00:00.000Z", staleAfterHours: 24, pipelineItems: [{ leadId: "lead-1", source: "website", stage: "new", priority: "High", score: 80, updatedAt: "2026-07-10T12:00:00.000Z", responsibleHumanOwner: "Revenue Director", missingData: [], buyerDemandAlignment: "internal demand signal available", revenueDelayFactors: ["manual evidence review pending"], evidenceIds: ["e-1"] }], evidence, connectorHealthMetadata: [], assumptions: [] } });
  assert.equal(contribution.qaStatus, "ready_for_internal_executive_review");
  assert.equal(contribution.executiveUseEligible, true);
  assert.equal(contribution.providerCalled, false);
  const output = contribution.output as { stalledOpportunities: string[] };
  assert.deepEqual(output.stalledOpportunities, ["lead-1"]);
});

test("executive synthesis preserves QA blockers and never executes", () => {
  const assignments = createDepartmentWorkAssignments({ caseId: "case-1", mode: "operational", certifiedProfessionalIds: ["senior-revenue-analyst", "revenue-quality-reviewer"] });
  const revenue = createRevenueDepartmentContribution({ caseId: "case-1", assignment: assignments.find((item) => item.department === "Revenue Operations")!, snapshot: { tenantId: "tenant-a", snapshotVersion: "snapshot-1", observedAt: "2026-07-12T12:00:00.000Z", staleAfterHours: 24, pipelineItems: [{ leadId: "lead-1", source: "website", stage: "new", priority: "High", score: 80, updatedAt: "2026-07-12T10:00:00.000Z", responsibleHumanOwner: "Revenue Director", missingData: [], buyerDemandAlignment: "available", revenueDelayFactors: [], evidenceIds: ["e-1"] }], evidence, connectorHealthMetadata: [], assumptions: [] } });
  const companyCase = createCompanyOutcomeCase({ tenantId: "tenant-a", caseId: "case-1", leadId: "lead-1", correlationId: "corr-1", businessQuestion: "What is the next manual decision?", intendedOutcome: "Improve decision quality.", leadSource: "website", inputSnapshotVersion: "snapshot-1", observationCutoff: "2026-07-12T12:00:00.000Z", mode: "operational", evidence, certifiedProfessionalIds: ["senior-revenue-analyst", "revenue-quality-reviewer"], contributions: [revenue] });
  const packet = createCompanyDecisionPacket({ companyCase, responsibleHumanOwner: "CEO", expectedOutcome: "Reduce pipeline delay." });
  assert.equal(packet.executiveReady, true);
  assert.equal(packet.prioritizedCeoDecision, "approve_manual_internal_step");
  assert.equal(packet.liveExecutionAllowed, false);
  assert.equal(packet.externalWritesAllowed, false);
});

function pilotRecord(index: number, cohort: OperatingCompanyPilotCaseV1["cohort"]): OperatingCompanyPilotCaseV1 { return { caseId: `${cohort}-${index}`, cohort, baselineReviewMinutes: 40, assistedReviewMinutes: 30, usefulnessRating: 4, inventedFacts: 0, crossPropertyLeaks: 0, unauthorizedActions: 0, seededCriticalDefects: 1, detectedSeededCriticalDefects: 1, falseHighPriorityIncreased: false, leadSourceVisible: true, materialClaimsWithProvenance: true, assumptionsConflictsAndGapsVisible: true, responsibleHumanOwnerPresent: true, evidenceReferences: [`evidence:${index}`] }; }

test("company pilot requires 10 calibration and 20 blind-validation cases", () => {
  const incomplete = evaluateOperatingCompanyPilot([pilotRecord(1, "calibration")]);
  assert.equal(incomplete.status, "calibration_required");
  const complete = evaluateOperatingCompanyPilot([...Array.from({ length: 10 }, (_, index) => pilotRecord(index, "calibration")), ...Array.from({ length: 20 }, (_, index) => pilotRecord(index, "blind_validation"))]);
  assert.equal(complete.status, "ready_for_human_promotion_review");
  assert.equal(complete.promotionAutomatic, false);
});

test("professional lifecycle is derived independently from job level and provider authority", () => {
  const lifecycle = deriveProfessionalLifecycle({ professionalId: "senior-revenue-analyst", requiredCompetencyIds: ["revenue-pipeline-analysis"], certifications: [], remediationOpen: false, promotionPassed: false });
  assert.equal(lifecycle.state, "assessment_required");
  assert.equal(lifecycle.providerAuthorityGranted, false);
  const scorecard = createOperatingCompanyScorecard([]);
  assert.equal(scorecard.providerCalled, false);
});
