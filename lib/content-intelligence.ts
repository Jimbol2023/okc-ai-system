import type { BusinessIntelligenceReport } from "@/lib/business-intelligence";
import type { KnowledgeItemRecord } from "@/lib/knowledge";
import type { listMarketingWorkflow } from "@/lib/marketing-workflow";

export type ContentIntelligenceRecommendationType = "create_next" | "refresh" | "repurpose" | "source_topic_focus";
export type ContentIntelligencePriority = "high" | "medium" | "low";

export type ContentPerformanceSnapshot = {
  topic: string;
  sourceLabel: string;
  qualifiedLeads: number;
  totalLeads: number;
  engagementScore?: number;
  conversionScore?: number;
  notes?: string;
};

export type ContentIntelligenceRecommendation = {
  id: string;
  type: ContentIntelligenceRecommendationType;
  title: string;
  summary: string;
  priority: ContentIntelligencePriority;
  score: number;
  sourceLabel: string;
  assumption: string;
  recommendedBrief: string;
  approvalRequired: true;
  providerCalled: false;
  liveExecutionAllowed: false;
  publishingBlocked: true;
  scrapingBlocked: true;
};

export type ContentIntelligenceReport = {
  ok: true;
  department: "Content Intelligence AI";
  summary: string;
  recommendations: ContentIntelligenceRecommendation[];
  topRecommendation: ContentIntelligenceRecommendation;
  dataGaps: string[];
  safety: {
    advisoryOnly: true;
    manualInputsOnly: true;
    providerCalled: false;
    liveExecutionAllowed: false;
    analyticsApiCalled: false;
    publishingBlocked: true;
    schedulingBlocked: true;
    scrapingBlocked: true;
    outreachBlocked: true;
    adsBlocked: true;
    approvalRequired: true;
  };
};

function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function priorityForScore(score: number): ContentIntelligencePriority {
  if (score >= 75) return "high";
  if (score >= 45) return "medium";

  return "low";
}

function daysSince(dateLike?: Date | string | null) {
  if (!dateLike) return 999;

  const date = new Date(dateLike);
  if (Number.isNaN(date.getTime())) return 999;

  return Math.max(0, Math.floor((Date.now() - date.getTime()) / 86_400_000));
}

function createRecommendation(input: {
  id: string;
  type: ContentIntelligenceRecommendationType;
  title: string;
  summary: string;
  score: number;
  sourceLabel: string;
  assumption: string;
  recommendedBrief: string;
}): ContentIntelligenceRecommendation {
  const score = clampScore(input.score);

  return {
    ...input,
    score,
    priority: priorityForScore(score),
    approvalRequired: true,
    providerCalled: false,
    liveExecutionAllowed: false,
    publishingBlocked: true,
    scrapingBlocked: true,
  };
}

type MarketingDraftRecord = Awaited<ReturnType<typeof listMarketingWorkflow>>["drafts"][number];

function topicFromKnowledge(item: KnowledgeItemRecord) {
  return item.title || item.category || "seller education";
}

function topicFromDraft(draft: MarketingDraftRecord) {
  return draft.topic || "seller education campaign";
}

