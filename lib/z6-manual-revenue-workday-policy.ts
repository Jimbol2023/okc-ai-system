import { z5ManualRevenuePrioritizationFlags } from "./z5-manual-revenue-prioritization-policy";

export const z6ManualRevenueWorkdayFlags = {
  ...z5ManualRevenuePrioritizationFlags,
  calendarItemCreated: false,
  reminderScheduled: false,
  dailyPlanPersisted: false,
  workBlockCreated: false,
  operatorAssigned: false,
  focusMovedToQueue: false,
  workdayAutomationTriggered: false,
} as const;

export const z6WorkdayFocusLanes = [
  "stop_first",
  "cleanup_first",
  "review_now",
  "work_today",
  "follow_up_today",
  "near_close_today",
  "buyer_review_today",
  "monitor_today",
  "defer_low_priority",
  "no_work_terminal",
] as const;

export type Z6WorkdayFocusLane = (typeof z6WorkdayFocusLanes)[number];

export type Z6WorkdayFocusLaneMetadata = {
  label: string;
  manualMeaning: string;
  revenuePurpose: string;
  requiresHumanReview: true;
  blockedExecutionBoundary: string;
};

const blockedBoundary = "Advisory only: no task, queue, routing, assignment, calendar item, reminder, notification, daily plan persistence, CRM mutation, provider call, outreach, audit write, storage write, or revenue execution is authorized.";

export const z6WorkdayFocusLaneMetadata: Record<Z6WorkdayFocusLane, Z6WorkdayFocusLaneMetadata> = {
  stop_first: {
    label: "Stop first",
    manualMeaning: "Resolve DNC, governance, rejected, or blocked signals before any workday focus.",
    revenuePurpose: "Keeps unsafe work from entering the day plan.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
  cleanup_first: {
    label: "Cleanup first",
    manualMeaning: "Clean up missing critical data or blockers before revenue work.",
    revenuePurpose: "Improves confidence before operator time is spent.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
  review_now: {
    label: "Review now",
    manualMeaning: "Human review should happen before lower-priority work.",
    revenuePurpose: "Protects the highest urgency revenue opportunities.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
  work_today: {
    label: "Work today",
    manualMeaning: "Human operator may consider this in today's manual review focus.",
    revenuePurpose: "Keeps high-value work visible without assigning tasks.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
  follow_up_today: {
    label: "Follow up today",
    manualMeaning: "Human should review follow-up pressure today outside automation.",
    revenuePurpose: "Reduces lead leakage from overdue or due follow-up.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
  near_close_today: {
    label: "Near-close today",
    manualMeaning: "Human should review near-close or under-contract revenue pressure.",
    revenuePurpose: "Protects revenue closest to realization.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
  buyer_review_today: {
    label: "Buyer review today",
    manualMeaning: "Human should review buyer/disposition pressure today.",
    revenuePurpose: "Keeps exit-side bottlenecks visible.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
  monitor_today: {
    label: "Monitor today",
    manualMeaning: "Human may monitor without treating this as active work.",
    revenuePurpose: "Maintains visibility without over-prioritizing.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
  defer_low_priority: {
    label: "Defer low priority",
    manualMeaning: "Human should defer behind stronger revenue focus.",
    revenuePurpose: "Protects workday capacity.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
  no_work_terminal: {
    label: "No work terminal",
    manualMeaning: "No active workday focus for terminal records.",
    revenuePurpose: "Prevents closed/dead records from consuming workday focus.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
};

export function createZ6ManualRevenueWorkdayPolicyReview() {
  return {
    phase: "Z6A" as const,
    flags: z6ManualRevenueWorkdayFlags,
    advisoryOnly: true,
    deterministic: true,
    manualOperationsRemainPrimary: true,
    lanes: z6WorkdayFocusLanes,
    laneMetadata: z6WorkdayFocusLaneMetadata,
  };
}
