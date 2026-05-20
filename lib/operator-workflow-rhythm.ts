import type { StoredLead } from "@/lib/leads-storage";
import {
  getOperatorWorkqueueSummary,
  type OperationsStage,
  type OperatorWorkqueueItem,
} from "@/lib/operator-workqueue";

export type WorkflowAgingTier = "fresh" | "aging" | "overdue" | "critical";

export type WorkflowTimingCategory =
  | "follow_up"
  | "acquisition"
  | "disposition"
  | "assignment"
  | "closing"
  | "title"
  | "data_quality"
  | "monitor";

export type ConceptualOwnerGroup =
  | "acquisition"
  | "disposition"
  | "closing"
  | "manual_review"
  | "data_quality"
  | "monitor_only";

export type EscalationTier = "monitor" | "action_needed" | "urgent" | "executive_attention";

export type WorkflowRhythmState =
  | "due_today"
  | "due_soon"
  | "overdue"
  | "waiting"
  | "blocked_waiting"
  | "monitor_only"
  | "recently_updated";

export type WorkflowExpectation = {
  timingCategory: WorkflowTimingCategory;
  expectedWorkflowRhythm: string;
  currentStatus: string;
  escalationSuggestion: string;
};

export type WorkflowRhythmItem = {
  workItem: OperatorWorkqueueItem;
  agingTier: WorkflowAgingTier;
  agingReason: string;
  stalledDurationEstimate: string | null;
  recommendedTimingUrgency: string;
  expectation: WorkflowExpectation;
  ownerGroup: ConceptualOwnerGroup;
  escalationTier: EscalationTier;
  escalationReason: string;
  escalationVisibilityLabel: string;
  rhythmState: WorkflowRhythmState;
  whyInThisGroup: string;
  nextExpectedMilestone: string;
  operationalRecommendation: string;
  refinedTimeline: Array<{
    stage: OperationsStage;
    label: string;
    status: OperatorWorkqueueItem["timeline"][number]["status"];
    note: string;
    agingTier?: WorkflowAgingTier;
    escalationTier?: EscalationTier;
    rhythmState?: WorkflowRhythmState;
    ownerGroup?: ConceptualOwnerGroup;
    nextExpectedMilestone?: string;
  }>;
  safetyNote: string;
};

export type OperatorWorkflowRhythmSummary = {
  totalItems: number;
  urgentCount: number;
  overdueCount: number;
  blockedCount: number;
  staleCount: number;
  titleBlockerCount: number;
  underContractRiskCount: number;
  monitorOnlyCount: number;
  dueTodayItems: WorkflowRhythmItem[];
  dueSoonItems: WorkflowRhythmItem[];
  overdueItems: WorkflowRhythmItem[];
  criticalAgingItems: WorkflowRhythmItem[];
  escalatedItems: WorkflowRhythmItem[];
  waitingOnSellerItems: WorkflowRhythmItem[];
  waitingOnBuyerItems: WorkflowRhythmItem[];
  waitingOnTitleItems: WorkflowRhythmItem[];
  monitorOnlyItems: WorkflowRhythmItem[];
  recentlyUpdatedItems: WorkflowRhythmItem[];
  rankedItems: WorkflowRhythmItem[];
};

const SAFETY_NOTE =
  "Operational timing guidance only. No outreach sent, no automation executed, and no documents generated.";

function getTime(value?: Date | string | null) {
  if (!value) return 0;

  const time = new Date(value).getTime();

  return Number.isNaN(time) ? 0 : time;
}

function getAgeHours(value?: Date | string | null) {
  const time = getTime(value);

  if (!time) return null;

  return Math.max(0, (Date.now() - time) / (1000 * 60 * 60));
}

function describeDuration(hours: number | null) {
  if (hours === null) return null;
  if (hours < 1) return "less than 1 hour";
  if (hours < 24) return `${Math.round(hours)} hour(s)`;

  return `${Math.round(hours / 24)} day(s)`;
}

function isRecentlyUpdated(lead: StoredLead) {
  const newestActivity = Math.max(
    getTime(lead.lastContactedAt),
    getTime(lead.latestApprovalAt),
    getTime(lead.latestMockOutreachAt),
    getTime(lead.timestamp),
  );

  if (!newestActivity) return false;

  return Date.now() - newestActivity <= 24 * 60 * 60 * 1000;
}

function getFollowUpDeltaHours(lead: StoredLead) {
  const nextFollowUp = getTime(lead.nextFollowUpAt);

  if (!nextFollowUp) return null;

  return (nextFollowUp - Date.now()) / (1000 * 60 * 60);
}

