import type { Prisma } from "@/generated/prisma";

import { prisma } from "@/lib/prisma";

type MemoryEvent = {
  leadId: string | null;
  eventType: string;
  aiSuggestedReply: string | null;
  humanFinalReply: string | null;
  sellerReply: string | null;
  approvalDecision: string | null;
  messageStatus: string | null;
  outcome: string | null;
  metadata: Prisma.JsonValue | null;
  createdAt: Date;
};

type CountedInsight = {
  label: string;
  count: number;
  rate?: number;
  summary: string;
};

export type AiLearningInsights = {
  bestPerformingReplyStyle: CountedInsight;
  worstPerformingReplyStyle: CountedInsight;
  highConversionLeadProfile: CountedInsight;
  lowConversionLeadProfile: CountedInsight;
  recommendedFollowUpTiming: CountedInsight;
  approvalBiasInsights: CountedInsight[];
  messagePerformance: CountedInsight[];
  generatedAt: string;
};

type StyleStats = {
  suggested: number;
  approved: number;
  rejected: number;
  sent: number;
  responses: number;
};

function emptyInsight(label: string, summary: string): CountedInsight {
  return {
    label,
    count: 0,
    rate: 0,
    summary,
  };
}

function percent(numerator: number, denominator: number) {
  return denominator > 0 ? Math.round((numerator / denominator) * 100) : 0;
}

function getMetadataObject(metadata: Prisma.JsonValue | null) {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return {};
  }

  return metadata as Record<string, Prisma.JsonValue>;
}

