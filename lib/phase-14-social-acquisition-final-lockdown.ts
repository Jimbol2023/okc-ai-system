import { phase14MinimalSocialAcquisitionGateChecks } from "./phase-14-minimal-social-acquisition-gate";
import {
  phase14SocialAcquisitionForbiddenDrift,
  phase14SocialAcquisitionHumanBoundary,
} from "./phase-14-facebook-tiktok-acquisition-scope";

export const phase14SocialAcquisitionFinalLockdownFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  finalLockdownOnly: true,
  operatorLeverageOnly: true,
  implementationAuthorized: false,
  providerActivated: false,
  sdkImportEnabled: false,
  apiCallEnabled: false,
  webhookEnabled: false,
  pixelEnabled: false,
  trackingEnabled: false,
  analyticsEnabled: false,
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

export type Phase14SocialAcquisitionFinalLockdown = {
  phase: "Phase 14: Facebook & TikTok Acquisition Engine";
  phaseStep: "Phase 14F â€” Social Acquisition Final Lockdown";
  previousStep: "Phase 14E â€” Minimal Social Acquisition Gate";
  phaseDecision: "final_lockdown_only";
  implementationDecision: "not_authorized";
  providerDecision: "not_authorized";
  sdkDecision: "not_authorized";
  apiDecision: "not_authorized";
  webhookDecision: "not_authorized";
  pixelDecision: "not_authorized";
  trackingDecision: "not_authorized";
  analyticsDecision: "not_authorized";
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
  goLiveDecision: "not_authorized";
  recommendedNextExactStep: "Phase 15 â€” Design & Creative AI Agent";
  nextStageRecommendation: "Phase 15 â€” Design & Creative AI Agent";
  gateReferences: typeof phase14MinimalSocialAcquisitionGateChecks;
  lockdownRules: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase14SocialAcquisitionFinalLockdownFlags;
};

export const phase14SocialAcquisitionFinalLockdownRules = [
  "Phase 14F locks Phase 14 as read-only planning for Facebook & TikTok Acquisition intelligence.",
  "Phase 14F preserves the no-provider-activation, no-SDK/API/webhook/env/credential-access, no-pixel, no-tracking, no-audience-upload, no-campaign, no-ad, no-creative-publishing, no-lead-import, no-CRM/source/storage-mutation, no-outreach, no-spend-increase, and no-go-live boundary.",
  "Phase 14F can recommend Phase 15 â€” Design & Creative AI Agent, but cannot implement Phase 15.",
];

export const phase14SocialAcquisitionFinalLockdownStopRules = [
  "Phase 14F is final lockdown only.",
  "No implementation, Facebook/TikTok provider activation, SDK imports, env reads, credential reads, API calls, webhooks, lead-form sync, pixel installation, event tracking, analytics, custom audiences, lookalike audiences, retargeting, audience upload, campaign creation, ad creation, creative publishing, copy publishing, budget changes, spend increases, campaign launch, ad account mutation, route/UI/form/content/metadata/API/schema/storage/auth/security mutations, lead creation, lead import, CRM mutation, source mutation, storage writes, audit writing, seller outreach, buyer outreach, SMS/email/calling, AI voice, queues, runtime jobs, polling, consent collection, DNC/opt-out bypass, platform/legal approval by AI, Phase 15 implementation, or go-live is authorized.",
];

export const phase14SocialAcquisitionFinalLockdownAiBoundary = [
  "summarize Phase 14 lockdown boundaries for human review only",
  "do not implement Phase 15, activate providers, import SDKs, read env or credentials, call APIs, create webhooks, install pixels, track events, upload audiences, create campaigns or ads, publish creatives, sync lead forms, import leads, mutate CRM/source/storage, write audits, launch outreach, increase spend, approve platform/legal decisions, or authorize go-live",
];

