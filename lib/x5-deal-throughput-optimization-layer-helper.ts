export type X5DealThroughputItem = {
  id: string;
  label: string;
  source?: string;
  priority?: number;
  estimatedRevenue?: number;
  stageFrictionScore?: number;
  daysInStage?: number;
  assignmentReadinessScore?: number;
  closingReadinessScore?: number;
  isBlockedThroughput?: boolean;
  missingThroughputData?: boolean;
  revenueDelayRisk?: number;
  operatorWorkloadWeight?: number;
};

export type X5DealThroughputInput = {
  items?: X5DealThroughputItem[];
  readinessThreshold?: number;
  staleStageAfterDays?: number;
  maxItemsPerSection?: number;
};

export type X5DealThroughputSummary = {
  throughputReviewItems: X5DealThroughputItem[];
  stageFrictionItems: X5DealThroughputItem[];
  blockedThroughputItems: X5DealThroughputItem[];
  assignmentReadinessItems: X5DealThroughputItem[];
  closingReadinessItems: X5DealThroughputItem[];
  revenueDelayItems: X5DealThroughputItem[];
  missingThroughputDataItems: X5DealThroughputItem[];
  highImpactThroughputItems: X5DealThroughputItem[];
  manualOptimizationRecommendations: string[];
  governanceWarnings: string[];
  safetyFlags: {
    readOnly: true;
    advisoryOnly: true;
    manualReviewOnly: true;
    providerCalled: false;
    sent: false;
    persistenceWritten: false;
    runtimeActivated: false;
    approvalGrantsExecution: false;
  };
};

const safetyFlags = {
  readOnly: true,
  advisoryOnly: true,
  manualReviewOnly: true,
  providerCalled: false,
  sent: false,
  persistenceWritten: false,
  runtimeActivated: false,
  approvalGrantsExecution: false,
} as const;

function scoreItem(item: X5DealThroughputItem): number {
  return (item.priority ?? 0) * 12 + (item.estimatedRevenue ?? 0) / 1000 + (item.stageFrictionScore ?? 0) + (item.daysInStage ?? 0) * 2 + (item.revenueDelayRisk ?? 0) * 3 + (item.operatorWorkloadWeight ?? 0) + (item.isBlockedThroughput ? 20 : 0) + (item.missingThroughputData ? 12 : 0);
}

function sortAndLimit(items: X5DealThroughputItem[], maxItems: number): X5DealThroughputItem[] {
  return [...items].sort((a, b) => scoreItem(b) - scoreItem(a) || a.label.localeCompare(b.label) || a.id.localeCompare(b.id)).slice(0, maxItems);
}

export function deriveDealThroughputOptimizationLayer(input: X5DealThroughputInput = {}): X5DealThroughputSummary {
  const items = input.items ?? [];
  const readinessThreshold = input.readinessThreshold ?? 70;
  const staleStageAfterDays = input.staleStageAfterDays ?? 7;
  const maxItems = input.maxItemsPerSection ?? 5;
  const stageFrictionItems = sortAndLimit(items.filter((item) => (item.stageFrictionScore ?? 0) > 0 || (item.daysInStage ?? 0) >= staleStageAfterDays), maxItems);
  const blockedThroughputItems = sortAndLimit(items.filter((item) => item.isBlockedThroughput), maxItems);
  const assignmentReadinessItems = sortAndLimit(items.filter((item) => (item.assignmentReadinessScore ?? 0) >= readinessThreshold), maxItems);
  const closingReadinessItems = sortAndLimit(items.filter((item) => (item.closingReadinessScore ?? 0) >= readinessThreshold), maxItems);
  const revenueDelayItems = sortAndLimit(items.filter((item) => (item.revenueDelayRisk ?? 0) > 0), maxItems);
  const missingThroughputDataItems = sortAndLimit(items.filter((item) => item.missingThroughputData), maxItems);
  const highImpactThroughputItems = sortAndLimit(items.filter((item) => (item.priority ?? 0) >= 3 || (item.estimatedRevenue ?? 0) >= 15000 || (item.revenueDelayRisk ?? 0) >= 6), maxItems);
  const throughputReviewItems = sortAndLimit([...stageFrictionItems, ...blockedThroughputItems, ...revenueDelayItems, ...highImpactThroughputItems], maxItems);
  const manualOptimizationRecommendations = [
    throughputReviewItems.length > 0 ? "Review throughput friction manually before any real-world action." : "No throughput friction items available from read-only input.",
    assignmentReadinessItems.length > 0 || closingReadinessItems.length > 0 ? "Review assignment and closing readiness manually; no workflow is routed." : "No assignment or closing readiness items detected.",
    blockedThroughputItems.length > 0 || missingThroughputDataItems.length > 0 ? "Review blocked throughput and missing data manually; no provider, runtime job, skip trace, or scraping is triggered." : "No blocked throughput or missing data items detected.",
  ];
  return {
    throughputReviewItems,
    stageFrictionItems,
    blockedThroughputItems,
    assignmentReadinessItems,
    closingReadinessItems,
    revenueDelayItems,
    missingThroughputDataItems,
    highImpactThroughputItems,
    manualOptimizationRecommendations,
    governanceWarnings: ["Deal throughput optimization is advisory visibility only.", "Human operator review is required before any real-world action.", "No execution, routing, automation, outreach, provider activation, persistence, audit writing, polling, runtime job, scraping, or skip tracing is authorized."],
    safetyFlags,
  };
}
