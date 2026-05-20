import { analyzeClosingReadiness, type ClosingReadinessState, type RevenueRealizationRisk } from "@/lib/closing-readiness";
import { analyzeDispositionReadiness, type AssignmentReadinessState, type BuyerReadinessState } from "@/lib/disposition-readiness";
import type { StoredLead } from "@/lib/leads-storage";
import { analyzeRevenuePipelineLead, type NextMoneyActionCategory, type RevenueBucket } from "@/lib/revenue-pipeline";

export type OperatorUrgencyTier = "critical" | "high" | "medium" | "low";

export type OperatorRiskTier = "blocked" | "high_risk" | "medium_risk" | "low_risk" | "unknown";

export type HumanReviewState = "manual_review_required" | "high_attention_required" | "safe_to_monitor";

export type OperationsStage =
  | "lead"
  | "acquisition"
  | "disposition"
  | "assignment"
  | "closing"
  | "payout_readiness"
  | "blocked";

export type OperatorWorkqueueItem = {
  lead: StoredLead;
  operatorPriorityRank: number;
  urgencyTier: OperatorUrgencyTier;
  riskTier: OperatorRiskTier;
  humanReviewState: HumanReviewState;
  category:
    | "immediate_revenue_opportunity"
    | "urgent_follow_up"
    | "buyer_ready_deal"
    | "under_contract_risk"
    | "closing_blocked_deal"
    | "title_blocker"
    | "stale_negotiation"
    | "manual_review_required"
    | "missing_critical_data"
    | "monitor";
  currentStage: OperationsStage;
  stalledStage?: OperationsStage;
  nextStage: OperationsStage;
  whyItMatters: string;
  blocker?: string;
  recommendedNextAction: {
    label: string;
    category: NextMoneyActionCategory | "disposition" | "operations";
    urgency: OperatorUrgencyTier;
    reason: string;
    blocker?: string;
    safetyNote: string;
  };
  stallReason?: string;
  bottlenecks: string[];
  timeline: Array<{
    stage: OperationsStage;
    label: string;
    status: "complete" | "current" | "stalled" | "blocked" | "upcoming";
    note: string;
  }>;
  safetyNote: string;
  sourceSignals: {
    revenueBucket: RevenueBucket;
    buyerReadiness: BuyerReadinessState;
    assignmentReadiness: AssignmentReadinessState;
    closingReadiness: ClosingReadinessState;
    revenueRealizationRisk: RevenueRealizationRisk;
  };
};

export type OperatorWorkqueueSummary = {
  totalItems: number;
  criticalItems: number;
  highRiskItems: number;
  manualReviewItems: number;
  stalledItems: number;
  blockedItems: number;
  buyerReadyItems: number;
  underContractItems: number;
  closingBlockedItems: number;
  workFirstItems: OperatorWorkqueueItem[];
  revenueAtRiskItems: OperatorWorkqueueItem[];
  urgentHumanReviewItems: OperatorWorkqueueItem[];
  stalledDealItems: OperatorWorkqueueItem[];
  buyerReadyItemsList: OperatorWorkqueueItem[];
  underContractItemsList: OperatorWorkqueueItem[];
  closingBlockedItemsList: OperatorWorkqueueItem[];
  topBottlenecks: Array<{
    label: string;
    count: number;
  }>;
  rankedItems: OperatorWorkqueueItem[];
};

const SAFETY_NOTE =
  "Guidance only. No outreach sent, no automation executed, no documents generated, and operator review is required.";

function getTime(value?: Date | string | null) {
  if (!value) return 0;

  const time = new Date(value).getTime();

  return Number.isNaN(time) ? 0 : time;
}

function isFollowUpDue(lead: StoredLead) {
  const nextFollowUpTime = getTime(lead.nextFollowUpAt);

  return nextFollowUpTime > 0 && nextFollowUpTime <= Date.now();
}

