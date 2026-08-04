import type { Prisma } from "@/generated/prisma";

import { logAiMemoryEvent } from "@/lib/ai-memory-logger";
import { recordOperatingLoopTraceFailClosed, setOperatingLoopTraceDbForTest } from "@/lib/operating-loop-trace";
import { prisma } from "@/lib/prisma";
import { requireTenantId } from "@/lib/tenant-context";
let approvedExecutionDb = prisma;
let approvedExecutionMemoryLogger = logAiMemoryEvent;

export const approvedExecutionActionTypes = [
  "send_email",
  "publish_article",
  "schedule_post",
  "create_crm_task",
  "create_crm_note",
  "create_calendar_event",
  "create_drive_doc",
] as const;

export type ApprovedExecutionActionType = (typeof approvedExecutionActionTypes)[number];

export type ApprovedExecutionInput = {
  tenantId: string;
  actionType: ApprovedExecutionActionType;
  title: string;
  sourceLabel: string;
  preparedBy?: string;
  leadId?: string;
  payload: Record<string, unknown>;
};

export type ApprovedExecutionPreparedAction = ApprovedExecutionInput & {
  connectorId: string | null;
  actionKey: string;
  riskLevel: "low" | "medium" | "high";
  requiredApprovals: string[];
};

export type ApprovedExecutionResultStatus =
  | "executed"
  | "blocked"
  | "provider_not_configured"
  | "failed";

export type ApprovedExecutionResult = {
  status: ApprovedExecutionResultStatus;
  actionType: ApprovedExecutionActionType;
  approvalId: string;
  executedAt: string;
  providerCalled: boolean;
  sent: boolean;
  published: boolean;
  scheduled: boolean;
  crmTaskCreated: boolean;
  calendarEventCreated: boolean;
  driveDocumentCreated: boolean;
  internalNoteCreated: boolean;
  externalReference: string | null;
  message: string;
  blockedReason: string | null;
  trace?: ApprovedExecutionTraceContract;
};

export type ApprovedExecutionTraceContract = {
  traceId: string;
  signalId: string | null;
  workOrderId: string | null;
  approvalId: string;
  actionType: ApprovedExecutionActionType;
  taskId: string | null;
  noteId: string | null;
  aiEmployee: string | null;
  department: string | null;
  kpiAffected: string[];
  sourceLabel: string;
  providerCalled: false;
  sent: false;
  published: false;
};

export type ApprovedExecutionPrepareResult = {
  ok: true;
  approvalItem: {
    id: string;
    title: string;
    status: string;
    connectorId: string | null;
    actionType: ApprovedExecutionActionType;
    sourceLabel: string;
  };
  providerCalled: false;
  sent: false;
  published: false;
  liveExecutionAllowed: false;
};

export type ApprovedExecutionRunResult = {
  ok: boolean;
  approvalId: string;
  decisionLogged: true;
  auditLogged: boolean;
  memoryLogged: boolean;
  result: ApprovedExecutionResult;
  error?: string;
};

type ApprovalRecord = {
  id: string;
  tenantId: string;
  itemType?: string | null;
  title?: string | null;
  status?: string | null;
  sourceLabel?: string | null;
  connectorId?: string | null;
  payload?: unknown;
};

function getExecutionFromApproval(record: ApprovalRecord): ApprovedExecutionResult | null {
  const payload = record.payload as { execution?: ApprovedExecutionResult | null } | null;

  return payload?.execution ?? null;
}

export function setApprovedExecutionLayerServicesForTest(overrides: {
  db?: typeof prisma;
  memoryLogger?: typeof logAiMemoryEvent;
}) {
  const previousDb = approvedExecutionDb;
  const previousMemoryLogger = approvedExecutionMemoryLogger;
  const restoreTraceDb = overrides.db ? setOperatingLoopTraceDbForTest(overrides.db as never) : undefined;

  if (overrides.db) approvedExecutionDb = overrides.db;
  if (overrides.memoryLogger) approvedExecutionMemoryLogger = overrides.memoryLogger;

  return () => {
    restoreTraceDb?.();
    approvedExecutionDb = previousDb;
    approvedExecutionMemoryLogger = previousMemoryLogger;
  };
}

