export const providerDraftActions = [
  "create_drive_doc_draft",
  "create_google_doc_draft",
  "create_gmail_draft",
  "create_calendar_event_draft",
] as const;

export type ProviderDraftAction = (typeof providerDraftActions)[number];
export type ProviderDraftConnector = "google_drive" | "google_docs" | "gmail" | "google_calendar";
export type ProviderDraftEnvironment = "development" | "preview" | "production";
export type ProviderDraftStatus = "preview_ready" | "blocked" | "invalid_action";
export type ProviderDraftPayloadValidationStatus = "valid" | "invalid" | "invalid_action";
export type ProviderDraftPreviewIntegrationStatus = "preview_ready" | "blocked" | "invalid_action";
export type ProviderCapabilityFamily = "document" | "email" | "calendar";
export type ProviderDraftSurface = "drive_draft" | "google_docs_draft" | "gmail_draft" | "calendar_event_draft";
export type ProviderRiskLevel = "low" | "medium" | "high";
export type ProviderBlockedOperation =
  | "provider_write"
  | "send"
  | "insert"
  | "update"
  | "patch"
  | "delete"
  | "publish"
  | "schedule"
  | "upload"
  | "share"
  | "oauth_scope_change"
  | "provider_endpoint_call";
export type ProviderFutureSprint = "10B_metadata_only" | "10C_payload_validation" | "10D_preview_integration";
export type ProviderReviewCategory =
  | "document_title_body_review"
  | "content_review"
  | "recipient_review"
  | "attendee_time_review"
  | "source_label_review";

export type ProviderDraftRegistryEntry = {
  capabilitySchemaVersion: "sprint-10b-v1";
  actionType: ProviderDraftAction;
  connector: ProviderDraftConnector;
  capabilityFamily: ProviderCapabilityFamily;
  draftSurface: ProviderDraftSurface;
  mode: "dry_run_no_live_write";
  providerOperation:
    | "google_drive_document_draft_preview"
    | "google_docs_document_draft_preview"
    | "gmail_message_draft_preview"
    | "google_calendar_event_draft_preview";
  allowedEnvironment: "preview";
  requiredConfigKeys: string[];
  requiredScopes: string[];
  allowedPreviewFields: string[];
  forbiddenOperations: ProviderBlockedOperation[];
  requiredApprovalGates: string[];
  humanReviewCategories: ProviderReviewCategory[];
  redactionPolicy: "provider_draft_preview_redaction_v1";
  auditReadinessLabel: string;
  memoryReadinessLabel: string;
  providerRiskLevel: ProviderRiskLevel;
  ownerDepartment: string;
  aiEmployeeOwner: string;
  fallbackInstruction: string;
  futureSprintMapping: ProviderFutureSprint[];
  productionBlocked: true;
  exactActionOnly: true;
  approvalRequired: true;
  ceoApprovalRequired: true;
  killSwitchRequired: true;
  liveWriteEnabled: false;
};

export type ProviderDraftCapabilitySummary = Pick<
  ProviderDraftRegistryEntry,
  | "capabilitySchemaVersion"
  | "actionType"
  | "connector"
  | "capabilityFamily"
  | "draftSurface"
  | "providerOperation"
  | "allowedPreviewFields"
  | "forbiddenOperations"
  | "requiredApprovalGates"
  | "humanReviewCategories"
  | "redactionPolicy"
  | "auditReadinessLabel"
  | "memoryReadinessLabel"
  | "providerRiskLevel"
  | "ownerDepartment"
  | "aiEmployeeOwner"
  | "fallbackInstruction"
  | "futureSprintMapping"
  | "productionBlocked"
  | "liveWriteEnabled"
> & {
  providerCalled: false;
  liveExecutionAllowed: false;
};

export type ProviderDraftPayloadInput = {
  actionType?: unknown;
  title?: unknown;
  body?: unknown;
  targetFolderId?: unknown;
  targetConfigured?: unknown;
  recipientPreview?: unknown;
  attendeePreview?: unknown;
  startTimePreview?: unknown;
  sourceLabel?: unknown;
};

