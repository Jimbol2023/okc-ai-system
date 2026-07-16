import assert from "node:assert/strict";
import test from "node:test";

import {
  assertCertificationTransition,
  assertValidEnterpriseCompetencyDefinition,
  certificationScopeKey,
  createDependencyImpactPreview,
  createEnterpriseProfessionalCompetencyLibraryReport,
  createProfessionalPortfolioReport,
  departmentProfessionalizationProfiles,
  enterpriseCompetencyDefinitions,
  evaluateInternalDeliverableEligibility,
  validatePropertyIntelligenceProofGate,
  type ProfessionalCertificationRecordV1,
  type ProfessionalCertificationScopeV1,
} from "../../lib/enterprise-professional-competency-library";
import { aiWorkforceEmployees } from "../../lib/ai-workforce";

test("EPC definitions enforce reuse and authority boundaries", () => {
  enterpriseCompetencyDefinitions.forEach(assertValidEnterpriseCompetencyDefinition);
  const shared = enterpriseCompetencyDefinitions.filter((item) => item.classification === "enterprise_shared");
  assert.ok(shared.every((item) => item.applicableDepartments.length >= 2));
  const report = createEnterpriseProfessionalCompetencyLibraryReport();
  assert.equal(report.architectureAuthority.workforce, "AI Workforce");
  assert.equal(report.architectureAuthority.providers, "UEIP");
  assert.equal(report.providerCalled, false);
  assert.equal(report.liveExecutionAllowed, false);
  assert.equal(report.externalWritesAllowed, false);
});

test("all departments remain explicitly unvalidated", () => {
  assert.equal(departmentProfessionalizationProfiles.length, 5);
  assert.ok(departmentProfessionalizationProfiles.every((item) => item.promotionGate === "not_validated"));
  assert.equal(createProfessionalPortfolioReport().sprint15Ready, false);
  const workforceIds = new Set(aiWorkforceEmployees.map((item) => item.id));
  for (const profile of departmentProfessionalizationProfiles) {
    assert.ok(profile.professionalIds.every((id) => workforceIds.has(id) || profile.department === "Property Intelligence"), `${profile.department} must reference the authoritative workforce registry`);
  }
});

test("property proof gate cannot pass incomplete or unsafe evidence", () => {
  const failed = validatePropertyIntelligenceProofGate({ calibrationLeadCount: 9, validationLeadCount: 19, inventedFacts: 1, crossPropertyLeakage: 1, seededIssuesDetected: 1, seededIssuesTotal: 2, medianResearchTimeImprovementPercent: 24, usefulOrBetterPercent: 79, falseHighPriorityIncreased: true, unauthorizedActions: 1 });
  assert.equal(failed.status, "failed");
  assert.ok(failed.failures.length >= 8);
  const passed = validatePropertyIntelligenceProofGate({ calibrationLeadCount: 10, validationLeadCount: 20, inventedFacts: 0, crossPropertyLeakage: 0, seededIssuesDetected: 4, seededIssuesTotal: 4, medianResearchTimeImprovementPercent: 25, usefulOrBetterPercent: 80, falseHighPriorityIncreased: false, unauthorizedActions: 0 });
  assert.equal(passed.status, "passed");
  assert.equal(passed.providerCalled, false);
});

test("certification is exact-scope and never grants execution", () => {
  const scope: ProfessionalCertificationScopeV1 = { tenantId: "tenant-a", professionalId: "analyst", profileVersion: "1.0.0", competencyId: "evidence-qualified-analysis", competencyVersion: "1.0.0", sopId: "epc-evidence-to-decision-sop", sopVersion: "1.0.0", deliverableId: "acquisition-decision-brief", deliverableVersion: "1.0.0", businessModule: "real-estate" };
  const certification: ProfessionalCertificationRecordV1 = { ...scope, certificationId: "cert-1", state: "certified_internal", assessmentRecordIds: ["assessment-1"], reason: "passed", certifiedBy: "admin", effectiveAt: new Date().toISOString(), expiresAt: null, providerAccessGranted: false, approvalAuthorityGranted: false, externalExecutionGranted: false };
  assert.equal(certificationScopeKey(scope), certificationScopeKey(certification));
  const allowed = evaluateInternalDeliverableEligibility({ certification, expectedScope: scope });
  assert.equal(allowed.eligible, true);
  assert.equal(allowed.externalExecutionGranted, false);
  const blocked = evaluateInternalDeliverableEligibility({ certification, expectedScope: { ...scope, tenantId: "tenant-b" } });
  assert.equal(blocked.eligible, false);
  assert.ok(blocked.reasons.includes("certification_scope_mismatch"));
});

test("certification lifecycle and dependency impacts are fail closed", () => {
  assert.equal(assertCertificationTransition("assessment_required", "certified_internal"), true);
  assert.throws(() => assertCertificationTransition("draft", "certified_internal"), /invalid_certification_transition/);
  assert.throws(() => assertCertificationTransition("retired", "assessment_required"), /invalid_certification_transition/);
  const impact = createDependencyImpactPreview(["epc-independent-evidence-qa"]);
  assert.equal(impact.requiresRecertification, true);
  assert.equal(impact.providerAuthorityChanged, false);
  assert.ok(impact.affectedDepartments.length > 0);
});
