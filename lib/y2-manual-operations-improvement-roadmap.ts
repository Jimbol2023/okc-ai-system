import { y2ReviewFlags } from "./y2-manual-workflow-efficiency-review";

export const y2ManualOperationsRoadmapAreas = ["reducing operator friction", "reducing cognitive overload", "improving review efficiency", "improving workflow clarity", "improving accessibility", "improving dashboard prioritization", "improving operational readability", "improving manual deal coordination", "improving lead readiness visibility", "improving operational throughput visibility"] as const;

export type Y2RoadmapInput = Partial<Record<"frictionReviewed" | "overloadReviewed" | "reviewEfficiencyReviewed" | "workflowClarityReviewed" | "accessibilityReviewed" | "dashboardPrioritizationReviewed" | "readabilityReviewed" | "dealCoordinationReviewed" | "leadReadinessReviewed" | "throughputReviewed", boolean>> & Partial<Record<"providerActivationRequested" | "executionRequested" | "runtimeRequested" | "persistenceRequested" | "automationRequested", boolean>>;
export type Y2RoadmapStatus = "roadmap_blocked" | "operator_review_required" | "roadmap_review_clear";

const requiredRoadmapAreas: Array<[keyof Y2RoadmapInput, string]> = [["frictionReviewed", "reducing operator friction"], ["overloadReviewed", "reducing cognitive overload"], ["reviewEfficiencyReviewed", "improving review efficiency"], ["workflowClarityReviewed", "improving workflow clarity"], ["accessibilityReviewed", "improving accessibility"], ["dashboardPrioritizationReviewed", "improving dashboard prioritization"], ["readabilityReviewed", "improving operational readability"], ["dealCoordinationReviewed", "improving manual deal coordination"], ["leadReadinessReviewed", "improving lead readiness visibility"], ["throughputReviewed", "improving operational throughput visibility"]];
const blockedRequests: Array<[keyof Y2RoadmapInput, string]> = [["providerActivationRequested", "provider activation remains blocked"], ["executionRequested", "execution remains blocked"], ["runtimeRequested", "runtime behavior remains blocked"], ["persistenceRequested", "persistence remains blocked"], ["automationRequested", "automation remains blocked"]];

export function createY2ManualOperationsImprovementRoadmap(input: Y2RoadmapInput = {}) {
  const missingRoadmapAreas = requiredRoadmapAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: Y2RoadmapStatus = blockedReasons.length > 0 ? "roadmap_blocked" : missingRoadmapAreas.length > 0 ? "operator_review_required" : "roadmap_review_clear";
  return { phase: "Y2E" as const, status, flags: y2ReviewFlags, roadmapAreas: y2ManualOperationsRoadmapAreas, optimizationRoadmapOnly: true, providerActivationAllowed: false, executionAllowed: false, runtimeBehaviorAllowed: false, persistenceAllowed: false, automationAllowed: false, missingRoadmapAreas, blockedReasons };
}
