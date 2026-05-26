import { phase14ManualSocialAcquisitionLanes, phase14SocialAcquisitionSummaryStates } from "./phase-14-manual-social-acquisition-policy";
import { phase14SocialAcquisitionSignalFamilies } from "./phase-14-social-acquisition-signal-audit";
import {
  phase14SocialAcquisitionForbiddenDrift,
  phase14SocialAcquisitionHumanBoundary,
} from "./phase-14-facebook-tiktok-acquisition-scope";

export const phase14SocialAcquisitionImplementationScopeFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  implementationScopeOnly: true,
  operatorLeverageOnly: true,
  implementationAuthorized: false,
  providerActivated: false,
  sdkImportEnabled: false,
  apiCallEnabled: false,
  webhookEnabled: false,
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
  auditWritingEnabled: false,
  outreachEnabled: false,
  spendIncreaseEnabled: false,
  phase15ImplementationEnabled: false,
  goLiveAuthorized: false,
} as const;

export const phase14SocialAcquisitionImplementationLanes = [
  "candidate_readonly_channel_fit_visibility",
  "candidate_source_tracking_and_landing_alignment_visibility",
  "candidate_claim_creative_audience_risk_visibility",
  "candidate_lead_form_import_tracking_spend_guardrail_visibility",
  "deferred_platform_legal_human_approved_future_scope_only",
  "blocked_provider_pixel_campaign_ad_account_execution_paths",
] as const;

export type Phase14SocialAcquisitionImplementationScope = {
  phase: "Phase 14: Facebook & TikTok Acquisition Engine";
  phaseStep: "Phase 14D â€” Social Acquisition Implementation Scope";
  previousStep: "Phase 14C â€” Manual Social Acquisition Advisory Policy";
  phaseDecision: "implementation_scope_only";
  implementationDecision: "not_authorized";
  providerDecision: "not_authorized";
  sdkDecision: "not_authorized";
  apiDecision: "not_authorized";
  webhookDecision: "not_authorized";
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
  auditDecision: "not_authorized";
  outreachDecision: "not_authorized";
  spendDecision: "not_authorized";
  recommendedNextExactStep: "Phase 14E â€” Minimal Social Acquisition Gate";
  nextStageRecommendation: "Phase 14E â€” Minimal Social Acquisition Gate";
  implementationLanes: typeof phase14SocialAcquisitionImplementationLanes;
  signalReferences: typeof phase14SocialAcquisitionSignalFamilies;
  policyLaneReferences: typeof phase14ManualSocialAcquisitionLanes;
  summaryStateReferences: typeof phase14SocialAcquisitionSummaryStates;
  scopeRules: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase14SocialAcquisitionImplementationScopeFlags;
};

export const phase14SocialAcquisitionImplementationScopeRules = [
  "Phase 14D may describe a future read-only social acquisition visibility package, but cannot execute implementation, provider activation, SDK/API/webhook work, pixels, tracking, ad account mutation, campaigns, ads, audience upload, creative publishing, lead form sync, lead import, CRM/source/storage mutation, outreach, spend changes, or go-live.",
  "Future candidates must remain limited to readonly channel-fit visibility, source-tracking readiness visibility, landing alignment visibility, claim/creative/audience risk visibility, lead import risk visibility, pixel/tracking boundary visibility, and spend guardrail visibility.",
  "Any actual Facebook/TikTok, campaign, tracking, import, spend, or publishing change is deferred until explicit platform, legal, and human approval in a future authorized step.",
];

export const phase14SocialAcquisitionImplementationScopeStopRules = [
  "Phase 14D scopes a possible future implementation only.",
  "No implementation execution, Facebook/TikTok provider activation, SDK imports, env reads, credential reads, API calls, webhooks, lead-form sync, pixel installation, event tracking, analytics, custom audiences, lookalike audiences, retargeting, audience upload, campaign creation, ad creation, creative publishing, copy publishing, budget changes, spend increases, campaign launch, ad account mutation, route/UI/form/content/metadata/API/schema/storage/auth/security mutations, lead creation, lead import, CRM mutation, source mutation, storage writes, audit writing, seller outreach, buyer outreach, SMS/email/calling, AI voice, queues, runtime jobs, polling, consent collection, DNC/opt-out bypass, platform/legal approval by AI, Phase 15 implementation, or go-live is authorized.",
];

export const phase14SocialAcquisitionImplementationScopeAiBoundary = [
  "explain future read-only social acquisition implementation scope for human review only",
  "do not execute implementation, activate providers, import SDKs, read env or credentials, call APIs, create webhooks, install pixels, track events, upload audiences, create campaigns or ads, publish creatives, sync lead forms, import leads, mutate CRM/source/storage, write audits, launch outreach, increase spend, approve Phase 15 implementation, or authorize go-live",
];

