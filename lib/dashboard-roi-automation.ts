import { formatLeadSourceTag, normalizeLeadSourceTag } from "@/lib/lead-source";
import type { StoredLead } from "@/lib/leads-storage";
import type { PracticalOperatorWorkQueue } from "@/lib/operator-work-queue-practicalization";
import { analyzeRevenuePipelineLead } from "@/lib/revenue-pipeline";

export type DealReadinessLevel = "ready" | "needs_review" | "blocked";
export type FollowUpRiskLevel = "critical" | "high" | "medium" | "low";

export type SourceRoiRow = {
  source: string;
  normalizedSource: string;
  leadCount: number;
  validContactCount: number;
  validContactRate: number;
  cleanupCount: number;
  highScoreCount: number;
  conversationCount: number;
  contractOrClosedCount: number;
  roiSignal: "strong" | "watch" | "cleanup_heavy" | "early";
};

export type DealReadinessRow = {
  leadId: string;
  leadLabel: string;
  detailHref: string;
  score: number;
  level: DealReadinessLevel;
  missingItems: string[];
  nextManualAction: string;
};

export type FollowUpRiskRow = {
  leadId: string;
  leadLabel: string;
  detailHref: string;
  riskLevel: FollowUpRiskLevel;
  reason: string;
  safeManualAction: string;
};

export type DashboardRoiAutomation = {
  sourceRows: SourceRoiRow[];
  topSource: SourceRoiRow | null;
  dailyMoneyQueue: PracticalOperatorWorkQueue["visibleRows"];
  followUpRisks: FollowUpRiskRow[];
  dealReadinessRows: DealReadinessRow[];
  totalLeads: number;
  cleanupBurden: number;
  highIntentLeadCount: number;
  contractOrClosedCount: number;
  recommendedFocus: string;
  readOnly: true;
  advisoryOnly: true;
  automationExecuted: false;
  outreachSent: false;
  taskCreated: false;
};

function hasText(value: string | null | undefined) {
  return Boolean(value?.trim());
}

function hasValidPhone(lead: StoredLead) {
  return lead.phone.replace(/\D/g, "").length >= 10;
}

function hasValidContact(lead: StoredLead) {
  return hasValidPhone(lead) || hasText(lead.email);
}

function getLeadLabel(lead: StoredLead) {
  const name = `${lead.firstName} ${lead.lastName}`.trim();
  return name || lead.ownerName || lead.propertyAddress || lead.id;
}

function getPendingFollowUps(lead: StoredLead) {
  return Array.isArray(lead.followUps) ? lead.followUps.filter((followUp) => followUp.status === "pending") : [];
}

