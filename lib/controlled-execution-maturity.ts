import type { ApprovedExecutionActionType, ApprovedExecutionRunResult } from "@/lib/approved-execution-layer";
import { classifySecretConfig, type SecretConfigClassification } from "@/lib/connector-credential-scope-verification";
import { prisma } from "@/lib/prisma";
import {
  assertProviderDraftPreviewSafety,
  createGovernedProviderDraftPreview,
  createProviderDraftPreview,
  isProviderDraftAction,
  listProviderDraftActionRegistry,
  providerDraftActions,
  type ProviderDraftGovernedPreview,
  type ProviderDraftAction,
  type ProviderDraftPreview,
  type ProviderDraftPreviewInput,
  type ProviderDraftRegistryEntry,
  type ProviderDraftStatus,
} from "@/lib/provider-draft-adapters";

export const controlledInternalExecutionActions = ["create_crm_task", "create_crm_note"] as const;
export type ControlledInternalExecutionAction = (typeof controlledInternalExecutionActions)[number];

export const controlledDraftExternalActions = [
  "draft_email",
  "draft_calendar_event",
  "draft_drive_doc",
  "draft_social_post",
  "draft_gbp_response",
] as const;
export type ControlledDraftExternalAction = (typeof controlledDraftExternalActions)[number];

export const executionOutcomeStates = [
  "internal_task_created",
  "internal_note_created",
  "blocked_by_policy",
  "audit_failed",
  "memory_failed",
  "duplicate_blocked",
  "invalid_action",
  "draft_prepared",
  "external_execution_blocked",
] as const;
export type ExecutionOutcomeState = (typeof executionOutcomeStates)[number];

export type ExecutionTraceContract = {
  traceId: string;
  signalId: string | null;
  workOrderId: string | null;
  approvalId: string | null;
  actionType: ControlledInternalExecutionAction | ControlledDraftExternalAction | ApprovedExecutionActionType;
  outcome: ExecutionOutcomeState;
  taskId: string | null;
  noteId: string | null;
  aiEmployee: string | null;
  department: string | null;
  kpiAffected: string[];
  sourceLabel: string;
  providerCalled: false;
  sent: false;
  published: false;
  scheduled: false;
  liveExecutionAllowed: false;
};

export type ControlledInternalExecutionOutcome = {
  ok: boolean;
  actionType: ControlledInternalExecutionAction;
  state: ExecutionOutcomeState;
  message: string;
  trace: ExecutionTraceContract;
  memoryKpiReadiness: {
    readyForMemoryWrite: boolean;
    readyForKpiUpdate: boolean;
    persistenceAllowed: false;
    recommendedMemoryEvent: string;
    recommendedKpiUpdate: string;
  };
  providerCalled: false;
  liveExecutionAllowed: false;
};

export type DraftSafetyReviewContract = {
  actionType: ControlledDraftExternalAction;
  title: string;
  draftBody: string;
  claimSourceCheck: "required" | "passed";
  complianceCheck: "required" | "passed";
  ceoReviewRequired: true;
  executable: false;
  providerCalled: false;
  liveExecutionAllowed: false;
  forbiddenActions: string[];
};

export type ExternalExecutionReadinessGateInput = {
  connectorVerified: boolean;
  scopesVerified: boolean;
  credentialEvidencePresent: boolean;
  exactActionAllowlisted: boolean;
  rollbackPlanPresent: boolean;
  auditPathConfirmed: boolean;
  memoryPathConfirmed: boolean;
  killSwitchConfirmed: boolean;
  ceoApprovalConfirmed: boolean;
  previewTested: boolean;
  risk: "low" | "medium" | "high" | "prohibited";
  candidateAction: "create_internal_crm_note" | "create_calendar_draft" | ProviderDraftAction | "gmail_draft_creation" | "send_email" | "send_sms" | "publish_post" | "reply_to_review" | "run_ads" | "autonomous_outreach";
};

