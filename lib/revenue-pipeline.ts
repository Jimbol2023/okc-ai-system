import { analyzeClosingReadiness, type ClosingReadinessState, type RevenueRealizationRisk } from "@/lib/closing-readiness";
import type { StoredLead } from "@/lib/leads-storage";

export type RevenueBucket =
  | "work_first"
  | "hot_opportunities"
  | "buyer_ready"
  | "near_contract"
  | "under_contract"
  | "closing_blocked"
  | "blocked"
  | "nurture"
  | "low_priority";

export type NextMoneyActionCategory =
  | "seller"
  | "valuation"
  | "approval"
  | "follow_up"
  | "contract"
  | "buyer"
  | "closing"
  | "blocked"
  | "nurture";

export type RevenueUrgency = "critical" | "high" | "medium" | "low" | "blocked";

export type NextMoneyAction = {
  label: string;
  category: NextMoneyActionCategory;
  urgency: RevenueUrgency;
  reason: string;
  blocker?: string;
  safetyNote: string;
};

export type RevenuePipelineLead = {
  lead: StoredLead;
  bucket: RevenueBucket;
  monetizationRank: number;
  urgency: RevenueUrgency;
  reason: string;
  blockers: string[];
  bottlenecks: string[];
  missingValueReasons: string[];
  nextMoneyAction: NextMoneyAction;
  estimatedValue: number | null;
  estimatedValueLabel: string;
  estimatedValueAssumption: string | null;
  isActionable: boolean;
  isBuyerReady: boolean;
  isNearContract: boolean;
  isClosingRelated: boolean;
  closingReadinessState: ClosingReadinessState;
  revenueRealizationRisk: RevenueRealizationRisk;
};

export type RevenuePipelineSummary = {
  totalLeads: number;
  actionableLeads: number;
  blockedLeads: number;
  hotOpportunities: number;
  buyerReadyLeads: number;
  nearContractLeads: number;
  underContractLeads: number;
  closingReadyLeads: number;
  closingBlockedLeads: number;
  estimatedPipelineValue: number | null;
  estimatedPipelineValueLabel: string;
  missingValueReasons: string[];
  topBottlenecks: Array<{
    label: string;
    count: number;
  }>;
  workFirstLeads: RevenuePipelineLead[];
  rankedLeads: RevenuePipelineLead[];
  buckets: Record<RevenueBucket, RevenuePipelineLead[]>;
};

const REVENUE_BUCKETS: RevenueBucket[] = [
  "work_first",
  "hot_opportunities",
  "buyer_ready",
  "near_contract",
  "under_contract",
  "closing_blocked",
  "blocked",
  "nurture",
  "low_priority",
];

function getTime(value?: Date | string | null) {
  if (!value) return 0;

  const time = new Date(value).getTime();

  return Number.isNaN(time) ? 0 : time;
}

function isFollowUpDue(lead: StoredLead) {
  const nextFollowUp = getTime(lead.nextFollowUpAt);

  return nextFollowUp > 0 && nextFollowUp <= Date.now();
}

function isFollowUpStale(lead: StoredLead) {
  if (isFollowUpDue(lead)) return true;

  const lastContacted = getTime(lead.lastContactedAt);
  if (!lastContacted) return lead.status === "contacted" || lead.status === "negotiating";

  const hoursSinceContact = (Date.now() - lastContacted) / (1000 * 60 * 60);

  return hoursSinceContact >= 48 && (lead.status === "contacted" || lead.status === "negotiating");
}