function isStaleFollowUp(lead: StoredLead) {
  if (isFollowUpDue(lead)) return true;

  const lastContactedTime = getTime(lead.lastContactedAt);
  if (!lastContactedTime) return lead.status === "contacted" || lead.status === "negotiating";

  const hoursSinceContact = (Date.now() - lastContactedTime) / (1000 * 60 * 60);

  return hoursSinceContact >= 48 && (lead.status === "contacted" || lead.status === "negotiating");
}

function isHighOpportunity(lead: StoredLead) {
  return lead.score >= 70 || lead.priority === "High" || Boolean(lead.isHot);
}

function getLeadName(lead: StoredLead) {
  const name = `${lead.firstName} ${lead.lastName}`.trim();

  return name || lead.ownerName || "Unknown lead";
}

function getCurrentStage(lead: StoredLead, blocked: boolean): OperationsStage {
  if (blocked) return "blocked";
  if (lead.status === "closed") return "payout_readiness";
  if (lead.status === "under_contract") return "closing";
  if (lead.status === "negotiating") return "acquisition";
  if (lead.approvalStatus === "approved_for_outreach" || lead.status === "contacted") return "acquisition";

  return "lead";
}

function getNextStage(currentStage: OperationsStage): OperationsStage {
  const nextStages: Record<OperationsStage, OperationsStage> = {
    lead: "acquisition",
    acquisition: "disposition",
    disposition: "assignment",
    assignment: "closing",
    closing: "payout_readiness",
    payout_readiness: "payout_readiness",
    blocked: "acquisition",
  };

  return nextStages[currentStage];
}

function getStall(
  lead: StoredLead,
  buyerReadiness: BuyerReadinessState,
  assignmentReadiness: AssignmentReadinessState,
  closingReadiness: ClosingReadinessState,
): { stalledStage?: OperationsStage; stallReason?: string; urgencyBoost: number } {
  if (isStaleFollowUp(lead)) {
    return {
      stalledStage: lead.status === "negotiating" ? "acquisition" : "lead",
      stallReason: "Stale or overdue follow-up",
      urgencyBoost: 18,
    };
  }

  if (lead.status === "negotiating" && buyerReadiness === "not_buyer_ready") {
    return {
      stalledStage: "acquisition",
      stallReason: "Negotiation needs stronger valuation or package data before disposition work advances.",
      urgencyBoost: 10,
    };
  }

  if (lead.status === "under_contract" && assignmentReadiness !== "ready_to_assign_review" && assignmentReadiness !== "needs_buyer_match") {
    return {
      stalledStage: "assignment",
      stallReason: "Under-contract deal lacks buyer assignment readiness.",
      urgencyBoost: 16,
    };
  }

  if (lead.status === "under_contract" && closingReadiness !== "closing_ready") {
    return {
      stalledStage: "closing",
      stallReason: "Under-contract deal still has title, contract, earnest-money, or closing readiness gaps.",
      urgencyBoost: 20,
    };
  }

  if (lead.status === "closed" && closingReadiness === "closing_blocked") {
    return {
      stalledStage: "payout_readiness",
      stallReason: "Closed status conflicts with unresolved closing blockers.",
      urgencyBoost: 22,
    };
  }

  return { urgencyBoost: 0 };
}

function getHumanReviewState(lead: StoredLead, riskTier: OperatorRiskTier, bottlenecks: string[]): HumanReviewState {
  if (
    lead.doNotContact ||
    lead.approvalStatus === "rejected" ||
    lead.approvalStatus === "needs_human_review" ||
    Boolean(lead.requiresHumanApproval) ||
    riskTier === "blocked"
  ) {
    return "manual_review_required";
  }

  if (
    lead.approvalStatus !== "approved_for_outreach" ||
    riskTier === "high_risk" ||
    bottlenecks.some((bottleneck) => bottleneck.toLowerCase().includes("unknown") || bottleneck.toLowerCase().includes("missing"))
  ) {
    return "high_attention_required";
  }

  return "safe_to_monitor";
}

