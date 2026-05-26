export const eliteHighAroiAcquisitionOsFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  providerActivated: false,
  twilioActivated: false,
  autonomousOutreachEnabled: false,
  autonomousNegotiationEnabled: false,
  autonomousTextingEnabled: false,
  autonomousCallingEnabled: false,
  autonomousSellerHandlingEnabled: false,
  autonomousBuyerHandlingEnabled: false,
  autonomousCampaignsEnabled: false,
  autonomousDealBlastingEnabled: false,
  autonomousApprovalAuthorityEnabled: false,
  providerMutationEnabled: false,
  outboundSmsEnabled: false,
  outboundEmailEnabled: false,
  callingEnabled: false,
  aiVoiceEnabled: false,
  campaignEnabled: false,
  scrapingEnabled: false,
  skipTracingEnabled: false,
  runtimeJobsEnabled: false,
  pollingEnabled: false,
  crmMutationEnabled: false,
  automationEnabled: false,
  goLiveAuthorized: false,
  approvalGrantsExecution: false,
} as const;

export type EliteHighAroiSystemMode = "elite_high_aroi_acquisition_os";
export type EliteHighAroiBusinessName = "Cornerstone Property Group";
export type EliteHighAroiMarket = "Oklahoma City, Oklahoma";
export type EliteHighAroiPrimaryMetric = "acquisition_roi_per_operator_hour";
export type EliteHighAroiAiRole = "operator_leverage_only";
export type EliteHighAroiHumanRole = "approval_execution_and_relationship_owner";
export type EliteHighAroiImmediatePhase = "Phase 1 Business Foundation & Trust Infrastructure";
export type EliteHighAroiNextStage = "Phase 1 Elite Business Foundation & Trust Infrastructure Planning";
export type EliteHighAroiTier = "Tier 1 - Highest aROI Leverage" | "Tier 2 - High Value Support" | "Tier 3 - Deferred / Secondary";

export type EliteHighAroiRoadmapPhase = {
  order: number;
  name: string;
  aroiTier: EliteHighAroiTier;
  purpose: string;
  operatorLeverageExplanation: string;
};

export type EliteHighAroiAcquisitionOsAlignment = {
  systemMode: EliteHighAroiSystemMode;
  businessName: EliteHighAroiBusinessName;
  market: EliteHighAroiMarket;
  primaryMetric: EliteHighAroiPrimaryMetric;
  aiRole: EliteHighAroiAiRole;
  humanRole: EliteHighAroiHumanRole;
  currentImmediatePhase: EliteHighAroiImmediatePhase;
  recommendedNextExactStep: EliteHighAroiNextStage;
  nextStageRecommendation: EliteHighAroiNextStage;
  eliteAroiPrinciples: string[];
  aiAllowedActions: string[];
  aiForbiddenActions: string[];
  humanOwnedActions: string[];
  roadmap: EliteHighAroiRoadmapPhase[];
  phase1ImmediateChecklist: string[];
  twilioReadinessDoctrine: string[];
  summaryLanguage: string[];
  readOnly: true;
  advisoryOnly: true;
  planningOnly: true;
  flags: typeof eliteHighAroiAcquisitionOsFlags;
};

export const eliteAroiPrinciples = [
  "maximize revenue-producing operator focus",
  "reduce lead leakage",
  "improve seller review quality",
  "improve follow-up discipline",
  "increase trust and conversion",
  "protect reputation and compliance",
  "reduce wasted actions",
  "reduce operator decision fatigue",
  "improve acquisition clarity",
  "avoid low-ROI complexity",
  "block autonomous wholesaling",
  "preserve human-approved execution",
  "preserve operational realism",
  "preserve explainability",
  "preserve deterministic behavior",
];

export const aiAllowedActions = [
  "operator leverage only",
  "prioritization assistance",
  "seller review assistance",
  "follow-up organization",
  "lead organization",
  "deal quality visibility",
  "communication safety visibility",
  "conversion support",
  "operational clarity",
  "may assist",
  "may summarize",
  "may organize",
  "may prioritize",
  "may prepare reviews",
];

export const aiForbiddenActions = [
  "autonomously negotiate",
  "autonomously contact sellers",
  "autonomously text",
  "autonomously call",
  "autonomously blast deals",
  "autonomously approve actions",
  "autonomously close deals",
  "autonomously activate providers",
  "autonomously scrape maps",
  "autonomously use Google Street View",
  "autonomously surveil GPS routes",
];