export type ExternalExecutionReadinessGate = {
  go: boolean;
  recommendedPilot: string | null;
  blockedReasons: string[];
  prohibitedActions: string[];
  providerCalled: false;
  liveExecutionAllowed: false;
};

export type DriveDraftPilotReadinessStatus = "ready" | "blocked" | "missing_config" | "needs_approval";

export type DriveDraftPilotReadinessPacket = {
  connector: "google_drive";
  candidateAction: "create_drive_doc_draft";
  environmentTarget: "preview_only";
  requiredConfigKeys: Array<{
    key: string;
    classification: SecretConfigClassification;
    required: true;
  }>;
  requiredScope: {
    currentReadOnlyScope: "https://www.googleapis.com/auth/drive.metadata.readonly";
    futureDraftWriteScope: "https://www.googleapis.com/auth/drive.file";
    scopeChangeAuthorizedThisSprint: false;
  };
  pilotFlagConfigured: boolean;
  exactActionAllowlisted: boolean;
  testFolderConfigured: boolean;
  rollbackPlanPresent: boolean;
  auditPathConfirmed: boolean;
  memoryPathConfirmed: boolean;
  killSwitchConfirmed: boolean;
  ceoApprovalConfirmed: boolean;
  ceoApprovalRequired: true;
  previewOnly: true;
  productionBlocked: true;
  status: DriveDraftPilotReadinessStatus;
  blockedReasons: string[];
  missingConfig: string[];
  nextSafeAction: string;
  recommendedPilot: "create_drive_doc_draft" | null;
  providerCalled: false;
  liveExecutionAllowed: false;
};

export type DriveDraftPilotReadinessInput = {
  env?: NodeJS.ProcessEnv;
  exactActionAllowlisted?: boolean;
  rollbackPlanPresent?: boolean;
  auditPathConfirmed?: boolean;
  memoryPathConfirmed?: boolean;
  killSwitchConfirmed?: boolean;
  ceoApprovalConfirmed?: boolean;
  previewOnly?: boolean;
  productionBlocked?: boolean;
};

export const providerExecutionFrameworkActions = providerDraftActions;
export type ProviderExecutionFrameworkAction = ProviderDraftAction;
export type ProviderExecutionFrameworkStatus = ProviderDraftStatus;
export type ProviderExecutionActionRegistryEntry = ProviderDraftRegistryEntry;

export type ProviderExecutionPreviewInput = ProviderDraftPreviewInput & {
  readinessPacket?: DriveDraftPilotReadinessPacket;
};
export type ProviderExecutionPreview = ProviderDraftPreview;

export type ControlledExecutionMaturityReport = {
  ok: true;
  generatedAt: string;
  level4InternalExecutionReady: boolean;
  level4ExternalExecutionReady: false;
  pendingInternalApprovals: Array<{
    id: string;
    title: string;
    actionType: string;
    sourceLabel: string;
    status: string;
  }>;
  executedInternalOutcomes: Array<{
    id: string;
    title: string;
    actionType: string;
    sourceLabel: string;
    status: string;
    externalReference: string | null;
  }>;
  blockedExecutions: Array<{
    id: string;
    title: string;
    actionType: string;
    sourceLabel: string;
    blockedReason: string | null;
  }>;
  draftExternalWork: {
    allowedDraftActions: ControlledDraftExternalAction[];
    executable: false;
    providerCalled: false;
    liveExecutionAllowed: false;
  };
  externalReadinessGate: ExternalExecutionReadinessGate;
  driveDraftPilotReadiness: DriveDraftPilotReadinessPacket;
  providerExecutionFramework: {
    actions: ProviderExecutionActionRegistryEntry[];
    driveDraftPreview: ProviderExecutionPreview;
    governedDraftPreviews: ProviderDraftGovernedPreview[];
    payloadValidationPolicy: {
      payloadSchemaVersion: "sprint-10c-v1";
      previewIntegrationVersion: "sprint-10d-v1";
      normalizedPayloadRequired: true;
      providerCalled: false;
      liveExecutionAllowed: false;
      autonomousExecution: false;
    };
    providerCalled: false;
    liveExecutionAllowed: false;
  };
  outcomeStates: ExecutionOutcomeState[];
  safety: {
    exactActionPolicy: true;
    providerCalled: false;
    liveExecutionAllowed: false;
    productionDeployIncluded: false;
    externalExecutionRequiresSeparateApproval: true;
  };
};

