import { createBusinessIntelligenceReport, type BusinessIntelligenceReport, type DepartmentHealthCard, type TrendChart } from "@/lib/business-intelligence";
import { loadPartialData } from "@/lib/api-response";
import { createInheritedPropertyCampaignDirective, runCompanyOrchestrator, startDailyCompanyOperatingSession, type CompanyOrchestratorReport, type DailyCompanyOperatingSession } from "@/lib/company-orchestrator";
import { createContentIntelligenceReport, type ContentIntelligenceReport } from "@/lib/content-intelligence";
import { createExecutiveLearningRecommendations, type ExecutiveLearningMemoryEvent, type ExecutiveLearningRecommendation } from "@/lib/executive-learning";
import { createExecutiveRecommendationsFromBi } from "@/lib/executive-recommendations";
import { listFinanceEntries, calculateFinanceKpis, formatFinanceDollars } from "@/lib/finance";
import { listKnowledgeItems } from "@/lib/knowledge";
import { listDbLeads } from "@/lib/leads-db";
import type { StoredLead } from "@/lib/leads-storage";
import { listMarketingWorkflow } from "@/lib/marketing-workflow";
import { createMarketingPlatformRegistryReport, type MarketingPlatformRegistryReport } from "@/lib/marketing-platform-registry";
import { createProviderReadinessReport } from "@/lib/provider-readiness";
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

export type ExecutiveDashboardReport = {
  ok: true;
  widgets: ExecutiveWidget[];
  dailyStartup: DailyCompanyOperatingSession;
  revenueCommandCenter: RevenueCommandCenterReport;
  executiveWorkforce: ExecutiveWorkforceReport;
  morningBrief: ExecutiveMorningBrief;
  todayPriorities: ExecutiveWidget[];
  kpiInterpretations: Record<string, string>;
  businessIntelligence: BusinessIntelligenceReport;
  departmentHealth: DepartmentHealthCard[];
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
    providerCalled: false;
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
  const [leadsResult, marketingResult, financeEntriesResult, knowledgeItemsResult, memoryEventsResult, referralResult, systemHealth, recentSystemActivity] = await Promise.all([
    loadPartialData("Lead", listDbLeads, [] as StoredLead[]),
    loadPartialData("Marketing workflow", listMarketingWorkflow, null),
    loadPartialData("Finance", listFinanceEntries, []),
    loadPartialData("Knowledge", listKnowledgeItems, []),
    loadPartialData("AI memory", loadExecutiveLearningMemoryEvents, [] as ExecutiveLearningMemoryEvent[]),
    loadPartialData("Referral dashboard", getReferralDashboard, null),
    getSystemHealth().catch(() => null),
    getRecentSystemActivity().catch(() => []),
  ]);
  const leads = leadsResult.data;
  const marketingDrafts = marketingResult.data?.drafts ?? [];
  const financeEntries = financeEntriesResult.data;
  const knowledgeItems = knowledgeItemsResult.data;
  const memoryEvents = memoryEventsResult.data;
  const referralSummary = referralResult.data?.summary ?? null;
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
  const companyOrchestrator = runCompanyOrchestrator({
    directive: createInheritedPropertyCampaignDirective(),
    opportunities: [],
  });
  const dailyStartup = startDailyCompanyOperatingSession({
    date: today.toISOString(),
    providerReadiness: {
      ready: providerReadyCount,
      missing: providerMissingCount,
    },
    engineeringProgress: [
      "Revenue Command Center is merged and production-ready.",
      "Executive Workforce and AI COO foundations are merged.",
      "Daily Startup is preparing the CEO review agenda without external execution.",
    ],
  });
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
  const todayPriorityIds = new Set(["follow_ups_due", "revenue_pipeline", "offer_ready", "marketing_approval", "website_seo"]);
  const todayPriorities = widgets.filter((widget) => todayPriorityIds.has(widget.id));
  const kpiInterpretations = createKpiInterpretations(businessIntelligence);
  const morningBrief = createMorningBrief({
    widgets,
    executiveRecommendations,
    followUpsDue,
    offerReadyCount,
    financeGapCount: financeKpis.missingData.length,
    marketingAwaitingApproval,
  });
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

  return {
    ok: true,
    widgets,
    dailyStartup,
    revenueCommandCenter,
    executiveWorkforce,
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
      ...financeKpis.missingData,
      providerMissingCount > 0 ? `${providerMissingCount} provider readiness credential set(s) are missing.` : "",
    ].filter(Boolean))],
    recentSystemActivity,
    safetyFlags: {
      readOnly: true,
      providerCalled: false,
      outreachSent: false,
      adsCreated: false,
      scrapingStarted: false,
      financeManualOnly: true,
      knowledgeManualOnly: true,
    },
  };
}
