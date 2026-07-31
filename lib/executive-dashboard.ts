import { createBusinessIntelligenceReport, type BusinessIntelligenceReport, type DepartmentHealthCard, type TrendChart } from "@/lib/business-intelligence";
import { loadPartialData } from "@/lib/api-response";
import { getBuyerDemandSignals } from "@/lib/buyer-demand";
import { createBuyerDemandCertificationPacket, type BuyerDemandCertificationPacketV1 } from "@/lib/buyer-demand-certification";
import { createBuyerDemandOpportunityPrioritization, type BuyerDemandOpportunityPrioritizationV1 } from "@/lib/buyer-demand-opportunity-prioritization";
import { getCompanyActivationSnapshot } from "@/lib/company-activation";
import { createInheritedPropertyCampaignDirective, getCompanyDepartmentRegistry, runCompanyOrchestrator, startDailyCompanyOperatingSession, type AiDepartmentName, type CompanyOrchestratorReport, type DailyCompanyOperatingSession } from "@/lib/company-orchestrator";
import { createConnectorActivationReport, type ConnectorActivationReport } from "@/lib/connector-activation-report";
import { createContentIntelligenceReport, type ContentIntelligenceReport } from "@/lib/content-intelligence";
import { createCrossConnectorCertificationPacket, type CrossConnectorCertificationPacketV1 } from "@/lib/cross-connector-certification";
import { createCrossConnectorIntelligenceReport, type CrossConnectorIntelligenceReportV1 } from "@/lib/cross-connector-intelligence";
import { getDailyMission, type DailyMission } from "@/lib/daily-mission";
import { getDepartmentIntelligenceReport, type DepartmentIntelligenceReport } from "@/lib/department-intelligence";
import { createExecutiveLearningRecommendations, type ExecutiveLearningMemoryEvent, type ExecutiveLearningRecommendation } from "@/lib/executive-learning";
import { createExecutiveRecommendationsFromBi } from "@/lib/executive-recommendations";
import { listFinanceEntries, calculateFinanceKpis, formatFinanceDollars } from "@/lib/finance";
import { listKnowledgeItems } from "@/lib/knowledge";
import { listDbLeads } from "@/lib/leads-db";
import type { StoredLead } from "@/lib/leads-storage";
import { listMarketingWorkflow } from "@/lib/marketing-workflow";
import { createMarketingPlatformRegistryReport, type MarketingPlatformRegistryReport } from "@/lib/marketing-platform-registry";
import { createProviderReadinessReport } from "@/lib/provider-readiness";
import { getLatestBusinessSnapshots, getLatestLiveMorningBrief, type BusinessDataSnapshotRecord } from "@/lib/read-only-business-connections";
import { getReferralDashboard } from "@/lib/referrals";
import { getRevenuePipelineSummary } from "@/lib/revenue-pipeline";
import { getSystemHealth } from "@/lib/system-health";
import { publicSiteUrl } from "@/lib/public-seo";
import { prisma } from "@/lib/prisma";

export type ExecutiveWidget = {
  id: string;
  label: string;
  value: string | number;
  detail: string;
  href: string;
  status: "good" | "watch" | "urgent" | "missing";
};

export type ExecutiveMorningBrief = {
  greeting: string;
  summary: string;
  keySignals: Array<{
    id: string;
    label: string;
    value: string | number;
    detail: string;
    status: ExecutiveWidget["status"];
  }>;
  recommendedWorkOrder: string[];
  memoryInsight: {
    title: string;
    summary: string;
    confidenceLabel: ExecutiveLearningRecommendation["confidenceLabel"];
    confidenceScore: number;
    sampleWindowDays: 90;
  } | null;
  safetyBadges: string[];
};

export type RevenueCommandCenterItem = {
  id: string;
  label: string;
  value: string | number;
  detail: string;
  href: string;
  status: ExecutiveWidget["status"];
  sourceLabel: string;
  assumption: string;
};

export type RevenueCommandCenterSection = {
  id: "revenue" | "marketing" | "seo" | "lead_intelligence" | "business_health" | "approval_priorities";
  title: string;
  summary: string;
  items: RevenueCommandCenterItem[];
};

export type RevenueCommandCenterReport = {
  title: "Revenue Command Center";
  summary: string;
  executiveSummary: string;
  sections: RevenueCommandCenterSection[];
  highRoiDecisionFilter: string[];
  nextBestActions: string[];
  safetyFlags: {
    advisoryOnly: true;
    providerCalled: false;
    liveExecutionAllowed: false;
    externalActionsBlocked: true;
    publishingBlocked: true;
    outreachBlocked: true;
    scrapingBlocked: true;
    adsBlocked: true;
    humanApprovalRequired: true;
  };
};

export type ExecutiveWorkforceHealthCard = {
  id: "revenue" | "brand" | "marketing" | "seo" | "content" | "lead" | "operations" | "security";
  label: string;
  score: number;
  status: ExecutiveWidget["status"];
  detail: string;
  sourceLabel: string;
  assumption: string;
};

export type ExecutiveWorkforceReport = {
  healthCards: ExecutiveWorkforceHealthCard[];
  brandHealth: MarketingPlatformRegistryReport;
  contentIntelligence: ContentIntelligenceReport;
  companyOrchestrator: CompanyOrchestratorReport;
  safetyFlags: {
    advisoryOnly: true;
    providerCalled: false;
    liveExecutionAllowed: false;
    publishingBlocked: true;
    scrapingBlocked: true;
    outreachBlocked: true;
    approvalRequired: true;
  };
};

export type ArchitectureSourceBasis = {
  category: "internal_standard" | "official_vendor_doc" | "open_standard" | "maintained_oss_pattern" | "best_practice";
  label: string;
  reference: string;
  rationale: string;
};

export type DepartmentLifecycleStatus = "active" | "planned" | "future_ready";

export type ArchitectureImprovementItem = {
  id: string;
  title: string;
  ownerDepartment: string;
  businessValue: string;
  risk: "high" | "medium" | "low";
  readinessState: "ready_for_ceo_review" | "in_progress" | "planned" | "blocked";
  nextSafeAction: string;
  ceoApprovalRequired: true;
  sourceBasis: ArchitectureSourceBasis[];
  providerCalled: false;
  liveExecutionAllowed: false;
  externalExecutionAllowed: false;
};

export type WorkflowHandoffReadinessItem = {
  id: string;
  workQueueItemId: string;
  currentOwner: string;
  nextDepartment: string;
  blocker: string;
  evidenceRequired: string[];
  approvalRequirement: string;
  recoveryPath: string;
  providerCalled: false;
  liveExecutionAllowed: false;
  outreachBlocked: true;
  scrapingBlocked: true;
  workflowStarted: false;
};

export type DepartmentCommandMatrixItem = {
  department: string;
  operatingRole: string;
  currentOutput: string;
  nextHandoff: string;
  blocker: string;
  dealContribution: "lead_flow" | "conversion" | "deal_analysis" | "trust" | "operations" | "governance";
  lifecycleStatus: DepartmentLifecycleStatus;
  activeExecutionOwner: boolean;
  approvalRequired: true;
  providerCalled: false;
  liveExecutionAllowed: false;
  sourceLabel: string;
  assumption: string;
};

export type DealClosingWorkQueueItem = {
  id: string;
  title: string;
  count: number | string;
  ownerDepartment: AiDepartmentName;
  nextManualAction: string;
  revenueImpact: "high" | "medium" | "low";
  safetyBoundary: string;
  href: string;
  status: ExecutiveWidget["status"];
  sourceLabel: string;
  assumption: string;
};

export type OperatingCompanyReport = {
  summary: string;
  closeGoal: "2-5 deals/month";
  departmentCommandMatrix: DepartmentCommandMatrixItem[];
  dealClosingWorkQueue: DealClosingWorkQueueItem[];
  architectureImprovementBacklog: ArchitectureImprovementItem[];
  workflowHandoffReadiness: WorkflowHandoffReadinessItem[];
  safetyFlags: {
    advisoryOnly: true;
    approvalRequired: true;
    providerCalled: false;
    liveExecutionAllowed: false;
    externalActionsBlocked: true;
    scrapingBlocked: true;
    outreachBlocked: true;
  };
};

export type ExecutiveDashboardReport = {
  ok: true;
  widgets: ExecutiveWidget[];
  dailyStartup: DailyCompanyOperatingSession;
  revenueCommandCenter: RevenueCommandCenterReport;
  executiveWorkforce: ExecutiveWorkforceReport;
  departmentIntelligence: DepartmentIntelligenceReport | null;
  dailyMission: DailyMission | null;
  connectorActivation: ConnectorActivationReport | null;
  morningBrief: ExecutiveMorningBrief;
  todayPriorities: ExecutiveWidget[];
  kpiInterpretations: Record<string, string>;
  businessIntelligence: BusinessIntelligenceReport;
  departmentHealth: DepartmentHealthCard[];
  operatingCompany: OperatingCompanyReport;
  trendCharts: TrendChart[];
  recommendedPriorities: string[];
  executiveRecommendations: ExecutiveLearningRecommendation[];
  dataGaps: string[];
  recentSystemActivity: Array<{
    label: string;
    detail: string;
    at: string;
  }>;
  safetyFlags: {
    readOnly: true;
    providerCalled: boolean;
    outreachSent: false;
    adsCreated: false;
    scrapingStarted: false;
    financeManualOnly: true;
    knowledgeManualOnly: true;
  };
};

