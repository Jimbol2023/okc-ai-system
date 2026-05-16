import { prisma } from "@/lib/prisma";

type RateCounts = {
  numerator: number;
  denominator: number;
};

export type AiPerformanceRate = RateCounts & {
  value: number;
};

export type AiPerformanceRates = {
  responseRate: AiPerformanceRate;
  approvalRate: AiPerformanceRate;
  rejectionRate: AiPerformanceRate;
  conversionRate: AiPerformanceRate;
  followUpEffectiveness: AiPerformanceRate;
};

function toRate({ numerator, denominator }: RateCounts): AiPerformanceRate {
  return {
    numerator,
    denominator,
    value: denominator > 0 ? Math.round((numerator / denominator) * 100) : 0,
  };
}

async function countEvents(eventType: string) {
  return prisma.aiMemoryEvent.count({
    where: {
      eventType,
    },
  });
}

async function countDistinctLeads(where: {
  eventType?: string | { in: string[] };
  outcome?: string | { in: string[] };
}) {
  const events = await prisma.aiMemoryEvent.findMany({
    where: {
      ...where,
      leadId: {
        not: null,
      },
    },
    distinct: ["leadId"],
    select: {
      leadId: true,
    },
  });

  return events.length;
}

export async function calculateResponseRate() {
  const [sellerReplies, messagesSent] = await Promise.all([
    countEvents("seller_reply_received"),
    countEvents("message_sent"),
  ]);

  return toRate({
    numerator: sellerReplies,
    denominator: messagesSent,
  });
}

export async function calculateApprovalRate() {
  const [approvedReplies, suggestedReplies] = await Promise.all([
    countEvents("reply_approved"),
    countEvents("ai_reply_suggested"),
  ]);

  return toRate({
    numerator: approvedReplies,
    denominator: suggestedReplies,
  });
}

export async function calculateRejectionRate() {
  const [rejectedReplies, suggestedReplies] = await Promise.all([
    countEvents("reply_rejected"),
    countEvents("ai_reply_suggested"),
  ]);

  return toRate({
    numerator: rejectedReplies,
    denominator: suggestedReplies,
  });
}

export async function calculateConversionRate() {
  const [convertedLeads, outcomeTrackedLeads] = await Promise.all([
    countDistinctLeads({
      eventType: "conversion_event",
      outcome: {
        in: ["under_contract", "closed"],
      },
    }),
    countDistinctLeads({
      eventType: {
        in: ["deal_status_changed", "conversion_event"],
      },
    }),
  ]);

  return toRate({
    numerator: convertedLeads,
    denominator: outcomeTrackedLeads,
  });
}

export async function calculateFollowUpEffectiveness() {
  const [sellerReplies, followUpsCompleted] = await Promise.all([
    countEvents("seller_reply_received"),
    countEvents("follow_up_completed"),
  ]);

  return toRate({
    numerator: sellerReplies,
    denominator: followUpsCompleted,
  });
}

export async function calculateAiPerformanceRates(): Promise<AiPerformanceRates> {
  const [
    responseRate,
    approvalRate,
    rejectionRate,
    conversionRate,
    followUpEffectiveness,
  ] = await Promise.all([
    calculateResponseRate(),
    calculateApprovalRate(),
    calculateRejectionRate(),
    calculateConversionRate(),
    calculateFollowUpEffectiveness(),
  ]);

  return {
    responseRate,
    approvalRate,
    rejectionRate,
    conversionRate,
    followUpEffectiveness,
  };
}
