import type { StoredLead } from "@/lib/leads-storage";
import {
  getOperatorWorkflowRhythmSummary,
  type ConceptualOwnerGroup,
  type EscalationTier,
  type WorkflowAgingTier,
  type WorkflowRhythmItem,
  type WorkflowRhythmState,
} from "@/lib/operator-workflow-rhythm";

export type ReportingTrendState = "improving" | "stable" | "worsening" | "unknown";

export type ReportingSeverity = "low" | "medium" | "high" | "critical";

export type ReportingWorkflowArea =
  | "acquisition"
  | "disposition"
  | "assignment"
  | "closing"
  | "title"
  | "manual_review"
  | "data_quality"
  | "operations";

export type OperationalSnapshot = {
  key: string;
  label: string;
  count: number;
  severityDistribution: Record<ReportingSeverity, number>;
  trend: ReportingTrendState;
  trendHint: string;
  topOperationalConcern: string;
  operationalRecommendation: string;
};

export type OperationalTrend = {
  key: string;
  label: string;
  state: ReportingTrendState;
  confidence: "low" | "medium";
  reason: string;
  uncertainty: string;
};

export type RepeatedBottleneck = {
  category: string;
  frequencyEstimate: number;
  severity: ReportingSeverity;
  affectedWorkflowArea: ReportingWorkflowArea;
  operationalRecommendation: string;
};

export type OperationalPerformanceSummary = {
  workflowStageDistribution: Array<{ label: string; count: number }>;
  agingDistribution: Record<WorkflowAgingTier, number>;
  escalationDistribution: Record<EscalationTier, number>;
  rhythmDistribution: Record<WorkflowRhythmState, number>;
  ownerLoadDistribution: Record<ConceptualOwnerGroup, number>;
  closingRiskCount: number;
  stalledDealCount: number;
  followUpBacklogCount: number;
  workloadPressure: ReportingSeverity;
  workloadPressureReason: string;
};

export type OperatorReportingSummary = {
  snapshots: OperationalSnapshot[];
  trends: OperationalTrend[];
  repeatedBottlenecks: RepeatedBottleneck[];
  performance: OperationalPerformanceSummary;
  todayPriorities: WorkflowRhythmItem[];
  weeklyWorkflowHealth: string;
  revenueAtRiskSummary: string;
  escalationSummary: string;
  followUpBacklogSummary: string;
  closingRiskSummary: string;
  reportingConsistencyNote: string;
  safetyNote: string;
};

const SAFETY_NOTE =
  "Operational reporting only. Guidance only. No outreach sent, no automation executed, and no documents generated.";

function emptySeverityDistribution(): Record<ReportingSeverity, number> {
  return {
    low: 0,
    medium: 0,
    high: 0,
    critical: 0,
  };
}

function incrementSeverity(distribution: Record<ReportingSeverity, number>, severity: ReportingSeverity) {
  return {
    ...distribution,
    [severity]: distribution[severity] + 1,
  };
}

function getSeverity(item: WorkflowRhythmItem): ReportingSeverity {
  if (item.agingTier === "critical" || item.escalationTier === "executive_attention") return "critical";
  if (item.escalationTier === "urgent" || item.workItem.riskTier === "high_risk" || item.workItem.riskTier === "blocked") return "high";
  if (item.escalationTier === "action_needed" || item.agingTier === "overdue" || item.agingTier === "aging") return "medium";

  return "low";
}

function getSeverityDistribution(items: WorkflowRhythmItem[]) {
  return items.reduce((distribution, item) => incrementSeverity(distribution, getSeverity(item)), emptySeverityDistribution());
}

function getTrendFromPressure(count: number, total: number): { trend: ReportingTrendState; hint: string } {
  if (total === 0) {
    return {
      trend: "unknown",
      hint: "No active items are available for trend inference.",
    };
  }

  const ratio = count / total;

  if (ratio >= 0.45) {
    return {
      trend: "worsening",
      hint: "Snapshot pressure is elevated. Durable historical trend data is not available yet.",
    };
  }

  if (ratio <= 0.12) {
    return {
      trend: "stable",
      hint: "Snapshot pressure appears contained. Historical baseline is not available yet.",
    };
  }

  return {
    trend: "unknown",
    hint: "Snapshot is mixed. Durable history is needed for true trend direction.",
  };
}