function getRiskTier(
  lead: StoredLead,
  revenueRisk: RevenueRealizationRisk,
  hardBlockers: string[],
  bottlenecks: string[],
): OperatorRiskTier {
  if (hardBlockers.length > 0 || revenueRisk === "blocked") return "blocked";
  if (revenueRisk === "high" || bottlenecks.length >= 5 || lead.approvalStatus === "needs_human_review") return "high_risk";
  if (revenueRisk === "medium" || bottlenecks.length > 0 || lead.approvalStatus !== "approved_for_outreach") return "medium_risk";
  if (revenueRisk === "low") return "low_risk";

  return "unknown";
}

function getUrgencyTier(score: number, riskTier: OperatorRiskTier): OperatorUrgencyTier {
  if (riskTier === "blocked" || score >= 130) return "critical";
  if (score >= 95) return "high";
  if (score >= 55) return "medium";

  return "low";
}

function getCategory(
  lead: StoredLead,
  riskTier: OperatorRiskTier,
  buyerReadiness: BuyerReadinessState,
  closingReadiness: ClosingReadinessState,
  stallReason?: string,
): OperatorWorkqueueItem["category"] {
  if (lead.doNotContact || lead.approvalStatus === "needs_human_review" || lead.requiresHumanApproval) return "manual_review_required";
  if (riskTier === "blocked" && closingReadiness === "closing_blocked") return "closing_blocked_deal";
  if (riskTier === "blocked") return "manual_review_required";
  if (closingReadiness === "closing_blocked") return "title_blocker";
  if (lead.status === "under_contract") return "under_contract_risk";
  if (stallReason) return lead.status === "negotiating" ? "stale_negotiation" : "urgent_follow_up";
  if (buyerReadiness === "buyer_ready") return "buyer_ready_deal";
  if (isHighOpportunity(lead)) return "immediate_revenue_opportunity";
  if (riskTier === "unknown" || riskTier === "medium_risk") return "missing_critical_data";

  return "monitor";
}

function chooseNextAction({
  lead,
  hardBlockers,
  revenueAction,
  dispositionAction,
  closingAction,
  closingReadiness,
  dispositionBottlenecks,
}: {
  lead: StoredLead;
  hardBlockers: string[];
  revenueAction: ReturnType<typeof analyzeRevenuePipelineLead>["nextMoneyAction"];
  dispositionAction: ReturnType<typeof analyzeDispositionReadiness>["buyerSideNextAction"];
  closingAction: ReturnType<typeof analyzeClosingReadiness>["nextClosingAction"];
  closingReadiness: ClosingReadinessState;
  dispositionBottlenecks: string[];
}): OperatorWorkqueueItem["recommendedNextAction"] {
  if (hardBlockers.length > 0) {
    return {
      label: "Manual review required",
      category: "operations",
      urgency: "critical",
      reason: "A hard safety or state blocker must be reviewed before workflow work continues.",
      blocker: hardBlockers[0],
      safetyNote: SAFETY_NOTE,
    };
  }

  if (lead.status === "under_contract" || closingReadiness === "closing_blocked") {
    return {
      label: closingAction.label,
      category: "closing",
      urgency: closingAction.urgency === "blocked" ? "critical" : closingAction.urgency,
      reason: closingAction.reason,
      blocker: closingAction.blocker,
      safetyNote: SAFETY_NOTE,
    };
  }

  if (dispositionBottlenecks.length > 0 && (lead.status === "negotiating" || revenueAction.category === "buyer")) {
    return {
      label: dispositionAction.label,
      category: "disposition",
      urgency: dispositionAction.urgency === "blocked" ? "critical" : dispositionAction.urgency,
      reason: dispositionAction.reason,
      blocker: dispositionAction.blocker,
      safetyNote: SAFETY_NOTE,
    };
  }

  return {
    label: revenueAction.label,
    category: revenueAction.category,
    urgency: revenueAction.urgency === "blocked" ? "critical" : revenueAction.urgency,
    reason: revenueAction.reason,
    blocker: revenueAction.blocker,
    safetyNote: SAFETY_NOTE,
  };
}

