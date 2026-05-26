import { phase15ManualDesignCreativeLanes, phase15DesignCreativeSummaryStates } from "./phase-15-manual-design-creative-policy";
import { phase15DesignCreativeSignalFamilies } from "./phase-15-design-creative-signal-audit";
import {
  phase15DesignCreativeForbiddenDrift,
  phase15DesignCreativeHumanBoundary,
} from "./phase-15-design-creative-ai-agent-scope";

export const phase15DesignCreativeImplementationScopeFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  implementationScopeOnly: true,
  operatorLeverageOnly: true,
  implementationAuthorized: false,
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
  publishingEnabled: false,
  creativePublishingEnabled: false,
  campaignEnabled: false,
  adEnabled: false,
  providerActivated: false,
  trackingEnabled: false,
  analyticsEnabled: false,
  crmMutationEnabled: false,
  storageMutationEnabled: false,
  auditWritingEnabled: false,
  outreachEnabled: false,
  spendIncreaseEnabled: false,
  phase16ImplementationEnabled: false,
  goLiveAuthorized: false,
} as const;

export const phase15DesignCreativeImplementationLanes = [
  "candidate_readonly_brand_standard_visibility",
  "candidate_seller_trust_and_local_claim_visibility",
  "candidate_mobile_cta_accessibility_review_visibility",
  "candidate_asset_usage_and_creative_claim_risk_visibility",
  "deferred_human_approved_future_design_scope_only",
  "blocked_ui_asset_publishing_campaign_execution_paths",
] as const;

export type Phase15DesignCreativeImplementationScope = {
  phase: "Phase 15: Design & Creative AI Agent";
  phaseStep: "Phase 15D â€” Design & Creative Implementation Scope";
  previousStep: "Phase 15C â€” Manual Design & Creative Advisory Policy";
  phaseDecision: "implementation_scope_only";
  implementationDecision: "not_authorized";
  routeDecision: "not_authorized";
  uiDecision: "not_authorized";
  formDecision: "not_authorized";
  contentDecision: "not_authorized";
  metadataDecision: "not_authorized";
  assetDecision: "not_authorized";
  imageDecision: "not_authorized";
  logoDecision: "not_authorized";
  themeDecision: "not_authorized";
  cssDecision: "not_authorized";
  publishingDecision: "not_authorized";
  creativeDecision: "not_authorized";
  campaignDecision: "not_authorized";
  adDecision: "not_authorized";
  providerDecision: "not_authorized";
  trackingDecision: "not_authorized";
  analyticsDecision: "not_authorized";
  crmMutationDecision: "not_authorized";
  storageDecision: "not_authorized";
  auditDecision: "not_authorized";
  outreachDecision: "not_authorized";
  spendDecision: "not_authorized";
  recommendedNextExactStep: "Phase 15E â€” Minimal Design & Creative Gate";
  nextStageRecommendation: "Phase 15E â€” Minimal Design & Creative Gate";
  implementationLanes: typeof phase15DesignCreativeImplementationLanes;
  signalReferences: typeof phase15DesignCreativeSignalFamilies;
  policyLaneReferences: typeof phase15ManualDesignCreativeLanes;
  summaryStateReferences: typeof phase15DesignCreativeSummaryStates;
  scopeRules: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase15DesignCreativeImplementationScopeFlags;
};

export const phase15DesignCreativeImplementationScopeRules = [
  "Phase 15D may describe a future read-only design/creative visibility package, but cannot execute implementation, route/UI/form/content/metadata/CSS/theme/asset/logo/image changes, publishing, campaigns, ads, providers, tracking, CRM/storage mutation, audit writing, outreach, spend changes, or go-live.",
  "Future candidates must remain limited to readonly brand-standard visibility, seller-trust visual review, local-claim consistency, mobile/CTA/accessibility review, asset usage risk, and creative claim risk visibility.",
  "Any actual design, creative, UI, content, asset, publishing, campaign, or spend change is deferred until explicit human approval in a future authorized step.",
];

export const phase15DesignCreativeImplementationScopeStopRules = [
  "Phase 15D scopes a possible future implementation only.",
  "No implementation execution, route changes, UI changes, form changes, content changes, metadata changes, CSS changes, theme changes, logo changes, asset edits, image generation, creative generation, creative publishing, copy publishing, page publishing, ad publishing, campaign creation, ad creation, provider activation, SDK imports, API calls, webhooks, env reads, credential reads, analytics, tracking pixels, experiments, audience upload, spend increases, CRM mutation, lead mutation, source mutation, storage mutation, audit writing, outreach, SMS/email/calling, AI voice, queues, runtime jobs, invented local claims, invented seller testimonials, invented property facts, invented before/after results, compliance/platform/legal approval by AI, Phase 16 implementation, or go-live is authorized.",
];

export const phase15DesignCreativeImplementationScopeAiBoundary = [
  "explain future read-only design/creative implementation scope for human review only",
  "do not execute implementation, edit UI/content/assets/logos/themes/CSS/metadata, generate images, publish creative, create campaigns or ads, activate providers, track analytics, mutate CRM/storage, write audits, launch outreach, increase spend, approve Phase 16 implementation, or authorize go-live",
];

