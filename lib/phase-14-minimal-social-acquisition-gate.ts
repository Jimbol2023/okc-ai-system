import { phase14ManualSocialAcquisitionLanes, phase14SocialAcquisitionSummaryStates } from "./phase-14-manual-social-acquisition-policy";
import { phase14SocialAcquisitionImplementationLanes } from "./phase-14-social-acquisition-implementation-scope";
import {
  phase14SocialAcquisitionForbiddenDrift,
  phase14SocialAcquisitionHumanBoundary,
} from "./phase-14-facebook-tiktok-acquisition-scope";

export const phase14MinimalSocialAcquisitionGateFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  gateOnly: true,
  operatorLeverageOnly: true,
  implementationAuthorized: false,
  providerActivated: false,
  pixelEnabled: false,
  trackingEnabled: false,
  adAccountMutationEnabled: false,
  campaignEnabled: false,
  adEnabled: false,
  audienceUploadEnabled: false,
  creativePublishingEnabled: false,
  leadFormSyncEnabled: false,
  leadImportEnabled: false,
  crmMutationEnabled: false,
  sourceMutationEnabled: false,
  storageMutationEnabled: false,
  outreachEnabled: false,
  spendIncreaseEnabled: false,
  phase15ImplementationEnabled: false,
  goLiveAuthorized: false,
} as const;

export const phase14MinimalSocialAcquisitionGateChecks = [
  "minimal_readonly_social_acquisition_package",
  "human_channel_strategy_required",
  "platform_legal_compliance_review_required",
  "ad_claim_creative_audience_approval_required",
  "source_tracking_and_landing_alignment_review_required",
  "no_provider_pixel_tracking_campaign_spend_boundary_required",
  "no_lead_import_crm_mutation_outreach_go_live_boundary_required",
  "phase_14f_lockdown_ready",
] as const;

export type Phase14MinimalSocialAcquisitionGate = {
  phase: "Phase 14: Facebook & TikTok Acquisition Engine";
  phaseStep: "Phase 14E â€” Minimal Social Acquisition Gate";
  previousStep: "Phase 14D â€” Social Acquisition Implementation Scope";
  phaseDecision: "minimal_gate_only";
  implementationDecision: "not_authorized";
  providerDecision: "not_authorized";
  pixelDecision: "not_authorized";
  trackingDecision: "not_authorized";
  adAccountDecision: "not_authorized";
  campaignDecision: "not_authorized";
  adDecision: "not_authorized";
  audienceDecision: "not_authorized";
  creativeDecision: "not_authorized";
  leadFormDecision: "not_authorized";
  importDecision: "not_authorized";
  crmMutationDecision: "not_authorized";
  sourceDecision: "not_authorized";
  storageDecision: "not_authorized";
  outreachDecision: "not_authorized";
  spendDecision: "not_authorized";
  recommendedNextExactStep: "Phase 14F â€” Social Acquisition Final Lockdown";
  nextStageRecommendation: "Phase 14F â€” Social Acquisition Final Lockdown";
  gateChecks: typeof phase14MinimalSocialAcquisitionGateChecks;
  implementationLaneReferences: typeof phase14SocialAcquisitionImplementationLanes;
  policyLaneReferences: typeof phase14ManualSocialAcquisitionLanes;
  summaryStateReferences: typeof phase14SocialAcquisitionSummaryStates;
  gateRules: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase14MinimalSocialAcquisitionGateFlags;
};

export const phase14MinimalSocialAcquisitionGateRules = [
  "Phase 14E can only decide whether a minimal read-only social acquisition visibility package is worth carrying to final lockdown.",
  "A minimal package is only advisory if it preserves human channel strategy, platform/legal compliance judgment, ad claim approval, creative approval, audience approval, source judgment, spend approval, campaign approval, provider approval, and go-live boundaries.",
  "The gate cannot approve implementation, provider activation, pixels, tracking, audiences, campaigns, ads, creative publishing, lead import, CRM mutation, outreach, spend increases, Phase 15 implementation, or go-live.",
];

export const phase14MinimalSocialAcquisitionGateStopRules = [
  "Phase 14E is a minimal gate only.",
  "No implementation, Facebook/TikTok provider activation, SDK imports, env reads, credential reads, API calls, webhooks, lead-form sync, pixel installation, event tracking, analytics, custom audiences, lookalike audiences, retargeting, audience upload, campaign creation, ad creation, creative publishing, copy publishing, budget changes, spend increases, campaign launch, ad account mutation, route/UI/form/content/metadata/API/schema/storage/auth/security mutations, lead creation, lead import, CRM mutation, source mutation, storage writes, audit writing, seller outreach, buyer outreach, SMS/email/calling, AI voice, queues, runtime jobs, polling, consent collection, DNC/opt-out bypass, platform/legal approval by AI, Phase 15 implementation, or go-live is authorized.",
];

export const phase14MinimalSocialAcquisitionGateAiBoundary = [
  "summarize whether minimal read-only social acquisition visibility is worth final lockdown review",
  "do not approve implementation, activate providers, install pixels, track events, upload audiences, create campaigns or ads, publish creatives, sync lead forms, import leads, mutate CRM/source/storage, launch outreach, increase spend, approve platform/legal decisions, implement Phase 15, or authorize go-live",
];

