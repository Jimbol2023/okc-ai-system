import { z4ManualConversionFlags } from "./z4-manual-conversion-policy";

export const z5ManualRevenuePrioritizationFlags = {
  ...z4ManualConversionFlags,
  workAssigned: false,
  queueItemCreated: false,
  priorityPersisted: false,
  rankPersisted: false,
  operatorTaskCreated: false,
  leadRouted: false,
  revenueActionExecuted: false,
  notificationCreated: false,
} as const;

export const z5RevenuePriorityLanes = [
  "governance_stop",
  "blocked_cleanup",
  "work_first",
  "near_conversion",
  "near_close_revenue",
  "buyer_disposition_priority",
  "follow_up_priority",
  "data_quality_priority",
  "nurture_monitor",
  "low_priority",
] as const;

export type Z5RevenuePriorityLane = (typeof z5RevenuePriorityLanes)[number];

export type Z5RevenuePriorityLaneMetadata = {
  label: string;
  manualMeaning: string;
  revenuePurpose: string;
  requiresHumanReview: true;
  blockedExecutionBoundary: string;
};

const blockedBoundary = "Advisory only: no work assignment, queue creation, priority persistence, rank persistence, routing, notification, CRM mutation, provider call, outreach, storage write, audit write, or revenue execution is authorized.";

export const z5RevenuePriorityLaneMetadata: Record<Z5RevenuePriorityLane, Z5RevenuePriorityLaneMetadata> = {
  governance_stop: {
    label: "Governance stop",
    manualMeaning: "A human must resolve governance, DNC, rejected, or blocked safety signals before revenue work.",
    revenuePurpose: "Prevents unsafe work from outranking safety controls.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
  blocked_cleanup: {
    label: "Blocked cleanup",
    manualMeaning: "A human should clean up missing or blocked data before revenue review.",
    revenuePurpose: "Removes friction that prevents reliable revenue prioritization.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
  work_first: {
    label: "Work first",
    manualMeaning: "A human should consider this near the top of today's manual review list.",
    revenuePurpose: "Highlights high-impact opportunities without assigning work.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
  near_conversion: {
    label: "Near conversion",
    manualMeaning: "A human should review offer, negotiation, or contract readiness.",
    revenuePurpose: "Keeps conversion-ready leads visible for manual revenue decisions.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
  near_close_revenue: {
    label: "Near-close revenue",
    manualMeaning: "A human should review under-contract or closing-risk revenue first.",
    revenuePurpose: "Protects revenue already close to realization.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
  buyer_disposition_priority: {
    label: "Buyer disposition priority",
    manualMeaning: "A human should review buyer/disposition readiness for possible exit work.",
    revenuePurpose: "Improves visibility of buyer-side revenue bottlenecks.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
  follow_up_priority: {
    label: "Follow-up priority",
    manualMeaning: "A human should review seller follow-up urgency before lower-value work.",
    revenuePurpose: "Reduces revenue leakage from stale seller follow-up.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
  data_quality_priority: {
    label: "Data quality priority",
    manualMeaning: "A human should resolve missing value, contact, source, or readiness data.",
    revenuePurpose: "Makes future revenue decisions more trustworthy.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
  nurture_monitor: {
    label: "Nurture monitor",
    manualMeaning: "A human may monitor this lead at a lower manual cadence.",
    revenuePurpose: "Keeps lower-intensity opportunities visible without overworking them.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
  low_priority: {
    label: "Low priority",
    manualMeaning: "A human should not prioritize this above higher-value or higher-risk work.",
    revenuePurpose: "Protects operator time for better revenue opportunities.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
};

export function createZ5ManualRevenuePrioritizationPolicyReview() {
  return {
    phase: "Z5A" as const,
    flags: z5ManualRevenuePrioritizationFlags,
    advisoryOnly: true,
    deterministic: true,
    manualOperationsRemainPrimary: true,
    lanes: z5RevenuePriorityLanes,
    laneMetadata: z5RevenuePriorityLaneMetadata,
  };
}
