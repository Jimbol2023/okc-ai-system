import { phase14SocialAcquisitionSignalFamilies } from "./phase-14-social-acquisition-signal-audit";
import {
  phase14SocialAcquisitionForbiddenDrift,
  phase14SocialAcquisitionHumanBoundary,
} from "./phase-14-facebook-tiktok-acquisition-scope";

export const phase14ManualSocialAcquisitionPolicyFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  policyOnly: true,
  operatorLeverageOnly: true,
  implementationAuthorized: false,
  providerActivated: false,
  pixelEnabled: false,
  trackingEnabled: false,
  analyticsEnabled: false,
  adAccountMutationEnabled: false,
  adEnabled: false,
  campaignEnabled: false,
  audienceUploadEnabled: false,
  creativePublishingEnabled: false,
  leadFormSyncEnabled: false,
  leadImportEnabled: false,
  webhookEnabled: false,
  crmMutationEnabled: false,
  sourceMutationEnabled: false,
  storageMutationEnabled: false,
  outreachEnabled: false,
  spendIncreaseEnabled: false,
  phase15ImplementationEnabled: false,
  goLiveAuthorized: false,
} as const;

export const phase14ManualSocialAcquisitionLanes = [
  "stop_compliance_and_platform_policy_first",
  "channel_fit_review",
  "source_tracking_readiness_review",
  "seller_trust_claim_review",
  "creative_claim_truthfulness_review",
  "audience_sensitivity_review",
  "landing_conversion_alignment_review",
  "lead_form_import_risk_review",
  "pixel_tracking_boundary_review",
  "spend_and_budget_guardrail_review",
  "human_campaign_approval_review",
  "defer_until_platform_and_legal_approved",
] as const;

export const phase14SocialAcquisitionSummaryStates = [
  "social_acquisition_blocked",
  "platform_policy_review_required",
  "legal_compliance_review_required",
  "source_tracking_not_ready",
  "claim_truthfulness_review_required",
  "audience_review_required",
  "landing_alignment_visible",
  "lead_import_risk_visible",
  "tracking_boundary_review_only",
  "spend_guardrail_review_only",
  "human_approval_required",
  "not_ready",
] as const;

export type Phase14ManualSocialAcquisitionPolicy = {
  phase: "Phase 14: Facebook & TikTok Acquisition Engine";
  phaseStep: "Phase 14C â€” Manual Social Acquisition Advisory Policy";
  previousStep: "Phase 14B â€” Social Acquisition Signal Audit";
  phaseDecision: "manual_policy_only";
  implementationDecision: "not_authorized";
  providerDecision: "not_authorized";
  pixelDecision: "not_authorized";
  trackingDecision: "not_authorized";
  analyticsDecision: "not_authorized";
  adAccountDecision: "not_authorized";
  adDecision: "not_authorized";
  campaignDecision: "not_authorized";
  audienceDecision: "not_authorized";
  creativeDecision: "not_authorized";
  leadFormDecision: "not_authorized";
  importDecision: "not_authorized";
  webhookDecision: "not_authorized";
  crmMutationDecision: "not_authorized";
  sourceDecision: "not_authorized";
  storageDecision: "not_authorized";
  outreachDecision: "not_authorized";
  spendDecision: "not_authorized";
  recommendedNextExactStep: "Phase 14D â€” Social Acquisition Implementation Scope";
  nextStageRecommendation: "Phase 14D â€” Social Acquisition Implementation Scope";
  signalReferences: typeof phase14SocialAcquisitionSignalFamilies;
  socialAcquisitionLanes: typeof phase14ManualSocialAcquisitionLanes;
  summaryStates: typeof phase14SocialAcquisitionSummaryStates;
  policyRules: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase14ManualSocialAcquisitionPolicyFlags;
};

export const phase14ManualSocialAcquisitionPolicyRules = [
  "Manual social acquisition lanes are advisory visibility only and cannot trigger provider activation, pixels, tracking, analytics, audience upload, campaign creation, ad creation, creative publishing, lead import, CRM mutation, outreach, spend, or go-live.",
  "Platform policy, legal compliance, ad-claim truthfulness, audience sensitivity, source tracking, landing alignment, lead import risk, and spend guardrails remain human-owned review gates.",
  "The highest-aROI policy is to stop compliance and platform-policy risk first, then focus human review on channel fit, truthful seller-trust claims, landing conversion alignment, and campaign approval readiness.",
];

export const phase14ManualSocialAcquisitionPolicyStopRules = [
  "Phase 14C defines manual social acquisition advisory lanes and summary states only.",
  "No implementation, Facebook/TikTok provider activation, SDK imports, env reads, credential reads, API calls, webhooks, lead-form sync, pixel installation, event tracking, analytics, custom audiences, lookalike audiences, retargeting, audience upload, campaign creation, ad creation, creative publishing, copy publishing, budget changes, spend increases, campaign launch, ad account mutation, route/UI/form/content/metadata/API/schema/storage/auth/security mutations, lead creation, lead import, CRM mutation, source mutation, storage writes, audit writing, seller outreach, buyer outreach, SMS/email/calling, AI voice, queues, runtime jobs, polling, consent collection, DNC/opt-out bypass, platform/legal approval by AI, Phase 15 implementation, or go-live is authorized.",
];

export const phase14ManualSocialAcquisitionPolicyAiBoundary = [
  "rank and explain manual social acquisition lanes for human review only",
  "do not activate providers, import SDKs, read env or credentials, call APIs, create webhooks, install pixels, track events, upload audiences, create campaigns or ads, publish creatives or copy, sync lead forms, import leads, mutate CRM/source/storage, launch outreach, increase spend, approve platform/legal decisions, implement Phase 15, or authorize go-live",
];

