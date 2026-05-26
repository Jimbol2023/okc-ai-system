import {
  phase14SocialAcquisitionFinalLockdownFlags,
  phase14SocialAcquisitionFinalLockdownRules,
} from "./phase-14-social-acquisition-final-lockdown";

export const phase15DesignCreativeAiAgentScopeFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  scopeOnly: true,
  operatorLeverageOnly: true,
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
  contentChangeEnabled: false,
  metadataChangeEnabled: false,
  assetChangeEnabled: false,
  imageGenerationEnabled: false,
  logoChangeEnabled: false,
  themeChangeEnabled: false,
  cssChangeEnabled: false,
  apiChangeEnabled: false,
  auditWritingEnabled: false,
  publishingEnabled: false,
  campaignEnabled: false,
  adEnabled: false,
  creativePublishingEnabled: false,
  spendIncreaseEnabled: false,
  goLiveAuthorized: false,
  phase16ImplementationEnabled: false,
} as const;

export type Phase15Decision = "not_authorized";

export type Phase15DesignCreativeAiAgentScope = {
  phase: "Phase 15: Design & Creative AI Agent";
  phaseStep: "Phase 15A â€” Design & Creative AI Agent Scope";
  previousStep: "Phase 14F â€” Social Acquisition Final Lockdown";
  phaseDecision: "scope_only";
  primaryMetric: "acquisition_roi_per_operator_hour";
  aiRole: "operator_leverage_only";
  humanRole: "final_brand_judgment_design_approval_claim_verification_creative_approval_publishing_approval_compliance_review_seller_trust_judgment_spend_approval_execution_owner";
  implementationDecision: Phase15Decision;
  providerDecision: Phase15Decision;
  automationDecision: Phase15Decision;
  communicationDecision: Phase15Decision;
  crmMutationDecision: Phase15Decision;
  schemaDecision: Phase15Decision;
  storageDecision: Phase15Decision;
  runtimeDecision: Phase15Decision;
  routeDecision: Phase15Decision;
  uiDecision: Phase15Decision;
  formDecision: Phase15Decision;
  contentDecision: Phase15Decision;
  metadataDecision: Phase15Decision;
  assetDecision: Phase15Decision;
  imageDecision: Phase15Decision;
  logoDecision: Phase15Decision;
  themeDecision: Phase15Decision;
  cssDecision: Phase15Decision;
  apiDecision: Phase15Decision;
  auditDecision: Phase15Decision;
  publishingDecision: Phase15Decision;
  campaignDecision: Phase15Decision;
  adDecision: Phase15Decision;
  creativeDecision: Phase15Decision;
  spendDecision: Phase15Decision;
  goLiveDecision: Phase15Decision;
  recommendedNextExactStep: "Phase 15B â€” Design & Creative Signal Audit";
  nextStageRecommendation: "Phase 15B â€” Design & Creative Signal Audit";
  phase14FinalLockdownReference: {
    flags: typeof phase14SocialAcquisitionFinalLockdownFlags;
    rules: typeof phase14SocialAcquisitionFinalLockdownRules;
  };
  scopePurpose: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase15DesignCreativeAiAgentScopeFlags;
};

export const phase15DesignCreativePurpose = [
  "Define read-only Design & Creative AI Agent planning for highest acquisition ROI per operator hour.",
  "Summarize brand consistency, seller trust visuals, local claim risk, CTA clarity, mobile-first clarity, accessibility/readability, asset usage risk, campaign creative boundaries, and operator design focus for human review only.",
  "Improve professional trust and conversion quality without changing UI, routes, forms, content, metadata, assets, images, logos, CSS/theme systems, APIs, storage, providers, campaigns, ads, creative publishing, CRM records, outreach, spend, or go-live.",
];

