import type { Prisma } from "@/generated/prisma";

import { logAiMemoryEvent } from "@/lib/ai-memory-logger";
import { prisma } from "@/lib/prisma";

export const AI_OPTIMIZATION_THRESHOLDS = {
  minimumSampleSize: 10,
  minimumLift: 15,
  minimumConfidence: 0.7,
  maxActiveOverrides: 2,
  expirationDays: 30,
};

type OptimizationEvent = {
  id: string;
  leadId: string | null;
  eventType: string;
  outcome: string | null;
  metadata: Prisma.JsonValue | null;
  createdAt: Date;
};

export type PromotionCandidate = {
  recommendationId: string;
  overrideType: string;
  sampleSize: number;
  responseRate: number;
  conversionRate: number;
  followUpSuccessRate: number;
  lift: number;
  confidenceLevel: number;
  promotable: boolean;
  reason: string;
};

export type ActiveAiStrategy = {
  id: string;
  type: string;
  title: string;
  promotedAt: string;
  expiresAt: string;
  expired: boolean;
  recommendationData: Prisma.JsonValue | null;
};

type PromotedStrategyResult = {
  recommendationId: string;
  promotedAt: string;
  expiresAt: string;
  metrics: PromotionCandidate;
};

type SkippedStrategyResult = PromotionCandidate & {
  skippedReason?: string;
};

type PromotionGovernanceOptions = {
  auditReason: string;
  approvedBy: string;
  dryRunAcknowledged: boolean;
};

function getMetadataObject(metadata: Prisma.JsonValue | null) {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return {} as Record<string, Prisma.JsonValue>;
  }

  return metadata as Record<string, Prisma.JsonValue>;
}