export type ProviderDraftNormalizedPayload = {
  payloadSchemaVersion: "sprint-10c-v1";
  actionType: ProviderDraftAction;
  connector: ProviderDraftConnector;
  title: string;
  body: string;
  targetFolderConfigured: boolean;
  recipientPreview: string;
  attendeePreview: string;
  startTimePreview: string;
  sourceLabel: string;
  providerCalled: false;
  liveExecutionAllowed: false;
};

export type ProviderDraftPayloadValidation = {
  payloadSchemaVersion: "sprint-10c-v1";
  ok: boolean;
  status: ProviderDraftPayloadValidationStatus;
  actionType: ProviderDraftAction | null;
  connector: ProviderDraftConnector | null;
  normalizedPayload: ProviderDraftNormalizedPayload | null;
  requiredFields: string[];
  normalizedFields: string[];
  redactedFields: string[];
  blockedReasons: string[];
  warnings: string[];
  providerCalled: false;
  liveExecutionAllowed: false;
};

export type ProviderDraftPreviewInput = {
  actionType: ProviderDraftAction;
  title: string;
  body: string;
  targetFolderId?: string;
  recipientPreview?: string;
  attendeePreview?: string;
  startTimePreview?: string;
  sourceLabel: string;
  requestedEnvironment?: ProviderDraftEnvironment;
  ceoApprovalConfirmed?: boolean;
  killSwitchConfirmed?: boolean;
  readinessStatus?: "ready" | "blocked" | "missing_config" | "needs_approval";
  targetConfigured?: boolean;
};

export type ProviderDraftGovernedPreview = {
  previewIntegrationVersion: "sprint-10d-v1";
  ok: boolean;
  status: ProviderDraftPreviewIntegrationStatus;
  actionType: ProviderDraftAction | null;
  connector: ProviderDraftConnector | null;
  validation: ProviderDraftPayloadValidation;
  preview: ProviderDraftPreview | null;
  integration: {
    source: "normalized_provider_draft_payload";
    exactActionOnly: true;
    previewOnly: true;
    autonomousExecution: false;
    providerCalled: false;
    liveExecutionAllowed: false;
    wouldCallProvider: false;
    noProviderRouteCreated: true;
    noOAuthChange: true;
    noDeployment: true;
    productionBlocked: true;
  };
  nextSafeAction: string;
};

export type ProviderDraftPreview = {
  ok: boolean;
  status: ProviderDraftStatus;
  actionType: ProviderDraftAction;
  connector: ProviderDraftConnector;
  mode: "dry_run_no_live_write";
  registryEntry: ProviderDraftRegistryEntry;
  requestPreview: {
    method: "POST";
    providerOperation: ProviderDraftRegistryEntry["providerOperation"];
    targetFolder: "[redacted:google_drive_test_folder_id]" | "[missing]" | "[not_applicable]";
    title: string;
    bodyPreview: string;
    recipientPreview: string;
    attendeePreview: string;
    startTimePreview: string;
    sourceLabel: string;
  };
  blockedReasons: string[];
  approvalRequired: true;
  auditPreflight: {
    required: true;
    ready: boolean;
    auditAction: `provider_execution_preview.${ProviderDraftAction}`;
  };
  memoryPreflight: {
    required: true;
    ready: boolean;
    memoryEvent: "provider_execution_preview_preflight";
  };
  killSwitch: {
    required: true;
    confirmed: boolean;
  };
  safety: {
    dryRunOnly: true;
    providerCalled: false;
    liveExecutionAllowed: false;
    wouldCallProvider: false;
    sent: false;
    published: false;
    scheduled: false;
    productionBlocked: true;
    rawPayloadRedacted: true;
  };
  nextSafeAction: string;
};

const googleOauthKeys = ["GOOGLE_OAUTH_CLIENT_ID", "GOOGLE_OAUTH_CLIENT_SECRET", "GOOGLE_OAUTH_REFRESH_TOKEN"];
const baseForbiddenOperations: ProviderBlockedOperation[] = [
  "provider_write",
  "send",
  "insert",
  "update",
  "patch",
  "delete",
  "publish",
  "schedule",
  "upload",
  "share",
  "oauth_scope_change",
  "provider_endpoint_call",
];
const baseFutureSprintMapping: ProviderFutureSprint[] = ["10B_metadata_only", "10C_payload_validation", "10D_preview_integration"];
const baseApprovalGates = ["ceo_approval", "kill_switch", "audit_preflight", "memory_readiness", "production_hard_block"];

