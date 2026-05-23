import { y7PlanningFlags } from "./y7-schema-implementation-gate-readiness";

export const y7SecurityPrivacyComplianceGateAreas = ["privacy signoff", "security signoff", "retention signoff", "legal/compliance placeholder", "redaction evidence", "sensitive data exclusion", "export/deletion future review", "operator access boundary"] as const;

export type Y7SecurityPrivacyComplianceGateInput = Partial<Record<"privacySignoffReviewed" | "securitySignoffReviewed" | "retentionSignoffReviewed" | "legalComplianceReviewed" | "redactionEvidenceReviewed" | "sensitiveDataExclusionReviewed" | "exportDeletionReviewed" | "operatorAccessReviewed", boolean>> & Partial<Record<"sensitiveDataStorageRequested" | "credentialStorageRequested" | "rawPayloadStorageRequested" | "unreviewedAccessRequested" | "complianceBypassRequested" | "storageRequested", boolean>>;

export type Y7SecurityPrivacyComplianceGateStatus = "security_privacy_compliance_gate_blocked" | "operator_review_required" | "security_privacy_compliance_gate_clear";

const requiredReviewAreas: Array<[keyof Y7SecurityPrivacyComplianceGateInput, string]> = [["privacySignoffReviewed", "privacy signoff"], ["securitySignoffReviewed", "security signoff"], ["retentionSignoffReviewed", "retention signoff"], ["legalComplianceReviewed", "legal/compliance placeholder"], ["redactionEvidenceReviewed", "redaction evidence"], ["sensitiveDataExclusionReviewed", "sensitive data exclusion"], ["exportDeletionReviewed", "export/deletion future review"], ["operatorAccessReviewed", "operator access boundary"]];
const blockedRequests: Array<[keyof Y7SecurityPrivacyComplianceGateInput, string]> = [["sensitiveDataStorageRequested", "sensitive data storage remains blocked"], ["credentialStorageRequested", "credential storage remains blocked"], ["rawPayloadStorageRequested", "raw payload storage remains blocked"], ["unreviewedAccessRequested", "unreviewed access remains blocked"], ["complianceBypassRequested", "compliance bypass remains blocked"], ["storageRequested", "storage remains unauthorized"]];

export function createY7SecurityPrivacyComplianceGateReview(input: Y7SecurityPrivacyComplianceGateInput = {}) {
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: Y7SecurityPrivacyComplianceGateStatus = blockedReasons.length > 0 ? "security_privacy_compliance_gate_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "security_privacy_compliance_gate_clear";
  return {
    phase: "Y7D" as const,
    status,
    flags: y7PlanningFlags,
    planningOnly: true,
    securityPrivacyGatePassed: false,
    storageAuthorized: false,
    auditWritingAllowed: false,
    sensitiveDataStorageAllowed: false,
    credentialStorageAllowed: false,
    rawPayloadStorageAllowed: false,
    reviewAreas: y7SecurityPrivacyComplianceGateAreas,
    missingReviewAreas,
    blockedReasons,
  };
}
