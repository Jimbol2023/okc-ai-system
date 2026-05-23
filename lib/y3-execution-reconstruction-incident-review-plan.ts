import { y3PlanningFlags } from "./y3-minimum-viable-audit-memory-plan";

export const y3ExecutionReconstructionReviewAreas = ["who reviewed", "what was recommended", "what was approved", "what was blocked", "governance flags", "provider state", "DNC/opt-out state", "message preview presence", "execution blocked state", "rollback trigger", "stop conditions"] as const;

export type Y3ExecutionReconstructionIncidentReviewInput = Partial<Record<"reviewerReviewed" | "recommendationReviewed" | "approvalReviewed" | "blockedReviewed" | "governanceFlagsReviewed" | "providerStateReviewed" | "dncOptOutReviewed" | "messagePreviewReviewed" | "executionBlockedReviewed" | "rollbackTriggerReviewed" | "stopConditionsReviewed", boolean>> & Partial<Record<"executionRequested" | "providerActivationRequested" | "sendRequested" | "runtimeRequested" | "persistenceRequested" | "pollingRequested" | "approvalToSendRequested", boolean>>;

export type Y3ExecutionReconstructionIncidentReviewStatus = "execution_reconstruction_incident_review_blocked" | "operator_review_required" | "execution_reconstruction_incident_review_clear";

const requiredReviewAreas: Array<[keyof Y3ExecutionReconstructionIncidentReviewInput, string]> = [["reviewerReviewed", "who reviewed"], ["recommendationReviewed", "what was recommended"], ["approvalReviewed", "what was approved"], ["blockedReviewed", "what was blocked"], ["governanceFlagsReviewed", "governance flags"], ["providerStateReviewed", "provider state"], ["dncOptOutReviewed", "DNC/opt-out state"], ["messagePreviewReviewed", "message preview presence"], ["executionBlockedReviewed", "execution blocked state"], ["rollbackTriggerReviewed", "rollback trigger"], ["stopConditionsReviewed", "stop conditions"]];
const blockedRequests: Array<[keyof Y3ExecutionReconstructionIncidentReviewInput, string]> = [["executionRequested", "execution remains blocked"], ["providerActivationRequested", "provider activation remains blocked"], ["sendRequested", "communication sending remains blocked"], ["runtimeRequested", "runtime activation remains blocked"], ["persistenceRequested", "persistence remains blocked"], ["pollingRequested", "polling remains blocked"], ["approvalToSendRequested", "approval-to-send behavior remains blocked"]];

export function createY3ExecutionReconstructionIncidentReviewPlan(input: Y3ExecutionReconstructionIncidentReviewInput = {}) {
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: Y3ExecutionReconstructionIncidentReviewStatus = blockedReasons.length > 0 ? "execution_reconstruction_incident_review_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "execution_reconstruction_incident_review_clear";
  return {
    phase: "Y3E" as const,
    status,
    flags: y3PlanningFlags,
    planningOnly: true,
    auditWritingAllowed: false,
    persistenceAllowedNow: false,
    persistenceWritten: false,
    executionAllowed: false,
    providerActivationAllowed: false,
    sent: false,
    runtimeActivationAllowed: false,
    pollingAllowed: false,
    approvalGrantsExecution: false,
    reconstructionSignals: y3ExecutionReconstructionReviewAreas,
    incidentReviewNeeds: ["reviewer placeholder", "recommendation summary", "approval state", "blocked reason", "governance flag snapshot", "provider state", "DNC/opt-out presence", "message preview presence", "rollback trigger placeholder", "stop condition summary"],
    reviewAreas: y3ExecutionReconstructionReviewAreas,
    missingReviewAreas,
    blockedReasons,
  };
}