export const humanOwnedActions = [
  "approval owner",
  "communication owner",
  "negotiation owner",
  "relationship owner",
  "sending owner",
  "contract owner",
  "closing owner",
];

export const eliteHighAroiRoadmap: EliteHighAroiRoadmapPhase[] = [
  {
    order: 1,
    name: "Business Foundation & Trust Infrastructure",
    aroiTier: "Tier 1 - Highest aROI Leverage",
    purpose: "Make Cornerstone Property Group look and operate like a real acquisition business before communication expands.",
    operatorLeverageExplanation: "Trust infrastructure reduces seller friction, protects reputation, and makes every operator conversation more credible.",
  },
  {
    order: 2,
    name: "Lead Intake & Simple CRM",
    aroiTier: "Tier 1 - Highest aROI Leverage",
    purpose: "Capture and organize seller leads with source, status, notes, tags, follow-up dates, and property details.",
    operatorLeverageExplanation: "A clean intake surface prevents leakage and gives one operator a reliable place to see what needs work.",
  },
  {
    order: 3,
    name: "Lead Prioritization Engine",
    aroiTier: "Tier 1 - Highest aROI Leverage",
    purpose: "Clarify who deserves attention today across call-first, review, follow-up, waiting, blocked, and dead queues.",
    operatorLeverageExplanation: "Prioritization improves acquisition ROI per operator hour by focusing human effort on the highest-return leads.",
  },
  {
    order: 4,
    name: "Seller Review & Call Prep",
    aroiTier: "Tier 1 - Highest aROI Leverage",
    purpose: "Prepare property summaries, seller context, motivation, objections, risks, and next questions before calls.",
    operatorLeverageExplanation: "Better prep improves trust, call quality, conversion discipline, and operator confidence.",
  },
  {
    order: 5,
    name: "Follow-Up Organization System",
    aroiTier: "Tier 1 - Highest aROI Leverage",
    purpose: "Organize overdue follow-ups, warm sellers, callbacks, opt-outs, dead leads, and negotiation stage context.",
    operatorLeverageExplanation: "Follow-up discipline reduces lead leakage and protects revenue already created by marketing effort.",
  },
  {
    order: 6,
    name: "Deal Quality Intelligence",
    aroiTier: "Tier 2 - High Value Support",
    purpose: "Surface title, repair, occupancy, financing, timeline, seller friction, and buyer-fit risks.",
    operatorLeverageExplanation: "Deal quality intelligence protects time and reputation by helping the operator avoid low-probability or damaging deals.",
  },
  {
    order: 7,
    name: "AI-Assisted Lead Discovery",
    aroiTier: "Tier 2 - High Value Support",
    purpose: "Organize, clean, prioritize, and summarize opportunities from local and inbound acquisition channels.",
    operatorLeverageExplanation: "Lead discovery support improves source quality without letting AI scrape, skip trace, or contact sellers autonomously.",
  },
  {
    order: 8,
    name: "Virtual Driving for Dollars Intelligence Engine",
    aroiTier: "Tier 2 - High Value Support",
    purpose: "Represent review-only off-market opportunity intelligence for distressed, vacant, neglected, landlord-fatigue, infill, land, and rental-area properties.",
    operatorLeverageExplanation: "Virtual D4D is high-aROI only when AI helps prioritize neighborhoods, routes, distress signals, buyer demand, and manual review without scraping maps, automating Street View, tracking GPS, skip tracing, creating leads, or contacting owners.",
  },
  {
    order: 9,
    name: "Facebook & TikTok Acquisition Engine",
    aroiTier: "Tier 3 - Deferred / Secondary",
    purpose: "Plan inbound seller content, ad angles, education clips, and trust-building local authority concepts.",
    operatorLeverageExplanation: "Social acquisition is useful after the core trust, intake, prioritization, and follow-up systems are disciplined.",
  },
  {
    order: 10,
    name: "SEO & Local Authority Engine",
    aroiTier: "Tier 2 - High Value Support",
    purpose: "Develop local SEO pages, seller FAQs, neighborhood pages, content, metadata, internal links, and local authority strategy.",
    operatorLeverageExplanation: "SEO compounds inbound lead quality once the operator can reliably review and follow up on new opportunities.",
  },
  {
    order: 11,
    name: "Design & Creative AI Agent",
    aroiTier: "Tier 3 - Deferred / Secondary",
    purpose: "Support branding, seller pages, ad creatives, thumbnails, social graphics, and trust sections.",
    operatorLeverageExplanation: "Creative improves conversion support but should not outrank direct seller clarity, trust infrastructure, or follow-up discipline.",
  },
  {
    order: 12,
    name: "Conversion Optimization Engine",
    aroiTier: "Tier 2 - High Value Support",
    purpose: "Review landing pages, forms, CTAs, mobile usability, trust copy, seller objections, and abandonment points.",
    operatorLeverageExplanation: "Conversion improvements raise lead yield from the same traffic without adding operator chaos or spend.",
  },
  {
    order: 13,
    name: "Buyer Fit Intelligence",
    aroiTier: "Tier 3 - Deferred / Secondary",
    purpose: "Clarify buyer-fit patterns across flippers, landlords, land investors, developers, creative finance buyers, and rental buyers.",
    operatorLeverageExplanation: "Buyer-fit support helps disposition quality but must remain human-reviewed and cannot become autonomous deal blasting.",
  },
  {
    order: 14,
    name: "Daily Acquisition Command Center",
    aroiTier: "Tier 1 - Highest aROI Leverage",
    purpose: "Give one operator a daily view of priority leads, warm sellers, overdue follow-ups, blocked deals, stale leads, and warnings.",
    operatorLeverageExplanation: "A daily command center reduces overwhelm and decision fatigue while improving revenue-producing focus.",
  },
  {
    order: 15,
    name: "Safety & Compliance Engine",
    aroiTier: "Tier 2 - High Value Support",
    purpose: "Protect DNC, STOP, opt-out, consent, communication governance, ad claims, and manual approval boundaries.",
    operatorLeverageExplanation: "Safety preserves communication reputation and makes growth durable without turning into autonomous outreach.",
  },
  {
    order: 16,
    name: "Pentest & Security Engine",
    aroiTier: "Tier 3 - Deferred / Secondary",
    purpose: "Review auth, API exposure, route protection, rate limits, spam protection, env safety, file risks, and data leakage risk.",
    operatorLeverageExplanation: "Security is important, but early acquisition aROI comes first from trust, intake, prioritization, seller prep, and follow-up discipline.",
  },
  {
    order: 17,
    name: "KPI & Revenue Intelligence",
    aroiTier: "Tier 1 - Highest aROI Leverage",
    purpose: "Track lead-to-call, call-to-offer, offer-to-contract, follow-up conversion, source quality, profit, close time, and dead lead causes.",
    operatorLeverageExplanation: "KPI intelligence tells the operator what actually produces revenue so effort compounds around the best acquisition actions.",
  },
];

