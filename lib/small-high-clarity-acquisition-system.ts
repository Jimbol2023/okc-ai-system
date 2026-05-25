export const smallHighClarityAcquisitionSystemFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  providerActivated: false,
  twilioActivated: false,
  googleWorkspaceActivated: false,
  domainActivated: false,
  dnsMutationEnabled: false,
  vercelMutationEnabled: false,
  outboundSmsEnabled: false,
  outboundEmailEnabled: false,
  callingEnabled: false,
  aiVoiceEnabled: false,
  autonomousOutreachEnabled: false,
  autonomousNegotiationEnabled: false,
  autonomousTextingEnabled: false,
  autonomousCallingEnabled: false,
  autonomousCampaignsEnabled: false,
  autonomousDealBlastingEnabled: false,
  autonomousSellerHandlingEnabled: false,
  autonomousBuyerHandlingEnabled: false,
  autonomousApprovalAuthorityEnabled: false,
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

export type SmallHighClaritySystemMode = "small_high_clarity_acquisition_operating_system";
export type SmallHighClarityBusinessName = "Cornerstone Property Group";
export type SmallHighClarityMarket = "Oklahoma City, Oklahoma";
export type SmallHighClarityPrimaryMetric = "acquisition_roi_per_operator_hour";
export type SmallHighClarityAiRole = "operator_leverage_only";
export type SmallHighClarityHumanRole = "approval_execution_and_relationship_owner";
export type SmallHighClarityCurrentPhase = "Phase 1 - Business Foundation & Trust Infrastructure";
export type SmallHighClarityNextStep = "Manual Business Entity And Communication Identity Setup";

export type SmallHighClarityRoadmapPhase = {
  phaseNumber: number;
  phaseName: string;
  goal: string;
  buildOrPlanningItems: string[];
  aiRole: string[];
  humanRole: string[];
  forbiddenDrift: string[];
  aroiRationale: string;
  nextPhaseRecommendation: string;
};

export type SmallHighClarityAcquisitionSystem = {
  systemMode: SmallHighClaritySystemMode;
  businessName: SmallHighClarityBusinessName;
  market: SmallHighClarityMarket;
  primaryMetric: SmallHighClarityPrimaryMetric;
  aiRole: SmallHighClarityAiRole;
  humanRole: SmallHighClarityHumanRole;
  currentImmediatePhase: SmallHighClarityCurrentPhase;
  recommendedNextExactStep: SmallHighClarityNextStep;
  nextStageRecommendation: SmallHighClarityNextStep;
  systemPrinciples: string[];
  aiAllowedActions: string[];
  aiForbiddenActions: string[];
  humanOwnedActions: string[];
  roadmap: SmallHighClarityRoadmapPhase[];
  summaryLanguage: string[];
  readOnly: true;
  advisoryOnly: true;
  planningOnly: true;
  flags: typeof smallHighClarityAcquisitionSystemFlags;
};

export const smallHighClaritySystemPrinciples = [
  "high-clarity",
  "revenue-focused",
  "human-approved",
  "disciplined",
  "local-first",
  "operationally realistic",
  "modular",
  "readable",
  "deterministic",
  "fail-closed",
  "governance-first",
  "small enough for one operator to run",
  "highest acquisition ROI per operator hour",
];

export const smallHighClarityAiAllowedActions = [
  "organize",
  "prioritize",
  "summarize",
  "prepare",
  "protect",
  "improve operational discipline",
  "reduce lead leakage",
  "improve seller review quality",
  "improve follow-up discipline",
  "improve marketing organization",
];

export const smallHighClarityAiForbiddenActions = [
  "autonomous wholesaling",
  "autonomous outreach",
  "autonomous texting",
  "autonomous calling",
  "autonomous campaigns",
  "autonomous deal blasting",
  "autonomous seller handling",
  "autonomous buyer handling",
  "autonomous negotiation",
  "autonomous closing",
  "provider activation",
  "autonomous scraping",
  "autonomous skip tracing",
];

