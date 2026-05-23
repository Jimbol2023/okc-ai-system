export type X8CommunicationWorkspaceItem = {
  id: string;
  label: string;
  source?: string;
  priority?: number;
  communicationReadinessScore?: number;
  communicationRiskScore?: number;
  humanApprovalReady?: boolean;
  hasDncFlag?: boolean;
  hasOptOutFlag?: boolean;
  providerBlocked?: boolean;
  missingCommunicationContext?: boolean;
  governanceBlocked?: boolean;
  daysSinceLastHumanReview?: number;
  operatorWorkloadWeight?: number;
};

export type X8CommunicationWorkspaceInput = {
  items?: X8CommunicationWorkspaceItem[];
  readinessThreshold?: number;
  riskThreshold?: number;
  staleReviewAfterDays?: number;
  maxItemsPerSection?: number;
};

export type X8CommunicationWorkspaceSummary = {
  communicationReviewItems: X8CommunicationWorkspaceItem[];
  communicationReadinessItems: X8CommunicationWorkspaceItem[];
  communicationRiskItems: X8CommunicationWorkspaceItem[];
  humanApprovalItems: X8CommunicationWorkspaceItem[];
  dncAwarenessItems: X8CommunicationWorkspaceItem[];
  optOutAwarenessItems: X8CommunicationWorkspaceItem[];
  providerBlockedItems: X8CommunicationWorkspaceItem[];
  communicationContextItems: X8CommunicationWorkspaceItem[];
  communicationGovernanceItems: X8CommunicationWorkspaceItem[];
  manualCommunicationRecommendations: string[];
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

function scoreItem(item: X8CommunicationWorkspaceItem): number {
  const readinessGap = Math.max(0, 100 - (item.communicationReadinessScore ?? 100));
  return (item.priority ?? 0) * 12 + readinessGap + (item.communicationRiskScore ?? 0) * 3 + (item.daysSinceLastHumanReview ?? 0) * 2 + (item.operatorWorkloadWeight ?? 0) * 2 + (item.humanApprovalReady ? 10 : 0) + (item.hasDncFlag ? 30 : 0) + (item.hasOptOutFlag ? 30 : 0) + (item.providerBlocked ? 18 : 0) + (item.missingCommunicationContext ? 16 : 0) + (item.governanceBlocked ? 24 : 0);
}

function sortAndLimit(items: X8CommunicationWorkspaceItem[], maxItems: number): X8CommunicationWorkspaceItem[] {
  return [...items].sort((a, b) => scoreItem(b) - scoreItem(a) || a.label.localeCompare(b.label) || a.id.localeCompare(b.id)).slice(0, maxItems);
}

export function deriveHumanApprovedCommunicationWorkspace(input: X8CommunicationWorkspaceInput = {}): X8CommunicationWorkspaceSummary {
  const items = input.items ?? [];
  const readinessThreshold = input.readinessThreshold ?? 70;
  const riskThreshold = input.riskThreshold ?? 5;
  const staleReviewAfterDays = input.staleReviewAfterDays ?? 7;
  const maxItems = input.maxItemsPerSection ?? 5;
  const communicationReviewItems = sortAndLimit(items.filter((item) => (item.daysSinceLastHumanReview ?? 0) >= staleReviewAfterDays || item.missingCommunicationContext || item.governanceBlocked), maxItems);
  const communicationReadinessItems = sortAndLimit(items.filter((item) => (item.communicationReadinessScore ?? 100) < readinessThreshold), maxItems);
  const communicationRiskItems = sortAndLimit(items.filter((item) => (item.communicationRiskScore ?? 0) >= riskThreshold || item.hasDncFlag || item.hasOptOutFlag), maxItems);
  const humanApprovalItems = sortAndLimit(items.filter((item) => item.humanApprovalReady), maxItems);
  const dncAwarenessItems = sortAndLimit(items.filter((item) => item.hasDncFlag), maxItems);
  const optOutAwarenessItems = sortAndLimit(items.filter((item) => item.hasOptOutFlag), maxItems);
  const providerBlockedItems = sortAndLimit(items.filter((item) => item.providerBlocked), maxItems);
  const communicationContextItems = sortAndLimit(items.filter((item) => item.missingCommunicationContext), maxItems);
  const communicationGovernanceItems = sortAndLimit(items.filter((item) => item.governanceBlocked || item.hasDncFlag || item.hasOptOutFlag || item.providerBlocked), maxItems);
  const manualCommunicationRecommendations = [
    communicationReviewItems.length > 0 || communicationReadinessItems.length > 0 ? "Review communication readiness manually before any real-world action." : "No communication readiness review items available from read-only input.",
    communicationRiskItems.length > 0 || dncAwarenessItems.length > 0 || optOutAwarenessItems.length > 0 ? "Review communication risk, DNC, and opt-out signals manually; no message is sent and no outreach is triggered." : "No communication risk, DNC, or opt-out items detected.",
    providerBlockedItems.length > 0 || communicationGovernanceItems.length > 0 ? "Review provider-blocked and governance items manually; no provider, runtime job, routing, persistence, or audit writing is triggered." : "No provider-blocked or governance communication items detected.",
  ];
  return {
    communicationReviewItems,
    communicationReadinessItems,
    communicationRiskItems,
    humanApprovalItems,
    dncAwarenessItems,
    optOutAwarenessItems,
    providerBlockedItems,
    communicationContextItems,
    communicationGovernanceItems,
    manualCommunicationRecommendations,
    governanceWarnings: ["Human-approved communication workspace remains advisory only.", "Human operator review is required before any real-world action.", "No execution, sending, outreach, provider activation, persistence, audit writing, polling, runtime job, routing, scraping, or autonomous communication approval is authorized."],
    safetyFlags,
  };
}
