import { createBusinessIntelligenceReport, type BusinessIntelligenceReport, type DepartmentHealthCard, type TrendChart } from "@/lib/business-intelligence";
import { loadPartialData } from "@/lib/api-response";
import { createExecutiveLearningRecommendations, type ExecutiveLearningMemoryEvent, type ExecutiveLearningRecommendation } from "@/lib/executive-learning";
import { createExecutiveRecommendationsFromBi } from "@/lib/executive-recommendations";
import { listFinanceEntries, calculateFinanceKpis, formatFinanceDollars } from "@/lib/finance";
import { listKnowledgeItems } from "@/lib/knowledge";
import { listDbLeads } from "@/lib/leads-db";
import type { StoredLead } from "@/lib/leads-storage";
import { listMarketingWorkflow } from "@/lib/marketing-workflow";
import { createProviderReadinessReport } from "@/lib/provider-readiness";
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

export type ExecutiveDashboardReport = {
  ok: true;
  widgets: ExecutiveWidget[];
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
    summary: `${followUpsDue} follow-up(s), ${offerReadyCount} offer-ready opportunity/opportunities, ${financeGapCount} finance gap(s), and ${marketingAwaitingApproval} marketing approval(s) need manual review context.`,
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

export async function createExecutiveDashboardReport(): Promise<ExecutiveDashboardReport> {
  const [leadsResult, marketingResult, financeEntriesResult, knowledgeItemsResult, memoryEventsResult, systemHealth, recentSystemActivity] = await Promise.all([
    loadPartialData("Lead", listDbLeads, [] as StoredLead[]),
    loadPartialData("Marketing workflow", listMarketingWorkflow, null),
    loadPartialData("Finance", listFinanceEntries, []),
    loadPartialData("Knowledge", listKnowledgeItems, []),
    loadPartialData("AI memory", loadExecutiveLearningMemoryEvents, [] as ExecutiveLearningMemoryEvent[]),
    getSystemHealth().catch(() => null),
    getRecentSystemActivity().catch(() => []),
  ]);
  const leads = leadsResult.data;
  const marketingDrafts = marketingResult.data?.drafts ?? [];
  const financeEntries = financeEntriesResult.data;
  const knowledgeItems = knowledgeItemsResult.data;
  const memoryEvents = memoryEventsResult.data;
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
  const marketingAwaitingApproval = marketingDrafts.filter((draft) => draft.status === "pending_approval").length;
  const canvaAwaitingDesign = marketingDrafts.reduce(
    (count, draft) =>
      count + draft.canvaAssetAssists.filter((assist) => assist.manualApprovalStatus === "pending_manual_asset_approval").length,
    0,
  );
  const providerMissingCount = providerReadiness.providers.filter((provider) => provider.status === "missing").length;
  const activeKnowledgeItems = knowledgeItems.filter((item) => item.status === "active").length;
  const websiteSeoReady = publicSiteUrl.startsWith("https://") && systemHealth?.database === "ok";
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

  return {
    ok: true,
    widgets,
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
