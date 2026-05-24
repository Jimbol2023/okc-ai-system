import { classifyZ3ManualFollowUpPriority } from "./z3-manual-follow-up-priority";
import { reviewZ3FollowUpStalenessRisk, type Z3FollowUpLeadInput } from "./z3-follow-up-staleness-risk";
import { z3FollowUpVelocityFlags } from "./z3-follow-up-velocity-policy";

export type Z3FollowUpReadinessLevel =
  | "ready_for_manual_follow_up_review"
  | "needs_follow_up_timing"
  | "overdue_manual_review"
  | "needs_data_cleanup"
  | "suppressed_do_not_contact"
  | "terminal_no_follow_up"
  | "paused_low_velocity"
  | "not_ready";

export type Z3FollowUpReadinessResult = {
  readinessLevel: Z3FollowUpReadinessLevel;
  timingClarity: string;
  sellerContextClarity: string;
  contactSafety: string;
  staleLeadRisk: string;
  manualCadence: string;
  operatorPriority: string;
  revenueVelocityUsefulness: string;
  safeNextManualReview: string;
  staleness: ReturnType<typeof reviewZ3FollowUpStalenessRisk>;
  priority: ReturnType<typeof classifyZ3ManualFollowUpPriority>;
  flags: typeof z3FollowUpVelocityFlags;
  advisoryOnly: true;
};

function hasText(value: unknown) {
  return String(value ?? "").trim().length > 0;
}

function getReadinessLevel(staleness: ReturnType<typeof reviewZ3FollowUpStalenessRisk>, priority: ReturnType<typeof classifyZ3ManualFollowUpPriority>): Z3FollowUpReadinessLevel {
  if (staleness.velocityRiskLevel === "suppressed") return "suppressed_do_not_contact";
  if (staleness.velocityRiskLevel === "terminal") return "terminal_no_follow_up";
  if (staleness.velocityRiskLevel === "overdue") return "overdue_manual_review";
  if (priority.priorityLevel === "cleanup") return "needs_data_cleanup";
  if (staleness.velocityRiskLevel === "needs_timing") return "needs_follow_up_timing";
  if (priority.cadenceBand === "low_frequency_nurture" || priority.cadenceBand === "pause_follow_up") return "paused_low_velocity";
  if (!staleness.status) return "not_ready";
  return "ready_for_manual_follow_up_review";
}

export function createZ3FollowUpReadiness(input: Z3FollowUpLeadInput): Z3FollowUpReadinessResult {
  const staleness = reviewZ3FollowUpStalenessRisk(input);
  const priority = classifyZ3ManualFollowUpPriority(input);
  const readinessLevel = getReadinessLevel(staleness, priority);
  const sellerContextPresent = hasText(input.sellerResponse) || hasText(input.sellerMotivation) || hasText(input.sellerTimeline);

  return {
    readinessLevel,
    timingClarity: hasText(input.nextFollowUpAt) || hasText(input.followUpPlaceholder) ? "Follow-up timing is visible." : "Follow-up timing is missing or not required for terminal/suppressed state.",
    sellerContextClarity: sellerContextPresent ? "Seller context is visible for manual review." : "Seller response, motivation, or timeline context is missing.",
    contactSafety: input.doNotContact || input.blocked || staleness.status === "do_not_contact" ? "Contact is suppressed; no follow-up should occur." : "No DNC/blocked signal detected from advisory input.",
    staleLeadRisk: staleness.stalenessSignals.length > 0 ? staleness.stalenessSignals.join(", ") : "No staleness signal detected.",
    manualCadence: priority.cadenceBand,
    operatorPriority: priority.priorityLevel,
    revenueVelocityUsefulness: "Follow-up velocity output is manual-first, advisory-only, and useful for prioritizing human review.",
    safeNextManualReview: priority.reason,
    staleness,
    priority,
    flags: z3FollowUpVelocityFlags,
    advisoryOnly: true,
  };
}

export function createZ3FollowUpReadinessList(inputs: Z3FollowUpLeadInput[]) {
  const leads = inputs.map(createZ3FollowUpReadiness);
  return {
    phase: "Z3D" as const,
    flags: z3FollowUpVelocityFlags,
    advisoryOnly: true,
    leads,
    countsByReadinessLevel: leads.reduce<Record<Z3FollowUpReadinessLevel, number>>((counts, lead) => {
      counts[lead.readinessLevel] += 1;
      return counts;
    }, {
      ready_for_manual_follow_up_review: 0,
      needs_follow_up_timing: 0,
      overdue_manual_review: 0,
      needs_data_cleanup: 0,
      suppressed_do_not_contact: 0,
      terminal_no_follow_up: 0,
      paused_low_velocity: 0,
      not_ready: 0,
    }),
  };
}

export function createZ3FollowUpReadinessReview() {
  return {
    phase: "Z3D" as const,
    flags: z3FollowUpVelocityFlags,
    advisoryOnly: true,
    deterministic: true,
    readinessLevels: ["ready_for_manual_follow_up_review", "needs_follow_up_timing", "overdue_manual_review", "needs_data_cleanup", "suppressed_do_not_contact", "terminal_no_follow_up", "paused_low_velocity", "not_ready"] as const,
  };
}