export function getPhase15DesignCreativeImplementationScope(): Phase15DesignCreativeImplementationScope {
  const result: Phase15DesignCreativeImplementationScope = {
    phase: "Phase 15: Design & Creative AI Agent",
    phaseStep: "Phase 15D â€” Design & Creative Implementation Scope",
    previousStep: "Phase 15C â€” Manual Design & Creative Advisory Policy",
    phaseDecision: "implementation_scope_only",
    implementationDecision: "not_authorized",
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
    publishingDecision: "not_authorized",
    creativeDecision: "not_authorized",
    campaignDecision: "not_authorized",
    adDecision: "not_authorized",
    providerDecision: "not_authorized",
    trackingDecision: "not_authorized",
    analyticsDecision: "not_authorized",
    crmMutationDecision: "not_authorized",
    storageDecision: "not_authorized",
    auditDecision: "not_authorized",
    outreachDecision: "not_authorized",
    spendDecision: "not_authorized",
    recommendedNextExactStep: "Phase 15E â€” Minimal Design & Creative Gate",
    nextStageRecommendation: "Phase 15E â€” Minimal Design & Creative Gate",
    implementationLanes: phase15DesignCreativeImplementationLanes,
    signalReferences: phase15DesignCreativeSignalFamilies,
    policyLaneReferences: phase15ManualDesignCreativeLanes,
    summaryStateReferences: phase15DesignCreativeSummaryStates,
    scopeRules: phase15DesignCreativeImplementationScopeRules,
    stopRules: phase15DesignCreativeImplementationScopeStopRules,
    aiOperatorLeverageBoundary: phase15DesignCreativeImplementationScopeAiBoundary,
    humanOwnershipBoundary: phase15DesignCreativeHumanBoundary,
    forbiddenDrift: phase15DesignCreativeForbiddenDrift,
    flags: phase15DesignCreativeImplementationScopeFlags,
  };
  assertPhase15DesignCreativeImplementationScopeSafe(result);
  return result;
}

export function assertPhase15DesignCreativeImplementationScopeSafe(result: Phase15DesignCreativeImplementationScope) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "implementationScopeOnly", "operatorLeverageOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.scopeRules, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift, result.implementationLanes].flat().join(" ");
  const unsafePattern = /implementation execution is authorized|UI changes are authorized|content changes are authorized|asset edits are authorized|image generation is authorized|creative publishing is authorized|campaign creation is authorized|provider activation is authorized|tracking pixels are authorized|CRM mutation is authorized|storage mutation is authorized|audit writing is authorized|outreach is authorized|spend increases are authorized|Phase 16 implementation is authorized|go-live is authorized/i;

  if (result.phaseStep !== "Phase 15D â€” Design & Creative Implementation Scope") throw new Error("Phase 15D step must remain pinned.");
  if (result.previousStep !== "Phase 15C â€” Manual Design & Creative Advisory Policy") throw new Error("Phase 15D previous step must remain Phase 15C.");
  if (result.phaseDecision !== "implementation_scope_only") throw new Error("Phase 15D must remain implementation-scope-only.");
  if (Object.entries(result).some(([key, value]) => key.endsWith("Decision") && key !== "phaseDecision" && value !== "not_authorized")) throw new Error("Phase 15D decisions must remain not_authorized.");
  if (result.implementationLanes.join("|") !== phase15DesignCreativeImplementationLanes.join("|")) throw new Error("Phase 15D implementation lanes are missing.");
  if (result.policyLaneReferences.join("|") !== phase15ManualDesignCreativeLanes.join("|")) throw new Error("Phase 15D policy lane references are missing.");
  if (result.summaryStateReferences.join("|") !== phase15DesignCreativeSummaryStates.join("|")) throw new Error("Phase 15D summary state references are missing.");
  if (unsafeTrue.length > 0) throw new Error("Phase 15D blocked flags cannot turn true.");
  if (!/possible future implementation only/i.test(result.stopRules.join(" "))) throw new Error("Phase 15D stop rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not execute implementation/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 15D AI boundary is missing.");
  if (!/future implementation approval/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 15D human boundary is missing.");
  if (result.recommendedNextExactStep !== "Phase 15E â€” Minimal Design & Creative Gate") throw new Error("Phase 15D must hand off to Phase 15E.");
  if (unsafePattern.test(text)) throw new Error("Phase 15D wording must not imply unsafe authorization.");
}

export function getPhase15DesignCreativeImplementationScopeSummary() {
  const result = getPhase15DesignCreativeImplementationScope();
  return `${result.phase} / ${result.phaseStep}: scopes a possible future read-only design/creative visibility package for highest acquisition ROI per operator hour with human-owned brand judgment, design approval, claim verification, creative approval, publishing approval, compliance review, seller-trust judgment, spend approval, and future implementation approval. No UI changes, no asset/logo/theme edits, no creative publishing, no campaigns/ads, no outreach, no CRM mutation, no spend increase, no go-live, and no Phase 16 implementation are authorized. Next step: ${result.recommendedNextExactStep}.`;
}
