export type X2LeadOperationsItem = {
  id: string;
  label: string;
  status?: string;
  source?: string;
  owner?: string;
  priority?: number;
  estimatedRevenue?: number;
  daysSinceFollowUp?: number;
  leadAgeDays?: number;
  needsSellerStatusReview?: boolean;
  isBlockedWorkflow?: boolean;
  missingCriticalData?: boolean;
  workloadWeight?: number;
};

export type X2LeadOperationsInput = {
  items?: X2LeadOperationsItem[];
  overdueAfterDays?: number;
  agingAfterDays?: number;
  maxItemsPerSection?: number;
};

export type X2LeadOperationsSummary = {
  highPriorityLeads: X2LeadOperationsItem[];
  overdueFollowUps: X2LeadOperationsItem[];
  agingLeads: X2LeadOperationsItem[];
  blockedWorkflowItems: X2LeadOperationsItem[];
  missingDataItems: X2LeadOperationsItem[];
  sellerStatusReviewItems: X2LeadOperationsItem[];
  operatorWorkloadItems: X2LeadOperationsItem[];
  manualRevenuePriorityItems: X2LeadOperationsItem[];
  manualWorkflowRecommendations: string[];
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

function scoreItem(item: X2LeadOperationsItem): number {
  return (item.priority ?? 0) * 12 + (item.estimatedRevenue ?? 0) / 1000 + (item.daysSinceFollowUp ?? 0) * 2 + (item.leadAgeDays ?? 0) / 5 + (item.needsSellerStatusReview ? 22 : 0) + (item.isBlockedWorkflow ? 18 : 0) + (item.missingCriticalData ? 15 : 0) + (item.workloadWeight ?? 0);
}

function sortAndLimit(items: X2LeadOperationsItem[], maxItems: number): X2LeadOperationsItem[] {
  return [...items].sort((a, b) => scoreItem(b) - scoreItem(a) || a.label.localeCompare(b.label) || a.id.localeCompare(b.id)).slice(0, maxItems);
}

export function deriveLiveManualLeadOperations(input: X2LeadOperationsInput = {}): X2LeadOperationsSummary {
  const items = input.items ?? [];
  const overdueAfterDays = input.overdueAfterDays ?? 3;
  const agingAfterDays = input.agingAfterDays ?? 14;
  const maxItems = input.maxItemsPerSection ?? 5;
  const highPriorityLeads = sortAndLimit(items.filter((item) => (item.priority ?? 0) >= 3 || (item.estimatedRevenue ?? 0) >= 15000), maxItems);
  const overdueFollowUps = sortAndLimit(items.filter((item) => (item.daysSinceFollowUp ?? 0) >= overdueAfterDays), maxItems);
  const agingLeads = sortAndLimit(items.filter((item) => (item.leadAgeDays ?? 0) >= agingAfterDays), maxItems);
  const blockedWorkflowItems = sortAndLimit(items.filter((item) => item.isBlockedWorkflow), maxItems);
  const missingDataItems = sortAndLimit(items.filter((item) => item.missingCriticalData), maxItems);
  const sellerStatusReviewItems = sortAndLimit(items.filter((item) => item.needsSellerStatusReview), maxItems);
  const operatorWorkloadItems = sortAndLimit(items.filter((item) => (item.workloadWeight ?? 0) > 0), maxItems);
  const manualRevenuePriorityItems = sortAndLimit(items.filter((item) => (item.estimatedRevenue ?? 0) > 0), maxItems);
  const manualWorkflowRecommendations = [
    highPriorityLeads.length > 0 ? "Review high-priority leads manually before any real-world action." : "No high-priority leads available from read-only input.",
    overdueFollowUps.length > 0 ? "Review overdue follow-up items manually; no outreach is triggered." : "No overdue follow-up items detected.",
    blockedWorkflowItems.length > 0 || missingDataItems.length > 0 ? "Review blocked workflow and missing data items manually; no provider, skip trace, or scraping is triggered." : "No blocked workflow or missing data items detected.",
  ];
  return {
    highPriorityLeads,
    overdueFollowUps,
    agingLeads,
    blockedWorkflowItems,
    missingDataItems,
    sellerStatusReviewItems,
    operatorWorkloadItems,
    manualRevenuePriorityItems,
    manualWorkflowRecommendations,
    governanceWarnings: ["Manual workflow visibility only.", "Human operator review required before any real-world action.", "No execution, provider activation, outreach, routing, persistence, audit writing, polling, runtime job, lead creation, scraping, or skip tracing is authorized."],
    safetyFlags,
  };
}
