import { getEnterpriseConnector, listEnterpriseConnectors } from "@/lib/connector-platform";
import { getFeatureFlagSnapshot, isFeatureEnabled } from "@/lib/feature-flags";
import { listDbLeads } from "@/lib/leads-db";
import type { StoredLead } from "@/lib/leads-storage";
import {
  getLatestBusinessSnapshots,
  listReadOnlyAdapterMetadata,
  type BusinessDataSnapshotRecord,
} from "@/lib/read-only-business-connections";
import { getRevenuePipelineSummary } from "@/lib/revenue-pipeline";

export const connectorActivationSafetyFlags = {
  readOnly: true,
  providerCalled: false,
  liveExecutionAllowed: false,
  workflowStarted: false,
  published: false,
  sent: false,
  outreachBlocked: true,
  scrapingBlocked: true,
  adsBlocked: true,
  externalWritesBlocked: true,
  crmMutationBlocked: true,
} as const;

export type ConnectorActivationStatus =
  | "connected"
  | "internal_ready"
  | "credentials_missing"
  | "data_gap"
  | "registry_only"
  | "incomplete";

export type ConnectorActivationReportItem = {
  connectorId: string;
  connectorName: string;
  status: ConnectorActivationStatus;
  implementationStatus: "implemented_read_adapter" | "internal_read_source" | "registry_only" | "umbrella";
  roiPriority: 1 | 2 | 3 | 4;
  revenueUseCase: string;
  dealFlowImpact: "high" | "medium" | "low" | "readiness_only";
  nextRevenueAction: string;
  blockingRevenueData: string[];
  readOnly: true;
  credentialsPresent: boolean;
  lastSuccessfulRead: string | null;
  lastFailure: string | null;
  businessUseCase: string;
  departmentUsingIt: string;
  nextRequiredAction: string;
  sourceLabel: string;
  featureFlags: string[];
  disabledFeatureFlags: string[];
  sourceRecords: string[];
  safetyFlags: typeof connectorActivationSafetyFlags;
  providerCalled: false;
  liveExecutionAllowed: false;
  workflowStarted: false;
  published: false;
  sent: false;
};

export type ConnectorActivationReport = {
  ok: true;
  generatedAt: string;
  summary: string;
  totals: {
    connectors: number;
    connected: number;
    internalReady: number;
    credentialsMissing: number;
    dataGaps: number;
    registryOnly: number;
  };
  connectors: ConnectorActivationReportItem[];
  dataGaps: string[];
  featureFlags: ReturnType<typeof getFeatureFlagSnapshot>;
  safetyFlags: typeof connectorActivationSafetyFlags;
  providerCalled: false;
  liveExecutionAllowed: false;
  workflowStarted: false;
  published: false;
  sent: false;
};

type ConnectorPlan = {
  connectorId: string;
  connectorName: string;
  businessUseCase: string;
  departmentUsingIt: string;
  implementationStatus: ConnectorActivationReportItem["implementationStatus"];
  adapterConnectorIds: string[];
  internal: boolean;
  requiredEnv: string[];
  featureFlags: string[];
  nextRequiredAction: string;
  roiPriority: 1 | 2 | 3 | 4;
  revenueUseCase: string;
  dealFlowImpact: ConnectorActivationReportItem["dealFlowImpact"];
  nextRevenueAction: string;
};