function getMetadataString(event: MemoryEvent, key: string) {
  const value = getMetadataObject(event.metadata)[key];

  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function getMetadataNumber(event: MemoryEvent, key: string) {
  const value = getMetadataObject(event.metadata)[key];

  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function getMetadataBoolean(event: MemoryEvent, key: string) {
  const value = getMetadataObject(event.metadata)[key];

  return typeof value === "boolean" ? value : null;
}

function getMessageText(event: MemoryEvent) {
  return (
    event.humanFinalReply?.trim() ||
    event.aiSuggestedReply?.trim() ||
    event.sellerReply?.trim() ||
    ""
  );
}

function classifyReplyStyle(message: string | null | undefined) {
  const text = message?.toLowerCase() ?? "";

  if (!text.trim()) {
    return "unknown";
  }

  if (/\b(cash|offer|price|pay|number|amount|buy)\b/.test(text)) {
    return "offer_or_price";
  }

  if (/\b(call|talk|schedule|appointment|time|meet)\b/.test(text)) {
    return "appointment_request";
  }

  if (/\?/.test(text) || /\b(when|what|why|how|would|could|are you)\b/.test(text)) {
    return "question_led";
  }

  if (/\b(thanks|understand|sorry|appreciate|happy to help)\b/.test(text)) {
    return "empathetic";
  }

  if (/\b(follow up|checking in|circle back|wanted to see)\b/.test(text)) {
    return "follow_up";
  }

  return "general";
}

function scoreBucket(value: number | null) {
  if (value === null) {
    return "score_unknown";
  }

  if (value >= 70) {
    return "score_high";
  }

  if (value >= 35) {
    return "score_medium";
  }

  return "score_low";
}

function getStyleStats(events: MemoryEvent[]) {
  const stats = new Map<string, StyleStats>();

  function get(style: string) {
    const existing = stats.get(style);

    if (existing) {
      return existing;
    }

    const created = {
      suggested: 0,
      approved: 0,
      rejected: 0,
      sent: 0,
      responses: 0,
    };

    stats.set(style, created);
    return created;
  }

  const replyLeadIds = new Set(
    events
      .filter((event) => event.eventType === "seller_reply_received" && event.leadId)
      .map((event) => event.leadId),
  );

  events.forEach((event) => {
    const style = classifyReplyStyle(getMessageText(event));
    const bucket = get(style);

    if (event.eventType === "ai_reply_suggested") {
      bucket.suggested += 1;
    }

    if (event.eventType === "reply_approved") {
      bucket.approved += 1;
    }

    if (event.eventType === "reply_rejected") {
      bucket.rejected += 1;
    }

    if (event.eventType === "message_sent") {
      bucket.sent += 1;

      if (event.leadId && replyLeadIds.has(event.leadId)) {
        bucket.responses += 1;
      }
    }
  });

  return stats;
}

function pickBestApprovalStyle(stats: Map<string, StyleStats>) {
  const ranked = [...stats.entries()]
    .filter(([, stat]) => stat.approved + stat.rejected > 0)
    .sort((a, b) => {
      const aRate = percent(a[1].approved, a[1].approved + a[1].rejected);
      const bRate = percent(b[1].approved, b[1].approved + b[1].rejected);

      return bRate - aRate || b[1].approved - a[1].approved;
    });

  const [label, stat] = ranked[0] ?? [];

  if (!label || !stat) {
    return emptyInsight(
      "not_enough_data",
      "Not enough approval history yet to identify a best-performing reply style.",
    );
  }

  const total = stat.approved + stat.rejected;

  return {
    label,
    count: stat.approved,
    rate: percent(stat.approved, total),
    summary: `${label} replies have the strongest approval pattern so far.`,
  };
}

function pickWorstApprovalStyle(stats: Map<string, StyleStats>) {
  const ranked = [...stats.entries()]
    .filter(([, stat]) => stat.approved + stat.rejected > 0)
    .sort((a, b) => {
      const aRate = percent(a[1].rejected, a[1].approved + a[1].rejected);
      const bRate = percent(b[1].rejected, b[1].approved + b[1].rejected);

      return bRate - aRate || b[1].rejected - a[1].rejected;
    });

  const [label, stat] = ranked[0] ?? [];

  if (!label || !stat) {
    return emptyInsight(
      "not_enough_data",
      "Not enough rejection history yet to identify a weak reply style.",
    );
  }

  const total = stat.approved + stat.rejected;

  return {
    label,
    count: stat.rejected,
    rate: percent(stat.rejected, total),
    summary: `${label} replies are rejected most often in current memory data.`,
  };
}

export async function analyzeSellerResponses() {
  const events = await loadLearningEvents();
  const stats = getStyleStats(events);

  return [...stats.entries()]
    .filter(([, stat]) => stat.sent > 0)
    .map(([label, stat]) => ({
      label,
      count: stat.responses,
      rate: percent(stat.responses, stat.sent),
      summary: `${stat.responses} response(s) after ${stat.sent} sent ${label} message(s).`,
    }))
    .sort((a, b) => (b.rate ?? 0) - (a.rate ?? 0) || b.count - a.count)
    .slice(0, 5);
}

export async function analyzeApprovalPatterns() {
  const events = await loadLearningEvents();
  const stats = getStyleStats(events);

  return {
    bestPerformingReplyStyle: pickBestApprovalStyle(stats),
    worstPerformingReplyStyle: pickWorstApprovalStyle(stats),
    approvalBiasInsights: [...stats.entries()]
      .filter(([, stat]) => stat.approved + stat.rejected > 0)
      .map(([label, stat]) => ({
        label,
        count: stat.approved + stat.rejected,
        rate: percent(stat.approved, stat.approved + stat.rejected),
        summary: `${label} replies were approved ${stat.approved} time(s) and rejected ${stat.rejected} time(s).`,
      }))
      .sort((a, b) => (b.rate ?? 0) - (a.rate ?? 0) || b.count - a.count)
      .slice(0, 5),
  };
}

export async function analyzeMessagePerformance() {
  return analyzeSellerResponses();
}

export async function analyzeFollowUpTiming() {
  const events = await loadLearningEvents();
  const responseFollowUps = events
    .filter((event) => event.eventType === "seller_reply_received")
    .map((event) => getMetadataNumber(event, "followUpCount"))
    .filter((value): value is number => value !== null);

  if (responseFollowUps.length === 0) {
    return emptyInsight(
      "not_enough_data",
      "Not enough seller response memory yet to recommend follow-up timing.",
    );
  }

  const average =
    responseFollowUps.reduce((sum, value) => sum + value, 0) /
    responseFollowUps.length;
  const roundedAverage = Math.round(average);

  return {
    label: `${roundedAverage}_follow_ups`,
    count: responseFollowUps.length,
    rate: roundedAverage,
    summary: `Seller responses are currently associated with about ${roundedAverage} completed follow-up(s).`,
  };
}

async function loadLearningEvents(limit = 500): Promise<MemoryEvent[]> {
  return prisma.aiMemoryEvent.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    select: {
      leadId: true,
      eventType: true,
      aiSuggestedReply: true,
      humanFinalReply: true,
      sellerReply: true,
      approvalDecision: true,
      messageStatus: true,
      outcome: true,
      metadata: true,
      createdAt: true,
    },
  });
}

