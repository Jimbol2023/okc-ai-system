import type { Prisma } from "@/generated/prisma";

import { logAiMemoryEvent, type AiMemoryLoggerResult } from "@/lib/ai-memory-logger";
import { prisma } from "@/lib/prisma";

const tenantId = "default";
const confirmationPhrase = "CREATE_PREVIEW_DRIVE_DRAFT";

export type GoogleDriveDraftPilotAction = "create_drive_doc_draft";
export type GoogleDriveDraftPilotStatus =
  | "executed"
  | "blocked"
  | "provider_failed"
  | "failed_after_provider_write";

export type GoogleDriveDraftPilotInput = {
  actionType: GoogleDriveDraftPilotAction;
  title: string;
  body: string;
  sourceLabel: string;
  approvedBy?: string;
  confirmation: typeof confirmationPhrase;
};

export type GoogleDriveDraftPilotResult = {
  ok: boolean;
  status: GoogleDriveDraftPilotStatus;
  actionType: GoogleDriveDraftPilotAction;
  connector: "google_drive";
  environmentTarget: "preview_only";
  providerCalled: boolean;
  liveExecutionAllowed: boolean;
  driveDocumentCreated: boolean;
  externalReference: string | null;
  webViewLink: string | null;
  auditLogged: boolean;
  memoryLogged: boolean;
  blockedReason: string | null;
  message: string;
  safety: {
    exactActionOnly: true;
    previewOnly: true;
    productionBlocked: true;
    killSwitchRequired: true;
    ceoConfirmationRequired: true;
    sent: false;
    published: false;
    scheduled: false;
  };
};

type AuditCreateInput = {
  data: Record<string, unknown>;
  select?: Record<string, boolean>;
};

type PilotDb = {
  revenueAuditEvent: {
    create(args: AuditCreateInput): Promise<Record<string, unknown>>;
  };
};

type PilotServices = {
  env?: NodeJS.ProcessEnv;
  fetch?: typeof fetch;
  db?: PilotDb;
  memoryLogger?: typeof logAiMemoryEvent;
};

function cleanText(value: string, fallback: string, maxLength: number) {
  const cleaned = value.trim().replace(/\s+/g, " ");

  return (cleaned || fallback).slice(0, maxLength);
}

function toJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

function blockedResult(reason: string): GoogleDriveDraftPilotResult {
  return {
    ok: false,
    status: "blocked",
    actionType: "create_drive_doc_draft",
    connector: "google_drive",
    environmentTarget: "preview_only",
    providerCalled: false,
    liveExecutionAllowed: false,
    driveDocumentCreated: false,
    externalReference: null,
    webViewLink: null,
    auditLogged: false,
    memoryLogged: false,
    blockedReason: reason,
    message: "Google Drive draft pilot blocked before provider call.",
    safety: safetyFlags(),
  };
}

function safetyFlags(): GoogleDriveDraftPilotResult["safety"] {
  return {
    exactActionOnly: true,
    previewOnly: true,
    productionBlocked: true,
    killSwitchRequired: true,
    ceoConfirmationRequired: true,
    sent: false,
    published: false,
    scheduled: false,
  };
}

function validatePilotInput(input: GoogleDriveDraftPilotInput, env: NodeJS.ProcessEnv) {
  if (input.actionType !== "create_drive_doc_draft") return "Only create_drive_doc_draft is allowed for this pilot.";
  if (input.confirmation !== confirmationPhrase) return `CEO confirmation phrase must be ${confirmationPhrase}.`;
  if (env.NODE_ENV === "production" || env.VERCEL_ENV === "production") return "Production is blocked for Google Drive draft pilot.";
  if (env.VERCEL_ENV !== "preview") return "Google Drive draft pilot can run only in Vercel Preview.";
  if (env.GOOGLE_DRIVE_DRAFT_PILOT_ENABLED !== "true") return "GOOGLE_DRIVE_DRAFT_PILOT_ENABLED is not true.";
  if (!env.GOOGLE_DRIVE_TEST_FOLDER_ID?.trim()) return "GOOGLE_DRIVE_TEST_FOLDER_ID is missing.";
  if (!env.GOOGLE_OAUTH_CLIENT_ID?.trim()) return "GOOGLE_OAUTH_CLIENT_ID is missing.";
  if (!env.GOOGLE_OAUTH_CLIENT_SECRET?.trim()) return "GOOGLE_OAUTH_CLIENT_SECRET is missing.";
  if (!env.GOOGLE_OAUTH_REFRESH_TOKEN?.trim()) return "GOOGLE_OAUTH_REFRESH_TOKEN is missing.";

  return null;
}

async function logAudit(
  db: PilotDb,
  input: GoogleDriveDraftPilotInput,
  result: string,
  metadata: Record<string, unknown>,
) {
  const audit = await db.revenueAuditEvent.create({
    data: {
      tenantId,
      actorId: input.approvedBy ?? "CEO",
      action: "provider_pilot.google_drive.create_drive_doc_draft",
      targetType: "GoogleDriveDraftPilot",
      targetId: input.sourceLabel,
      requestId: `google-drive-draft-pilot:${input.sourceLabel}`,
      source: input.sourceLabel,
      result,
      safeMetadata: toJson({
        actionType: input.actionType,
        connector: "google_drive",
        environmentTarget: "preview_only",
        providerCalled: metadata.providerCalled ?? false,
        liveExecutionAllowed: metadata.liveExecutionAllowed ?? false,
        driveDocumentCreated: metadata.driveDocumentCreated ?? false,
        externalReference: metadata.externalReference ?? null,
        webViewLink: metadata.webViewLink ?? null,
        blockedReason: metadata.blockedReason ?? null,
      }),
    },
    select: { id: true },
  });

  return typeof audit.id === "string" ? audit.id : null;
}