const providerDraftRegistry: ProviderDraftRegistryEntry[] = [
  {
    capabilitySchemaVersion: "sprint-10b-v1",
    actionType: "create_drive_doc_draft",
    connector: "google_drive",
    capabilityFamily: "document",
    draftSurface: "drive_draft",
    mode: "dry_run_no_live_write",
    providerOperation: "google_drive_document_draft_preview",
    allowedEnvironment: "preview",
    requiredConfigKeys: ["GOOGLE_DRIVE_DRAFT_PILOT_ENABLED", ...googleOauthKeys, "GOOGLE_DRIVE_TEST_FOLDER_ID"],
    requiredScopes: ["google_drive_metadata_readonly", "future_google_drive_file"],
    allowedPreviewFields: ["title", "bodyPreview", "targetFolder", "sourceLabel"],
    forbiddenOperations: baseForbiddenOperations,
    requiredApprovalGates: baseApprovalGates,
    humanReviewCategories: ["document_title_body_review", "content_review", "source_label_review"],
    redactionPolicy: "provider_draft_preview_redaction_v1",
    auditReadinessLabel: "drive_draft_audit_preflight_required",
    memoryReadinessLabel: "drive_draft_memory_readiness_required",
    providerRiskLevel: "medium",
    ownerDepartment: "Executive Office",
    aiEmployeeOwner: "AI COO",
    fallbackInstruction: "Prepare the document text for manual CEO review without creating or uploading a Drive file.",
    futureSprintMapping: baseFutureSprintMapping,
    productionBlocked: true,
    exactActionOnly: true,
    approvalRequired: true,
    ceoApprovalRequired: true,
    killSwitchRequired: true,
    liveWriteEnabled: false,
  },
  {
    capabilitySchemaVersion: "sprint-10b-v1",
    actionType: "create_google_doc_draft",
    connector: "google_docs",
    capabilityFamily: "document",
    draftSurface: "google_docs_draft",
    mode: "dry_run_no_live_write",
    providerOperation: "google_docs_document_draft_preview",
    allowedEnvironment: "preview",
    requiredConfigKeys: googleOauthKeys,
    requiredScopes: ["future_google_docs_documents"],
    allowedPreviewFields: ["title", "bodyPreview", "sourceLabel"],
    forbiddenOperations: baseForbiddenOperations,
    requiredApprovalGates: baseApprovalGates,
    humanReviewCategories: ["document_title_body_review", "content_review", "source_label_review"],
    redactionPolicy: "provider_draft_preview_redaction_v1",
    auditReadinessLabel: "google_docs_draft_audit_preflight_required",
    memoryReadinessLabel: "google_docs_draft_memory_readiness_required",
    providerRiskLevel: "medium",
    ownerDepartment: "Executive Office",
    aiEmployeeOwner: "AI COO",
    fallbackInstruction: "Prepare the Google Docs content as an internal draft for manual document creation.",
    futureSprintMapping: baseFutureSprintMapping,
    productionBlocked: true,
    exactActionOnly: true,
    approvalRequired: true,
    ceoApprovalRequired: true,
    killSwitchRequired: true,
    liveWriteEnabled: false,
  },
  {
    capabilitySchemaVersion: "sprint-10b-v1",
    actionType: "create_gmail_draft",
    connector: "gmail",
    capabilityFamily: "email",
    draftSurface: "gmail_draft",
    mode: "dry_run_no_live_write",
    providerOperation: "gmail_message_draft_preview",
    allowedEnvironment: "preview",
    requiredConfigKeys: googleOauthKeys,
    requiredScopes: ["gmail_readonly", "future_gmail_compose"],
    allowedPreviewFields: ["title", "bodyPreview", "recipientPreview", "sourceLabel"],
    forbiddenOperations: baseForbiddenOperations,
    requiredApprovalGates: [...baseApprovalGates, "recipient_review"],
    humanReviewCategories: ["recipient_review", "content_review", "source_label_review"],
    redactionPolicy: "provider_draft_preview_redaction_v1",
    auditReadinessLabel: "gmail_draft_audit_preflight_required",
    memoryReadinessLabel: "gmail_draft_memory_readiness_required",
    providerRiskLevel: "high",
    ownerDepartment: "Revenue Operations",
    aiEmployeeOwner: "Executive Assistant AI",
    fallbackInstruction: "Prepare email copy for manual review; do not create, save, or send a Gmail draft.",
    futureSprintMapping: baseFutureSprintMapping,
    productionBlocked: true,
    exactActionOnly: true,
    approvalRequired: true,
    ceoApprovalRequired: true,
    killSwitchRequired: true,
    liveWriteEnabled: false,
  },
  {
    capabilitySchemaVersion: "sprint-10b-v1",
    actionType: "create_calendar_event_draft",
    connector: "google_calendar",
    capabilityFamily: "calendar",
    draftSurface: "calendar_event_draft",
    mode: "dry_run_no_live_write",
    providerOperation: "google_calendar_event_draft_preview",
    allowedEnvironment: "preview",
    requiredConfigKeys: googleOauthKeys,
    requiredScopes: ["calendar_events_readonly", "future_calendar_events"],
    allowedPreviewFields: ["title", "bodyPreview", "attendeePreview", "startTimePreview", "sourceLabel"],
    forbiddenOperations: baseForbiddenOperations,
    requiredApprovalGates: [...baseApprovalGates, "attendee_time_review"],
    humanReviewCategories: ["attendee_time_review", "content_review", "source_label_review"],
    redactionPolicy: "provider_draft_preview_redaction_v1",
    auditReadinessLabel: "calendar_event_draft_audit_preflight_required",
    memoryReadinessLabel: "calendar_event_draft_memory_readiness_required",
    providerRiskLevel: "high",
    ownerDepartment: "Operations",
    aiEmployeeOwner: "Executive Assistant AI",
    fallbackInstruction: "Prepare appointment details for manual calendar creation; do not insert or schedule an event.",
    futureSprintMapping: baseFutureSprintMapping,
    productionBlocked: true,
    exactActionOnly: true,
    approvalRequired: true,
    ceoApprovalRequired: true,
    killSwitchRequired: true,
    liveWriteEnabled: false,
  },
];