function getConversionProfiles(events: MemoryEvent[]) {
  const profileStats = new Map<string, { converted: number; total: number }>();

  function addProfile(label: string, converted: boolean) {
    const existing = profileStats.get(label) ?? {
      converted: 0,
      total: 0,
    };

    existing.total += 1;

    if (converted) {
      existing.converted += 1;
    }

    profileStats.set(label, existing);
  }

  events
    .filter(
      (event) =>
        event.eventType === "deal_status_changed" ||
        event.eventType === "conversion_event",
    )
    .forEach((event) => {
      const converted =
        event.eventType === "conversion_event" ||
        event.outcome === "under_contract" ||
        event.outcome === "closed";
      const score = scoreBucket(getMetadataNumber(event, "leadScore"));
      const status = getMetadataString(event, "pipelineStatus") ?? "status_unknown";
      const hot = getMetadataBoolean(event, "isHot") === true ? "hot" : "not_hot";
      const automation =
        getMetadataString(event, "automationStatus") ?? "automation_unknown";

      addProfile(`${score} / ${status}`, converted);
      addProfile(`${hot} / ${automation}`, converted);
    });

  const ranked = [...profileStats.entries()].sort((a, b) => {
    const aRate = percent(a[1].converted, a[1].total);
    const bRate = percent(b[1].converted, b[1].total);

    return bRate - aRate || b[1].converted - a[1].converted;
  });

  const best = ranked[0];
  const worst = [...ranked].reverse()[0];

  return {
    highConversionLeadProfile: best
      ? {
          label: best[0],
          count: best[1].converted,
          rate: percent(best[1].converted, best[1].total),
          summary: `${best[0]} has the strongest conversion signal in memory data.`,
        }
      : emptyInsight(
          "not_enough_data",
          "Not enough outcome memory yet to identify a high-conversion lead profile.",
        ),
    lowConversionLeadProfile: worst
      ? {
          label: worst[0],
          count: worst[1].total - worst[1].converted,
          rate: percent(worst[1].converted, worst[1].total),
          summary: `${worst[0]} has the weakest conversion signal in memory data.`,
        }
      : emptyInsight(
          "not_enough_data",
          "Not enough outcome memory yet to identify a low-conversion lead profile.",
        ),
  };
}

export async function generateAiLearningInsights(): Promise<AiLearningInsights> {
  const events = await loadLearningEvents();
  const stats = getStyleStats(events);
  const conversionProfiles = getConversionProfiles(events);
  const recommendedFollowUpTiming = await analyzeFollowUpTiming();

  const messagePerformance = [...stats.entries()]
    .filter(([, stat]) => stat.sent > 0)
    .map(([label, stat]) => ({
      label,
      count: stat.responses,
      rate: percent(stat.responses, stat.sent),
      summary: `${stat.responses} response(s) after ${stat.sent} sent ${label} message(s).`,
    }))
    .sort((a, b) => (b.rate ?? 0) - (a.rate ?? 0) || b.count - a.count)
    .slice(0, 5);

  return {
    bestPerformingReplyStyle: pickBestApprovalStyle(stats),
    worstPerformingReplyStyle: pickWorstApprovalStyle(stats),
    ...conversionProfiles,
    recommendedFollowUpTiming,
    approvalBiasInsights: [...stats.entries()]
      .filter(([, stat]) => stat.approved + stat.rejected > 0)
      .map(([label, stat]) => ({
        label,
        count: stat.approved + stat.rejected,
        rate: percent(stat.approved, stat.approved + stat.rejected),
        summary: `${label} replies were approved ${stat.approved} time(s) and rejected ${stat.rejected} time(s).`,
      }))
      .sort((a, b) => (b.rate ?? 0) - (a.rate ?? 0) || b.count - a.count)
      .slice(0, 5),
    messagePerformance,
    generatedAt: new Date().toISOString(),
  };
}
