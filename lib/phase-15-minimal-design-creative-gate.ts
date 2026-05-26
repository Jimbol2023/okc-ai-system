import { phase15ManualDesignCreativeLanes, phase15DesignCreativeSummaryStates } from "./phase-15-manual-design-creative-policy";
import { phase15DesignCreativeImplementationLanes } from "./phase-15-design-creative-implementation-scope";
import {
  phase15DesignCreativeForbiddenDrift,
  phase15DesignCreativeHumanBoundary,
} from "./phase-15-design-creative-ai-agent-scope";

export const phase15MinimalDesignCreativeGateFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  gateOnly: true,
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
  crmMutationEnabled: false,
  storageMutationEnabled: false,
  auditWritingEnabled: false,
  outreachEnabled: false,
  spendIncreaseEnabled: false,
  phase16ImplementationEnabled: false,
  goLiveAuthorized: false,
} as const;

export const phase15MinimalDesignCreativeGateChecks = [
  "minimal_readonly_design_creative_package",
  "human_brand_judgment_required",
  "design_claim_creative_approval_required",
  "publishing_compliance_review_required",
  "seller_trust_mobile_accessibility_review_required",
  "no_ui_content_asset_logo_theme_edit_boundary_required",
  "no_publishing_campaign_ad_outreach_spend_go_live_boundary_required",
  "phase_15f_lockdown_ready",
] as const;

export type Phase15MinimalDesignCreativeGate = {
  phase: "Phase 15: Design & Creative AI Agent";
  phaseStep: "Phase 15E â€” Minimal Design & Creative Gate";
  previousStep: "Phase 15D â€” Design & Creative Implementation Scope";
  phaseDecision: "minimal_gate_only";
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
  crmMutationDecision: "not_authorized";
  storageDecision: "not_authorized";
  auditDecision: "not_authorized";
  outreachDecision: "not_authorized";
  spendDecision: "not_authorized";
  recommendedNextExactStep: "Phase 15F â€” Design & Creative Final Lockdown";
  nextStageRecommendation: "Phase 15F â€” Design & Creative Final Lockdown";
  gateChecks: typeof phase15MinimalDesignCreativeGateChecks;
  implementationLaneReferences: typeof phase15DesignCreativeImplementationLanes;
  policyLaneReferences: typeof phase15ManualDesignCreativeLanes;
  summaryStateReferences: typeof phase15DesignCreativeSummaryStates;
  gateRules: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase15MinimalDesignCreativeGateFlags;
};

export const phase15MinimalDesignCreativeGateRules = [
  "Phase 15E can only decide whether a minimal read-only design/creative visibility package is worth carrying to final lockdown.",
  "A minimal package is only advisory if it preserves human brand judgment, design approval, claim verification, creative approval, publishing approval, compliance review, seller-trust judgment, spend approval, and go-live boundaries.",
  "The gate cannot approve implementation, UI edits, content edits, asset/logo/theme edits, image generation, creative publishing, campaigns, ads, tracking, CRM mutation, outreach, spend increases, Phase 16 implementation, or go-live.",
];

export const phase15MinimalDesignCreativeGateStopRules = [
  "Phase 15E is a minimal gate only.",
  "No implementation, route changes, UI changes, form changes, content changes, metadata changes, CSS changes, theme changes, logo changes, asset edits, image generation, creative generation, creative publishing, copy publishing, page publishing, ad publishing, campaign creation, ad creation, provider activation, analytics, tracking pixels, experiments, audience upload, spend increases, CRM mutation, lead mutation, source mutation, storage mutation, audit writing, outreach, SMS/email/calling, AI voice, queues, runtime jobs, invented local claims, invented seller testimonials, invented property facts, invented before/after results, compliance/platform/legal approval by AI, Phase 16 implementation, or go-live is authorized.",
];

export const phase15MinimalDesignCreativeGateAiBoundary = [
  "summarize whether minimal read-only design/creative visibility is worth final lockdown review",
  "do not approve implementation, edit UI/content/assets/logos/themes/CSS, generate images, publish creative, create campaigns or ads, mutate CRM/storage, launch outreach, increase spend, invent claims or property facts, approve Phase 16 implementation, or authorize go-live",
];

