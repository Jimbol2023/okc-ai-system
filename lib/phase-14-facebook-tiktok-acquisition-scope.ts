import {
  phase13SafetyComplianceFinalLockdownFlags,
  phase13SafetyComplianceFinalLockdownRules,
} from "./phase-13-safety-compliance-final-lockdown";

export const phase14FacebookTiktokAcquisitionScopeFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  operatorLeverageOnly: true,
  scopeOnly: true,
  implementationAuthorized: false,
  providerActivated: false,
  automationEnabled: false,
  communicationEnabled: false,
  crmMutationEnabled: false,
  schemaChangeEnabled: false,
  storageMutationEnabled: false,
  runtimeJobsEnabled: false,
  routeChangeEnabled: false,
  uiChangeEnabled: false,
  formChangeEnabled: false,
  apiChangeEnabled: false,
  authChangeEnabled: false,
  securityChangeEnabled: false,
  consentCollectionEnabled: false,
  dncBypassEnabled: false,
  optOutBypassEnabled: false,
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
  outreachEnabled: false,
  spendIncreaseEnabled: false,
  goLiveAuthorized: false,
  phase15ImplementationEnabled: false,
} as const;

export type Phase14Decision = "not_authorized";

export type Phase14FacebookTiktokAcquisitionScope = {
  phase: "Phase 14: Facebook & TikTok Acquisition Engine";
  phaseStep: "Phase 14A — Facebook & TikTok Acquisition Engine Scope";
  previousStep: "Phase 13F — Safety & Compliance Final Lockdown";
  phaseDecision: "scope_only";
  primaryMetric: "acquisition_roi_per_operator_hour";
  aiRole: "operator_leverage_only";
  humanRole: "final_channel_strategy_compliance_judgment_ad_claim_approval_creative_approval_audience_approval_lead_source_judgment_spend_approval_campaign_approval_provider_approval_execution_owner";
  implementationDecision: Phase14Decision;
  providerDecision: Phase14Decision;
  automationDecision: Phase14Decision;
  communicationDecision: Phase14Decision;
  crmMutationDecision: Phase14Decision;
  schemaDecision: Phase14Decision;
  storageDecision: Phase14Decision;
  runtimeDecision: Phase14Decision;
  routeDecision: Phase14Decision;
  uiDecision: Phase14Decision;
  formDecision: Phase14Decision;
  apiDecision: Phase14Decision;
  authDecision: Phase14Decision;
  securityDecision: Phase14Decision;
  consentDecision: Phase14Decision;
  dncDecision: Phase14Decision;
  optOutDecision: Phase14Decision;
  pixelDecision: Phase14Decision;
  trackingDecision: Phase14Decision;
  analyticsDecision: Phase14Decision;
  adAccountDecision: Phase14Decision;
  adDecision: Phase14Decision;
  campaignDecision: Phase14Decision;
  audienceDecision: Phase14Decision;
  creativeDecision: Phase14Decision;
  leadFormDecision: Phase14Decision;
  importDecision: Phase14Decision;
  webhookDecision: Phase14Decision;
  outreachDecision: Phase14Decision;
  spendDecision: Phase14Decision;
  goLiveDecision: Phase14Decision;
  recommendedNextExactStep: "Phase 14B — Social Acquisition Signal Audit";
  nextStageRecommendation: "Phase 14B — Social Acquisition Signal Audit";
  phase13FinalLockdownReference: {
    flags: typeof phase13SafetyComplianceFinalLockdownFlags;
    rules: typeof phase13SafetyComplianceFinalLockdownRules;
  };
  scopePurpose: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase14FacebookTiktokAcquisitionScopeFlags;
};

export const phase14SocialAcquisitionPurpose = [
  "Define read-only Facebook & TikTok Acquisition planning for highest acquisition ROI per operator hour.",
  "Summarize channel fit, source tracking readiness, seller-trust claim risk, creative claim truthfulness, audience sensitivity, landing-page alignment, lead import risk, tracking boundaries, spend guardrails, and human campaign approval needs for human review only.",
  "Improve acquisition focus without activating providers, SDKs, APIs, webhooks, pixels, tracking, audiences, campaigns, ads, creative publishing, lead imports, CRM/source/storage mutation, outreach, spend increases, or go-live.",
];

