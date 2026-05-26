import { phase15DesignCreativeSignalFamilies } from "./phase-15-design-creative-signal-audit";
import {
  phase15DesignCreativeForbiddenDrift,
  phase15DesignCreativeHumanBoundary,
} from "./phase-15-design-creative-ai-agent-scope";

export const phase15ManualDesignCreativePolicyFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  policyOnly: true,
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
  trackingEnabled: false,
  crmMutationEnabled: false,
  storageMutationEnabled: false,
  outreachEnabled: false,
  spendIncreaseEnabled: false,
  phase16ImplementationEnabled: false,
  goLiveAuthorized: false,
} as const;

export const phase15ManualDesignCreativeLanes = [
  "stop_truthfulness_and_brand_safety_first",
  "brand_standard_review",
  "seller_trust_visual_review",
  "local_claim_visual_consistency_review",
  "mobile_first_clarity_review",
  "cta_and_conversion_path_review",
  "creative_claim_truthfulness_review",
  "accessibility_and_readability_review",
  "asset_and_image_usage_risk_review",
  "campaign_creative_boundary_review",
  "operator_design_focus_review",
  "defer_until_human_approved",
] as const;

export const phase15DesignCreativeSummaryStates = [
  "design_creative_blocked",
  "truthfulness_review_required",
  "brand_standard_missing",
  "seller_trust_visual_gap",
  "local_claim_consistency_review",
  "mobile_clarity_review_only",
  "cta_alignment_visible",
  "creative_claim_risk_visible",
  "accessibility_readability_review_only",
  "asset_usage_risk_visible",
  "operator_focus_only",
  "not_ready",
] as const;

export type Phase15ManualDesignCreativePolicy = {
  phase: "Phase 15: Design & Creative AI Agent";
  phaseStep: "Phase 15C â€” Manual Design & Creative Advisory Policy";
  previousStep: "Phase 15B â€” Design & Creative Signal Audit";
  phaseDecision: "manual_policy_only";
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
  trackingDecision: "not_authorized";
  crmMutationDecision: "not_authorized";
  storageDecision: "not_authorized";
  outreachDecision: "not_authorized";
  spendDecision: "not_authorized";
  recommendedNextExactStep: "Phase 15D â€” Design & Creative Implementation Scope";
  nextStageRecommendation: "Phase 15D â€” Design & Creative Implementation Scope";
  signalReferences: typeof phase15DesignCreativeSignalFamilies;
  designCreativeLanes: typeof phase15ManualDesignCreativeLanes;
  summaryStates: typeof phase15DesignCreativeSummaryStates;
  policyRules: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase15ManualDesignCreativePolicyFlags;
};

export const phase15ManualDesignCreativePolicyRules = [
  "Manual design/creative lanes are advisory visibility only and cannot trigger UI edits, content edits, asset edits, logo changes, theme changes, CSS changes, image generation, creative publishing, campaign/ad creation, tracking, CRM mutation, outreach, spend, or go-live.",
  "Truthfulness, brand safety, seller trust, local claim consistency, accessibility/readability, asset usage, and campaign creative boundaries remain human-owned review gates.",
  "The highest-aROI policy is to stop truthfulness and brand safety risk first, then focus human review on brand standards, seller trust visuals, mobile clarity, CTA alignment, and creative claim risk.",
];

export const phase15ManualDesignCreativePolicyStopRules = [
  "Phase 15C defines manual design/creative advisory lanes and summary states only.",
  "No implementation, route changes, UI changes, form changes, content changes, metadata changes, CSS changes, theme changes, logo changes, asset edits, image generation, creative generation, creative publishing, copy publishing, page publishing, ad publishing, campaign creation, ad creation, provider activation, analytics, tracking pixels, experiments, audience upload, spend increases, CRM mutation, lead mutation, source mutation, storage mutation, audit writing, outreach, SMS/email/calling, AI voice, queues, runtime jobs, invented local claims, invented seller testimonials, invented property facts, invented before/after results, compliance/platform/legal approval by AI, Phase 16 implementation, or go-live is authorized.",
];

export const phase15ManualDesignCreativePolicyAiBoundary = [
  "rank and explain manual design/creative lanes for human review only",
  "do not edit UI, content, assets, logos, themes, CSS, metadata, or components; do not generate images, publish creative, create campaigns or ads, mutate CRM/storage, launch outreach, increase spend, invent claims or property facts, approve Phase 16 implementation, or authorize go-live",
];