function startOfToday() {
  const now = new Date();

  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function getTime(value?: Date | string | null) {
  if (!value) return 0;

  const time = new Date(value).getTime();

  return Number.isNaN(time) ? 0 : time;
}

function isFollowUpDue(lead: StoredLead) {
  const nextFollowUpAt = getTime(lead.nextFollowUpAt);

  return nextFollowUpAt > 0 && nextFollowUpAt <= Date.now() && !lead.doNotContact && lead.status !== "closed";
}

function hasText(value: string | null | undefined) {
  return Boolean(value?.trim());
}

function getMissingInfoCount(leads: StoredLead[]) {
  return leads.filter(
    (lead) =>
      !hasText(lead.source) ||
      !hasText(lead.propertyAddress) ||
      (!hasText(lead.phone) && !hasText(lead.email)) ||
      (!hasText(lead.situationDetails) && !hasText(lead.lastSellerReply)),
  ).length;
}

function getOfferReadyCount(leads: StoredLead[]) {
  return leads.filter((lead) => {
    if (lead.doNotContact || lead.approvalStatus === "rejected") return false;

    const hasAnalyzer = hasText(lead.analyzer?.arv) && hasText(lead.analyzer?.estimatedRepairs);

    return hasAnalyzer || lead.status === "negotiating" || lead.status === "under_contract" || lead.priority === "High";
  }).length;
}

function getWidgetStatus(count: number, goodWhenPositive = false): ExecutiveWidget["status"] {
  if (count === 0) return goodWhenPositive ? "missing" : "good";
  if (count >= 5) return "urgent";
  return "watch";
}

function statusForBlockedCount(count: number): ExecutiveWidget["status"] {
  if (count === 0) return "good";
  if (count >= 5) return "urgent";

  return "watch";
}

function statusForOpportunityCount(count: number): ExecutiveWidget["status"] {
  if (count === 0) return "missing";
  if (count >= 3) return "good";

  return "watch";
}

function createCommandItem(input: Omit<RevenueCommandCenterItem, "sourceLabel" | "assumption"> & {
  sourceLabel?: string;
  assumption?: string;
}): RevenueCommandCenterItem {
  return {
    ...input,
    sourceLabel: input.sourceLabel ?? "existing_ai_os_records",
    assumption: input.assumption ?? "Advisory-only summary from existing stored records; verify before action.",
  };
}

async function getRecentSystemActivity() {
  const [jobs, memory] = await Promise.all([
    prisma.aiJob.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.aiMemoryEvent.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  ]);

  return [
    ...jobs.map((job) => ({
      label: `AI job ${job.status}`,
      detail: job.errorMessage || "AI job activity recorded.",
      at: job.createdAt.toISOString(),
    })),
    ...memory.map((event) => ({
      label: event.eventType,
      detail: `Source: ${event.source}`,
      at: event.createdAt.toISOString(),
    })),
  ]
    .sort((a, b) => getTime(b.at) - getTime(a.at))
    .slice(0, 5);
}

async function loadExecutiveLearningMemoryEvents(): Promise<ExecutiveLearningMemoryEvent[]> {
  const start = new Date();
  start.setDate(start.getDate() - 90);

  return prisma.aiMemoryEvent.findMany({
    where: {
      createdAt: {
        gte: start,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 500,
    select: {
      eventType: true,
      source: true,
      approvalDecision: true,
      outcome: true,
      metadata: true,
      createdAt: true,
    },
  });
}

export function createExecutiveRecommendations(input: {
  followUpsDue: number;
  missingInfoCount: number;
  offerReadyCount: number;
  marketingAwaitingApproval: number;
  canvaAwaitingDesign: number;
  financeGapCount: number;
  providerMissingCount: number;
}) {
  const recommendations = [
    input.followUpsDue > 0 ? "Review due follow-ups first; do not trigger automated outreach." : "",
    input.missingInfoCount > 0 ? "Clean up missing seller/property information before lower-priority work." : "",
    input.offerReadyCount > 0 ? "Open offer-ready opportunities and verify assumptions manually." : "",
    input.marketingAwaitingApproval > 0 ? "Review marketing drafts awaiting approval before publishing manually." : "",
    input.canvaAwaitingDesign > 0 ? "Prepare Canva briefs manually; no design export or posting is automated." : "",
    input.financeGapCount > 0 ? "Add manual finance entries so CPL, CPA, and profit metrics become useful." : "",
    input.providerMissingCount > 0 ? "Finish missing lead-enrichment credentials before live adapter planning." : "",
  ].filter(Boolean);

  return recommendations.length > 0 ? recommendations : ["Monitor new leads, keep source tracking clean, and maintain manual review discipline."];
}

function createKpiInterpretations(report: BusinessIntelligenceReport) {
  return Object.fromEntries(
    report.kpis.map((kpi) => {
      if (kpi.id === "lead_conversion_rate" && kpi.value === "0%") {
        return [kpi.id, "Need first closed deal."];
      }

      if ((kpi.id === "cost_per_lead" || kpi.id === "cost_per_acquisition") && kpi.status === "missing") {
        return [kpi.id, "Manual finance entries needed."];
      }

      if ((kpi.id === "lead_to_offer_time" || kpi.id === "offer_to_close_time") && kpi.status === "missing") {
        return [kpi.id, "Transition timestamps not stored yet."];
      }

      if (kpi.id === "follow_up_completion" && kpi.status === "missing") {
        return [kpi.id, "No stored follow-up task history yet."];
      }

      if (kpi.status === "good") {
        return [kpi.id, "Current stored data supports this metric."];
      }

      if (kpi.status === "watch") {
        return [kpi.id, "Review manually before changing priorities."];
      }

      return [kpi.id, "More complete records will improve this metric."];
    }),
  );
}

function createMorningBrief({
  widgets,
  executiveRecommendations,
  followUpsDue,
  offerReadyCount,
  financeGapCount,
  marketingAwaitingApproval,
}: {
  widgets: ExecutiveWidget[];
  executiveRecommendations: ExecutiveLearningRecommendation[];
  followUpsDue: number;
  offerReadyCount: number;
  financeGapCount: number;
  marketingAwaitingApproval: number;
}): ExecutiveMorningBrief {
  const priorityIds = ["follow_ups_due", "offer_ready", "finance_kpis", "marketing_approval", "website_seo"];
  const keySignals = priorityIds
    .map((id) => widgets.find((widget) => widget.id === id))
    .filter((widget): widget is ExecutiveWidget => Boolean(widget))
    .map(({ id, label, value, detail, status }) => ({ id, label, value, detail, status }));
  const recommendedWorkOrder = [
    followUpsDue > 0 ? "Review due follow-ups manually." : "",
    offerReadyCount > 0 ? "Verify offer-ready assumptions." : "",
    financeGapCount > 0 ? "Add missing manual finance records." : "",
    marketingAwaitingApproval > 0 ? "Review marketing approvals manually." : "",
    "Scan system health and data gaps.",
  ].filter(Boolean);
  const memory = executiveRecommendations[0] ?? null;

  return {
    greeting: "Good morning Moses.",
    summary: `${followUpsDue} follow-up(s), ${offerReadyCount} offer-ready lead(s), ${financeGapCount} finance gap(s), and ${marketingAwaitingApproval} marketing approval(s) need manual review context.`,
    keySignals,
    recommendedWorkOrder,
    memoryInsight: memory
      ? {
          title: memory.title,
          summary: memory.summary,
          confidenceLabel: memory.confidenceLabel,
          confidenceScore: memory.confidenceScore,
          sampleWindowDays: memory.sampleWindowDays,
        }
      : null,
    safetyBadges: ["providerCalled:false", "outreachSent:false", "manualReviewOnly:true"],
  };
}

function projectLiveMorningBrief(input: {
  liveBrief: Awaited<ReturnType<typeof getLatestLiveMorningBrief>>;
  fallback: ExecutiveMorningBrief;
}): ExecutiveMorningBrief {
  const { liveBrief, fallback } = input;

  return {
    greeting: `${liveBrief.greeting}.`,
    summary: liveBrief.overnightSummary.join(" "),
    keySignals: [
      ...fallback.keySignals,
      {
        id: "live_business_data",
        label: "Live business data",
        value: liveBrief.providerCalled ? "Connected" : "Needs setup",
        detail: liveBrief.dataGaps.length > 0 ? `${liveBrief.dataGaps.length} read-only data gap(s) need review.` : "Read-only business snapshots are current.",
        status: (liveBrief.dataGaps.length > 0 ? "watch" : "good") as ExecutiveWidget["status"],
      },
    ].slice(0, 6),
    recommendedWorkOrder: liveBrief.todayPriorities.length > 0 ? liveBrief.todayPriorities : fallback.recommendedWorkOrder,
    memoryInsight: fallback.memoryInsight,
    safetyBadges: [
      "readOnly:true",
      `providerCalled:${liveBrief.providerCalled}`,
      "liveExecutionAllowed:false",
      "writesBlocked:true",
    ],
  };
}

export function createRevenueCommandCenter({
  newLeadsToday,
  qualifiedLeads,
  followUpsDue,
  offerReadyCount,
  missingInfoCount,
  marketingAwaitingApproval,
  canvaAwaitingDesign,
  readyForManualPublish,
  manuallyPublished,
  providerMissingCount,
  revenuePipeline,
  financeKpis,
  businessIntelligence,
  referralSummary,
  websiteSeoReady,
  activeKnowledgeItems,
}: {
  newLeadsToday: number;
  qualifiedLeads: number;
  followUpsDue: number;
  offerReadyCount: number;
  missingInfoCount: number;
  marketingAwaitingApproval: number;
  canvaAwaitingDesign: number;
  readyForManualPublish: number;
  manuallyPublished: number;
  providerMissingCount: number;
  revenuePipeline: ReturnType<typeof getRevenuePipelineSummary>;
  financeKpis: ReturnType<typeof calculateFinanceKpis>;
  businessIntelligence: BusinessIntelligenceReport;
  referralSummary: Awaited<ReturnType<typeof getReferralDashboard>>["summary"] | null;
  websiteSeoReady: boolean;
  activeKnowledgeItems: number;
}): RevenueCommandCenterReport {
  const topChannel = businessIntelligence.summary.topChannel;
  const keywordOpportunityCount = websiteSeoReady ? Math.max(1, activeKnowledgeItems === 0 ? 2 : 1) : 3;
  const contentGapCount = marketingAwaitingApproval === 0 && activeKnowledgeItems < 3 ? 2 : Math.max(0, 3 - marketingAwaitingApproval);
  const sourceLabel = topChannel?.source ?? "manual_source_tracking";
  const nextBestActions = [
    followUpsDue > 0 ? "Review due follow-ups before lower-value dashboard work; no outreach is sent by the system." : "",
    offerReadyCount > 0 ? "Verify offer-ready assumptions and decide whether a CEO-approved offer package is needed." : "",
    marketingAwaitingApproval > 0 ? "Approve or revise seller-education drafts that can create authority and future lead flow." : "",
    canvaAwaitingDesign > 0 ? "Review design briefs for manual Canva/Adobe work; no export or provider call is allowed." : "",
    topChannel ? `Double down manually on ${topChannel.source} because it currently has ${topChannel.qualifiedLeads} qualified lead(s).` : "",
    providerMissingCount > 0 ? "Clear provider readiness blockers only where they unlock qualified lead generation or attribution." : "",
  ].filter(Boolean);

  return {
    title: "Revenue Command Center",
    summary:
      "Daily CEO command view focused on qualified seller leads, approval bottlenecks, offer readiness, source attribution, authority-building content, and governed execution readiness.",
    executiveSummary:
      `${newLeadsToday} new lead(s), ${qualifiedLeads} qualified lead(s), ${offerReadyCount} offer-ready lead(s), ` +
      `${marketingAwaitingApproval + canvaAwaitingDesign} marketing/design approval item(s), and ${followUpsDue} follow-up(s) need CEO review context.`,
    sections: [
      {
        id: "revenue",
        title: "Revenue",
        summary: "Seller-lead and pipeline signals that can move deals forward after human review.",
        items: [
          createCommandItem({
            id: "new_leads",
            label: "New leads",
            value: newLeadsToday,
            detail: "Leads created today from stored CRM records.",
            href: "/dashboard/leads",
            status: statusForOpportunityCount(newLeadsToday),
            sourceLabel: "crm_lead_timestamp",
          }),
          createCommandItem({
            id: "qualified_leads",
            label: "Qualified leads",
            value: qualifiedLeads,
            detail: "Priority, score, negotiation, contract, or closed signals from existing lead records.",
            href: "/dashboard/leads",
            status: statusForOpportunityCount(qualifiedLeads),
            sourceLabel: "lead_quality_signals",
          }),
          createCommandItem({
            id: "offers_ready",
            label: "Offers ready",
            value: offerReadyCount,
            detail: "Analyzer, negotiation, high-priority, or buyer-ready signals require manual verification.",
            href: "/dashboard/acquisitions",
            status: statusForOpportunityCount(offerReadyCount),
            sourceLabel: "revenue_pipeline",
          }),
          createCommandItem({
            id: "pipeline_value",
            label: "Pipeline value",
            value: revenuePipeline.estimatedPipelineValueLabel,
            detail: `${revenuePipeline.actionableLeads} actionable lead(s), ${revenuePipeline.closingBlockedLeads} closing-blocked lead(s).`,
            href: "/dashboard/finance",
            status: revenuePipeline.actionableLeads > 0 ? "watch" : "missing",
            sourceLabel: "revenue_pipeline_estimate",
            assumption: "Pipeline value is assumption-based and depends on completed analyzer value fields.",
          }),
        ],
      },
      {
        id: "marketing",
        title: "Marketing",
        summary: "Draft and design work that can build local authority after approval.",
        items: [
          createCommandItem({
            id: "campaigns_waiting_approval",
            label: "Campaigns waiting approval",
            value: marketingAwaitingApproval,
            detail: "Marketing drafts awaiting manual approval; publishing remains blocked.",
            href: "/dashboard/marketing",
            status: statusForBlockedCount(marketingAwaitingApproval),
            sourceLabel: "marketing_drafts",
          }),
          createCommandItem({
            id: "design_briefs_waiting_review",
            label: "Design briefs waiting review",
            value: canvaAwaitingDesign,
            detail: "Manual Canva/Adobe-style review queue; no exports or provider calls.",
            href: "/dashboard/marketing",
            status: statusForBlockedCount(canvaAwaitingDesign),
            sourceLabel: "canva_asset_assists",
          }),
          createCommandItem({
            id: "publish_queue",
            label: "Manual publish queue",
            value: readyForManualPublish,
            detail: "Approved draft assists ready for human-managed platform posting outside the app.",
            href: "/dashboard/marketing",
            status: statusForOpportunityCount(readyForManualPublish),
            sourceLabel: "marketing_publish_assists",
          }),
          createCommandItem({
            id: "weekly_publishing_progress",
            label: "Published manually",
            value: manuallyPublished,
            detail: "Manual publication records only; the system did not publish.",
            href: "/dashboard/marketing",
            status: manuallyPublished > 0 ? "good" : "missing",
            sourceLabel: "manual_publish_records",
          }),
        ],
      },
      {
        id: "seo",
        title: "SEO",
        summary: "Manual/read-only authority opportunities for seller education content.",
        items: [
          createCommandItem({
            id: "keyword_opportunities",
            label: "Keyword opportunities",
            value: keywordOpportunityCount,
            detail: "Manual SEO opportunities should prioritize motivated seller education and service-area authority.",
            href: "/dashboard/research",
            status: "watch",
            sourceLabel: "manual_seo_planning",
            assumption: "No Search Console or competitor scraping was performed; this is a planning signal.",
          }),
          createCommandItem({
            id: "content_gaps",
            label: "Content gaps",
            value: contentGapCount,
            detail: "Content gaps should become draft campaign briefs before any public use.",
            href: "/dashboard/knowledge",
            status: contentGapCount > 0 ? "watch" : "good",
            sourceLabel: "knowledge_and_marketing_gap_review",
          }),
          createCommandItem({
            id: "search_console_alerts",
            label: "Search Console alerts",
            value: "Manual",
            detail: "Search Console is not connected; review manually before adding read-only integrations.",
            href: "/dashboard/production-readiness",
            status: websiteSeoReady ? "watch" : "urgent",
            sourceLabel: "provider_readiness",
          }),
        ],
      },
      {
        id: "lead_intelligence",
        title: "Lead Intelligence",
        summary: "Attribution and follow-up signals that protect time and deal quality.",
        items: [
          createCommandItem({
            id: "follow_ups_due",
            label: "Follow-ups due",
            value: followUpsDue,
            detail: "Manual follow-up review only; no reminders, messages, calls, or emails are sent.",
            href: "/dashboard/leads",
            status: statusForBlockedCount(followUpsDue),
            sourceLabel: "lead_next_follow_up_at",
          }),
          createCommandItem({
            id: "missing_information",
            label: "Missing information",
            value: missingInfoCount,
            detail: "Missing source, property, contact, seller context, or reply details.",
            href: "/dashboard/properties",
            status: statusForBlockedCount(missingInfoCount),
            sourceLabel: "lead_record_completeness",
          }),
          createCommandItem({
            id: "source_attribution",
            label: "Top source",
            value: sourceLabel,
            detail: topChannel
              ? `${topChannel.qualifiedLeads} qualified / ${topChannel.totalLeads} total lead(s), ${topChannel.qualifiedShare}% qualified share.`
              : "No qualified source trend is available yet.",
            href: "/dashboard/referrals",
            status: topChannel ? "good" : "missing",
            sourceLabel,
          }),
          createCommandItem({
            id: "highest_value_opportunities",
            label: "Highest-value opportunities",
            value: revenuePipeline.workFirstLeads.length,
            detail: "Work-first leads are ranked for manual review and never grant outreach execution.",
            href: "/dashboard/revenue",
            status: statusForOpportunityCount(revenuePipeline.workFirstLeads.length),
            sourceLabel: "revenue_pipeline_work_first",
          }),
        ],
      },
      {
        id: "business_health",
        title: "Business Health",
        summary: "Operating health signals that affect speed, confidence, and revenue reliability.",
        items: [
          createCommandItem({
            id: "cash_flow",
            label: "Cash flow",
            value: formatFinanceDollars(financeKpis.cashFlowCents),
            detail: financeKpis.missingData.length > 0 ? financeKpis.missingData[0] : "Manual finance records support this KPI.",
            href: "/dashboard/finance",
            status: financeKpis.missingData.length > 0 ? "missing" : "good",
            sourceLabel: "manual_finance_entries",
          }),
          createCommandItem({
            id: "provider_readiness",
            label: "Provider blockers",
            value: providerMissingCount,
            detail: "Provider setup is readiness-only and does not activate connectors.",
            href: "/dashboard/production-readiness",
            status: statusForBlockedCount(providerMissingCount),
            sourceLabel: "provider_readiness_report",
          }),
          createCommandItem({
            id: "referral_traffic",
            label: "Referral traffic",
            value: referralSummary?.clickCount ?? 0,
            detail: referralSummary
              ? `${referralSummary.leadCount} referral lead(s), ${referralSummary.referralToLeadConversion}% referral-to-lead conversion.`
              : "Referral dashboard data is unavailable.",
            href: "/dashboard/referrals",
            status: statusForOpportunityCount(referralSummary?.leadCount ?? 0),
            sourceLabel: "referral_dashboard",
          }),
        ],
      },
      {
        id: "approval_priorities",
        title: "Approval Priorities",
        summary: "CEO review queue for actions that can create revenue while preserving governance.",
        items: [
          createCommandItem({
            id: "approve_revenue_work",
            label: "Revenue work",
            value: followUpsDue + offerReadyCount,
            detail: "Review follow-ups and offer-ready leads before lower-ROI work.",
            href: "/dashboard/approvals",
            status: statusForBlockedCount(followUpsDue + offerReadyCount),
            sourceLabel: "executive_revenue_priorities",
          }),
          createCommandItem({
            id: "approve_campaigns",
            label: "Campaign/design approvals",
            value: marketingAwaitingApproval + canvaAwaitingDesign,
            detail: "Approve, revise, or reject authority-building content and design briefs.",
            href: "/dashboard/approvals",
            status: statusForBlockedCount(marketingAwaitingApproval + canvaAwaitingDesign),
            sourceLabel: "marketing_approval_queue",
          }),
          createCommandItem({
            id: "approve_source_focus",
            label: "Source focus",
            value: topChannel?.source ?? "Needs data",
            detail: "Use source attribution to decide where the next approved campaign should focus.",
            href: "/dashboard/referrals",
            status: topChannel ? "watch" : "missing",
            sourceLabel,
          }),
        ],
      },
    ],
    highRoiDecisionFilter: [
      "Generates more qualified seller leads.",
      "Increases local authority or trust.",
      "Saves CEO/operator time.",
      "Improves follow-up speed or quality.",
      "Increases offer readiness or close probability.",
      "Improves attribution so winning channels get more attention.",
    ],
    nextBestActions: nextBestActions.length > 0 ? nextBestActions : ["Monitor new leads, source attribution, and approval queues before adding lower-ROI infrastructure."],
    safetyFlags: {
      advisoryOnly: true,
      providerCalled: false,
      liveExecutionAllowed: false,
      externalActionsBlocked: true,
      publishingBlocked: true,
      outreachBlocked: true,
      scrapingBlocked: true,
      adsBlocked: true,
      humanApprovalRequired: true,
    },
  };
}

function statusForScore(score: number): ExecutiveWidget["status"] {
  if (score >= 80) return "good";
  if (score >= 55) return "watch";
  if (score > 0) return "urgent";

  return "missing";
}

function createHealthCard(input: Omit<ExecutiveWorkforceHealthCard, "status">): ExecutiveWorkforceHealthCard {
  return {
    ...input,
    score: Math.max(0, Math.min(100, Math.round(input.score))),
    status: statusForScore(input.score),
  };
}

function roleForDepartment(department: AiDepartmentName): DepartmentCommandMatrixItem["operatingRole"] {
  if (department === "Executive AI") return "CEO brief, decision agenda, and final priority context.";
  if (department === "Revenue AI") return "Ranks the highest-value work for qualified seller lead conversion.";
  if (department === "Marketing AI") return "Creates seller-education campaign drafts for human approval.";
  if (department === "SEO AI") return "Finds local authority and content refresh opportunities.";
  if (department === "Design AI") return "Prepares manual creative briefs and visual concepts.";
  if (department === "Brand Intelligence AI") return "Protects trust, tone, and platform readiness before public use.";
  if (department === "Content Intelligence AI") return "Turns approved content and source signals into campaign briefs.";
  if (department === "Lead Intelligence AI") return "Checks source quality, missing data, scoring, and follow-up priority.";
  if (department === "Sales AI") return "Prepares human seller-call support and follow-up scripts.";
  if (department === "County Records AI") return "Reviews manually sourced public-record opportunity signals.";
  if (department === "Driving for Dollars AI") return "Organizes operator-observed property opportunities.";
  if (department === "Google Maps AI") return "Supports operator-assisted route and address review only.";
  if (department === "Government & Policy AI") return "Summarizes manually reviewed policy context and risk.";
  if (department === "News Intelligence AI") return "Converts manually reviewed news into business context.";
  if (department === "Market Research AI") return "Reviews local market, competitor, and demand assumptions.";
  if (department === "Knowledge AI") return "Maintains SOPs, source labels, and reusable company memory.";
  if (department === "Document Intelligence AI") return "Prepares document review notes and template guidance.";
  if (department === "Provider Readiness AI") return "Tracks connector gaps without activation.";
  if (department === "Operations AI") return "Coordinates blockers, handoffs, and work queues.";
  if (department === "Approval AI") return "Packages CEO decisions and approval evidence.";
  if (department === "Security & Governance AI") return "Blocks unauthorized execution and preserves audit boundaries.";

  return "Contributes advisory department output through the AI COO.";
}

function contributionForDepartment(department: AiDepartmentName): DepartmentCommandMatrixItem["dealContribution"] {
  if (["Marketing AI", "SEO AI", "Content Intelligence AI", "County Records AI", "Driving for Dollars AI", "Google Maps AI", "Market Research AI"].includes(department)) return "lead_flow";
  if (["Sales AI", "Lead Intelligence AI"].includes(department)) return "conversion";
  if (["Revenue AI"].includes(department)) return "deal_analysis";
  if (["Design AI", "Brand Intelligence AI", "Government & Policy AI", "News Intelligence AI"].includes(department)) return "trust";
  if (["Executive AI", "Knowledge AI", "Document Intelligence AI", "Provider Readiness AI", "Operations AI"].includes(department)) return "operations";

  return "governance";
}

function handoffForDepartment(department: AiDepartmentName): string {
  if (department === "Executive AI") return "CEO approval queue";
  if (department === "Revenue AI") return "Approval AI and Acquisitions review";
  if (department === "Lead Intelligence AI") return "Sales AI or Acquisitions after source cleanup";
  if (department === "Sales AI") return "Human operator call/follow-up review";
  if (department === "County Records AI") return "Lead Intelligence AI after source verification";
  if (department === "Driving for Dollars AI") return "Lead Intelligence AI after duplicate and provenance review";
  if (department === "Google Maps AI") return "Driving for Dollars AI with operator-reviewed address context";
  if (department === "Marketing AI") return "Brand Intelligence AI and Approval AI";
  if (department === "SEO AI") return "Content Intelligence AI and Marketing AI";
  if (department === "Design AI") return "Brand Intelligence AI";
  if (department === "Brand Intelligence AI") return "Approval AI for CEO final review";
  if (department === "Content Intelligence AI") return "Marketing AI and SEO AI";
  if (department === "Operations AI") return "Executive AI blocker summary";
  if (department === "Approval AI") return "CEO decision agenda";
  if (department === "Security & Governance AI") return "Blocked-action report and approval boundaries";

  return "Executive AI summary";
}

function blockerForDepartment(department: AiDepartmentName, providerMissingCount: number) {
  if (department === "Provider Readiness AI" && providerMissingCount > 0) return `${providerMissingCount} connector credential/readiness blocker(s).`;
  if (department === "Google Maps AI") return "Map automation and scanning are blocked; operator-assisted review only.";
  if (department === "County Records AI") return "Scraping and ingestion are blocked; manual source verification required.";
  if (department === "Driving for Dollars AI") return "Persistence/promote-to-lead requires CEO-approved implementation packet.";
  if (department === "Sales AI") return "Seller outreach remains off-platform and human-owned.";
  if (department === "Marketing AI" || department === "Design AI") return "Publishing/export remains manual and approval-gated.";

  return "No external execution authority; internal preparation only.";
}

const sourceBasis = {
  internalModularStandard: {
    category: "internal_standard",
    label: "J Capital Modular AI Business OS Standard",
    reference: "docs/architecture/modular-ai-business-os-standard.md",
    rationale: "Internal architecture doctrine requires AI Core, Business Modules, connector plug-ins, governance controls, and source tracking.",
  },
  internalConstitution: {
    category: "internal_standard",
    label: "Enterprise AI Governance Constitution",
    reference: "docs/architecture/enterprise-ai-governance-constitution.md",
    rationale: "Internal governance requires approval, provenance, Safe Auto Mode, auditability, and no fabricated property facts.",
  },
  internalApiGovernance: {
    category: "internal_standard",
    label: "API Governance",
    reference: "docs/architecture/api-governance.md",
    rationale: "Internal API conventions require truthful safety flags, safe errors, and no provider/outreach side effects from dashboard APIs.",
  },
  nextRouteHandlers: {
    category: "official_vendor_doc",
    label: "Next.js Route Handlers",
    reference: "https://nextjs.org/docs/app/building-your-application/routing/route-handlers",
    rationale: "API and dashboard surfaces should align with the framework's supported server routing and response conventions.",
  },
  owaspAsvs: {
    category: "open_standard",
    label: "OWASP ASVS",
    reference: "https://owasp.org/www-project-application-security-verification-standard/",
    rationale: "Security verification should be tied to recognized web application security requirements.",
  },
  oidcOauth: {
    category: "open_standard",
    label: "OAuth 2.0 / OpenID Connect",
    reference: "https://openid.net/specs/openid-connect-core-1_0.html",
    rationale: "Future enterprise identity should align with established authorization and identity specifications.",
  },
  wcag: {
    category: "open_standard",
    label: "WCAG 2.2",
    reference: "https://www.w3.org/TR/WCAG22/",
    rationale: "CEO and operator workflows should remain accessible, keyboard-friendly, readable, and mobile-first.",
  },
  openApi: {
    category: "open_standard",
    label: "OpenAPI Specification",
    reference: "https://spec.openapis.org/oas/latest.html",
    rationale: "Stable API contracts reduce drift as AI Core, Business Modules, and connectors expand.",
  },
  maintainedOssPattern: {
    category: "maintained_oss_pattern",
    label: "Maintained open-source workflow and policy patterns",
    reference: "Architecture pattern review, no code copied",
    rationale: "Well-maintained OSS projects can inform modular policy, testing, and orchestration structure without becoming copied implementation.",
  },
  bestPractice: {
    category: "best_practice",
    label: "Enterprise software delivery practice",
    reference: "Internal engineering judgment",
    rationale: "Incremental, reversible, tested changes reduce platform risk while preserving useful CEO workflows.",
  },
} satisfies Record<string, ArchitectureSourceBasis>;

const plannedSupportDepartments: DepartmentCommandMatrixItem[] = [
  ["Legal & Compliance AI", "Plans compliance, consent, contract, platform-policy, and claim-review workflows.", "Compliance review notes", "Approval AI and Security & Governance AI", "Planned department only; no legal advice, contract execution, or compliance clearance is granted.", "governance", "planned"],
  ["Customer Success AI", "Plans post-close, referral, review, and relationship-care workflows.", "Customer success playbook", "CRM and Marketing AI", "Future-ready only; no review requests or customer outreach are sent.", "conversion", "future_ready"],
  ["Data Engineering AI", "Plans durable data pipelines, data quality, lineage, and warehouse readiness.", "Data quality backlog", "Analytics AI and API Platform AI", "Planned only; no schema migration, ETL job, or data movement is authorized.", "operations", "planned"],
  ["API Platform AI", "Plans API contracts, versioning, response conventions, and OpenAPI readiness.", "API contract backlog", "Security & Governance AI", "Planned only; no public API expansion or connector runtime is authorized.", "operations", "planned"],
  ["IT Operations AI", "Plans environment, deployment, backup, recovery, and incident operations.", "Operations readiness notes", "Executive AI and Security & Governance AI", "Future-ready only; no infrastructure changes or secrets handling is authorized.", "operations", "future_ready"],
  ["Analytics AI", "Plans KPI definitions, reporting quality, attribution, and dashboard measurement.", "Analytics backlog", "Revenue AI and Knowledge AI", "Planned only; no tracking provider or analytics API is activated.", "deal_analysis", "planned"],
  ["Social Media AI", "Plans channel-specific content workflows and social proof review.", "Social content plan", "Marketing AI and Brand Intelligence AI", "Future-ready only; no posting, scheduling, replies, or API calls are authorized.", "lead_flow", "future_ready"],
  ["Video Production AI", "Plans educational video scripts, shot lists, repurposing, and publishing review.", "Video production brief", "Creative Studio and Marketing AI", "Future-ready only; no media generation, publishing, or platform upload is authorized.", "trust", "future_ready"],
  ["Website Development AI", "Plans website UX, conversion, accessibility, and technical SEO improvements.", "Website improvement backlog", "SEO AI and Brand Intelligence AI", "Planned only; no deployment or content publishing is authorized.", "lead_flow", "planned"],
  ["Support AI", "Plans internal support, issue triage, knowledge feedback, and operator help workflows.", "Support readiness notes", "Knowledge AI and Operations AI", "Future-ready only; no customer support messages or ticket automation are sent.", "operations", "future_ready"],
  ["Human Resources AI", "Plans future hiring, onboarding, role clarity, and workforce governance.", "HR future plan", "Executive AI", "Future department only; no HR decision, hiring action, or employee record processing is authorized.", "operations", "planned"],
].map(([department, operatingRole, currentOutput, nextHandoff, blocker, dealContribution, lifecycleStatus]) => ({
  department,
  operatingRole,
  currentOutput,
  nextHandoff,
  blocker,
  dealContribution: dealContribution as DepartmentCommandMatrixItem["dealContribution"],
  lifecycleStatus: lifecycleStatus as DepartmentLifecycleStatus,
  activeExecutionOwner: false,
  approvalRequired: true,
  providerCalled: false,
  liveExecutionAllowed: false,
  sourceLabel: "enterprise_department_gap_review",
  assumption: "Planned support departments are visibility and architecture planning only, not active execution agents.",
}));

export function createArchitectureImprovementBacklog(): ArchitectureImprovementItem[] {
  return [
    {
      id: "identity-rbac-foundation",
      title: "Enterprise identity, RBAC, and future SSO readiness",
      ownerDepartment: "Security & Governance AI",
      businessValue: "Lets the CEO delegate work safely by role, department, and data class without sharing one admin boundary.",
      risk: "high",
      readinessState: "ready_for_ceo_review",
      nextSafeAction: "Approve a design packet for User, Role, Permission, DepartmentMembership, and AgentPermission primitives; do not migrate auth yet.",
      ceoApprovalRequired: true,
      sourceBasis: [sourceBasis.internalConstitution, sourceBasis.owaspAsvs, sourceBasis.oidcOauth],
      providerCalled: false,
      liveExecutionAllowed: false,
      externalExecutionAllowed: false,
    },
    {
      id: "department-agent-permissions",
      title: "Department and agent permission policy service",
      ownerDepartment: "Executive AI",
      businessValue: "Prevents duplicate responsibilities and ensures specialist agents only use approved tools, knowledge packs, and handoffs.",
      risk: "high",
      readinessState: "planned",
      nextSafeAction: "Define permission checks around existing department registry and tool registry before adding new active agents.",
      ceoApprovalRequired: true,
      sourceBasis: [sourceBasis.internalModularStandard, sourceBasis.internalConstitution, sourceBasis.maintainedOssPattern],
      providerCalled: false,
      liveExecutionAllowed: false,
      externalExecutionAllowed: false,
    },
    {
      id: "workflow-observability",
      title: "Workflow handoff observability",
      ownerDepartment: "Operations AI",
      businessValue: "Gives the CEO and departments clear owner, blocker, evidence, approval, and recovery context for deal-moving work.",
      risk: "medium",
      readinessState: "in_progress",
      nextSafeAction: "Keep handoff readiness read-only until a separate WorkflowRun design is approved.",
      ceoApprovalRequired: true,
      sourceBasis: [sourceBasis.internalApiGovernance, sourceBasis.bestPractice],
      providerCalled: false,
      liveExecutionAllowed: false,
      externalExecutionAllowed: false,
    },
    {
      id: "knowledge-pack-governance",
      title: "Knowledge Pack governance",
      ownerDepartment: "Knowledge AI",
      businessValue: "Improves recommendation quality by making approved sources, freshness, owners, and allowed agents explicit.",
      risk: "medium",
      readinessState: "planned",
      nextSafeAction: "Add Knowledge Pack metadata design before allowing more agents to rely on generated recommendations.",
      ceoApprovalRequired: true,
      sourceBasis: [sourceBasis.internalConstitution, sourceBasis.internalModularStandard],
      providerCalled: false,
      liveExecutionAllowed: false,
      externalExecutionAllowed: false,
    },
    {
      id: "api-contract-standardization",
      title: "API contract standardization",
      ownerDepartment: "API Platform AI",
      businessValue: "Reduces API drift as AI Core, Real Estate Business Module, approvals, and connectors expand.",
      risk: "medium",
      readinessState: "planned",
      nextSafeAction: "Document internal response envelopes, correlation IDs, safety flags, and error shapes before OpenAPI generation.",
      ceoApprovalRequired: true,
      sourceBasis: [sourceBasis.internalApiGovernance, sourceBasis.nextRouteHandlers, sourceBasis.openApi],
      providerCalled: false,
      liveExecutionAllowed: false,
      externalExecutionAllowed: false,
    },
    {
      id: "audit-hardening",
      title: "Audit event taxonomy and retention hardening",
      ownerDepartment: "Security & Governance AI",
      businessValue: "Makes approvals, AI recommendations, connector decisions, and workflow blockers easier to trace and review.",
      risk: "high",
      readinessState: "ready_for_ceo_review",
      nextSafeAction: "Approve audit taxonomy and safe metadata rules before adding more durable automation.",
      ceoApprovalRequired: true,
      sourceBasis: [sourceBasis.internalConstitution, sourceBasis.owaspAsvs],
      providerCalled: false,
      liveExecutionAllowed: false,
      externalExecutionAllowed: false,
    },
    {
      id: "accessibility-quality-gate",
      title: "Accessibility and mobile command quality gate",
      ownerDepartment: "Website Development AI",
      businessValue: "Keeps CEO approval, lead review, and mobile command workflows usable under real operating pressure.",
      risk: "low",
      readinessState: "planned",
      nextSafeAction: "Add keyboard, focus, contrast, label, and mobile text-fit checks to dashboard acceptance criteria.",
      ceoApprovalRequired: true,
      sourceBasis: [sourceBasis.wcag, sourceBasis.bestPractice],
      providerCalled: false,
      liveExecutionAllowed: false,
      externalExecutionAllowed: false,
    },
  ];
}

function createHandoffReadinessForQueue(item: DealClosingWorkQueueItem): WorkflowHandoffReadinessItem {
  const nextDepartmentByItem: Record<string, string> = {
    hot_follow_up_review: "Lead Intelligence AI",
    offer_ready_review: "Approval AI",
    lead_cleanup_review: "Revenue AI",
    d4d_county_review: "Lead Intelligence AI",
    campaign_approval_review: "Brand Intelligence AI",
    operating_readiness_review: "Executive AI",
  };
  const evidenceByItem: Record<string, string[]> = {
    hot_follow_up_review: ["Lead source", "DNC/opt-out status", "approval status", "last seller context"],
    offer_ready_review: ["Analyzer fields", "source confidence", "seller motivation", "missing-data notes"],
    lead_cleanup_review: ["Source label", "property address", "contact context", "provenance note"],
    d4d_county_review: ["Operator observation", "manual source/provenance", "duplicate review", "human verification"],
    campaign_approval_review: ["Approved source material", "brand review", "CTA review", "manual publish owner"],
    operating_readiness_review: ["Readiness blocker", "business value", "risk note", "rollback expectation"],
  };

  return {
    id: `handoff-${item.id}`,
    workQueueItemId: item.id,
    currentOwner: item.ownerDepartment,
    nextDepartment: nextDepartmentByItem[item.id] ?? "Executive AI",
    blocker: item.safetyBoundary,
    evidenceRequired: evidenceByItem[item.id] ?? ["Source label", "assumption", "CEO review context"],
    approvalRequirement: "CEO approval can authorize internal preparation only; external execution requires a separate exact governed policy.",
    recoveryPath: "If evidence is missing or conflicting, return the item to Operations AI with a blocker note and no workflow execution.",
    providerCalled: false,
    liveExecutionAllowed: false,
    outreachBlocked: true,
    scrapingBlocked: true,
    workflowStarted: false,
  };
}

export function createOperatingCompanyReport({
  followUpsDue,
  offerReadyCount,
  missingInfoCount,
  marketingAwaitingApproval,
  canvaAwaitingDesign,
  providerMissingCount,
  financeGapCount,
  qualifiedLeads,
  newLeadsToday,
  revenuePipeline,
  websiteSeoReady,
  activeKnowledgeItems,
}: {
  followUpsDue: number;
  offerReadyCount: number;
  missingInfoCount: number;
  marketingAwaitingApproval: number;
  canvaAwaitingDesign: number;
  providerMissingCount: number;
  financeGapCount: number;
  qualifiedLeads: number;
  newLeadsToday: number;
  revenuePipeline: ReturnType<typeof getRevenuePipelineSummary>;
  websiteSeoReady: boolean;
  activeKnowledgeItems: number;
}): OperatingCompanyReport {
  const departmentCommandMatrix: DepartmentCommandMatrixItem[] = getCompanyDepartmentRegistry().map((department) => ({
    department: department.name,
    operatingRole: roleForDepartment(department.name),
    currentOutput: department.outputs.slice(0, 3).join(", "),
    nextHandoff: handoffForDepartment(department.name),
    blocker: blockerForDepartment(department.name, providerMissingCount),
    dealContribution: contributionForDepartment(department.name),
    lifecycleStatus: "active",
    activeExecutionOwner: true,
    approvalRequired: true,
    providerCalled: false,
    liveExecutionAllowed: false,
    sourceLabel: "company_department_registry",
    assumption: "Department role is advisory and routes through CEO-approved internal preparation only.",
  }));
  const dealClosingWorkQueue: DealClosingWorkQueueItem[] = [
    {
      id: "hot_follow_up_review",
      title: "Review due seller follow-ups",
      count: followUpsDue,
      ownerDepartment: "Sales AI",
      nextManualAction: "Open due follow-ups, verify DNC/approval state, then complete any outreach manually outside the app.",
      revenueImpact: followUpsDue > 0 ? "high" : "medium",
      safetyBoundary: "No SMS, email, call, schedule, or provider action is sent by the system.",
      href: "/dashboard/leads",
      status: statusForBlockedCount(followUpsDue),
      sourceLabel: "lead_next_follow_up_at",
      assumption: "Due follow-up counts come from stored CRM timestamps and require human verification.",
    },
    {
      id: "offer_ready_review",
      title: "Verify offer-ready opportunities",
      count: offerReadyCount,
      ownerDepartment: "Revenue AI",
      nextManualAction: "Review analyzer values, source confidence, seller context, and approval state before offer work.",
      revenueImpact: "high",
      safetyBoundary: "No offer is generated, sent, signed, or presented automatically.",
      href: "/dashboard/acquisitions",
      status: statusForOpportunityCount(offerReadyCount),
      sourceLabel: "revenue_pipeline_and_analyzer",
      assumption: "Offer readiness is an advisory signal from stored fields, not verified property value.",
    },
    {
      id: "lead_cleanup_review",
      title: "Clean missing lead/source data",
      count: missingInfoCount,
      ownerDepartment: "Lead Intelligence AI",
      nextManualAction: "Resolve missing source, address, seller context, contact, or provenance before lower-value work.",
      revenueImpact: missingInfoCount > 0 ? "high" : "medium",
      safetyBoundary: "No enrichment, skip tracing, merge, delete, reject, or routing automation is allowed.",
      href: "/dashboard/properties",
      status: statusForBlockedCount(missingInfoCount),
      sourceLabel: "lead_record_completeness",
      assumption: "Completeness checks are advisory and may miss context stored outside structured fields.",
    },
    {
      id: "d4d_county_review",
      title: "Build DFD and county candidate review",
      count: "Manual",
      ownerDepartment: "Driving for Dollars AI",
      nextManualAction: "Approve operator-assisted DFD persistence and county/manual source review before lead promotion.",
      revenueImpact: "high",
      safetyBoundary: "No map crawling, county scraping, Street View automation, or property fact inference.",
      href: "/dashboard/driving-for-dollars",
      status: "watch",
      sourceLabel: "manual_d4d_and_county_readiness",
      assumption: "DFD/county lead flow is planned but not currently a live automated acquisition channel.",
    },
    {
      id: "campaign_approval_review",
      title: "Approve trust-building campaigns",
      count: marketingAwaitingApproval + canvaAwaitingDesign,
      ownerDepartment: "Marketing AI",
      nextManualAction: "Approve, revise, or reject seller-education drafts and design briefs for manual publishing.",
      revenueImpact: marketingAwaitingApproval + canvaAwaitingDesign > 0 ? "medium" : "low",
      safetyBoundary: "No publishing, asset export, ad spend, email, or SMS execution occurs.",
      href: "/dashboard/marketing",
      status: statusForBlockedCount(marketingAwaitingApproval + canvaAwaitingDesign),
      sourceLabel: "marketing_workflow_and_design_briefs",
      assumption: "Marketing readiness measures draft volume, not live campaign performance.",
    },
    {
      id: "operating_readiness_review",
      title: "Close launch and measurement gaps",
      count: providerMissingCount + financeGapCount,
      ownerDepartment: "Operations AI",
      nextManualAction: "Clear only the readiness gaps that improve attribution, reporting, or qualified lead conversion.",
      revenueImpact: "medium",
      safetyBoundary: "Provider readiness does not activate connectors or authorize external actions.",
      href: "/dashboard/production-readiness",
      status: statusForBlockedCount(providerMissingCount + financeGapCount),
      sourceLabel: "provider_readiness_and_finance_kpis",
      assumption: "Provider and finance gaps are readiness blockers, not proof of operational failure.",
    },
  ];
  const workflowHandoffReadiness = dealClosingWorkQueue.map(createHandoffReadinessForQueue);
  const architectureImprovementBacklog = createArchitectureImprovementBacklog();

  return {
    summary:
      `${newLeadsToday} new lead(s), ${qualifiedLeads} qualified lead(s), ${revenuePipeline.actionableLeads} actionable pipeline item(s), and ${activeKnowledgeItems} knowledge item(s) are coordinated toward the 2-5 deals/month goal. ` +
      `${websiteSeoReady ? "Public SEO readiness is visible." : "Public SEO readiness needs review."}`,
    closeGoal: "2-5 deals/month",
    departmentCommandMatrix: [...departmentCommandMatrix, ...plannedSupportDepartments],
    dealClosingWorkQueue,
    architectureImprovementBacklog,
    workflowHandoffReadiness,
    safetyFlags: {
      advisoryOnly: true,
      approvalRequired: true,
      providerCalled: false,
      liveExecutionAllowed: false,
      externalActionsBlocked: true,
      scrapingBlocked: true,
      outreachBlocked: true,
    },
  };
}

export function createExecutiveWorkforceReport({
  newLeadsToday,
  qualifiedLeads,
  followUpsDue,
  offerReadyCount,
  missingInfoCount,
  marketingAwaitingApproval,
  canvaAwaitingDesign,
  providerMissingCount,
  websiteSeoReady,
  activeKnowledgeItems,
  revenuePipeline,
  financeKpis,
  businessIntelligence,
  brandHealth,
  contentIntelligence,
  companyOrchestrator,
}: {
  newLeadsToday: number;
  qualifiedLeads: number;
  followUpsDue: number;
  offerReadyCount: number;
  missingInfoCount: number;
  marketingAwaitingApproval: number;
  canvaAwaitingDesign: number;
  providerMissingCount: number;
  websiteSeoReady: boolean;
  activeKnowledgeItems: number;
  revenuePipeline: ReturnType<typeof getRevenuePipelineSummary>;
  financeKpis: ReturnType<typeof calculateFinanceKpis>;
  businessIntelligence: BusinessIntelligenceReport;
  brandHealth: MarketingPlatformRegistryReport;
  contentIntelligence: ContentIntelligenceReport;
  companyOrchestrator: CompanyOrchestratorReport;
}): ExecutiveWorkforceReport {
  const topChannel = businessIntelligence.summary.topChannel;
  const revenueScore = Math.min(100, qualifiedLeads * 12 + offerReadyCount * 15 + revenuePipeline.actionableLeads * 8 + newLeadsToday * 4);
  const marketingScore = Math.min(100, marketingAwaitingApproval * 10 + canvaAwaitingDesign * 8 + brandHealth.readyPlatformCount * 6);
  const leadScore = Math.max(0, Math.min(100, qualifiedLeads * 12 + (topChannel ? 20 : 0) - missingInfoCount * 4 - followUpsDue * 3));
  const operationsScore = Math.max(0, 85 - providerMissingCount * 7 - financeKpis.missingData.length * 8);

  return {
    healthCards: [
      createHealthCard({
        id: "revenue",
        label: "Revenue Health",
        score: revenueScore,
        detail: `${qualifiedLeads} qualified lead(s), ${offerReadyCount} offer-ready lead(s), ${revenuePipeline.actionableLeads} actionable pipeline item(s).`,
        sourceLabel: "revenue_pipeline_and_leads",
        assumption: "Revenue health is based on stored lead and pipeline signals, not closed revenue verification.",
      }),
      createHealthCard({
        id: "brand",
        label: "Brand Health",
        score: brandHealth.averageReadinessScore,
        detail: `${brandHealth.readyPlatformCount}/${brandHealth.platforms.length} platform(s) ready for manual use. ${brandHealth.nextManualAction}`,
        sourceLabel: "marketing_platform_registry",
        assumption: "Brand readiness is manual metadata and does not verify live public profiles.",
      }),
      createHealthCard({
        id: "marketing",
        label: "Marketing Health",
        score: marketingScore,
        detail: `${marketingAwaitingApproval} campaign approval item(s), ${canvaAwaitingDesign} design brief(s) waiting review.`,
        sourceLabel: "marketing_workflow",
        assumption: "Marketing health measures draft and approval readiness, not live publishing performance.",
      }),
      createHealthCard({
        id: "seo",
        label: "SEO Health",
        score: websiteSeoReady ? Math.min(100, 60 + activeKnowledgeItems * 8) : 35,
        detail: websiteSeoReady ? `${activeKnowledgeItems} active knowledge item(s) support authority planning.` : "Public URL or SEO readiness needs review.",
        sourceLabel: "public_site_and_knowledge",
        assumption: "SEO health is static/read-only and does not call Search Console.",
      }),
      createHealthCard({
        id: "content",
        label: "Content Health",
        score: contentIntelligence.topRecommendation.score,
        detail: contentIntelligence.topRecommendation.summary,
        sourceLabel: contentIntelligence.topRecommendation.sourceLabel,
        assumption: contentIntelligence.topRecommendation.assumption,
      }),
      createHealthCard({
        id: "lead",
        label: "Lead Health",
        score: leadScore,
        detail: `${followUpsDue} follow-up(s) due, ${missingInfoCount} record(s) missing important seller/source context.`,
        sourceLabel: "lead_intelligence_records",
        assumption: "Lead health is advisory and never sends follow-up automatically.",
      }),
      createHealthCard({
        id: "operations",
        label: "Operations Health",
        score: operationsScore,
        detail: `${providerMissingCount} provider readiness blocker(s), ${financeKpis.missingData.length} finance data gap(s).`,
        sourceLabel: "provider_readiness_and_finance",
        assumption: "Operations health measures readiness and data gaps, not live workflow execution.",
      }),
      createHealthCard({
        id: "security",
        label: "Security Health",
        score: providerMissingCount > 0 ? 72 : 88,
        detail: "Safe Auto Mode, approval-first governance, and provider execution boundaries remain active.",
        sourceLabel: "governance_safety_flags",
        assumption: "Security health reflects current governance posture, not a live penetration test.",
      }),
    ],
    brandHealth,
    contentIntelligence,
    companyOrchestrator,
    safetyFlags: {
      advisoryOnly: true,
      providerCalled: false,
      liveExecutionAllowed: false,
      publishingBlocked: true,
      scrapingBlocked: true,
      outreachBlocked: true,
      approvalRequired: true,
    },
  };
}

export async function createExecutiveDashboardReport(): Promise<ExecutiveDashboardReport> {
  const [leadsResult, marketingResult, financeEntriesResult, knowledgeItemsResult, memoryEventsResult, referralResult, activationResult, departmentIntelligenceResult, liveMorningBriefResult, businessSnapshotsResult, buyerDemandResult, dailyMissionResult, connectorActivationResult, systemHealth, recentSystemActivity] = await Promise.all([
    loadPartialData("Lead", listDbLeads, [] as StoredLead[]),
    loadPartialData("Marketing workflow", listMarketingWorkflow, null),
    loadPartialData("Finance", listFinanceEntries, []),
    loadPartialData("Knowledge", listKnowledgeItems, []),
    loadPartialData("AI memory", loadExecutiveLearningMemoryEvents, [] as ExecutiveLearningMemoryEvent[]),
    loadPartialData("Referral dashboard", getReferralDashboard, null),
    loadPartialData("Company activation", getCompanyActivationSnapshot, null),
    loadPartialData("Department Intelligence", getDepartmentIntelligenceReport, null),
    loadPartialData("Live Morning Brief", getLatestLiveMorningBrief, null),
    loadPartialData("Business snapshots", () => getLatestBusinessSnapshots(40), []),
    loadPartialData("Buyer demand", getBuyerDemandSignals, null),
    loadPartialData("Daily Mission", getDailyMission, null),
    loadPartialData("Connector activation", createConnectorActivationReport, null),
    getSystemHealth().catch(() => null),
    getRecentSystemActivity().catch(() => []),
  ]);
  const leads = leadsResult.data;
  const marketingDrafts = marketingResult.data?.drafts ?? [];
  const financeEntries = financeEntriesResult.data;
  const knowledgeItems = knowledgeItemsResult.data;
  const memoryEvents = memoryEventsResult.data;
  const referralSummary = referralResult.data?.summary ?? null;
  const departmentIntelligence = departmentIntelligenceResult.data;
  const liveMorningBrief = liveMorningBriefResult.data;
  const businessSnapshots = businessSnapshotsResult.data;
  const buyerDemandSignals = buyerDemandResult.data;
  const dailyMission = dailyMissionResult.data;
  const connectorActivation = connectorActivationResult.data;
  const today = startOfToday();
  const revenuePipeline = getRevenuePipelineSummary(leads);
  const providerReadiness = createProviderReadinessReport();
  const financeKpis = calculateFinanceKpis({ entries: financeEntries, leadCount: leads.length });
  const businessIntelligence = createBusinessIntelligenceReport({
    leads,
    financeEntries,
    marketingWorkflow: marketingResult.data,
    knowledgeItems,
  });
  const executiveRecommendations = createExecutiveLearningRecommendations({
    report: businessIntelligence,
    memoryEvents,
    knowledgeItems,
  });

  const newLeadsToday = leads.filter((lead) => getTime(lead.timestamp) >= today.getTime()).length;
  const followUpsDue = leads.filter(isFollowUpDue).length;
  const offerReadyCount = getOfferReadyCount(leads);
  const missingInfoCount = getMissingInfoCount(leads);
  const qualifiedLeads = businessIntelligence.summary.qualifiedLeads;
  const marketingAwaitingApproval = marketingDrafts.filter((draft) => draft.status === "pending_approval").length;
  const readyForManualPublish = marketingDrafts.filter((draft) => draft.status === "ready_for_manual_publish").length;
  const manuallyPublished = marketingDrafts.filter((draft) => draft.status === "manually_published").length;
  const canvaAwaitingDesign = marketingDrafts.reduce(
    (count, draft) =>
      count + draft.canvaAssetAssists.filter((assist) => assist.manualApprovalStatus === "pending_manual_asset_approval").length,
    0,
  );
  const providerMissingCount = providerReadiness.providers.filter((provider) => provider.status === "missing").length;
  const providerReadyCount = providerReadiness.providers.filter((provider) => provider.status !== "missing").length;
  const activeKnowledgeItems = knowledgeItems.filter((item) => item.status === "active").length;
  const websiteSeoReady = publicSiteUrl.startsWith("https://") && systemHealth?.database === "ok";
  const brandHealth = createMarketingPlatformRegistryReport();
  const contentIntelligence = createContentIntelligenceReport({
    marketingDrafts,
    knowledgeItems,
    businessIntelligence,
  });
  const activationSnapshot = activationResult.data;
  const activeDirectives = activationSnapshot?.directives.length ? activationSnapshot.directives : undefined;
  const primaryDirective = activeDirectives?.[0] ?? createInheritedPropertyCampaignDirective();
  const companyOrchestrator = runCompanyOrchestrator({
    directive: primaryDirective,
    opportunities: [],
  });
  const dailyStartup = startDailyCompanyOperatingSession({
    date: today.toISOString(),
    directives: activeDirectives,
    providerReadiness: {
      ready: providerReadyCount,
      missing: providerMissingCount,
    },
    activationState: activationSnapshot
      ? {
          assignments: activationSnapshot.assignments,
          draftQueueItems: activationSnapshot.draftQueueItems,
          latestDecision: activationSnapshot.latestDecision,
        }
      : undefined,
    engineeringProgress: [
      "Revenue Command Center is merged and production-ready.",
      "Executive Workforce and AI COO foundations are merged.",
      activationSnapshot
        ? "AI Company Activation persistence is connected for internal CEO decisions."
        : "Daily Startup is preparing the CEO review agenda without external execution.",
    ],
  });
  const ga4Snapshot = businessSnapshots.find((snapshot) => snapshot.connectorId === "google_analytics" && snapshot.category === "google_analytics_traffic");
  const ga4Metric = (key: string) => {
    const value = ga4Snapshot?.metrics[key];
    return typeof value === "number" && Number.isFinite(value) ? value : 0;
  };
  const ga4Sessions = ga4Metric("sessions");
  const ga4ActiveUsers = ga4Metric("activeUsers");
  const ga4PageViews = ga4Metric("pageViews");
  const ga4KeyEvents = ga4Metric("keyEvents") || ga4Metric("conversions");
  const ga4TopPages = ga4Metric("topPages");
  const ga4DataGap = ga4Snapshot?.dataGaps[0] ?? null;
  const gbpPerformanceSnapshot = businessSnapshots.find((snapshot) => snapshot.connectorId === "google_business_profile" && snapshot.category === "google_business_profile_performance");
  const gbpReviewsSnapshot = businessSnapshots.find((snapshot) => snapshot.connectorId === "google_business_profile" && snapshot.category === "google_business_profile_reviews");
  const gbpMetric = (snapshot: BusinessDataSnapshotRecord | undefined, key: string) => {
    const value = snapshot?.metrics[key];
    return typeof value === "number" && Number.isFinite(value) ? value : 0;
  };
  const gbpMetricSeries = gbpMetric(gbpPerformanceSnapshot, "metricSeries");
  const gbpCallClicks = gbpMetric(gbpPerformanceSnapshot, "callClicks");
  const gbpDirectionRequests = gbpMetric(gbpPerformanceSnapshot, "directionRequests");
  const gbpReviewCount = gbpMetric(gbpReviewsSnapshot, "reviews");
  const gbpDataGap = gbpPerformanceSnapshot?.dataGaps[0] ?? gbpReviewsSnapshot?.dataGaps[0] ?? null;
  const crossConnectorReport = (() => {
    const contracted = businessSnapshots.filter((snapshot) => snapshot.contractVersion === "business-data-snapshot-v1" && typeof snapshot.evidenceHash === "string" && snapshot.evidenceHash.length > 0);
    try {
      return contracted.length > 0 ? createCrossConnectorIntelligenceReport({ tenantId: contracted[0].tenantId, snapshots: contracted, generatedAt: today.toISOString() }) : null;
    } catch {
      return null;
    }
  })() as CrossConnectorIntelligenceReportV1 | null;
  const topCrossConnectorOpportunity = crossConnectorReport?.highestBusinessOpportunities[0] ?? null;
  const crossConnectorSignalCount = crossConnectorReport
    ? crossConnectorReport.foundUsSignals.length + crossConnectorReport.visitedPageSignals.length + crossConnectorReport.engagementSignals.length + crossConnectorReport.exitOrDropoffSignals.length + crossConnectorReport.localTrustSignals.length
    : 0;
  const crossConnectorCertification = (() => {
    try {
      return crossConnectorReport ? createCrossConnectorCertificationPacket({ tenantId: crossConnectorReport.tenantId, intelligence: crossConnectorReport, generatedAt: today.toISOString() }) : null;
    } catch {
      return null;
    }
  })() as CrossConnectorCertificationPacketV1 | null;
  const buyerDemandPrioritization = (() => {
    try {
      return crossConnectorCertification ? createBuyerDemandOpportunityPrioritization({ tenantId: crossConnectorCertification.tenantId, certification: crossConnectorCertification, buyerDemandSignals, generatedAt: today.toISOString() }) : null;
    } catch {
      return null;
    }
  })() as BuyerDemandOpportunityPrioritizationV1 | null;
  const topBuyerDemandPriority = buyerDemandPrioritization?.priorities[0] ?? null;
  const buyerDemandCertification = (() => {
    try {
      return buyerDemandPrioritization
        ? createBuyerDemandCertificationPacket({ tenantId: buyerDemandPrioritization.tenantId, prioritization: buyerDemandPrioritization, generatedAt: today.toISOString() })
        : createBuyerDemandCertificationPacket({
            tenantId: crossConnectorCertification?.tenantId ?? "default",
            prioritization: null,
            generatedAt: today.toISOString(),
            additionalDataGaps: [buyerDemandResult.gap, "Sprint 27 buyer-demand prioritization is not available."].filter(Boolean),
          });
    } catch {
      return null;
    }
  })() as BuyerDemandCertificationPacketV1 | null;
  const widgets: ExecutiveWidget[] = [
    {
        id: "new_leads_today",
        label: "New leads today",
        value: newLeadsToday,
        detail: "Stored leads created today.",
        href: "/dashboard/leads",
        status: getWidgetStatus(newLeadsToday, true),
      },
      {
        id: "follow_ups_due",
        label: "Follow-ups due",
        value: followUpsDue,
        detail: "Manual follow-up review only; no reminders or messages are created.",
        href: "/dashboard/leads",
        status: getWidgetStatus(followUpsDue),
      },
      {
        id: "offer_ready",
        label: "Offer-ready opportunities",
        value: offerReadyCount,
        detail: "Analyzer, negotiation, or high-priority signals require manual verification.",
        href: "/dashboard/acquisitions",
        status: getWidgetStatus(offerReadyCount, true),
      },
      {
        id: "missing_info",
        label: "Missing seller/property info",
        value: missingInfoCount,
        detail: "Missing source, property, contact, or seller context.",
        href: "/dashboard/properties",
        status: getWidgetStatus(missingInfoCount),
      },
      {
        id: "marketing_approval",
        label: "Marketing awaiting approval",
        value: marketingAwaitingApproval,
        detail: "Manual approval only; no publishing is authorized.",
        href: "/dashboard/marketing",
        status: getWidgetStatus(marketingAwaitingApproval),
      },
      {
        id: "canva_design",
        label: "Canva briefs awaiting design",
        value: canvaAwaitingDesign,
        detail: "Design briefs are manual; no Canva API export or posting is triggered.",
        href: "/dashboard/marketing",
        status: getWidgetStatus(canvaAwaitingDesign),
      },
      {
        id: "referral_growth",
        label: "Referral growth",
        value: referralSummary?.leadCount ?? 0,
        detail: referralSummary
          ? `${referralSummary.clickCount} safe referral click(s), ${referralSummary.referralToLeadConversion}% lead conversion.`
          : "Referral dashboard data is not available yet.",
        href: "/dashboard/referrals",
        status: getWidgetStatus(referralSummary?.leadCount ?? 0, true),
      },
      {
        id: "revenue_pipeline",
        label: "Revenue pipeline",
        value: revenuePipeline.estimatedPipelineValueLabel,
        detail: `${revenuePipeline.actionableLeads} actionable lead(s), ${revenuePipeline.closingBlockedLeads} closing-blocked.`,
        href: "/dashboard/finance",
        status: revenuePipeline.actionableLeads > 0 ? "watch" : "missing",
      },
      {
        id: "website_seo",
        label: "Website/SEO health",
        value: websiteSeoReady ? "Ready" : "Review",
        detail: `Public URL configured as ${publicSiteUrl}. SEO remains static/read-only in this check.`,
        href: "/dashboard/knowledge",
        status: websiteSeoReady ? "good" : "watch",
      },
      {
        id: "ga4_sessions",
        label: "GA4 sessions",
        value: ga4Snapshot ? ga4Sessions : "Missing",
        detail: ga4Snapshot ? `${ga4ActiveUsers} active user(s), ${ga4PageViews} page view(s). Read-only analytics evidence only.` : "GA4 governed evidence is not available yet.",
        href: "/dashboard/search-intelligence",
        status: ga4Snapshot ? (ga4DataGap ? "watch" : "good") : "missing",
      },
      {
        id: "ga4_top_pages",
        label: "GA4 top pages",
        value: ga4Snapshot ? ga4TopPages : "Missing",
        detail: ga4Snapshot ? "Top-page evidence is advisory and cannot publish, edit the website, or create tasks." : "Run governed read-only business sync after GA4 readiness is approved.",
        href: "/dashboard/search-intelligence",
        status: ga4TopPages > 0 ? "good" : ga4Snapshot ? "watch" : "missing",
      },
      {
        id: "ga4_key_events",
        label: "GA4 key-event readiness",
        value: ga4Snapshot ? ga4KeyEvents : "Missing",
        detail: ga4DataGap ?? "Key events are conversion-readiness context only, not proof of closed revenue.",
        href: "/dashboard/revenue",
        status: ga4Snapshot ? (ga4KeyEvents > 0 ? "watch" : "missing") : "missing",
      },
      {
        id: "gbp_local_visibility",
        label: "GBP local visibility",
        value: gbpPerformanceSnapshot ? gbpMetricSeries : "Missing",
        detail: gbpPerformanceSnapshot ? `${gbpCallClicks} call click(s), ${gbpDirectionRequests} direction request(s). Read-only local visibility context only.` : "GBP governed evidence is not available yet.",
        href: "/dashboard/search-intelligence",
        status: gbpPerformanceSnapshot ? (gbpDataGap ? "watch" : "good") : "missing",
      },
      {
        id: "gbp_reviews",
        label: "GBP review readiness",
        value: gbpReviewsSnapshot ? gbpReviewCount : "Missing",
        detail: gbpDataGap ?? "Review evidence is read-only context; replies and profile edits remain blocked.",
        href: "/dashboard/marketing",
        status: gbpReviewsSnapshot ? (gbpReviewCount > 0 ? "watch" : "missing") : "missing",
      },
      {
        id: "cross_connector_funnel",
        label: "Cross-connector funnel",
        value: crossConnectorReport ? crossConnectorSignalCount : "Missing",
        detail: crossConnectorReport ? "Found, visited, engagement, exit/drop-off, and local trust evidence assembled for review only." : "Cross-connector evidence is not ready yet.",
        href: "/dashboard/search-intelligence",
        status: crossConnectorReport ? (crossConnectorReport.dataGaps.length > 0 ? "watch" : "good") : "missing",
      },
      {
        id: "cross_connector_opportunity",
        label: "Top connector opportunity",
        value: topCrossConnectorOpportunity ? topCrossConnectorOpportunity.score : "Missing",
        detail: topCrossConnectorOpportunity?.title ?? "No cross-connector opportunity is ready for review yet.",
        href: "/dashboard/revenue",
        status: topCrossConnectorOpportunity ? (topCrossConnectorOpportunity.missingData.length > 0 ? "watch" : "good") : "missing",
      },
      {
        id: "cross_connector_gaps",
        label: "Connector story gaps",
        value: crossConnectorReport ? crossConnectorReport.dataGaps.length : "Missing",
        detail: crossConnectorReport?.dataGaps[0] ?? "Missing evidence remains a review gap, not permission to fetch or act.",
        href: "/dashboard/operations",
        status: crossConnectorReport ? (crossConnectorReport.dataGaps.length > 0 ? "watch" : "good") : "missing",
      },
      {
        id: "cross_connector_certification",
        label: "Connector certification",
        value: crossConnectorCertification?.certificationStatus ?? "Missing",
        detail: crossConnectorCertification ? `${crossConnectorCertification.evidenceHashCount} evidence hash(es), ${crossConnectorCertification.readinessFailures.length} readiness gap(s).` : "Sprint 26A certification is unavailable until cross-connector evidence is ready.",
        href: "/dashboard/search-intelligence",
        status: crossConnectorCertification ? (crossConnectorCertification.certificationStatus === "certified" ? "good" : "watch") : "missing",
      },
      {
        id: "buyer_demand_priority",
        label: "Buyer-demand priority",
        value: topBuyerDemandPriority ? topBuyerDemandPriority.score : "Missing",
        detail: topBuyerDemandPriority?.title ?? "Sprint 27 buyer-demand priority is unavailable until certification and internal demand evidence are ready.",
        href: "/dashboard/property-intelligence",
        status: topBuyerDemandPriority ? (topBuyerDemandPriority.missingBuyerDemandEvidence.length > 0 ? "watch" : "good") : "missing",
      },
      {
        id: "buyer_demand_gaps",
        label: "Buyer-demand gaps",
        value: buyerDemandPrioritization ? buyerDemandPrioritization.dataGaps.length : "Missing",
        detail: (buyerDemandPrioritization?.dataGaps[0] ?? buyerDemandResult.gap) || "Buyer-demand gaps are advisory review items only.",
        href: "/dashboard/operations",
        status: buyerDemandPrioritization ? (buyerDemandPrioritization.dataGaps.length > 0 ? "watch" : "good") : "missing",
      },
      {
        id: "buyer_demand_certification",
        label: "Buyer-demand certification",
        value: buyerDemandCertification?.certificationStatus ?? "Missing",
        detail: buyerDemandCertification ? `${buyerDemandCertification.priorityCount} review priorit(ies), ${buyerDemandCertification.readinessFailures.length} readiness gap(s).` : "Sprint 27A certification is unavailable until buyer-demand prioritization can be reviewed.",
        href: "/dashboard/property-intelligence",
        status: buyerDemandCertification ? (buyerDemandCertification.certificationStatus === "certified" ? "good" : buyerDemandCertification.certificationStatus === "partial" ? "watch" : "missing") : "missing",
      },
      {
        id: "buyer_demand_certified_top_opportunity",
        label: "Certified demand opportunity",
        value: buyerDemandCertification?.topPriority ? buyerDemandCertification.topPriority.score : "Missing",
        detail: buyerDemandCertification?.topPriority?.title ?? "No certified buyer-demand opportunity is ready for CEO review.",
        href: "/dashboard/revenue",
        status: buyerDemandCertification?.topPriority ? (buyerDemandCertification.certificationStatus === "certified" ? "good" : "watch") : "missing",
      },
      {
        id: "buyer_demand_manual_review",
        label: "Demand manual review",
        value: buyerDemandCertification?.recommendedManualReviewPosture ?? "Missing",
        detail: buyerDemandCertification?.ceoReviewNotes[0] ?? "Buyer-demand certification remains readiness-only and cannot execute actions.",
        href: "/dashboard/operations",
        status: buyerDemandCertification ? (buyerDemandCertification.certificationStatus === "blocked" ? "missing" : "watch") : "missing",
      },
      {
        id: "finance_kpis",
        label: "Cash flow",
        value: formatFinanceDollars(financeKpis.cashFlowCents),
        detail: financeKpis.missingData.length > 0 ? financeKpis.missingData[0] : "Manual finance KPI from entered records.",
        href: "/dashboard/finance",
        status: financeKpis.missingData.length > 0 ? "missing" : "good",
      },
      {
        id: "knowledge_base",
        label: "Active knowledge items",
        value: activeKnowledgeItems,
        detail: "SOPs, scripts, templates, prompts, Oklahoma guidance, and lessons learned.",
        href: "/dashboard/knowledge",
        status: activeKnowledgeItems > 0 ? "good" : "missing",
      },
    ];
  const recommendedPriorities = createExecutiveRecommendationsFromBi(businessIntelligence);
  const todayPriorityIds = new Set(["follow_ups_due", "revenue_pipeline", "offer_ready", "marketing_approval", "website_seo", "ga4_key_events", "gbp_local_visibility", "cross_connector_opportunity", "buyer_demand_priority", "buyer_demand_certification"]);
  const todayPriorities = widgets.filter((widget) => todayPriorityIds.has(widget.id));
  const kpiInterpretations = createKpiInterpretations(businessIntelligence);
  const localMorningBrief = createMorningBrief({
    widgets,
    executiveRecommendations,
    followUpsDue,
    offerReadyCount,
    financeGapCount: financeKpis.missingData.length,
    marketingAwaitingApproval,
  });
  const morningBrief = liveMorningBrief ? projectLiveMorningBrief({ liveBrief: liveMorningBrief, fallback: localMorningBrief }) : localMorningBrief;
  const revenueCommandCenter = createRevenueCommandCenter({
    newLeadsToday,
    qualifiedLeads,
    followUpsDue,
    offerReadyCount,
    missingInfoCount,
    marketingAwaitingApproval,
    canvaAwaitingDesign,
    readyForManualPublish,
    manuallyPublished,
    providerMissingCount,
    revenuePipeline,
    financeKpis,
    businessIntelligence,
    referralSummary,
    websiteSeoReady,
    activeKnowledgeItems,
  });
  const executiveWorkforce = createExecutiveWorkforceReport({
    newLeadsToday,
    qualifiedLeads,
    followUpsDue,
    offerReadyCount,
    missingInfoCount,
    marketingAwaitingApproval,
    canvaAwaitingDesign,
    providerMissingCount,
    websiteSeoReady,
    activeKnowledgeItems,
    revenuePipeline,
    financeKpis,
    businessIntelligence,
    brandHealth,
    contentIntelligence,
    companyOrchestrator,
  });
  const operatingCompany = createOperatingCompanyReport({
    followUpsDue,
    offerReadyCount,
    missingInfoCount,
    marketingAwaitingApproval,
    canvaAwaitingDesign,
    providerMissingCount,
    financeGapCount: financeKpis.missingData.length,
    qualifiedLeads,
    newLeadsToday,
    revenuePipeline,
    websiteSeoReady,
    activeKnowledgeItems,
  });

  return {
    ok: true,
    widgets,
    dailyStartup,
    dailyMission,
    connectorActivation,
    revenueCommandCenter,
    executiveWorkforce,
    departmentIntelligence,
    operatingCompany,
    morningBrief,
    todayPriorities,
    kpiInterpretations,
    businessIntelligence,
    departmentHealth: businessIntelligence.departmentHealth,
    trendCharts: businessIntelligence.trendCharts,
    recommendedPriorities,
    executiveRecommendations,
    dataGaps: [...new Set([
      leadsResult.gap,
      marketingResult.gap,
      financeEntriesResult.gap,
      knowledgeItemsResult.gap,
      memoryEventsResult.gap,
      ...businessIntelligence.dataGaps,
      departmentIntelligenceResult.gap,
      liveMorningBriefResult.gap,
      businessSnapshotsResult.gap,
      dailyMissionResult.gap,
      connectorActivationResult.gap,
      ...(dailyMission?.dataGaps ?? []),
      ...(connectorActivation?.dataGaps ?? []),
      ...(liveMorningBrief?.dataGaps ?? []),
      ...(ga4Snapshot?.dataGaps ?? []),
      ...(gbpPerformanceSnapshot?.dataGaps ?? []),
      ...(gbpReviewsSnapshot?.dataGaps ?? []),
      ...(crossConnectorReport?.dataGaps ?? ["Cross-connector intelligence is unavailable until contracted Search Console, GA4, and GBP evidence is present."]),
      ...(crossConnectorCertification?.readinessFailures ?? ["Sprint 26A cross-connector certification is not available."]),
      ...(buyerDemandPrioritization?.dataGaps ?? [buyerDemandResult.gap, "Sprint 27 buyer-demand prioritization is not available."]),
      ...(buyerDemandCertification?.readinessFailures ?? ["Sprint 27A buyer-demand certification is not available."]),
      ...(buyerDemandCertification?.missingBuyerDemandEvidence ?? []),
      ...financeKpis.missingData,
      providerMissingCount > 0 ? `${providerMissingCount} provider readiness credential set(s) are missing.` : "",
    ].filter(Boolean))],
    recentSystemActivity,
    safetyFlags: {
      readOnly: true,
      providerCalled: liveMorningBrief?.providerCalled ?? false,
      outreachSent: false,
      adsCreated: false,
      scrapingStarted: false,
      financeManualOnly: true,
      knowledgeManualOnly: true,
    },
  };
}
