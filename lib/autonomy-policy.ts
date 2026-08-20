export const autonomyLevels = [
  { level: 0, key: "advisory_only", label: "Advisory only" },
  { level: 1, key: "internal_preparation", label: "Internal preparation" },
  { level: 2, key: "internal_write", label: "Internal write actions" },
  { level: 3, key: "readonly_provider_sync", label: "Read-only provider syncs" },
  { level: 4, key: "controlled_external_action", label: "Controlled external actions after exact approval" },
  { level: 5, key: "policy_authorized_recurring_external_execution", label: "Policy-authorized recurring external execution" },
] as const;

export type AutonomyLevel = (typeof autonomyLevels)[number]["level"];

export type AutonomyPolicyDefinition = {
  policyKey: string;
  lane: string;
  subjectType: "department" | "ai_employee" | "connector" | "route";
  subjectKey: string;
  actionKey: string;
  maxAutonomyLevel: AutonomyLevel;
  effect: "allow" | "deny";
  approvalRequired: boolean;
  quotaPerDay: number | null;
  killSwitchEnabled: boolean;
  allowedActions: string[];
  blockedActions: string[];
  requiredEvidence: string[];
  escalationRules: string[];
  safetyNotes: string;
};

export type AutonomyPolicyDecision = {
  allowed: boolean;
  decision: "allowed_internal" | "approval_required" | "blocked";
  maxAutonomyLevel: AutonomyLevel;
  reason: string;
  requiredEvidence: string[];
  escalationRules: string[];
  providerCalled: false;
  sent: false;
  published: false;
  liveExecutionAllowed: false;
};

export const autonomySafetyFlags = Object.freeze({
  providerCalled: false,
  providerWrite: false,
  sent: false,
  published: false,
  scraping: false,
  crmMutation: false,
  outreach: false,
  externalExecutionAllowed: false,
  liveExecutionAllowed: false,
});

export const defaultAutonomyPolicies: AutonomyPolicyDefinition[] = [
  {
    policyKey: "virtual-dfd-google-geocoding:readonly-provider-sync:disabled:v1",
    lane: "virtual_dfd_property_discovery",
    subjectType: "connector",
    subjectKey: "google_geocode",
    actionKey: "provider_read_geocode",
    maxAutonomyLevel: 2,
    effect: "deny",
    approvalRequired: true,
    quotaPerDay: 0,
    killSwitchEnabled: true,
    allowedActions: ["prepare_geocode_candidate_record"],
    blockedActions: ["provider_read_geocode", "scrape_google_maps", "infer_distress", "infer_owner_motivation", "create_lead", "create_property_opportunity", "send_sms", "send_email", "direct_mail", "provider_write"],
    requiredEvidence: ["tenant_id", "preview_environment", "credential_scope", "feature_flag", "hard_cost_budget", "ueip_audit"],
    escalationRules: ["level_3_provider_read_requested", "missing_budget", "missing_scope", "quota_exhausted", "duplicate_candidate", "cross_tenant_attempt", "production_requested"],
    safetyNotes:
      "Google Geocoding remains Level 2 internal preparation only. Future provider reads require separate Preview authorization and cannot infer distress, ownership, repairs, value, title, motivation, or trigger downstream lead/outreach work.",
  },
  {
    policyKey: "virtual-dfd-dealmachine-property-search:readonly-provider-sync:disabled:v1",
    lane: "virtual_dfd_property_discovery",
    subjectType: "connector",
    subjectKey: "dealmachine_property_search",
    actionKey: "search_property_candidates",
    maxAutonomyLevel: 2,
    effect: "deny",
    approvalRequired: true,
    quotaPerDay: 0,
    killSwitchEnabled: true,
    allowedActions: ["prepare_dealmachine_candidate_record"],
    blockedActions: ["estimate_property_search_count", "search_property_candidates", "skip_trace", "send_mail", "send_sms", "send_email", "call_seller", "autonomous_outreach", "create_lead", "create_property_opportunity", "provider_write"],
    requiredEvidence: ["tenant_id", "preview_environment", "account_api_capability", "credential_scope", "feature_flag", "hard_credit_budget", "ueip_audit"],
    escalationRules: ["level_3_provider_read_requested", "official_capability_unconfirmed", "missing_budget", "missing_scope", "credits_exhausted", "duplicate_candidate", "cross_tenant_attempt", "production_requested"],
    safetyNotes:
      "DealMachine remains Level 2 internal preparation only. Skip tracing, mail, seller outreach, provider reads, and provider writes are blocked until account capability and hard budget are separately certified.",
  },
  {
    policyKey: "lead-intake-qualification:create-crm-task:v1",
    lane: "lead_intake_qualification",
    subjectType: "department",
    subjectKey: "Revenue Operations",
    actionKey: "create_internal_crm_task",
    maxAutonomyLevel: 2,
    effect: "allow",
    approvalRequired: false,
    quotaPerDay: 50,
    killSwitchEnabled: false,
    allowedActions: ["score_lead", "create_internal_crm_task", "record_business_outcome", "record_memory"],
    blockedActions: ["send_sms", "send_email", "publish", "scrape_source", "activate_connector", "provider_write", "paid_property_enrichment"],
    requiredEvidence: ["stored_lead", "source_attribution", "revenue_score", "no_dnc_or_opt_out"],
    escalationRules: ["missing_source", "missing_seller_contact", "do_not_contact", "duplicate_risk", "policy_quota_exhausted"],
    safetyNotes:
      "Level 2 authorizes internal CRM task creation and outcome records only. It does not authorize seller contact, provider calls, publishing, scraping, paid enrichment, or external execution.",
  },
  {
    policyKey: "external-communications:blocked:v1",
    lane: "external_communications",
    subjectType: "connector",
    subjectKey: "twilio",
    actionKey: "send_sms",
    maxAutonomyLevel: 0,
    effect: "deny",
    approvalRequired: true,
    quotaPerDay: 0,
    killSwitchEnabled: true,
    allowedActions: [],
    blockedActions: ["send_sms", "send_email", "call_seller", "autonomous_outreach"],
    requiredEvidence: ["exact_human_approval", "consent", "dnc_check", "operator_confirmation"],
    escalationRules: ["external_action_requested"],
    safetyNotes: "Autonomous communications remain blocked. Controlled live tests use separate exact-action approval and allowlist gates.",
  },
  {
    policyKey: "public-publishing:blocked:v1",
    lane: "publishing",
    subjectType: "department",
    subjectKey: "Marketing",
    actionKey: "publish",
    maxAutonomyLevel: 0,
    effect: "deny",
    approvalRequired: true,
    quotaPerDay: 0,
    killSwitchEnabled: true,
    allowedActions: ["prepare_internal_draft"],
    blockedActions: ["publish", "schedule_post", "run_ads", "change_budget"],
    requiredEvidence: ["claim_review", "brand_review", "exact_human_approval"],
    escalationRules: ["public_claim_requires_review"],
    safetyNotes: "Marketing autonomy may prepare drafts only. Public publishing and spend remain blocked.",
  },
];

