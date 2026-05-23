export type X4BuyerMatchingItem = {
  id: string;
  label: string;
  source?: string;
  priority?: number;
  estimatedRevenue?: number;
  buyerFitScore?: number;
  buyerDemandScore?: number;
  assignmentReadinessScore?: number;
  dispositionReadinessScore?: number;
  buyerCapacityKnown?: boolean;
  buyerCriteriaKnown?: boolean;
  isBlockedDisposition?: boolean;
  missingBuyerData?: boolean;
  throughputRisk?: number;
};

export type X4BuyerMatchingInput = {
  items?: X4BuyerMatchingItem[];
  readinessThreshold?: number;
  maxItemsPerSection?: number;
};

export type X4BuyerMatchingSummary = {
  buyerFitItems: X4BuyerMatchingItem[];
  assignmentReadinessItems: X4BuyerMatchingItem[];
  buyerDemandItems: X4BuyerMatchingItem[];
  dispositionReviewItems: X4BuyerMatchingItem[];
  blockedDispositionItems: X4BuyerMatchingItem[];
  missingBuyerDataItems: X4BuyerMatchingItem[];
  buyerCapacityItems: X4BuyerMatchingItem[];
  revenueThroughputItems: X4BuyerMatchingItem[];
  manualBuyerRecommendations: string[];
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

function scoreItem(item: X4BuyerMatchingItem): number {
  return (item.priority ?? 0) * 12 + (item.estimatedRevenue ?? 0) / 1000 + (item.buyerFitScore ?? 0) + (item.buyerDemandScore ?? 0) + (item.assignmentReadinessScore ?? 0) + (item.dispositionReadinessScore ?? 0) + (item.throughputRisk ?? 0) * 2 + (item.isBlockedDisposition ? 18 : 0) + (item.missingBuyerData ? 14 : 0);
}

function sortAndLimit(items: X4BuyerMatchingItem[], maxItems: number): X4BuyerMatchingItem[] {
  return [...items].sort((a, b) => scoreItem(b) - scoreItem(a) || a.label.localeCompare(b.label) || a.id.localeCompare(b.id)).slice(0, maxItems);
}

export function deriveHumanGuidedBuyerMatchingOperations(input: X4BuyerMatchingInput = {}): X4BuyerMatchingSummary {
  const items = input.items ?? [];
  const readinessThreshold = input.readinessThreshold ?? 70;
  const maxItems = input.maxItemsPerSection ?? 5;
  const buyerFitItems = sortAndLimit(items.filter((item) => (item.buyerFitScore ?? 0) >= readinessThreshold), maxItems);
  const assignmentReadinessItems = sortAndLimit(items.filter((item) => (item.assignmentReadinessScore ?? 0) >= readinessThreshold), maxItems);
  const buyerDemandItems = sortAndLimit(items.filter((item) => (item.buyerDemandScore ?? 0) >= readinessThreshold), maxItems);
  const dispositionReviewItems = sortAndLimit(items.filter((item) => (item.dispositionReadinessScore ?? 0) >= readinessThreshold || item.isBlockedDisposition), maxItems);
  const blockedDispositionItems = sortAndLimit(items.filter((item) => item.isBlockedDisposition), maxItems);
  const missingBuyerDataItems = sortAndLimit(items.filter((item) => item.missingBuyerData || !item.buyerCapacityKnown || !item.buyerCriteriaKnown), maxItems);
  const buyerCapacityItems = sortAndLimit(items.filter((item) => item.buyerCapacityKnown === false || (item.buyerDemandScore ?? 0) > 0), maxItems);
  const revenueThroughputItems = sortAndLimit(items.filter((item) => (item.estimatedRevenue ?? 0) > 0 || (item.throughputRisk ?? 0) > 0), maxItems);
  const manualBuyerRecommendations = [
    buyerFitItems.length > 0 ? "Review buyer-fit alignment manually before any real-world buyer coordination." : "No buyer-fit review items available from read-only input.",
    assignmentReadinessItems.length > 0 ? "Review assignment readiness manually; no buyer assignment is triggered." : "No assignment-readiness review items detected.",
    blockedDispositionItems.length > 0 || missingBuyerDataItems.length > 0 ? "Review blocked disposition and missing buyer data manually; no outreach, provider, skip trace, or scraping is triggered." : "No blocked disposition or missing buyer data items detected.",
  ];
  return {
    buyerFitItems,
    assignmentReadinessItems,
    buyerDemandItems,
    dispositionReviewItems,
    blockedDispositionItems,
    missingBuyerDataItems,
    buyerCapacityItems,
    revenueThroughputItems,
    manualBuyerRecommendations,
    governanceWarnings: ["Manual buyer review visibility only.", "Buyer operations remain advisory only and require human operator review before any real-world action.", "No execution, buyer outreach, provider activation, autonomous assignment, routing, persistence, audit writing, polling, runtime job, scraping, or skip tracing is authorized."],
    safetyFlags,
  };
}