const connectorPlans: ConnectorPlan[] = [
  {
    connectorId: "website_lead_intake",
    connectorName: "Website Lead Intake",
    businessUseCase: "Validated public seller inquiries persisted with source attribution and mandatory human review.",
    departmentUsingIt: "Lead Intelligence",
    implementationStatus: "internal_read_source",
    adapterConnectorIds: ["website_lead_intake"],
    internal: true,
    requiredEnv: [],
    featureFlags: [],
    nextRequiredAction: "Keep every public intake source-attributed and approval-gated before outreach.",
    roiPriority: 1,
    revenueUseCase: "Captures inbound seller demand into the internal lead review workflow.",
    dealFlowImpact: "high",
    nextRevenueAction: "Review newly persisted inquiries and prepare approval-only follow-up recommendations.",
  },
  {
    connectorId: "google_workspace",
    connectorName: "Google Workspace",
    businessUseCase: "Umbrella OAuth for Gmail, Calendar, Drive, Search Console, GA4, GBP, and YouTube read-only snapshots.",
    departmentUsingIt: "Operations",
    implementationStatus: "umbrella",
    adapterConnectorIds: ["gmail", "google_calendar", "google_drive", "google_search_console", "google_analytics", "google_business_profile", "youtube"],
    internal: false,
    requiredEnv: ["GOOGLE_OAUTH_CLIENT_ID", "GOOGLE_OAUTH_CLIENT_SECRET", "GOOGLE_OAUTH_REFRESH_TOKEN"],
    featureFlags: ["connector_live_reads", "connector_google"],
    nextRequiredAction: "Confirm Google OAuth refresh token has read-only scopes for the exact connected services.",
    roiPriority: 2,
    revenueUseCase: "Unlocks the Google read-only data group used to support seller inbox review, demand signals, schedule context, and trust signals.",
    dealFlowImpact: "medium",
    nextRevenueAction: "Verify OAuth scopes for Gmail, Search Console, GA4, Calendar, Drive, GBP, and YouTube before relying on Google-derived daily work.",
  },
  {
    connectorId: "gmail",
    connectorName: "Gmail",
    businessUseCase: "Inbound seller/inquiry signal review for Lead Intelligence and Revenue prioritization.",
    departmentUsingIt: "Lead Intelligence",
    implementationStatus: "implemented_read_adapter",
    adapterConnectorIds: ["gmail"],
    internal: false,
    requiredEnv: ["GOOGLE_OAUTH_CLIENT_ID", "GOOGLE_OAUTH_CLIENT_SECRET", "GOOGLE_OAUTH_REFRESH_TOKEN"],
    featureFlags: ["connector_live_reads", "connector_google", "connector_communication"],
    nextRequiredAction: "Enable read-only sync after Gmail readonly OAuth credentials are verified.",
    roiPriority: 1,
    revenueUseCase: "Find inbound seller, buyer, referral, and partner signals that can become same-day revenue priorities.",
    dealFlowImpact: "high",
    nextRevenueAction: "Review recent inbox metadata against stored leads and route qualified seller signals to Revenue AI for CEO-approved follow-up planning.",
  },
  {
    connectorId: "google_calendar",
    connectorName: "Google Calendar",
    businessUseCase: "Daily priorities, meeting preparation, and open operational issue timing.",
    departmentUsingIt: "Operations",
    implementationStatus: "implemented_read_adapter",
    adapterConnectorIds: ["google_calendar"],
    internal: false,
    requiredEnv: ["GOOGLE_OAUTH_CLIENT_ID", "GOOGLE_OAUTH_CLIENT_SECRET", "GOOGLE_OAUTH_REFRESH_TOKEN"],
    featureFlags: ["connector_live_reads", "connector_google"],
    nextRequiredAction: "Verify Calendar readonly scope before relying on meeting-prep work orders.",
    roiPriority: 2,
    revenueUseCase: "Protects CEO time by linking deal review, seller calls, buyer meetings, and operational deadlines to daily work.",
    dealFlowImpact: "medium",
    nextRevenueAction: "Use upcoming events to prepare acquisition, seller, buyer, and closing review packets before meetings.",
  },
  {
    connectorId: "google_drive",
    connectorName: "Google Drive",
    businessUseCase: "Recent document metadata for operations, legal, and document review work.",
    departmentUsingIt: "Operations",
    implementationStatus: "implemented_read_adapter",
    adapterConnectorIds: ["google_drive"],
    internal: false,
    requiredEnv: ["GOOGLE_OAUTH_CLIENT_ID", "GOOGLE_OAUTH_CLIENT_SECRET", "GOOGLE_OAUTH_REFRESH_TOKEN"],
    featureFlags: ["connector_live_reads", "connector_google"],
    nextRequiredAction: "Verify Drive metadata readonly scope and document naming conventions.",
    roiPriority: 2,
    revenueUseCase: "Surfaces recent contracts, dispo materials, seller docs, and operating files that may unblock deal movement.",
    dealFlowImpact: "medium",
    nextRevenueAction: "Review recent document metadata for offer, contract, title, marketing, and closing readiness gaps.",
  },
  {
    connectorId: "google_search_console",
    connectorName: "Google Search Console",
    businessUseCase: "SEO indexing, top pages, content opportunities, and internal linking priorities.",
    departmentUsingIt: "SEO",
    implementationStatus: "implemented_read_adapter",
    adapterConnectorIds: ["google_search_console"],
    internal: false,
    requiredEnv: ["GOOGLE_OAUTH_CLIENT_ID", "GOOGLE_OAUTH_CLIENT_SECRET", "GOOGLE_OAUTH_REFRESH_TOKEN", "GOOGLE_SEARCH_CONSOLE_SITE_URL"],
    featureFlags: ["connector_live_reads", "connector_google", "executive_briefings"],
    nextRequiredAction: "Confirm Search Console property URL and readonly Webmasters scope.",
    roiPriority: 1,
    revenueUseCase: "Shows search demand and page-level seller intent so SEO and content work support qualified seller lead flow.",
    dealFlowImpact: "high",
    nextRevenueAction: "Prioritize pages with impressions/clicks and convert them into CEO-reviewable SEO or seller education drafts.",
  },
  {
    connectorId: "google_analytics",
    connectorName: "Google Analytics",
    businessUseCase: "Traffic, conversion, and top page signals for Marketing and Revenue daily work.",
    departmentUsingIt: "Marketing",
    implementationStatus: "implemented_read_adapter",
    adapterConnectorIds: ["google_analytics"],
    internal: false,
    requiredEnv: ["GOOGLE_OAUTH_CLIENT_ID", "GOOGLE_OAUTH_CLIENT_SECRET", "GOOGLE_OAUTH_REFRESH_TOKEN", "GOOGLE_ANALYTICS_PROPERTY_ID"],
    featureFlags: ["connector_live_reads", "connector_google", "executive_briefings"],
    nextRequiredAction: "Confirm GA4 property ID and analytics readonly scope.",
    roiPriority: 1,
    revenueUseCase: "Shows traffic, top pages, and conversion context for deciding which web assets support seller acquisition.",
    dealFlowImpact: "high",
    nextRevenueAction: "Compare top pages with lead sources and create conversion-focused internal work for Marketing and Revenue.",
  },
  {
    connectorId: "google_business_profile",
    connectorName: "Google Business Profile",
    businessUseCase: "Local trust, reviews, profile performance, and GBP draft decisions.",
    departmentUsingIt: "Brand",
    implementationStatus: "implemented_read_adapter",
    adapterConnectorIds: ["google_business_profile"],
    internal: false,
    requiredEnv: ["GOOGLE_OAUTH_CLIENT_ID", "GOOGLE_OAUTH_CLIENT_SECRET", "GOOGLE_OAUTH_REFRESH_TOKEN", "GOOGLE_BUSINESS_PROFILE_LOCATION_ID"],
    featureFlags: ["connector_live_reads", "connector_google", "connector_marketing"],
    nextRequiredAction: "Use full accounts/{accountId}/locations/{locationId} for reviews; performance accepts locations/{locationId}.",
    roiPriority: 2,
    revenueUseCase: "Supports local trust and review visibility that can improve seller confidence and inbound conversion.",
    dealFlowImpact: "medium",
    nextRevenueAction: "Use profile/review signals to prepare approval-only trust, GBP, and review-response work.",
  },
  {
    connectorId: "youtube",
    connectorName: "YouTube",
    businessUseCase: "Recent video and watch-time signals for content repurposing and YouTube descriptions.",
    departmentUsingIt: "Content",
    implementationStatus: "implemented_read_adapter",
    adapterConnectorIds: ["youtube"],
    internal: false,
    requiredEnv: ["GOOGLE_OAUTH_CLIENT_ID", "GOOGLE_OAUTH_CLIENT_SECRET", "GOOGLE_OAUTH_REFRESH_TOKEN", "YOUTUBE_CHANNEL_ID"],
    featureFlags: ["connector_live_reads", "connector_google", "connector_marketing"],
    nextRequiredAction: "Confirm YouTube channel ID and readonly analytics scope.",
    roiPriority: 3,
    revenueUseCase: "Supports content repurposing after higher-ROI seller and pipeline blockers are clear.",
    dealFlowImpact: "low",
    nextRevenueAction: "Use recent videos and watch-time evidence to draft seller education descriptions only after Tier 1 blockers are visible.",
  },
  {
    connectorId: "canva",
    connectorName: "Canva",
    businessUseCase: "Recent design metadata for marketing drafts and brand asset follow-up.",
    departmentUsingIt: "Marketing",
    implementationStatus: "implemented_read_adapter",
    adapterConnectorIds: ["canva"],
    internal: false,
    requiredEnv: ["CANVA_OAUTH_CLIENT_ID", "CANVA_OAUTH_CLIENT_SECRET", "CANVA_OAUTH_REFRESH_TOKEN"],
    featureFlags: ["connector_live_reads", "connector_marketing"],
    nextRequiredAction: "Confirm Canva OAuth refresh token and design read permissions.",
    roiPriority: 3,
    revenueUseCase: "Supports marketing asset readiness after demand, lead, and pipeline priorities are handled.",
    dealFlowImpact: "low",
    nextRevenueAction: "Review recent design metadata for approval-only seller education, GBP, and social draft support.",
  },
  {
    connectorId: "lead_database",
    connectorName: "Lead Database",
    businessUseCase: "Stored lead counts, source quality, high-priority leads, and missing-data review.",
    departmentUsingIt: "Lead Intelligence",
    implementationStatus: "internal_read_source",
    adapterConnectorIds: ["lead_database"],
    internal: true,
    requiredEnv: [],
    featureFlags: [],
    nextRequiredAction: "Keep source attribution complete for every new lead.",
    roiPriority: 1,
    revenueUseCase: "Primary internal record of seller opportunities and source attribution.",
    dealFlowImpact: "high",
    nextRevenueAction: "Rank high-priority stored leads and resolve missing source/property data before outreach planning.",
  },
  {
    connectorId: "crm",
    connectorName: "CRM",
    businessUseCase: "Actionable leads, approval states, blocked leads, and follow-up readiness.",
    departmentUsingIt: "Revenue",
    implementationStatus: "internal_read_source",
    adapterConnectorIds: ["crm"],
    internal: true,
    requiredEnv: [],
    featureFlags: [],
    nextRequiredAction: "Review blocked leads and incomplete approval states before daily revenue work.",
    roiPriority: 1,
    revenueUseCase: "Shows actionable, blocked, pending, and follow-up-ready lead states for daily revenue work.",
    dealFlowImpact: "high",
    nextRevenueAction: "Work the highest-ranked actionable and approval-blocked leads before lower-value admin tasks.",
  },
  {
    connectorId: "property_pipeline",
    connectorName: "Property Pipeline",
    businessUseCase: "Work-first properties, near-contract leads, closing blockers, and pipeline value gaps.",
    departmentUsingIt: "Acquisitions",
    implementationStatus: "internal_read_source",
    adapterConnectorIds: ["property_pipeline"],
    internal: true,
    requiredEnv: [],
    featureFlags: [],
    nextRequiredAction: "Fill ARV, repair estimate, desired profit, title, contract, and closing readiness gaps.",
    roiPriority: 1,
    revenueUseCase: "Ranks acquisition opportunities, near-contract leads, closing blockers, and pipeline value gaps.",
    dealFlowImpact: "high",
    nextRevenueAction: "Move work-first, near-contract, and closing-blocked properties into internal acquisition review packages.",
  },
];

