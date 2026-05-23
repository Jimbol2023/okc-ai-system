export type X1CommandCenterItem = {
  id: string;
  label: string;
  status?: string;
  source?: string;
  priority?: number;
  estimatedRevenue?: number;
  daysSinceFollowUp?: number;
  isHotSeller?: boolean;
  isStuckDeal?: boolean;
  isBuyerReady?: boolean;
  isNearClose?: boolean;
  isBlocked?: boolean;
  missingCriticalData?: boolean;
};

export type X1CommandCenterInput = {
  items?: X1CommandCenterItem[];
  overdueAfterDays?: number;
  maxItemsPerSection?: number;
};

export type X1CommandCenterSummary = {
  topFocusItems: X1CommandCenterItem[];
  overdueFollowUpItems: X1CommandCenterItem[];
  hotSellerItems: X1CommandCenterItem[];
  stuckDealItems: X1CommandCenterItem[];
  buyerReadyItems: X1CommandCenterItem[];
  nearCloseItems: X1CommandCenterItem[];
  blockedItems: X1CommandCenterItem[];
  missingDataItems: X1CommandCenterItem[];
  revenueOpportunityItems: X1CommandCenterItem[];
  manualNextBestActions: string[];
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

function scoreItem(item: X1CommandCenterItem): number {
  return (item.priority ?? 0) * 10 + (item.estimatedRevenue ?? 0) / 1000 + (item.daysSinceFollowUp ?? 0) + (item.isHotSeller ? 35 : 0) + (item.isNearClose ? 30 : 0) + (item.isBuyerReady ? 20 : 0) + (item.isStuckDeal ? 18 : 0) + (item.isBlocked ? 14 : 0) + (item.missingCriticalData ? 10 : 0);
}

function sortAndLimit(items: X1CommandCenterItem[], maxItems: number): X1CommandCenterItem[] {
  return [...items].sort((a, b) => scoreItem(b) - scoreItem(a) || a.label.localeCompare(b.label) || a.id.localeCompare(b.id)).slice(0, maxItems);
}

export function deriveHumanOperationalCommandCenter(input: X1CommandCenterInput = {}): X1CommandCenterSummary {
  const items = input.items ?? [];
  const overdueAfterDays = input.overdueAfterDays ?? 3;
  const maxItems = input.maxItemsPerSection ?? 5;
  const topFocusItems = sortAndLimit(items, maxItems);
  const overdueFollowUpItems = sortAndLimit(items.filter((item) => (item.daysSinceFollowUp ?? 0) >= overdueAfterDays), maxItems);
  const hotSellerItems = sortAndLimit(items.filter((item) => item.isHotSeller), maxItems);
  const stuckDealItems = sortAndLimit(items.filter((item) => item.isStuckDeal), maxItems);
  const buyerReadyItems = sortAndLimit(items.filter((item) => item.isBuyerReady), maxItems);
  const nearCloseItems = sortAndLimit(items.filter((item) => item.isNearClose), maxItems);
  const blockedItems = sortAndLimit(items.filter((item) => item.isBlocked), maxItems);
  const missingDataItems = sortAndLimit(items.filter((item) => item.missingCriticalData), maxItems);
  const revenueOpportunityItems = sortAndLimit(items.filter((item) => (item.estimatedRevenue ?? 0) > 0), maxItems);
  const manualNextBestActions = [
    topFocusItems.length > 0 ? "Review top focus items manually before any real-world action." : "No top focus items available from read-only input.",
    overdueFollowUpItems.length > 0 ? "Review overdue follow-up items manually; no outreach is triggered." : "No overdue follow-up items detected.",
    blockedItems.length > 0 ? "Review blocked items and missing data manually; no provider or skip trace is triggered." : "No blocked items detected.",
  ];
  return {
    topFocusItems,
    overdueFollowUpItems,
    hotSellerItems,
    stuckDealItems,
    buyerReadyItems,
    nearCloseItems,
    blockedItems,
    missingDataItems,
    revenueOpportunityItems,
    manualNextBestActions,
    governanceWarnings: ["Manual next-best-action visibility only.", "Human operator review required before any real-world action.", "No execution, provider activation, outreach, persistence, audit writing, polling, or runtime job is authorized."],
    safetyFlags,
  };
}