export const phase1ImmediateChecklist = [
  "J Capital Trust",
  "J Capital Holdings LLC",
  "Cornerstone Property Group LLC",
  "EIN",
  "business banking",
  "domain",
  "Google Workspace",
  "professional emails",
  "branded signatures",
  "SPF/DKIM/DMARC",
  "Twilio readiness only",
  "DNC/STOP process",
  "communication governance",
];

export const twilioReadinessDoctrine = [
  "Twilio is readiness only.",
  "Twilio is NOT live activation.",
  "Twilio is NOT live outreach.",
  "Twilio is NOT autonomous communication.",
];

export const summaryLanguage = [
  "This system is not autonomous wholesaling.",
  "The AI is operator leverage only.",
  "The human operator owns communication and execution.",
  "Highest aROI comes from prioritization, seller clarity, follow-up discipline, trust, and operational focus.",
  "Next stage: Phase 1 Elite Business Foundation & Trust Infrastructure Planning.",
];

export function getEliteHighAroiAcquisitionOsAlignment(): EliteHighAroiAcquisitionOsAlignment {
  const result: EliteHighAroiAcquisitionOsAlignment = {
    systemMode: "elite_high_aroi_acquisition_os",
    businessName: "Cornerstone Property Group",
    market: "Oklahoma City, Oklahoma",
    primaryMetric: "acquisition_roi_per_operator_hour",
    aiRole: "operator_leverage_only",
    humanRole: "approval_execution_and_relationship_owner",
    currentImmediatePhase: "Phase 1 Business Foundation & Trust Infrastructure",
    recommendedNextExactStep: "Phase 1 Elite Business Foundation & Trust Infrastructure Planning",
    nextStageRecommendation: "Phase 1 Elite Business Foundation & Trust Infrastructure Planning",
    eliteAroiPrinciples,
    aiAllowedActions,
    aiForbiddenActions,
    humanOwnedActions,
    roadmap: eliteHighAroiRoadmap,
    phase1ImmediateChecklist,
    twilioReadinessDoctrine,
    summaryLanguage,
    readOnly: true,
    advisoryOnly: true,
    planningOnly: true,
    flags: eliteHighAroiAcquisitionOsFlags,
  };

  assertEliteHighAroiAcquisitionOsSafe(result);

  return result;
}

