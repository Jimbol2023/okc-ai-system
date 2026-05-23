export type X10InternalPilotItem = {
  id: string;
  label: string;
  source?: string;
  priority?: number;
  pilotReadinessScore?: number;
  workflowReadinessScore?: number;
  governanceReadinessScore?: number;
  communicationReadinessScore?: number;
  operationalRiskScore?: number;
  executionBlocked?: boolean;
  providerBlocked?: boolean;
  readinessGap?: boolean;
  missingPilotData?: boolean;
  humanReviewRequired?: boolean;
  daysSincePilotReview?: number;
  operatorWorkloadWeight?: number;
};

export type X10InternalPilotInput = {
  items?: X10InternalPilotItem[];
  readinessThreshold?: number;
  riskThreshold?: number;
  staleReviewAfterDays?: number;
  maxItemsPerSection?: number;
};

export type X10InternalPilotSummary = {
  internalPilotItems: X10InternalPilotItem[];
  workflowReadinessItems: X10InternalPilotItem[];
  governanceReadinessItems: X10InternalPilotItem[];
  communicationReadinessItems: X10InternalPilotItem[];
  executionBlockedItems: X10InternalPilotItem[];
  providerBlockedItems: X10InternalPilotItem[];
  operationalRiskItems: X10InternalPilotItem[];
  readinessGapItems: X10InternalPilotItem[];
  manualPilotRecommendations: string[];
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

function scoreItem(item: X10InternalPilotItem): number {
  const pilotGap = Math.max(0, 100 - (item.pilotReadinessScore ?? 100));
  const workflowGap = Math.max(0, 100 - (item.workflowReadinessScore ?? 100));
  const governanceGap = Math.max(0, 100 - (item.governanceReadinessScore ?? 100));
  const communicationGap = Math.max(0, 100 - (item.communicationReadinessScore ?? 100));
  return (item.priority ?? 0) * 12 + pilotGap + workflowGap + governanceGap + communicationGap + (item.operationalRiskScore ?? 0) * 3 + (item.daysSincePilotReview ?? 0) * 2 + (item.operatorWorkloadWeight ?? 0) * 2 + (item.executionBlocked ? 24 : 0) + (item.providerBlocked ? 22 : 0) + (item.readinessGap ? 16 : 0) + (item.missingPilotData ? 16 : 0) + (item.humanReviewRequired ? 12 : 0);
}

function sortAndLimit(items: X10InternalPilotItem[], maxItems: number): X10InternalPilotItem[] {
  return [...items].sort((a, b) => scoreItem(b) - scoreItem(a) || a.label.localeCompare(b.label) || a.id.localeCompare(b.id)).slice(0, maxItems);
}

export function deriveInternalOperationalPilot(input: X10InternalPilotInput = {}): X10InternalPilotSummary {
  const items = input.items ?? [];
  const readinessThreshold = input.readinessThreshold ?? 70;
  const riskThreshold = input.riskThreshold ?? 5;
  const staleReviewAfterDays = input.staleReviewAfterDays ?? 7;
  const maxItems = input.maxItemsPerSection ?? 5;
  const internalPilotItems = sortAndLimit(items.filter((item) => (item.pilotReadinessScore ?? 100) < readinessThreshold || item.humanReviewRequired || (item.daysSincePilotReview ?? 0) >= staleReviewAfterDays), maxItems);
  const workflowReadinessItems = sortAndLimit(items.filter((item) => (item.workflowReadinessScore ?? 100) < readinessThreshold), maxItems);
  const governanceReadinessItems = sortAndLimit(items.filter((item) => (item.governanceReadinessScore ?? 100) < readinessThreshold || item.humanReviewRequired), maxItems);
  const communicationReadinessItems = sortAndLimit(items.filter((item) => (item.communicationReadinessScore ?? 100) < readinessThreshold), maxItems);
  const executionBlockedItems = sortAndLimit(items.filter((item) => item.executionBlocked), maxItems);
  const providerBlockedItems = sortAndLimit(items.filter((item) => item.providerBlocked), maxItems);
  const operationalRiskItems = sortAndLimit(items.filter((item) => (item.operationalRiskScore ?? 0) >= riskThreshold), maxItems);
  const readinessGapItems = sortAndLimit(items.filter((item) => item.readinessGap || item.missingPilotData), maxItems);
  const manualPilotRecommendations = [
    internalPilotItems.length > 0 || workflowReadinessItems.length > 0 ? "Review internal pilot and workflow readiness manually; pilot visibility does not authorize live execution." : "No internal pilot readiness review items available from read-only input.",
    governanceReadinessItems.length > 0 || executionBlockedItems.length > 0 ? "Review governance and execution-blocked items manually; no provider, runtime job, outreach, or routing is triggered." : "No governance or execution-blocked pilot items detected.",
    readinessGapItems.length > 0 || operationalRiskItems.length > 0 ? "Review readiness gaps and operational risk manually; no persistence, audit writing, workflow automation, or production activation is triggered." : "No readiness gap or operational risk items detected.",
  ];
  return {
    internalPilotItems,
    workflowReadinessItems,
    governanceReadinessItems,
    communicationReadinessItems,
    executionBlockedItems,
    providerBlockedItems,
    operationalRiskItems,
    readinessGapItems,
    manualPilotRecommendations,
    governanceWarnings: ["Internal operational pilot remains advisory only.", "Pilot readiness does not authorize live execution, production activation, provider use, outreach, routing, persistence, audit writing, polling, runtime jobs, or approval execution.", "Human operator review is required before any real-world action."],
    safetyFlags,
  };
}