export const smallHighClarityHumanOwnedActions = [
  "approve",
  "review",
  "communicate",
  "negotiate",
  "decide",
  "send",
  "close",
  "own seller relationships",
  "own buyer relationships",
];

export const smallHighClarityRoadmap: SmallHighClarityRoadmapPhase[] = [
  {
    phaseNumber: 1,
    phaseName: "Business Foundation & Trust Infrastructure",
    goal: "Become a real acquisition business with local trust, professional identity, and safe communication readiness.",
    buildOrPlanningItems: [
      "J Capital Trust",
      "J Capital Holdings LLC",
      "Cornerstone Property Group LLC",
      "EIN",
      "business banking",
      "domain",
      "Google Workspace",
      "professional emails",
      "email signatures",
      "SPF/DKIM/DMARC",
      "Twilio readiness",
      "DNC/STOP process",
      "communication governance",
    ],
    aiRole: ["organization", "checklisting", "readiness review", "planning assistance"],
    humanRole: ["business registration", "provider decisions", "communication approval", "relationship ownership"],
    forbiddenDrift: ["live texting", "live calling", "provider activation", "outbound campaigns", "autonomous communication"],
    aroiRationale: "Trust infrastructure raises seller confidence and protects every future acquisition hour from avoidable reputation friction.",
    nextPhaseRecommendation: "Manual Business Entity And Communication Identity Setup",
  },
  {
    phaseNumber: 2,
    phaseName: "Lead Intake & Simple CRM",
    goal: "Create clean lead organization without overbuilding the CRM.",
    buildOrPlanningItems: ["seller intake form", "lead dashboard", "lead stages", "notes", "tags", "follow-up dates", "seller communication history", "property details", "status system"],
    aiRole: ["summarize leads", "identify missing information", "organize lead pipeline"],
    humanRole: ["review leads", "verify property facts", "own seller communication", "update lead truth"],
    forbiddenDrift: ["CRM mutation without approval", "autonomous outreach", "property fact invention", "runtime assignment automation"],
    aroiRationale: "A simple CRM prevents lead leakage and gives one operator a reliable daily source of truth.",
    nextPhaseRecommendation: "Lead Prioritization Engine",
  },
  {
    phaseNumber: 3,
    phaseName: "Lead Prioritization Engine",
    goal: "Know exactly who matters every day.",
    buildOrPlanningItems: ["CALL FIRST queue", "REVIEW TODAY queue", "FOLLOW-UP queue", "WAITING queue", "BLOCKED queue", "DEAD queue", "urgency visibility", "missing information visibility"],
    aiRole: ["identify hottest leads", "surface motivated sellers", "find overdue follow-up", "flag blocked leads", "flag dead leads", "estimate likely conversion quality"],
    humanRole: ["choose daily work", "approve priority interpretation", "make calls", "decide next actions"],
    forbiddenDrift: ["autonomous routing execution", "autonomous communication", "unreviewed conversion claims", "hidden scoring"],
    aroiRationale: "Prioritization improves acquisition ROI per operator hour by focusing human effort on the highest-value sellers first.",
    nextPhaseRecommendation: "Seller Review & Call Prep",
  },
  {
    phaseNumber: 4,
    phaseName: "Seller Review & Call Prep",
    goal: "Improve seller conversation quality before the operator communicates.",
    buildOrPlanningItems: ["property summary", "seller timeline", "motivation summary", "likely objections", "missing information", "risk visibility", "next questions", "negotiation considerations"],
    aiRole: ["prepare call briefs", "summarize context", "surface risks", "organize next questions"],
    humanRole: ["verify facts", "lead conversations", "negotiate", "make offers"],
    forbiddenDrift: ["autonomous negotiation", "seller-facing AI persuasion", "property fact invention", "offer approval automation"],
    aroiRationale: "Better call prep increases trust, confidence, conversion quality, and operator clarity.",
    nextPhaseRecommendation: "Follow-Up Organization System",
  },
  {
    phaseNumber: 5,
    phaseName: "Follow-Up Organization System",
    goal: "Prevent lead leakage without creating autonomous follow-up blasting.",
    buildOrPlanningItems: ["overdue follow-up", "warm sellers", "callback requests", "opt-outs", "dead leads", "negotiation stages", "seller responsiveness"],
    aiRole: ["organize follow-up", "surface overdue work", "summarize responsiveness", "flag opt-outs"],
    humanRole: ["review follow-up", "approve messages", "send communication manually", "own negotiation stages"],
    forbiddenDrift: ["autonomous follow-up blasting", "autonomous texting", "autonomous email", "DNC/STOP bypass"],
    aroiRationale: "Follow-up discipline protects revenue already created by sourcing and marketing work.",
    nextPhaseRecommendation: "Deal Quality Intelligence",
  },
  {
    phaseNumber: 6,
    phaseName: "Deal Quality Intelligence",
    goal: "Avoid bad deals and protect operator time.",
    buildOrPlanningItems: ["title complexity", "repair uncertainty", "assignment difficulty", "occupancy problems", "unrealistic sellers", "financing issues", "timeline instability", "seller friction", "buyer-fit problems"],
    aiRole: ["surface deal risks", "summarize quality concerns", "organize review questions", "protect operator focus"],
    humanRole: ["verify risks", "decide whether to proceed", "own offer strategy", "own seller expectations"],
    forbiddenDrift: ["automatic deal rejection", "investment advice claims", "property fact invention", "autonomous offer execution"],
    aroiRationale: "Bad-deal avoidance saves time, reputation, energy, and operational clarity.",
    nextPhaseRecommendation: "AI-Assisted Lead Discovery",
  },
  {
    phaseNumber: 7,
    phaseName: "AI-Assisted Lead Discovery",
    goal: "Generate and organize opportunities beyond public lists while keeping humans in control.",
    buildOrPlanningItems: ["Facebook", "TikTok", "SEO", "referrals", "driving for dollars", "county lists", "probate", "tax delinquency", "landlord distress", "investor referrals", "inbound website forms", "local networking"],
    aiRole: ["organize", "clean", "prioritize", "summarize", "identify source patterns"],
    humanRole: ["review sources", "approve contact", "contact sellers", "negotiate"],
    forbiddenDrift: ["autonomous scraping", "autonomous skip tracing", "autonomous seller outreach", "autonomous campaigns"],
    aroiRationale: "Lead discovery support improves source quality without turning the system into uncontrolled acquisition automation.",
    nextPhaseRecommendation: "Facebook & TikTok Acquisition Engine",
  },
  {
    phaseNumber: 8,
    phaseName: "Facebook & TikTok Acquisition Engine",
    goal: "Generate inbound motivated seller leads and local authority.",
    buildOrPlanningItems: ["ad angles", "ad copy", "lead forms", "landing pages", "retargeting concepts", "seller education content", "short-form scripts", "local authority videos", "trust-building clips", "local market education"],
    aiRole: ["draft content ideas", "organize campaign concepts", "prepare seller education angles", "review trust quality"],
    humanRole: ["approve claims", "publish manually", "own ad spend", "review inbound leads"],
    forbiddenDrift: ["autonomous campaigns", "unapproved ad claims", "provider activation", "spend automation"],
    aroiRationale: "Inbound local authority can lower competition and improve seller trust when the core operating system is disciplined.",
    nextPhaseRecommendation: "SEO & Local Authority Engine",
  },
  {
    phaseNumber: 9,
    phaseName: "SEO & Local Authority Engine",
    goal: "Generate inbound search traffic from high-intent motivated sellers.",
    buildOrPlanningItems: ["local SEO pages", "seller FAQ pages", "neighborhood pages", "blog content", "title/meta optimization", "internal links", "Google Business Profile strategy"],
    aiRole: ["plan content", "draft local authority topics", "organize keywords", "review trust copy"],
    humanRole: ["approve content", "verify local claims", "publish manually", "review inbound leads"],
    forbiddenDrift: ["auto-publishing", "invented local claims", "provider activation", "spam content generation"],
    aroiRationale: "SEO compounds inbound lead quality once the operator can reliably review and follow up.",
    nextPhaseRecommendation: "Design & Creative AI Agent",
  },
  {
    phaseNumber: 10,
    phaseName: "Design & Creative AI Agent",
    goal: "Increase professionalism, trust, and conversion quality.",
    buildOrPlanningItems: ["logos", "branding", "seller pages", "ad creatives", "thumbnails", "landing pages", "social graphics", "mobile-first layouts", "trust sections", "CTA optimization"],
    aiRole: ["draft creative direction", "prepare design options", "review trust consistency", "support mobile-first clarity"],
    humanRole: ["approve brand identity", "choose final designs", "verify claims", "publish manually"],
    forbiddenDrift: ["brand sprawl", "unapproved claims", "auto-publishing", "creative work that outranks acquisition clarity"],
    aroiRationale: "Professional creative raises trust and conversions when it supports, rather than distracts from, seller clarity.",
    nextPhaseRecommendation: "Conversion Optimization Engine",
  },
  {
    phaseNumber: 11,
    phaseName: "Conversion Optimization Engine",
    goal: "Get more qualified leads from the same traffic.",
    buildOrPlanningItems: ["landing page review", "form review", "CTA placement", "mobile usability", "trust copy", "seller objections", "abandonment points"],
    aiRole: ["review conversion friction", "summarize objections", "suggest form improvements", "prioritize mobile clarity"],
    humanRole: ["approve changes", "validate seller claims", "choose tests", "monitor lead quality"],
    forbiddenDrift: ["dark patterns", "unapproved publishing", "misleading urgency", "provider mutation"],
    aroiRationale: "Conversion improvements raise yield without adding operator chaos or more ad spend.",
    nextPhaseRecommendation: "Buyer Fit Intelligence",
  },
  {
    phaseNumber: 12,
    phaseName: "Buyer Fit Intelligence",
    goal: "Improve disposition quality without autonomous deal blasting.",
    buildOrPlanningItems: ["flipper buyers", "landlord buyers", "land investors", "infill developers", "creative finance buyers", "rental buyers"],
    aiRole: ["organize buyer patterns", "summarize buyer fit", "flag mismatch risk", "prepare disposition notes"],
    humanRole: ["review buyer fit", "communicate with buyers", "approve deal sharing", "own relationships"],
    forbiddenDrift: ["autonomous deal blasting", "autonomous buyer handling", "unapproved buyer communication", "hidden buyer scoring"],
    aroiRationale: "Buyer-fit clarity improves disposition quality while preserving relationship control.",
    nextPhaseRecommendation: "Daily Acquisition Command Center",
  },
  {
    phaseNumber: 13,
    phaseName: "Daily Acquisition Command Center",
    goal: "Give one operator one dashboard for maximum acquisition clarity.",
    buildOrPlanningItems: ["highest priority leads", "warm sellers", "overdue follow-ups", "blocked deals", "stale leads", "buyer-fit opportunities", "communication warnings", "review-needed leads"],
    aiRole: ["summarize daily work", "surface warnings", "organize queues", "reduce decision fatigue"],
    humanRole: ["choose work", "approve actions", "execute communication", "own daily operating rhythm"],
    forbiddenDrift: ["autonomous work execution", "auto-send behavior", "CRM mutation without approval", "runtime command jobs"],
    aroiRationale: "A daily command center reduces chaos, overwhelm, and wasted attention.",
    nextPhaseRecommendation: "Safety & Compliance Engine",
  },
  {
    phaseNumber: 14,
    phaseName: "Safety & Compliance Engine",
    goal: "Protect the business as communication and lead volume grow.",
    buildOrPlanningItems: ["DNC handling", "STOP handling", "opt-outs", "consent visibility", "communication governance", "ad claim safety", "manual approval boundaries"],
    aiRole: ["surface safety issues", "organize compliance review", "flag opt-out and consent risks", "protect communication reputation"],
    humanRole: ["approve communication", "decide compliance posture", "own final legal/compliance review", "pause unsafe work"],
    forbiddenDrift: ["DNC bypass", "STOP bypass", "autonomous compliance decisions", "go-live authorization"],
    aroiRationale: "Safety protects communication reputation and makes growth durable.",
    nextPhaseRecommendation: "Pentest & Security Engine",
  },
  {
    phaseNumber: 15,
    phaseName: "Pentest & Security Engine",
    goal: "Protect lead data and acquisition infrastructure.",
    buildOrPlanningItems: ["auth security", "API exposure", "Supabase security", "route protection", "rate limits", "spam protection", "env safety", "upload/file risks", "data leakage risk"],
    aiRole: ["review security posture", "surface exposure risks", "organize remediation priorities", "protect lead data"],
    humanRole: ["approve fixes", "manage credentials", "own deployment decisions", "decide acceptable risk"],
    forbiddenDrift: ["unsafe scanning", "credential exposure", "provider mutation", "unapproved deployment changes"],
    aroiRationale: "Security protects acquisition assets from leaks and operational compromise.",
    nextPhaseRecommendation: "KPI & Revenue Intelligence",
  },
  {
    phaseNumber: 16,
    phaseName: "KPI & Revenue Intelligence",
    goal: "Understand what actually produces revenue.",
    buildOrPlanningItems: ["lead-to-call ratio", "call-to-offer ratio", "offer-to-contract ratio", "follow-up conversion", "marketing source quality", "average deal profitability", "time to close", "dead lead causes"],
    aiRole: ["summarize KPI patterns", "identify revenue bottlenecks", "surface source quality", "support operator decisions"],
    humanRole: ["interpret revenue truth", "choose focus", "adjust operations", "approve expansion"],
    forbiddenDrift: ["autonomous expansion", "unreviewed revenue claims", "spend automation", "provider activation"],
    aroiRationale: "KPI intelligence tells the operator what actually makes money so effort compounds around proven acquisition actions.",
    nextPhaseRecommendation: "Review KPI Evidence Before Expanding Scope",
  },
];

