import assert from "node:assert/strict";
import test from "node:test";

import {
  assertPhase3ProfessionalOutput,
  createPhase3ExecutiveGoNoGoPacket,
  evaluatePhase3ProfessionalPromotionGate,
  phase3HighestRoiImprovements,
  phase3LocalStagingSecurityPack,
  legacySuiteMigrationMatrix,
  phase25Status,
  phase3AuthorityBoundaries,
  phase3CanonicalWorkspace,
  phase3ProfessionalRoles,
  phase3VerificationCommands,
  phase4Status,
  safeNegativeAuthorityTextDoesNotGrantAuthority,
  scorePhase3ToolchainReadiness,
  type Phase3ProfessionalOutputV1,
  type Phase3ValidationCaseV1,
} from "../../lib/phase3-professional-promotion-gate";

function professionalOutput(caseId: string): Phase3ProfessionalOutputV1 {
  return {
    caseId,
    leadProfessionalId: "marketing-intelligence-director",
    contributorProfessionalIds: ["senior-seo-director", "senior-analytics-specialist", "local-visibility-specialist", "content-intelligence-strategist"],
    independentReviewerId: "marketing-quality-reviewer",
    finalHumanOwnerId: "ceo",
    evidenceReferences: [`stored-evidence:${caseId}`],
    unsupportedClaimChecks: ["No unsupported ranking, traffic, conversion, revenue, publishing, or provider authority claim is present."],
    assumptions: ["Stored normalized evidence is used for gate validation."],
    missingData: ["Live provider evidence is not required for every calibration case."],
    noActionFallback: "Hold the decision and request verified evidence; do not publish, mutate CRM, contact anyone, or execute workflows.",
    recommendationOutcome: "revised",
    providerContribution: "stored_evidence",
    providerCalled: false,
    externalWritesAllowed: false,
    published: false,
    outreachSent: false,
    crmMutated: false,
    workflowExecuted: false,
    approvalAsExecution: false,
  };
}

function validationCase(index: number, cohort: "calibration" | "blind_validation"): Phase3ValidationCaseV1 {
  return {
    caseId: `${cohort}-${index}`,
    cohort,
    preparationMinutes: 18,
    humanReviewMinutes: 28,
    baselineHumanReviewMinutes: 40,
    qaDefectCount: 0,
    unsupportedClaimsCaught: 1,
    ceoUsefulnessRating: index % 5 === 0 ? 3 : 4,
    evidenceGaps: ["Stored evidence only; live provider read not required."],
    recommendationOutcome: "revised",
    providerContribution: "stored_evidence",
    noActionFallbackQuality: "strong",
    inventedMetrics: 0,
    seededCriticalDefects: 1,
    detectedCriticalDefects: 1,
    harmfulErrorIncrease: false,
    professionalOutput: professionalOutput(`${cohort}-${index}`),
  };
}

test("Phase 3 professional gate pins statuses, roles, authority boundaries, and Linux verification", () => {
  assert.equal(phase25Status, "hardening_complete_with_legacy_remediation_open");
  assert.equal(phase4Status, "blocked_until_phase3_promotion");
  assert.equal(phase3CanonicalWorkspace, "/home/sabiu/projects/okc-wholesale-ai-system-git");
  assert.equal(phase3ProfessionalRoles.caseLead, "marketing-intelligence-director");
  assert.equal(phase3ProfessionalRoles.independentQa, "marketing-quality-reviewer");
  assert.deepEqual(phase3AuthorityBoundaries, { publishing: false, providerWrites: false, outreach: false, crmMutation: false, workflowExecution: false, approvalAsExecution: false, phase4: false });
  assert.ok(phase3VerificationCommands.includes("npm run test:unit:all"));
  assert.ok(phase3VerificationCommands.includes("npm run test:pressure:professional-cases:isolated"));
  assert.equal(phase3HighestRoiImprovements.length, 8);
  assert.ok(phase3HighestRoiImprovements.includes("Executive go/no-go packet"));
  assert.ok(phase3LocalStagingSecurityPack.includes("auth_and_approval_boundary_tests"));
  assert.ok(phase3LocalStagingSecurityPack.includes("isolated_pressure_testing"));
});

test("legacy remediation matrix fixes tests or implementation without weakening the runner", () => {
  assert.equal(legacySuiteMigrationMatrix.length, 4);
  assert.deepEqual(legacySuiteMigrationMatrix.map((item) => item.cause), ["false_authorization_match", "old_contract_wording", "actual_compatibility_regression", "nonterminating_historical_batch"]);
  assert.deepEqual(legacySuiteMigrationMatrix.map((item) => item.correctAction), ["fix_test_semantic_assertion", "update_stale_assertion", "fix_product_implementation", "keep_timeout_and_repair_test_or_process"]);
});

test("safe negative authorization language never grants publishing authority", () => {
  const safe = safeNegativeAuthorityTextDoesNotGrantAuthority("No publishing is authorized. No provider writes are authorized.");
  assert.equal(safe.safeNegative, true);
  assert.equal(safe.authorityGranted, false);

  const unsafe = safeNegativeAuthorityTextDoesNotGrantAuthority("Publishing is authorized.");
  assert.equal(unsafe.authorityGranted, true);
});

