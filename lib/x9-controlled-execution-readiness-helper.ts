export type X9ExecutionReadinessItem = {
  id: string;
  label: string;
  source?: string;
  priority?: number;
  readinessScore?: number;
  governanceRiskScore?: number;
  providerReadinessBlocked?: boolean;
  runtimeReadinessBlocked?: boolean;
  outreachReadinessBlocked?: boolean;
  routingReadinessBlocked?: boolean;
  approvalExecutionRisk?: boolean;
  missingReadinessData?: boolean;
  humanReviewRequired?: boolean;
  daysSinceReadinessReview?: number;
  operatorWorkloadWeight?: number;
};

export type X9ExecutionReadinessInput = {
  items?: X9ExecutionReadinessItem[];
  readinessThreshold?: number;
  riskThreshold?: number;
  staleReviewAfterDays?: number;
  maxItemsPerSection?: number;
};

export type X9ExecutionReadinessSummary = {
  readinessReviewItems: X9ExecutionReadinessItem[];
  activationBoundaryItems: X9ExecutionReadinessItem[];
  providerBlockedItems: X9ExecutionReadinessItem[];
  runtimeBlockedItems: X9ExecutionReadinessItem[];
  outreachBlockedItems: X9ExecutionReadinessItem[];
  routingBlockedItems: X9ExecutionReadinessItem[];
  approvalExecutionBoundaryItems: X9ExecutionReadinessItem[];
  governanceReadinessItems: X9ExecutionReadinessItem[];
  missingReadinessDataItems: X9ExecutionReadinessItem[];
  manualReadinessRecommendations: string[];
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

function scoreItem(item: X9ExecutionReadinessItem): number {
  const readinessGap = Math.max(0, 100 - (item.readinessScore ?? 100));
  return (item.priority ?? 0) * 12 + readinessGap + (item.governanceRiskScore ?? 0) * 3 + (item.daysSinceReadinessReview ?? 0) * 2 + (item.operatorWorkloadWeight ?? 0) * 2 + (item.providerReadinessBlocked ? 20 : 0) + (item.runtimeReadinessBlocked ? 20 : 0) + (item.outreachReadinessBlocked ? 18 : 0) + (item.routingReadinessBlocked ? 18 : 0) + (item.approvalExecutionRisk ? 24 : 0) + (item.missingReadinessData ? 16 : 0) + (item.humanReviewRequired ? 12 : 0);
}

function sortAndLimit(items: X9ExecutionReadinessItem[], maxItems: number): X9ExecutionReadinessItem[] {
  return [...items].sort((a, b) => scoreItem(b) - scoreItem(a) || a.label.localeCompare(b.label) || a.id.localeCompare(b.id)).slice(0, maxItems);
}

export function deriveControlledExecutionReadiness(input: X9ExecutionReadinessInput = {}): X9ExecutionReadinessSummary {
  const items = input.items ?? [];
  const readinessThreshold = input.readinessThreshold ?? 70;
  const riskThreshold = input.riskThreshold ?? 5;
  const staleReviewAfterDays = input.staleReviewAfterDays ?? 7;
  const maxItems = input.maxItemsPerSection ?? 5;
  const readinessReviewItems = sortAndLimit(items.filter((item) => (item.readinessScore ?? 100) < readinessThreshold || item.humanReviewRequired || (item.daysSinceReadinessReview ?? 0) >= staleReviewAfterDays), maxItems);
  const activationBoundaryItems = sortAndLimit(items.filter((item) => item.providerReadinessBlocked || item.runtimeReadinessBlocked || item.outreachReadinessBlocked || item.routingReadinessBlocked || item.approvalExecutionRisk), maxItems);
  const providerBlockedItems = sortAndLimit(items.filter((item) => item.providerReadinessBlocked), maxItems);
  const runtimeBlockedItems = sortAndLimit(items.filter((item) => item.runtimeReadinessBlocked), maxItems);
  const outreachBlockedItems = sortAndLimit(items.filter((item) => item.outreachReadinessBlocked), maxItems);
  const routingBlockedItems = sortAndLimit(items.filter((item) => item.routingReadinessBlocked), maxItems);
  const approvalExecutionBoundaryItems = sortAndLimit(items.filter((item) => item.approvalExecutionRisk), maxItems);
  const governanceReadinessItems = sortAndLimit(items.filter((item) => (item.governanceRiskScore ?? 0) >= riskThreshold || item.humanReviewRequired), maxItems);
  const missingReadinessDataItems = sortAndLimit(items.filter((item) => item.missingReadinessData), maxItems);
  const manualReadinessRecommendations = [
    readinessReviewItems.length > 0 ? "Review controlled execution readiness manually; readiness does not authorize execution or activation." : "No controlled execution readiness review items available from read-only input.",
    activationBoundaryItems.length > 0 ? "Review activation boundary items manually; no provider, runtime job, outreach, routing, or approval execution is triggered." : "No activation boundary items detected.",
    missingReadinessDataItems.length > 0 || governanceReadinessItems.length > 0 ? "Review missing readiness data and governance risk manually; no persistence, audit writing, or workflow automation is triggered." : "No missing readiness data or governance risk items detected.",
  ];
  return {
    readinessReviewItems,
    activationBoundaryItems,
    providerBlockedItems,
    runtimeBlockedItems,
    outreachBlockedItems,
    routingBlockedItems,
    approvalExecutionBoundaryItems,
    governanceReadinessItems,
    missingReadinessDataItems,
    manualReadinessRecommendations,
    governanceWarnings: ["Controlled execution readiness remains advisory only.", "Readiness does not authorize activation, execution, provider use, outreach, routing, persistence, audit writing, polling, runtime jobs, or approval execution.", "Human operator review is required before any real-world action."],
    safetyFlags,
  };
}
