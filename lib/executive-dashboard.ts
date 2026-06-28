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

export type ExecutiveDashboardReport = {
  ok: true;
  widgets: ExecutiveWidget[];
  recommendedPriorities: string[];
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

export async function createExecutiveDashboardReport(): Promise<ExecutiveDashboardReport> {
  const [leads, marketing, financeEntries, knowledgeItems, systemHealth, recentSystemActivity] = await Promise.all([
    listDbLeads(),
    listMarketingWorkflow(),
    listFinanceEntries().catch(() => []),
    listKnowledgeItems().catch(() => []),
    getSystemHealth().catch(() => null),
    getRecentSystemActivity().catch(() => []),
  ]);
  const today = startOfToday();
  const revenuePipeline = getRevenuePipelineSummary(leads);
  const providerReadiness = createProviderReadinessReport();
  const financeKpis = calculateFinanceKpis({ entries: financeEntries, leadCount: leads.length });

  const newLeadsToday = leads.filter((lead) => getTime(lead.timestamp) >= today.getTime()).length;
  const followUpsDue = leads.filter(isFollowUpDue).length;
  const offerReadyCount = getOfferReadyCount(leads);
  const missingInfoCount = getMissingInfoCount(leads);
  const marketingAwaitingApproval = marketing.drafts.filter((draft) => draft.status === "pending_approval").length;
  const canvaAwaitingDesign = marketing.drafts.reduce(
    (count, draft) =>
      count + draft.canvaAssetAssists.filter((assist) => assist.manualApprovalStatus === "pending_manual_asset_approval").length,
    0,
  );
  const providerMissingCount = providerReadiness.providers.filter((provider) => provider.status === "missing").length;
  const financeGapCount = financeKpis.missingData.length;
  const activeKnowledgeItems = knowledgeItems.filter((item) => item.status === "active").length;
  const websiteSeoReady = publicSiteUrl.startsWith("https://") && systemHealth?.database === "ok";

  return {
    ok: true,
    widgets: [
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
    ],
    recommendedPriorities: createExecutiveRecommendations({
      followUpsDue,
      missingInfoCount,
      offerReadyCount,
      marketingAwaitingApproval,
      canvaAwaitingDesign,
      financeGapCount,
      providerMissingCount,
    }),
    dataGaps: [...financeKpis.missingData, providerMissingCount > 0 ? `${providerMissingCount} provider readiness credential set(s) are missing.` : ""].filter(Boolean),
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