function getOwnerGroup(item: OperatorWorkqueueItem): ConceptualOwnerGroup {
  if (item.humanReviewState === "manual_review_required") return "manual_review";
  if (item.currentStage === "blocked") return "manual_review";
  if (item.recommendedNextAction.category === "closing" || item.currentStage === "closing" || item.currentStage === "payout_readiness") return "closing";
  if (item.recommendedNextAction.category === "disposition" || item.currentStage === "disposition" || item.currentStage === "assignment") return "disposition";
  if (item.recommendedNextAction.category === "valuation" || item.recommendedNextAction.category === "approval" || item.recommendedNextAction.category === "seller") return "acquisition";
  if (item.recommendedNextAction.category === "nurture" && item.riskTier === "low_risk") return "monitor_only";
  if (item.category === "missing_critical_data") return "data_quality";

  return "acquisition";
}

function getAging(item: OperatorWorkqueueItem): {
  agingTier: WorkflowAgingTier;
  agingReason: string;
  stalledDurationEstimate: string | null;
} {
  const lead = item.lead;
  const followUpDelta = getFollowUpDeltaHours(lead);
  const lastContactAge = getAgeHours(lead.lastContactedAt);
  const createdAge = getAgeHours(lead.timestamp);
  const stalledDurationEstimate = describeDuration(lastContactAge ?? createdAge);

  if (item.riskTier === "blocked" || item.urgencyTier === "critical") {
    return {
      agingTier: "critical",
      agingReason: item.stallReason ?? item.blocker ?? "Critical operational item needs review.",
      stalledDurationEstimate,
    };
  }

  if (followUpDelta !== null && followUpDelta <= 0) {
    return {
      agingTier: followUpDelta <= -48 ? "critical" : "overdue",
      agingReason: "Follow-up timing is overdue.",
      stalledDurationEstimate: describeDuration(Math.abs(followUpDelta)),
    };
  }

  if (item.stallReason) {
    return {
      agingTier: item.lead.status === "under_contract" ? "critical" : "overdue",
      agingReason: item.stallReason,
      stalledDurationEstimate,
    };
  }

  if (lead.status === "under_contract" && item.sourceSignals.closingReadiness !== "closing_ready") {
    return {
      agingTier: "overdue",
      agingReason: "Under-contract deal has unresolved closing or assignment timing pressure.",
      stalledDurationEstimate,
    };
  }

  if (lastContactAge !== null && lastContactAge >= 48) {
    return {
      agingTier: "aging",
      agingReason: "Lead has not had recent captured contact activity.",
      stalledDurationEstimate,
    };
  }

  if (createdAge !== null && createdAge >= 72 && lead.status === "new") {
    return {
      agingTier: "aging",
      agingReason: "New lead has aged without visible workflow movement.",
      stalledDurationEstimate: describeDuration(createdAge),
    };
  }

  return {
    agingTier: "fresh",
    agingReason: isRecentlyUpdated(lead) ? "Recent activity exists." : "No timing pressure detected from current metadata.",
    stalledDurationEstimate,
  };
}

function getEscalation(item: OperatorWorkqueueItem, agingTier: WorkflowAgingTier): {
  escalationTier: EscalationTier;
  escalationReason: string;
  escalationVisibilityLabel: string;
} {
  if (item.riskTier === "blocked" && agingTier === "critical") {
    return {
      escalationTier: "executive_attention",
      escalationReason: "Blocked critical item could trap revenue or create workflow risk.",
      escalationVisibilityLabel: "Executive attention",
    };
  }

  if (agingTier === "critical" || item.riskTier === "high_risk") {
    return {
      escalationTier: "urgent",
      escalationReason: item.blocker ?? item.stallReason ?? "High-risk operational item needs urgent human review.",
      escalationVisibilityLabel: "Urgent",
    };
  }

  if (agingTier === "overdue" || item.humanReviewState === "high_attention_required") {
    return {
      escalationTier: "action_needed",
      escalationReason: item.stallReason ?? "Workflow timing or review state needs operator action.",
      escalationVisibilityLabel: "Action needed",
    };
  }

  return {
    escalationTier: "monitor",
    escalationReason: "No escalation required from current metadata.",
    escalationVisibilityLabel: "Monitor",
  };
}