export function listProviderDraftActionRegistry(): ProviderDraftRegistryEntry[] {
  return providerDraftRegistry.map((entry) => ({
    ...entry,
    requiredConfigKeys: [...entry.requiredConfigKeys],
    requiredScopes: [...entry.requiredScopes],
    allowedPreviewFields: [...entry.allowedPreviewFields],
    forbiddenOperations: [...entry.forbiddenOperations],
    requiredApprovalGates: [...entry.requiredApprovalGates],
    humanReviewCategories: [...entry.humanReviewCategories],
    futureSprintMapping: [...entry.futureSprintMapping],
  }));
}

export function listProviderDraftCapabilities(): ProviderDraftCapabilitySummary[] {
  return listProviderDraftActionRegistry().map((entry) => ({
    capabilitySchemaVersion: entry.capabilitySchemaVersion,
    actionType: entry.actionType,
    connector: entry.connector,
    capabilityFamily: entry.capabilityFamily,
    draftSurface: entry.draftSurface,
    providerOperation: entry.providerOperation,
    allowedPreviewFields: entry.allowedPreviewFields,
    forbiddenOperations: entry.forbiddenOperations,
    requiredApprovalGates: entry.requiredApprovalGates,
    humanReviewCategories: entry.humanReviewCategories,
    redactionPolicy: entry.redactionPolicy,
    auditReadinessLabel: entry.auditReadinessLabel,
    memoryReadinessLabel: entry.memoryReadinessLabel,
    providerRiskLevel: entry.providerRiskLevel,
    ownerDepartment: entry.ownerDepartment,
    aiEmployeeOwner: entry.aiEmployeeOwner,
    fallbackInstruction: entry.fallbackInstruction,
    futureSprintMapping: entry.futureSprintMapping,
    productionBlocked: entry.productionBlocked,
    liveWriteEnabled: entry.liveWriteEnabled,
    providerCalled: false,
    liveExecutionAllowed: false,
  }));
}