export const phase14SocialAcquisitionStopRules = [
  "Phase 14A is scope only.",
  "No implementation, go-live authorization, Facebook/TikTok provider activation, SDK imports, env reads, credential reads, API calls, webhooks, lead-form sync, pixel installation, event tracking, analytics, custom audiences, lookalike audiences, retargeting, audience upload, campaign creation, ad creation, creative publishing, copy publishing, budget changes, spend increases, campaign launch, ad account mutation, route/UI/form/content/metadata/API/schema/storage/auth/security mutations, lead creation, lead import, CRM mutation, source mutation, storage writes, audit writing, seller outreach, buyer outreach, SMS sending, email sending, calling, AI voice, queues, runtime jobs, polling, consent collection, DNC/opt-out bypass, platform/legal approval by AI, Phase 15 implementation, or go-live is authorized.",
];

export const phase14SocialAcquisitionAiBoundary = [
  "summarize social acquisition planning signals for human review only",
  "surface channel fit, source tracking readiness, seller-trust claim risk, creative truthfulness, audience sensitivity, landing alignment, lead import risk, pixel/tracking boundaries, spend guardrails, and campaign approval needs",
  "do not activate Facebook or TikTok providers, import SDKs, read env or credentials, call APIs, create webhooks, install pixels, track events, upload audiences, create campaigns or ads, publish creatives or copy, sync lead forms, import leads, mutate CRM/source/storage, launch outreach, increase spend, approve platform/legal decisions, implement Phase 15, or authorize go-live",
];

export const phase14SocialAcquisitionHumanBoundary = [
  "final channel strategy",
  "platform/legal compliance judgment",
  "ad claim approval",
  "creative approval",
  "audience approval",
  "lead-source judgment",
  "spend approval",
  "campaign approval",
  "provider approval",
  "communication judgment",
  "manual execution",
  "future implementation approval",
];

export const phase14SocialAcquisitionForbiddenDrift = [
  "provider activation",
  "ad account mutation",
  "campaign creation",
  "ad creation",
  "creative publishing",
  "copy publishing",
  "campaign launch",
  "pixel installation",
  "tracking activation",
  "audience upload",
  "custom audiences",
  "lookalike audiences",
  "retargeting",
  "API calls",
  "webhooks",
  "SDK imports",
  "env reads",
  "credential reads",
  "lead form sync",
  "lead import",
  "lead creation",
  "CRM mutation",
  "source mutation",
  "storage mutation",
  "outreach",
  "spend increase",
  "platform/legal approval by AI",
  "Phase 15 implementation",
  "go-live",
];

export function getPhase14FacebookTiktokAcquisitionScope(): Phase14FacebookTiktokAcquisitionScope {
  const result: Phase14FacebookTiktokAcquisitionScope = {
    phase: "Phase 14: Facebook & TikTok Acquisition Engine",
    phaseStep: "Phase 14A — Facebook & TikTok Acquisition Engine Scope",
    previousStep: "Phase 13F — Safety & Compliance Final Lockdown",
    phaseDecision: "scope_only",
    primaryMetric: "acquisition_roi_per_operator_hour",
    aiRole: "operator_leverage_only",
    humanRole: "final_channel_strategy_compliance_judgment_ad_claim_approval_creative_approval_audience_approval_lead_source_judgment_spend_approval_campaign_approval_provider_approval_execution_owner",
    implementationDecision: "not_authorized",
    providerDecision: "not_authorized",
    automationDecision: "not_authorized",
    communicationDecision: "not_authorized",
    crmMutationDecision: "not_authorized",
    schemaDecision: "not_authorized",
    storageDecision: "not_authorized",
    runtimeDecision: "not_authorized",
    routeDecision: "not_authorized",
    uiDecision: "not_authorized",
    formDecision: "not_authorized",
    apiDecision: "not_authorized",
    authDecision: "not_authorized",
    securityDecision: "not_authorized",
    consentDecision: "not_authorized",
    dncDecision: "not_authorized",
    optOutDecision: "not_authorized",
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
    outreachDecision: "not_authorized",
    spendDecision: "not_authorized",
    goLiveDecision: "not_authorized",
    recommendedNextExactStep: "Phase 14B — Social Acquisition Signal Audit",
    nextStageRecommendation: "Phase 14B — Social Acquisition Signal Audit",
    phase13FinalLockdownReference: { flags: phase13SafetyComplianceFinalLockdownFlags, rules: phase13SafetyComplianceFinalLockdownRules },
    scopePurpose: phase14SocialAcquisitionPurpose,
    stopRules: phase14SocialAcquisitionStopRules,
    aiOperatorLeverageBoundary: phase14SocialAcquisitionAiBoundary,
    humanOwnershipBoundary: phase14SocialAcquisitionHumanBoundary,
    forbiddenDrift: phase14SocialAcquisitionForbiddenDrift,
    flags: phase14FacebookTiktokAcquisitionScopeFlags,
  };
  assertPhase14FacebookTiktokAcquisitionScopeSafe(result);
  return result;
}

