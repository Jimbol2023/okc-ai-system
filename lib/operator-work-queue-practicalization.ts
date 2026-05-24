import type { StoredLead } from "./leads-storage";
import { createDashboardSignalConsolidation, dashboardSignalConsolidationFlags } from "./dashboard-signal-consolidation";
import type { R53ManualRevenueMetricsResult } from "./r53-manual-revenue-metrics-helper";
import { getOperatorWorkqueueSummary } from "./operator-workqueue";
import { createRealManualFollowUpWorkspaceModel } from "./real-manual-follow-up-workspace-adapter";
import { createRealManualLeadDecision } from "./real-manual-lead-operations-decision-adapter";

export const practicalOperatorWorkQueueFlags = {
  ...dashboardSignalConsolidationFlags,
  practicalQueuePersisted: false,
  practicalQueueItemCreated: false,
  queueCreated: false,
  operatorTaskCreated: false,
  operatorRouted: false,
  operatorWorkAssigned: false,
  operatorAssignmentCreated: false,
  queueReminderCreated: false,
  queueCalendarItemCreated: false,
  queueNotificationCreated: false,
  queueWorkflowStateChanged: false,
  queuePollingEnabled: false,
  queueAutomationTriggered: false,
  queueCrmMutationAllowed: false,
} as const;

export const practicalOperatorWorkQueueLanes = [
  "stop_first",
  "cleanup_first",
  "overdue_follow_up",
  "review_now",
  "near_close_review",
  "buyer_ready_review",
  "monitor",
] as const;

export type PracticalOperatorWorkQueueLane = (typeof practicalOperatorWorkQueueLanes)[number];

export type PracticalOperatorWorkQueueRow = {
  leadId: string;
  leadLabel: string;
  sourceVisible: string;
  queueLane: PracticalOperatorWorkQueueLane;
  priorityRank: number;
  reason: string;
  blockerLabels: string[];
  cleanupLabels: string[];
  followUpLabel: string;
  safeManualReview: string;
  detailHref: string;
  advisoryOnly: true;
  readOnly: true;
  flags: typeof practicalOperatorWorkQueueFlags;
};

export type PracticalOperatorWorkQueue = {
  rows: PracticalOperatorWorkQueueRow[];
  visibleRows: PracticalOperatorWorkQueueRow[];
  laneCounts: Record<PracticalOperatorWorkQueueLane, number>;
  emptyState: string;
  dashboardPriority: ReturnType<typeof createDashboardSignalConsolidation>["topOperatorPriority"];
  recommendedNextExactStep: "Seller Call Outcome Usability";
  advisoryOnly: true;
  readOnly: true;
  flags: typeof practicalOperatorWorkQueueFlags;
};

const lanePriority: Record<PracticalOperatorWorkQueueLane, number> = {
  stop_first: 700,
  cleanup_first: 600,
  overdue_follow_up: 500,
  review_now: 400,
  near_close_review: 350,
  buyer_ready_review: 300,
  monitor: 100,
};

function getLeadLabel(lead: StoredLead) {
  const sellerName = `${lead.firstName ?? ""} ${lead.lastName ?? ""}`.trim();
  return sellerName || lead.propertyAddress || lead.ownerName || lead.id;
}

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function formatLabel(value: string) {
  return value.replaceAll("_", " ");
}

function getSellerContextCleanup(lead: StoredLead) {
  return !lead.situationDetails?.trim() ? ["seller context"] : [];
}

function getQueueLane({
  lead,
  decisionLane,
  followUpLane,
}: {
  lead: StoredLead;
  decisionLane: ReturnType<typeof createRealManualLeadDecision>["decisionLane"];
  followUpLane: ReturnType<typeof createRealManualFollowUpWorkspaceModel>["lane"];
}): PracticalOperatorWorkQueueLane {
  if (decisionLane === "stop_do_not_work" || followUpLane === "blocked_no_follow_up") return "stop_first";
  if (decisionLane === "cleanup_before_decision" || followUpLane === "cleanup_before_follow_up" || getSellerContextCleanup(lead).length > 0) return "cleanup_first";
  if (followUpLane === "overdue_manual_review") return "overdue_follow_up";
  if (decisionLane === "review_revenue_now" || decisionLane === "review_revenue_today") return "review_now";
  if (lead.status === "under_contract") return "near_close_review";
  if (lead.approvalStatus === "approved_for_outreach") return "buyer_ready_review";
  return "monitor";
}

