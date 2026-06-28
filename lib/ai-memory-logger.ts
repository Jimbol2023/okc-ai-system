import type { Prisma } from "@/generated/prisma";

import { prisma } from "@/lib/prisma";

export type AiMemoryLoggerInput = Readonly<Record<string, unknown>>;

type AiMemoryLoggerSuccessResult = Readonly<{
  logged: true;
  mode: "prisma";
  eventId: string;
}>;

type AiMemoryLoggerFailureResult = Readonly<{
  logged: false;
  mode: "fail_closed";
  reason: string;
}>;

export type AiMemoryLoggerResult =
  | AiMemoryLoggerSuccessResult
  | AiMemoryLoggerFailureResult;

const TEXT_FIELD_LIMIT = 2_000;
const METADATA_STRING_LIMIT = 500;
const METADATA_DEPTH_LIMIT = 4;
const BLOCKED_METADATA_KEY_PATTERN =
  /secret|token|password|credential|authorization|api[_-]?key|cookie|session/i;

function cleanString(value: unknown, limit = TEXT_FIELD_LIMIT) {
  if (typeof value !== "string") return null;

  const cleaned = value.trim();

  return cleaned ? cleaned.slice(0, limit) : null;
}

function cleanNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function cleanMetadataValue(value: unknown, depth = 0): Prisma.InputJsonValue | undefined {
  if (depth > METADATA_DEPTH_LIMIT) return undefined;

  if (value === null) return undefined;

  if (typeof value === "boolean") return value;

  if (typeof value === "string") {
    return value.trim().slice(0, METADATA_STRING_LIMIT);
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : undefined;
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => cleanMetadataValue(item, depth + 1))
      .filter((item): item is Prisma.InputJsonValue => item !== undefined)
      .slice(0, 25);
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([key]) => !BLOCKED_METADATA_KEY_PATTERN.test(key))
      .map(([key, item]) => [key, cleanMetadataValue(item, depth + 1)] as const)
      .filter((entry): entry is readonly [string, Prisma.InputJsonValue] => entry[1] !== undefined)
      .slice(0, 40);

    return Object.fromEntries(entries) as Prisma.InputJsonObject;
  }

  return undefined;
}

export function sanitizeAiMemoryPayload(payload: AiMemoryLoggerInput) {
  const eventType = cleanString(payload.eventType, 120);
  const source = cleanString(payload.source, 120) ?? "internal_learning";
  const metadata = cleanMetadataValue(payload.metadata);

  return {
    leadId: cleanString(payload.leadId, 120),
    jobId: cleanString(payload.jobId, 120),
    actionId: cleanString(payload.actionId, 120),
    eventType,
    source,
    sellerReply: cleanString(payload.sellerReply),
    aiSuggestedReply: cleanString(payload.aiSuggestedReply),
    humanFinalReply: cleanString(payload.humanFinalReply),
    approvalDecision: cleanString(payload.approvalDecision, 120),
    messageChannel: cleanString(payload.messageChannel, 120),
    messageStatus: cleanString(payload.messageStatus, 120),
    sellerIntent: cleanString(payload.sellerIntent, 120),
    sellerSentiment: cleanString(payload.sellerSentiment, 120),
    confidence: cleanNumber(payload.confidence),
    outcome: cleanString(payload.outcome, 120),
    metadata: metadata === undefined ? undefined : metadata,
  };
}

async function persistMemoryEvent(
  payload: AiMemoryLoggerInput,
  fallbackEventType: string,
): Promise<AiMemoryLoggerResult> {
  try {
    const sanitized = sanitizeAiMemoryPayload({
      ...payload,
      eventType: cleanString(payload.eventType, 120) ?? fallbackEventType,
    });

    if (!sanitized.eventType) {
      return {
        logged: false,
        mode: "fail_closed",
        reason: "missing_event_type",
      };
    }

    const event = await prisma.aiMemoryEvent.create({
      data: {
        ...sanitized,
        eventType: sanitized.eventType,
        source: sanitized.source,
      },
      select: {
        id: true,
      },
    });

    return {
      logged: true,
      mode: "prisma",
      eventId: event.id,
    };
  } catch (error) {
    console.error("AI memory logging failed closed:", error);

    return {
      logged: false,
      mode: "fail_closed",
      reason: "prisma_write_failed",
    };
  }
}

export async function logApprovalDecisionMemory(
  payload: AiMemoryLoggerInput,
): Promise<AiMemoryLoggerResult> {
  const decision = cleanString(payload.approvalDecision, 120);

  return persistMemoryEvent(
    {
      ...payload,
      eventType:
        cleanString(payload.eventType, 120) ??
        (decision === "approved"
          ? "reply_approved"
          : decision === "rejected"
            ? "reply_rejected"
            : "approval_status_changed"),
    },
    "approval_status_changed",
  );
}

export async function logDealOutcomeMemory(
  payload: AiMemoryLoggerInput,
): Promise<AiMemoryLoggerResult> {
  const outcome = cleanString(payload.outcome, 120);

  return persistMemoryEvent(
    {
      ...payload,
      eventType:
        cleanString(payload.eventType, 120) ??
        (outcome === "closed" || outcome === "under_contract"
          ? "conversion_event"
          : "deal_status_changed"),
    },
    "deal_status_changed",
  );
}

export async function logAiMemoryEvent(
  payload: AiMemoryLoggerInput,
): Promise<AiMemoryLoggerResult> {
  return persistMemoryEvent(payload, "internal_learning_event");
}