export function assertPhase14FacebookTiktokAcquisitionScopeSafe(result: Phase14FacebookTiktokAcquisitionScope) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "operatorLeverageOnly", "scopeOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.scopePurpose, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift].flat().join(" ");
  const unsafePattern = /provider activation is authorized|ad account mutation is authorized|campaign creation is authorized|ad creation is authorized|creative publishing is authorized|pixel installation is authorized|tracking activation is authorized|audience upload is authorized|API calls are authorized|webhooks are authorized|SDK imports are authorized|env reads are authorized|credential reads are authorized|lead form sync is authorized|lead import is authorized|CRM mutation is authorized|source mutation is authorized|storage mutation is authorized|outreach is authorized|spend increase is authorized|platform\/legal approval by AI is authorized|Phase 15 implementation is authorized|go-live is authorized/i;

  if (result.phase !== "Phase 14: Facebook & TikTok Acquisition Engine") throw new Error("Phase 14A phase must remain pinned.");
  if (result.phaseStep !== "Phase 14A — Facebook & TikTok Acquisition Engine Scope") throw new Error("Phase 14A step must remain pinned.");
  if (result.previousStep !== "Phase 13F — Safety & Compliance Final Lockdown") throw new Error("Phase 14A previous step must remain Phase 13F.");
  if (result.primaryMetric !== "acquisition_roi_per_operator_hour" || result.aiRole !== "operator_leverage_only") throw new Error("Phase 14A alignment must remain pinned.");
  if (result.phaseDecision !== "scope_only") throw new Error("Phase 14A must remain scope-only.");
  if (Object.entries(result).some(([key, value]) => key.endsWith("Decision") && key !== "phaseDecision" && value !== "not_authorized")) throw new Error("Phase 14A decisions must remain not_authorized.");
  if (result.phase13FinalLockdownReference.rules.join("|") !== phase13SafetyComplianceFinalLockdownRules.join("|")) throw new Error("Phase 14A must preserve Phase 13F final lockdown reference.");
  if (unsafeTrue.length > 0) throw new Error("Phase 14A blocked flags cannot turn true.");
  if (!/No implementation, go-live authorization/i.test(result.stopRules.join(" ")) || !/Phase 15 implementation/i.test(result.stopRules.join(" "))) throw new Error("Phase 14A stop rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not activate Facebook or TikTok providers/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 14A AI boundary is missing.");
  if (!/final channel strategy/i.test(result.humanOwnershipBoundary.join(" ")) || !/spend approval/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 14A human boundary is missing.");
  if (!/pixel installation/i.test(result.forbiddenDrift.join(" ")) || !/go-live/i.test(result.forbiddenDrift.join(" "))) throw new Error("Phase 14A forbidden drift is missing.");
  if (result.recommendedNextExactStep !== "Phase 14B — Social Acquisition Signal Audit") throw new Error("Phase 14A must hand off to Phase 14B.");
  if (unsafePattern.test(text)) throw new Error("Phase 14A wording must not imply unsafe authorization.");
}

export function getPhase14FacebookTiktokAcquisitionScopeSummary() {
  const result = getPhase14FacebookTiktokAcquisitionScope();
  return `${result.phase} / ${result.phaseStep}: read-only Facebook & TikTok Acquisition scope for highest acquisition ROI per operator hour with human-owned channel strategy, compliance judgment, ad claim approval, creative approval, audience approval, source judgment, spend approval, campaign approval, and provider approval. No provider activation, no pixels/tracking, no campaigns/ads, no lead import, no outreach, no CRM mutation, no spend increase, no go-live, and no Phase 15 implementation are authorized. Next step: ${result.recommendedNextExactStep}.`;
}