function getReason(lane: PracticalOperatorWorkQueueLane) {
  if (lane === "stop_first") return "Blocked, DNC, rejected, or contact-safety state must be inspected first.";
  if (lane === "cleanup_first") return "Missing lead or seller context blocks reliable review.";
  if (lane === "overdue_follow_up") return "Manual follow-up timing is overdue.";
  if (lane === "review_now") return "High-value or high-priority revenue review deserves operator attention.";
  if (lane === "near_close_review") return "Under-contract or near-close records need careful manual review.";
  if (lane === "buyer_ready_review") return "Buyer-ready or disposition-related context should be checked manually.";
  return "No urgent operator signal is visible; monitor behind higher-priority records.";
}

function getSafeReview({
  lane,
  decisionReview,
  followUpReview,
}: {
  lane: PracticalOperatorWorkQueueLane;
  decisionReview: string;
  followUpReview: string;
}) {
  if (lane === "overdue_follow_up") return followUpReview;
  if (lane === "stop_first") return "Stop before work. Confirm blocked, DNC, rejected, or contact-safety state manually.";
  if (lane === "cleanup_first") return "Clean up missing data before any manual follow-up or revenue review.";
  return decisionReview;
}

function createEmptyLaneCounts(): Record<PracticalOperatorWorkQueueLane, number> {
  return practicalOperatorWorkQueueLanes.reduce(
    (counts, lane) => ({ ...counts, [lane]: 0 }),
    {} as Record<PracticalOperatorWorkQueueLane, number>,
  );
}

export function createPracticalOperatorWorkQueue(
  leads: StoredLead[],
  metrics: R53ManualRevenueMetricsResult,
  maxVisibleRows = 8,
  now = new Date(),
): PracticalOperatorWorkQueue {
  const dashboardSignal = createDashboardSignalConsolidation(leads, metrics);
  const operatorSummary = getOperatorWorkqueueSummary(leads);
  const operatorRankByLeadId = new Map(operatorSummary.rankedItems.map((item) => [item.lead.id, item.operatorPriorityRank]));
  const rows = leads.map((lead) => {
    const decision = createRealManualLeadDecision(lead);
    const followUp = createRealManualFollowUpWorkspaceModel(lead, now);
    const cleanupLabels = unique([...decision.missingData, ...followUp.missingData, ...getSellerContextCleanup(lead)]);
    const blockerLabels = unique([
      lead.doNotContact ? "DNC" : "",
      lead.approvalStatus === "rejected" ? "rejected" : "",
      ...followUp.blockerFlags,
    ]);
    const queueLane = getQueueLane({
      lead,
      decisionLane: decision.decisionLane,
      followUpLane: followUp.lane,
    });
    const operatorRank = operatorRankByLeadId.get(lead.id) ?? 0;
    const priorityRank = lanePriority[queueLane] + decision.advisoryDecisionScore + operatorRank + Math.max(0, lead.score);

    return {
      leadId: lead.id,
      leadLabel: getLeadLabel(lead),
      sourceVisible: lead.source || "missing source",
      queueLane,
      priorityRank,
      reason: getReason(queueLane),
      blockerLabels,
      cleanupLabels,
      followUpLabel: formatLabel(followUp.lane),
      safeManualReview: getSafeReview({
        lane: queueLane,
        decisionReview: decision.safeManualNextReview,
        followUpReview: followUp.safeManualNextReview,
      }),
      detailHref: `/dashboard/leads/${lead.id}`,
      advisoryOnly: true as const,
      readOnly: true as const,
      flags: practicalOperatorWorkQueueFlags,
    };
  });
  const sortedRows = [...rows].sort(
    (a, b) =>
      lanePriority[b.queueLane] - lanePriority[a.queueLane] ||
      b.priorityRank - a.priorityRank ||
      a.leadId.localeCompare(b.leadId),
  );
  const laneCounts = sortedRows.reduce((counts, row) => {
    counts[row.queueLane] += 1;
    return counts;
  }, createEmptyLaneCounts());

  return {
    rows: sortedRows,
    visibleRows: sortedRows.slice(0, Math.max(0, maxVisibleRows)),
    laneCounts,
    emptyState: "No manual work queue rows are visible. Monitor new leads and keep source tracking clean.",
    dashboardPriority: dashboardSignal.topOperatorPriority,
    recommendedNextExactStep: "Seller Call Outcome Usability",
    advisoryOnly: true,
    readOnly: true,
    flags: practicalOperatorWorkQueueFlags,
  };
}

export function createPracticalOperatorWorkQueueSummary() {
  return {
    phase: "Operator Work Queue Practicalization" as const,
    practicalOperatorWorkQueueReady: true,
    recommendedNextExactStep: "Seller Call Outcome Usability",
    advisoryOnly: true,
    readOnly: true,
    flags: practicalOperatorWorkQueueFlags,
  };
}