export function isProviderDraftAction(value: unknown): value is ProviderDraftAction {
  return typeof value === "string" && providerDraftActions.includes(value as ProviderDraftAction);
}

function cleanPreviewText(value: string | undefined, fallback: string, maxLength: number) {
  const trimmed = (value ?? "").trim().replace(/\s+/g, " ");

  return (trimmed || fallback).slice(0, maxLength);
}

function unknownToString(value: unknown) {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);

  return "";
}

function normalizePayloadText(value: unknown, fallback: string, maxLength: number) {
  return cleanPreviewText(unknownToString(value), fallback, maxLength);
}

function containsSecretLikeValue(value: string) {
  return /ya29\.|GOCSPX-|refresh-token|client-secret|BEGIN PRIVATE KEY|authorization|bearer\s+|https:\/\/www\.googleapis\.com|gmail\.googleapis\.com|drive\.googleapis\.com|calendar\.events\.insert|drive\.files\.create|drafts\.send/iu.test(value);
}

function redactedPreview(value: string, fallback = "[not_provided]") {
  if (!value.trim()) return fallback;

  return containsSecretLikeValue(value) ? "[redacted]" : value;
}

function createProviderPreviewNextSafeAction(preview: Pick<ProviderDraftPreview, "status" | "blockedReasons">) {
  if (preview.status === "preview_ready") return "Review the redacted provider draft preview; a separate explicit approval is required before any future provider pilot.";

  return preview.blockedReasons[0] ?? "Resolve provider adapter readiness blockers before preparing a Preview-only pilot.";
}

function targetFolderPreview(entry: ProviderDraftRegistryEntry, input: ProviderDraftPreviewInput) {
  if (entry.connector !== "google_drive") return "[not_applicable]" as const;

  return input.targetConfigured || Boolean(input.targetFolderId?.trim()) ? "[redacted:google_drive_test_folder_id]" : "[missing]";
}

function requiredFieldsForAction(entry: ProviderDraftRegistryEntry) {
  const fields = ["actionType", "title", "body", "sourceLabel"];
  if (entry.actionType === "create_gmail_draft") fields.push("recipientPreview");
  if (entry.actionType === "create_calendar_event_draft") fields.push("attendeePreview", "startTimePreview");

  return fields;
}

