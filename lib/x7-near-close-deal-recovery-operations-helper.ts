export type X7NearCloseRecoveryItem = {
  id: string;
  label: string;
  source?: string;
  priority?: number;
  estimatedRevenue?: number;
  daysToClose?: number;
  daysStalled?: number;
  closingReadinessScore?: number;
  assignmentReadinessScore?: number;
  buyerReadinessScore?: number;
  sellerReadinessScore?: number;
  recoveryRiskScore?: number;
  isBlockedClosing?: boolean;
  missingClosingData?: boolean;
  nearCloseRisk?: boolean;
  operatorWorkloadWeight?: number;
};

export type X7NearCloseRecoveryInput = {
  items?: X7NearCloseRecoveryItem[];
  nearCloseWithinDays?: number;
  stalledAfterDays?: number;
  readinessThreshold?: number;
  maxItemsPerSection?: number;
};

export type X7NearCloseRecoverySummary = {
  nearCloseRecoveryItems: X7NearCloseRecoveryItem[];
  closingRiskItems: X7NearCloseRecoveryItem[];
  assignmentRiskItems: X7NearCloseRecoveryItem[];
  stalledNearCloseItems: X7NearCloseRecoveryItem[];
  blockedClosingItems: X7NearCloseRecoveryItem[];
  missingClosingDataItems: X7NearCloseRecoveryItem[];
  buyerReadinessItems: X7NearCloseRecoveryItem[];
  sellerReadinessItems: X7NearCloseRecoveryItem[];
  manualRecoveryRecommendations: string[];
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

function scoreItem(item: X7NearCloseRecoveryItem): number {
  const closingGap = Math.max(0, 100 - (item.closingReadinessScore ?? 100));
  const assignmentGap = Math.max(0, 100 - (item.assignmentReadinessScore ?? 100));
  const buyerGap = Math.max(0, 100 - (item.buyerReadinessScore ?? 100));
  const sellerGap = Math.max(0, 100 - (item.sellerReadinessScore ?? 100));
  return (item.priority ?? 0) * 12 + (item.estimatedRevenue ?? 0) / 1000 + (item.recoveryRiskScore ?? 0) * 3 + (item.daysStalled ?? 0) * 3 + (item.operatorWorkloadWeight ?? 0) * 2 + closingGap + assignmentGap + buyerGap / 2 + sellerGap / 2 + (item.isBlockedClosing ? 24 : 0) + (item.missingClosingData ? 18 : 0) + (item.nearCloseRisk ? 16 : 0);
}

function sortAndLimit(items: X7NearCloseRecoveryItem[], maxItems: number): X7NearCloseRecoveryItem[] {
  return [...items].sort((a, b) => scoreItem(b) - scoreItem(a) || a.label.localeCompare(b.label) || a.id.localeCompare(b.id)).slice(0, maxItems);
}

export function deriveNearCloseDealRecoveryOperations(input: X7NearCloseRecoveryInput = {}): X7NearCloseRecoverySummary {
  const items = input.items ?? [];
  const nearCloseWithinDays = input.nearCloseWithinDays ?? 10;
  const stalledAfterDays = input.stalledAfterDays ?? 5;
  const readinessThreshold = input.readinessThreshold ?? 70;
  const maxItems = input.maxItemsPerSection ?? 5;
  const nearCloseRecoveryItems = sortAndLimit(items.filter((item) => (item.daysToClose ?? Number.POSITIVE_INFINITY) <= nearCloseWithinDays || item.nearCloseRisk), maxItems);
  const closingRiskItems = sortAndLimit(items.filter((item) => (item.closingReadinessScore ?? 100) < readinessThreshold || (item.recoveryRiskScore ?? 0) > 0), maxItems);
  const assignmentRiskItems = sortAndLimit(items.filter((item) => (item.assignmentReadinessScore ?? 100) < readinessThreshold), maxItems);
  const stalledNearCloseItems = sortAndLimit(items.filter((item) => (item.daysStalled ?? 0) >= stalledAfterDays), maxItems);
  const blockedClosingItems = sortAndLimit(items.filter((item) => item.isBlockedClosing), maxItems);
  const missingClosingDataItems = sortAndLimit(items.filter((item) => item.missingClosingData), maxItems);
  const buyerReadinessItems = sortAndLimit(items.filter((item) => (item.buyerReadinessScore ?? 100) < readinessThreshold), maxItems);
  const sellerReadinessItems = sortAndLimit(items.filter((item) => (item.sellerReadinessScore ?? 100) < readinessThreshold), maxItems);
  const manualRecoveryRecommendations = [
    nearCloseRecoveryItems.length > 0 ? "Review near-close recovery items manually before any real-world action." : "No near-close recovery items available from read-only input.",
    stalledNearCloseItems.length > 0 || blockedClosingItems.length > 0 ? "Review stalled or blocked closing items manually; no outreach, routing, runtime job, or autonomous escalation is triggered." : "No stalled or blocked closing items detected.",
    missingClosingDataItems.length > 0 ? "Review missing closing data manually; no provider, skip trace, scraping, persistence, or audit writing is triggered." : "No missing closing data items detected.",
  ];
  return {
    nearCloseRecoveryItems,
    closingRiskItems,
    assignmentRiskItems,
    stalledNearCloseItems,
    blockedClosingItems,
    missingClosingDataItems,
    buyerReadinessItems,
    sellerReadinessItems,
    manualRecoveryRecommendations,
    governanceWarnings: ["Near-close deal recovery remains advisory only.", "Human operator review is required before any real-world action.", "No execution, outreach, routing, autonomous escalation, provider activation, persistence, audit writing, polling, runtime job, scraping, or skip tracing is authorized."],
    safetyFlags,
  };
}
