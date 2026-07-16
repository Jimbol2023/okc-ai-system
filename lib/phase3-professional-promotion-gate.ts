import { professionalToolchainContracts } from "@/lib/professional-toolchains";

export type Phase3ProgramStatus =
  | "blocked_workspace"
  | "legacy_remediation_required"
  | "calibration_required"
  | "blind_validation_required"
  | "human_promotion_review_required"
  | "promotion_ready";

export type LegacyFailureCause =
  | "false_authorization_match"
  | "old_contract_wording"
  | "actual_compatibility_regression"
  | "nonterminating_historical_batch";

export type LegacyFailureCorrectAction =
  | "fix_test_semantic_assertion"
  | "update_stale_assertion"
  | "fix_product_implementation"
  | "keep_timeout_and_repair_test_or_process";

export type RecommendationOutcome = "accepted" | "rejected" | "revised";

export type Phase3ProfessionalOutputV1 = {
  caseId: string;
  leadProfessionalId: "marketing-intelligence-director";
  contributorProfessionalIds: Array<"senior-seo-director" | "senior-analytics-specialist" | "local-visibility-specialist" | "content-intelligence-strategist">;
  independentReviewerId: "marketing-quality-reviewer";
  finalHumanOwnerId: string;
  evidenceReferences: string[];
  unsupportedClaimChecks: string[];
  assumptions: string[];
  missingData: string[];
  noActionFallback: string;
  recommendationOutcome: RecommendationOutcome;
  providerContribution: "none" | "stored_evidence" | "supervised_live_read";
  providerCalled: false;
  externalWritesAllowed: false;
  published: false;
  outreachSent: false;
  crmMutated: false;
  workflowExecuted: false;
  approvalAsExecution: false;
};

export type Phase3ValidationCaseV1 = {
  caseId: string;
  cohort: "calibration" | "blind_validation";
  preparationMinutes: number;
  humanReviewMinutes: number;
  baselineHumanReviewMinutes: number;
  qaDefectCount: number;
  unsupportedClaimsCaught: number;
  ceoUsefulnessRating: 1 | 2 | 3 | 4 | 5;
  evidenceGaps: string[];
  recommendationOutcome: RecommendationOutcome;
  providerContribution: "none" | "stored_evidence" | "supervised_live_read";
  noActionFallbackQuality: "poor" | "acceptable" | "strong";
  inventedMetrics: number;
  seededCriticalDefects: number;
  detectedCriticalDefects: number;
  harmfulErrorIncrease: boolean;
  professionalOutput: Phase3ProfessionalOutputV1;
};

export type Phase3ToolchainReadinessEvidence = {
  toolchainId: string;
  certificationStatus: "missing" | "calibration_only" | "certified_internal";
  evidenceQuality: 0 | 1 | 2 | 3 | 4 | 5;
  qaPassRatePercent: number;
  reviewTimeImprovementPercent: number;
  ceoUsefulOrBetterPercent: number;
  safetyBoundaryCompliant: boolean;
};

export const phase3CanonicalWorkspace = "/home/sabiu/projects/okc-wholesale-ai-system-git";
export const phase25Status = "hardening_complete_with_legacy_remediation_open" as const;
export const phase4Status = "blocked_until_phase3_promotion" as const;

export const phase3VerificationCommands = [
  "npx prisma validate",
  "npx tsc --noEmit",
  "npm run lint",
  "npm run test:unit:all",
  "npm run test:safety",
  "npm run build:storybook",
  "npm run build",
  "npm run test:pressure:professional-cases:isolated",
  "npm run test:e2e",
] as const;

export const phase3ProfessionalRoles = {
  caseLead: "marketing-intelligence-director",
  contributors: ["senior-seo-director", "senior-analytics-specialist", "local-visibility-specialist", "content-intelligence-strategist"],
  independentQa: "marketing-quality-reviewer",
  finalAuthority: "human_go_no_go_owner",
} as const;

export const phase3AuthorityBoundaries = {
  publishing: false,
  providerWrites: false,
  outreach: false,
  crmMutation: false,
  workflowExecution: false,
  approvalAsExecution: false,
  phase4: false,
} as const;

export const legacySuiteMigrationMatrix = [
  { legacyFailure: "False authorization match", cause: "false_authorization_match", correctAction: "fix_test_semantic_assertion" },
  { legacyFailure: "Old contract wording", cause: "old_contract_wording", correctAction: "update_stale_assertion" },
  { legacyFailure: "Actual compatibility regression", cause: "actual_compatibility_regression", correctAction: "fix_product_implementation" },
  { legacyFailure: "Nonterminating historical batch", cause: "nonterminating_historical_batch", correctAction: "keep_timeout_and_repair_test_or_process" },
] as const satisfies ReadonlyArray<{ legacyFailure: string; cause: LegacyFailureCause; correctAction: LegacyFailureCorrectAction }>;