function cleanText(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function cleanOptionalText(value: unknown) {
  const text = cleanText(value);

  return text || null;
}

function toInputJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

function hasLiveExecutionPolicy() {
  return process.env.APPROVED_EXECUTION_ENABLED === "true";
}

function hasProductionSmokeApproval() {
  if (process.env.VERCEL_ENV !== "production" && process.env.NODE_ENV !== "production") return true;

  return process.env.APPROVED_EXECUTION_PRODUCTION_SMOKE_PASSED === "true";
}

function getExternalExecutionBlockedReason() {
  if (!hasLiveExecutionPolicy()) return "APPROVED_EXECUTION_ENABLED is not true.";
  if (!hasProductionSmokeApproval()) return "APPROVED_EXECUTION_PRODUCTION_SMOKE_PASSED is not true.";

  return null;
}

function getBearerToken(...names: string[]) {
  for (const name of names) {
    const value = process.env[name]?.trim();
    if (value) return value;
  }

  return null;
}

function getWebhookUrl(...names: string[]) {
  for (const name of names) {
    const value = process.env[name]?.trim();
    if (value) return value;
  }

  return null;
}

export function createApprovedExecutionPreparedAction(input: ApprovedExecutionInput): ApprovedExecutionPreparedAction {
  const actionMap: Record<ApprovedExecutionActionType, Pick<ApprovedExecutionPreparedAction, "connectorId" | "actionKey" | "riskLevel" | "requiredApprovals">> = {
    send_email: {
      connectorId: "gmail",
      actionKey: "gmail.users.messages.send",
      riskLevel: "high",
      requiredApprovals: ["CEO approve-send", "recipient verification", "message body review"],
    },
    publish_article: {
      connectorId: "website_cms",
      actionKey: "article.publish",
      riskLevel: "high",
      requiredApprovals: ["CEO publish approval", "claim/source review", "public page review"],
    },
    schedule_post: {
      connectorId: "social_scheduler",
      actionKey: "social.post.schedule",
      riskLevel: "high",
      requiredApprovals: ["CEO schedule approval", "platform/account review", "copy review"],
    },
    create_crm_task: {
      connectorId: "internal_crm",
      actionKey: "revenue_task.create",
      riskLevel: "low",
      requiredApprovals: ["CEO task creation approval"],
    },
    create_crm_note: {
      connectorId: "internal_crm",
      actionKey: "revenue_note.internal_result",
      riskLevel: "low",
      requiredApprovals: ["CEO internal note approval"],
    },
    create_calendar_event: {
      connectorId: "google_calendar",
      actionKey: "calendar.events.insert",
      riskLevel: "medium",
      requiredApprovals: ["CEO calendar approval", "attendee/time review"],
    },
    create_drive_doc: {
      connectorId: "google_drive",
      actionKey: "drive.files.create",
      riskLevel: "medium",
      requiredApprovals: ["CEO document creation approval", "content review"],
    },
  };

  return {
    ...input,
    ...actionMap[input.actionType],
  };
}

export async function prepareApprovedExecution(input: ApprovedExecutionInput): Promise<ApprovedExecutionPrepareResult> {
  const tenantId = requireTenantId(input.tenantId, "approved_execution_prepare");
  const preparedAction = createApprovedExecutionPreparedAction(input);
  const existingApproval = await findExistingPreparedApproval(tenantId, input.sourceLabel, input.actionType);

  if (existingApproval) {
    return {
      ok: true,
      approvalItem: {
        id: existingApproval.id,
        title: existingApproval.title ?? input.title,
        status: existingApproval.status ?? "pending_review",
        connectorId: existingApproval.connectorId ?? preparedAction.connectorId,
        actionType: input.actionType,
        sourceLabel: existingApproval.sourceLabel ?? input.sourceLabel,
      },
      providerCalled: false,
      sent: false,
      published: false,
      liveExecutionAllowed: false,
    };
  }

  const approvalItem = await approvedExecutionDb.unifiedApprovalItem.create({
    data: {
      tenantId,
      itemType: "approved_execution",
      sourceType: "approved_execution_layer",
      sourceId: input.leadId ?? null,
      title: input.title,
      sourceLabel: input.sourceLabel,
      status: "pending_review",
      riskLevel: preparedAction.riskLevel,
      requiredApprovals: preparedAction.requiredApprovals,
      connectorId: preparedAction.connectorId,
      executionBlockedReason: "Awaiting CEO approve-execute decision for one exact action.",
      payload: toInputJson({
        preparedAction,
        execution: null,
      policy: {
        exactActionOnly: true,
        oneTimeExecution: true,
        approvalDoesNotGeneralize: true,
        liveExecutionRequiresEnv: "APPROVED_EXECUTION_ENABLED=true",
        idempotencyKey: `internal-execution:${input.payload.sourceWorkOrderId ?? input.payload.workOrderId ?? input.sourceLabel}:${input.actionType}`,
      },
      }),
      providerCalled: false,
      sent: false,
      published: false,
      liveExecutionAllowed: false,
    },
    select: {
      id: true,
      title: true,
      status: true,
      connectorId: true,
      sourceLabel: true,
    },
  });

  return {
    ok: true,
    approvalItem: {
      ...approvalItem,
      actionType: input.actionType,
    },
    providerCalled: false,
    sent: false,
    published: false,
    liveExecutionAllowed: false,
  };
}

async function findExistingPreparedApproval(tenantId: string, sourceLabel: string, actionType: ApprovedExecutionActionType): Promise<ApprovalRecord | null> {
  const client = approvedExecutionDb.unifiedApprovalItem as unknown as {
    findFirst?: (args: unknown) => Promise<ApprovalRecord | null>;
  };

  if (!client.findFirst) return null;

  return client.findFirst({
    where: {
      tenantId,
      itemType: "approved_execution",
      sourceLabel,
      status: { in: ["pending_review", "executed"] },
      payload: {
        path: ["preparedAction", "actionType"],
        equals: actionType,
      },
    },
  });
}

function getPreparedAction(record: ApprovalRecord): ApprovedExecutionPreparedAction {
  const payload = record.payload as { preparedAction?: ApprovedExecutionPreparedAction; execution?: ApprovedExecutionResult | null } | null;
  const preparedAction = payload?.preparedAction;

  if (!preparedAction || !approvedExecutionActionTypes.includes(preparedAction.actionType)) {
    throw new Error("Approved execution item is missing a valid prepared action.");
  }

  if (payload?.execution?.status === "executed") {
    throw new Error("Approved execution item has already executed.");
  }

  return preparedAction;
}

function blockedResult(approvalId: string, preparedAction: ApprovedExecutionPreparedAction, blockedReason: string): ApprovedExecutionResult {
  return {
    status: "blocked",
    actionType: preparedAction.actionType,
    approvalId,
    executedAt: new Date().toISOString(),
    providerCalled: false,
    sent: false,
    published: false,
    scheduled: false,
    crmTaskCreated: false,
    calendarEventCreated: false,
    driveDocumentCreated: false,
    internalNoteCreated: false,
    externalReference: null,
    message: "Approved execution blocked before provider call.",
    blockedReason,
  };
}

function providerNotConfiguredResult(approvalId: string, preparedAction: ApprovedExecutionPreparedAction, missing: string): ApprovedExecutionResult {
  return {
    ...blockedResult(approvalId, preparedAction, missing),
    status: "provider_not_configured",
    message: "Approved execution was authorized but the provider is not configured.",
  };
}

function baseExecutedResult(approvalId: string, preparedAction: ApprovedExecutionPreparedAction): ApprovedExecutionResult {
  return {
    status: "executed",
    actionType: preparedAction.actionType,
    approvalId,
    executedAt: new Date().toISOString(),
    providerCalled: false,
    sent: false,
    published: false,
    scheduled: false,
    crmTaskCreated: false,
    calendarEventCreated: false,
    driveDocumentCreated: false,
    internalNoteCreated: false,
    externalReference: null,
    message: "Approved action executed.",
    blockedReason: null,
  };
}

function failClosedResult(approvalId: string, preparedAction: ApprovedExecutionPreparedAction, reason: string): ApprovedExecutionResult {
  return {
    ...blockedResult(approvalId, preparedAction, reason),
    status: "failed",
    message: "Approved execution failed closed after safety validation.",
  };
}

function base64Url(value: string) {
  return Buffer.from(value).toString("base64").replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/u, "");
}

