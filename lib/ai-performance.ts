import { prisma } from "@/lib/prisma";

/**
 * AI Performance Monitor
 * Stage 2B.9
 *
 * Purpose:
 * - Reads real lead data
 * - Calculates daily AI/system performance metrics
 * - Saves one metric snapshot per UTC day
 * - Keeps dashboard reads fail-closed and read-only
 */

function getStartOfTodayUtc() {
  const now = new Date();

  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );
}

function isNonEmpty(value: unknown) {
  return typeof value === "string" && value.trim().length > 0;
}

function isOlderThan24Hours(date: Date | string | null | undefined) {
  if (!date) return false;

  const createdAt = new Date(date).getTime();
  const now = Date.now();

  return now - createdAt > 24 * 60 * 60 * 1000;
}

function isPastDate(date: Date | string | null | undefined) {
  if (!date) return false;

  return new Date(date).getTime() < Date.now();
}

export async function collectAiPerformanceMetrics() {
  const today = getStartOfTodayUtc();

  const leads = await prisma.lead.findMany();

  const totalLeads = leads.length;

  const newLeads = leads.filter((lead) => lead.status === "new").length;

  const contactedLeads = leads.filter(
    (lead) => lead.status === "contacted"
  ).length;

  const negotiatingLeads = leads.filter(
    (lead) => lead.status === "negotiating"
  ).length;

  const underContractLeads = leads.filter(
    (lead) => lead.status === "under_contract"
  ).length;

  const closedLeads = leads.filter((lead) => lead.status === "closed").length;

  const sellerReplies = leads.filter((lead) =>
    isNonEmpty(lead.lastSellerReply)
  ).length;

  const aiClassifications = leads.filter((lead) =>
    isNonEmpty(lead.lastSellerReplyIntent)
  ).length;

  const confidenceValues = leads
    .map((lead) => lead.lastSellerReplyConfidence)
    .filter((value): value is number => typeof value === "number");

  const avgConfidence =
    confidenceValues.length > 0
      ? confidenceValues.reduce((sum, value) => sum + value, 0) /
        confidenceValues.length
      : 0;

  const humanApprovalsNeeded = leads.filter(
    (lead) => lead.requiresHumanApproval === true
  ).length;

  const suggestedReplies = leads.filter((lead) =>
    isNonEmpty(lead.suggestedReply)
  ).length;

  const dncCount = leads.filter((lead) => lead.doNotContact === true).length;

  const hotLeads = leads.filter((lead) => lead.isHot === true).length;

  const automationScheduled = leads.filter(
    (lead) => lead.automationStatus === "scheduled"
  ).length;

  const automationIdle = leads.filter(
    (lead) => lead.automationStatus === "idle"
  ).length;

  const staleNewLeads = leads.filter(
    (lead) => lead.status === "new" && isOlderThan24Hours(lead.createdAt)
  ).length;

  const overdueFollowUps = leads.filter(
    (lead) =>
      lead.doNotContact !== true &&
      lead.nextFollowUpAt &&
      isPastDate(lead.nextFollowUpAt)
  ).length;

  const systemWarnings = [
    staleNewLeads > 0
      ? {
          type: "stale_new_leads",
          severity: "warning",
          message: `${staleNewLeads} new lead(s) are older than 24 hours.`,
          count: staleNewLeads,
        }
      : null,

    overdueFollowUps > 0
      ? {
          type: "overdue_followups",
          severity: "high",
          message: `${overdueFollowUps} follow-up(s) are overdue.`,
          count: overdueFollowUps,
        }
      : null,

    humanApprovalsNeeded > 0
      ? {
          type: "ai_replies_waiting_approval",
          severity: "medium",
          message: `${humanApprovalsNeeded} AI suggested reply/replies need human approval.`,
          count: humanApprovalsNeeded,
        }
      : null,

    dncCount > 0
      ? {
          type: "dnc_records_present",
          severity: "info",
          message: `${dncCount} lead(s) are marked Do Not Contact.`,
          count: dncCount,
        }
      : null,
  ].filter(Boolean);

  const metric = await prisma.aiPerformanceMetric.upsert({
    where: {
      date: today,
    },
    update: {
      totalLeads,
      newLeads,
      contactedLeads,
      negotiatingLeads,
      underContractLeads,
      closedLeads,
      sellerReplies,
      aiClassifications,
      avgConfidence,
      humanApprovalsNeeded,
      suggestedReplies,
      dncCount,
      hotLeads,
      automationScheduled,
      automationIdle,
      staleNewLeads,
      overdueFollowUps,
      systemWarnings,
    },
    create: {
      date: today,
      totalLeads,
      newLeads,
      contactedLeads,
      negotiatingLeads,
      underContractLeads,
      closedLeads,
      sellerReplies,
      aiClassifications,
      avgConfidence,
      humanApprovalsNeeded,
      suggestedReplies,
      dncCount,
      hotLeads,
      automationScheduled,
      automationIdle,
      staleNewLeads,
      overdueFollowUps,
      systemWarnings,
    },
  });

  return metric;
}

export async function getLatestAiPerformanceMetric() {
  return prisma.aiPerformanceMetric.findFirst({
    orderBy: {
      date: "desc",
    },
  });
}

export async function getAiPerformanceMetrics(limit = 14) {
  return prisma.aiPerformanceMetric.findMany({
    orderBy: {
      date: "desc",
    },
    take: limit,
  });
}
