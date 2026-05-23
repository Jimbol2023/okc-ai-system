export const y6PlanningFlags = {
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

export type Y6DraftFieldFlag = "required" | "optional" | "risky" | "rejected";

export const y6AuditSchemaDraftFieldFlags = {
  eventType: "required",
  eventStatus: "required",
  sourceModule: "required",
  actorType: "required",
  actorIdPlaceholder: "optional",
  leadIdPlaceholder: "optional",
  relatedEntityType: "optional",
  relatedEntityIdPlaceholder: "optional",
  governanceFlags: "required",
  approvalState: "required",
  executionState: "required",
  providerState: "required",
  storageState: "required",
  riskLevel: "required",
  redactedSummary: "required",
  boundedNotes: "risky",
  retentionCategory: "required",
  immutableTraceRequired: "required",
  createdAtPlaceholder: "required",
} as const satisfies Record<string, Y6DraftFieldFlag>;

export type Y6AuditSchemaDraftFieldsInput = Partial<Record<"requiredFieldsReviewed" | "optionalFieldsReviewed" | "riskyFieldsReviewed" | "rejectedFieldsReviewed" | "boundedNotesRiskReviewed" | "placeholderFieldsReviewed" | "storageStateReviewed" | "immutableTraceReviewed", boolean>> & Partial<Record<"schemaChangeRequested" | "migrationRequested" | "storageRequested" | "auditWriteRequested" | "riskyFieldActivationRequested" | "rejectedFieldRequested", boolean>>;

export type Y6AuditSchemaDraftFieldsStatus = "audit_schema_draft_fields_blocked" | "operator_review_required" | "audit_schema_draft_fields_clear";

const requiredReviewAreas: Array<[keyof Y6AuditSchemaDraftFieldsInput, string]> = [["requiredFieldsReviewed", "required fields"], ["optionalFieldsReviewed", "optional fields"], ["riskyFieldsReviewed", "risky fields"], ["rejectedFieldsReviewed", "rejected fields"], ["boundedNotesRiskReviewed", "bounded notes risk"], ["placeholderFieldsReviewed", "placeholder fields"], ["storageStateReviewed", "storage state"], ["immutableTraceReviewed", "immutable trace requirement"]];
const blockedRequests: Array<[keyof Y6AuditSchemaDraftFieldsInput, string]> = [["schemaChangeRequested", "schema changes remain unauthorized"], ["migrationRequested", "migrations remain unauthorized"], ["storageRequested", "storage remains unauthorized"], ["auditWriteRequested", "audit writing remains unauthorized"], ["riskyFieldActivationRequested", "risky field activation remains blocked"], ["rejectedFieldRequested", "rejected fields remain blocked"]];

export function createY6AuditSchemaDraftFieldsReview(input: Y6AuditSchemaDraftFieldsInput = {}) {
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: Y6AuditSchemaDraftFieldsStatus = blockedReasons.length > 0 ? "audit_schema_draft_fields_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "audit_schema_draft_fields_clear";
  return {
    phase: "Y6A" as const,
    status,
    flags: y6PlanningFlags,
    planningOnly: true,
    schemaChangesAuthorized: false,
    migrationsAuthorized: false,
    storageAuthorized: false,
    auditWritingAllowed: false,
    persistenceAllowedNow: false,
    persistenceWritten: false,
    fieldFlags: y6AuditSchemaDraftFieldFlags,
    riskyFields: ["boundedNotes"],
    rejectedFields: [] as string[],
    riskyFieldsBlockedByDefault: true,
    rejectedFieldsBlocked: true,
    missingReviewAreas,
    blockedReasons,
  };
}