function getTopConcern(items: WorkflowRhythmItem[], fallback: string) {
  const firstConcern = items.find((item) => item.workItem.blocker || item.workItem.stallReason || item.agingReason);

  return firstConcern?.workItem.blocker ?? firstConcern?.workItem.stallReason ?? firstConcern?.agingReason ?? fallback;
}

function snapshot({
  key,
  label,
  items,
  total,
  recommendation,
  fallbackConcern,
}: {
  key: string;
  label: string;
  items: WorkflowRhythmItem[];
  total: number;
  recommendation: string;
  fallbackConcern: string;
}): OperationalSnapshot {
  const trend = getTrendFromPressure(items.length, total);

  return {
    key,
    label,
    count: items.length,
    severityDistribution: getSeverityDistribution(items),
    trend: trend.trend,
    trendHint: trend.hint,
    topOperationalConcern: getTopConcern(items, fallbackConcern),
    operationalRecommendation: recommendation,
  };
}

function getAreaFromBottleneck(label: string): ReportingWorkflowArea {
  const normalized = label.toLowerCase();

  if (normalized.includes("title")) return "title";
  if (normalized.includes("buyer") || normalized.includes("assignment")) return "assignment";
  if (normalized.includes("closing") || normalized.includes("earnest")) return "closing";
  if (normalized.includes("arv") || normalized.includes("repair") || normalized.includes("data")) return "data_quality";
  if (normalized.includes("approval") || normalized.includes("review") || normalized.includes("dnc") || normalized.includes("rejected")) return "manual_review";
  if (normalized.includes("follow")) return "acquisition";

  return "operations";
}

function getRepeatedBottlenecks(items: WorkflowRhythmItem[]): RepeatedBottleneck[] {
  const counts = new Map<string, number>();

  items.forEach((item) => {
    item.workItem.bottlenecks.forEach((bottleneck) => {
      counts.set(bottleneck, (counts.get(bottleneck) ?? 0) + 1);
    });
  });

  return [...counts.entries()]
    .filter(([, count]) => count >= 2)
    .map(([category, frequencyEstimate]) => {
      const severity: ReportingSeverity = frequencyEstimate >= 5 ? "critical" : frequencyEstimate >= 3 ? "high" : "medium";
      const affectedWorkflowArea = getAreaFromBottleneck(category);

      return {
        category,
        frequencyEstimate,
        severity,
        affectedWorkflowArea,
        operationalRecommendation: `Review repeated ${category.toLowerCase()} bottleneck in ${affectedWorkflowArea.replaceAll("_", " ")} workflow. Reporting only; no automation is triggered.`,
      };
    })
    .sort((a, b) => b.frequencyEstimate - a.frequencyEstimate)
    .slice(0, 8);
}

function countBy<T extends string>(items: WorkflowRhythmItem[], getter: (item: WorkflowRhythmItem) => T, keys: readonly T[]): Record<T, number> {
  const initial = keys.reduce((accumulator, key) => ({ ...accumulator, [key]: 0 }), {} as Record<T, number>);

  return items.reduce(
    (accumulator, item) => ({
      ...accumulator,
      [getter(item)]: accumulator[getter(item)] + 1,
    }),
    initial,
  );
}