async function executeSendEmail(approvalId: string, preparedAction: ApprovedExecutionPreparedAction): Promise<ApprovedExecutionResult> {
  const token = getBearerToken("GMAIL_SEND_ACCESS_TOKEN", "GOOGLE_GMAIL_ACCESS_TOKEN");
  if (!token) return providerNotConfiguredResult(approvalId, preparedAction, "Missing GMAIL_SEND_ACCESS_TOKEN or GOOGLE_GMAIL_ACCESS_TOKEN.");

  const to = cleanText(preparedAction.payload.to);
  const subject = cleanText(preparedAction.payload.subject);
  const body = cleanText(preparedAction.payload.body);
  if (!to || !subject || !body) return blockedResult(approvalId, preparedAction, "Email requires to, subject, and body.");

  const raw = base64Url(`To: ${to}\r\nSubject: ${subject}\r\nContent-Type: text/plain; charset=utf-8\r\n\r\n${body}`);
  const response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ raw }),
  });

  if (!response.ok) {
    return {
      ...blockedResult(approvalId, preparedAction, `Gmail send failed with ${response.status}.`),
      status: "failed",
      providerCalled: true,
      message: "Gmail provider call failed.",
    };
  }

  const data = (await response.json().catch(() => ({}))) as { id?: string };

  return {
    ...baseExecutedResult(approvalId, preparedAction),
    providerCalled: true,
    sent: true,
    externalReference: data.id ?? null,
    message: "One CEO-approved email was sent.",
  };
}