export function validateAndNormalizeProviderDraftPayload(input: ProviderDraftPayloadInput): ProviderDraftPayloadValidation {
  const actionType = input.actionType;
  const registryEntry = providerDraftRegistry.find((entry) => entry.actionType === actionType);
  if (!registryEntry || !isProviderDraftAction(actionType)) {
    return {
      payloadSchemaVersion: "sprint-10c-v1",
      ok: false,
      status: "invalid_action",
      actionType: null,
      connector: null,
      normalizedPayload: null,
      requiredFields: ["actionType"],
      normalizedFields: [],
      redactedFields: [],
      blockedReasons: ["Unsupported provider draft adapter action."],
      warnings: ["Only Sprint 10 governed draft actions may be normalized."],
      providerCalled: false,
      liveExecutionAllowed: false,
    };
  }

  const requiredFields = requiredFieldsForAction(registryEntry);
  const title = normalizePayloadText(input.title, "", 180);
  const body = normalizePayloadText(input.body, "", 4_000);
  const recipientPreview = normalizePayloadText(input.recipientPreview, "", 160);
  const attendeePreview = normalizePayloadText(input.attendeePreview, "", 160);
  const startTimePreview = normalizePayloadText(input.startTimePreview, "", 80);
  const sourceLabel = normalizePayloadText(input.sourceLabel, "", 180);
  const rawValues = {
    title,
    body,
    targetFolderId: unknownToString(input.targetFolderId),
    recipientPreview,
    attendeePreview,
    startTimePreview,
    sourceLabel,
  };
  const redactedFields = Object.entries(rawValues)
    .filter(([, value]) => containsSecretLikeValue(value))
    .map(([field]) => field);
  const missingFields = [
    ...(!title ? ["title"] : []),
    ...(!body ? ["body"] : []),
    ...(!sourceLabel ? ["sourceLabel"] : []),
    ...(registryEntry.actionType === "create_gmail_draft" && !recipientPreview ? ["recipientPreview"] : []),
    ...(registryEntry.actionType === "create_calendar_event_draft" && !attendeePreview ? ["attendeePreview"] : []),
    ...(registryEntry.actionType === "create_calendar_event_draft" && !startTimePreview ? ["startTimePreview"] : []),
  ];
  const blockedReasons = [
    ...missingFields.map((field) => `Required draft payload field is missing: ${field}.`),
    ...redactedFields.map((field) => `Secret-like value or provider endpoint detected in ${field}.`),
  ];
  const targetFolderConfigured = input.targetConfigured === true || Boolean(unknownToString(input.targetFolderId).trim());
  const normalizedPayload: ProviderDraftNormalizedPayload = {
    payloadSchemaVersion: "sprint-10c-v1",
    actionType: registryEntry.actionType,
    connector: registryEntry.connector,
    title: redactedFields.includes("title") ? "[redacted]" : title,
    body: redactedFields.includes("body") ? "[redacted]" : body,
    targetFolderConfigured,
    recipientPreview: redactedFields.includes("recipientPreview") ? "[redacted]" : recipientPreview || "[not_applicable]",
    attendeePreview: redactedFields.includes("attendeePreview") ? "[redacted]" : attendeePreview || "[not_applicable]",
    startTimePreview: redactedFields.includes("startTimePreview") ? "[redacted]" : startTimePreview || "[not_applicable]",
    sourceLabel: redactedFields.includes("sourceLabel") ? "provider-draft-preview" : sourceLabel,
    providerCalled: false,
    liveExecutionAllowed: false,
  };
  const validation: ProviderDraftPayloadValidation = {
    payloadSchemaVersion: "sprint-10c-v1",
    ok: blockedReasons.length === 0,
    status: blockedReasons.length === 0 ? "valid" : "invalid",
    actionType: registryEntry.actionType,
    connector: registryEntry.connector,
    normalizedPayload,
    requiredFields,
    normalizedFields: registryEntry.allowedPreviewFields.filter((field) => field !== "targetFolder").concat("body"),
    redactedFields,
    blockedReasons,
    warnings: targetFolderConfigured && registryEntry.connector === "google_drive"
      ? ["Google Drive target folder evidence is normalized to a configured boolean and never exposed."]
      : [],
    providerCalled: false,
    liveExecutionAllowed: false,
  };
  assertProviderDraftPayloadValidationSafety(validation);

  return validation;
}

export function createGovernedProviderDraftPreview(
  input: ProviderDraftPayloadInput & Pick<
    ProviderDraftPreviewInput,
    "requestedEnvironment" | "ceoApprovalConfirmed" | "killSwitchConfirmed" | "readinessStatus"
  >,
): ProviderDraftGovernedPreview {
  const validation = validateAndNormalizeProviderDraftPayload(input);
  const normalized = validation.normalizedPayload;
  const preview = validation.ok && normalized
    ? createProviderDraftPreview({
      actionType: normalized.actionType,
      title: normalized.title,
      body: normalized.body,
      targetConfigured: normalized.targetFolderConfigured,
      recipientPreview: normalized.recipientPreview,
      attendeePreview: normalized.attendeePreview,
      startTimePreview: normalized.startTimePreview,
      sourceLabel: normalized.sourceLabel,
      requestedEnvironment: input.requestedEnvironment,
      ceoApprovalConfirmed: input.ceoApprovalConfirmed,
      killSwitchConfirmed: input.killSwitchConfirmed,
      readinessStatus: input.readinessStatus,
    })
    : null;
  const status: ProviderDraftPreviewIntegrationStatus = preview?.status ?? (validation.status === "invalid_action" ? "invalid_action" : "blocked");
  const governed: ProviderDraftGovernedPreview = {
    previewIntegrationVersion: "sprint-10d-v1",
    ok: Boolean(validation.ok && preview?.ok),
    status,
    actionType: validation.actionType,
    connector: validation.connector,
    validation,
    preview,
    integration: {
      source: "normalized_provider_draft_payload",
      exactActionOnly: true,
      previewOnly: true,
      autonomousExecution: false,
      providerCalled: false,
      liveExecutionAllowed: false,
      wouldCallProvider: false,
      noProviderRouteCreated: true,
      noOAuthChange: true,
      noDeployment: true,
      productionBlocked: true,
    },
    nextSafeAction: preview?.nextSafeAction ?? validation.blockedReasons[0] ?? "Resolve payload validation blockers before preparing a governed preview.",
  };
  assertGovernedProviderDraftPreviewSafety(governed);

  return governed;
}