export function isControlledInternalExecutionAction(value: unknown): value is ControlledInternalExecutionAction {
  return typeof value === "string" && controlledInternalExecutionActions.includes(value as ControlledInternalExecutionAction);
}

export function isControlledDraftExternalAction(value: unknown): value is ControlledDraftExternalAction {
  return typeof value === "string" && controlledDraftExternalActions.includes(value as ControlledDraftExternalAction);
}

export function buildExecutionTraceContract(input: {
  traceId?: string;
  signalId?: string | null;
  workOrderId?: string | null;
  approvalId?: string | null;
  actionType: ExecutionTraceContract["actionType"];
  outcome: ExecutionOutcomeState;
  taskId?: string | null;
  noteId?: string | null;
  aiEmployee?: string | null;
  department?: string | null;
  kpiAffected?: string[];
  sourceLabel: string;
}): ExecutionTraceContract {
  return {
    traceId: input.traceId ?? `execution:${input.approvalId ?? input.workOrderId ?? input.sourceLabel}`,
    signalId: input.signalId ?? null,
    workOrderId: input.workOrderId ?? null,
    approvalId: input.approvalId ?? null,
    actionType: input.actionType,
    outcome: input.outcome,
    taskId: input.taskId ?? null,
    noteId: input.noteId ?? null,
    aiEmployee: input.aiEmployee ?? null,
    department: input.department ?? null,
    kpiAffected: [...new Set(input.kpiAffected ?? [])].slice(0, 8),
    sourceLabel: input.sourceLabel,
    providerCalled: false,
    sent: false,
    published: false,
    scheduled: false,
    liveExecutionAllowed: false,
  };
}

