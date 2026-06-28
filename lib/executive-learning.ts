import type { Prisma } from "@/generated/prisma";

import type { BusinessIntelligenceReport } from "@/lib/business-intelligence";
import { sanitizeAdvisoryRecommendationText } from "@/lib/executive-recommendations";
import { findRecommendationKnowledgeLinks, type RecommendationKnowledgeLink } from "@/lib/knowledge-recommendation-links";
import type { KnowledgeItemRecord } from "@/lib/knowledge";

export type ExecutiveRecommendationConfidence = "low" | "medium" | "high";

export type ExecutiveLearningMemoryEvent = {
  eventType: string;
  source: string;
  approvalDecision: string | null;
  outcome: string | null;
  metadata: Prisma.JsonValue | null;
  createdAt: Date;
};

export type ExecutiveLearningRecommendation = {
  id: string;
  title: string;
  summary: string;
  confidenceLabel: ExecutiveRecommendationConfidence;
  confidenceScore: number;
  reason: string;
  sampleWindowDays: 90;
  knowledgeLinks: RecommendationKnowledgeLink[];
  advisoryOnly: true;
};

type RecommendationDraft = {
  id: string;
  title: string;
  summary: string;
  reason: string;
  sampleSize: number;
  positiveSignals: number;
};

const SAMPLE_WINDOW_DAYS = 90;

function percent(part: number, total: number) {
  if (total <= 0) return 0;

  return Math.round((part / total) * 100);
}

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function calculateExecutiveRecommendationConfidence({
  sampleSize,
  positiveSignals,
}: {
  sampleSize: number;
  positiveSignals: number;
}): {
  confidenceLabel: ExecutiveRecommendationConfidence;
  confidenceScore: number;
} {
  if (sampleSize <= 0) {
    return {
      confidenceLabel: "low" as const,
      confidenceScore: 0,
    };
  }

  const outcomeRate = positiveSignals > 0 ? positiveSignals / sampleSize : 0;
  const sampleScore = Math.min(sampleSize / 20, 1) * 55;
  const outcomeScore = outcomeRate * 45;
  const confidenceScore = clampScore(sampleScore + outcomeScore);

  return {
    confidenceLabel:
      confidenceScore >= 75 && sampleSize >= 15
        ? "high"
        : confidenceScore >= 40 && sampleSize >= 5
          ? "medium"
          : "low",
    confidenceScore,
  };
}

function getMetadataObject(metadata: Prisma.JsonValue | null) {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return {};
  }

  return metadata as Record<string, Prisma.JsonValue>;
}