function hasCredential(value: string | undefined) {
  if (!value?.trim()) return false;
  return !/replace-with|your-|PROJECT_ID|USER:PASSWORD|localhost-placeholder|example/i.test(value);
}

function credentialsPresent(requiredEnv: string[], env: NodeJS.ProcessEnv) {
  return requiredEnv.every((key) => hasCredential(env[key]));
}

function sourceRecord(snapshot: BusinessDataSnapshotRecord) {
  return `${snapshot.category}:${snapshot.status}:${snapshot.summary}`;
}

function blockingRevenueData(input: {
  plan: ConnectorPlan;
  credentials: boolean;
  disabledFlags: string[];
  failed: BusinessDataSnapshotRecord | null;
  status: ConnectorActivationStatus;
}) {
  return [
    input.status === "connected" || input.status === "internal_ready" ? "" : `ROI tier ${input.plan.roiPriority} is not fully feeding daily work.`,
    !input.credentials && input.plan.requiredEnv.length > 0 ? `Missing read-only env/configuration: ${input.plan.requiredEnv.join(", ")}.` : "",
    input.disabledFlags.length > 0 ? `Feature flag(s) disabled: ${input.disabledFlags.join(", ")}.` : "",
    input.failed?.dataGaps[0] ?? "",
  ].filter(Boolean);
}

