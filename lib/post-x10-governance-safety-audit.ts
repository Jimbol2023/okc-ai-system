import { postX10ReviewFlags } from "./post-x10-system-operational-review";

export const postX10GovernanceAuditAreas = ["execution drift", "provider drift", "outreach drift", "approval-as-permission drift", "routing drift", "automation drift", "runtime drift", "persistence drift", "audit-writing drift", "communication drift", "dangerous wording drift", "accessibility drift", "provider activation drift", "autonomous behavior drift"] as const;
export const postX10DangerousWordingPatterns = ["activate provider", "send now", "execute", "launch", "route work", "start automation", "trigger outreach", "approval grants execution", "write audit", "persist changes"] as const;

export type PostX10GovernanceAuditInput = Partial<Record<"executionReviewed" | "providerReviewed" | "outreachReviewed" | "approvalPermissionReviewed" | "routingReviewed" | "automationReviewed" | "runtimeReviewed" | "persistenceReviewed" | "auditWritingReviewed" | "communicationReviewed" | "dangerousWordingReviewed" | "accessibilityReviewed" | "providerActivationReviewed" | "autonomousBehaviorReviewed", boolean>> & Partial<Record<"executionRequested" | "providerRequested" | "outreachRequested" | "approvalExecutionRequested" | "routingRequested" | "automationRequested" | "runtimeRequested" | "persistenceRequested" | "auditWritingRequested" | "autonomousBehaviorRequested", boolean>>;
export type PostX10GovernanceAuditStatus = "post_x10_governance_blocked" | "operator_review_required" | "post_x10_governance_audit_clear";

const requiredReviewAreas: Array<[keyof PostX10GovernanceAuditInput, string]> = [["executionReviewed", "execution drift"], ["providerReviewed", "provider drift"], ["outreachReviewed", "outreach drift"], ["approvalPermissionReviewed", "approval-as-permission drift"], ["routingReviewed", "routing drift"], ["automationReviewed", "automation drift"], ["runtimeReviewed", "runtime drift"], ["persistenceReviewed", "persistence drift"], ["auditWritingReviewed", "audit-writing drift"], ["communicationReviewed", "communication drift"], ["dangerousWordingReviewed", "dangerous wording drift"], ["accessibilityReviewed", "accessibility drift"], ["providerActivationReviewed", "provider activation drift"], ["autonomousBehaviorReviewed", "autonomous behavior drift"]];
const blockedRequests: Array<[keyof PostX10GovernanceAuditInput, string]> = [["executionRequested", "execution remains blocked"], ["providerRequested", "provider activation remains blocked"], ["outreachRequested", "outreach remains blocked"], ["approvalExecutionRequested", "approval does not grant execution"], ["routingRequested", "routing remains blocked"], ["automationRequested", "automation remains blocked"], ["runtimeRequested", "runtime remains blocked"], ["persistenceRequested", "persistence remains blocked"], ["auditWritingRequested", "audit writing remains blocked"], ["autonomousBehaviorRequested", "autonomous behavior remains blocked"]];

export function classifyPostX10DangerousWording(text: string): "dangerous_wording_detected" | "wording_clear" {
  const normalized = text.toLowerCase();
  return postX10DangerousWordingPatterns.some((pattern) => normalized.includes(pattern)) ? "dangerous_wording_detected" : "wording_clear";
}

export function createPostX10GovernanceSafetyAudit(input: PostX10GovernanceAuditInput = {}) {
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: PostX10GovernanceAuditStatus = blockedReasons.length > 0 ? "post_x10_governance_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "post_x10_governance_audit_clear";
  return { phase: "POST-X10B" as const, status, flags: postX10ReviewFlags, auditAreas: postX10GovernanceAuditAreas, verification: ["No execution paths are authorized.", "No provider activation is authorized.", "No hidden runtime, persistence, outreach, or routing is authorized."], missingReviewAreas, blockedReasons };
}
