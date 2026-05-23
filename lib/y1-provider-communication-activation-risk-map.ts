import { y1PlanningFlags } from "./y1-activation-eligibility-roi-gate";

export const y1ProviderCommunicationRiskAreas = ["SMS", "email", "phone/calling", "AI-generated replies", "human-approved messages", "professional inbox workflows", "custom domain email", "local phone number", "toll-free number", "DNC/opt-out enforcement", "provider credentials", "provider failure states", "rate limits", "deliverability", "reputation risk", "compliance risk"] as const;

export type Y1ProviderCommunicationRiskInput = Partial<Record<"smsReviewed" | "emailReviewed" | "phoneReviewed" | "aiRepliesReviewed" | "humanMessagesReviewed" | "inboxReviewed" | "domainEmailReviewed" | "localNumberReviewed" | "tollFreeReviewed" | "dncOptOutReviewed" | "credentialsReviewed" | "failureStatesReviewed" | "rateLimitsReviewed" | "deliverabilityReviewed" | "reputationReviewed" | "complianceReviewed", boolean>> & Partial<Record<"providerCallRequested" | "envReadRequested" | "sendRequested" | "providerSdkRequested" | "activationRequested", boolean>>;
export type Y1RiskMapStatus = "risk_map_blocked" | "operator_review_required" | "risk_map_review_clear";

const requiredRiskAreas: Array<[keyof Y1ProviderCommunicationRiskInput, string]> = [["smsReviewed", "SMS"], ["emailReviewed", "email"], ["phoneReviewed", "phone/calling"], ["aiRepliesReviewed", "AI-generated replies"], ["humanMessagesReviewed", "human-approved messages"], ["inboxReviewed", "professional inbox workflows"], ["domainEmailReviewed", "custom domain email"], ["localNumberReviewed", "local phone number"], ["tollFreeReviewed", "toll-free number"], ["dncOptOutReviewed", "DNC/opt-out enforcement"], ["credentialsReviewed", "provider credentials"], ["failureStatesReviewed", "provider failure states"], ["rateLimitsReviewed", "rate limits"], ["deliverabilityReviewed", "deliverability"], ["reputationReviewed", "reputation risk"], ["complianceReviewed", "compliance risk"]];
const blockedRequests: Array<[keyof Y1ProviderCommunicationRiskInput, string]> = [["providerCallRequested", "provider calls remain blocked"], ["envReadRequested", "credential/env reads remain blocked"], ["sendRequested", "sending remains blocked"], ["providerSdkRequested", "provider SDK imports remain blocked"], ["activationRequested", "activation remains blocked"]];

export function createY1ProviderCommunicationActivationRiskMap(input: Y1ProviderCommunicationRiskInput = {}) {
  const missingRiskAreas = requiredRiskAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: Y1RiskMapStatus = blockedReasons.length > 0 ? "risk_map_blocked" : missingRiskAreas.length > 0 ? "operator_review_required" : "risk_map_review_clear";
  return { phase: "Y1B" as const, status, flags: y1PlanningFlags, riskAreas: y1ProviderCommunicationRiskAreas, providerActivationAllowed: false, communicationActivationAllowed: false, providerCalled: false, sent: false, riskMapOnly: true, missingRiskAreas, blockedReasons };
}