async function executeCalendarEvent(approvalId: string, preparedAction: ApprovedExecutionPreparedAction): Promise<ApprovedExecutionResult> {
  const token = getBearerToken("GOOGLE_CALENDAR_ACCESS_TOKEN", "GOOGLE_WORKSPACE_ACCESS_TOKEN");
  if (!token) return providerNotConfiguredResult(approvalId, preparedAction, "Missing GOOGLE_CALENDAR_ACCESS_TOKEN or GOOGLE_WORKSPACE_ACCESS_TOKEN.");

  const calendarId = encodeURIComponent(cleanText(preparedAction.payload.calendarId, "primary"));
  const summary = cleanText(preparedAction.payload.summary);
  const start = cleanText(preparedAction.payload.start);
  const end = cleanText(preparedAction.payload.end);
  if (!summary || !start || !end) return blockedResult(approvalId, preparedAction, "Calendar event requires summary, start, and end.");

  const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      summary,
      description: cleanOptionalText(preparedAction.payload.description) ?? undefined,
      start: { dateTime: start },
      end: { dateTime: end },
    }),
  });

  if (!response.ok) {
    return {
      ...blockedResult(approvalId, preparedAction, `Google Calendar insert failed with ${response.status}.`),
      status: "failed",
      providerCalled: true,
      message: "Google Calendar provider call failed.",
    };
  }

  const data = (await response.json().catch(() => ({}))) as { id?: string; htmlLink?: string };

  return {
    ...baseExecutedResult(approvalId, preparedAction),
    providerCalled: true,
    scheduled: true,
    calendarEventCreated: true,
    externalReference: data.htmlLink ?? data.id ?? null,
    message: "One CEO-approved calendar event was created.",
  };
}

async function executeDriveDoc(approvalId: string, preparedAction: ApprovedExecutionPreparedAction): Promise<ApprovedExecutionResult> {
  const token = getBearerToken("GOOGLE_DRIVE_ACCESS_TOKEN", "GOOGLE_WORKSPACE_ACCESS_TOKEN");
  if (!token) return providerNotConfiguredResult(approvalId, preparedAction, "Missing GOOGLE_DRIVE_ACCESS_TOKEN or GOOGLE_WORKSPACE_ACCESS_TOKEN.");

  const name = cleanText(preparedAction.payload.name);
  const body = cleanText(preparedAction.payload.body);
  if (!name || !body) return blockedResult(approvalId, preparedAction, "Drive document requires name and body.");

  const boundary = `approved_execution_${Date.now()}`;
  const multipartBody = [
    `--${boundary}`,
    "Content-Type: application/json; charset=UTF-8",
    "",
    JSON.stringify({ name, mimeType: "application/vnd.google-apps.document" }),
    `--${boundary}`,
    "Content-Type: text/plain; charset=UTF-8",
    "",
    body,
    `--${boundary}--`,
  ].join("\r\n");

  const response = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": `multipart/related; boundary=${boundary}`,
    },
    body: multipartBody,
  });

  if (!response.ok) {
    return {
      ...blockedResult(approvalId, preparedAction, `Google Drive create failed with ${response.status}.`),
      status: "failed",
      providerCalled: true,
      message: "Google Drive provider call failed.",
    };
  }

  const data = (await response.json().catch(() => ({}))) as { id?: string; webViewLink?: string };

  return {
    ...baseExecutedResult(approvalId, preparedAction),
    providerCalled: true,
    driveDocumentCreated: true,
    externalReference: data.webViewLink ?? data.id ?? null,
    message: "One CEO-approved Google Drive document was created.",
  };
}