function getTime(value?: Date | string | null) {
  if (!value) return 0;

  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function isOverdue(lead: StoredLead, now: Date) {
  const nextFollowUp = getTime(lead.nextFollowUpAt) || Math.min(...getPendingFollowUps(lead).map((item) => getTime(item.date)).filter(Boolean));

  return Number.isFinite(nextFollowUp) && nextFollowUp > 0 && nextFollowUp < now.getTime();
}

function getCleanupItems(lead: StoredLead) {
  return [
    hasText(lead.source) ? "" : "source",
    hasText(lead.propertyAddress) ? "" : "property address",
    hasValidContact(lead) ? "" : "valid contact",
    hasText(lead.situationDetails) || hasText(lead.lastSellerReply) ? "" : "seller context",
  ].filter(Boolean);
}

function getReadinessMissingItems(lead: StoredLead) {
  const revenueLead = analyzeRevenuePipelineLead(lead);

  return [
    hasText(lead.source) ? "" : "source",
    hasText(lead.propertyAddress) ? "" : "property address",
    hasValidContact(lead) ? "" : "valid contact",
    hasText(lead.situationDetails) || hasText(lead.lastSellerReply) ? "" : "seller motivation/context",
    lead.approvalStatus === "approved_for_outreach" || lead.status === "under_contract" || lead.status === "closed"
      ? ""
      : "approval review",
    ...revenueLead.missingValueReasons,
  ].filter(Boolean);
}

function getReadinessLevel(lead: StoredLead, missingItems: string[]): DealReadinessLevel {
  if (lead.doNotContact || lead.approvalStatus === "rejected") return "blocked";
  if (missingItems.length > 0 || lead.approvalStatus === "needs_human_review") return "needs_review";
  return "ready";
}

function getReadinessAction(level: DealReadinessLevel, missingItems: string[]) {
  if (level === "blocked") return "Confirm blocked or DNC status before any work.";
  if (missingItems.length > 0) return `Clean up ${missingItems.slice(0, 3).join(", ")}.`;
  return "Review offer, buyer, or closing readiness manually.";
}

function getFollowUpRisk(lead: StoredLead, now: Date): FollowUpRiskRow | null {
  if (lead.doNotContact || lead.approvalStatus === "rejected" || lead.status === "closed") return null;

  const revenueLead = analyzeRevenuePipelineLead(lead);
  const overdue = isOverdue(lead, now);

  if (overdue && (lead.score >= 70 || lead.priority === "High" || lead.isHot)) {
    return {
      leadId: lead.id,
      leadLabel: getLeadLabel(lead),
      detailHref: `/dashboard/leads/${lead.id}`,
      riskLevel: "critical",
      reason: "High-priority lead has overdue manual follow-up.",
      safeManualAction: "Open lead detail and review seller follow-up manually.",
    };
  }

  if (lead.lastSellerReply && lead.requiresHumanApproval) {
    return {
      leadId: lead.id,
      leadLabel: getLeadLabel(lead),
      detailHref: `/dashboard/leads/${lead.id}`,
      riskLevel: "high",
      reason: "Seller reply is visible and human review is still required.",
      safeManualAction: "Review seller reply and record the next human decision.",
    };
  }

  if (lead.approvalStatus === "approved_for_outreach" && lead.status === "new") {
    return {
      leadId: lead.id,
      leadLabel: getLeadLabel(lead),
      detailHref: `/dashboard/leads/${lead.id}`,
      riskLevel: "high",
      reason: "Lead is approved but still marked new.",
      safeManualAction: "Review whether a manual first contact or status update is appropriate.",
    };
  }

  if (revenueLead.bucket === "near_contract" || revenueLead.bucket === "closing_blocked") {
    return {
      leadId: lead.id,
      leadLabel: getLeadLabel(lead),
      detailHref: `/dashboard/leads/${lead.id}`,
      riskLevel: "medium",
      reason: revenueLead.nextMoneyAction.reason,
      safeManualAction: revenueLead.nextMoneyAction.label,
    };
  }

  return null;
}

function getSourceRoiSignal(row: Omit<SourceRoiRow, "roiSignal">): SourceRoiRow["roiSignal"] {
  if (row.leadCount < 3) return "early";
  if (row.cleanupCount > row.validContactCount) return "cleanup_heavy";
  if (row.highScoreCount > 0 || row.contractOrClosedCount > 0 || row.conversationCount > 0) return "strong";
  return "watch";
}

function createSourceRows(leads: StoredLead[]) {
  const rowsBySource = new Map<string, StoredLead[]>();

  leads.forEach((lead) => {
    const source = hasText(lead.source) ? lead.source.trim() : "missing_source";
    rowsBySource.set(source, [...(rowsBySource.get(source) ?? []), lead]);
  });

  return [...rowsBySource.entries()]
    .map(([source, sourceLeads]) => {
      const base = {
        source,
        normalizedSource: formatLeadSourceTag(normalizeLeadSourceTag(source)),
        leadCount: sourceLeads.length,
        validContactCount: sourceLeads.filter(hasValidContact).length,
        validContactRate: Math.round((sourceLeads.filter(hasValidContact).length / Math.max(1, sourceLeads.length)) * 100),
        cleanupCount: sourceLeads.filter((lead) => getCleanupItems(lead).length > 0).length,
        highScoreCount: sourceLeads.filter((lead) => lead.score >= 70 || lead.priority === "High").length,
        conversationCount: sourceLeads.filter((lead) => lead.status !== "new" || hasText(lead.lastSellerReply)).length,
        contractOrClosedCount: sourceLeads.filter((lead) => lead.status === "under_contract" || lead.status === "closed").length,
      };

      return {
        ...base,
        roiSignal: getSourceRoiSignal(base),
      };
    })
    .sort(
      (a, b) =>
        b.contractOrClosedCount - a.contractOrClosedCount ||
        b.highScoreCount - a.highScoreCount ||
        b.validContactRate - a.validContactRate ||
        b.leadCount - a.leadCount,
    );
}

function getRecommendedFocus({
  cleanupBurden,
  followUpRisks,
  dealReadinessRows,
  topSource,
}: {
  cleanupBurden: number;
  followUpRisks: FollowUpRiskRow[];
  dealReadinessRows: DealReadinessRow[];
  topSource: SourceRoiRow | null;
}) {
  if (followUpRisks.some((risk) => risk.riskLevel === "critical")) return "Work overdue high-priority follow-ups first.";
  if (dealReadinessRows.some((row) => row.level === "blocked")) return "Clear blocked or DNC records before revenue work.";
  if (cleanupBurden > dealReadinessRows.length / 2) return "Reduce source/contact/property cleanup before adding more leads.";
  if (topSource?.roiSignal === "strong") return `Double down on ${topSource.normalizedSource} after manual quality review.`;
  return "Review top money queue rows and keep source attribution clean.";
}

export function createDashboardRoiAutomation(
  leads: StoredLead[],
  workQueue: PracticalOperatorWorkQueue,
  now = new Date(),
): DashboardRoiAutomation {
  const sourceRows = createSourceRows(leads);
  const followUpRisks = leads
    .map((lead) => getFollowUpRisk(lead, now))
    .filter((risk): risk is FollowUpRiskRow => Boolean(risk))
    .sort((a, b) => {
      const rank: Record<FollowUpRiskLevel, number> = { critical: 4, high: 3, medium: 2, low: 1 };
      return rank[b.riskLevel] - rank[a.riskLevel] || a.leadLabel.localeCompare(b.leadLabel);
    })
    .slice(0, 6);
  const dealReadinessRows = leads
    .map((lead) => {
      const missingItems = getReadinessMissingItems(lead);
      const level = getReadinessLevel(lead, missingItems);

      return {
        leadId: lead.id,
        leadLabel: getLeadLabel(lead),
        detailHref: `/dashboard/leads/${lead.id}`,
        score: lead.score,
        level,
        missingItems,
        nextManualAction: getReadinessAction(level, missingItems),
      };
    })
    .sort((a, b) => {
      const rank: Record<DealReadinessLevel, number> = { blocked: 3, needs_review: 2, ready: 1 };
      return rank[b.level] - rank[a.level] || b.score - a.score;
    })
    .slice(0, 6);
  const cleanupBurden = leads.filter((lead) => getCleanupItems(lead).length > 0).length;
  const topSource = sourceRows[0] ?? null;

  return {
    sourceRows: sourceRows.slice(0, 6),
    topSource,
    dailyMoneyQueue: workQueue.visibleRows.slice(0, 5),
    followUpRisks,
    dealReadinessRows,
    totalLeads: leads.length,
    cleanupBurden,
    highIntentLeadCount: leads.filter((lead) => lead.score >= 70 || lead.priority === "High" || lead.isHot).length,
    contractOrClosedCount: leads.filter((lead) => lead.status === "under_contract" || lead.status === "closed").length,
    recommendedFocus: getRecommendedFocus({
      cleanupBurden,
      followUpRisks,
      dealReadinessRows,
      topSource,
    }),
    readOnly: true,
    advisoryOnly: true,
    automationExecuted: false,
    outreachSent: false,
    taskCreated: false,
  };
}