function parseMoney(value?: string | number | null) {
  if (typeof value === "number") {
    return Number.isFinite(value) && value > 0 ? value : null;
  }

  if (!value) return null;

  const parsed = Number(String(value).replace(/[$,\s]/g, ""));

  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function formatMoney(value: number | null) {
  if (value === null) return "Unavailable";

  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

function getPriorityBoost(lead: StoredLead) {
  if (lead.priority === "High") return 22;
  if (lead.priority === "Medium") return 11;

  return 0;
}

function hasValidPhone(lead: StoredLead) {
  const digits = lead.phone.replace(/\D/g, "");

  return digits.length >= 10;
}

function getLeadName(lead: StoredLead) {
  const name = `${lead.firstName} ${lead.lastName}`.trim();

  return name || lead.ownerName || "Unknown lead";
}

function getEstimatedValue(lead: StoredLead) {
  const arv = parseMoney(lead.analyzer?.arv);
  const repairs = parseMoney(lead.analyzer?.estimatedRepairs);
  const desiredProfit = parseMoney(lead.analyzer?.desiredProfit);

  if (desiredProfit && arv && repairs) {
    return {
      value: desiredProfit,
      label: formatMoney(desiredProfit),
      assumption: "Assumption-based estimate from analyzer ARV, repair estimate, and desired profit fields.",
    };
  }

  return {
    value: null,
    label: "Value unavailable",
    assumption: null,
  };
}

function getMissingValueReasons(lead: StoredLead) {
  return [
    parseMoney(lead.analyzer?.arv) === null ? "missing ARV" : "",
    parseMoney(lead.analyzer?.estimatedRepairs) === null ? "missing repair estimate" : "",
    parseMoney(lead.analyzer?.desiredProfit) === null ? "missing desired profit / assignment fee assumption" : "",
  ].filter(Boolean);
}

function getBlockers(lead: StoredLead) {
  return [
    lead.doNotContact ? "DNC protection active" : "",
    lead.approvalStatus === "rejected" ? "Lead rejected" : "",
    lead.approvalStatus === "needs_human_review" ? "Needs human review" : "",
    lead.approvalStatus === "follow_up_only" ? "Follow-up only state" : "",
    !lead.phone ? "Missing phone" : "",
    lead.phone && !hasValidPhone(lead) ? "Invalid phone" : "",
  ].filter(Boolean);
}

function isBlocked(lead: StoredLead, blockers = getBlockers(lead)) {
  return blockers.some((blocker) =>
    ["DNC protection active", "Lead rejected", "Missing phone", "Invalid phone"].includes(blocker),
  );
}

function isHighOpportunity(lead: StoredLead) {
  return lead.score >= 70 || lead.priority === "High" || Boolean(lead.isHot);
}

function isBuyerReady(lead: StoredLead, blocked: boolean) {
  return !blocked && lead.approvalStatus === "approved_for_outreach" && isHighOpportunity(lead);
}

function isNearContract(lead: StoredLead, blocked: boolean) {
  return !blocked && (lead.status === "negotiating" || (isHighOpportunity(lead) && lead.approvalStatus === "approved_for_outreach"));
}

function getBottlenecks(lead: StoredLead, blockers: string[], missingValueReasons: string[]) {
  const closingReadiness = analyzeClosingReadiness(lead);

  return [
    ...blockers,
    lead.approvalStatus !== "approved_for_outreach" && !lead.doNotContact && lead.approvalStatus !== "rejected" ? "Approval not complete" : "",
    isFollowUpStale(lead) ? "Stale or overdue follow-up" : "",
    lead.status === "under_contract" ? "Buyer / disposition readiness needs review" : "",
    lead.status === "under_contract" && closingReadiness.readinessState !== "closing_ready" ? "Title / contract / closing readiness needs review" : "",
    ...(lead.status === "under_contract" || lead.status === "closed" ? closingReadiness.bottlenecks.slice(0, 4) : []),
    lead.status === "negotiating" && missingValueReasons.includes("missing ARV") ? "ARV missing before offer decision" : "",
    lead.status === "negotiating" && missingValueReasons.includes("missing repair estimate") ? "Repair estimate missing before offer decision" : "",
  ].filter(Boolean);
}

function getNextMoneyAction(lead: StoredLead, blockers: string[], missingValueReasons: string[]): NextMoneyAction {
  const safetyNote = "Guidance only. No outreach sent. Approval is not execution.";
  const closingReadiness = analyzeClosingReadiness(lead);

  if (lead.doNotContact) {
    return {
      label: "Resolve DNC/blocker",
      category: "blocked",
      urgency: "blocked",
      reason: "Do Not Contact protection blocks revenue action and outreach.",
      blocker: "DNC protection active",
      safetyNote,
    };
  }

  if (lead.approvalStatus === "rejected") {
    return {
      label: "No action until reopened",
      category: "blocked",
      urgency: "blocked",
      reason: "Rejected leads should not consume seller or buyer workflow time unless facts change.",
      blocker: "Lead rejected",
      safetyNote,
    };
  }

  if (!lead.phone || !hasValidPhone(lead)) {
    return {
      label: "Verify phone/contact info",
      category: "seller",
      urgency: "high",
      reason: "A valid phone is required before any future controlled seller workflow can be considered.",
      blocker: blockers.find((blocker) => blocker.includes("phone")),
      safetyNote,
    };
  }

  if (lead.status === "under_contract") {
    return {
      label: closingReadiness.nextClosingAction.label,
      category: "closing",
      urgency: "critical",
      reason: closingReadiness.nextClosingAction.reason,
      blocker: closingReadiness.nextClosingAction.blocker,
      safetyNote,
    };
  }

  if (lead.status === "negotiating") {
    if (missingValueReasons.includes("missing ARV")) {
      return {
        label: "Verify ARV",
        category: "valuation",
        urgency: "high",
        reason: "Negotiation needs valuation support before a money decision is reliable.",
        blocker: "Missing ARV",
        safetyNote,
      };
    }

    if (missingValueReasons.includes("missing repair estimate")) {
      return {
        label: "Review repairs",
        category: "valuation",
        urgency: "high",
        reason: "Repair exposure affects offer, assignment spread, and buyer fit.",
        blocker: "Missing repair estimate",
        safetyNote,
      };
    }

    return {
      label: "Move toward contract",
      category: "contract",
      urgency: "high",
      reason: "Lead is already negotiating and should be moved toward a reviewed contract decision if numbers hold.",
      safetyNote,
    };
  }

  if (lead.approvalStatus !== "approved_for_outreach") {
    return {
      label: "Review seller details for approval",
      category: "approval",
      urgency: isHighOpportunity(lead) ? "high" : "medium",
      reason: "Approval state must be clear before any future seller workflow advances.",
      blocker: "Approval not complete",
      safetyNote,
    };
  }

  if (isFollowUpDue(lead)) {
    return {
      label: "Follow up with seller",
      category: "follow_up",
      urgency: "high",
      reason: "Follow-up is due and this lead is approved, but no outreach is sent from this recommendation.",
      safetyNote,
    };
  }

  if (isHighOpportunity(lead)) {
    return {
      label: "Prepare offer review",
      category: "contract",
      urgency: "high",
      reason: "High-priority approved lead should be reviewed for valuation, offer, and contract readiness.",
      safetyNote,
    };
  }

  return {
    label: "Nurture and improve data",
    category: "nurture",
    urgency: "low",
    reason: "Lead needs stronger score, motivation, or deal data before becoming a top revenue opportunity.",
    safetyNote,
  };
}

function getBucket(lead: StoredLead, blocked: boolean, buyerReady: boolean, nearContract: boolean, bottlenecks: string[]): RevenueBucket {
  const closingReadiness = analyzeClosingReadiness(lead);

  if (blocked) return "blocked";
  if ((lead.status === "under_contract" || lead.status === "closed") && closingReadiness.readinessState === "closing_blocked") return "closing_blocked";
  if (lead.status === "under_contract" && bottlenecks.length > 0 && closingReadiness.readinessState !== "closing_ready") return "closing_blocked";
  if (lead.status === "under_contract" || (lead.status === "closed" && closingReadiness.readinessState === "closing_ready")) return "under_contract";
  if (nearContract) return "near_contract";
  if (buyerReady) return "buyer_ready";
  if (isHighOpportunity(lead) && (isFollowUpDue(lead) || lead.approvalStatus === "pending_review" || lead.approvalStatus === "needs_human_review")) return "work_first";
  if (isHighOpportunity(lead)) return "hot_opportunities";
  if (lead.score < 40 && lead.priority === "Low") return "low_priority";

  return "nurture";
}

function getRank(lead: StoredLead, bucket: RevenueBucket, blockers: string[], missingValueReasons: string[]) {
  const bucketBoost: Record<RevenueBucket, number> = {
    under_contract: 115,
    closing_blocked: 105,
    near_contract: 95,
    buyer_ready: 82,
    work_first: 76,
    hot_opportunities: 62,
    nurture: 32,
    low_priority: 10,
    blocked: -40,
  };
  const dueBoost = isFollowUpDue(lead) ? 18 : 0;
  const hotBoost = lead.isHot ? 16 : 0;
  const blockerPenalty = blockers.length * 35;
  const missingValuePenalty = Math.min(18, missingValueReasons.length * 6);

  return Math.max(0, Math.round(bucketBoost[bucket] + lead.score * 0.7 + getPriorityBoost(lead) + dueBoost + hotBoost - blockerPenalty - missingValuePenalty));
}

export function analyzeRevenuePipelineLead(lead: StoredLead): RevenuePipelineLead {
  const closingReadiness = analyzeClosingReadiness(lead);
  const blockers = getBlockers(lead);
  const blocked = isBlocked(lead, blockers);
  const missingValueReasons = getMissingValueReasons(lead);
  const buyerReady = isBuyerReady(lead, blocked);
  const nearContract = isNearContract(lead, blocked);
  const bottlenecks = getBottlenecks(lead, blockers, missingValueReasons);
  const bucket = getBucket(lead, blocked, buyerReady, nearContract, bottlenecks);
  const nextMoneyAction = getNextMoneyAction(lead, blockers, missingValueReasons);
  const estimatedValue = getEstimatedValue(lead);
  const monetizationRank = getRank(lead, bucket, blockers, missingValueReasons);

  return {
    lead,
    bucket,
    monetizationRank,
    urgency: nextMoneyAction.urgency,
    reason: `${getLeadName(lead)} is in ${bucket.replaceAll("_", " ")} because ${nextMoneyAction.reason}`,
    blockers,
    bottlenecks,
    missingValueReasons,
    nextMoneyAction,
    estimatedValue: estimatedValue.value,
    estimatedValueLabel: estimatedValue.label,
    estimatedValueAssumption: estimatedValue.assumption,
    isActionable: !blocked && bucket !== "low_priority" && bucket !== "nurture",
    isBuyerReady: buyerReady,
    isNearContract: nearContract,
    isClosingRelated: lead.status === "under_contract" || lead.status === "closed",
    closingReadinessState: closingReadiness.readinessState,
    revenueRealizationRisk: closingReadiness.revenueRealizationRisk,
  };
}

export function getRevenuePipelineSummary(leads: StoredLead[]): RevenuePipelineSummary {
  const rankedLeads = leads
    .map(analyzeRevenuePipelineLead)
    .sort((a, b) => b.monetizationRank - a.monetizationRank || getTime(b.lead.timestamp) - getTime(a.lead.timestamp));
  const buckets = REVENUE_BUCKETS.reduce(
    (accumulator, bucket) => ({
      ...accumulator,
      [bucket]: rankedLeads.filter((item) => item.bucket === bucket),
    }),
    {} as Record<RevenueBucket, RevenuePipelineLead[]>,
  );
  const estimatedValues = rankedLeads
    .map((item) => item.estimatedValue)
    .filter((value): value is number => typeof value === "number" && Number.isFinite(value));
  const estimatedPipelineValue = estimatedValues.length > 0 ? estimatedValues.reduce((total, value) => total + value, 0) : null;
  const bottleneckCounts = new Map<string, number>();

  rankedLeads.forEach((item) => {
    item.bottlenecks.forEach((bottleneck) => {
      bottleneckCounts.set(bottleneck, (bottleneckCounts.get(bottleneck) ?? 0) + 1);
    });
  });

  return {
    totalLeads: leads.length,
    actionableLeads: rankedLeads.filter((item) => item.isActionable).length,
    blockedLeads: buckets.blocked.length,
    hotOpportunities: rankedLeads.filter((item) => isHighOpportunity(item.lead)).length,
    buyerReadyLeads: rankedLeads.filter((item) => item.isBuyerReady).length,
    nearContractLeads: rankedLeads.filter((item) => item.isNearContract).length,
    underContractLeads: rankedLeads.filter((item) => item.lead.status === "under_contract").length,
    closingReadyLeads: rankedLeads.filter((item) => item.closingReadinessState === "closing_ready").length,
    closingBlockedLeads: buckets.closing_blocked.length,
    estimatedPipelineValue,
    estimatedPipelineValueLabel: estimatedPipelineValue === null ? "Unavailable" : formatMoney(estimatedPipelineValue),
    missingValueReasons: [...new Set(rankedLeads.flatMap((item) => item.missingValueReasons))],
    topBottlenecks: [...bottleneckCounts.entries()]
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5),
    workFirstLeads: rankedLeads.filter((item) => item.bucket === "work_first" || item.bucket === "near_contract" || item.bucket === "under_contract" || item.bucket === "closing_blocked").slice(0, 5),
    rankedLeads,
    buckets,
  };
}
