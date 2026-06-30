import { getConnectorHealth, listEnterpriseConnectors } from "@/lib/connector-platform";
import { getFeatureFlagSnapshot } from "@/lib/feature-flags";
import { evaluateSafeAutomation } from "@/lib/safe-auto-mode";

export type IntelligenceCadence = "daily" | "weekly" | "monthly";

export type MarketSignal = {
  id: string;
  category: "economic" | "government" | "news";
  title: string;
  sourceLabel: string;
  provenance: string;
  geography: string;
  confidence: number;
  marketImpact: "opportunity" | "risk" | "watch";
  businessImplication: string;
  missingData: string[];
  providerCalled: false;
};

export type DemandOpportunity = {
  id: string;
  audience: string;
  geography: string;
  unmetNeed: string;
  opportunityScore: number;
  confidence: number;
  revenuePotential: "low" | "medium" | "high";
  sourceLabel: string;
  explanation: string;
  requiredReview: string[];
  providerCalled: false;
};

export type GrowthDraftFoundation = {
  id: string;
  engine: "personal_brand" | "relationship";
  title: string;
  sourceLabel: string;
  draftType: string;
  approvalStatus: "needs_review";
  safetyBoundary: string;
  providerCalled: false;
  sent: false;
  published: false;
};

export type ExecutiveBriefing = {
  cadence: IntelligenceCadence;
  generatedAt: string;
  priorities: Array<{
    title: string;
    reason: string;
    confidence: number;
    requiredAction: "review" | "approve" | "monitor";
    safeAutoStatus: "auto_allowed_internal" | "approval_required" | "blocked";
  }>;
  connectorHealth: ReturnType<typeof getConnectorHealth>;
  marketSignals: MarketSignal[];
  demandOpportunities: DemandOpportunity[];
  growthDrafts: GrowthDraftFoundation[];
  featureFlags: ReturnType<typeof getFeatureFlagSnapshot>;
  providerCalled: false;
  liveExecutionAllowed: false;
};

export const marketSignals: MarketSignal[] = [
  {
    id: "mortgage-rate-watch",
    category: "economic",
    title: "Mortgage rate and affordability watch",
    sourceLabel: "manual-economic-source",
    provenance: "Manual/import-ready economic indicator record. No live provider called.",
    geography: "Oklahoma City metro",
    confidence: 62,
    marketImpact: "watch",
    businessImplication: "Monitor affordability pressure because it can affect seller motivation, buyer demand, and financing timelines.",
    missingData: ["Current verified mortgage-rate feed", "Current affordability index"],
    providerCalled: false,
  },
  {
    id: "zoning-policy-watch",
    category: "government",
    title: "Zoning and public notice watch",
    sourceLabel: "manual-government-source",
    provenance: "Approved-source registry placeholder for municipal/county records.",
    geography: "Oklahoma County and surrounding municipalities",
    confidence: 58,
    marketImpact: "opportunity",
    businessImplication: "Track zoning, infrastructure, and public notices for neighborhood-level investment timing signals.",
    missingData: ["Approved municipal source list", "Freshness timestamp"],
    providerCalled: false,
  },
  {
    id: "local-development-news",
    category: "news",
    title: "Local development and construction news watch",
    sourceLabel: "manual-news-source",
    provenance: "Manual/news source record requiring attribution before public use.",
    geography: "Oklahoma City",
    confidence: 55,
    marketImpact: "watch",
    businessImplication: "Use attributed development signals to inform content, buyer conversations, and acquisition review priorities.",
    missingData: ["Article URL", "Publication timestamp", "Licensed feed approval"],
    providerCalled: false,
  },
];

export const demandOpportunities: DemandOpportunity[] = [
  {
    id: "out-of-state-owner-guidance",
    audience: "Out-of-state property owners",
    geography: "Oklahoma City metro",
    unmetNeed: "Clear, low-pressure guidance for owners managing property decisions remotely.",
    opportunityScore: 78,
    confidence: 70,
    revenuePotential: "high",
    sourceLabel: "existing-public-content-and-crm-source-taxonomy",
    explanation: "Existing site content and lead-source goals already emphasize out-of-state owners and source tracking, making this a strong education and acquisition lane.",
    requiredReview: ["Confirm current lead volume by source", "Review claims before publishing content"],
    providerCalled: false,
  },
  {
    id: "contractor-rehab-network",
    audience: "Contractors and rehab partners",
    geography: "Oklahoma City metro",
    unmetNeed: "Reliable relationship pipeline for repair-heavy property opportunities.",
    opportunityScore: 69,
    confidence: 60,
    revenuePotential: "medium",
    sourceLabel: "relationship-engine-foundation",
    explanation: "The Network Engine requirements identify contractors as strategic relationships tied to deal flow and execution capacity.",
    requiredReview: ["Add approved contractor source list", "Confirm communication consent before outreach"],
    providerCalled: false,
  },
];

