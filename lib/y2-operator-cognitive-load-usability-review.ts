import { y2ReviewFlags } from "./y2-manual-workflow-efficiency-review";

export const y2CognitiveUsabilityAreas = ["dashboard readability", "signal-to-noise ratio", "excessive warnings", "operational clutter", "review fatigue", "cognitive overload", "operator confusion risk", "readability consistency", "mobile readability", "elderly accessibility", "keyboard navigation consistency", "accessibility clarity"] as const;

export type Y2CognitiveLoadInput = Partial<Record<"dashboardReadabilityReviewed" | "signalNoiseReviewed" | "warningsReviewed" | "clutterReviewed" | "fatigueReviewed" | "overloadReviewed" | "confusionReviewed" | "readabilityConsistencyReviewed" | "mobileReadabilityReviewed" | "elderlyAccessibilityReviewed" | "keyboardNavigationReviewed" | "accessibilityClarityReviewed", boolean>> & Partial<Record<"redesignRequested" | "animationRequested" | "themeRequested" | "runtimeUiRequested", boolean>>;
export type Y2CognitiveLoadStatus = "cognitive_load_blocked" | "operator_review_required" | "cognitive_load_review_clear";

const requiredUsabilityAreas: Array<[keyof Y2CognitiveLoadInput, string]> = [["dashboardReadabilityReviewed", "dashboard readability"], ["signalNoiseReviewed", "signal-to-noise ratio"], ["warningsReviewed", "excessive warnings"], ["clutterReviewed", "operational clutter"], ["fatigueReviewed", "review fatigue"], ["overloadReviewed", "cognitive overload"], ["confusionReviewed", "operator confusion risk"], ["readabilityConsistencyReviewed", "readability consistency"], ["mobileReadabilityReviewed", "mobile readability"], ["elderlyAccessibilityReviewed", "elderly accessibility"], ["keyboardNavigationReviewed", "keyboard navigation consistency"], ["accessibilityClarityReviewed", "accessibility clarity"]];
const blockedRequests: Array<[keyof Y2CognitiveLoadInput, string]> = [["redesignRequested", "redesign remains outside Y2 scope"], ["animationRequested", "animation systems remain outside Y2 scope"], ["themeRequested", "theme systems remain outside Y2 scope"], ["runtimeUiRequested", "runtime UI behavior remains blocked"]];

export function createY2OperatorCognitiveLoadUsabilityReview(input: Y2CognitiveLoadInput = {}) {
  const missingUsabilityAreas = requiredUsabilityAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: Y2CognitiveLoadStatus = blockedReasons.length > 0 ? "cognitive_load_blocked" : missingUsabilityAreas.length > 0 ? "operator_review_required" : "cognitive_load_review_clear";
  return { phase: "Y2C" as const, status, flags: y2ReviewFlags, usabilityAreas: y2CognitiveUsabilityAreas, redesignAllowed: false, animationSystemsAllowed: false, themeSystemsAllowed: false, runtimeUiBehaviorAllowed: false, missingUsabilityAreas, blockedReasons };
}
