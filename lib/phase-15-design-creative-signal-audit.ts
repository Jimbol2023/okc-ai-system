import { sellerBenefits, sellerProcess, trustPoints } from "./content/homepage";
import { phase11SeoLocalAuthorityForbiddenDrift } from "./phase-11-seo-local-authority-scope";
import { phase12ConversionOptimizationForbiddenDrift } from "./phase-12-conversion-optimization-scope";
import { phase14SocialAcquisitionForbiddenDrift } from "./phase-14-facebook-tiktok-acquisition-scope";
import {
  phase15DesignCreativeForbiddenDrift,
  phase15DesignCreativeHumanBoundary,
} from "./phase-15-design-creative-ai-agent-scope";
import { smallHighClarityRoadmap } from "./small-high-clarity-acquisition-system";

export const phase15DesignCreativeSignalAuditFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  signalAuditOnly: true,
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
  analyticsEnabled: false,
  crmMutationEnabled: false,
  storageMutationEnabled: false,
  outreachEnabled: false,
  spendIncreaseEnabled: false,
  goLiveAuthorized: false,
  phase16ImplementationEnabled: false,
} as const;

export type Phase15DesignCreativeSignalFamily =
  | "phase_14_final_lockdown_handoff"
  | "small_high_clarity_design_creative_doctrine"
  | "public_homepage_contact_sell_your_house_layout_lead_capture_homepage_content"
  | "conversion_local_authority_truthful_claims_trust_cta_mobile_source_tracking"
  | "social_acquisition_claim_creative_audience_spend_guardrail_boundaries"
  | "activation_evidence_brand_mobile_claim_trust_manual_publish_complexity_control"
  | "design_intelligence_reference_components_no_runtime_ui_edits";

export const phase15DesignCreativeSignalFamilies: Phase15DesignCreativeSignalFamily[] = [
  "phase_14_final_lockdown_handoff",
  "small_high_clarity_design_creative_doctrine",
  "public_homepage_contact_sell_your_house_layout_lead_capture_homepage_content",
  "conversion_local_authority_truthful_claims_trust_cta_mobile_source_tracking",
  "social_acquisition_claim_creative_audience_spend_guardrail_boundaries",
  "activation_evidence_brand_mobile_claim_trust_manual_publish_complexity_control",
  "design_intelligence_reference_components_no_runtime_ui_edits",
];

export type Phase15DesignCreativeSignalAudit = {
  phase: "Phase 15: Design & Creative AI Agent";
  phaseStep: "Phase 15B â€” Design & Creative Signal Audit";
  previousStep: "Phase 15A â€” Design & Creative AI Agent Scope";
  phaseDecision: "signal_audit_only";
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
  analyticsDecision: "not_authorized";
  crmMutationDecision: "not_authorized";
  storageDecision: "not_authorized";
  outreachDecision: "not_authorized";
  spendDecision: "not_authorized";
  goLiveDecision: "not_authorized";
  recommendedNextExactStep: "Phase 15C â€” Manual Design & Creative Advisory Policy";
  nextStageRecommendation: "Phase 15C â€” Manual Design & Creative Advisory Policy";
  signalFamilies: Phase15DesignCreativeSignalFamily[];
  groundedReferences: {
    publicSurfaces: string[];
    designIntelligenceReferenceComponents: string[];
    homepageContent: {
      sellerBenefits: typeof sellerBenefits;
      sellerProcess: typeof sellerProcess;
      trustPoints: typeof trustPoints;
    };
    roadmapDesignCreativePhase: (typeof smallHighClarityRoadmap)[number] | undefined;
    phase11ForbiddenDrift: typeof phase11SeoLocalAuthorityForbiddenDrift;
    phase12ForbiddenDrift: typeof phase12ConversionOptimizationForbiddenDrift;
    phase14ForbiddenDrift: typeof phase14SocialAcquisitionForbiddenDrift;
  };
  auditPurpose: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase15DesignCreativeSignalAuditFlags;
};

export const phase15DesignCreativeSignalAuditPurpose = [
  "Audit existing design and creative signal families without editing UI, routes, forms, content, metadata, assets, images, logos, CSS/theme systems, components, campaigns, ads, providers, tracking, CRM, storage, outreach, spend, or go-live state.",
  "Reference the small-high-clarity design doctrine, public acquisition surfaces, conversion/local authority doctrine, social acquisition creative boundaries, activation evidence concepts, and design-intelligence components as advisory signals only.",
  "Support highest acquisition ROI per operator hour by making brand consistency, seller trust visuals, truthful claim review, CTA clarity, mobile-first clarity, accessibility/readability, asset usage risk, and operator design focus easier for humans to review.",
];

export const phase15DesignCreativeSignalAuditStopRules = [
  "Phase 15B audits existing design and creative signal families only.",
  "No implementation, route changes, UI changes, form changes, content changes, metadata changes, CSS changes, theme changes, logo changes, asset edits, image generation, creative generation, creative publishing, copy publishing, page publishing, ad publishing, campaign creation, ad creation, provider activation, SDK imports, API calls, webhooks, env reads, credential reads, analytics, tracking pixels, experiments, audience upload, spend increases, CRM mutation, lead mutation, source mutation, storage mutation, audit writing, outreach, SMS/email/calling, AI voice, queues, runtime jobs, invented local claims, invented seller testimonials, invented property facts, invented before/after results, compliance/platform/legal approval by AI, Phase 16 implementation, or go-live is authorized.",
];

export const phase15DesignCreativeSignalAuditAiBoundary = [
  "summarize existing design and creative signals for human review only",
  "flag brand consistency, seller trust visuals, local claim consistency, mobile-first clarity, CTA alignment, creative claim truthfulness, accessibility/readability, asset usage risk, campaign creative boundaries, and operator design focus",
  "do not edit UI, content, assets, logos, themes, CSS, metadata, or components; do not generate images, publish creatives, create campaigns or ads, mutate CRM/storage, launch outreach, increase spend, invent claims or property facts, approve legal/platform decisions, implement Phase 16, or authorize go-live",
];

