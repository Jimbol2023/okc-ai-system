import { calculateFinanceKpis, formatFinanceDollars, type FinanceEntryRecord } from "@/lib/finance";
import type { StoredLead } from "@/lib/leads-storage";
import { getRevenuePipelineSummary, type RevenuePipelineSummary } from "@/lib/revenue-pipeline";

export type MetricStatus = "good" | "watch" | "urgent" | "missing";

export type BusinessKpiCard = {
  id: string;
  label: string;
  value: string;
  detail: string;
  status: MetricStatus;
};

export type MarketingChannelPerformance = {
  source: string;
  totalLeads: number;
  qualifiedLeads: number;
  closedLeads: number;
  conversionRate: number;
  qualifiedShare: number;
};

export type DepartmentHealthCard = {
  id: string;
  department: string;
  score: number;
  status: MetricStatus;
  reason: string;
};

export type TrendPoint = {
  date: string;
  label: string;
  value: number;
};

export type TrendChart = {
  id: string;
  label: string;
  detail: string;
  unit: "count" | "currency";
  points: TrendPoint[];
};

export type BusinessIntelligenceReport = {
  kpis: BusinessKpiCard[];
  channelPerformance: MarketingChannelPerformance[];
  departmentHealth: DepartmentHealthCard[];
  trendCharts: TrendChart[];
  dataGaps: string[];
  safetyFlags: {
    advisoryOnly: true;
    providerCalled: false;
    outreachSent: false;
    crmMutated: false;
    schemaChanged: false;
  };
  summary: {
    totalLeads: number;
    qualifiedLeads: number;
    closedLeads: number;
    followUpsDue: number;
    offerReadyCount: number;
    marketingApprovalBacklog: number;
    financeGapCount: number;
    closingBlockedCount: number;
    topChannel: MarketingChannelPerformance | null;
  };
};

type MarketingWorkflowLike = {
  drafts?: Array<{
    status: string;
    canvaAssetAssists?: Array<{
      manualApprovalStatus: string;
    }>;
  }>;
};

type KnowledgeItemLike = {
  status: string;
};

function getTime(value?: Date | string | null) {
  if (!value) return 0;

  const time = new Date(value).getTime();

  return Number.isNaN(time) ? 0 : time;
}

function hasText(value: string | null | undefined) {
  return Boolean(value?.trim());
}

function getDateKey(value: Date | string) {
  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

function getLastThirtyDays(now = new Date()) {
  return Array.from({ length: 30 }, (_, index) => {
    const date = new Date(now);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (29 - index));

    const key = date.toISOString().slice(0, 10);

    return {
      date: key,
      label: `${date.getMonth() + 1}/${date.getDate()}`,
      value: 0,
    };
  });
}

function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

function percent(part: number, total: number) {
  if (total <= 0) return 0;

  return Math.round((part / total) * 100);
}

function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function isQualifiedLead(lead: StoredLead) {
  return lead.score >= 60 || lead.priority === "High" || lead.priority === "Medium" || lead.status === "negotiating" || lead.status === "under_contract" || lead.status === "closed";
}