async function postApprovedExecutionWebhook(
  approvalId: string,
  preparedAction: ApprovedExecutionPreparedAction,
  config: {
    urlEnvNames: string[];
    tokenEnvNames: string[];
    successMessage: string;
    missingMessage: string;
    resultFlags: Partial<Pick<ApprovedExecutionResult, "published" | "scheduled">>;
  },
): Promise<ApprovedExecutionResult> {
  const webhookUrl = getWebhookUrl(...config.urlEnvNames);
  if (!webhookUrl) return providerNotConfiguredResult(approvalId, preparedAction, config.missingMessage);

  const token = getBearerToken(...config.tokenEnvNames);
  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      approvalId,
      actionType: preparedAction.actionType,
      title: preparedAction.title,
      sourceLabel: preparedAction.sourceLabel,
      payload: preparedAction.payload,
      policy: {
        exactActionOnly: true,
        oneTimeExecution: true,
        ceoApproved: true,
      },
    }),
  });

  if (!response.ok) {
    return {
      ...blockedResult(approvalId, preparedAction, `${preparedAction.actionType} webhook failed with ${response.status}.`),
      status: "failed",
      providerCalled: true,
      message: `${preparedAction.actionType} provider call failed.`,
    };
  }

  const data = (await response.json().catch(() => ({}))) as { id?: string; url?: string; externalReference?: string };

  return {
    ...baseExecutedResult(approvalId, preparedAction),
    ...config.resultFlags,
    providerCalled: true,
    externalReference: data.externalReference ?? data.url ?? data.id ?? null,
    message: config.successMessage,
  };
}

async function executeCrmTask(approvalId: string, preparedAction: ApprovedExecutionPreparedAction): Promise<ApprovedExecutionResult> {
  const title = cleanText(preparedAction.payload.title, preparedAction.title);
  const recommendedAction = cleanText(preparedAction.payload.recommendedAction, title);
  const reason = cleanText(preparedAction.payload.reason, "Created from CEO-approved execution layer.");
  const task = await approvedExecutionDb.revenueTask.create({
    data: {
      tenantId: preparedAction.tenantId,
      leadId: cleanOptionalText(preparedAction.leadId),
      title,
      taskType: cleanText(preparedAction.payload.taskType, "approved_execution"),
      priority: cleanText(preparedAction.payload.priority, "medium"),
      status: "open",
      recommendedAction,
      reason,
      dueAt: cleanOptionalText(preparedAction.payload.dueAt) ? new Date(cleanText(preparedAction.payload.dueAt)) : null,
      assignedTo: cleanOptionalText(preparedAction.payload.assignedTo),
      requiresApproval: false,
      source: `approved_execution:${approvalId}`,
    },
    select: { id: true },
  });

  return {
    ...baseExecutedResult(approvalId, preparedAction),
    crmTaskCreated: true,
    externalReference: task.id,
    message: "One CEO-approved CRM task was created.",
    trace: createExecutionTraceContract(approvalId, preparedAction, { taskId: task.id }),
  };
}

function boundedNoteText(value: unknown) {
  const text = cleanText(value);
  if (!text) return null;

  return text.slice(0, 1000);
}

function createExecutionTraceContract(
  approvalId: string,
  preparedAction: ApprovedExecutionPreparedAction,
  ids: { taskId?: string | null; noteId?: string | null } = {},
): ApprovedExecutionTraceContract {
  const payload = preparedAction.payload;
  const kpi = payload.kpiAffected;

  return {
    traceId: `approved_execution:${approvalId}`,
    signalId: cleanOptionalText(payload.signalId),
    workOrderId: cleanOptionalText(payload.sourceWorkOrderId) ?? cleanOptionalText(payload.workOrderId),
    approvalId,
    actionType: preparedAction.actionType,
    taskId: ids.taskId ?? null,
    noteId: ids.noteId ?? null,
    aiEmployee: cleanOptionalText(payload.aiEmployee) ?? cleanOptionalText(payload.assignedTo) ?? cleanOptionalText(preparedAction.preparedBy),
    department: cleanOptionalText(payload.department) ?? preparedAction.connectorId,
    kpiAffected: Array.isArray(kpi) ? kpi.filter((item): item is string => typeof item === "string").slice(0, 8) : [],
    sourceLabel: preparedAction.sourceLabel,
    providerCalled: false,
    sent: false,
    published: false,
  };
}

