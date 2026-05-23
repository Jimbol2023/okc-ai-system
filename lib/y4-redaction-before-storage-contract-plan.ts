import { y4PlanningFlags } from "./y4-future-audit-schema-concept-plan";

export const y4RedactionTargets = ["phones", "emails", "message bodies", "seller/buyer notes", "provider payloads", "tokens/secrets", "unnecessary addresses", "unnecessary financial details"] as const;

export const y4SafeStorageShapeRequirements = ["bounded text", "bounded arrays", "safe enums", "no raw payloads", "no unrestricted logs"] as const;

export type Y4RedactionBeforeStorageContractInput = Partial<Record<"phonesReviewed" | "emailsReviewed" | "messageBodiesReviewed" | "sellerBuyerNotesReviewed" | "providerPayloadsReviewed" | "tokensSecretsReviewed" | "addressesReviewed" | "financialDetailsReviewed" | "boundedTextReviewed" | "boundedArraysReviewed" | "safeEnumsReviewed" | "rawPayloadsBlockedReviewed" | "unrestrictedLogsBlockedReviewed", boolean>> & Partial<Record<"rawPayloadStorageRequested" | "unrestrictedLogRequested" | "unredactedContactStorageRequested" | "tokenStorageRequested" | "auditWriteRequested" | "storageRequested", boolean>>;

export type Y4RedactionBeforeStorageContractStatus = "redaction_before_storage_contract_blocked" | "operator_review_required" | "redaction_before_storage_contract_clear";

const requiredReviewAreas: Array<[keyof Y4RedactionBeforeStorageContractInput, string]> = [["phonesReviewed", "phones"], ["emailsReviewed", "emails"], ["messageBodiesReviewed", "message bodies"], ["sellerBuyerNotesReviewed", "seller/buyer notes"], ["providerPayloadsReviewed", "provider payloads"], ["tokensSecretsReviewed", "tokens/secrets"], ["addressesReviewed", "unnecessary addresses"], ["financialDetailsReviewed", "unnecessary financial details"], ["boundedTextReviewed", "bounded text"], ["boundedArraysReviewed", "bounded arrays"], ["safeEnumsReviewed", "safe enums"], ["rawPayloadsBlockedReviewed", "no raw payloads"], ["unrestrictedLogsBlockedReviewed", "no unrestricted logs"]];
const blockedRequests: Array<[keyof Y4RedactionBeforeStorageContractInput, string]> = [["rawPayloadStorageRequested", "raw payload storage remains blocked"], ["unrestrictedLogRequested", "unrestricted logs remain blocked"], ["unredactedContactStorageRequested", "unredacted contact storage remains blocked"], ["tokenStorageRequested", "token/secret storage remains blocked"], ["auditWriteRequested", "audit writing remains unauthorized"], ["storageRequested", "storage remains unauthorized"]];

export function createY4RedactionBeforeStorageContractPlan(input: Y4RedactionBeforeStorageContractInput = {}) {
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: Y4RedactionBeforeStorageContractStatus = blockedReasons.length > 0 ? "redaction_before_storage_contract_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "redaction_before_storage_contract_clear";
  return {
    phase: "Y4C" as const,
    status,
    flags: y4PlanningFlags,
    planningOnly: true,
    redactionTargets: y4RedactionTargets,
    safeStorageShapeRequirements: y4SafeStorageShapeRequirements,
    rawPayloadsAllowed: false,
    unrestrictedLogsAllowed: false,
    storageAuthorized: false,
    auditWritingAllowed: false,
    persistenceWritten: false,
    persistenceAllowedNow: false,
    missingReviewAreas,
    blockedReasons,
  };
}