function getPerformance(items: WorkflowRhythmItem[]): OperationalPerformanceSummary {
  const agingDistribution = countBy(items, (item) => item.agingTier, ["fresh", "aging", "overdue", "critical"] as const);
  const escalationDistribution = countBy(items, (item) => item.escalationTier, ["monitor", "action_needed", "urgent", "executive_attention"] as const);
  const rhythmDistribution = countBy(items, (item) => item.rhythmState, ["due_today", "due_soon", "overdue", "waiting", "blocked_waiting", "monitor_only", "recently_updated"] as const);
  const ownerLoadDistribution = countBy(items, (item) => item.ownerGroup, ["acquisition", "disposition", "closing", "manual_review", "data_quality", "monitor_only"] as const);
  const stageCounts = new Map<string, number>();

  items.forEach((item) => {
    const stage = item.workItem.currentStage.replaceAll("_", " ");
    stageCounts.set(stage, (stageCounts.get(stage) ?? 0) + 1);
  });

  const pressureCount =
    escalationDistribution.urgent +
    escalationDistribution.executive_attention +
    rhythmDistribution.overdue +
    rhythmDistribution.blocked_waiting;
  const pressureRatio = items.length === 0 ? 0 : pressureCount / items.length;
  const workloadPressure: ReportingSeverity = pressureRatio >= 0.5 ? "critical" : pressureRatio >= 0.3 ? "high" : pressureRatio >= 0.15 ? "medium" : "low";

  return {
    workflowStageDistribution: [...stageCounts.entries()].map(([label, count]) => ({ label, count })),
    agingDistribution,
    escalationDistribution,
    rhythmDistribution,
    ownerLoadDistribution,
    closingRiskCount: items.filter((item) => item.ownerGroup === "closing" && item.workItem.riskTier !== "low_risk").length,
    stalledDealCount: items.filter((item) => Boolean(item.workItem.stallReason)).length,
    followUpBacklogCount: items.filter((item) => item.expectation.timingCategory === "follow_up" && item.rhythmState !== "recently_updated").length,
    workloadPressure,
    workloadPressureReason:
      items.length === 0
        ? "No active operational items available."
        : `${pressureCount} of ${items.length} item(s) are overdue, blocked waiting, urgent, or executive attention.`,
  };
}

function trend(key: string, label: string, state: ReportingTrendState, reason: string): OperationalTrend {
  return {
    key,
    label,
    state,
    confidence: state === "unknown" ? "low" : "medium",
    reason,
    uncertainty: "Trend is inferred from the current snapshot only because durable reporting history is not implemented in R13.",
  };
}

function getTrends(summary: ReturnType<typeof getOperatorWorkflowRhythmSummary>, performance: OperationalPerformanceSummary): OperationalTrend[] {
  const total = Math.max(summary.totalItems, 1);
  const agingTrend = getTrendFromPressure(summary.staleCount, total);
  const escalationTrend = getTrendFromPressure(summary.urgentCount, total);
  const staleTrend = getTrendFromPressure(summary.overdueCount, total);
  const underContractTrend = getTrendFromPressure(summary.underContractRiskCount, total);
  const closingBlockedTrend = getTrendFromPressure(summary.titleBlockerCount + performance.closingRiskCount, total);
  const buyerReadyState: ReportingTrendState = summary.totalItems === 0 ? "unknown" : summary.rankedItems.some((item) => item.workItem.sourceSignals.buyerReadiness === "buyer_ready") ? "stable" : "unknown";
  const loadTrend = performance.workloadPressure === "critical" || performance.workloadPressure === "high" ? "worsening" : performance.workloadPressure === "low" ? "stable" : "unknown";

  return [
    trend("aging", "Aging trend", agingTrend.trend, agingTrend.hint),
    trend("escalation", "Escalation trend", escalationTrend.trend, escalationTrend.hint),
    trend("stale_follow_up", "Stale follow-up trend", staleTrend.trend, staleTrend.hint),
    trend("under_contract_risk", "Under-contract risk trend", underContractTrend.trend, underContractTrend.hint),
    trend("closing_blocked", "Closing-blocked trend", closingBlockedTrend.trend, closingBlockedTrend.hint),
    trend("buyer_ready", "Buyer-ready trend", buyerReadyState, buyerReadyState === "stable" ? "Buyer-ready items exist in the current snapshot." : "Buyer-ready direction needs durable history."),
    trend("operational_load", "Operational load trend", loadTrend, performance.workloadPressureReason),
  ];
}