export function createProviderDraftPreview(input: ProviderDraftPreviewInput): ProviderDraftPreview {
  const registryEntry = providerDraftRegistry.find((entry) => entry.actionType === input.actionType);
  if (!registryEntry || !isProviderDraftAction(input.actionType)) {
    throw new Error("Unsupported provider draft adapter action.");
  }

  const requestedEnvironment = input.requestedEnvironment ?? "preview";
  const rawPreviewValues = `${input.title} ${input.body} ${input.targetFolderId ?? ""} ${input.recipientPreview ?? ""} ${input.attendeePreview ?? ""} ${input.startTimePreview ?? ""}`;
  const blockedReasons = [
    ...(input.readinessStatus && input.readinessStatus !== "ready" ? [`Provider draft readiness is ${input.readinessStatus}.`] : []),
    ...(registryEntry.connector === "google_drive" && !input.targetConfigured && !input.targetFolderId?.trim() ? ["Google Drive test folder is not configured."] : []),
    ...(requestedEnvironment !== "preview" ? ["Provider draft preview must target Preview only."] : []),
    ...(requestedEnvironment === "production" ? ["Production provider execution is blocked."] : []),
    ...(!input.ceoApprovalConfirmed ? ["CEO approval is not confirmed."] : []),
    ...(!input.killSwitchConfirmed ? ["Kill switch is not confirmed."] : []),
    ...(containsSecretLikeValue(rawPreviewValues) ? ["Secret-like values or provider endpoints were detected and redacted from the preview."] : []),
  ];
  const status: ProviderDraftStatus = blockedReasons.length > 0 ? "blocked" : "preview_ready";
  const title = cleanPreviewText(input.title, "Untitled provider draft preview", 180);
  const bodyPreview = cleanPreviewText(input.body, "Draft body preview unavailable.", 500);
  const preview: ProviderDraftPreview = {
    ok: status === "preview_ready",
    status,
    actionType: input.actionType,
    connector: registryEntry.connector,
    mode: "dry_run_no_live_write",
    registryEntry,
    requestPreview: {
      method: "POST",
      providerOperation: registryEntry.providerOperation,
      targetFolder: targetFolderPreview(registryEntry, input),
      title: redactedPreview(title),
      bodyPreview: redactedPreview(bodyPreview),
      recipientPreview: redactedPreview(cleanPreviewText(input.recipientPreview, "[not_applicable]", 160), "[not_applicable]"),
      attendeePreview: redactedPreview(cleanPreviewText(input.attendeePreview, "[not_applicable]", 160), "[not_applicable]"),
      startTimePreview: redactedPreview(cleanPreviewText(input.startTimePreview, "[not_applicable]", 80), "[not_applicable]"),
      sourceLabel: cleanPreviewText(input.sourceLabel, "provider-draft-preview", 180),
    },
    blockedReasons,
    approvalRequired: true,
    auditPreflight: {
      required: true,
      ready: status === "preview_ready",
      auditAction: `provider_execution_preview.${input.actionType}`,
    },
    memoryPreflight: {
      required: true,
      ready: status === "preview_ready",
      memoryEvent: "provider_execution_preview_preflight",
    },
    killSwitch: {
      required: true,
      confirmed: Boolean(input.killSwitchConfirmed),
    },
    safety: {
      dryRunOnly: true,
      providerCalled: false,
      liveExecutionAllowed: false,
      wouldCallProvider: false,
      sent: false,
      published: false,
      scheduled: false,
      productionBlocked: true,
      rawPayloadRedacted: true,
    },
    nextSafeAction: "",
  };
  preview.nextSafeAction = createProviderPreviewNextSafeAction(preview);
  assertProviderDraftPreviewSafety(preview);

  return preview;
}