async function executeCrmNote(approvalId: string, preparedAction: ApprovedExecutionPreparedAction): Promise<ApprovedExecutionResult> {
  const note = boundedNoteText(preparedAction.payload.note ?? preparedAction.payload.body ?? preparedAction.payload.summary);
  if (!note) return blockedResult(approvalId, preparedAction, "Internal CRM note requires a bounded note, body, or summary.");

  const noteId = `internal-crm-note:${approvalId}`;

  return {
    ...baseExecutedResult(approvalId, preparedAction),
    internalNoteCreated: true,
    externalReference: noteId,
    message: "One CEO-approved internal CRM note result was recorded through audit and memory.",
    trace: createExecutionTraceContract(approvalId, preparedAction, { noteId }),
  };
}

async function executeUnsupportedProviderAction(approvalId: string, preparedAction: ApprovedExecutionPreparedAction): Promise<ApprovedExecutionResult> {
  return providerNotConfiguredResult(
    approvalId,
    preparedAction,
    `${preparedAction.actionType} requires a configured provider adapter before live execution.`,
  );
}

async function executePreparedAction(approvalId: string, preparedAction: ApprovedExecutionPreparedAction): Promise<ApprovedExecutionResult> {
  if (preparedAction.actionType !== "create_crm_task" && preparedAction.actionType !== "create_crm_note") {
    const blockedReason = getExternalExecutionBlockedReason();
    if (blockedReason) return blockedResult(approvalId, preparedAction, blockedReason);
  }

  if (preparedAction.actionType === "send_email") return executeSendEmail(approvalId, preparedAction);
  if (preparedAction.actionType === "create_crm_task") return executeCrmTask(approvalId, preparedAction);
  if (preparedAction.actionType === "create_crm_note") return executeCrmNote(approvalId, preparedAction);
  if (preparedAction.actionType === "create_calendar_event") return executeCalendarEvent(approvalId, preparedAction);
  if (preparedAction.actionType === "create_drive_doc") return executeDriveDoc(approvalId, preparedAction);
  if (preparedAction.actionType === "publish_article") {
    return postApprovedExecutionWebhook(approvalId, preparedAction, {
      urlEnvNames: ["APPROVED_ARTICLE_PUBLISH_WEBHOOK_URL", "APPROVED_EXECUTION_PUBLISH_WEBHOOK_URL"],
      tokenEnvNames: ["APPROVED_ARTICLE_PUBLISH_WEBHOOK_TOKEN", "APPROVED_EXECUTION_WEBHOOK_TOKEN"],
      successMessage: "One CEO-approved article was published.",
      missingMessage: "Missing APPROVED_ARTICLE_PUBLISH_WEBHOOK_URL or APPROVED_EXECUTION_PUBLISH_WEBHOOK_URL.",
      resultFlags: { published: true },
    });
  }
  if (preparedAction.actionType === "schedule_post") {
    return postApprovedExecutionWebhook(approvalId, preparedAction, {
      urlEnvNames: ["APPROVED_SOCIAL_SCHEDULE_WEBHOOK_URL", "APPROVED_EXECUTION_SOCIAL_WEBHOOK_URL"],
      tokenEnvNames: ["APPROVED_SOCIAL_SCHEDULE_WEBHOOK_TOKEN", "APPROVED_EXECUTION_WEBHOOK_TOKEN"],
      successMessage: "One CEO-approved social post was scheduled.",
      missingMessage: "Missing APPROVED_SOCIAL_SCHEDULE_WEBHOOK_URL or APPROVED_EXECUTION_SOCIAL_WEBHOOK_URL.",
      resultFlags: { scheduled: true },
    });
  }

  return executeUnsupportedProviderAction(approvalId, preparedAction);
}

