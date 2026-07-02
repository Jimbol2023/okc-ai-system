export type MarketingPlatform =
  | "facebook"
  | "instagram"
  | "tiktok"
  | "linkedin"
  | "google_business_profile"
  | "google_analytics_4"
  | "google_search_console"
  | "youtube";

export type MarketingConnectionStatus = "manual_setup" | "not_connected";

export type MarketingRiskLevel = "low" | "medium" | "high";

export type MarketingConnectedAccount = {
  platform: MarketingPlatform;
  label: string;
  status: MarketingConnectionStatus;
  accountName: string;
  handle: string;
  lastChecked: string | null;
  permissions: string[];
  riskLevel: MarketingRiskLevel;
  nextAction: string;
};

export type MarketingWorkflowStep = {
  label: string;
  purpose: string;
};

export type MarketingQueueItem = {
  title: string;
  status: string;
  source: string;
  nextAction: string;
};

export type MarketingCalendarItem = {
  day: string;
  rhythm: string;
  objective: string;
};

export type MarketingReadinessItem = {
  channel: string;
  status: string;
  sourceTracking: string;
  nextAction: string;
};

export type MarketingApiRoadmapItem = {
  phase: string;
  title: string;
  summary: string;
  guardrail: string;
};

export const marketingSafetyBadges = [
  "READ ONLY",
  "NO AUTO POSTING",
  "NO OUTREACH",
  "HUMAN APPROVAL REQUIRED",
] as const;

export const marketingApiRoadmap: MarketingApiRoadmapItem[] = [
  {
    phase: "Phase 1",
    title: "Provider connection readiness",
    summary: "Validate server-side configuration for Facebook, Instagram, TikTok, LinkedIn, and YouTube before live account actions.",
    guardrail: "canPublish:false / publishEnabled:false",
  },
  {
    phase: "Phase 2",
    title: "Read-only analytics",
    summary: "Add GA4, Search Console, Facebook, and GBP analytics only after connection readiness is proven.",
    guardrail: "No lead or CRM mutation",
  },
  {
    phase: "Phase 3",
    title: "Draft-only content engine",
    summary: "Repurpose one approved topic into website, social, video, and GBP drafts through the existing approval queue.",
    guardrail: "No external provider calls",
  },
  {
    phase: "Phase 4",
    title: "Publishing gate",
    summary: "Start with Facebook only after approved drafts, verified connection, explicit confirmation, and audit logging exist.",
    guardrail: "Never publish automatically",
  },
];

export const marketingConnectedAccounts: MarketingConnectedAccount[] = [
  {
    platform: "facebook",
    label: "Facebook",
    status: "manual_setup",
    accountName: "J Capital Property Group",
    handle: "J Capital Property Group",
    lastChecked: null,
    permissions: ["Manual page review", "Manual post snapshot"],
    riskLevel: "medium",
    nextAction: "Confirm page ownership and document manual posting workflow.",
  },
  {
    platform: "instagram",
    label: "Instagram",
    status: "manual_setup",
    accountName: "J Capital Property Group",
    handle: "@jcapitalproperty",
    lastChecked: null,
    permissions: ["Manual profile review", "Manual engagement snapshot"],
    riskLevel: "medium",
    nextAction: "Confirm profile access and keep captions in approval queue before posting.",
  },
  {
    platform: "tiktok",
    label: "TikTok",
    status: "manual_setup",
    accountName: "JCapitalPropertyGroup",
    handle: "@JCapitalPropertyGroup",
    lastChecked: null,
    permissions: ["Manual profile review", "Manual short-video planning"],
    riskLevel: "medium",
    nextAction: "Confirm account access and keep scripts draft-only until human approval.",
  },
  {
    platform: "linkedin",
    label: "LinkedIn",
    status: "not_connected",
    accountName: "Not connected",
    handle: "Manual setup needed",
    lastChecked: null,
    permissions: ["No permissions granted"],
    riskLevel: "low",
    nextAction: "Decide whether LinkedIn belongs in the first marketing measurement loop.",
  },
  {
    platform: "google_business_profile",
    label: "Google Business Profile",
    status: "not_connected",
    accountName: "Manual setup needed",
    handle: "Manual setup needed",
    lastChecked: null,
    permissions: ["No permissions granted"],
    riskLevel: "high",
    nextAction: "Verify business profile ownership before any future API planning.",
  },
  {
    platform: "google_analytics_4",
    label: "Google Analytics 4",
    status: "manual_setup",
    accountName: "J Capital Property Group website",
    handle: "G-1XEHSDKMP0",
    lastChecked: null,
    permissions: ["Manual traffic snapshot"],
    riskLevel: "medium",
    nextAction: "Use the measurement ID only as a manual reference until server-side analytics routes exist.",
  },
  {
    platform: "google_search_console",
    label: "Google Search Console",
    status: "not_connected",
    accountName: "jcapitalpropertygroup.com",
    handle: "Manual setup needed",
    lastChecked: null,
    permissions: ["No permissions granted"],
    riskLevel: "medium",
    nextAction: "Confirm property verification and indexing visibility manually.",
  },
  {
    platform: "youtube",
    label: "YouTube",
    status: "not_connected",
    accountName: "Manual setup needed",
    handle: "Manual setup needed",
    lastChecked: null,
    permissions: ["No permissions granted"],
    riskLevel: "medium",
    nextAction: "Confirm channel ownership before adding video publishing or analytics planning.",
  },
];