export const phase3HighestRoiImprovements = [
  "Phase 3 promotion dashboard/report",
  "Legacy remediation matrix",
  "Professional calibration ledger",
  "Blind-validation ledger",
  "QA and seeded-critical-defect tracker",
  "Search/market evidence provenance checker",
  "Local/staging security verification pack",
  "Executive go/no-go packet",
] as const;

export const phase3LocalStagingSecurityPack = [
  "dependency_audit",
  "static_code_and_config_review",
  "auth_and_approval_boundary_tests",
  "provider_no_external_action_assertions",
  "playwright_smoke_checks",
  "playwright_or_storybook_accessibility_checks",
  "isolated_pressure_testing",
] as const;

export function safeNegativeAuthorityTextDoesNotGrantAuthority(text: string) {
  const normalized = text.toLowerCase();
  const safeNegative = /\bno\b[^.]{0,120}\b(?:is|are|was|were)?\s*authorized\b/.test(normalized) || /\bnot_authorized\b/.test(normalized);
  const explicitGrant = /\b(?:execution|publishing|provider write|outreach|crm mutation|workflow)\s+is\s+authorized\b/.test(normalized) && !safeNegative;
  return { safeNegative, authorityGranted: explicitGrant };
}

export function assertPhase3ProfessionalOutput(output: Phase3ProfessionalOutputV1) {
  if (output.leadProfessionalId !== phase3ProfessionalRoles.caseLead) throw new Error("phase3_case_lead_required");
  if (output.independentReviewerId !== phase3ProfessionalRoles.independentQa) throw new Error("phase3_independent_qa_required");
  if (!output.finalHumanOwnerId.trim()) throw new Error("phase3_human_go_no_go_owner_required");
  if (output.evidenceReferences.length === 0) throw new Error("phase3_evidence_references_required");
  if (output.unsupportedClaimChecks.length === 0) throw new Error("phase3_unsupported_claim_checks_required");
  if (output.assumptions.length === 0) throw new Error("phase3_assumptions_required");
  if (output.noActionFallback.trim().length === 0) throw new Error("phase3_no_action_fallback_required");
  if (output.providerCalled || output.externalWritesAllowed || output.published || output.outreachSent || output.crmMutated || output.workflowExecuted || output.approvalAsExecution) {
    throw new Error("phase3_external_authority_boundary_failed");
  }
  return true;
}

function median(values: number[]) {
  const ordered = [...values].sort((a, b) => a - b);
  if (ordered.length === 0) return 0;
  const middle = Math.floor(ordered.length / 2);
  return ordered.length % 2 === 0 ? (ordered[middle - 1] + ordered[middle]) / 2 : ordered[middle];
}

export function scorePhase3ToolchainReadiness(evidence: Phase3ToolchainReadinessEvidence) {
  const toolchain = professionalToolchainContracts.find((item) => item.id === evidence.toolchainId);
  const certificationPoints = evidence.certificationStatus === "certified_internal" ? 20 : evidence.certificationStatus === "calibration_only" ? 10 : 0;
  const evidencePoints = evidence.evidenceQuality * 8;
  const qaPoints = Math.max(0, Math.min(20, evidence.qaPassRatePercent / 5));
  const reviewPoints = Math.max(0, Math.min(10, evidence.reviewTimeImprovementPercent / 2.5));
  const usefulnessPoints = Math.max(0, Math.min(10, evidence.ceoUsefulOrBetterPercent / 8));
  const safetyPoints = evidence.safetyBoundaryCompliant ? 20 : 0;
  const score = Math.min(100, Math.round(certificationPoints + evidencePoints + qaPoints + reviewPoints + usefulnessPoints + safetyPoints));
  const readiness = !toolchain
    ? "unknown_toolchain"
    : !evidence.safetyBoundaryCompliant
      ? "blocked_safety"
      : score >= 90 && evidence.certificationStatus === "certified_internal"
        ? "promotion_ready"
        : score >= 70
          ? "calibration_ready"
          : "remediation_required";
  return { toolchainId: evidence.toolchainId, score, readiness, providerAuthorityGranted: false as const, externalExecutionGranted: false as const };
}