function statusForPlan(input: {
  plan: ConnectorPlan;
  snapshots: BusinessDataSnapshotRecord[];
  credentials: boolean;
  disabledFlags: string[];
}): ConnectorActivationStatus {
  if (input.plan.internal) return input.snapshots.some((snapshot) => snapshot.status === "fresh") ? "internal_ready" : "data_gap";
  if (input.snapshots.some((snapshot) => snapshot.providerCalled && snapshot.status !== "data_gap")) return "connected";
  if (!input.credentials || input.disabledFlags.length > 0) return "credentials_missing";
  if (input.snapshots.some((snapshot) => snapshot.dataGaps.length > 0)) return "data_gap";
  if (input.plan.implementationStatus === "registry_only") return "registry_only";
  return "incomplete";
}

function createReportItem(plan: ConnectorPlan, snapshots: BusinessDataSnapshotRecord[], env: NodeJS.ProcessEnv): ConnectorActivationReportItem {
  const related = snapshots.filter((snapshot) => plan.adapterConnectorIds.includes(snapshot.connectorId));
  const credentials = plan.internal || credentialsPresent(plan.requiredEnv, env);
  const disabledFlags = plan.featureFlags.filter((flag) => !isFeatureEnabled(flag as never));
  const successful = related.find((snapshot) => snapshot.providerCalled && snapshot.status !== "data_gap") ?? related.find((snapshot) => plan.internal && snapshot.status === "fresh") ?? null;
  const failed = related.find((snapshot) => snapshot.dataGaps.length > 0) ?? null;
  const registry = getEnterpriseConnector(plan.connectorId);
  const status = statusForPlan({ plan, snapshots: related, credentials, disabledFlags });
  const nextRequiredAction =
    status === "connected" || status === "internal_ready"
      ? plan.nextRequiredAction
      : !credentials
        ? `Set required read-only env/configuration: ${plan.requiredEnv.join(", ")}.`
        : disabledFlags.length > 0
          ? `Enable feature flag(s) when CEO approves read-only activation: ${disabledFlags.join(", ")}.`
          : failed?.dataGaps[0] ?? plan.nextRequiredAction;

  return {
    connectorId: plan.connectorId,
    connectorName: plan.connectorName,
    status,
    implementationStatus: plan.implementationStatus ?? (registry ? "registry_only" : "incomplete"),
    roiPriority: plan.roiPriority,
    revenueUseCase: plan.revenueUseCase,
    dealFlowImpact: plan.dealFlowImpact,
    nextRevenueAction: plan.nextRevenueAction,
    blockingRevenueData: blockingRevenueData({ plan, credentials, disabledFlags, failed, status }),
    readOnly: true,
    credentialsPresent: credentials,
    lastSuccessfulRead: successful?.freshness ?? registry?.lastSuccessfulSync ?? null,
    lastFailure: failed?.dataGaps[0] ?? registry?.lastFailedSync ?? null,
    businessUseCase: plan.businessUseCase,
    departmentUsingIt: plan.departmentUsingIt,
    nextRequiredAction,
    sourceLabel: successful?.sourceLabel ?? failed?.sourceLabel ?? `connector_activation:${plan.connectorId}`,
    featureFlags: plan.featureFlags,
    disabledFeatureFlags: disabledFlags,
    sourceRecords: related.map(sourceRecord).slice(0, 6),
    safetyFlags: connectorActivationSafetyFlags,
    providerCalled: false,
    liveExecutionAllowed: false,
    workflowStarted: false,
    published: false,
    sent: false,
  };
}