export function getPhase15MinimalDesignCreativeGate(): Phase15MinimalDesignCreativeGate {
  const result: Phase15MinimalDesignCreativeGate = {
    phase: "Phase 15: Design & Creative AI Agent",
    phaseStep: "Phase 15E â€” Minimal Design & Creative Gate",
    previousStep: "Phase 15D â€” Design & Creative Implementation Scope",
    phaseDecision: "minimal_gate_only",
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
    crmMutationDecision: "not_authorized",
    storageDecision: "not_authorized",
    auditDecision: "not_authorized",
    outreachDecision: "not_authorized",
    spendDecision: "not_authorized",
    recommendedNextExactStep: "Phase 15F â€” Design & Creative Final Lockdown",
    nextStageRecommendation: "Phase 15F â€” Design & Creative Final Lockdown",
    gateChecks: phase15MinimalDesignCreativeGateChecks,
    implementationLaneReferences: phase15DesignCreativeImplementationLanes,
    policyLaneReferences: phase15ManualDesignCreativeLanes,
    summaryStateReferences: phase15DesignCreativeSummaryStates,
    gateRules: phase15MinimalDesignCreativeGateRules,
    stopRules: phase15MinimalDesignCreativeGateStopRules,
    aiOperatorLeverageBoundary: phase15MinimalDesignCreativeGateAiBoundary,
    humanOwnershipBoundary: phase15DesignCreativeHumanBoundary,
    forbiddenDrift: phase15DesignCreativeForbiddenDrift,
    flags: phase15MinimalDesignCreativeGateFlags,
  };
  assertPhase15MinimalDesignCreativeGateSafe(result);
  return result;
}

export function assertPhase15MinimalDesignCreativeGateSafe(result: Phase15MinimalDesignCreativeGate) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "gateOnly", "operatorLeverageOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.gateRules, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift, result.gateChecks].flat().join(" ");
  const unsafePattern = /implementation is authorized|UI edits are authorized|content edits are authorized|asset edits are authorized|image generation is authorized|creative publishing is authorized|campaigns are authorized|tracking is authorized|CRM mutation is authorized|outreach is authorized|spend increases are authorized|Phase 16 implementation is authorized|go-live is authorized/i;

  if (result.phaseStep !== "Phase 15E â€” Minimal Design & Creative Gate") throw new Error("Phase 15E step must remain pinned.");
  if (result.previousStep !== "Phase 15D â€” Design & Creative Implementation Scope") throw new Error("Phase 15E previous step must remain Phase 15D.");
  if (result.phaseDecision !== "minimal_gate_only") throw new Error("Phase 15E must remain minimal-gate-only.");
  if (Object.entries(result).some(([key, value]) => key.endsWith("Decision") && key !== "phaseDecision" && value !== "not_authorized")) throw new Error("Phase 15E decisions must remain not_authorized.");
  if (result.gateChecks.join("|") !== phase15MinimalDesignCreativeGateChecks.join("|")) throw new Error("Phase 15E gate checks are missing.");
  if (result.implementationLaneReferences.join("|") !== phase15DesignCreativeImplementationLanes.join("|")) throw new Error("Phase 15E implementation lane references are missing.");
  if (result.policyLaneReferences.join("|") !== phase15ManualDesignCreativeLanes.join("|")) throw new Error("Phase 15E policy lane references are missing.");
  if (unsafeTrue.length > 0) throw new Error("Phase 15E blocked flags cannot turn true.");
  if (!/minimal gate only/i.test(result.stopRules.join(" "))) throw new Error("Phase 15E stop rules are missing.");
  if (!/do not approve implementation/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 15E AI boundary is missing.");
  if (!/spend approval/i.test(result.humanOwnershipBoundary.join(" ")) || !/publishing approval/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 15E human boundary is missing.");
  if (result.recommendedNextExactStep !== "Phase 15F â€” Design & Creative Final Lockdown") throw new Error("Phase 15E must hand off to Phase 15F.");
  if (unsafePattern.test(text)) throw new Error("Phase 15E wording must not imply unsafe authorization.");
}

export function getPhase15MinimalDesignCreativeGateSummary() {
  const result = getPhase15MinimalDesignCreativeGate();
  return `${result.phase} / ${result.phaseStep}: gates a minimal read-only design/creative package for highest acquisition ROI per operator hour with human-owned brand judgment, design approval, claim verification, creative approval, publishing approval, compliance review, seller-trust judgment, spend approval, and go-live approval. No UI changes, no asset/logo/theme edits, no creative publishing, no campaigns/ads, no outreach, no CRM mutation, no spend increase, no go-live, and no Phase 16 implementation are authorized. Next step: ${result.recommendedNextExactStep}.`;
}