export function evaluatePhase3ProfessionalPromotionGate(input: {
  workspacePath: string;
  discoveredLegacySuiteGreen: boolean;
  hiddenExclusions: number;
  skippedTests: number;
  calibrationCases: Phase3ValidationCaseV1[];
  blindValidationCases: Phase3ValidationCaseV1[];
  scoringFrozenBeforeBlindValidation: boolean;
  humanGoNoGoApproved: boolean;
}) {
  const allCases = [...input.calibrationCases, ...input.blindValidationCases];
  for (const record of allCases) assertPhase3ProfessionalOutput(record.professionalOutput);
  const inventedMetrics = allCases.reduce((sum, record) => sum + record.inventedMetrics, 0);
  const seededCriticalDefects = allCases.reduce((sum, record) => sum + record.seededCriticalDefects, 0);
  const detectedCriticalDefects = allCases.reduce((sum, record) => sum + record.detectedCriticalDefects, 0);
  const medianReviewImprovementPercent = median(allCases.map((record) => {
    if (record.baselineHumanReviewMinutes <= 0) return 0;
    return ((record.baselineHumanReviewMinutes - record.humanReviewMinutes) / record.baselineHumanReviewMinutes) * 100;
  }));
  const usefulOrBetterPercent = allCases.length === 0 ? 0 : (allCases.filter((record) => record.ceoUsefulnessRating >= 4).length / allCases.length) * 100;
  const harmfulErrorIncrease = allCases.some((record) => record.harmfulErrorIncrease);
  const failures: string[] = [];
  if (input.workspacePath !== phase3CanonicalWorkspace) failures.push("canonical_linux_workspace_required");
  if (!input.discoveredLegacySuiteGreen) failures.push("legacy_suite_not_green");
  if (input.hiddenExclusions > 0 || input.skippedTests > 0) failures.push("hidden_or_skipped_tests_blocked");
  if (input.calibrationCases.length < 10) failures.push("calibration_cases_required");
  if (input.blindValidationCases.length < 20) failures.push("blind_validation_cases_required");
  if (!input.scoringFrozenBeforeBlindValidation) failures.push("blind_validation_scoring_not_frozen");
  if (inventedMetrics > 0) failures.push("invented_metrics_blocked");
  if (seededCriticalDefects !== detectedCriticalDefects) failures.push("seeded_critical_defects_not_all_detected");
  if (medianReviewImprovementPercent < 25) failures.push("review_time_improvement_below_gate");
  if (usefulOrBetterPercent < 80) failures.push("ceo_usefulness_below_gate");
  if (harmfulErrorIncrease) failures.push("harmful_error_increase_blocked");
  if (!input.humanGoNoGoApproved) failures.push("human_go_no_go_required");

  const status: Phase3ProgramStatus =
    failures.includes("canonical_linux_workspace_required")
      ? "blocked_workspace"
      : failures.includes("legacy_suite_not_green") || failures.includes("hidden_or_skipped_tests_blocked")
        ? "legacy_remediation_required"
        : failures.includes("calibration_cases_required")
          ? "calibration_required"
          : failures.includes("blind_validation_cases_required") || failures.includes("blind_validation_scoring_not_frozen")
            ? "blind_validation_required"
            : failures.includes("human_go_no_go_required")
              ? "human_promotion_review_required"
              : failures.length === 0
                ? "promotion_ready"
                : "legacy_remediation_required";

  return {
    phase25Status,
    phase3Status: status,
    phase4Status,
    failures,
    metrics: {
      calibrationCases: input.calibrationCases.length,
      blindValidationCases: input.blindValidationCases.length,
      inventedMetrics,
      seededCriticalDefects,
      detectedCriticalDefects,
      medianReviewImprovementPercent,
      usefulOrBetterPercent,
      harmfulErrorIncrease,
    },
    promotionAutomatic: false as const,
    providerAuthorityGranted: false as const,
    externalExecutionGranted: false as const,
  };
}

export function createPhase3ExecutiveGoNoGoPacket(input: Parameters<typeof evaluatePhase3ProfessionalPromotionGate>[0]) {
  const gate = evaluatePhase3ProfessionalPromotionGate(input);
  return {
    schemaVersion: "phase3-professional-promotion-go-no-go-v1" as const,
    phase25Status,
    phase3Status: gate.phase3Status,
    phase4Status,
    canonicalWorkspace: phase3CanonicalWorkspace,
    professionalRoles: phase3ProfessionalRoles,
    highestRoiImprovements: phase3HighestRoiImprovements,
    localStagingSecurityPack: phase3LocalStagingSecurityPack,
    verificationCommands: phase3VerificationCommands,
    promotionCriteria: gate.metrics,
    blockers: gate.failures,
    recommendedHumanDecision: gate.phase3Status === "promotion_ready" ? "approve_phase3_promotion_record_only" : "continue_phase3_remediation",
    promotionAutomatic: false as const,
    providerAuthorityGranted: false as const,
    externalExecutionGranted: false as const,
    phase4Authorized: false as const,
  };
}