async function logExecutionAudit(approvalId: string, preparedAction: ApprovedExecutionPreparedAction, result: ApprovedExecutionResult) {
  const audit = await approvedExecutionDb.revenueAuditEvent.create({
    data: {
      tenantId: preparedAction.tenantId,
      actorId: preparedAction.preparedBy ?? "ceo",
      action: `approved_execution.${preparedAction.actionType}`,
      targetType: "UnifiedApprovalItem",
      targetId: approvalId,
      requestId: `${approvalId}:${preparedAction.actionType}:execute`,
      source: preparedAction.sourceLabel,
      result: result.status,
      safeMetadata: {
        traceId: `approved_execution:${approvalId}`,
        decision: "approve_execute",
        rationale: preparedAction.title,
        department: preparedAction.payload.department ?? preparedAction.connectorId ?? "Approved Execution Layer",
        approvalTimestamp: new Date().toISOString(),
        executionTimestamp: result.executedAt,
        outcome: result.status,
        lessonsLearned:
          result.status === "executed"
            ? "Exact CEO-approved action completed; monitor business outcome before expanding execution."
            : "Execution did not complete; keep action blocked until the blocker is resolved.",
        sourceDraftOrWorkOrder: preparedAction.payload.sourceDraftId ?? preparedAction.payload.sourceWorkOrderId ?? null,
        actionType: preparedAction.actionType,
        connectorId: preparedAction.connectorId,
        providerCalled: result.providerCalled,
        sent: result.sent,
        published: result.published,
        scheduled: result.scheduled,
        externalReference: result.externalReference,
        internalNoteCreated: result.internalNoteCreated,
        executionTrace: result.trace ?? createExecutionTraceContract(approvalId, preparedAction),
        blockedReason: result.blockedReason,
      },
    },
    select: { id: true },
  });

  return audit.id;
}