function getTimeline({
  currentStage,
  stalledStage,
  blocker,
}: {
  currentStage: OperationsStage;
  stalledStage?: OperationsStage;
  blocker?: string;
}): OperatorWorkqueueItem["timeline"] {
  const stages: Array<{ stage: OperationsStage; label: string }> = [
    { stage: "lead", label: "Lead" },
    { stage: "acquisition", label: "Acquisition" },
    { stage: "disposition", label: "Disposition" },
    { stage: "assignment", label: "Assignment" },
    { stage: "closing", label: "Closing" },
    { stage: "payout_readiness", label: "Payout readiness" },
  ];
  const currentIndex = stages.findIndex((item) => item.stage === currentStage);
  const stalledIndex = stalledStage ? stages.findIndex((item) => item.stage === stalledStage) : -1;

  return stages.map((item, index) => {
    if (blocker && stalledStage === item.stage) {
      return {
        ...item,
        status: "blocked",
        note: blocker,
      };
    }

    if (stalledIndex === index) {
      return {
        ...item,
        status: "stalled",
        note: "Needs operator attention before advancing.",
      };
    }

    if (currentIndex === index) {
      return {
        ...item,
        status: "current",
        note: "Current operational stage.",
      };
    }

    if (currentIndex > index) {
      return {
        ...item,
        status: "complete",
        note: "Prior stage based on current lead status.",
      };
    }

    return {
      ...item,
      status: "upcoming",
      note: "Future stage. No execution is triggered.",
    };
  });
}

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

export function analyzeOperatorWorkqueueItem(lead: StoredLead): OperatorWorkqueueItem {
  const revenue = analyzeRevenuePipelineLead(lead);
  const disposition = analyzeDispositionReadiness(lead);
  const closing = analyzeClosingReadiness(lead);
  const hardBlockers = unique([
    lead.doNotContact ? "DNC protection active" : "",
    lead.approvalStatus === "rejected" ? "Lead rejected" : "",
    lead.approvalStatus === "needs_human_review" ? "Needs human review" : "",
    Boolean(lead.requiresHumanApproval) ? "Human approval required" : "",
    ...revenue.blockers,
  ]);
  const bottlenecks = unique([
    ...revenue.bottlenecks,
    ...disposition.bottlenecks,
    ...closing.bottlenecks,
  ]);
  const riskTier = getRiskTier(lead, closing.revenueRealizationRisk, hardBlockers, bottlenecks);
  const currentStage = getCurrentStage(lead, hardBlockers.length > 0 || riskTier === "blocked");
  const stall = getStall(lead, disposition.buyerReadiness, disposition.assignmentReadiness, closing.readinessState);
  const recommendedNextAction = chooseNextAction({
    lead,
    hardBlockers,
    revenueAction: revenue.nextMoneyAction,
    dispositionAction: disposition.buyerSideNextAction,
    closingAction: closing.nextClosingAction,
    closingReadiness: closing.readinessState,
    dispositionBottlenecks: disposition.bottlenecks,
  });
  const proximityBoost = lead.status === "closed" ? 45 : lead.status === "under_contract" ? 38 : lead.status === "negotiating" ? 24 : 0;
  const urgencyBoost = isFollowUpDue(lead) ? 20 : stall.urgencyBoost;
  const buyerBoost = disposition.buyerReadiness === "buyer_ready" ? 18 : disposition.buyerReadiness === "almost_buyer_ready" ? 10 : 0;
  const closingBoost = closing.readinessState === "closing_ready" ? 26 : closing.readinessState === "almost_closing_ready" ? 16 : closing.readinessState === "closing_blocked" ? 24 : 0;
  const riskBoost = riskTier === "blocked" ? 22 : riskTier === "high_risk" ? 16 : riskTier === "medium_risk" ? 8 : 0;
  const operatorPriorityRank = Math.max(
    0,
    Math.round(revenue.monetizationRank + proximityBoost + urgencyBoost + buyerBoost + closingBoost + riskBoost - hardBlockers.length * 8),
  );
  const urgencyTier = getUrgencyTier(operatorPriorityRank, riskTier);
  const blocker = recommendedNextAction.blocker ?? hardBlockers[0] ?? stall.stallReason;

  return {
    lead,
    operatorPriorityRank,
    urgencyTier,
    riskTier,
    humanReviewState: getHumanReviewState(lead, riskTier, bottlenecks),
    category: getCategory(lead, riskTier, disposition.buyerReadiness, closing.readinessState, stall.stallReason),
    currentStage,
    stalledStage: stall.stalledStage,
    nextStage: getNextStage(currentStage),
    whyItMatters: `${getLeadName(lead)} is in ${currentStage.replaceAll("_", " ")} with ${revenue.bucket.replaceAll("_", " ")} revenue context and ${closing.revenueRealizationRisk.replaceAll("_", " ")} revenue realization risk.`,
    blocker,
    recommendedNextAction,
    stallReason: stall.stallReason,
    bottlenecks,
    timeline: getTimeline({
      currentStage,
      stalledStage: stall.stalledStage,
      blocker,
    }),
    safetyNote: SAFETY_NOTE,
    sourceSignals: {
      revenueBucket: revenue.bucket,
      buyerReadiness: disposition.buyerReadiness,
      assignmentReadiness: disposition.assignmentReadiness,
      closingReadiness: closing.readinessState,
      revenueRealizationRisk: closing.revenueRealizationRisk,
    },
  };
}