export function assertProviderDraftPreviewSafety(preview: ProviderDraftPreview): void {
  const serialized = JSON.stringify(preview);
  if (!isProviderDraftAction(preview.actionType)) throw new Error("Provider draft preview must use an approved draft action.");
  if (preview.mode !== "dry_run_no_live_write") throw new Error("Provider draft preview must remain dry-run only.");
  if (preview.safety.providerCalled || preview.safety.liveExecutionAllowed || preview.safety.wouldCallProvider) {
    throw new Error("Provider draft preview must not call or prepare live provider execution.");
  }
  if (preview.safety.sent || preview.safety.published || preview.safety.scheduled) {
    throw new Error("Provider draft preview must not send, publish, or schedule.");
  }
  if (!preview.registryEntry.productionBlocked || preview.registryEntry.liveWriteEnabled) {
    throw new Error("Provider draft registry must keep Production and live writes blocked.");
  }
  if (/https:\/\/www\.googleapis\.com|gmail\.googleapis\.com|drive\.googleapis\.com|calendar\.events\.insert|drive\.files\.create|drafts\.send|send_email|create_drive_doc"/iu.test(serialized)) {
    throw new Error("Provider draft preview must not expose live provider endpoints or blocked execution actions.");
  }
  if (/ya29\.|GOCSPX-|refresh-token|client-secret|BEGIN PRIVATE KEY|authorization|bearer\s+/iu.test(serialized)) {
    throw new Error("Provider draft preview exposed secret-like values.");
  }
}

export function assertProviderDraftPayloadValidationSafety(validation: ProviderDraftPayloadValidation): void {
  const serialized = JSON.stringify(validation);
  if (validation.providerCalled || validation.liveExecutionAllowed) {
    throw new Error("Provider draft payload validation must not call providers or allow live execution.");
  }
  if (validation.normalizedPayload?.providerCalled || validation.normalizedPayload?.liveExecutionAllowed) {
    throw new Error("Provider draft normalized payload must preserve no-execution safety flags.");
  }
  if (validation.actionType && !isProviderDraftAction(validation.actionType)) {
    throw new Error("Provider draft payload validation must use an approved draft action.");
  }
  if (/https:\/\/www\.googleapis\.com|gmail\.googleapis\.com|drive\.googleapis\.com|calendar\.events\.insert|drive\.files\.create|drafts\.send|send_email|create_drive_doc"/iu.test(serialized)) {
    throw new Error("Provider draft payload validation must not expose live provider endpoints or blocked execution actions.");
  }
  if (/ya29\.|GOCSPX-|refresh-token|client-secret|BEGIN PRIVATE KEY|authorization|bearer\s+/iu.test(serialized)) {
    throw new Error("Provider draft payload validation exposed secret-like values.");
  }
}

export function assertGovernedProviderDraftPreviewSafety(governed: ProviderDraftGovernedPreview): void {
  const serialized = JSON.stringify(governed);
  if (governed.integration.providerCalled || governed.integration.liveExecutionAllowed || governed.integration.wouldCallProvider) {
    throw new Error("Governed provider draft preview integration must not call providers or allow live execution.");
  }
  if (!governed.integration.previewOnly || governed.integration.autonomousExecution) {
    throw new Error("Governed provider draft preview integration must remain Preview-only and non-autonomous.");
  }
  if (!governed.integration.noProviderRouteCreated || !governed.integration.noOAuthChange || !governed.integration.noDeployment) {
    throw new Error("Governed provider draft preview integration cannot create routes, change OAuth, or deploy.");
  }
  if (governed.preview) assertProviderDraftPreviewSafety(governed.preview);
  assertProviderDraftPayloadValidationSafety(governed.validation);
  if (/https:\/\/www\.googleapis\.com|gmail\.googleapis\.com|drive\.googleapis\.com|calendar\.events\.insert|drive\.files\.create|drafts\.send|send_email|create_drive_doc"/iu.test(serialized)) {
    throw new Error("Governed provider draft preview integration must not expose live provider endpoints or blocked actions.");
  }
}