async function getAccessToken(env: NodeJS.ProcessEnv, fetchImpl: typeof fetch) {
  const response = await fetchImpl("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: env.GOOGLE_OAUTH_CLIENT_ID ?? "",
      client_secret: env.GOOGLE_OAUTH_CLIENT_SECRET ?? "",
      refresh_token: env.GOOGLE_OAUTH_REFRESH_TOKEN ?? "",
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) throw new Error(`Google OAuth token exchange failed with ${response.status}.`);

  const data = (await response.json()) as { access_token?: string };
  if (!data.access_token) throw new Error("Google OAuth token response did not include an access token.");

  return data.access_token;
}

async function createDriveDraftDocument(
  input: GoogleDriveDraftPilotInput,
  env: NodeJS.ProcessEnv,
  fetchImpl: typeof fetch,
) {
  const accessToken = await getAccessToken(env, fetchImpl);
  const boundary = `jcapital_drive_pilot_${Date.now()}`;
  const title = cleanText(input.title, "J Capital AI OS Preview Pilot Document", 160);
  const body = cleanText(input.body, "Preview-only Google Drive draft pilot document.", 4000);
  const multipartBody = [
    `--${boundary}`,
    "Content-Type: application/json; charset=UTF-8",
    "",
    JSON.stringify({
      name: title,
      mimeType: "application/vnd.google-apps.document",
      parents: [env.GOOGLE_DRIVE_TEST_FOLDER_ID],
    }),
    `--${boundary}`,
    "Content-Type: text/plain; charset=UTF-8",
    "",
    body,
    `--${boundary}--`,
  ].join("\r\n");

  const response = await fetchImpl("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink", {
    method: "POST",
    headers: {
      authorization: `Bearer ${accessToken}`,
      "content-type": `multipart/related; boundary=${boundary}`,
    },
    body: multipartBody,
  });

  if (!response.ok) throw new Error(`Google Drive draft document creation failed with ${response.status}.`);

  return (await response.json()) as { id?: string; webViewLink?: string };
}

export async function executeGoogleDriveDraftPilot(
  input: GoogleDriveDraftPilotInput,
  services: PilotServices = {},
): Promise<GoogleDriveDraftPilotResult> {
  const env = services.env ?? process.env;
  const db = services.db ?? (prisma as unknown as PilotDb);
  const fetchImpl = services.fetch ?? fetch;
  const memoryLogger = services.memoryLogger ?? logAiMemoryEvent;
  const blockedReason = validatePilotInput(input, env);

  if (blockedReason) return blockedResult(blockedReason);

  let auditLogged = false;

  try {
    await logAudit(db, input, "preflight_approved", {
      providerCalled: false,
      liveExecutionAllowed: true,
      driveDocumentCreated: false,
    });
    auditLogged = true;
  } catch {
    return {
      ...blockedResult("Preflight audit write failed."),
      status: "blocked",
      message: "Google Drive draft pilot blocked because preflight audit failed.",
    };
  }

  try {
    const document = await createDriveDraftDocument(input, env, fetchImpl);
    const externalReference = document.id ?? null;
    const webViewLink = document.webViewLink ?? null;
    await logAudit(db, input, "executed", {
      providerCalled: true,
      liveExecutionAllowed: true,
      driveDocumentCreated: true,
      externalReference,
      webViewLink,
    });
    const memory: AiMemoryLoggerResult = await memoryLogger({
      actionId: input.sourceLabel,
      eventType: "google_drive_draft_pilot_outcome",
      source: "provider_execution_pilot",
      approvalDecision: "approved_preview_drive_draft_pilot",
      messageChannel: "google_drive",
      messageStatus: "executed",
      outcome: "drive_draft_document_created",
      metadata: {
        connector: "google_drive",
        actionType: input.actionType,
        sourceLabel: input.sourceLabel,
        externalReference,
        webViewLink,
        providerCalled: true,
        liveExecutionAllowed: true,
        productionBlocked: true,
      },
    });

    return {
      ok: memory.logged,
      status: memory.logged ? "executed" : "failed_after_provider_write",
      actionType: "create_drive_doc_draft",
      connector: "google_drive",
      environmentTarget: "preview_only",
      providerCalled: true,
      liveExecutionAllowed: true,
      driveDocumentCreated: true,
      externalReference,
      webViewLink,
      auditLogged,
      memoryLogged: memory.logged,
      blockedReason: memory.logged ? null : `Memory write failed after provider write: ${memory.reason}`,
      message: memory.logged
        ? "One Preview-only Google Drive draft test document was created."
        : "Google Drive draft document was created, but memory logging failed and requires manual review.",
      safety: safetyFlags(),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Google Drive draft pilot provider call failed.";
    await logAudit(db, input, "provider_failed", {
      providerCalled: true,
      liveExecutionAllowed: true,
      driveDocumentCreated: false,
      blockedReason: message,
    }).catch(() => null);

    return {
      ok: false,
      status: "provider_failed",
      actionType: "create_drive_doc_draft",
      connector: "google_drive",
      environmentTarget: "preview_only",
      providerCalled: true,
      liveExecutionAllowed: true,
      driveDocumentCreated: false,
      externalReference: null,
      webViewLink: null,
      auditLogged,
      memoryLogged: false,
      blockedReason: message,
      message: "Google Drive draft pilot provider call failed.",
      safety: safetyFlags(),
    };
  }
}

export { confirmationPhrase as googleDriveDraftPilotConfirmationPhrase };