export function createControlledInternalExecutionOutcome(
  run: ApprovedExecutionRunResult,
  input: {
    actionType: ControlledInternalExecutionAction;
    sourceLabel: string;
    signalId?: string | null;
    workOrderId?: string | null;
    aiEmployee?: string | null;
    department?: string | null;
    kpiAffected?: string[];
  },
): ControlledInternalExecutionOutcome {
  if (!isControlledInternalExecutionAction(input.actionType)) {
    return {
      ok: false,
      actionType: "create_crm_note",
      state: "invalid_action",
      message: "Only approved internal CRM task or note actions may enter the internal execution bridge.",
      trace: buildExecutionTraceContract({
        actionType: "create_crm_note",
        outcome: "invalid_action",
        approvalId: run.approvalId,
        sourceLabel: input.sourceLabel,
      }),
      memoryKpiReadiness: createMemoryKpiReadiness("invalid_action"),
      providerCalled: false,
      liveExecutionAllowed: false,
    };
  }

  const state = stateFromRun(run, input.actionType);
  const trace = buildExecutionTraceContract({
    actionType: input.actionType,
    outcome: state,
    approvalId: run.approvalId,
    signalId: input.signalId,
    workOrderId: input.workOrderId,
    taskId: input.actionType === "create_crm_task" && run.result.crmTaskCreated ? run.result.externalReference : null,
    noteId: input.actionType === "create_crm_note" && run.result.internalNoteCreated ? run.result.externalReference : null,
    aiEmployee: input.aiEmployee,
    department: input.department,
    kpiAffected: input.kpiAffected,
    sourceLabel: input.sourceLabel,
  });

  assertExecutionTraceContract(trace);

  return {
    ok: run.ok,
    actionType: input.actionType,
    state,
    message: run.result.message,
    trace,
    memoryKpiReadiness: createMemoryKpiReadiness(state),
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}

function stateFromRun(run: ApprovedExecutionRunResult, actionType: ControlledInternalExecutionAction): ExecutionOutcomeState {
  if (run.result.providerCalled || run.result.sent || run.result.published || run.result.scheduled) return "blocked_by_policy";
  if (!run.auditLogged && run.result.status === "failed") return "audit_failed";
  if (!run.memoryLogged && run.result.status === "failed") return "memory_failed";
  if (run.result.status !== "executed") return run.result.blockedReason?.toLowerCase().includes("already") ? "duplicate_blocked" : "blocked_by_policy";
  if (actionType === "create_crm_task" && run.result.crmTaskCreated) return "internal_task_created";
  if (actionType === "create_crm_note" && run.result.internalNoteCreated) return "internal_note_created";

  return "invalid_action";
}

function createMemoryKpiReadiness(state: ExecutionOutcomeState): ControlledInternalExecutionOutcome["memoryKpiReadiness"] {
  return {
    readyForMemoryWrite: state === "internal_task_created" || state === "internal_note_created",
    readyForKpiUpdate: state === "internal_task_created" || state === "internal_note_created",
    persistenceAllowed: false,
    recommendedMemoryEvent: `controlled_internal_execution.${state}`,
    recommendedKpiUpdate:
      state === "internal_task_created"
        ? "increment_internal_crm_tasks_created"
        : state === "internal_note_created"
          ? "increment_internal_crm_notes_recorded"
          : "record_execution_blocker",
  };
}

export function createDraftSafetyReviewContract(input: {
  actionType: ControlledDraftExternalAction;
  title: string;
  draftBody: string;
  claimSourceCheck?: "required" | "passed";
  complianceCheck?: "required" | "passed";
}): DraftSafetyReviewContract {
  if (!isControlledDraftExternalAction(input.actionType)) {
    throw new Error("Unsupported draft external action.");
  }

  return {
    actionType: input.actionType,
    title: input.title.trim().slice(0, 180),
    draftBody: input.draftBody.trim().slice(0, 4000),
    claimSourceCheck: input.claimSourceCheck ?? "required",
    complianceCheck: input.complianceCheck ?? "required",
    ceoReviewRequired: true,
    executable: false,
    providerCalled: false,
    liveExecutionAllowed: false,
    forbiddenActions: ["send", "publish", "schedule", "create_provider_record", "reply_to_review", "post", "scrape"],
  };
}

export function evaluateExternalExecutionReadinessGate(input: ExternalExecutionReadinessGateInput): ExternalExecutionReadinessGate {
  const prohibitedActions = ["send_email", "send_sms", "publish_post", "reply_to_review", "run_ads", "autonomous_outreach"];
  const checks: Array<[boolean, string]> = [
    [input.connectorVerified, "Connector is not verified."],
    [input.scopesVerified, "Scopes are not verified."],
    [input.credentialEvidencePresent, "Credential evidence is missing."],
    [input.exactActionAllowlisted, "Exact action is not allowlisted."],
    [input.rollbackPlanPresent, "Rollback or undo plan is missing."],
    [input.auditPathConfirmed, "Audit path is not confirmed."],
    [input.memoryPathConfirmed, "Memory path is not confirmed."],
    [input.killSwitchConfirmed, "Kill switch is not confirmed."],
    [input.ceoApprovalConfirmed, "CEO approval is not confirmed."],
    [input.previewTested, "Preview test has not passed."],
    [input.risk === "low", "Only low-risk pilot candidates can proceed."],
    [!prohibitedActions.includes(input.candidateAction), "Candidate action is prohibited for Sprint 7."],
  ];
  const blockedReasons = checks.filter(([passed]) => !passed).map(([, reason]) => reason);

  return {
    go: blockedReasons.length === 0,
    recommendedPilot: blockedReasons.length === 0 ? input.candidateAction : null,
    blockedReasons,
    prohibitedActions,
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}

const driveDraftPilotRequiredConfigKeys = [
  "GOOGLE_DRIVE_DRAFT_PILOT_ENABLED",
  "GOOGLE_OAUTH_CLIENT_ID",
  "GOOGLE_OAUTH_CLIENT_SECRET",
  "GOOGLE_OAUTH_REFRESH_TOKEN",
  "GOOGLE_DRIVE_TEST_FOLDER_ID",
] as const;

function driveDraftPilotStatus(input: { missingConfig: string[]; missingApproval: boolean; blockedReasons: string[] }): DriveDraftPilotReadinessStatus {
  if (input.missingConfig.length > 0) return "missing_config";
  if (input.missingApproval) return "needs_approval";
  if (input.blockedReasons.length > 0) return "blocked";

  return "ready";
}

function nextSafeActionForDriveDraftPilot(packet: Pick<DriveDraftPilotReadinessPacket, "status" | "missingConfig" | "blockedReasons">) {
  if (packet.status === "missing_config") return `Configure non-placeholder local values for: ${packet.missingConfig.join(", ")}.`;
  if (packet.status === "needs_approval") return "CEO must explicitly approve the Preview-only Google Drive draft pilot packet before execution can be prepared.";
  if (packet.status === "blocked") return packet.blockedReasons[0] ?? "Resolve readiness blockers before preparing a Preview pilot.";

  return "Ready for separate CEO approval of a Preview-only Google Drive draft pilot. Do not execute from this packet.";
}

export function createDriveDraftPilotReadinessPacket(input: DriveDraftPilotReadinessInput = {}): DriveDraftPilotReadinessPacket {
  const env = input.env ?? process.env;
  const requiredConfigKeys = driveDraftPilotRequiredConfigKeys.map((key) => ({
    key,
    classification: key === "GOOGLE_DRIVE_DRAFT_PILOT_ENABLED"
      ? env[key] === "true"
        ? "configured"
        : env[key]?.trim()
          ? "malformed"
          : "missing"
      : classifySecretConfig(key, env[key]),
    required: true as const,
  }));
  const missingConfig = requiredConfigKeys
    .filter((check) => check.classification !== "configured")
    .map((check) => check.key);
  const pilotFlagConfigured = env.GOOGLE_DRIVE_DRAFT_PILOT_ENABLED === "true";
  const exactActionAllowlisted = input.exactActionAllowlisted ?? true;
  const testFolderConfigured = requiredConfigKeys.find((check) => check.key === "GOOGLE_DRIVE_TEST_FOLDER_ID")?.classification === "configured";
  const rollbackPlanPresent = input.rollbackPlanPresent ?? false;
  const auditPathConfirmed = input.auditPathConfirmed ?? true;
  const memoryPathConfirmed = input.memoryPathConfirmed ?? true;
  const killSwitchConfirmed = input.killSwitchConfirmed ?? false;
  const ceoApprovalConfirmed = input.ceoApprovalConfirmed ?? false;
  const previewOnly = input.previewOnly ?? true;
  const productionBlocked = input.productionBlocked ?? true;
  const gate = evaluateExternalExecutionReadinessGate({
    connectorVerified: missingConfig.length === 0 && pilotFlagConfigured && testFolderConfigured,
    scopesVerified: true,
    credentialEvidencePresent: missingConfig.length === 0 && pilotFlagConfigured,
    exactActionAllowlisted,
    rollbackPlanPresent,
    auditPathConfirmed,
    memoryPathConfirmed,
    killSwitchConfirmed,
    ceoApprovalConfirmed,
    previewTested: previewOnly && productionBlocked,
    risk: "low",
    candidateAction: "create_drive_doc_draft",
  });
  const blockedReasons = [
    ...gate.blockedReasons,
    ...(!previewOnly ? ["Pilot must be marked Preview-only."] : []),
    ...(!productionBlocked ? ["Production must remain blocked for this pilot packet."] : []),
  ];
  const status = driveDraftPilotStatus({
    missingConfig,
    missingApproval: !ceoApprovalConfirmed,
    blockedReasons,
  });
  const packet: DriveDraftPilotReadinessPacket = {
    connector: "google_drive",
    candidateAction: "create_drive_doc_draft",
    environmentTarget: "preview_only",
    requiredConfigKeys,
    requiredScope: {
      currentReadOnlyScope: "https://www.googleapis.com/auth/drive.metadata.readonly",
      futureDraftWriteScope: "https://www.googleapis.com/auth/drive.file",
      scopeChangeAuthorizedThisSprint: false,
    },
    pilotFlagConfigured,
    exactActionAllowlisted,
    testFolderConfigured,
    rollbackPlanPresent,
    auditPathConfirmed,
    memoryPathConfirmed,
    killSwitchConfirmed,
    ceoApprovalConfirmed,
    ceoApprovalRequired: true,
    previewOnly: true,
    productionBlocked: true,
    status,
    blockedReasons,
    missingConfig,
    nextSafeAction: "",
    recommendedPilot: status === "ready" ? "create_drive_doc_draft" : null,
    providerCalled: false,
    liveExecutionAllowed: false,
  };
  packet.nextSafeAction = nextSafeActionForDriveDraftPilot(packet);
  assertDriveDraftPilotReadinessSafety(packet);

  return packet;
}

export function assertDriveDraftPilotReadinessSafety(packet: DriveDraftPilotReadinessPacket): void {
  const serialized = JSON.stringify(packet);
  if (packet.connector !== "google_drive") throw new Error("Drive pilot packet must target Google Drive only.");
  if (packet.candidateAction !== "create_drive_doc_draft") throw new Error("Drive pilot packet must use the draft action only.");
  if (!packet.previewOnly) throw new Error("Drive pilot packet must remain Preview-only.");
  if (!packet.productionBlocked) throw new Error("Drive pilot packet must keep Production blocked.");
  if (!packet.pilotFlagConfigured && !packet.missingConfig.includes("GOOGLE_DRIVE_DRAFT_PILOT_ENABLED")) {
    throw new Error("Drive pilot readiness must require GOOGLE_DRIVE_DRAFT_PILOT_ENABLED.");
  }
  if (packet.providerCalled || packet.liveExecutionAllowed) throw new Error("Drive pilot readiness must not call providers or allow live execution.");
  if (packet.requiredScope.scopeChangeAuthorizedThisSprint) throw new Error("Drive pilot prep must not authorize OAuth scope changes.");
  if (serialized.includes("create_drive_doc\"") || serialized.includes("drive.files.create")) {
    throw new Error("Drive pilot readiness cannot expose generic Google Drive execution actions.");
  }
  if (/ya29\.|GOCSPX-|refresh-token|client-secret|BEGIN PRIVATE KEY/u.test(serialized)) {
    throw new Error("Drive pilot readiness packet exposed secret-like values.");
  }
}

export function listProviderExecutionActionRegistry(): ProviderExecutionActionRegistryEntry[] {
  return listProviderDraftActionRegistry();
}

export function isProviderExecutionFrameworkAction(value: unknown): value is ProviderExecutionFrameworkAction {
  return isProviderDraftAction(value);
}

export function createProviderExecutionPreview(input: ProviderExecutionPreviewInput): ProviderExecutionPreview {
  const readinessPacket = input.actionType === "create_drive_doc_draft"
    ? input.readinessPacket ?? createDriveDraftPilotReadinessPacket({
      ceoApprovalConfirmed: input.ceoApprovalConfirmed,
      killSwitchConfirmed: input.killSwitchConfirmed,
    })
    : input.readinessPacket;
  const preview = createProviderDraftPreview({
    ...input,
    readinessStatus: input.readinessStatus ?? readinessPacket?.status,
    targetConfigured: input.targetConfigured ?? readinessPacket?.testFolderConfigured,
  });
  assertProviderExecutionPreviewSafety(preview);

  return preview;
}

export function assertProviderExecutionPreviewSafety(preview: ProviderExecutionPreview): void {
  assertProviderDraftPreviewSafety(preview);
}

export function assertExecutionTraceContract(trace: ExecutionTraceContract): void {
  if (!trace.sourceLabel) throw new Error("Execution trace requires a source label.");
  if (!trace.actionType) throw new Error("Execution trace requires an exact action type.");
  if (trace.providerCalled || trace.sent || trace.published || trace.scheduled || trace.liveExecutionAllowed) {
    throw new Error("Sprint 7 trace cannot claim provider calls, sends, publishes, schedules, or live external execution.");
  }
  if (trace.actionType === "create_crm_task" && trace.outcome === "internal_task_created" && !trace.taskId) {
    throw new Error("Internal task execution trace requires a task ID.");
  }
  if (trace.actionType === "create_crm_note" && trace.outcome === "internal_note_created" && !trace.noteId) {
    throw new Error("Internal note execution trace requires a note ID.");
  }
}

function actionTypeFromPayload(payload: unknown) {
  const value = payload as { preparedAction?: { actionType?: unknown }; execution?: { actionType?: unknown; externalReference?: unknown } } | null;
  const actionType = value?.preparedAction?.actionType ?? value?.execution?.actionType;

  return typeof actionType === "string" ? actionType : "unknown";
}

function externalReferenceFromPayload(payload: unknown) {
  const value = payload as { execution?: { externalReference?: unknown } } | null;
  const externalReference = value?.execution?.externalReference;

  return typeof externalReference === "string" ? externalReference : null;
}

export async function createControlledExecutionMaturityReport(): Promise<ControlledExecutionMaturityReport> {
  const approvals = await prisma.unifiedApprovalItem.findMany({
    where: {
      itemType: "approved_execution",
      connectorId: "internal_crm",
    },
    orderBy: { updatedAt: "desc" },
    take: 50,
    select: {
      id: true,
      title: true,
      sourceLabel: true,
      status: true,
      executionBlockedReason: true,
      payload: true,
    },
  });

  const pendingInternalApprovals = approvals
    .filter((approval) => approval.status === "pending_review" && isControlledInternalExecutionAction(actionTypeFromPayload(approval.payload)))
    .map((approval) => ({
      id: approval.id,
      title: approval.title,
      actionType: actionTypeFromPayload(approval.payload),
      sourceLabel: approval.sourceLabel,
      status: approval.status,
    }));
  const executedInternalOutcomes = approvals
    .filter((approval) => approval.status === "executed" && isControlledInternalExecutionAction(actionTypeFromPayload(approval.payload)))
    .map((approval) => ({
      id: approval.id,
      title: approval.title,
      actionType: actionTypeFromPayload(approval.payload),
      sourceLabel: approval.sourceLabel,
      status: approval.status,
      externalReference: externalReferenceFromPayload(approval.payload),
    }));
  const blockedExecutions = approvals
    .filter((approval) => approval.status === "execution_blocked" && isControlledInternalExecutionAction(actionTypeFromPayload(approval.payload)))
    .map((approval) => ({
      id: approval.id,
      title: approval.title,
      actionType: actionTypeFromPayload(approval.payload),
      sourceLabel: approval.sourceLabel,
      blockedReason: approval.executionBlockedReason || null,
    }));
  const driveDraftPilotReadiness = createDriveDraftPilotReadinessPacket();
  const driveDraftPreview = createProviderExecutionPreview({
    actionType: "create_drive_doc_draft",
    title: "J Capital AI OS Google Drive draft pilot preview",
    body: "Dry-run request preview only. No Google Drive document will be created.",
    sourceLabel: "provider-execution-framework:create_drive_doc_draft",
    readinessPacket: driveDraftPilotReadiness,
    ceoApprovalConfirmed: driveDraftPilotReadiness.ceoApprovalConfirmed,
    killSwitchConfirmed: driveDraftPilotReadiness.killSwitchConfirmed,
  });
  const governedDraftPreviews = [
    createGovernedProviderDraftPreview({
      actionType: "create_drive_doc_draft",
      title: "J Capital Drive draft preview",
      body: "Normalized Drive draft preview only. No Google Drive document will be created.",
      targetConfigured: driveDraftPilotReadiness.testFolderConfigured,
      sourceLabel: "provider-draft-integration:create_drive_doc_draft",
      readinessStatus: driveDraftPilotReadiness.status,
      ceoApprovalConfirmed: driveDraftPilotReadiness.ceoApprovalConfirmed,
      killSwitchConfirmed: driveDraftPilotReadiness.killSwitchConfirmed,
      requestedEnvironment: "preview",
    }),
    createGovernedProviderDraftPreview({
      actionType: "create_google_doc_draft",
      title: "J Capital Google Docs draft preview",
      body: "Normalized Google Docs draft preview only. No Google Docs document will be created.",
      sourceLabel: "provider-draft-integration:create_google_doc_draft",
      ceoApprovalConfirmed: true,
      killSwitchConfirmed: true,
      requestedEnvironment: "preview",
    }),
    createGovernedProviderDraftPreview({
      actionType: "create_gmail_draft",
      title: "Seller follow-up draft preview",
      body: "Normalized Gmail draft preview only. No Gmail draft will be created or sent.",
      recipientPreview: "seller@example.com",
      sourceLabel: "provider-draft-integration:create_gmail_draft",
      ceoApprovalConfirmed: true,
      killSwitchConfirmed: true,
      requestedEnvironment: "preview",
    }),
    createGovernedProviderDraftPreview({
      actionType: "create_calendar_event_draft",
      title: "Seller appointment draft preview",
      body: "Normalized Calendar draft preview only. No Calendar event will be inserted or scheduled.",
      attendeePreview: "seller@example.com",
      startTimePreview: "2026-07-10T15:00:00-05:00",
      sourceLabel: "provider-draft-integration:create_calendar_event_draft",
      ceoApprovalConfirmed: true,
      killSwitchConfirmed: true,
      requestedEnvironment: "preview",
    }),
  ];

  return {
    ok: true,
    generatedAt: new Date().toISOString(),
    level4InternalExecutionReady: true,
    level4ExternalExecutionReady: false,
    pendingInternalApprovals,
    executedInternalOutcomes,
    blockedExecutions,
    draftExternalWork: {
      allowedDraftActions: [...controlledDraftExternalActions],
      executable: false,
      providerCalled: false,
      liveExecutionAllowed: false,
    },
    externalReadinessGate: evaluateExternalExecutionReadinessGate({
      connectorVerified: false,
      scopesVerified: false,
      credentialEvidencePresent: false,
      exactActionAllowlisted: false,
      rollbackPlanPresent: false,
      auditPathConfirmed: true,
      memoryPathConfirmed: true,
      killSwitchConfirmed: false,
      ceoApprovalConfirmed: false,
      previewTested: false,
      risk: "low",
      candidateAction: "create_calendar_draft",
    }),
    driveDraftPilotReadiness,
    providerExecutionFramework: {
      actions: listProviderExecutionActionRegistry(),
      driveDraftPreview,
      governedDraftPreviews,
      payloadValidationPolicy: {
        payloadSchemaVersion: "sprint-10c-v1",
        previewIntegrationVersion: "sprint-10d-v1",
        normalizedPayloadRequired: true,
        providerCalled: false,
        liveExecutionAllowed: false,
        autonomousExecution: false,
      },
      providerCalled: false,
      liveExecutionAllowed: false,
    },
    outcomeStates: [...executionOutcomeStates],
    safety: {
      exactActionPolicy: true,
      providerCalled: false,
      liveExecutionAllowed: false,
      productionDeployIncluded: false,
      externalExecutionRequiresSeparateApproval: true,
    },
  };
}
