import { z6ManualRevenueWorkdayFlags } from "./z6-manual-revenue-workday-policy";

export const z7ManualRevenueBottleneckFlags = {
  ...z6ManualRevenueWorkdayFlags,
  bottleneckResolved: false,
  cleanupPersisted: false,
  dataChanged: false,
  enrichmentTriggered: false,
  skipTraceTriggered: false,
  scrapingTriggered: false,
  externalLookupTriggered: false,
  resolutionTaskCreated: false,
  recoveryActionExecuted: false,
} as const;

export const z7BottleneckCleanupLanes = [
  "governance_stop",
  "contact_safety_blocker",
  "missing_critical_data",
  "valuation_bottleneck",
  "follow_up_bottleneck",
  "conversion_bottleneck",
  "buyer_disposition_bottleneck",
  "closing_bottleneck",
  "workflow_stall",
  "monitor_only",
] as const;

export type Z7BottleneckCleanupLane = (typeof z7BottleneckCleanupLanes)[number];

export type Z7BottleneckCleanupLaneMetadata = {
  label: string;
  manualMeaning: string;
  revenuePurpose: string;
  requiresHumanReview: true;
  blockedExecutionBoundary: string;
};

const blockedBoundary = "Advisory only: no cleanup persistence, data change, enrichment, scraping, skip tracing, external lookup, task, queue, routing, assignment, calendar item, reminder, CRM mutation, provider call, outreach, audit write, storage write, bottleneck resolution, or revenue recovery execution is authorized.";

export const z7BottleneckCleanupLaneMetadata: Record<Z7BottleneckCleanupLane, Z7BottleneckCleanupLaneMetadata> = {
  governance_stop: {
    label: "Governance stop",
    manualMeaning: "Stop cleanup review until governance or rejected-work constraints are resolved by a human.",
    revenuePurpose: "Prevents unsafe records from entering manual recovery work.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
  contact_safety_blocker: {
    label: "Contact safety blocker",
    manualMeaning: "DNC, blocked, or contact-safety signals must be reviewed before any cleanup work.",
    revenuePurpose: "Protects the operation from prohibited outreach and unsafe recovery attempts.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
  missing_critical_data: {
    label: "Missing critical data",
    manualMeaning: "Human should inspect required lead, source, property, or pipeline data before revenue cleanup.",
    revenuePurpose: "Reduces wasted operator effort caused by incomplete records.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
  valuation_bottleneck: {
    label: "Valuation bottleneck",
    manualMeaning: "Manual valuation or offer inputs are unclear and need review.",
    revenuePurpose: "Clarifies whether the lead can move toward conservative offer review.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
  follow_up_bottleneck: {
    label: "Follow-up bottleneck",
    manualMeaning: "Follow-up timing, staleness, or response context is blocking progress.",
    revenuePurpose: "Reduces lead leakage from manual follow-up uncertainty.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
  conversion_bottleneck: {
    label: "Conversion bottleneck",
    manualMeaning: "Offer, negotiation, or contract-review readiness is stuck.",
    revenuePurpose: "Keeps near-conversion revenue from stalling silently.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
  buyer_disposition_bottleneck: {
    label: "Buyer disposition bottleneck",
    manualMeaning: "Buyer/disposition review is blocking exit-side revenue progress.",
    revenuePurpose: "Keeps disposition pressure visible without buyer outreach.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
  closing_bottleneck: {
    label: "Closing bottleneck",
    manualMeaning: "Closing coordination signals need human cleanup review.",
    revenuePurpose: "Protects revenue closest to realization.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
  workflow_stall: {
    label: "Workflow stall",
    manualMeaning: "The lead appears stuck in a workflow stage without a clearer specialized blocker.",
    revenuePurpose: "Surfaces stale manual revenue work for operator review.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
  monitor_only: {
    label: "Monitor only",
    manualMeaning: "No active cleanup bottleneck is detected from advisory input.",
    revenuePurpose: "Maintains visibility without creating unnecessary work.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
};

export function createZ7ManualRevenueBottleneckPolicyReview() {
  return {
    phase: "Z7A" as const,
    flags: z7ManualRevenueBottleneckFlags,
    advisoryOnly: true,
    deterministic: true,
    manualOperationsRemainPrimary: true,
    lanes: z7BottleneckCleanupLanes,
    laneMetadata: z7BottleneckCleanupLaneMetadata,
  };
}