function getMetadataString(event: ExecutiveLearningMemoryEvent, key: string) {
  const value = getMetadataObject(event.metadata)[key];

  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function getRecentEvents(events: ExecutiveLearningMemoryEvent[], now = new Date()) {
  const start = new Date(now);
  start.setDate(start.getDate() - SAMPLE_WINDOW_DAYS);

  return events.filter((event) => event.createdAt.getTime() >= start.getTime());
}

function isPositiveOutcome(event: ExecutiveLearningMemoryEvent) {
  return (
    event.approvalDecision === "approved" ||
    event.outcome === "closed" ||
    event.outcome === "under_contract" ||
    event.outcome === "contacted" ||
    event.eventType === "follow_up_completed" ||
    event.eventType === "conversion_event"
  );
}

function buildBaseDrafts(report: BusinessIntelligenceReport): RecommendationDraft[] {
  return [
    report.summary.followUpsDue > 0
      ? {
          id: "due-follow-ups",
          title: "Review due lead follow-ups",
          summary: `${report.summary.followUpsDue} lead(s) need manual follow-up review today.`,
          reason: "Due follow-ups are visible in stored lead records; no outreach is triggered by this recommendation.",
          sampleSize: report.summary.totalLeads,
          positiveSignals: report.summary.qualifiedLeads,
        }
      : null,
    report.summary.topChannel && report.summary.topChannel.qualifiedShare >= 50
      ? {
          id: "top-lead-source",
          title: "Review the strongest lead source",
          summary: `${report.summary.topChannel.source} generated ${report.summary.topChannel.qualifiedShare}% of currently qualified leads.`,
          reason: `${report.summary.topChannel.qualifiedLeads} qualified lead(s) from ${report.summary.topChannel.totalLeads} total lead(s) are associated with this source.`,
          sampleSize: report.summary.topChannel.totalLeads,
          positiveSignals: report.summary.topChannel.qualifiedLeads,
        }
      : null,
    report.summary.offerReadyCount > 0
      ? {
          id: "offer-ready-review",
          title: "Verify offer-ready opportunities",
          summary: `${report.summary.offerReadyCount} opportunity/opportunities are offer-ready or near-contract.`,
          reason: "Analyzer, contract, negotiation, or priority signals exist; seller motivation and value assumptions still need human review.",
          sampleSize: report.summary.totalLeads,
          positiveSignals: report.summary.offerReadyCount,
        }
      : null,
    report.summary.marketingApprovalBacklog > 0
      ? {
          id: "marketing-approval-backlog",
          title: "Clear the marketing approval backlog",
          summary: `${report.summary.marketingApprovalBacklog} marketing draft(s) are awaiting manual approval.`,
          reason: "Publishing remains outside this dashboard and requires a separate human approval workflow.",
          sampleSize: report.summary.marketingApprovalBacklog,
          positiveSignals: 0,
        }
      : null,
    report.summary.financeGapCount > 0
      ? {
          id: "finance-data-gaps",
          title: "Improve finance KPI coverage",
          summary: `${report.summary.financeGapCount} finance KPI gap(s) are limiting CPL, CPA, and profit visibility.`,
          reason: "Manual finance entries are needed before cost and acquisition metrics become reliable.",
          sampleSize: report.summary.totalLeads,
          positiveSignals: report.summary.closedLeads,
        }
      : null,
    report.summary.closingBlockedCount > 0
      ? {
          id: "operations-bottleneck",
          title: "Review closing blockers",
          summary: `${report.summary.closingBlockedCount} closing-related opportunity/opportunities have operations blockers.`,
          reason: "Closing bottlenecks are surfaced from the revenue pipeline summary for manual operations review.",
          sampleSize: report.summary.totalLeads,
          positiveSignals: report.summary.closedLeads,
        }
      : null,
  ].filter((draft): draft is RecommendationDraft => Boolean(draft));
}

function buildMemoryDrafts(events: ExecutiveLearningMemoryEvent[]): RecommendationDraft[] {
  const sourceStats = new Map<string, { total: number; positive: number }>();
  const approvalEvents = events.filter((event) => event.eventType === "reply_approved" || event.eventType === "reply_rejected");
  const followUpEvents = events.filter((event) => event.eventType === "follow_up_completed");

  events.forEach((event) => {
    const source = getMetadataString(event, "leadSource") ?? getMetadataString(event, "source") ?? event.source;
    const current = sourceStats.get(source) ?? {
      total: 0,
      positive: 0,
    };

    current.total += 1;

    if (isPositiveOutcome(event)) {
      current.positive += 1;
    }

    sourceStats.set(source, current);
  });

  const topSource = [...sourceStats.entries()]
    .filter(([, stats]) => stats.total >= 3 && stats.positive > 0)
    .sort((a, b) => percent(b[1].positive, b[1].total) - percent(a[1].positive, a[1].total) || b[1].positive - a[1].positive)[0];

  return [
    topSource
      ? {
          id: "memory-source-confidence",
          title: "Use memory data when reviewing lead sources",
          summary: `${topSource[0]} has shown a ${percent(topSource[1].positive, topSource[1].total)}% positive outcome rate in recent memory events.`,
          reason: `${topSource[1].positive} positive signal(s) from ${topSource[1].total} stored memory event(s) in the last ${SAMPLE_WINDOW_DAYS} days.`,
          sampleSize: topSource[1].total,
          positiveSignals: topSource[1].positive,
        }
      : null,
    approvalEvents.length > 0
      ? {
          id: "approval-learning",
          title: "Use approval history to refine reply guidance",
          summary: `${approvalEvents.filter((event) => event.approvalDecision === "approved").length} approved reply decision(s) are available for learning.`,
          reason: "Approval and rejection history can guide future manual reply review without sending messages automatically.",
          sampleSize: approvalEvents.length,
          positiveSignals: approvalEvents.filter((event) => event.approvalDecision === "approved").length,
        }
      : null,
    followUpEvents.length > 0
      ? {
          id: "follow-up-learning",
          title: "Review completed follow-up patterns",
          summary: `${followUpEvents.length} completed follow-up event(s) are available for timing analysis.`,
          reason: "Completed follow-up memory improves confidence around manual follow-up prioritization.",
          sampleSize: followUpEvents.length,
          positiveSignals: followUpEvents.length,
        }
      : null,
  ].filter((draft): draft is RecommendationDraft => Boolean(draft));
}

export function createExecutiveLearningRecommendations({
  report,
  memoryEvents,
  knowledgeItems,
}: {
  report: BusinessIntelligenceReport;
  memoryEvents: ExecutiveLearningMemoryEvent[];
  knowledgeItems: KnowledgeItemRecord[];
}): ExecutiveLearningRecommendation[] {
  const recentEvents = getRecentEvents(memoryEvents);
  const drafts = [...buildBaseDrafts(report), ...buildMemoryDrafts(recentEvents)];
  const fallbackDraft: RecommendationDraft = {
    id: "monitor-learning-signals",
    title: "Monitor learning signals",
    summary: "Monitor lead quality, finance entries, and department health before changing operating priorities.",
    reason: "Not enough current memory events are available for a stronger recommendation yet.",
    sampleSize: recentEvents.length,
    positiveSignals: recentEvents.filter(isPositiveOutcome).length,
  };

  return (drafts.length > 0 ? drafts : [fallbackDraft]).map((draft) => {
    const confidence = calculateExecutiveRecommendationConfidence({
      sampleSize: draft.sampleSize,
      positiveSignals: draft.positiveSignals,
    });
    const summary = sanitizeAdvisoryRecommendationText(draft.summary);
    const reason = sanitizeAdvisoryRecommendationText(draft.reason);
    const linkText = `${draft.title} ${summary} ${reason}`;

    return {
      id: draft.id,
      title: draft.title,
      summary,
      ...confidence,
      reason,
      sampleWindowDays: SAMPLE_WINDOW_DAYS,
      knowledgeLinks: findRecommendationKnowledgeLinks({
        text: linkText,
        knowledgeItems,
      }),
      advisoryOnly: true,
    };
  });
}
