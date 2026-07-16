import type { Prisma } from "@/generated/prisma";

import { prisma } from "@/lib/prisma";

const tenantId = "default";

export const operatingLoopSteps = [
  "morning_brief",
  "daily_mission",
  "ceo_decision",
  "ai_coo_assignment",
  "department_work_order",
  "draft_workspace",
  "ceo_approval",
  "approved_execution",
  "audit",
  "memory",
  "business_outcome",
  "tomorrow_recommendation",
] as const;

export type OperatingLoopStep = (typeof operatingLoopSteps)[number];

export type OperatingLoopTraceInput = {
  traceId?: string;
  sourceStep: OperatingLoopStep;
  targetStep: OperatingLoopStep;
  entityType: string;
  entityId: string;
  status: "prepared" | "completed" | "blocked" | "failed";
  idempotencyKey?: string;
  sourceLabel: string;
  metadata?: Record<string, unknown>;
  createdAt?: string;
  providerCalled?: boolean;
  sent?: boolean;
  published?: boolean;
  liveExecutionAllowed?: boolean;
};

export type OperatingLoopTraceRecord = {
  traceId: string;
  sourceStep: OperatingLoopStep;
  targetStep: OperatingLoopStep;
  entityType: string;
  entityId: string;
  status: OperatingLoopTraceInput["status"];
  idempotencyKey: string;
  sourceLabel: string;
  createdAt: string;
  providerCalled: boolean;
  sent: boolean;
  published: boolean;
  liveExecutionAllowed: boolean;
};

let operatingLoopTraceDb = prisma;

export function setOperatingLoopTraceDbForTest(testDb: typeof prisma) {
  const previous = operatingLoopTraceDb;
  operatingLoopTraceDb = testDb;

  return () => {
    operatingLoopTraceDb = previous;
  };
}

function stableTraceId(input: OperatingLoopTraceInput) {
  return input.traceId ?? `${input.entityType}:${input.entityId}`;
}

function stableIdempotencyKey(input: OperatingLoopTraceInput) {
  return input.idempotencyKey ?? `${stableTraceId(input)}:${input.sourceStep}->${input.targetStep}:${input.status}`;
}

function toJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

export async function recordOperatingLoopTrace(input: OperatingLoopTraceInput): Promise<OperatingLoopTraceRecord> {
  const createdAt = input.createdAt ?? new Date().toISOString();
  const trace: OperatingLoopTraceRecord = {
    traceId: stableTraceId(input),
    sourceStep: input.sourceStep,
    targetStep: input.targetStep,
    entityType: input.entityType,
    entityId: input.entityId,
    status: input.status,
    idempotencyKey: stableIdempotencyKey(input),
    sourceLabel: input.sourceLabel,
    createdAt,
    providerCalled: input.providerCalled ?? false,
    sent: input.sent ?? false,
    published: input.published ?? false,
    liveExecutionAllowed: input.liveExecutionAllowed ?? false,
  };

  await operatingLoopTraceDb.revenueAuditEvent.create({
    data: {
      tenantId,
      actorId: "ai-coo",
      action: `operating_loop.${trace.sourceStep}.${trace.targetStep}`,
      targetType: trace.entityType,
      targetId: trace.entityId,
      requestId: trace.idempotencyKey,
      source: trace.sourceLabel,
      result: trace.status,
      safeMetadata: toJson({
        ...trace,
        safetyFlags: {
          providerCalled: trace.providerCalled,
          sent: trace.sent,
          published: trace.published,
          liveExecutionAllowed: trace.liveExecutionAllowed,
        },
        ...(input.metadata ?? {}),
      }),
    },
    select: { id: true },
  });

  return trace;
}

export async function recordOperatingLoopTraceFailClosed(input: OperatingLoopTraceInput) {
  try {
    return await recordOperatingLoopTrace(input);
  } catch (error) {
    console.error("Operating loop trace failed closed:", error);

    return null;
  }
}
