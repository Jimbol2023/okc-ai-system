export const y9PlanningFlags = {
  readOnly: true,
  advisoryOnly: true,
  humanReviewOnly: true,
  simulationOnly: true,
  providerCalled: false,
  sent: false,
  persistenceWritten: false,
  persistenceAllowedNow: false,
  pollingAllowed: false,
  runtimeActivationAllowed: false,
  providerActivationAllowed: false,
  approvalGrantsExecution: false,
  schemaChangesAuthorized: false,
  migrationsAuthorized: false,
  storageAuthorized: false,
  auditWritingAllowed: false,
} as const;

export const y9AuthorizationEvidenceAreas = ["Y6 draft evidence", "Y7 gate evidence", "Y8 human approval package evidence", "redaction evidence", "retention evidence", "rollback evidence", "operator readiness evidence", "security/privacy evidence", "explicit authorization absence"] as const;

export type Y9FinalAuthorizationEvidenceInput = Partial<Record<"y6DraftEvidenceReviewed" | "y7GateEvidenceReviewed" | "y8ApprovalEvidenceReviewed" | "redactionEvidenceReviewed" | "retentionEvidenceReviewed" | "rollbackEvidenceReviewed" | "operatorReadinessEvidenceReviewed" | "securityPrivacyEvidenceReviewed" | "authorizationAbsenceReviewed", boolean>> & Partial<Record<"schemaAuthorizationRequested" | "migrationAuthorizationRequested" | "storageAuthorizationRequested" | "auditWriteAuthorizationRequested" | "executionAuthorizationRequested", boolean>>;

export type Y9FinalAuthorizationEvidenceStatus = "final_authorization_evidence_blocked" | "operator_review_required" | "final_authorization_evidence_clear";

const requiredReviewAreas: Array<[keyof Y9FinalAuthorizationEvidenceInput, string]> = [["y6DraftEvidenceReviewed", "Y6 draft evidence"], ["y7GateEvidenceReviewed", "Y7 gate evidence"], ["y8ApprovalEvidenceReviewed", "Y8 human approval package evidence"], ["redactionEvidenceReviewed", "redaction evidence"], ["retentionEvidenceReviewed", "retention evidence"], ["rollbackEvidenceReviewed", "rollback evidence"], ["operatorReadinessEvidenceReviewed", "operator readiness evidence"], ["securityPrivacyEvidenceReviewed", "security/privacy evidence"], ["authorizationAbsenceReviewed", "explicit authorization absence"]];
const blockedRequests: Array<[keyof Y9FinalAuthorizationEvidenceInput, string]> = [["schemaAuthorizationRequested", "schema authorization remains blocked"], ["migrationAuthorizationRequested", "migration authorization remains blocked"], ["storageAuthorizationRequested", "storage authorization remains blocked"], ["auditWriteAuthorizationRequested", "audit writing authorization remains blocked"], ["executionAuthorizationRequested", "execution authorization remains blocked"]];

export function createY9FinalAuthorizationEvidenceReview(input: Y9FinalAuthorizationEvidenceInput = {}) {
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: Y9FinalAuthorizationEvidenceStatus = blockedReasons.length > 0 ? "final_authorization_evidence_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "final_authorization_evidence_clear";
  return {
    phase: "Y9A" as const,
    status,
    flags: y9PlanningFlags,
    planningOnly: true,
    evidenceAreas: y9AuthorizationEvidenceAreas,
    schemaChangesAuthorized: false,
    migrationsAuthorized: false,
    storageAuthorized: false,
    auditWritingAllowed: false,
    persistenceAllowedNow: false,
    persistenceWritten: false,
    executionAllowed: false,
    missingReviewAreas,
    blockedReasons,
  };
}