export function getAutonomyLevel(level: number): AutonomyLevel {
  if (level <= 0) return 0;
  if (level >= 5) return 5;

  return Math.round(level) as AutonomyLevel;
}

export function evaluateAutonomyPolicy(input: {
  policy: AutonomyPolicyDefinition;
  requestedAction: string;
  requestedLevel: number;
  evidence: string[];
  usedToday?: number;
}): AutonomyPolicyDecision {
  const requestedLevel = getAutonomyLevel(input.requestedLevel);
  const missingEvidence = input.policy.requiredEvidence.filter((item) => !input.evidence.includes(item));
  const blocked = input.policy.blockedActions.includes(input.requestedAction);
  const actionAllowed = input.policy.allowedActions.includes(input.requestedAction) || input.policy.actionKey === input.requestedAction;
  const quotaExhausted = typeof input.policy.quotaPerDay === "number" && input.policy.quotaPerDay >= 0 && (input.usedToday ?? 0) >= input.policy.quotaPerDay;

  if (input.policy.killSwitchEnabled) {
    return blockedDecision(input.policy, "Autonomy policy kill switch is enabled.");
  }
  if (input.policy.effect !== "allow" || blocked || !actionAllowed) {
    return blockedDecision(input.policy, "Requested action is not allowed by autonomy policy.");
  }
  if (requestedLevel > input.policy.maxAutonomyLevel) {
    return blockedDecision(input.policy, `Requested autonomy level ${requestedLevel} exceeds policy maximum ${input.policy.maxAutonomyLevel}.`);
  }
  if (missingEvidence.length > 0) {
    return blockedDecision(input.policy, `Missing required evidence: ${missingEvidence.join(", ")}.`);
  }
  if (quotaExhausted) {
    return blockedDecision(input.policy, "Policy daily quota is exhausted.");
  }
  if (input.policy.approvalRequired) {
    return {
      allowed: false,
      decision: "approval_required",
      maxAutonomyLevel: input.policy.maxAutonomyLevel,
      reason: "Exact human approval is required before this action can run.",
      requiredEvidence: input.policy.requiredEvidence,
      escalationRules: input.policy.escalationRules,
      providerCalled: false,
      sent: false,
      published: false,
      liveExecutionAllowed: false,
    };
  }

  return {
    allowed: true,
    decision: "allowed_internal",
    maxAutonomyLevel: input.policy.maxAutonomyLevel,
    reason: "Policy allows this internal autonomous action.",
    requiredEvidence: input.policy.requiredEvidence,
    escalationRules: input.policy.escalationRules,
    providerCalled: false,
    sent: false,
    published: false,
    liveExecutionAllowed: false,
  };
}

function blockedDecision(policy: AutonomyPolicyDefinition, reason: string): AutonomyPolicyDecision {
  return {
    allowed: false,
    decision: "blocked",
    maxAutonomyLevel: policy.maxAutonomyLevel,
    reason,
    requiredEvidence: policy.requiredEvidence,
    escalationRules: policy.escalationRules,
    providerCalled: false,
    sent: false,
    published: false,
    liveExecutionAllowed: false,
  };
}
