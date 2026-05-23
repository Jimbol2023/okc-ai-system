export type X6RevenueLeakageItem = {
  id: string;
  label: string;
  source?: string;
  priority?: number;
  estimatedRevenue?: number;
  daysStale?: number;
  daysToClose?: number;
  workflowFrictionScore?: number;
  momentumLossScore?: number;
  revenueRiskScore?: number;
  assignmentDelayDays?: number;
  isBlockedRevenue?: boolean;
  missingCriticalData?: boolean;
  nearCloseRisk?: boolean;
};

export type X6RevenueLeakageInput = {
  items?: X6RevenueLeakageItem[];
  staleAfterDays?: number;
  nearCloseWithinDays?: number;
  maxItemsPerSection?: number;
};

export type X6RevenueLeakageSummary = {
  staleOpportunityItems: X6RevenueLeakageItem[];
  blockedRevenueItems: X6RevenueLeakageItem[];
  delayedCloseItems: X6RevenueLeakageItem[];
  missingCriticalDataItems: X6RevenueLeakageItem[];
  workflowFrictionItems: X6RevenueLeakageItem[];
  momentumLossItems: X6RevenueLeakageItem[];
  revenueRiskItems: X6RevenueLeakageItem[];
  nearCloseRiskItems: X6RevenueLeakageItem[];
  assignmentDelayItems: X6RevenueLeakageItem[];
  manualRevenueRecommendations: string[];
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

function scoreItem(item: X6RevenueLeakageItem): number {
  return (item.priority ?? 0) * 12 + (item.estimatedRevenue ?? 0) / 1000 + (item.daysStale ?? 0) * 2 + (item.workflowFrictionScore ?? 0) + (item.momentumLossScore ?? 0) + (item.revenueRiskScore ?? 0) * 2 + (item.assignmentDelayDays ?? 0) * 2 + (item.isBlockedRevenue ? 20 : 0) + (item.missingCriticalData ? 12 : 0) + (item.nearCloseRisk ? 18 : 0);
}

function sortAndLimit(items: X6RevenueLeakageItem[], maxItems: number): X6RevenueLeakageItem[] {
  return [...items].sort((a, b) => scoreItem(b) - scoreItem(a) || a.label.localeCompare(b.label) || a.id.localeCompare(b.id)).slice(0, maxItems);
}

export function deriveRevenueLeakageDetection(input: X6RevenueLeakageInput = {}): X6RevenueLeakageSummary {
  const items = input.items ?? [];
  const staleAfterDays = input.staleAfterDays ?? 7;
  const nearCloseWithinDays = input.nearCloseWithinDays ?? 10;
  const maxItems = input.maxItemsPerSection ?? 5;
  const staleOpportunityItems = sortAndLimit(items.filter((item) => (item.daysStale ?? 0) >= staleAfterDays), maxItems);
  const blockedRevenueItems = sortAndLimit(items.filter((item) => item.isBlockedRevenue), maxItems);
  const delayedCloseItems = sortAndLimit(items.filter((item) => (item.daysToClose ?? Number.POSITIVE_INFINITY) <= nearCloseWithinDays && (item.revenueRiskScore ?? 0) > 0), maxItems);
  const missingCriticalDataItems = sortAndLimit(items.filter((item) => item.missingCriticalData), maxItems);
  const workflowFrictionItems = sortAndLimit(items.filter((item) => (item.workflowFrictionScore ?? 0) > 0), maxItems);
  const momentumLossItems = sortAndLimit(items.filter((item) => (item.momentumLossScore ?? 0) > 0), maxItems);
  const revenueRiskItems = sortAndLimit(items.filter((item) => (item.revenueRiskScore ?? 0) > 0 || item.isBlockedRevenue), maxItems);
  const nearCloseRiskItems = sortAndLimit(items.filter((item) => item.nearCloseRisk || ((item.daysToClose ?? Number.POSITIVE_INFINITY) <= nearCloseWithinDays && (item.revenueRiskScore ?? 0) > 0)), maxItems);
  const assignmentDelayItems = sortAndLimit(items.filter((item) => (item.assignmentDelayDays ?? 0) > 0), maxItems);
  const manualRevenueRecommendations = [
    revenueRiskItems.length > 0 ? "Review revenue risk items manually before any real-world action." : "No revenue risk items available from read-only input.",
    staleOpportunityItems.length > 0 || momentumLossItems.length > 0 ? "Review stale opportunity and momentum-loss signals manually; no outreach is triggered." : "No stale opportunity or momentum-loss items detected.",
    blockedRevenueItems.length > 0 || missingCriticalDataItems.length > 0 ? "Review blocked revenue and missing data manually; no routing, escalation, provider, skip trace, or scraping is triggered." : "No blocked revenue or missing critical data items detected.",
  ];
  return {
    staleOpportunityItems,
    blockedRevenueItems,
    delayedCloseItems,
    missingCriticalDataItems,
    workflowFrictionItems,
    momentumLossItems,
    revenueRiskItems,
    nearCloseRiskItems,
    assignmentDelayItems,
    manualRevenueRecommendations,
    governanceWarnings: ["Revenue leakage review remains advisory only.", "Human operator review is required before any real-world action.", "No execution, outreach, routing, autonomous escalation, provider activation, persistence, audit writing, polling, runtime job, scraping, or skip tracing is authorized."],
    safetyFlags,
  };
}