export const smallHighClaritySummaryLanguage = [
  "Cornerstone Property Group is a small high-clarity acquisition operating system.",
  "The system is high-clarity, revenue-focused, human-approved, disciplined, local-first, and operationally realistic.",
  "AI remains operator leverage only.",
  "Humans approve, review, communicate, negotiate, decide, send, and close.",
  "The system is not autonomous wholesaling.",
  "The system must not become enterprise AI sprawl.",
  "The next exact step is Manual Business Entity And Communication Identity Setup.",
];

export function getSmallHighClarityAcquisitionSystem(): SmallHighClarityAcquisitionSystem {
  const result: SmallHighClarityAcquisitionSystem = {
    systemMode: "small_high_clarity_acquisition_operating_system",
    businessName: "Cornerstone Property Group",
    market: "Oklahoma City, Oklahoma",
    primaryMetric: "acquisition_roi_per_operator_hour",
    aiRole: "operator_leverage_only",
    humanRole: "approval_execution_and_relationship_owner",
    currentImmediatePhase: "Phase 1 - Business Foundation & Trust Infrastructure",
    recommendedNextExactStep: "Manual Business Entity And Communication Identity Setup",
    nextStageRecommendation: "Manual Business Entity And Communication Identity Setup",
    systemPrinciples: smallHighClaritySystemPrinciples,
    aiAllowedActions: smallHighClarityAiAllowedActions,
    aiForbiddenActions: smallHighClarityAiForbiddenActions,
    humanOwnedActions: smallHighClarityHumanOwnedActions,
    roadmap: smallHighClarityRoadmap,
    summaryLanguage: smallHighClaritySummaryLanguage,
    readOnly: true,
    advisoryOnly: true,
    planningOnly: true,
    flags: smallHighClarityAcquisitionSystemFlags,
  };

  assertSmallHighClarityAcquisitionSystemSafe(result);

  return result;
}