export async function approveAndExecuteApprovedAction(input: {
  tenantId: string;
  approvalId: string;
  approvedBy?: string;
  note?: string;
}): Promise<ApprovedExecutionRunResult> {
  const tenantId = requireTenantId(input.tenantId, "approved_execution_run");
  const approval = await approvedExecutionDb.unifiedApprovalItem.findFirst({
    where: { id: input.approvalId, tenantId },
  });

  if (!approval) throw new Error("Approved execution item not found.");
  if (approval.itemType !== "approved_execution") throw new Error("Approval item is not an approved execution item.");
  if (approval.status === "executed" || approval.status === "execution_blocked") {
    const existingExecution = getExecutionFromApproval(approval as ApprovalRecord);
    if (existingExecution) {
      return {
        ok: existingExecution.status === "executed",
        approvalId: input.approvalId,
        decisionLogged: true,
        auditLogged: true,
        memoryLogged: true,
        result: existingExecution,
        error: existingExecution.status === "executed" ? undefined : existingExecution.blockedReason ?? existingExecution.message,
      };
    }

    throw new Error("Approved execution item has already executed.");
  }

  const preparedAction = getPreparedAction(approval as ApprovalRecord);
  const result = await executePreparedAction(input.approvalId, preparedAction);
  let auditId: string | null = null;
  let finalResult = result;

  try {
    auditId = await logExecutionAudit(input.approvalId, preparedAction, result);
    await recordOperatingLoopTraceFailClosed({
      tenantId: approval.tenantId,
      traceId: `approved_execution:${input.approvalId}`,
      sourceStep: "approved_execution",
      targetStep: "audit",
      entityType: "RevenueAuditEvent",
      entityId: auditId,
      status: result.status === "executed" ? "completed" : result.status === "failed" ? "failed" : "blocked",
      idempotencyKey: `${input.approvalId}:${preparedAction.actionType}:audit`,
      sourceLabel: preparedAction.sourceLabel,
      providerCalled: result.providerCalled,
      sent: result.sent,
      published: result.published,
      liveExecutionAllowed: result.status === "executed",
    });
  } catch (error) {
    console.error("Approved execution audit logging failed closed:", error);
    finalResult = failClosedResult(input.approvalId, preparedAction, "Audit log write failed.");
  }

  const memory = await approvedExecutionMemoryLogger({
    actionId: input.approvalId,
    leadId: preparedAction.leadId,
    eventType: "approved_execution_outcome",
    approvalDecision: "approved_execute",
    messageChannel: preparedAction.actionType,
    messageStatus: finalResult.status,
    outcome: finalResult.status,
    source: "approved_execution_layer",
    metadata: {
      traceId: `approved_execution:${input.approvalId}`,
      decision: "approve_execute",
      rationale: input.note?.trim() || preparedAction.title,
      department: preparedAction.payload.department ?? preparedAction.connectorId ?? "Approved Execution Layer",
      approvalTimestamp: new Date().toISOString(),
      executionTimestamp: finalResult.executedAt,
      title: preparedAction.title,
      sourceLabel: preparedAction.sourceLabel,
      connectorId: preparedAction.connectorId,
      auditId,
      externalReference: finalResult.externalReference,
      internalNoteCreated: finalResult.internalNoteCreated,
      executionTrace: finalResult.trace ?? createExecutionTraceContract(input.approvalId, preparedAction),
      blockedReason: finalResult.blockedReason,
      sourceDraftOrWorkOrder: preparedAction.payload.sourceDraftId ?? preparedAction.payload.sourceWorkOrderId ?? null,
      lessonsLearned:
        finalResult.status === "executed"
          ? "Exact CEO-approved action completed; compare outcome before tomorrow recommendations."
          : "Execution was blocked or failed; route blocker into tomorrow recommendations.",
    },
  });
  if (!memory.logged && finalResult.status === "executed") {
    finalResult = failClosedResult(input.approvalId, preparedAction, `Executive memory write failed: ${memory.reason}`);
  }
    await recordOperatingLoopTraceFailClosed({
      tenantId: approval.tenantId,
    traceId: `approved_execution:${input.approvalId}`,
    sourceStep: "audit",
    targetStep: "memory",
    entityType: "AiMemoryEvent",
    entityId: memory.logged ? memory.eventId : input.approvalId,
    status: memory.logged ? "completed" : "failed",
    idempotencyKey: `${input.approvalId}:${preparedAction.actionType}:memory`,
    sourceLabel: preparedAction.sourceLabel,
    providerCalled: finalResult.providerCalled,
    sent: finalResult.sent,
    published: finalResult.published,
    liveExecutionAllowed: finalResult.status === "executed",
  });

  await approvedExecutionDb.unifiedApprovalDecision.create({
    data: {
      tenantId,
      approvalItemId: input.approvalId,
      decision: "approve_execute",
      note: input.note?.trim() || null,
      decidedBy: input.approvedBy ?? "CEO",
      auditEventId: auditId,
      providerCalled: finalResult.providerCalled,
      sent: finalResult.sent,
      published: finalResult.published,
      liveExecutionAllowed: finalResult.status === "executed",
    },
  });

  await approvedExecutionDb.unifiedApprovalItem.update({
    where: { id: input.approvalId },
    data: {
      status: finalResult.status === "executed" ? "executed" : "execution_blocked",
      executionBlockedReason: finalResult.blockedReason ?? "",
      payload: toInputJson({
        preparedAction,
        execution: finalResult,
        businessOutcome: {
          status: finalResult.status === "executed" ? "outcome_pending" : "blocked",
          createdAt: new Date().toISOString(),
          sourceLabel: preparedAction.sourceLabel,
          lessonsLearned:
            finalResult.status === "executed"
              ? "Outcome pending; compare future business result before repeating this action."
              : "Blocked execution should become a tomorrow recommendation until resolved.",
        },
      }),
      providerCalled: finalResult.providerCalled,
      sent: finalResult.sent,
      published: finalResult.published,
      liveExecutionAllowed: finalResult.status === "executed",
    },
  });
    await recordOperatingLoopTraceFailClosed({
      tenantId: approval.tenantId,
    traceId: `approved_execution:${input.approvalId}`,
    sourceStep: "memory",
    targetStep: "business_outcome",
    entityType: "UnifiedApprovalItem",
    entityId: input.approvalId,
    status: finalResult.status === "executed" ? "prepared" : finalResult.status === "failed" ? "failed" : "blocked",
    idempotencyKey: `${input.approvalId}:${preparedAction.actionType}:business-outcome`,
    sourceLabel: preparedAction.sourceLabel,
    providerCalled: finalResult.providerCalled,
    sent: finalResult.sent,
    published: finalResult.published,
    liveExecutionAllowed: finalResult.status === "executed",
  });
    await recordOperatingLoopTraceFailClosed({
      tenantId: approval.tenantId,
    traceId: `approved_execution:${input.approvalId}`,
    sourceStep: "ceo_approval",
    targetStep: "approved_execution",
    entityType: "UnifiedApprovalItem",
    entityId: input.approvalId,
    status: finalResult.status === "executed" ? "completed" : finalResult.status === "failed" ? "failed" : "blocked",
    idempotencyKey: `${input.approvalId}:${preparedAction.actionType}:approved-execution`,
    sourceLabel: preparedAction.sourceLabel,
    providerCalled: finalResult.providerCalled,
    sent: finalResult.sent,
    published: finalResult.published,
    liveExecutionAllowed: finalResult.status === "executed",
    metadata: {
      auditId,
      memoryLogged: memory.logged,
      outcome: finalResult.status,
    },
  });

  return {
    ok: finalResult.status === "executed",
    approvalId: input.approvalId,
    decisionLogged: true,
    auditLogged: Boolean(auditId),
    memoryLogged: memory.logged,
    result: finalResult,
    error: finalResult.status === "executed" ? undefined : finalResult.blockedReason ?? finalResult.message,
  };
}