export const phase15DesignCreativeStopRules = [
  "Phase 15A is scope only.",
  "No implementation, route changes, UI changes, form changes, content changes, metadata changes, CSS changes, theme changes, logo changes, asset edits, image generation, creative generation, creative publishing, copy publishing, page publishing, ad publishing, campaign creation, ad creation, provider activation, SDK imports, API calls, webhooks, env reads, credential reads, analytics, tracking pixels, experiments, audience upload, spend increases, CRM mutation, lead mutation, source mutation, storage mutation, audit writing, seller outreach, buyer outreach, SMS/email/calling, AI voice, queues, runtime jobs, invented local claims, invented seller testimonials, invented property facts, invented before/after results, compliance/platform/legal approval by AI, Phase 16 implementation, or go-live is authorized.",
];

export const phase15DesignCreativeAiBoundary = [
  "summarize design and creative planning signals for human review only",
  "surface brand consistency, seller trust visuals, local claim consistency, mobile-first clarity, CTA alignment, creative claim truthfulness, accessibility/readability, asset usage risk, campaign creative boundaries, and operator design focus",
  "do not edit UI, routes, forms, content, metadata, CSS, themes, logos, assets, or images; do not generate assets, publish creatives, create campaigns or ads, activate providers, track analytics, mutate CRM/source/storage, launch outreach, increase spend, invent claims or property facts, approve legal/platform decisions, implement Phase 16, or authorize go-live",
];

export const phase15DesignCreativeHumanBoundary = [
  "final brand judgment",
  "design approval",
  "claim verification",
  "creative approval",
  "publishing approval",
  "compliance review",
  "seller-trust judgment",
  "spend approval",
  "communication judgment",
  "manual execution",
  "future implementation approval",
];

export const phase15DesignCreativeForbiddenDrift = [
  "UI changes",
  "route changes",
  "form changes",
  "content changes",
  "metadata changes",
  "CSS changes",
  "theme changes",
  "logo changes",
  "asset edits",
  "image generation",
  "creative generation",
  "creative publishing",
  "copy publishing",
  "page publishing",
  "ad publishing",
  "campaign creation",
  "ad creation",
  "provider activation",
  "SDK/API/webhook/env/credential access",
  "analytics or tracking",
  "audience upload",
  "spend increase",
  "CRM mutation",
  "lead mutation",
  "source mutation",
  "storage mutation",
  "audit writing",
  "seller outreach",
  "buyer outreach",
  "invented local claims",
  "invented seller testimonials",
  "invented property facts",
  "invented before/after results",
  "compliance/platform/legal approval by AI",
  "Phase 16 implementation",
  "go-live",
];

export function getPhase15DesignCreativeAiAgentScope(): Phase15DesignCreativeAiAgentScope {
  const result: Phase15DesignCreativeAiAgentScope = {
    phase: "Phase 15: Design & Creative AI Agent",
    phaseStep: "Phase 15A â€” Design & Creative AI Agent Scope",
    previousStep: "Phase 14F â€” Social Acquisition Final Lockdown",
    phaseDecision: "scope_only",
    primaryMetric: "acquisition_roi_per_operator_hour",
    aiRole: "operator_leverage_only",
    humanRole: "final_brand_judgment_design_approval_claim_verification_creative_approval_publishing_approval_compliance_review_seller_trust_judgment_spend_approval_execution_owner",
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
    contentDecision: "not_authorized",
    metadataDecision: "not_authorized",
    assetDecision: "not_authorized",
    imageDecision: "not_authorized",
    logoDecision: "not_authorized",
    themeDecision: "not_authorized",
    cssDecision: "not_authorized",
    apiDecision: "not_authorized",
    auditDecision: "not_authorized",
    publishingDecision: "not_authorized",
    campaignDecision: "not_authorized",
    adDecision: "not_authorized",
    creativeDecision: "not_authorized",
    spendDecision: "not_authorized",
    goLiveDecision: "not_authorized",
    recommendedNextExactStep: "Phase 15B â€” Design & Creative Signal Audit",
    nextStageRecommendation: "Phase 15B â€” Design & Creative Signal Audit",
    phase14FinalLockdownReference: { flags: phase14SocialAcquisitionFinalLockdownFlags, rules: phase14SocialAcquisitionFinalLockdownRules },
    scopePurpose: phase15DesignCreativePurpose,
    stopRules: phase15DesignCreativeStopRules,
    aiOperatorLeverageBoundary: phase15DesignCreativeAiBoundary,
    humanOwnershipBoundary: phase15DesignCreativeHumanBoundary,
    forbiddenDrift: phase15DesignCreativeForbiddenDrift,
    flags: phase15DesignCreativeAiAgentScopeFlags,
  };
  assertPhase15DesignCreativeAiAgentScopeSafe(result);
  return result;
}