export function assertEliteHighAroiAcquisitionOsSafe(result: EliteHighAroiAcquisitionOsAlignment) {
  const allowedTrueFlags = new Set(["readOnly", "advisoryOnly", "planningOnly"]);
  const unsafeTrueFlags = Object.entries(result.flags).filter(([key, value]) => !allowedTrueFlags.has(key) && value === true);
  const tierOnePhases = result.roadmap.filter((phase) => phase.aroiTier === "Tier 1 - Highest aROI Leverage");

  if (!result.readOnly || !result.advisoryOnly || !result.planningOnly) {
    throw new Error("Elite high-aROI acquisition OS alignment must remain read-only, advisory-only, and planning-only.");
  }

  if (result.systemMode !== "elite_high_aroi_acquisition_os") {
    throw new Error("Elite high-aROI acquisition OS alignment must stay in elite_high_aroi_acquisition_os mode.");
  }

  if (result.primaryMetric !== "acquisition_roi_per_operator_hour") {
    throw new Error("Elite high-aROI acquisition OS alignment must optimize acquisition_roi_per_operator_hour.");
  }

  if (result.aiRole !== "operator_leverage_only") {
    throw new Error("AI role must remain operator_leverage_only.");
  }

  if (result.humanRole !== "approval_execution_and_relationship_owner") {
    throw new Error("Human role must remain approval_execution_and_relationship_owner.");
  }

  if (result.roadmap.length !== 17) {
    throw new Error("Elite high-aROI acquisition OS roadmap must include all 17 phases.");
  }

  if (tierOnePhases.length !== 7) {
    throw new Error("Elite high-aROI acquisition OS must keep exactly seven Tier 1 highest-aROI phases.");
  }

  if (unsafeTrueFlags.length > 0) {
    throw new Error("Elite high-aROI acquisition OS cannot authorize autonomous outreach, autonomous negotiation, autonomous texting/calling, autonomous seller or buyer handling, autonomous campaigns, autonomous deal blasting, provider activation, outbound communication, scraping, skip tracing, runtime jobs, polling, CRM mutation, automation, go-live, or approval-as-execution.");
  }

  if (result.recommendedNextExactStep !== "Phase 1 Elite Business Foundation & Trust Infrastructure Planning") {
    throw new Error("Elite high-aROI acquisition OS must recommend Phase 1 Elite Business Foundation & Trust Infrastructure Planning next.");
  }

  if (result.nextStageRecommendation !== "Phase 1 Elite Business Foundation & Trust Infrastructure Planning") {
    throw new Error("Elite high-aROI acquisition OS must include the next stage recommendation.");
  }
}

export function summarizeEliteHighAroiAcquisitionOs(result: EliteHighAroiAcquisitionOsAlignment) {
  assertEliteHighAroiAcquisitionOsSafe(result);

  return `${result.businessName} in ${result.market} is aligned as an ${result.systemMode} with primary metric ${result.primaryMetric}. This system is not autonomous wholesaling. The AI is operator leverage only, and the human operator owns communication and execution. Highest aROI comes from prioritization, seller clarity, follow-up discipline, trust, and operational focus. Virtual Driving for Dollars is a Tier 2 review-only intelligence phase, not live map automation. Tier 1 highest-aROI phases are business foundation, lead intake, prioritization, seller review, follow-up organization, daily command center, and KPI intelligence. Twilio remains readiness only, not live activation, not live outreach, and not autonomous communication. No provider activation, autonomous outreach, autonomous negotiation, autonomous texting, autonomous calling, autonomous seller handling, autonomous buyer handling, autonomous campaigns, autonomous deal blasting, autonomous approval authority, outbound communication, scraping, map scraping, Google Street View automation, GPS surveillance, skip tracing, runtime jobs, polling, CRM mutation, automation, go-live, or approval-as-execution is authorized. Next stage: ${result.nextStageRecommendation}.`;
}
