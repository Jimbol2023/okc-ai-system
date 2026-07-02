import { evaluateConnectorAction, type ConnectorExecutionPlan } from "@/lib/connector-platform";
import { evaluateAiSecurityEvent, type AiSecurityDecision } from "@/lib/enterprise-security-platform";
import { classifyFeatureArchitecture, type FeatureArchitectureReview } from "@/lib/modular-architecture-standard";
import { evaluateSafeAutomation, type AutomationDecision } from "@/lib/safe-auto-mode";

export type CreativeAgentRole =
  | "creative_director"
  | "brand_strategist"
  | "graphic_designer"
  | "ui_ux_designer"
  | "website_designer"
  | "copywriter"
  | "video_producer"
  | "motion_graphics"
  | "presentation_designer"
  | "advertising_designer"
  | "photography_assistant"
  | "creative_qa";

export type CreativeRequestType =
  | "brand_system"
  | "website_experience"
  | "content_factory"
  | "ecommerce_growth"
  | "viral_content_intelligence"
  | "video_production"
  | "design_automation"
  | "sales_enablement"
  | "growth_intelligence";

export type CreativeAssetStatus =
  | "draft"
  | "internal_review"
  | "brand_review"
  | "compliance_review"
  | "approval_queue"
  | "scheduled"
  | "published";

export type CreativeStudioReviewInput = {
  requestType: CreativeRequestType;
  businessModule?: string;
  brandKey?: string;
  targetChannel?: string;
  desiredAssetType?: string;
  sourceLabels: string[];
  connectorKeys?: string[];
  externalActionIntent?: string;
  complianceSensitivity?: "standard" | "regulated" | "high_reputation_risk";
};

export type CreativeStudioReview = {
  ok: true;
  platform: "AI Creative Growth Studio";
  architecture: FeatureArchitectureReview;
  assignedAgents: CreativeAgentRole[];
  workflowStatus: CreativeAssetStatus;
  capabilityPlan: string[];
  roiRationale: string[];
  reputationSafetyRules: string[];
  approvalRequirements: string[];
  assumptions: string[];
  sourceLabels: string[];
  safeAutoDecision: AutomationDecision;
  securityDecision: AiSecurityDecision;
  connectorPlans: ConnectorExecutionPlan[];
  auditRequired: true;
  providerCalled: false;
  liveExecutionAllowed: false;
  externalActionsBlocked: true;
};

export const creativeAgentRoster: Array<{
  role: CreativeAgentRole;
  label: string;
  purpose: string;
}> = [
  { role: "creative_director", label: "Creative Director AI", purpose: "Coordinates creative strategy, quality, and production sequencing." },
  { role: "brand_strategist", label: "Brand Strategist AI", purpose: "Protects brand positioning, voice, trust, and reusable systems." },
  { role: "graphic_designer", label: "Graphic Designer AI", purpose: "Plans brand-safe graphics, layouts, and campaign visuals." },
  { role: "ui_ux_designer", label: "UI/UX Designer AI", purpose: "Reviews usability, accessibility, and conversion clarity." },
  { role: "website_designer", label: "Website Designer AI", purpose: "Plans responsive sites, landing pages, funnels, and portals." },
  { role: "copywriter", label: "Copywriter AI", purpose: "Drafts source-grounded copy without fabricated claims." },
  { role: "video_producer", label: "Video Producer AI", purpose: "Plans scripts, storyboards, interviews, and production notes." },
  { role: "motion_graphics", label: "Motion Graphics AI", purpose: "Plans animated concepts and short-form creative sequences." },
  { role: "presentation_designer", label: "Presentation Designer AI", purpose: "Plans decks, sales materials, and investor narratives." },
  { role: "advertising_designer", label: "Advertising Designer AI", purpose: "Reviews campaign concepts without authorizing ad spend." },
  { role: "photography_assistant", label: "Photography Assistant AI", purpose: "Plans shot lists and approved image usage." },
  { role: "creative_qa", label: "Creative QA AI", purpose: "Checks brand, compliance, source, accessibility, and reputation risk." },
];

export const creativeStudioCapabilities = [
  "multi_brand_management",
  "website_experience_planning",
  "content_repurposing",
  "ecommerce_growth_campaigns",
  "video_script_and_storyboard_planning",
  "design_automation_briefs",
  "sales_enablement_materials",
  "growth_intelligence_recommendations",
  "creative_asset_library_readiness",
  "learning_from_approved_performance_signals",
] as const;

export const creativeReputationSafetyRules = [
  "No fake reviews, testimonials, ratings, awards, social proof, or business metrics.",
  "No spam, dark patterns, unauthorized outreach, scraping, cloned competitor content, or deceptive urgency.",
  "No property, customer, product, legal, medical, financial, tax, or performance claims without approved sources.",
  "No ad spend, publishing, scheduling, messaging, public sharing, or connector writes without future governed authorization.",
  "Prefer durable brand trust, conversion quality, reuse, accessibility, and measurable ROI over volume.",
] as const;