export function getPhase15DesignCreativeSignalAudit(): Phase15DesignCreativeSignalAudit {
  const result: Phase15DesignCreativeSignalAudit = {
    phase: "Phase 15: Design & Creative AI Agent",
    phaseStep: "Phase 15B â€” Design & Creative Signal Audit",
    previousStep: "Phase 15A â€” Design & Creative AI Agent Scope",
    phaseDecision: "signal_audit_only",
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
    analyticsDecision: "not_authorized",
    crmMutationDecision: "not_authorized",
    storageDecision: "not_authorized",
    outreachDecision: "not_authorized",
    spendDecision: "not_authorized",
    goLiveDecision: "not_authorized",
    recommendedNextExactStep: "Phase 15C â€” Manual Design & Creative Advisory Policy",
    nextStageRecommendation: "Phase 15C â€” Manual Design & Creative Advisory Policy",
    signalFamilies: phase15DesignCreativeSignalFamilies,
    groundedReferences: {
      publicSurfaces: ["/", "/contact", "/sell-your-house", "app/(public)/layout.tsx", "components/forms/lead-capture-form.tsx", "lib/content/homepage.ts"],
      designIntelligenceReferenceComponents: ["components/design-intelligence", "score-bar.tsx", "insight-summary.tsx", "decision-visualization-card.tsx"],
      homepageContent: { sellerBenefits, sellerProcess, trustPoints },
      roadmapDesignCreativePhase: smallHighClarityRoadmap.find((phase) => phase.phaseName === "Design & Creative AI Agent"),
      phase11ForbiddenDrift: phase11SeoLocalAuthorityForbiddenDrift,
      phase12ForbiddenDrift: phase12ConversionOptimizationForbiddenDrift,
      phase14ForbiddenDrift: phase14SocialAcquisitionForbiddenDrift,
    },
    auditPurpose: phase15DesignCreativeSignalAuditPurpose,
    stopRules: phase15DesignCreativeSignalAuditStopRules,
    aiOperatorLeverageBoundary: phase15DesignCreativeSignalAuditAiBoundary,
    humanOwnershipBoundary: phase15DesignCreativeHumanBoundary,
    forbiddenDrift: phase15DesignCreativeForbiddenDrift,
    flags: phase15DesignCreativeSignalAuditFlags,
  };
  assertPhase15DesignCreativeSignalAuditSafe(result);
  return result;
}

export function assertPhase15DesignCreativeSignalAuditSafe(result: Phase15DesignCreativeSignalAudit) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "signalAuditOnly", "operatorLeverageOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.auditPurpose, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift, result.signalFamilies].flat().join(" ");
  const unsafePattern = /UI changes are authorized|content changes are authorized|asset edits are authorized|image generation is authorized|creative generation is authorized|creative publishing is authorized|campaign creation is authorized|ad creation is authorized|tracking pixels are authorized|CRM mutation is authorized|storage mutation is authorized|outreach is authorized|spend increases are authorized|invented property facts are authorized|Phase 16 implementation is authorized|go-live is authorized/i;

  if (result.phaseStep !== "Phase 15B â€” Design & Creative Signal Audit") throw new Error("Phase 15B step must remain pinned.");
  if (result.previousStep !== "Phase 15A â€” Design & Creative AI Agent Scope") throw new Error("Phase 15B previous step must remain Phase 15A.");
  if (result.phaseDecision !== "signal_audit_only") throw new Error("Phase 15B must remain signal-audit-only.");
  if (Object.entries(result).some(([key, value]) => key.endsWith("Decision") && key !== "phaseDecision" && value !== "not_authorized")) throw new Error("Phase 15B decisions must remain not_authorized.");
  if (result.signalFamilies.join("|") !== phase15DesignCreativeSignalFamilies.join("|")) throw new Error("Phase 15B must include all design/creative signal families.");
  if (unsafeTrue.length > 0) throw new Error("Phase 15B blocked flags cannot turn true.");
  if (!/small_high_clarity_design_creative_doctrine/i.test(result.signalFamilies.join(" ")) || !/design_intelligence_reference_components/i.test(result.signalFamilies.join(" "))) throw new Error("Phase 15B repo-grounded signals are missing.");
  if (!/audits existing design and creative signal families only/i.test(result.stopRules.join(" "))) throw new Error("Phase 15B stop rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not edit UI/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 15B AI boundary is missing.");
  if (!/design approval/i.test(result.humanOwnershipBoundary.join(" ")) || !/claim verification/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 15B human boundary is missing.");
  if (result.recommendedNextExactStep !== "Phase 15C â€” Manual Design & Creative Advisory Policy") throw new Error("Phase 15B must hand off to Phase 15C.");
  if (unsafePattern.test(text)) throw new Error("Phase 15B wording must not imply unsafe authorization.");
}

export function getPhase15DesignCreativeSignalAuditSummary() {
  const result = getPhase15DesignCreativeSignalAudit();
  return `${result.phase} / ${result.phaseStep}: audits existing brand, public surface, conversion, social creative, activation evidence, and design-intelligence reference signals for highest acquisition ROI per operator hour. Human-owned brand judgment, design approval, claim verification, creative approval, publishing approval, compliance review, seller-trust judgment, and spend approval remain required. No UI changes, no asset/logo/theme edits, no creative publishing, no campaigns/ads, no outreach, no CRM mutation, no spend increase, no go-live, and no Phase 16 implementation are authorized. Next step: ${result.recommendedNextExactStep}.`;
}