export function createConnectorActivationReportFromInputs({
  snapshots,
  leads,
  env = process.env,
}: {
  snapshots: BusinessDataSnapshotRecord[];
  leads: StoredLead[];
  env?: NodeJS.ProcessEnv;
}): ConnectorActivationReport {
  const pipeline = getRevenuePipelineSummary(leads);
  const now = new Date().toISOString();
  const adapterConnectorIds = new Set(listReadOnlyAdapterMetadata().map((adapter) => adapter.connectorId));
  const plannedConnectorIds = new Set(connectorPlans.map((plan) => plan.connectorId));
  const registryOnlyPlans: ConnectorPlan[] = listEnterpriseConnectors()
    .filter((connector) => !plannedConnectorIds.has(connector.connectorId) && !adapterConnectorIds.has(connector.connectorId))
    .map((connector) => ({
      connectorId: connector.connectorId,
      connectorName: connector.displayName,
      businessUseCase: connector.readCapabilities.join(", ") || "Registry visibility only.",
      departmentUsingIt: connector.owner,
      implementationStatus: "registry_only" as const,
      adapterConnectorIds: [connector.connectorId],
      internal: false,
      requiredEnv: [],
      featureFlags: connector.featureFlags,
      nextRequiredAction: connector.lifecycleState === "enabled" ? connector.retryPolicy : "No Sprint 22 activation; keep as registry/readiness-only.",
      roiPriority: 4,
      revenueUseCase: connector.readCapabilities.join(", ") || "Registry visibility only.",
      dealFlowImpact: "readiness_only" as const,
      nextRevenueAction: "Keep readiness visible; do not rank ahead of deal-flow connectors.",
    }));
  const internalFacts = [
    `website_lead_intake:${leads.length} persisted lead(s)`,
    `lead_database:${leads.length} stored lead(s)`,
    `crm:${pipeline.actionableLeads} actionable lead(s)`,
    `property_pipeline:${pipeline.workFirstLeads.length} work-first item(s)`,
  ];
  const connectors = [...connectorPlans, ...registryOnlyPlans].map((plan) => {
    const item = createReportItem(plan, snapshots, env);

    return plan.internal ? { ...item, sourceRecords: [...item.sourceRecords, ...internalFacts.filter((fact) => fact.startsWith(plan.connectorId))] } : item;
  }).sort((a, b) => a.roiPriority - b.roiPriority || a.connectorName.localeCompare(b.connectorName));
  const totals = {
    connectors: connectors.length,
    connected: connectors.filter((connector) => connector.status === "connected").length,
    internalReady: connectors.filter((connector) => connector.status === "internal_ready").length,
    credentialsMissing: connectors.filter((connector) => connector.status === "credentials_missing").length,
    dataGaps: connectors.filter((connector) => connector.status === "data_gap").length,
    registryOnly: connectors.filter((connector) => connector.status === "registry_only").length,
  };
  const dataGaps = connectors
    .filter((connector) => connector.status !== "connected" && connector.status !== "internal_ready")
    .map((connector) => `${connector.connectorName}: ${connector.lastFailure ?? connector.nextRequiredAction}`);

  return {
    ok: true,
    generatedAt: now,
    summary: `${totals.connected} provider connector(s) have successful read evidence, ${totals.internalReady} internal source(s) are ready, and ${totals.credentialsMissing + totals.dataGaps} connector(s) need credentials or data-gap cleanup.`,
    totals,
    connectors,
    dataGaps,
    featureFlags: getFeatureFlagSnapshot(),
    safetyFlags: connectorActivationSafetyFlags,
    providerCalled: false,
    liveExecutionAllowed: false,
    workflowStarted: false,
    published: false,
    sent: false,
  };
}

export async function createConnectorActivationReport(env: NodeJS.ProcessEnv = process.env): Promise<ConnectorActivationReport> {
  const [snapshots, leads] = await Promise.all([getLatestBusinessSnapshots(40), listDbLeads()]);

  return createConnectorActivationReportFromInputs({ snapshots, leads, env });
}