export function getOperatorWorkqueueSummary(leads: StoredLead[]): OperatorWorkqueueSummary {
  const rankedItems = leads
    .map(analyzeOperatorWorkqueueItem)
    .sort((a, b) => b.operatorPriorityRank - a.operatorPriorityRank || getTime(b.lead.timestamp) - getTime(a.lead.timestamp));
  const bottleneckCounts = new Map<string, number>();

  rankedItems.forEach((item) => {
    item.bottlenecks.forEach((bottleneck) => {
      bottleneckCounts.set(bottleneck, (bottleneckCounts.get(bottleneck) ?? 0) + 1);
    });
  });

  return {
    totalItems: rankedItems.length,
    criticalItems: rankedItems.filter((item) => item.urgencyTier === "critical").length,
    highRiskItems: rankedItems.filter((item) => item.riskTier === "high_risk" || item.riskTier === "blocked").length,
    manualReviewItems: rankedItems.filter((item) => item.humanReviewState === "manual_review_required").length,
    stalledItems: rankedItems.filter((item) => Boolean(item.stallReason)).length,
    blockedItems: rankedItems.filter((item) => item.riskTier === "blocked").length,
    buyerReadyItems: rankedItems.filter((item) => item.sourceSignals.buyerReadiness === "buyer_ready").length,
    underContractItems: rankedItems.filter((item) => item.lead.status === "under_contract").length,
    closingBlockedItems: rankedItems.filter((item) => item.sourceSignals.closingReadiness === "closing_blocked").length,
    workFirstItems: rankedItems.slice(0, 5),
    revenueAtRiskItems: rankedItems.filter((item) => item.riskTier === "blocked" || item.riskTier === "high_risk").slice(0, 5),
    urgentHumanReviewItems: rankedItems.filter((item) => item.humanReviewState !== "safe_to_monitor").slice(0, 5),
    stalledDealItems: rankedItems.filter((item) => Boolean(item.stallReason)).slice(0, 5),
    buyerReadyItemsList: rankedItems.filter((item) => item.sourceSignals.buyerReadiness === "buyer_ready").slice(0, 5),
    underContractItemsList: rankedItems.filter((item) => item.lead.status === "under_contract").slice(0, 5),
    closingBlockedItemsList: rankedItems.filter((item) => item.sourceSignals.closingReadiness === "closing_blocked").slice(0, 5),
    topBottlenecks: [...bottleneckCounts.entries()]
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6),
    rankedItems,
  };
}