export function getOperatorReportingSummary(leads: StoredLead[]): OperatorReportingSummary {
  const rhythmSummary = getOperatorWorkflowRhythmSummary(leads);
  const items = rhythmSummary.rankedItems;
  const performance = getPerformance(items);
  const snapshots = [
    snapshot({
      key: "today",
      label: "Today's Operational Priorities",
      items: [...rhythmSummary.dueTodayItems, ...rhythmSummary.overdueItems, ...rhythmSummary.criticalAgingItems],
      total: rhythmSummary.totalItems,
      recommendation: "Work overdue and critical timing items before monitor-only items.",
      fallbackConcern: "No priority timing concern detected.",
    }),
    snapshot({
      key: "weekly",
      label: "Weekly Workflow Health",
      items: rhythmSummary.rankedItems.filter((item) => item.agingTier !== "fresh" || item.escalationTier !== "monitor"),
      total: rhythmSummary.totalItems,
      recommendation: "Review aging, escalation, and blocked-waiting items as the weekly operating cadence.",
      fallbackConcern: "Weekly workflow pressure appears contained from current snapshot.",
    }),
    snapshot({
      key: "aging",
      label: "Aging Summary",
      items: rhythmSummary.rankedItems.filter((item) => item.agingTier === "aging" || item.agingTier === "overdue" || item.agingTier === "critical"),
      total: rhythmSummary.totalItems,
      recommendation: "Clear critical aging first, then overdue, then aging items.",
      fallbackConcern: "No aging concern detected.",
    }),
    snapshot({
      key: "escalation",
      label: "Escalation Summary",
      items: rhythmSummary.escalatedItems,
      total: rhythmSummary.totalItems,
      recommendation: "Review urgent and executive-attention items with a human operator.",
      fallbackConcern: "No urgent escalation detected.",
    }),
    snapshot({
      key: "blocked",
      label: "Blocked-Deal Summary",
      items: rhythmSummary.rankedItems.filter((item) => item.rhythmState === "blocked_waiting"),
      total: rhythmSummary.totalItems,
      recommendation: "Resolve blocked waiting items before trying to advance workflow stages.",
      fallbackConcern: "No blocked waiting items detected.",
    }),
    snapshot({
      key: "revenue_at_risk",
      label: "Revenue At Risk",
      items: rhythmSummary.rankedItems.filter((item) => item.workItem.riskTier === "blocked" || item.workItem.riskTier === "high_risk"),
      total: rhythmSummary.totalItems,
      recommendation: "Prioritize blocked and high-risk revenue items for operator review.",
      fallbackConcern: "No high-risk revenue concentration detected.",
    }),
    snapshot({
      key: "workflow_load",
      label: "Workflow Load",
      items: rhythmSummary.rankedItems.filter((item) => item.rhythmState !== "monitor_only"),
      total: rhythmSummary.totalItems,
      recommendation: "Watch owner-group load and overloaded stages before adding new work.",
      fallbackConcern: "No active workload pressure detected.",
    }),
  ];

  return {
    snapshots,
    trends: getTrends(rhythmSummary, performance),
    repeatedBottlenecks: getRepeatedBottlenecks(items),
    performance,
    todayPriorities: [...rhythmSummary.overdueItems, ...rhythmSummary.dueTodayItems, ...rhythmSummary.criticalAgingItems].slice(0, 5),
    weeklyWorkflowHealth: `${performance.workloadPressure.toUpperCase()} workload pressure. ${performance.workloadPressureReason}`,
    revenueAtRiskSummary: `${snapshots.find((item) => item.key === "revenue_at_risk")?.count ?? 0} item(s) currently classified as blocked or high-risk revenue.`,
    escalationSummary: `${rhythmSummary.urgentCount} urgent or executive-attention item(s); ${rhythmSummary.blockedCount} blocked waiting item(s).`,
    followUpBacklogSummary: `${performance.followUpBacklogCount} follow-up timing item(s) need review from current metadata.`,
    closingRiskSummary: `${performance.closingRiskCount} closing-related item(s) carry non-low risk in the current snapshot.`,
    reportingConsistencyNote: "Reporting uses the same R8-R12 derived helper outputs as the dashboard views. No separate execution or persistence layer is introduced.",
    safetyNote: SAFETY_NOTE,
  };
}