function getExpectation(item: OperatorWorkqueueItem, agingTier: WorkflowAgingTier, ownerGroup: ConceptualOwnerGroup): WorkflowExpectation {
  if (item.lead.nextFollowUpAt) {
    return {
      timingCategory: "follow_up",
      expectedWorkflowRhythm: "Follow-up should be reviewed by its due date.",
      currentStatus: agingTier === "fresh" ? "Follow-up timing is not overdue." : "Follow-up timing needs review.",
      escalationSuggestion: agingTier === "critical" || agingTier === "overdue" ? "Move into today's operator review list." : "Monitor timing.",
    };
  }

  if (item.currentStage === "closing" || ownerGroup === "closing") {
    return {
      timingCategory: item.bottlenecks.some((bottleneck) => bottleneck.toLowerCase().includes("title")) ? "title" : "closing",
      expectedWorkflowRhythm: "Under-contract and closing items should have buyer, title, contract, earnest-money, and closing-date visibility.",
      currentStatus: item.sourceSignals.closingReadiness.replaceAll("_", " "),
      escalationSuggestion: item.riskTier === "blocked" || agingTier === "critical" ? "Escalate closing blocker for human review." : "Keep closing checklist current.",
    };
  }

  if (ownerGroup === "disposition") {
    return {
      timingCategory: item.currentStage === "assignment" ? "assignment" : "disposition",
      expectedWorkflowRhythm: "Buyer-ready work should move toward package review, match review, and assignment readiness.",
      currentStatus: item.sourceSignals.buyerReadiness.replaceAll("_", " "),
      escalationSuggestion: agingTier === "overdue" || agingTier === "critical" ? "Review disposition blocker today." : "Monitor buyer-side readiness.",
    };
  }

  if (ownerGroup === "data_quality") {
    return {
      timingCategory: "data_quality",
      expectedWorkflowRhythm: "Missing critical data should be cleared before operational decisions are trusted.",
      currentStatus: "Data-quality review needed.",
      escalationSuggestion: "Prioritize missing data that blocks valuation, buyer readiness, or closing readiness.",
    };
  }

  return {
    timingCategory: "acquisition",
    expectedWorkflowRhythm: "Acquisition work should progress through review, approval, follow-up, and negotiation without stale gaps.",
    currentStatus: item.currentStage.replaceAll("_", " "),
    escalationSuggestion: agingTier === "fresh" ? "Monitor normally." : "Move into active operator review.",
  };
}

function getRhythmState(item: OperatorWorkqueueItem, agingTier: WorkflowAgingTier): WorkflowRhythmState {
  const followUpDelta = getFollowUpDeltaHours(item.lead);

  if (item.riskTier === "blocked") return "blocked_waiting";
  if (agingTier === "critical" || agingTier === "overdue") return "overdue";
  if (followUpDelta !== null && followUpDelta <= 24) return "due_today";
  if (followUpDelta !== null && followUpDelta <= 72) return "due_soon";
  if (isRecentlyUpdated(item.lead) && agingTier === "fresh") return "recently_updated";
  if (item.recommendedNextAction.category === "nurture" || item.category === "monitor") return "monitor_only";

  return "waiting";
}

function getMilestone(item: OperatorWorkqueueItem, ownerGroup: ConceptualOwnerGroup) {
  if (ownerGroup === "manual_review") return "Human review decision";
  if (ownerGroup === "closing") return "Clear closing blocker or confirm closing checklist";
  if (ownerGroup === "disposition") return "Disposition package or buyer-match review";
  if (ownerGroup === "data_quality") return "Complete missing critical data";
  if (ownerGroup === "monitor_only") return "Monitor for stronger revenue signal";

  return item.recommendedNextAction.label;
}

function getWhyInGroup(item: OperatorWorkqueueItem, rhythmState: WorkflowRhythmState, agingTier: WorkflowAgingTier) {
  if (rhythmState === "blocked_waiting") return item.blocker ?? "Blocked item is waiting for human review.";
  if (rhythmState === "overdue") return item.stallReason ?? "Workflow timing is overdue or critical.";
  if (rhythmState === "due_today") return "Follow-up or operational review is due within 24 hours.";
  if (rhythmState === "due_soon") return "Follow-up or operational review is due soon.";
  if (rhythmState === "recently_updated") return "Recent lead activity keeps this item fresh.";
  if (rhythmState === "monitor_only") return "No active timing pressure detected.";

  return agingTier === "aging" ? "Workflow is aging and should stay visible." : "Waiting on the next operator milestone.";
}

