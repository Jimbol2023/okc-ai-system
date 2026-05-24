import { z2CrmWorkflowFlags } from "./z2-crm-status-taxonomy";

export const z3FollowUpVelocityFlags = {
  ...z2CrmWorkflowFlags,
  followUpTaskCreated: false,
  scheduleWritten: false,
  queueCreated: false,
  reminderCreated: false,
  messageDraftPersisted: false,
  automationTriggered: false,
} as const;

export const z3ManualCadenceBands = [
  "same_day_manual_review",
  "within_24_hours",
  "within_48_hours",
  "within_72_hours",
  "low_frequency_nurture",
  "pause_follow_up",
  "no_follow_up",
] as const;

export type Z3ManualCadenceBand = (typeof z3ManualCadenceBands)[number];

export type Z3ManualCadenceMetadata = {
  label: string;
  description: string;
  safeManualMeaning: string;
  advisoryOnly: true;
};

export const z3ManualCadencePolicy: Record<Z3ManualCadenceBand, Z3ManualCadenceMetadata> = {
  same_day_manual_review: {
    label: "Same-day manual review",
    description: "Human operator should review the follow-up context today.",
    safeManualMeaning: "Visibility label only; it does not create a task, reminder, message, call, or queue.",
    advisoryOnly: true,
  },
  within_24_hours: {
    label: "Within 24 hours",
    description: "Human operator should review follow-up timing within 24 hours.",
    safeManualMeaning: "Timing guidance only; no schedule or outreach is written.",
    advisoryOnly: true,
  },
  within_48_hours: {
    label: "Within 48 hours",
    description: "Human operator should review follow-up timing within 48 hours.",
    safeManualMeaning: "Advisory cadence only; the operator controls any real-world action.",
    advisoryOnly: true,
  },
  within_72_hours: {
    label: "Within 72 hours",
    description: "Human operator should review follow-up timing within 72 hours.",
    safeManualMeaning: "Manual visibility only; no automation or CRM mutation is authorized.",
    advisoryOnly: true,
  },
  low_frequency_nurture: {
    label: "Low-frequency nurture",
    description: "Lead may remain visible at a low manual review cadence.",
    safeManualMeaning: "No nurture sequence is created; this only labels lower urgency.",
    advisoryOnly: true,
  },
  pause_follow_up: {
    label: "Pause follow-up",
    description: "Follow-up should pause unless a human later reopens the context.",
    safeManualMeaning: "Pause label only; it does not update status or suppress records in storage.",
    advisoryOnly: true,
  },
  no_follow_up: {
    label: "No follow-up",
    description: "Lead should not receive follow-up from this advisory workflow.",
    safeManualMeaning: "No-contact label only; it does not send, schedule, write, or mutate anything.",
    advisoryOnly: true,
  },
};

export function createZ3FollowUpVelocityPolicyReview() {
  return {
    phase: "Z3A" as const,
    flags: z3FollowUpVelocityFlags,
    advisoryOnly: true,
    deterministic: true,
    manualOperationsRemainPrimary: true,
    cadenceBands: z3ManualCadenceBands,
    cadencePolicy: z3ManualCadencePolicy,
  };
}