function getMetadataString(event: OptimizationEvent, key: string) {
  const value = getMetadataObject(event.metadata)[key];

  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function percent(count: number, total: number) {
  return total > 0 ? Math.round((count / total) * 100) : 0;
}

function getExpirationDate(promotedAt: Date) {
  return new Date(
    promotedAt.getTime() +
      AI_OPTIMIZATION_THRESHOLDS.expirationDays * 24 * 60 * 60 * 1000,
  );
}

function isPromotionActive(promotedAt: Date | null) {
  return Boolean(promotedAt && getExpirationDate(promotedAt) > new Date());
}

function isConversionEvent(event: OptimizationEvent) {
  return (
    event.eventType === "conversion_event" ||
    event.outcome === "under_contract" ||
    event.outcome === "closed"
  );
}

function isOutcomeEvent(event: OptimizationEvent) {
  return (
    event.eventType === "seller_reply_received" ||
    event.eventType === "deal_status_changed" ||
    event.eventType === "conversion_event" ||
    event.eventType === "follow_up_completed"
  );
}

async function loadOptimizationEvents(limit = 1500): Promise<OptimizationEvent[]> {
  return prisma.aiMemoryEvent.findMany({
    orderBy: {
      createdAt: "asc",
    },
    take: limit,
    select: {
      id: true,
      leadId: true,
      eventType: true,
      outcome: true,
      metadata: true,
      createdAt: true,
    },
  });
}

function getRelatedEvents(overrideEvent: OptimizationEvent, events: OptimizationEvent[]) {
  return events.filter((event) => {
    if (event.id === overrideEvent.id || !isOutcomeEvent(event)) {
      return false;
    }

    if (getMetadataString(event, "relatedOverrideEventId") === overrideEvent.id) {
      return true;
    }

    return (
      Boolean(overrideEvent.leadId) &&
      event.leadId === overrideEvent.leadId &&
      event.createdAt > overrideEvent.createdAt
    );
  });
}

function getBaselineRate(events: OptimizationEvent[], overrideType: string) {
  const firstOverride = events.find(
    (event) =>
      event.eventType === "behavior_override_applied" &&
      getMetadataString(event, "overrideType") === overrideType,
  );
  const baselineEvents = firstOverride
    ? events.filter((event) => event.createdAt < firstOverride.createdAt)
    : events;

  if (overrideType === "follow_up_timing") {
    const followUps = baselineEvents.filter(
      (event) => event.eventType === "follow_up_completed",
    );
    const replies = baselineEvents.filter(
      (event) => event.eventType === "seller_reply_received",
    );

    return percent(replies.length, followUps.length);
  }

  const messagesSent = baselineEvents.filter((event) => event.eventType === "message_sent");
  const replies = baselineEvents.filter(
    (event) => event.eventType === "seller_reply_received",
  );

  return percent(replies.length, messagesSent.length);
}

function getCandidateLift(overrideType: string, candidateRate: {
  responseRate: number;
  conversionRate: number;
  followUpSuccessRate: number;
}, baselineRate: number) {
  const selectedRate =
    overrideType === "follow_up_timing"
      ? candidateRate.followUpSuccessRate
      : Math.max(candidateRate.responseRate, candidateRate.conversionRate);

  return selectedRate - baselineRate;
}

export async function getPromotionCandidates(): Promise<PromotionCandidate[]> {
  const events = await loadOptimizationEvents();
  const overrideEvents = events.filter(
    (event) => event.eventType === "behavior_override_applied",
  );
  const grouped = new Map<string, OptimizationEvent[]>();

  for (const event of overrideEvents) {
    const recommendationId = getMetadataString(event, "recommendationId");
    const overrideType = getMetadataString(event, "overrideType");

    if (!recommendationId || !overrideType) {
      continue;
    }

    const key = `${recommendationId}:${overrideType}`;
    grouped.set(key, [...(grouped.get(key) ?? []), event]);
  }

  return [...grouped.entries()].map(([key, overrides]) => {
    const [recommendationId, overrideType] = key.split(":");
    const responseCount = new Set<string>();
    const conversionCount = new Set<string>();
    const followUpCount = new Set<string>();

    for (const override of overrides) {
      const relatedEvents = getRelatedEvents(override, events);

      if (relatedEvents.some((event) => event.eventType === "seller_reply_received")) {
        responseCount.add(override.id);
      }

      if (relatedEvents.some(isConversionEvent)) {
        conversionCount.add(override.id);
      }

      if (relatedEvents.some((event) => event.eventType === "follow_up_completed")) {
        followUpCount.add(override.id);
      }
    }

    const sampleSize = overrides.length;
    const rates = {
      responseRate: percent(responseCount.size, sampleSize),
      conversionRate: percent(conversionCount.size, sampleSize),
      followUpSuccessRate: percent(followUpCount.size, sampleSize),
    };
    const baselineRate = getBaselineRate(events, overrideType);
    const lift = getCandidateLift(overrideType, rates, baselineRate);
    const confidenceLevel = Math.min(
      1,
      sampleSize / AI_OPTIMIZATION_THRESHOLDS.minimumSampleSize,
    );
    const promotable =
      sampleSize >= AI_OPTIMIZATION_THRESHOLDS.minimumSampleSize &&
      lift >= AI_OPTIMIZATION_THRESHOLDS.minimumLift &&
      confidenceLevel >= AI_OPTIMIZATION_THRESHOLDS.minimumConfidence;

    return {
      recommendationId,
      overrideType,
      sampleSize,
      ...rates,
      lift,
      confidenceLevel,
      promotable,
      reason: promotable
        ? `Sample size ${sampleSize}, lift ${lift}%, confidence ${Math.round(
            confidenceLevel * 100,
          )}%.`
        : `Needs sample size >= ${AI_OPTIMIZATION_THRESHOLDS.minimumSampleSize}, lift >= ${AI_OPTIMIZATION_THRESHOLDS.minimumLift}%, and acceptable confidence.`,
    };
  });
}

export async function getActiveAiStrategies(): Promise<ActiveAiStrategy[]> {
  const recommendations = await prisma.aiLearningRecommendation.findMany({
    where: {
      status: "applied",
      autoPromotable: true,
      promotedAt: {
        not: null,
      },
    },
    orderBy: {
      promotedAt: "desc",
    },
    take: AI_OPTIMIZATION_THRESHOLDS.maxActiveOverrides,
  });

  return recommendations
    .filter((recommendation) => recommendation.promotedAt)
    .map((recommendation) => {
      const promotedAt = recommendation.promotedAt as Date;
      const expiresAt = getExpirationDate(promotedAt);

      return {
        id: recommendation.id,
        type: recommendation.type,
        title: recommendation.title,
        promotedAt: promotedAt.toISOString(),
        expiresAt: expiresAt.toISOString(),
        expired: expiresAt <= new Date(),
        recommendationData: recommendation.recommendationData,
      };
    });
}

async function countActivePromotions() {
  const activeStrategies = await getActiveAiStrategies();

  return activeStrategies.filter((strategy) => !strategy.expired).length;
}

export async function promoteWinningStrategies(governance: PromotionGovernanceOptions) {
  const [candidates, activeCount] = await Promise.all([
    getPromotionCandidates(),
    countActivePromotions(),
  ]);
  const availableSlots = Math.max(
    0,
    AI_OPTIMIZATION_THRESHOLDS.maxActiveOverrides - activeCount,
  );
  const promoted: PromotedStrategyResult[] = [];
  const skipped: SkippedStrategyResult[] = [];

  if (availableSlots === 0) {
    return {
      promoted,
      skipped: candidates.map((candidate) => ({
        ...candidate,
        skippedReason: "Maximum active override limit reached.",
      })),
    };
  }

  const promotableCandidates = candidates
    .filter((candidate) => candidate.promotable)
    .sort((a, b) => b.lift - a.lift || b.sampleSize - a.sampleSize)
    .slice(0, availableSlots);

  for (const candidate of candidates) {
    if (!candidate.promotable) {
      skipped.push(candidate);
    }
  }

  for (const candidate of promotableCandidates) {
    const existing = await prisma.aiLearningRecommendation.findUnique({
      where: {
        id: candidate.recommendationId,
      },
    });

    if (
      !existing ||
      existing.status !== "applied" ||
      !existing.applicationPlan ||
      isPromotionActive(existing.promotedAt)
    ) {
      skipped.push(candidate);
      continue;
    }

    const promotedAt = new Date();
    const updated = await prisma.aiLearningRecommendation.update({
      where: {
        id: existing.id,
      },
      data: {
        autoPromotable: true,
        promotedAt,
      },
    });

    await logAiMemoryEvent({
      eventType: "strategy_promoted",
      source: "ai_optimization_engine",
      outcome: "controlled_strategy_promoted",
      metadata: {
        recommendationId: updated.id,
        recommendationType: updated.type,
        metrics: candidate as unknown as Prisma.InputJsonValue,
        reason: candidate.reason,
        previousPerformance: {
          lift: candidate.lift,
          responseRate: candidate.responseRate,
          conversionRate: candidate.conversionRate,
          followUpSuccessRate: candidate.followUpSuccessRate,
        },
        expiresAt: getExpirationDate(promotedAt).toISOString(),
        humanOverrideAvailable: true,
        governance: {
          auditReason: governance.auditReason,
          approvedBy: governance.approvedBy,
          dryRunAcknowledged: governance.dryRunAcknowledged,
        },
      },
    });

    promoted.push({
      recommendationId: updated.id,
      promotedAt: promotedAt.toISOString(),
      expiresAt: getExpirationDate(promotedAt).toISOString(),
      metrics: candidate,
    });
  }

  return {
    promoted,
    skipped,
  };
}

export async function rollbackPromotedStrategy(
  recommendationId: string,
  reason = "Human rollback requested.",
) {
  const recommendation = await prisma.aiLearningRecommendation.findUnique({
    where: {
      id: recommendationId,
    },
  });

  if (!recommendation) {
    return {
      ok: false as const,
      status: 404,
      error: "AI strategy not found.",
    };
  }

  const updated = await prisma.aiLearningRecommendation.update({
    where: {
      id: recommendationId,
    },
    data: {
      autoPromotable: false,
      promotedAt: null,
    },
  });

  await logAiMemoryEvent({
    eventType: "strategy_rolled_back",
    source: "ai_optimization_engine",
    outcome: "controlled_strategy_rolled_back",
    metadata: {
      recommendationId: updated.id,
      recommendationType: updated.type,
      reason,
      previousPromotedAt: recommendation.promotedAt?.toISOString() ?? null,
      humanOverrideAvailable: true,
    },
  });

  return {
    ok: true as const,
    recommendation: updated,
  };
}