export function getPhase14ManualSocialAcquisitionPolicy(): Phase14ManualSocialAcquisitionPolicy {
  const result: Phase14ManualSocialAcquisitionPolicy = {
    phase: "Phase 14: Facebook & TikTok Acquisition Engine",
    phaseStep: "Phase 14C â€” Manual Social Acquisition Advisory Policy",
    previousStep: "Phase 14B â€” Social Acquisition Signal Audit",
    phaseDecision: "manual_policy_only",
    implementationDecision: "not_authorized",
    providerDecision: "not_authorized",
    pixelDecision: "not_authorized",
    trackingDecision: "not_authorized",
    analyticsDecision: "not_authorized",
    adAccountDecision: "not_authorized",
    adDecision: "not_authorized",
    campaignDecision: "not_authorized",
    audienceDecision: "not_authorized",
    creativeDecision: "not_authorized",
    leadFormDecision: "not_authorized",
    importDecision: "not_authorized",
    webhookDecision: "not_authorized",
    crmMutationDecision: "not_authorized",
    sourceDecision: "not_authorized",
    storageDecision: "not_authorized",
    outreachDecision: "not_authorized",
    spendDecision: "not_authorized",
    recommendedNextExactStep: "Phase 14D â€” Social Acquisition Implementation Scope",
    nextStageRecommendation: "Phase 14D â€” Social Acquisition Implementation Scope",
    signalReferences: phase14SocialAcquisitionSignalFamilies,
    socialAcquisitionLanes: phase14ManualSocialAcquisitionLanes,
    summaryStates: phase14SocialAcquisitionSummaryStates,
    policyRules: phase14ManualSocialAcquisitionPolicyRules,
    stopRules: phase14ManualSocialAcquisitionPolicyStopRules,
    aiOperatorLeverageBoundary: phase14ManualSocialAcquisitionPolicyAiBoundary,
    humanOwnershipBoundary: phase14SocialAcquisitionHumanBoundary,
    forbiddenDrift: phase14SocialAcquisitionForbiddenDrift,
    flags: phase14ManualSocialAcquisitionPolicyFlags,
  };
  assertPhase14ManualSocialAcquisitionPolicySafe(result);
  return result;
}

export function assertPhase14ManualSocialAcquisitionPolicySafe(result: Phase14ManualSocialAcquisitionPolicy) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "policyOnly", "operatorLeverageOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.policyRules, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift, result.socialAcquisitionLanes, result.summaryStates].flat().join(" ");
  const unsafePattern = /provider activation is authorized|pixel installation is authorized|tracking is authorized|campaign creation is authorized|ad creation is authorized|creative publishing is authorized|lead import is authorized|CRM mutation is authorized|outreach is authorized|spend increases are authorized|Phase 15 implementation is authorized|go-live is authorized/i;

  if (result.phaseStep !== "Phase 14C â€” Manual Social Acquisition Advisory Policy") throw new Error("Phase 14C step must remain pinned.");
  if (result.previousStep !== "Phase 14B â€” Social Acquisition Signal Audit") throw new Error("Phase 14C previous step must remain Phase 14B.");
  if (result.phaseDecision !== "manual_policy_only") throw new Error("Phase 14C must remain manual-policy-only.");
  if (Object.entries(result).some(([key, value]) => key.endsWith("Decision") && key !== "phaseDecision" && value !== "not_authorized")) throw new Error("Phase 14C decisions must remain not_authorized.");
  if (result.socialAcquisitionLanes.join("|") !== phase14ManualSocialAcquisitionLanes.join("|")) throw new Error("Phase 14C social acquisition lanes are missing.");
  if (result.summaryStates.join("|") !== phase14SocialAcquisitionSummaryStates.join("|")) throw new Error("Phase 14C summary states are missing.");
  if (result.signalReferences.join("|") !== phase14SocialAcquisitionSignalFamilies.join("|")) throw new Error("Phase 14C signal references are missing.");
  if (unsafeTrue.length > 0) throw new Error("Phase 14C blocked flags cannot turn true.");
  if (!/advisory lanes and summary states only/i.test(result.stopRules.join(" "))) throw new Error("Phase 14C stop rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not activate providers/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 14C AI boundary is missing.");
  if (!/ad claim approval/i.test(result.humanOwnershipBoundary.join(" ")) || !/campaign approval/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 14C human boundary is missing.");
  if (result.recommendedNextExactStep !== "Phase 14D â€” Social Acquisition Implementation Scope") throw new Error("Phase 14C must hand off to Phase 14D.");
  if (unsafePattern.test(text)) throw new Error("Phase 14C wording must not imply unsafe authorization.");
}

export function getPhase14ManualSocialAcquisitionPolicySummary() {
  const result = getPhase14ManualSocialAcquisitionPolicy();
  return `${result.phase} / ${result.phaseStep}: defines manual social acquisition lanes and summary states for highest acquisition ROI per operator hour with human-owned channel strategy, compliance judgment, ad claim approval, creative approval, audience approval, source judgment, spend approval, campaign approval, and provider approval. No provider activation, no pixels/tracking, no campaigns/ads, no lead import, no outreach, no CRM mutation, no spend increase, no go-live, and no Phase 15 implementation are authorized. Next step: ${result.recommendedNextExactStep}.`;
}
