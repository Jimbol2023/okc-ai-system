import type { Prisma } from "@/generated/prisma";

import { prisma } from "@/lib/prisma";

type ImpactEvent = {
  id: string;
  leadId: string | null;
  eventType: string;
  outcome: string | null;
  metadata: Prisma.JsonValue | null;
  createdAt: Date;
};

type RateMetric = {
  count: number;
  total: number;
  rate: number;
};

type OverrideTypePerformance = {
  totalOverrides: number;
  responseRate: RateMetric;
  conversionRate: RateMetric;
  followUpSuccessRate: RateMetric;
  winningStrategies: string[];
};

function emptyRate(): RateMetric {
  return {
    count: 0,
    total: 0,
    rate: 0,
  };
}

function percent(count: number, total: number) {
  return total > 0 ? Math.round((count / total) * 100) : 0;
}

function toRate(count: number, total: number): RateMetric {
  return {
    count,
    total,
    rate: percent(count, total),
  };
}

function getMetadataObject(metadata: Prisma.JsonValue | null) {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return {} as Record<string, Prisma.JsonValue>;
  }

  return metadata as Record<string, Prisma.JsonValue>;
}

function getMetadataString(event: ImpactEvent, key: string) {
  const value = getMetadataObject(event.metadata)[key];

  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function isConversionEvent(event: ImpactEvent) {
  return (
    event.eventType === "conversion_event" ||
    event.outcome === "under_contract" ||
    event.outcome === "closed"
  );
}

function isOutcomeEvent(event: ImpactEvent) {
  return (
    event.eventType === "seller_reply_received" ||
    event.eventType === "deal_status_changed" ||
    event.eventType === "conversion_event" ||
    event.eventType === "follow_up_completed"
  );
}

async function loadImpactEvents(limit = 1000): Promise<ImpactEvent[]> {
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

function getRelatedEvents(overrideEvent: ImpactEvent, events: ImpactEvent[]) {
  return events.filter((event) => {
    if (event.id === overrideEvent.id || !isOutcomeEvent(event)) {
      return false;
    }

    const linkedOverrideId = getMetadataString(event, "relatedOverrideEventId");

    if (linkedOverrideId === overrideEvent.id) {
      return true;
    }

    return (
      Boolean(overrideEvent.leadId) &&
      event.leadId === overrideEvent.leadId &&
      event.createdAt > overrideEvent.createdAt
    );
  });
}

function buildTypePerformance(
  overrideType: string,
  overrides: ImpactEvent[],
  events: ImpactEvent[],
): OverrideTypePerformance {
  const responseOverrideIds = new Set<string>();
  const conversionOverrideIds = new Set<string>();
  const followUpOverrideIds = new Set<string>();
  const strategyStats = new Map<string, { wins: number; total: number }>();

  for (const override of overrides) {
    const relatedEvents = getRelatedEvents(override, events);
    const strategy =
      getMetadataString(override, "newValue") ??
      getMetadataString(override, "overrideType") ??
      overrideType;
    const strategyBucket = strategyStats.get(strategy) ?? { wins: 0, total: 0 };

    strategyBucket.total += 1;

    if (relatedEvents.some((event) => event.eventType === "seller_reply_received")) {
      responseOverrideIds.add(override.id);
      strategyBucket.wins += 1;
    }

    if (relatedEvents.some(isConversionEvent)) {
      conversionOverrideIds.add(override.id);
    }

    if (relatedEvents.some((event) => event.eventType === "follow_up_completed")) {
      followUpOverrideIds.add(override.id);
    }

    strategyStats.set(strategy, strategyBucket);
  }

  const winningStrategies = [...strategyStats.entries()]
    .filter(([, stats]) => stats.total > 0)
    .sort((a, b) => percent(b[1].wins, b[1].total) - percent(a[1].wins, a[1].total))
    .slice(0, 3)
    .map(([strategy, stats]) => `${strategy} (${percent(stats.wins, stats.total)}%)`);

  return {
    totalOverrides: overrides.length,
    responseRate: toRate(responseOverrideIds.size, overrides.length),
    conversionRate: toRate(conversionOverrideIds.size, overrides.length),
    followUpSuccessRate: toRate(followUpOverrideIds.size, overrides.length),
    winningStrategies,
  };
}

function emptyPerformance(): OverrideTypePerformance {
  return {
    totalOverrides: 0,
    responseRate: emptyRate(),
    conversionRate: emptyRate(),
    followUpSuccessRate: emptyRate(),
    winningStrategies: [],
  };
}

export async function analyzeOverridePerformance() {
  const events = await loadImpactEvents();
  const overrideEvents = events.filter(
    (event) => event.eventType === "behavior_override_applied",
  );
  const replyStyleOverrides = overrideEvents.filter(
    (event) => getMetadataString(event, "overrideType") === "reply_style",
  );
  const followUpTimingOverrides = overrideEvents.filter(
    (event) => getMetadataString(event, "overrideType") === "follow_up_timing",
  );

  return {
    replyStyle:
      replyStyleOverrides.length > 0
        ? buildTypePerformance("reply_style", replyStyleOverrides, events)
        : emptyPerformance(),
    followUpTiming:
      followUpTimingOverrides.length > 0
        ? buildTypePerformance("follow_up_timing", followUpTimingOverrides, events)
        : emptyPerformance(),
  };
}

function getBaselineRates(events: ImpactEvent[], beforeDate: Date | null) {
  const baselineEvents = beforeDate
    ? events.filter((event) => event.createdAt < beforeDate)
    : events;
  const messagesSent = baselineEvents.filter((event) => event.eventType === "message_sent");
  const sellerReplies = baselineEvents.filter(
    (event) => event.eventType === "seller_reply_received",
  );
  const outcomeEvents = baselineEvents.filter(
    (event) =>
      event.eventType === "deal_status_changed" ||
      event.eventType === "conversion_event",
  );
  const conversions = outcomeEvents.filter(isConversionEvent);
  const followUps = baselineEvents.filter(
    (event) => event.eventType === "follow_up_completed",
  );

  return {
    responseRate: toRate(sellerReplies.length, messagesSent.length),
    conversionRate: toRate(conversions.length, outcomeEvents.length),
    followUpSuccessRate: toRate(sellerReplies.length, followUps.length),
  };
}

export async function compareBeforeAfterMetrics() {
  const events = await loadImpactEvents();
  const overrideEvents = events.filter(
    (event) => event.eventType === "behavior_override_applied",
  );
  const firstOverrideDate = overrideEvents[0]?.createdAt ?? null;
  const before = getBaselineRates(events, firstOverrideDate);
  const overridePerformance = await analyzeOverridePerformance();

  const totalResponses =
    overridePerformance.replyStyle.responseRate.count +
    overridePerformance.followUpTiming.responseRate.count;
  const totalOverrides =
    overridePerformance.replyStyle.totalOverrides +
    overridePerformance.followUpTiming.totalOverrides;
  const totalConversions =
    overridePerformance.replyStyle.conversionRate.count +
    overridePerformance.followUpTiming.conversionRate.count;
  const totalFollowUps =
    overridePerformance.replyStyle.followUpSuccessRate.count +
    overridePerformance.followUpTiming.followUpSuccessRate.count;

  const after = {
    responseRate: toRate(totalResponses, totalOverrides),
    conversionRate: toRate(totalConversions, totalOverrides),
    followUpSuccessRate: toRate(totalFollowUps, totalOverrides),
  };

  return {
    before,
    after,
    responseLift: after.responseRate.rate - before.responseRate.rate,
    conversionLift: after.conversionRate.rate - before.conversionRate.rate,
    followUpLift: after.followUpSuccessRate.rate - before.followUpSuccessRate.rate,
  };
}
