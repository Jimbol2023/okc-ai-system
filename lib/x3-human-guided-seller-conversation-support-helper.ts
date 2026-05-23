export type X3SellerConversationItem = {
  id: string;
  label: string;
  source?: string;
  priority?: number;
  estimatedRevenue?: number;
  motivationKnown?: boolean;
  timelineKnown?: boolean;
  askingPriceKnown?: boolean;
  hasRecentSellerReply?: boolean;
  hasObjection?: boolean;
  needsFollowUpLanguageReview?: boolean;
  offerReadinessScore?: number;
  daysSinceSellerTouch?: number;
};

export type X3SellerConversationInput = {
  items?: X3SellerConversationItem[];
  staleAfterDays?: number;
  maxItemsPerSection?: number;
};

export type X3SellerConversationSummary = {
  sellerContextReviewItems: X3SellerConversationItem[];
  motivationReviewItems: X3SellerConversationItem[];
  timelineReviewItems: X3SellerConversationItem[];
  objectionReviewItems: X3SellerConversationItem[];
  offerReadinessConversationItems: X3SellerConversationItem[];
  followUpLanguageReviewItems: X3SellerConversationItem[];
  missingSellerContextItems: X3SellerConversationItem[];
  highOpportunitySellerItems: X3SellerConversationItem[];
  manualConversationGuidance: string[];
  governanceWarnings: string[];
  safetyFlags: {
    readOnly: true;
    advisoryOnly: true;
    manualReviewOnly: true;
    providerCalled: false;
    sent: false;
    persistenceWritten: false;
    runtimeActivated: false;
    approvalGrantsExecution: false;
  };
};

const safetyFlags = {
  readOnly: true,
  advisoryOnly: true,
  manualReviewOnly: true,
  providerCalled: false,
  sent: false,
  persistenceWritten: false,
  runtimeActivated: false,
  approvalGrantsExecution: false,
} as const;

function scoreItem(item: X3SellerConversationItem): number {
  return (item.priority ?? 0) * 12 + (item.estimatedRevenue ?? 0) / 1000 + (item.offerReadinessScore ?? 0) * 2 + (item.daysSinceSellerTouch ?? 0) + (item.hasObjection ? 18 : 0) + (item.needsFollowUpLanguageReview ? 16 : 0) + (!item.motivationKnown ? 12 : 0) + (!item.timelineKnown ? 12 : 0) + (!item.askingPriceKnown ? 8 : 0);
}

function sortAndLimit(items: X3SellerConversationItem[], maxItems: number): X3SellerConversationItem[] {
  return [...items].sort((a, b) => scoreItem(b) - scoreItem(a) || a.label.localeCompare(b.label) || a.id.localeCompare(b.id)).slice(0, maxItems);
}

export function deriveHumanGuidedSellerConversationSupport(input: X3SellerConversationInput = {}): X3SellerConversationSummary {
  const items = input.items ?? [];
  const staleAfterDays = input.staleAfterDays ?? 5;
  const maxItems = input.maxItemsPerSection ?? 5;
  const missingSellerContextItems = sortAndLimit(items.filter((item) => !item.motivationKnown || !item.timelineKnown || !item.askingPriceKnown), maxItems);
  const sellerContextReviewItems = sortAndLimit(items.filter((item) => missingSellerContextItems.some((missing) => missing.id === item.id) || (item.daysSinceSellerTouch ?? 0) >= staleAfterDays), maxItems);
  const motivationReviewItems = sortAndLimit(items.filter((item) => !item.motivationKnown), maxItems);
  const timelineReviewItems = sortAndLimit(items.filter((item) => !item.timelineKnown), maxItems);
  const objectionReviewItems = sortAndLimit(items.filter((item) => item.hasObjection), maxItems);
  const offerReadinessConversationItems = sortAndLimit(items.filter((item) => (item.offerReadinessScore ?? 0) >= 70), maxItems);
  const followUpLanguageReviewItems = sortAndLimit(items.filter((item) => item.needsFollowUpLanguageReview || (item.daysSinceSellerTouch ?? 0) >= staleAfterDays), maxItems);
  const highOpportunitySellerItems = sortAndLimit(items.filter((item) => (item.priority ?? 0) >= 3 || (item.estimatedRevenue ?? 0) >= 15000), maxItems);
  const manualConversationGuidance = [
    highOpportunitySellerItems.length > 0 ? "Review high-opportunity seller context manually before any real-world conversation." : "No high-opportunity seller conversation signals available from read-only input.",
    followUpLanguageReviewItems.length > 0 ? "Review follow-up language manually; no message is sent." : "No follow-up language review items detected.",
    missingSellerContextItems.length > 0 ? "Review missing seller context manually; no skip trace, scraping, or provider lookup is triggered." : "No missing seller context detected.",
  ];
  return {
    sellerContextReviewItems,
    motivationReviewItems,
    timelineReviewItems,
    objectionReviewItems,
    offerReadinessConversationItems,
    followUpLanguageReviewItems,
    missingSellerContextItems,
    highOpportunitySellerItems,
    manualConversationGuidance,
    governanceWarnings: ["Human-guided seller conversation support is advisory only.", "No seller contact, message sending, provider activation, persistence, audit writing, polling, runtime job, or automation is authorized.", "Operator review is required before any real-world action."],
    safetyFlags,
  };
}