function isFollowUpDue(lead: StoredLead) {
  const nextFollowUpAt = getTime(lead.nextFollowUpAt);

  return nextFollowUpAt > 0 && nextFollowUpAt <= Date.now() && !lead.doNotContact && lead.status !== "closed";
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

function getOfferReadyCount(revenuePipeline: RevenuePipelineSummary) {
  return revenuePipeline.buyerReadyLeads + revenuePipeline.nearContractLeads + revenuePipeline.underContractLeads;
}

function getFollowUpCompletion(leads: StoredLead[]) {
  const followUps = leads.flatMap((lead) => lead.followUps ?? []);
  const completed = followUps.filter((followUp) => followUp.status === "completed").length;

  return {
    completed,
    total: followUps.length,
    rate: percent(completed, followUps.length),
  };
}

function getChannelPerformance(leads: StoredLead[]): MarketingChannelPerformance[] {
  const totalQualified = leads.filter(isQualifiedLead).length;
  const channels = new Map<string, StoredLead[]>();

  leads.forEach((lead) => {
    const source = lead.source.trim() || "Unknown source";
    channels.set(source, [...(channels.get(source) ?? []), lead]);
  });

  return [...channels.entries()]
    .map(([source, sourceLeads]) => {
      const qualifiedLeads = sourceLeads.filter(isQualifiedLead).length;
      const closedLeads = sourceLeads.filter((lead) => lead.status === "closed").length;

      return {
        source,
        totalLeads: sourceLeads.length,
        qualifiedLeads,
        closedLeads,
        conversionRate: percent(closedLeads, sourceLeads.length),
        qualifiedShare: percent(qualifiedLeads, totalQualified),
      };
    })
    .sort((a, b) => b.qualifiedLeads - a.qualifiedLeads || b.totalLeads - a.totalLeads || a.source.localeCompare(b.source));
}

function getFinanceCashFlowForDay(entries: Array<Pick<FinanceEntryRecord, "entryType" | "amountCents" | "entryDate">>, date: string) {
  return entries
    .filter((entry) => getDateKey(entry.entryDate) === date)
    .reduce((total, entry) => {
      if (entry.entryType === "deal_revenue") return total + entry.amountCents;
      if (entry.entryType === "deal_expense" || entry.entryType === "marketing_spend") return total - entry.amountCents;

      return total;
    }, 0);
}

function getTrendCharts({
  leads,
  financeEntries,
  topChannel,
}: {
  leads: StoredLead[];
  financeEntries: Array<Pick<FinanceEntryRecord, "entryType" | "amountCents" | "entryDate">>;
  topChannel: MarketingChannelPerformance | null;
}): TrendChart[] {
  const days = getLastThirtyDays();

  return [
    {
      id: "lead_volume",
      label: "Lead volume",
      detail: "Stored leads by created date, last 30 days.",
      unit: "count",
      points: days.map((day) => ({
        ...day,
        value: leads.filter((lead) => getDateKey(lead.timestamp) === day.date).length,
      })),
    },
    {
      id: "qualified_leads",
      label: "Qualified leads",
      detail: "Priority, score, negotiation, contract, or closed signals by created date.",
      unit: "count",
      points: days.map((day) => ({
        ...day,
        value: leads.filter((lead) => getDateKey(lead.timestamp) === day.date && isQualifiedLead(lead)).length,
      })),
    },
    {
      id: "finance_cash_flow",
      label: "Cash flow",
      detail: "Manual finance entries by entry date; revenue positive, spend/expenses negative.",
      unit: "currency",
      points: days.map((day) => ({
        ...day,
        value: getFinanceCashFlowForDay(financeEntries, day.date),
      })),
    },
    {
      id: "top_channel_volume",
      label: topChannel ? `${topChannel.source} leads` : "Top channel leads",
      detail: "Lead volume for the current highest-qualified source.",
      unit: "count",
      points: days.map((day) => ({
        ...day,
        value: topChannel ? leads.filter((lead) => getDateKey(lead.timestamp) === day.date && (lead.source.trim() || "Unknown source") === topChannel.source).length : 0,
      })),
    },
  ];
}

function healthStatus(score: number): MetricStatus {
  if (score >= 80) return "good";
  if (score >= 60) return "watch";
  if (score > 0) return "urgent";

  return "missing";
}

function getDepartmentHealth(input: {
  leads: StoredLead[];
  revenuePipeline: RevenuePipelineSummary;
  financeGapCount: number;
  marketingApprovalBacklog: number;
  canvaBacklog: number;
  activeKnowledgeItems: number;
  missingInfoCount: number;
  followUpsDue: number;
}): DepartmentHealthCard[] {
  const totalLeads = input.leads.length;
  const scoreFromPressure = (pressure: number, base = 100) => clampScore(base - pressure);

  const departments = [
    {
      id: "executive",
      department: "Executive",
      score: scoreFromPressure(input.financeGapCount * 8 + input.missingInfoCount * 4 + input.followUpsDue * 5),
      reason: "Blends finance gaps, data quality, and due follow-up pressure.",
    },
    {
      id: "acquisitions",
      department: "Acquisitions",
      score: scoreFromPressure(input.revenuePipeline.missingValueReasons.length * 12 + input.revenuePipeline.blockedLeads * 4, totalLeads > 0 ? 88 : 0),
      reason: `${input.revenuePipeline.actionableLeads} actionable lead(s), ${input.revenuePipeline.missingValueReasons.length} value data gap type(s).`,
    },
    {
      id: "marketing",
      department: "Marketing",
      score: scoreFromPressure(input.marketingApprovalBacklog * 12 + input.canvaBacklog * 8, 84),
      reason: `${input.marketingApprovalBacklog} draft approval(s), ${input.canvaBacklog} Canva brief(s) awaiting manual review.`,
    },
    {
      id: "finance",
      department: "Finance",
      score: scoreFromPressure(input.financeGapCount * 18, input.financeGapCount === 0 ? 90 : 72),
      reason: input.financeGapCount === 0 ? "Manual finance KPI inputs are present." : `${input.financeGapCount} finance KPI data gap(s) remain.`,
    },
    {
      id: "operations",
      department: "Operations",
      score: scoreFromPressure(input.revenuePipeline.closingBlockedLeads * 18, input.revenuePipeline.underContractLeads > 0 ? 86 : 70),
      reason: `${input.revenuePipeline.underContractLeads} under-contract lead(s), ${input.revenuePipeline.closingBlockedLeads} closing-blocked.`,
    },
    {
      id: "knowledge",
      department: "Knowledge",
      score: input.activeKnowledgeItems > 0 ? 82 : 45,
      reason: input.activeKnowledgeItems > 0 ? `${input.activeKnowledgeItems} active knowledge item(s) available.` : "No active knowledge items are available yet.",
    },
    {
      id: "data_quality",
      department: "Data Quality",
      score: scoreFromPressure(input.missingInfoCount * 12, totalLeads > 0 ? 90 : 0),
      reason: `${input.missingInfoCount} lead(s) are missing source, property, contact, or seller context.`,
    },
  ];

  return departments.map((department) => ({
    ...department,
    score: clampScore(department.score),
    status: healthStatus(department.score),
  }));
}

export function createBusinessIntelligenceReport({
  leads,
  financeEntries,
  marketingWorkflow,
  knowledgeItems,
}: {
  leads: StoredLead[];
  financeEntries: Array<Pick<FinanceEntryRecord, "entryType" | "amountCents" | "dealReference" | "leadId" | "entryDate">>;
  marketingWorkflow: MarketingWorkflowLike | null;
  knowledgeItems: KnowledgeItemLike[];
}): BusinessIntelligenceReport {
  const revenuePipeline = getRevenuePipelineSummary(leads);
  const financeKpis = calculateFinanceKpis({ entries: financeEntries, leadCount: leads.length });
  const qualifiedLeads = leads.filter(isQualifiedLead).length;
  const closedLeads = leads.filter((lead) => lead.status === "closed").length;
  const leadConversionRate = percent(closedLeads, leads.length);
  const followUpCompletion = getFollowUpCompletion(leads);
  const followUpsDue = leads.filter(isFollowUpDue).length;
  const channelPerformance = getChannelPerformance(leads);
  const topChannel = channelPerformance[0] ?? null;
  const marketingDrafts = marketingWorkflow?.drafts ?? [];
  const marketingApprovalBacklog = marketingDrafts.filter((draft) => draft.status === "pending_approval").length;
  const canvaBacklog = marketingDrafts.reduce(
    (count, draft) => count + (draft.canvaAssetAssists ?? []).filter((assist) => assist.manualApprovalStatus === "pending_manual_asset_approval").length,
    0,
  );
  const activeKnowledgeItems = knowledgeItems.filter((item) => item.status === "active").length;
  const missingInfoCount = getMissingInfoCount(leads);
  const offerReadyCount = getOfferReadyCount(revenuePipeline);
  const unavailableTimingGap = "Average lead-to-offer and offer-to-close timing require durable offer/close transition timestamps before they can be calculated.";

  return {
    kpis: [
      {
        id: "lead_conversion_rate",
        label: "Lead conversion rate",
        value: formatPercent(leadConversionRate),
        detail: `${closedLeads} closed lead(s) from ${leads.length} total stored lead(s).`,
        status: leads.length === 0 ? "missing" : leadConversionRate > 0 ? "good" : "watch",
      },
      {
        id: "cost_per_lead",
        label: "Cost per lead",
        value: formatFinanceDollars(financeKpis.costPerLeadCents),
        detail: "Manual marketing spend divided by stored leads.",
        status: financeKpis.costPerLeadCents === null ? "missing" : "good",
      },
      {
        id: "cost_per_acquisition",
        label: "Cost per acquisition",
        value: formatFinanceDollars(financeKpis.costPerAcquisitionCents),
        detail: "Manual marketing spend divided by linked paid deal revenue count.",
        status: financeKpis.costPerAcquisitionCents === null ? "missing" : "good",
      },
      {
        id: "pipeline_value",
        label: "Pipeline value",
        value: revenuePipeline.estimatedPipelineValueLabel,
        detail: `${revenuePipeline.actionableLeads} actionable lead(s); assumptions only when analyzer values exist.`,
        status: revenuePipeline.estimatedPipelineValue === null ? "missing" : "watch",
      },
      {
        id: "follow_up_completion",
        label: "Follow-up completion",
        value: followUpCompletion.total === 0 ? "Unavailable" : formatPercent(followUpCompletion.rate),
        detail: `${followUpCompletion.completed} completed follow-up(s) from ${followUpCompletion.total} stored follow-up task(s).`,
        status: followUpCompletion.total === 0 ? "missing" : followUpCompletion.rate >= 80 ? "good" : "watch",
      },
      {
        id: "lead_to_offer_time",
        label: "Avg lead to offer",
        value: "Unavailable",
        detail: "Offer transition timestamps are not stored yet.",
        status: "missing",
      },
      {
        id: "offer_to_close_time",
        label: "Avg offer to close",
        value: "Unavailable",
        detail: "Offer and close transition timestamps are not stored yet.",
        status: "missing",
      },
    ],
    channelPerformance,
    departmentHealth: getDepartmentHealth({
      leads,
      revenuePipeline,
      financeGapCount: financeKpis.missingData.length,
      marketingApprovalBacklog,
      canvaBacklog,
      activeKnowledgeItems,
      missingInfoCount,
      followUpsDue,
    }),
    trendCharts: getTrendCharts({ leads, financeEntries, topChannel }),
    dataGaps: [
      unavailableTimingGap,
      ...financeKpis.missingData,
      channelPerformance.length === 0 ? "No marketing channel performance is available until leads have source labels." : "",
      followUpCompletion.total === 0 ? "No stored follow-up task history is available for completion-rate analysis." : "",
    ].filter(Boolean),
    safetyFlags: {
      advisoryOnly: true,
      providerCalled: false,
      outreachSent: false,
      crmMutated: false,
      schemaChanged: false,
    },
    summary: {
      totalLeads: leads.length,
      qualifiedLeads,
      closedLeads,
      followUpsDue,
      offerReadyCount,
      marketingApprovalBacklog,
      financeGapCount: financeKpis.missingData.length,
      closingBlockedCount: revenuePipeline.closingBlockedLeads,
      topChannel,
    },
  };
}
