export const autonomyLevels = [
  { level: 0, key: "LEVEL_0_ADVISORY_ONLY" },
  { level: 1, key: "LEVEL_1_INTERNAL_PREPARATION" },
  { level: 2, key: "LEVEL_2_POLICY_AUTHORIZED_INTERNAL_WRITES" },
] as const;

export const leadQualificationLane = "lead_intake_qualification";
export const leadQualificationActionKey = "create_internal_crm_task";
export const leadQualificationTaskType = "autonomous_lead_qualification_review";
export const leadQualificationPolicyKey = "lead-intake-qualification:create-crm-task:v1";
export const level2TaskTypeAllowlist = Object.freeze([leadQualificationTaskType]);

export const autonomySafetyFlags = Object.freeze({
  providerCalled: false,
  providerWrite: false,
  sent: false,
  published: false,
  outreach: false,
  scraping: false,
  paidEnrichment: false,
  externalExecutionAllowed: false,
  liveExecutionAllowed: false,
});

export type AutonomyPolicyDefinition = {
  tenantId: string;
  policyKey: string;
  lane: string;
  actionKey: string;
  maxAutonomyLevel: number;
  effect: string;
  approvalRequired: boolean;
  quotaPerDay: number | null;
  killSwitchEnabled: boolean;
  allowedActions: unknown;
  blockedActions: unknown;
  requiredEvidence: unknown;
};

export type AutonomyPolicyDecision =
  | { allowed: true; decision: "allowed"; reason: "policy_allows_bounded_internal_action" }
  | { allowed: false; decision: "denied" | "approval_required"; reason: string };

function stringArray(value: unknown): string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string") ? value : [];
}

export function evaluateAutonomyPolicy(input: {
  policy: AutonomyPolicyDefinition | null;
  tenantId: string;
  requestedAction: string;
  requestedTaskType: string;
  requestedLevel: number;
  evidence: string[];
  usedToday: number;
}): AutonomyPolicyDecision {
  const { policy } = input;
  if (!policy) return { allowed: false, decision: "denied", reason: "policy_not_configured" };
  if (policy.tenantId !== input.tenantId) return { allowed: false, decision: "denied", reason: "tenant_mismatch" };
  if (input.requestedLevel >= 3) return { allowed: false, decision: "denied", reason: "level_3_and_above_blocked" };
  if (policy.lane !== leadQualificationLane) return { allowed: false, decision: "denied", reason: "lane_not_authorized" };
  if (policy.killSwitchEnabled) return { allowed: false, decision: "denied", reason: "policy_kill_switch_enabled" };
  if (policy.effect !== "allow") return { allowed: false, decision: "denied", reason: "policy_effect_denies_action" };
  if (input.requestedLevel > policy.maxAutonomyLevel) return { allowed: false, decision: "denied", reason: "requested_level_exceeds_policy" };
  if (policy.approvalRequired) return { allowed: false, decision: "approval_required", reason: "per_action_approval_required" };
  if (!stringArray(policy.allowedActions).includes(input.requestedAction) || policy.actionKey !== input.requestedAction) {
    return { allowed: false, decision: "denied", reason: "action_not_allowed" };
  }
  if (stringArray(policy.blockedActions).includes(input.requestedAction)) return { allowed: false, decision: "denied", reason: "action_explicitly_blocked" };
  if (!level2TaskTypeAllowlist.includes(input.requestedTaskType as typeof leadQualificationTaskType)) {
    return { allowed: false, decision: "denied", reason: "task_type_not_allowlisted" };
  }
  if (typeof policy.quotaPerDay === "number" && input.usedToday >= policy.quotaPerDay) {
    return { allowed: false, decision: "approval_required", reason: "quota_exhausted" };
  }
  const missingEvidence = stringArray(policy.requiredEvidence).filter((item) => !input.evidence.includes(item));
  if (missingEvidence.length) return { allowed: false, decision: "approval_required", reason: `missing_evidence:${missingEvidence.join(",")}` };
  return { allowed: true, decision: "allowed", reason: "policy_allows_bounded_internal_action" };
}