export const growthDraftFoundations: GrowthDraftFoundation[] = [
  {
    id: "founder-market-lesson-draft",
    engine: "personal_brand",
    title: "Market lesson draft from approved insight",
    sourceLabel: "approved-founder-profile-required",
    draftType: "LinkedIn thought leadership outline",
    approvalStatus: "needs_review",
    safetyBoundary: "No founder credentials, deal details, or market claims may be invented.",
    providerCalled: false,
    sent: false,
    published: false,
  },
  {
    id: "relationship-follow-up-draft",
    engine: "relationship",
    title: "Strategic partner follow-up draft",
    sourceLabel: "approved-relationship-record-required",
    draftType: "Follow-up email draft",
    approvalStatus: "needs_review",
    safetyBoundary: "Prepare only. Do not send, schedule, or commit to partnership terms.",
    providerCalled: false,
    sent: false,
    published: false,
  },
];

export function createMarketIntelligenceReport() {
  return {
    ok: true,
    signals: marketSignals,
    sourceMode: "manual_import_ready",
    approvedSourceRegistryRequired: true,
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}

export function createDemandDiscoveryReport() {
  return {
    ok: true,
    opportunities: demandOpportunities,
    scoringMode: "explainable_advisory",
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}

export function createGrowthFoundationReport(engine: "personal_brand" | "relationship") {
  return {
    ok: true,
    engine,
    drafts: growthDraftFoundations.filter((draft) => draft.engine === engine),
    approvalRequired: true,
    providerCalled: false,
    sent: false,
    published: false,
    liveExecutionAllowed: false,
  };
}

export function createExecutiveBriefing(cadence: IntelligenceCadence = "daily"): ExecutiveBriefing {
  const marketSummary = createMarketIntelligenceReport();
  const demandSummary = createDemandDiscoveryReport();
  const connectorHealth = getConnectorHealth();
  const safeMarketSummary = evaluateSafeAutomation({
    requestedAction: "summarize_macro_signal",
    preferredToolKey: "approved_news_registry",
    module: "Executive AI",
    expectedRoi: "medium",
  });

  return {
    cadence,
    generatedAt: new Date().toISOString(),
    priorities: [
      {
        title: "Keep connector platform in readiness mode until live-read approvals exist",
        reason: "Most connector family feature flags are disabled, preserving the no-provider-call boundary while registry visibility expands.",
        confidence: 90,
        requiredAction: "monitor",
        safeAutoStatus: "approval_required",
      },
      {
        title: "Review out-of-state owner education lane",
        reason: "Demand Discovery identifies a high-scoring audience with existing website/content alignment and clear source-tracking needs.",
        confidence: 74,
        requiredAction: "review",
        safeAutoStatus: "auto_allowed_internal",
      },
      {
        title: "Prepare macro watch brief",
        reason: safeMarketSummary.reason,
        confidence: safeMarketSummary.status === "auto_allowed_internal" ? 78 : 62,
        requiredAction: "review",
        safeAutoStatus: safeMarketSummary.status,
      },
    ],
    connectorHealth,
    marketSignals: marketSummary.signals,
    demandOpportunities: demandSummary.opportunities,
    growthDrafts: growthDraftFoundations,
    featureFlags: getFeatureFlagSnapshot(),
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}

export function createPhase2DashboardSummary() {
  const connectors = listEnterpriseConnectors();

  return {
    ok: true,
    connectorCount: connectors.length,
    enabledFeatureFlags: getFeatureFlagSnapshot().enabled,
    connectorHealth: getConnectorHealth(),
    marketSignalCount: marketSignals.length,
    demandOpportunityCount: demandOpportunities.length,
    growthDraftCount: growthDraftFoundations.length,
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}