export function getPhase14SocialAcquisitionFinalLockdown(): Phase14SocialAcquisitionFinalLockdown {
  const result: Phase14SocialAcquisitionFinalLockdown = {
    phase: "Phase 14: Facebook & TikTok Acquisition Engine",
    phaseStep: "Phase 14F â€” Social Acquisition Final Lockdown",
    previousStep: "Phase 14E â€” Minimal Social Acquisition Gate",
    phaseDecision: "final_lockdown_only",
    implementationDecision: "not_authorized",
    providerDecision: "not_authorized",
    sdkDecision: "not_authorized",
    apiDecision: "not_authorized",
    webhookDecision: "not_authorized",
    pixelDecision: "not_authorized",
    trackingDecision: "not_authorized",
    analyticsDecision: "not_authorized",
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
    goLiveDecision: "not_authorized",
    recommendedNextExactStep: "Phase 15 â€” Design & Creative AI Agent",
    nextStageRecommendation: "Phase 15 â€” Design & Creative AI Agent",
    gateReferences: phase14MinimalSocialAcquisitionGateChecks,
    lockdownRules: phase14SocialAcquisitionFinalLockdownRules,
    stopRules: phase14SocialAcquisitionFinalLockdownStopRules,
    aiOperatorLeverageBoundary: phase14SocialAcquisitionFinalLockdownAiBoundary,
    humanOwnershipBoundary: phase14SocialAcquisitionHumanBoundary,
    forbiddenDrift: phase14SocialAcquisitionForbiddenDrift,
    flags: phase14SocialAcquisitionFinalLockdownFlags,
  };
  assertPhase14SocialAcquisitionFinalLockdownSafe(result);
  return result;
}

export function assertPhase14SocialAcquisitionFinalLockdownSafe(result: Phase14SocialAcquisitionFinalLockdown) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "finalLockdownOnly", "operatorLeverageOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.lockdownRules, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift].flat().join(" ");
  const unsafePattern = /implementation is authorized|provider activation is authorized|SDK imports are authorized|API calls are authorized|webhooks are authorized|pixel installation is authorized|event tracking is authorized|audience upload is authorized|campaign creation is authorized|ads are authorized|creative publishing is authorized|lead import is authorized|CRM mutation is authorized|source mutation is authorized|audit writing is authorized|outreach is authorized|spend increases are authorized|Phase 15 implementation is authorized|go-live is authorized/i;

  if (result.phaseStep !== "Phase 14F â€” Social Acquisition Final Lockdown") throw new Error("Phase 14F step must remain pinned.");
  if (result.previousStep !== "Phase 14E â€” Minimal Social Acquisition Gate") throw new Error("Phase 14F previous step must remain Phase 14E.");
  if (result.phaseDecision !== "final_lockdown_only") throw new Error("Phase 14F must remain final-lockdown-only.");
  if (Object.entries(result).some(([key, value]) => key.endsWith("Decision") && key !== "phaseDecision" && value !== "not_authorized")) throw new Error("Phase 14F decisions must remain not_authorized.");
  if (result.gateReferences.join("|") !== phase14MinimalSocialAcquisitionGateChecks.join("|")) throw new Error("Phase 14F gate references are missing.");
  if (unsafeTrue.length > 0) throw new Error("Phase 14F blocked flags cannot turn true.");
  if (!/final lockdown only/i.test(result.stopRules.join(" "))) throw new Error("Phase 14F stop rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not implement Phase 15/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 14F AI boundary is missing.");
  if (!/channel strategy/i.test(result.humanOwnershipBoundary.join(" ")) || !/spend approval/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 14F human boundary is missing.");
  if (result.recommendedNextExactStep !== "Phase 15 â€” Design & Creative AI Agent") throw new Error("Phase 14F must recommend Phase 15.");
  if (unsafePattern.test(text)) throw new Error("Phase 14F wording must not imply unsafe authorization.");
}

export function getPhase14SocialAcquisitionFinalLockdownSummary() {
  const result = getPhase14SocialAcquisitionFinalLockdown();
  return `${result.phase} / ${result.phaseStep}: locks Phase 14 Facebook & TikTok Acquisition planning for highest acquisition ROI per operator hour with human-owned channel strategy, compliance judgment, ad claim approval, creative approval, audience approval, source judgment, spend approval, campaign approval, provider approval, and go-live approval. No provider activation, no pixels/tracking, no campaigns/ads, no lead import, no outreach, no CRM mutation, no spend increase, no go-live, and no Phase 15 implementation are authorized. Next phase: ${result.recommendedNextExactStep}.`;
}