export function getPhase14MinimalSocialAcquisitionGate(): Phase14MinimalSocialAcquisitionGate {
  const result: Phase14MinimalSocialAcquisitionGate = {
    phase: "Phase 14: Facebook & TikTok Acquisition Engine",
    phaseStep: "Phase 14E â€” Minimal Social Acquisition Gate",
    previousStep: "Phase 14D â€” Social Acquisition Implementation Scope",
    phaseDecision: "minimal_gate_only",
    implementationDecision: "not_authorized",
    providerDecision: "not_authorized",
    pixelDecision: "not_authorized",
    trackingDecision: "not_authorized",
    adAccountDecision: "not_authorized",
    campaignDecision: "not_authorized",
    adDecision: "not_authorized",
    audienceDecision: "not_authorized",
    creativeDecision: "not_authorized",
    leadFormDecision: "not_authorized",
    importDecision: "not_authorized",
    crmMutationDecision: "not_authorized",
    sourceDecision: "not_authorized",
    storageDecision: "not_authorized",
    outreachDecision: "not_authorized",
    spendDecision: "not_authorized",
    recommendedNextExactStep: "Phase 14F â€” Social Acquisition Final Lockdown",
    nextStageRecommendation: "Phase 14F â€” Social Acquisition Final Lockdown",
    gateChecks: phase14MinimalSocialAcquisitionGateChecks,
    implementationLaneReferences: phase14SocialAcquisitionImplementationLanes,
    policyLaneReferences: phase14ManualSocialAcquisitionLanes,
    summaryStateReferences: phase14SocialAcquisitionSummaryStates,
    gateRules: phase14MinimalSocialAcquisitionGateRules,
    stopRules: phase14MinimalSocialAcquisitionGateStopRules,
    aiOperatorLeverageBoundary: phase14MinimalSocialAcquisitionGateAiBoundary,
    humanOwnershipBoundary: phase14SocialAcquisitionHumanBoundary,
    forbiddenDrift: phase14SocialAcquisitionForbiddenDrift,
    flags: phase14MinimalSocialAcquisitionGateFlags,
  };
  assertPhase14MinimalSocialAcquisitionGateSafe(result);
  return result;
}

export function assertPhase14MinimalSocialAcquisitionGateSafe(result: Phase14MinimalSocialAcquisitionGate) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "gateOnly", "operatorLeverageOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.gateRules, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift, result.gateChecks].flat().join(" ");
  const unsafePattern = /implementation is authorized|provider activation is authorized|pixel installation is authorized|tracking is authorized|campaign creation is authorized|ads are authorized|lead import is authorized|CRM mutation is authorized|outreach is authorized|spend increases are authorized|Phase 15 implementation is authorized|go-live is authorized/i;

  if (result.phaseStep !== "Phase 14E â€” Minimal Social Acquisition Gate") throw new Error("Phase 14E step must remain pinned.");
  if (result.previousStep !== "Phase 14D â€” Social Acquisition Implementation Scope") throw new Error("Phase 14E previous step must remain Phase 14D.");
  if (result.phaseDecision !== "minimal_gate_only") throw new Error("Phase 14E must remain minimal-gate-only.");
  if (Object.entries(result).some(([key, value]) => key.endsWith("Decision") && key !== "phaseDecision" && value !== "not_authorized")) throw new Error("Phase 14E decisions must remain not_authorized.");
  if (result.gateChecks.join("|") !== phase14MinimalSocialAcquisitionGateChecks.join("|")) throw new Error("Phase 14E gate checks are missing.");
  if (result.implementationLaneReferences.join("|") !== phase14SocialAcquisitionImplementationLanes.join("|")) throw new Error("Phase 14E implementation lane references are missing.");
  if (result.policyLaneReferences.join("|") !== phase14ManualSocialAcquisitionLanes.join("|")) throw new Error("Phase 14E policy lane references are missing.");
  if (unsafeTrue.length > 0) throw new Error("Phase 14E blocked flags cannot turn true.");
  if (!/minimal gate only/i.test(result.stopRules.join(" "))) throw new Error("Phase 14E stop rules are missing.");
  if (!/do not approve implementation/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 14E AI boundary is missing.");
  if (!/spend approval/i.test(result.humanOwnershipBoundary.join(" ")) || !/provider approval/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 14E human boundary is missing.");
  if (result.recommendedNextExactStep !== "Phase 14F â€” Social Acquisition Final Lockdown") throw new Error("Phase 14E must hand off to Phase 14F.");
  if (unsafePattern.test(text)) throw new Error("Phase 14E wording must not imply unsafe authorization.");
}

export function getPhase14MinimalSocialAcquisitionGateSummary() {
  const result = getPhase14MinimalSocialAcquisitionGate();
  return `${result.phase} / ${result.phaseStep}: gates a minimal read-only social acquisition package for highest acquisition ROI per operator hour with human-owned channel strategy, compliance judgment, ad claim approval, creative approval, audience approval, source judgment, spend approval, campaign approval, provider approval, and go-live approval. No provider activation, no pixels/tracking, no campaigns/ads, no lead import, no outreach, no CRM mutation, no spend increase, no go-live, and no Phase 15 implementation are authorized. Next step: ${result.recommendedNextExactStep}.`;
}