test("professional outputs require evidence, QA independence, fallback, and no external authority", () => {
  assert.equal(assertPhase3ProfessionalOutput(professionalOutput("case-1")), true);
  assert.throws(() => assertPhase3ProfessionalOutput({ ...professionalOutput("case-2"), evidenceReferences: [] }), /phase3_evidence_references_required/);
  const unsafeRuntimeRecord = { ...professionalOutput("case-3"), published: true } as unknown as Phase3ProfessionalOutputV1;
  assert.throws(() => assertPhase3ProfessionalOutput(unsafeRuntimeRecord), /phase3_external_authority_boundary_failed/);
});

test("toolchain readiness score separates professional proof from execution authority", () => {
  const ready = scorePhase3ToolchainReadiness({ toolchainId: "seo-director-search-intelligence-toolchain", certificationStatus: "certified_internal", evidenceQuality: 5, qaPassRatePercent: 100, reviewTimeImprovementPercent: 25, ceoUsefulOrBetterPercent: 80, safetyBoundaryCompliant: true });
  assert.equal(ready.readiness, "promotion_ready");
  assert.equal(ready.score, 100);
  assert.equal(ready.providerAuthorityGranted, false);
  assert.equal(ready.externalExecutionGranted, false);

  const blocked = scorePhase3ToolchainReadiness({ toolchainId: "seo-director-search-intelligence-toolchain", certificationStatus: "certified_internal", evidenceQuality: 5, qaPassRatePercent: 100, reviewTimeImprovementPercent: 25, ceoUsefulOrBetterPercent: 80, safetyBoundaryCompliant: false });
  assert.equal(blocked.readiness, "blocked_safety");
});

test("promotion gate requires Linux workspace, green legacy suite, 10 calibration, 20 blind validation, and human approval", () => {
  const calibrationCases = Array.from({ length: 10 }, (_, index) => validationCase(index, "calibration"));
  const blindValidationCases = Array.from({ length: 20 }, (_, index) => validationCase(index, "blind_validation"));
  const passing = evaluatePhase3ProfessionalPromotionGate({ workspacePath: phase3CanonicalWorkspace, discoveredLegacySuiteGreen: true, hiddenExclusions: 0, skippedTests: 0, calibrationCases, blindValidationCases, scoringFrozenBeforeBlindValidation: true, humanGoNoGoApproved: true });
  assert.equal(passing.phase3Status, "promotion_ready");
  assert.equal(passing.promotionAutomatic, false);
  assert.equal(passing.phase4Status, "blocked_until_phase3_promotion");
  assert.equal(passing.metrics.inventedMetrics, 0);
  assert.equal(passing.metrics.detectedCriticalDefects, passing.metrics.seededCriticalDefects);
  assert.ok(passing.metrics.medianReviewImprovementPercent >= 25);
  assert.ok(passing.metrics.usefulOrBetterPercent >= 80);

  const workspaceBlocked = evaluatePhase3ProfessionalPromotionGate({ workspacePath: "C:\\projects\\okc-wholesale-ai-system-git", discoveredLegacySuiteGreen: true, hiddenExclusions: 0, skippedTests: 0, calibrationCases, blindValidationCases, scoringFrozenBeforeBlindValidation: true, humanGoNoGoApproved: true });
  assert.equal(workspaceBlocked.phase3Status, "blocked_workspace");
  assert.ok(workspaceBlocked.failures.includes("canonical_linux_workspace_required"));

  const legacyBlocked = evaluatePhase3ProfessionalPromotionGate({ workspacePath: phase3CanonicalWorkspace, discoveredLegacySuiteGreen: false, hiddenExclusions: 0, skippedTests: 0, calibrationCases, blindValidationCases, scoringFrozenBeforeBlindValidation: true, humanGoNoGoApproved: true });
  assert.equal(legacyBlocked.phase3Status, "legacy_remediation_required");

  const blindBlocked = evaluatePhase3ProfessionalPromotionGate({ workspacePath: phase3CanonicalWorkspace, discoveredLegacySuiteGreen: true, hiddenExclusions: 0, skippedTests: 0, calibrationCases, blindValidationCases: blindValidationCases.slice(0, 19), scoringFrozenBeforeBlindValidation: true, humanGoNoGoApproved: true });
  assert.equal(blindBlocked.phase3Status, "blind_validation_required");
});

test("executive go/no-go packet is decision-ready but does not authorize Phase 4 or external execution", () => {
  const calibrationCases = Array.from({ length: 10 }, (_, index) => validationCase(index, "calibration"));
  const blindValidationCases = Array.from({ length: 20 }, (_, index) => validationCase(index, "blind_validation"));
  const packet = createPhase3ExecutiveGoNoGoPacket({ workspacePath: phase3CanonicalWorkspace, discoveredLegacySuiteGreen: true, hiddenExclusions: 0, skippedTests: 0, calibrationCases, blindValidationCases, scoringFrozenBeforeBlindValidation: true, humanGoNoGoApproved: true });
  assert.equal(packet.schemaVersion, "phase3-professional-promotion-go-no-go-v1");
  assert.equal(packet.recommendedHumanDecision, "approve_phase3_promotion_record_only");
  assert.equal(packet.phase4Authorized, false);
  assert.equal(packet.providerAuthorityGranted, false);
  assert.equal(packet.externalExecutionGranted, false);
});
