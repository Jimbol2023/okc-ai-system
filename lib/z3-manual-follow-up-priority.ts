import { reviewZ3FollowUpStalenessRisk, type Z3FollowUpLeadInput } from "./z3-follow-up-staleness-risk";
import { z3FollowUpVelocityFlags, type Z3ManualCadenceBand } from "./z3-follow-up-velocity-policy";

export type Z3ManualFollowUpPriorityLevel = "urgent" | "high" | "medium" | "low" | "cleanup" | "paused" | "suppressed";
export type Z3ManualFollowUpConfidence = "high" | "medium" | "low";

export type Z3ManualFollowUpPriorityResult = {
  priorityLevel: Z3ManualFollowUpPriorityLevel;
  cadenceBand: Z3ManualCadenceBand;
  reason: string;
  confidence: Z3ManualFollowUpConfidence;
  triggeredBy: string[];
  missingData: string[];
  requiredHumanReview: true;
  blockedExecutionFlags: typeof z3FollowUpVelocityFlags;
  flags: typeof z3FollowUpVelocityFlags;
};

function hasText(value: unknown) {
  return String(value ?? "").trim().length > 0;
}

function sellerText(input: Z3FollowUpLeadInput) {
  return `${input.sellerResponse ?? ""} ${input.sellerMotivation ?? ""} ${input.sellerTimeline ?? ""}`.toLowerCase();
}

function hasHotUrgentSellerContext(input: Z3FollowUpLeadInput) {
  const text = sellerText(input);
  const hot = input.isHot === true || input.priority === "High" || (input.score ?? 0) >= 70 || /motivated|urgent|foreclosure|probate|tax|vacant|behind|relocation/.test(text);
  const urgent = /asap|urgent|fast|immediate|now|today|tomorrow|soon|this week|30 day/.test(text);
  return hot && urgent;
}

function getMissingData(input: Z3FollowUpLeadInput) {
  const checks: Array<[string, unknown]> = [
    ["status", input.status],
    ["source", input.source],
    ["seller response", input.sellerResponse],
    ["seller motivation", input.sellerMotivation],
    ["seller timeline", input.sellerTimeline],
    ["follow-up timing", input.nextFollowUpAt || input.followUpPlaceholder],
  ];
  return checks.filter(([, value]) => !hasText(value)).map(([label]) => label);
}

function makeResult(
  priorityLevel: Z3ManualFollowUpPriorityLevel,
  cadenceBand: Z3ManualCadenceBand,
  reason: string,
  confidence: Z3ManualFollowUpConfidence,
  triggeredBy: string[],
  missingData: string[],
): Z3ManualFollowUpPriorityResult {
  return {
    priorityLevel,
    cadenceBand,
    reason,
    confidence,
    triggeredBy,
    missingData,
    requiredHumanReview: true,
    blockedExecutionFlags: z3FollowUpVelocityFlags,
    flags: z3FollowUpVelocityFlags,
  };
}

export function classifyZ3ManualFollowUpPriority(input: Z3FollowUpLeadInput): Z3ManualFollowUpPriorityResult {
  const risk = reviewZ3FollowUpStalenessRisk(input);
  const missingData = getMissingData(input);

  if (risk.velocityRiskLevel === "suppressed") {
    return makeResult("suppressed", "no_follow_up", "Lead is suppressed by DNC, blocked, or stop-language signals. No follow-up is recommended.", "high", risk.stalenessSignals, missingData);
  }

  if (risk.velocityRiskLevel === "terminal") {
    return makeResult("paused", "pause_follow_up", "Lead is terminal, so follow-up should pause unless a human reopens the context.", "high", risk.stalenessSignals, missingData);
  }

  if (hasHotUrgentSellerContext(input)) {
    return makeResult("urgent", "same_day_manual_review", "Hot and urgent seller context needs same-day human review only.", "high", ["hot urgent seller context"], missingData);
  }

  if (risk.velocityRiskLevel === "overdue") {
    return makeResult("urgent", "same_day_manual_review", "Manual follow-up timing is overdue and should be reviewed today.", "high", risk.stalenessSignals, missingData);
  }

  if (risk.velocityRiskLevel === "due_soon") {
    return makeResult("high", "within_24_hours", "Manual follow-up is due soon.", "medium", risk.stalenessSignals, missingData);
  }

  if (risk.velocityRiskLevel === "stale") {
    return makeResult("high", "within_24_hours", "Lead has stale follow-up or aging signals.", "medium", risk.stalenessSignals, missingData);
  }

  if (missingData.length > 0 || risk.velocityRiskLevel === "needs_timing") {
    return makeResult("cleanup", "within_48_hours", "Follow-up data needs cleanup before confident manual velocity decisions.", "low", [...risk.stalenessSignals, ...risk.warnings], missingData);
  }

  if (risk.velocityRiskLevel === "fatigue") {
    return makeResult("low", "low_frequency_nurture", "Repeated follow-up count suggests lower-frequency manual nurture or pause review.", "medium", risk.stalenessSignals, missingData);
  }

  return makeResult("medium", "within_72_hours", "Follow-up context is usable for normal manual review cadence.", "medium", ["clear follow-up velocity"], missingData);
}

export function createZ3ManualFollowUpPriorityReview() {
  return {
    phase: "Z3C" as const,
    flags: z3FollowUpVelocityFlags,
    advisoryOnly: true,
    deterministic: true,
    requiredHumanReview: true,
  };
}