export function getPhase14SocialAcquisitionImplementationScope(): Phase14SocialAcquisitionImplementationScope {
  const result: Phase14SocialAcquisitionImplementationScope = {
    phase: "Phase 14: Facebook & TikTok Acquisition Engine",
    phaseStep: "Phase 14D â€” Social Acquisition Implementation Scope",
    previousStep: "Phase 14C â€” Manual Social Acquisition Advisory Policy",
    phaseDecision: "implementation_scope_only",
    implementationDecision: "not_authorized",
    providerDecision: "not_authorized",
    sdkDecision: "not_authorized",
    apiDecision: "not_authorized",
    webhookDecision: "not_authorized",
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
    auditDecision: "not_authorized",
    outreachDecision: "not_authorized",
    spendDecision: "not_authorized",
    recommendedNextExactStep: "Phase 14E â€” Minimal Social Acquisition Gate",
    nextStageRecommendation: "Phase 14E â€” Minimal Social Acquisition Gate",
    implementationLanes: phase14SocialAcquisitionImplementationLanes,
    signalReferences: phase14SocialAcquisitionSignalFamilies,
    policyLaneReferences: phase14ManualSocialAcquisitionLanes,
    summaryStateReferences: phase14SocialAcquisitionSummaryStates,
    scopeRules: phase14SocialAcquisitionImplementationScopeRules,
    stopRules: phase14SocialAcquisitionImplementationScopeStopRules,
    aiOperatorLeverageBoundary: phase14SocialAcquisitionImplementationScopeAiBoundary,
    humanOwnershipBoundary: phase14SocialAcquisitionHumanBoundary,
    forbiddenDrift: phase14SocialAcquisitionForbiddenDrift,
    flags: phase14SocialAcquisitionImplementationScopeFlags,
  };
  assertPhase14SocialAcquisitionImplementationScopeSafe(result);
  return result;
}

export function assertPhase14SocialAcquisitionImplementationScopeSafe(result: Phase14SocialAcquisitionImplementationScope) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "implementationScopeOnly", "operatorLeverageOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.scopeRules, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift, result.implementationLanes].flat().join(" ");
  const unsafePattern = /implementation execution is authorized|provider activation is authorized|SDK imports are authorized|API calls are authorized|webhooks are authorized|pixel installation is authorized|event tracking is authorized|campaign creation is authorized|ad creation is authorized|audience upload is authorized|creative publishing is authorized|lead import is authorized|CRM mutation is authorized|source mutation is authorized|audit writing is authorized|outreach is authorized|spend increases are authorized|Phase 15 implementation is authorized|go-live is authorized/i;

  if (result.phaseStep !== "Phase 14D â€” Social Acquisition Implementation Scope") throw new Error("Phase 14D step must remain pinned.");
  if (result.previousStep !== "Phase 14C â€” Manual Social Acquisition Advisory Policy") throw new Error("Phase 14D previous step must remain Phase 14C.");
  if (result.phaseDecision !== "implementation_scope_only") throw new Error("Phase 14D must remain implementation-scope-only.");
  if (Object.entries(result).some(([key, value]) => key.endsWith("Decision") && key !== "phaseDecision" && value !== "not_authorized")) throw new Error("Phase 14D decisions must remain not_authorized.");
  if (result.implementationLanes.join("|") !== phase14SocialAcquisitionImplementationLanes.join("|")) throw new Error("Phase 14D implementation lanes are missing.");
  if (result.policyLaneReferences.join("|") !== phase14ManualSocialAcquisitionLanes.join("|")) throw new Error("Phase 14D policy lane references are missing.");
  if (result.summaryStateReferences.join("|") !== phase14SocialAcquisitionSummaryStates.join("|")) throw new Error("Phase 14D summary state references are missing.");
  if (unsafeTrue.length > 0) throw new Error("Phase 14D blocked flags cannot turn true.");
  if (!/possible future implementation only/i.test(result.stopRules.join(" "))) throw new Error("Phase 14D stop rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not execute implementation/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 14D AI boundary is missing.");
  if (!/future implementation approval/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 14D human boundary is missing.");
  if (result.recommendedNextExactStep !== "Phase 14E â€” Minimal Social Acquisition Gate") throw new Error("Phase 14D must hand off to Phase 14E.");
  if (unsafePattern.test(text)) throw new Error("Phase 14D wording must not imply unsafe authorization.");
}

export function getPhase14SocialAcquisitionImplementationScopeSummary() {
  const result = getPhase14SocialAcquisitionImplementationScope();
  return `${result.phase} / ${result.phaseStep}: scopes a possible future read-only social acquisition visibility package for highest acquisition ROI per operator hour with human-owned channel strategy, compliance judgment, ad claim approval, creative approval, audience approval, source judgment, spend approval, campaign approval, provider approval, and future implementation approval. No provider activation, no pixels/tracking, no campaigns/ads, no lead import, no outreach, no CRM mutation, no spend increase, no go-live, and no Phase 15 implementation are authorized. Next step: ${result.recommendedNextExactStep}.`;
}