function agentsForRequest(requestType: CreativeRequestType): CreativeAgentRole[] {
  const base: CreativeAgentRole[] = ["creative_director", "brand_strategist", "copywriter", "creative_qa"];

  if (requestType === "website_experience") return [...base, "ui_ux_designer", "website_designer"];
  if (requestType === "video_production") return [...base, "video_producer", "motion_graphics"];
  if (requestType === "design_automation" || requestType === "brand_system") return [...base, "graphic_designer", "photography_assistant"];
  if (requestType === "sales_enablement") return [...base, "presentation_designer"];
  if (requestType === "ecommerce_growth" || requestType === "viral_content_intelligence" || requestType === "growth_intelligence") {
    return [...base, "advertising_designer", "ui_ux_designer"];
  }

  return base;
}

function capabilityPlanFor(input: CreativeStudioReviewInput) {
  return [
    `Create reusable ${input.requestType.replaceAll("_", " ")} plan for ${input.businessModule ?? "cross-business AI Core"}.`,
    "Use approved sources and label assumptions before creative recommendations.",
    "Prepare internal creative, brand, website, sales, or growth assets for review only.",
    "Route high-impact creative through brand review, compliance review when needed, and approval queue.",
    "Keep connector work as briefs, readiness checks, or execution plans unless future policy authorizes live actions.",
  ];
}

export function createCreativeStudioPlatformReport() {
  return {
    ok: true,
    platform: "AI Creative Growth Studio" as const,
    layer: "ai_core" as const,
    reusableAcrossBusinessModules: true,
    summary:
      "Reusable AI Core platform for brand systems, creative production, websites, content, e-commerce growth, sales enablement, and growth intelligence.",
    agents: creativeAgentRoster,
    capabilities: creativeStudioCapabilities,
    assetLifecycle: ["draft", "internal_review", "brand_review", "compliance_review", "approval_queue", "scheduled", "published"] as CreativeAssetStatus[],
    safetyRules: creativeReputationSafetyRules,
    connectorEcosystem: [
      "canva",
      "adobe_express",
      "adobe_creative_cloud",
      "google_workspace",
      "google_business_profile",
      "meta",
      "youtube",
      "linkedin",
      "x",
      "wordpress",
      "webflow",
      "shopify",
      "woocommerce",
      "mailchimp",
      "hubspot",
      "openai",
      "n8n",
      "analytics",
      "seo",
    ],
    approvalRequiredForExternalActions: true,
    auditRequired: true,
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}

export function reviewCreativeStudioRequest(input: CreativeStudioReviewInput): CreativeStudioReview {
  const externalActionIntent = input.externalActionIntent ?? "internal_creative_preparation";
  const architecture = classifyFeatureArchitecture({
    featureName: `Creative Studio: ${input.requestType}`,
    description: `Reusable creative growth review for ${input.desiredAssetType ?? input.requestType}.`,
    businessDomain: input.businessModule,
    reusableAcrossIndustries: true,
    requestedExternalActions: [externalActionIntent],
    connectorKeys: input.connectorKeys,
    extensionPoints: ["capability", "workflow", "permission", "ui_surface", "connector", "audit_event", "analytics", "document", "notification"],
  });
  const safeAutoDecision = evaluateSafeAutomation({
    requestedAction: externalActionIntent,
    preferredToolKey: input.connectorKeys?.[0],
    module: "AI Creative Growth Studio",
  });
  const securityDecision = evaluateAiSecurityEvent({
    prompt: `${input.requestType} ${input.desiredAssetType ?? ""} ${input.targetChannel ?? ""}`,
    requestedAction: externalActionIntent,
    requestedToolKey: input.connectorKeys?.[0],
    userRole: "operator",
    dataClasses: input.complianceSensitivity === "regulated" ? ["regulated marketing content"] : ["brand content"],
    sourceLabel: input.sourceLabels.join(", "),
  });
  const connectorPlans = (input.connectorKeys ?? []).map((connectorId) =>
    evaluateConnectorAction({
      connectorId,
      actionKey: externalActionIntent,
      module: "AI Creative Growth Studio",
    }),
  );

  return {
    ok: true,
    platform: "AI Creative Growth Studio",
    architecture,
    assignedAgents: agentsForRequest(input.requestType),
    workflowStatus: input.complianceSensitivity === "regulated" ? "compliance_review" : "internal_review",
    capabilityPlan: capabilityPlanFor(input),
    roiRationale: [
      "Reusable creative briefs reduce duplicate work across business modules.",
      "Brand-safe templates increase speed without lowering trust.",
      "Approval-gated content protects reputation while improving conversion quality.",
    ],
    reputationSafetyRules: [...creativeReputationSafetyRules],
    approvalRequirements: [
      "Brand review required before external use.",
      ...(input.complianceSensitivity === "regulated" || input.complianceSensitivity === "high_reputation_risk" ? ["Compliance review required."] : []),
      "Human approval required before publishing, sending, scheduling, ad spend, or public sharing.",
    ],
    assumptions: [
      "This review prepares internal creative guidance only.",
      "Source labels were supplied by the caller and must be verified before publication.",
      "No live connector call, publish, schedule, send, scrape, or ad spend is authorized.",
    ],
    sourceLabels: input.sourceLabels,
    safeAutoDecision,
    securityDecision,
    connectorPlans,
    auditRequired: true,
    providerCalled: false,
    liveExecutionAllowed: false,
    externalActionsBlocked: true,
  };
}