export function assertSmallHighClarityAcquisitionSystemSafe(result: SmallHighClarityAcquisitionSystem) {
  const allowedTrueFlags = new Set(["readOnly", "advisoryOnly", "planningOnly"]);
  const unsafeTrueFlags = Object.entries(result.flags).filter(([key, value]) => !allowedTrueFlags.has(key) && value === true);
  const expectedPhaseNumbers = Array.from({ length: 16 }, (_, index) => index + 1);

  if (!result.readOnly || !result.advisoryOnly || !result.planningOnly) {
    throw new Error("Small high-clarity acquisition system must remain read-only, advisory-only, and planning-only.");
  }

  if (result.systemMode !== "small_high_clarity_acquisition_operating_system") {
    throw new Error("Small high-clarity acquisition system mode must remain pinned.");
  }

  if (result.primaryMetric !== "acquisition_roi_per_operator_hour") {
    throw new Error("Small high-clarity acquisition system must optimize acquisition_roi_per_operator_hour.");
  }

  if (result.aiRole !== "operator_leverage_only") {
    throw new Error("AI role must remain operator_leverage_only.");
  }

  if (result.humanRole !== "approval_execution_and_relationship_owner") {
    throw new Error("Human role must remain approval_execution_and_relationship_owner.");
  }

  if (result.recommendedNextExactStep !== "Manual Business Entity And Communication Identity Setup") {
    throw new Error("Small high-clarity acquisition system must recommend Manual Business Entity And Communication Identity Setup next.");
  }

  if (result.nextStageRecommendation !== "Manual Business Entity And Communication Identity Setup") {
    throw new Error("Small high-clarity acquisition system must keep the next stage recommendation pinned.");
  }

  if (result.roadmap.length !== 16) {
    throw new Error("Small high-clarity acquisition system roadmap must include all 16 phases.");
  }

  if (result.roadmap.map((phase) => phase.phaseNumber).join(",") !== expectedPhaseNumbers.join(",")) {
    throw new Error("Small high-clarity acquisition system roadmap phases must remain ordered 1 through 16.");
  }

  if (result.roadmap.some((phase) => !phase.nextPhaseRecommendation)) {
    throw new Error("Every small high-clarity roadmap phase must include a next phase recommendation.");
  }

  if (result.roadmap[0]?.nextPhaseRecommendation !== "Manual Business Entity And Communication Identity Setup") {
    throw new Error("Phase 1 must end with Manual Business Entity And Communication Identity Setup.");
  }

  if (result.roadmap[15]?.nextPhaseRecommendation !== "Review KPI Evidence Before Expanding Scope") {
    throw new Error("Phase 16 must end with Review KPI Evidence Before Expanding Scope.");
  }

  if (unsafeTrueFlags.length > 0) {
    throw new Error("Small high-clarity acquisition system cannot authorize providers, Twilio, Google Workspace, domains, DNS mutation, Vercel mutation, outbound SMS/email, calling, AI voice, autonomous outreach, autonomous negotiation, autonomous texting/calling, autonomous campaigns, autonomous deal blasting, autonomous seller or buyer handling, autonomous approval authority, scraping, skip tracing, campaigns, runtime jobs, polling, CRM mutation, automation, go-live, or approval-as-execution.");
  }
}

export function summarizeSmallHighClarityAcquisitionSystem(result: SmallHighClarityAcquisitionSystem) {
  assertSmallHighClarityAcquisitionSystemSafe(result);

  return `${result.businessName} in ${result.market} is aligned as a ${result.systemMode} optimizing ${result.primaryMetric}. The system is high-clarity, revenue-focused, human-approved, disciplined, local-first, and operationally realistic. AI remains operator leverage only; humans approve, review, communicate, negotiate, decide, send, and close. This is not autonomous wholesaling and does not authorize provider activation, autonomous outreach, autonomous texting, autonomous calling, autonomous campaigns, autonomous deal blasting, autonomous seller handling, autonomous buyer handling, autonomous negotiation, scraping, skip tracing, runtime jobs, CRM mutation, automation, go-live, or approval-as-execution. The roadmap contains ${result.roadmap.length} phases, each with a next phase recommendation. Next exact step: ${result.recommendedNextExactStep}.`;
}