export function getPhase15ManualDesignCreativePolicy(): Phase15ManualDesignCreativePolicy {
  const result: Phase15ManualDesignCreativePolicy = {
    phase: "Phase 15: Design & Creative AI Agent",
    phaseStep: "Phase 15C â€” Manual Design & Creative Advisory Policy",
    previousStep: "Phase 15B â€” Design & Creative Signal Audit",
    phaseDecision: "manual_policy_only",
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
    trackingDecision: "not_authorized",
    crmMutationDecision: "not_authorized",
    storageDecision: "not_authorized",
    outreachDecision: "not_authorized",
    spendDecision: "not_authorized",
    recommendedNextExactStep: "Phase 15D â€” Design & Creative Implementation Scope",
    nextStageRecommendation: "Phase 15D â€” Design & Creative Implementation Scope",
    signalReferences: phase15DesignCreativeSignalFamilies,
    designCreativeLanes: phase15ManualDesignCreativeLanes,
    summaryStates: phase15DesignCreativeSummaryStates,
    policyRules: phase15ManualDesignCreativePolicyRules,
    stopRules: phase15ManualDesignCreativePolicyStopRules,
    aiOperatorLeverageBoundary: phase15ManualDesignCreativePolicyAiBoundary,
    humanOwnershipBoundary: phase15DesignCreativeHumanBoundary,
    forbiddenDrift: phase15DesignCreativeForbiddenDrift,
    flags: phase15ManualDesignCreativePolicyFlags,
  };
  assertPhase15ManualDesignCreativePolicySafe(result);
  return result;
}

export function assertPhase15ManualDesignCreativePolicySafe(result: Phase15ManualDesignCreativePolicy) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "policyOnly", "operatorLeverageOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.policyRules, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift, result.designCreativeLanes, result.summaryStates].flat().join(" ");
  const unsafePattern = /UI edits are authorized|content edits are authorized|asset edits are authorized|logo changes are authorized|theme changes are authorized|CSS changes are authorized|image generation is authorized|creative publishing is authorized|campaign creation is authorized|tracking is authorized|CRM mutation is authorized|outreach is authorized|spend increases are authorized|Phase 16 implementation is authorized|go-live is authorized/i;

  if (result.phaseStep !== "Phase 15C â€” Manual Design & Creative Advisory Policy") throw new Error("Phase 15C step must remain pinned.");
  if (result.previousStep !== "Phase 15B â€” Design & Creative Signal Audit") throw new Error("Phase 15C previous step must remain Phase 15B.");
  if (result.phaseDecision !== "manual_policy_only") throw new Error("Phase 15C must remain manual-policy-only.");
  if (Object.entries(result).some(([key, value]) => key.endsWith("Decision") && key !== "phaseDecision" && value !== "not_authorized")) throw new Error("Phase 15C decisions must remain not_authorized.");
  if (result.designCreativeLanes.join("|") !== phase15ManualDesignCreativeLanes.join("|")) throw new Error("Phase 15C design/creative lanes are missing.");
  if (result.summaryStates.join("|") !== phase15DesignCreativeSummaryStates.join("|")) throw new Error("Phase 15C summary states are missing.");
  if (result.signalReferences.join("|") !== phase15DesignCreativeSignalFamilies.join("|")) throw new Error("Phase 15C signal references are missing.");
  if (unsafeTrue.length > 0) throw new Error("Phase 15C blocked flags cannot turn true.");
  if (!/advisory lanes and summary states only/i.test(result.stopRules.join(" "))) throw new Error("Phase 15C stop rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not edit UI/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 15C AI boundary is missing.");
  if (!/creative approval/i.test(result.humanOwnershipBoundary.join(" ")) || !/compliance review/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 15C human boundary is missing.");
  if (result.recommendedNextExactStep !== "Phase 15D â€” Design & Creative Implementation Scope") throw new Error("Phase 15C must hand off to Phase 15D.");
  if (unsafePattern.test(text)) throw new Error("Phase 15C wording must not imply unsafe authorization.");
}

export function getPhase15ManualDesignCreativePolicySummary() {
  const result = getPhase15ManualDesignCreativePolicy();
  return `${result.phase} / ${result.phaseStep}: defines manual design/creative lanes and summary states for highest acquisition ROI per operator hour with human-owned brand judgment, design approval, claim verification, creative approval, publishing approval, compliance review, seller-trust judgment, and spend approval. No UI changes, no asset/logo/theme edits, no creative publishing, no campaigns/ads, no outreach, no CRM mutation, no spend increase, no go-live, and no Phase 16 implementation are authorized. Next step: ${result.recommendedNextExactStep}.`;
}