export const marketingLeadAttributionReadiness: MarketingReadinessItem[] = [
  {
    channel: "Website",
    status: "Manual tracking ready",
    sourceTracking: "jcapitalpropertygroup.com lead forms should keep source parameters visible.",
    nextAction: "Use campaign source labels on all links shared from content.",
  },
  {
    channel: "Facebook",
    status: "Manual setup",
    sourceTracking: "Use facebook as source on every seller inquiry generated by page posts.",
    nextAction: "Add manual post URL and source note to lead records when known.",
  },
  {
    channel: "Instagram",
    status: "Manual setup",
    sourceTracking: "Use instagram as source for profile, bio, story, or DM-originated inquiries.",
    nextAction: "Keep approved captions tied to a campaign topic before posting.",
  },
  {
    channel: "TikTok",
    status: "Manual setup",
    sourceTracking: "Use tiktok as source for short-video inquiries.",
    nextAction: "Track topic and video script manually beside lead source.",
  },
  {
    channel: "GBP",
    status: "Manual setup needed",
    sourceTracking: "Use gbp as source for Google Business Profile calls or website visits.",
    nextAction: "Record manual post/photo date when seller inquiries mention Google.",
  },
  {
    channel: "YouTube",
    status: "Not connected",
    sourceTracking: "Use youtube as source when a seller cites a video.",
    nextAction: "Plan descriptions with website links and manual campaign labels.",
  },
  {
    channel: "LinkedIn",
    status: "Configured / Not connected",
    sourceTracking:
      "Use linkedin only if a seller or partner inquiry originates from the public Company Page: https://www.linkedin.com/company/109661667/.",
    nextAction: "Keep LinkedIn as manual source-tracking metadata only; no OAuth, publishing, scheduling, scraping, or provider calls.",
  },
];

export const marketingContentPipeline: MarketingWorkflowStep[] = [
  { label: "Topic", purpose: "Select seller-intent theme and source label." },
  { label: "Article", purpose: "Create website content outline for review." },
  { label: "Facebook", purpose: "Prepare approved page post draft." },
  { label: "Instagram", purpose: "Prepare caption and visual note." },
  { label: "TikTok", purpose: "Prepare short-video script." },
  { label: "GBP", purpose: "Prepare update and photo checklist." },
  { label: "YouTube", purpose: "Prepare description and topic notes." },
];

export const marketingDraftQueue: MarketingQueueItem[] = [
  {
    title: "Inherited property seller education",
    status: "Draft placeholder",
    source: "Website article plus social repurposing",
    nextAction: "Human review required before platform-specific drafts are used.",
  },
  {
    title: "Tax delinquent property owner options",
    status: "Idea backlog",
    source: "SEO and GBP content planning",
    nextAction: "Validate topic and avoid claiming property-specific facts.",
  },
  {
    title: "Sell as-is in Oklahoma City",
    status: "Manual planning",
    source: "High-intent seller search content",
    nextAction: "Prepare draft only after source and campaign label are chosen.",
  },
];

export const marketingPublishedSnapshots: MarketingQueueItem[] = [
  {
    title: "Manual published content snapshot",
    status: "Manual only",
    source: "No platform sync",
    nextAction: "Paste or record summaries manually after human-approved publication.",
  },
];

export const marketingSocialCalendar: MarketingCalendarItem[] = [
  { day: "Monday", rhythm: "Article", objective: "Publish or review website education content." },
  { day: "Tuesday", rhythm: "Facebook/Instagram", objective: "Repurpose approved article angle." },
  { day: "Wednesday", rhythm: "Short video", objective: "Record TikTok or YouTube short from approved script." },
  { day: "Thursday", rhythm: "GBP update", objective: "Post approved local update and photo manually." },
  { day: "Friday", rhythm: "Analytics review", objective: "Review traffic, engagement, conversions, and source quality." },
];

export const marketingTopRoiQuestions = [
  "How many website visitors today?",
  "Which article is producing the most engagement?",
  "Which Facebook post had the highest reach?",
  "Which GBP update received the most views?",
  "Which channel is producing seller leads?",
] as const;

export const marketingSourceHygieneChecklist = [
  "Every lead keeps a visible source value.",
  "Every shared link should use a campaign source label when practical.",
  "Every draft should identify the intended channel before approval.",
  "Every published manual snapshot should record topic, date, channel, and link when available.",
  "No source should be guessed when the seller path is unknown.",
] as const;

export const marketingGovernanceRules = [
  "No automated posting",
  "No scraping",
  "No messaging",
  "No outreach",
  "No CRM mutation",
  "No lead creation",
  "No provider calls",
  "No ads",
  "No budget changes",
] as const;

// Future planning only. Do not add live API clients, routes, OAuth, token storage, or fetch calls in Phase 1.
// Candidate future APIs: Facebook Graph API, Instagram Graph API, Google Business Profile API,
// GA4 Data API, Search Console API, YouTube Data API, TikTok API.