export function createContentIntelligenceReport({
  marketingDrafts,
  knowledgeItems,
  businessIntelligence,
  performanceSnapshots = [],
}: {
  marketingDrafts: MarketingDraftRecord[];
  knowledgeItems: KnowledgeItemRecord[];
  businessIntelligence: BusinessIntelligenceReport;
  performanceSnapshots?: ContentPerformanceSnapshot[];
}): ContentIntelligenceReport {
  const topChannel = businessIntelligence.summary.topChannel;
  const pendingDrafts = marketingDrafts.filter((draft) => draft.status === "pending_approval" || draft.status === "draft");
  const approvedDrafts = marketingDrafts.filter((draft) => draft.status === "approved" || draft.status === "ready_for_manual_publish" || draft.status === "manually_published");
  const staleKnowledgeItems = knowledgeItems
    .map((item) => ({ item, ageDays: daysSince(item.updatedAt ?? item.createdAt) }))
    .filter(({ ageDays }) => ageDays >= 120)
    .sort((a, b) => b.ageDays - a.ageDays)
    .slice(0, 3);
  const bestSnapshot = [...performanceSnapshots].sort(
    (a, b) =>
      b.qualifiedLeads - a.qualifiedLeads ||
      (b.conversionScore ?? 0) - (a.conversionScore ?? 0) ||
      (b.engagementScore ?? 0) - (a.engagementScore ?? 0),
  )[0];
  const fallbackTopic = topChannel?.source ? `${topChannel.source} seller education` : "How to Sell an Inherited House in Oklahoma";
  const recommendations: ContentIntelligenceRecommendation[] = [
    createRecommendation({
      id: "create_next_seller_education",
      type: "create_next",
      title: "Create the next seller-education campaign",
      summary: `Prepare a campaign brief around ${bestSnapshot?.topic ?? fallbackTopic} for CEO review.`,
      score: 60 + (topChannel?.qualifiedLeads ?? 0) * 6 + (bestSnapshot?.qualifiedLeads ?? 0) * 5,
      sourceLabel: bestSnapshot?.sourceLabel ?? topChannel?.source ?? "manual_content_planning",
      assumption: "Recommendation uses stored lead-source and manual/read-only performance signals only.",
      recommendedBrief: `Marketing AI should draft a full campaign package for ${bestSnapshot?.topic ?? fallbackTopic}; keep every asset in draft or approval queue.`,
    }),
    createRecommendation({
      id: "refresh_stale_authority_content",
      type: "refresh",
      title: "Refresh authority content",
      summary: staleKnowledgeItems[0]
        ? `Review and refresh ${topicFromKnowledge(staleKnowledgeItems[0].item)} because it is ${staleKnowledgeItems[0].ageDays} day(s) old.`
        : "Review the oldest seller education content before publishing new variations.",
      score: staleKnowledgeItems.length > 0 ? 72 + staleKnowledgeItems.length * 5 : 35,
      sourceLabel: staleKnowledgeItems[0] ? "knowledge_item_age" : "manual_refresh_review",
      assumption: "Freshness is based on local knowledge item timestamps, not live traffic data.",
      recommendedBrief: staleKnowledgeItems[0]
        ? `Refresh ${topicFromKnowledge(staleKnowledgeItems[0].item)} with current positioning, source labels, and CEO approval.`
        : "Create a manual refresh review list once content timestamps are available.",
    }),
    createRecommendation({
      id: "repurpose_approved_assets",
      type: "repurpose",
      title: "Repurpose approved long-form assets",
      summary: approvedDrafts[0]
        ? `Turn ${topicFromDraft(approvedDrafts[0])} into Shorts, Reels, TikTok, LinkedIn, GBP, email, and carousel draft assists.`
        : "Choose the next approved long-form seller education asset for short-form repurposing.",
      score: approvedDrafts.length > 0 ? 70 + Math.min(20, approvedDrafts.length * 4) : 38,
      sourceLabel: approvedDrafts[0] ? "approved_marketing_drafts" : "manual_repurpose_backlog",
      assumption: "Repurposing is draft-only and requires CEO approval before external use.",
      recommendedBrief: approvedDrafts[0]
        ? `Create draft-only repurpose briefs from ${topicFromDraft(approvedDrafts[0])}; no scheduling or posting.`
        : "Approve at least one long-form article or video script before repurposing.",
    }),
    createRecommendation({
      id: "source_topic_focus",
      type: "source_topic_focus",
      title: "Focus on the source/topic producing quality",
      summary: topChannel
        ? `${topChannel.source} currently has ${topChannel.qualifiedLeads} qualified lead(s) and ${topChannel.qualifiedShare}% qualified share.`
        : "Lead-source quality data is not strong enough yet; keep source labels clean.",
      score: topChannel ? 65 + topChannel.qualifiedLeads * 7 + Math.round(topChannel.qualifiedShare / 5) : 30,
      sourceLabel: topChannel?.source ?? "lead_source_attribution_gap",
      assumption: "Source/topic focus is inferred from stored lead attribution, not live analytics.",
      recommendedBrief: topChannel
        ? `Create a content brief that supports ${topChannel.source} lead quality and asks Lead Intelligence to watch qualified seller outcomes.`
        : "Improve source attribution before shifting content strategy.",
    }),
  ].sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
  const topRecommendation = recommendations[0] ?? createRecommendation({
    id: "manual_content_review",
    type: "create_next",
    title: "Start manual content review",
    summary: "Gather content and lead-source inputs before campaign planning.",
    score: 25,
    sourceLabel: "manual_content_planning",
    assumption: "No local performance records were available.",
    recommendedBrief: "Create the first manually reviewed seller education topic list.",
  });
  const dataGaps = [
    performanceSnapshots.length === 0 ? "Manual/read-only content performance snapshots are not available yet." : "",
    !topChannel ? "Lead-source attribution is not strong enough to rank content by qualified seller outcomes." : "",
    pendingDrafts.length === 0 ? "No draft or pending campaign backlog is available for approval prioritization." : "",
  ].filter(Boolean);

  return {
    ok: true,
    department: "Content Intelligence AI",
    summary:
      "Read-only strategist layer that recommends what to create, refresh, repurpose, and focus on based on manual content signals and stored lead-source quality.",
    recommendations,
    topRecommendation,
    dataGaps,
    safety: {
      advisoryOnly: true,
      manualInputsOnly: true,
      providerCalled: false,
      liveExecutionAllowed: false,
      analyticsApiCalled: false,
      publishingBlocked: true,
      schedulingBlocked: true,
      scrapingBlocked: true,
      outreachBlocked: true,
      adsBlocked: true,
      approvalRequired: true,
    },
  };
}