export function assertPhase15DesignCreativeAiAgentScopeSafe(result: Phase15DesignCreativeAiAgentScope) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "scopeOnly", "operatorLeverageOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.scopePurpose, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift].flat().join(" ");
  const unsafePattern = /UI changes are authorized|content changes are authorized|asset edits are authorized|logo changes are authorized|theme changes are authorized|CSS changes are authorized|creative generation is authorized|creative publishing is authorized|campaign creation is authorized|ad creation is authorized|provider activation is authorized|tracking pixels are authorized|analytics are authorized|spend increases are authorized|CRM mutation is authorized|storage mutation is authorized|outreach is authorized|invented local claims are authorized|legal approval by AI is authorized|Phase 16 implementation is authorized|go-live is authorized/i;

  if (result.phase !== "Phase 15: Design & Creative AI Agent") throw new Error("Phase 15A phase must remain pinned.");
  if (result.phaseStep !== "Phase 15A â€” Design & Creative AI Agent Scope") throw new Error("Phase 15A step must remain pinned.");
  if (result.previousStep !== "Phase 14F â€” Social Acquisition Final Lockdown") throw new Error("Phase 15A previous step must remain Phase 14F.");
  if (result.primaryMetric !== "acquisition_roi_per_operator_hour" || result.aiRole !== "operator_leverage_only") throw new Error("Phase 15A alignment must remain pinned.");
  if (result.phaseDecision !== "scope_only") throw new Error("Phase 15A must remain scope-only.");
  if (Object.entries(result).some(([key, value]) => key.endsWith("Decision") && key !== "phaseDecision" && value !== "not_authorized")) throw new Error("Phase 15A decisions must remain not_authorized.");
  if (result.phase14FinalLockdownReference.rules.join("|") !== phase14SocialAcquisitionFinalLockdownRules.join("|")) throw new Error("Phase 15A must preserve Phase 14F final lockdown reference.");
  if (unsafeTrue.length > 0) throw new Error("Phase 15A blocked flags cannot turn true.");
  if (!/scope only/i.test(result.stopRules.join(" ")) || !/Phase 16 implementation/i.test(result.stopRules.join(" "))) throw new Error("Phase 15A stop rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not edit UI/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 15A AI boundary is missing.");
  if (!/final brand judgment/i.test(result.humanOwnershipBoundary.join(" ")) || !/publishing approval/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 15A human boundary is missing.");
  if (!/creative publishing/i.test(result.forbiddenDrift.join(" ")) || !/invented property facts/i.test(result.forbiddenDrift.join(" "))) throw new Error("Phase 15A forbidden drift is missing.");
  if (result.recommendedNextExactStep !== "Phase 15B â€” Design & Creative Signal Audit") throw new Error("Phase 15A must hand off to Phase 15B.");
  if (unsafePattern.test(text)) throw new Error("Phase 15A wording must not imply unsafe authorization.");
}

export function getPhase15DesignCreativeAiAgentScopeSummary() {
  const result = getPhase15DesignCreativeAiAgentScope();
  return `${result.phase} / ${result.phaseStep}: read-only Design & Creative AI Agent scope for highest acquisition ROI per operator hour with human-owned brand judgment, design approval, claim verification, creative approval, publishing approval, compliance review, seller-trust judgment, and spend approval. No UI changes, no asset/logo/theme edits, no creative publishing, no campaigns/ads, no outreach, no CRM mutation, no spend increase, no go-live, and no Phase 16 implementation are authorized. Next step: ${result.recommendedNextExactStep}.`;
}