function enrichTimeline(
  item: OperatorWorkqueueItem,
  agingTier: WorkflowAgingTier,
  escalationTier: EscalationTier,
  rhythmState: WorkflowRhythmState,
  ownerGroup: ConceptualOwnerGroup,
  nextExpectedMilestone: string,
): WorkflowRhythmItem["refinedTimeline"] {
  return item.timeline.map((stage) => ({
    ...stage,
    agingTier: stage.stage === item.currentStage || stage.stage === item.stalledStage ? agingTier : undefined,
    escalationTier: stage.stage === item.currentStage || stage.stage === item.stalledStage ? escalationTier : undefined,
    rhythmState: stage.stage === item.currentStage || stage.stage === item.stalledStage ? rhythmState : undefined,
    ownerGroup: stage.stage === item.currentStage || stage.stage === item.stalledStage ? ownerGroup : undefined,
    nextExpectedMilestone: stage.stage === item.currentStage || stage.stage === item.stalledStage ? nextExpectedMilestone : undefined,
  }));
}

export function analyzeWorkflowRhythmItem(item: OperatorWorkqueueItem): WorkflowRhythmItem {
  const aging = getAging(item);
  const ownerGroup = getOwnerGroup(item);
  const escalation = getEscalation(item, aging.agingTier);
  const rhythmState = getRhythmState(item, aging.agingTier);
  const expectation = getExpectation(item, aging.agingTier, ownerGroup);
  const nextExpectedMilestone = getMilestone(item, ownerGroup);

  return {
    workItem: item,
    agingTier: aging.agingTier,
    agingReason: aging.agingReason,
    stalledDurationEstimate: aging.stalledDurationEstimate,
    recommendedTimingUrgency: escalation.escalationVisibilityLabel,
    expectation,
    ownerGroup,
    escalationTier: escalation.escalationTier,
    escalationReason: escalation.escalationReason,
    escalationVisibilityLabel: escalation.escalationVisibilityLabel,
    rhythmState,
    whyInThisGroup: getWhyInGroup(item, rhythmState, aging.agingTier),
    nextExpectedMilestone,
    operationalRecommendation: item.recommendedNextAction.label,
    refinedTimeline: enrichTimeline(item, aging.agingTier, escalation.escalationTier, rhythmState, ownerGroup, nextExpectedMilestone),
    safetyNote: SAFETY_NOTE,
  };
}

export function getOperatorWorkflowRhythmSummary(leads: StoredLead[]): OperatorWorkflowRhythmSummary {
  const workqueueSummary = getOperatorWorkqueueSummary(leads);
  const rankedItems = workqueueSummary.rankedItems.map(analyzeWorkflowRhythmItem);

  return {
    totalItems: rankedItems.length,
    urgentCount: rankedItems.filter((item) => item.escalationTier === "urgent" || item.escalationTier === "executive_attention").length,
    overdueCount: rankedItems.filter((item) => item.rhythmState === "overdue").length,
    blockedCount: rankedItems.filter((item) => item.rhythmState === "blocked_waiting").length,
    staleCount: rankedItems.filter((item) => item.agingTier === "aging" || item.agingTier === "overdue" || item.agingTier === "critical").length,
    titleBlockerCount: rankedItems.filter((item) => item.workItem.bottlenecks.some((bottleneck) => bottleneck.toLowerCase().includes("title"))).length,
    underContractRiskCount: rankedItems.filter((item) => item.workItem.lead.status === "under_contract" && item.workItem.riskTier !== "low_risk").length,
    monitorOnlyCount: rankedItems.filter((item) => item.rhythmState === "monitor_only").length,
    dueTodayItems: rankedItems.filter((item) => item.rhythmState === "due_today").slice(0, 5),
    dueSoonItems: rankedItems.filter((item) => item.rhythmState === "due_soon").slice(0, 5),
    overdueItems: rankedItems.filter((item) => item.rhythmState === "overdue").slice(0, 5),
    criticalAgingItems: rankedItems.filter((item) => item.agingTier === "critical").slice(0, 5),
    escalatedItems: rankedItems.filter((item) => item.escalationTier === "urgent" || item.escalationTier === "executive_attention").slice(0, 5),
    waitingOnSellerItems: rankedItems.filter((item) => item.ownerGroup === "acquisition" && item.rhythmState === "waiting").slice(0, 5),
    waitingOnBuyerItems: rankedItems.filter((item) => item.ownerGroup === "disposition" && item.rhythmState === "waiting").slice(0, 5),
    waitingOnTitleItems: rankedItems.filter((item) => item.ownerGroup === "closing" && item.workItem.bottlenecks.some((bottleneck) => bottleneck.toLowerCase().includes("title"))).slice(0, 5),
    monitorOnlyItems: rankedItems.filter((item) => item.rhythmState === "monitor_only").slice(0, 5),
    recentlyUpdatedItems: rankedItems.filter((item) => item.rhythmState === "recently_updated").slice(0, 5),
    rankedItems,
  };
}
