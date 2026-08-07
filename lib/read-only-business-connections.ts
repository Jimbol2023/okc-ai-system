import { getConnectorHealth } from "@/lib/connector-platform";
import { getFeatureFlagSnapshot, isFeatureEnabled, type FeatureFlagKey } from "@/lib/feature-flags";
import { listDbLeads } from "@/lib/leads-db";
import { prisma } from "@/lib/prisma";
import { publicSiteUrl } from "@/lib/public-seo";
import { getRevenuePipelineSummary } from "@/lib/revenue-pipeline";
import { runUeipGa4Gateway, runUeipGbpGateway, runUeipGoogleWorkspaceGateway, runUeipSearchConsoleGateway, type UeipExecutionContext } from "@/lib/ueip-runtime-gateway";
import { requireTenantId } from "@/lib/tenant-context";

export const readOnlyBusinessSafetyFlags = {
  readOnly: true,
  providerWrite: false,
  sent: false,
  published: false,
  scraping: false,
  crmMutation: false,
  outreach: false,
  externalExecutionAllowed: false,
  liveExecutionAllowed: false,
  externalWritesBlocked: true,
  publishingBlocked: true,
  emailSendingBlocked: true,
  smsBlocked: true,
  adsBlocked: true,
  crmMutationBlocked: true,
  providerExecutionBlocked: true,
  oauthWritesBlocked: true,
} as const;

export type BusinessSnapshotStatus = "fresh" | "partial" | "stale" | "data_gap" | "blocked";
export type BusinessDataCategory =
  | "gmail_inbox"
  | "google_calendar_events"
  | "google_drive_documents"
  | "search_console_performance"
  | "search_console_indexing"
  | "google_analytics_traffic"
  | "google_business_profile_performance"
  | "google_business_profile_reviews"
  | "youtube_channel"
  | "canva_designs"
  | "internal_website_lead_intake"
  | "internal_lead_database"
  | "internal_crm"
  | "internal_property_pipeline";

export type BusinessDataSnapshotRecord = {
  id?: string;
  tenantId: string;
  version?: number;
  contractVersion?: "business-data-snapshot-v1";
  evidenceHash?: string | null;
  observationStart?: Date | string | null;
  observationEnd?: Date | string | null;
  traceId?: string | null;
  reliability?: Record<string, unknown> | null;
  snapshotDate: Date | string;
  provider: string;
  connectorId: string;
  category: BusinessDataCategory | string;
  status: BusinessSnapshotStatus | string;
  sourceLabel: string;
  provenance: string;
  freshness: string;
  summary: string;
  metrics: Record<string, unknown>;
  records: Array<Record<string, unknown>>;
  dataGaps: string[];
  assumptions: string[];
  safetyFlags: typeof readOnlyBusinessSafetyFlags;
  providerCalled: boolean;
  sent: false;
  published: false;
  crmMutated: false;
  liveExecutionAllowed: false;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export type DepartmentLiveRecommendation = {
  department: "Marketing" | "SEO" | "Content" | "Brand" | "Lead Intelligence" | "Revenue" | "Operations";
  title: string;
  recommendation: string;
  sourceLabel: string;
  confidence: number;
  dataGaps: string[];
  approvalRequired: true;
  providerCalled: boolean;
  liveExecutionAllowed: false;
};

export type LiveMorningBrief = {
  greeting: "Good Morning Moses";
  generatedAt: string;
  overnightSummary: string[];
  todayPriorities: string[];
  estimatedCeoTimeMinutes: number;
  sourceLabels: string[];
  dataGaps: string[];
  departmentRecommendations: DepartmentLiveRecommendation[];
  connectorHealth: Array<{
    connectorId: string;
    displayName: string;
    healthStatus: string;
    lastSuccessfulRead: string | null;
    lastDataGap: string | null;
    providerCalled: boolean;
    liveExecutionAllowed: false;
  }>;
  featureFlags: ReturnType<typeof getFeatureFlagSnapshot>;
  providerCalled: boolean;
  liveExecutionAllowed: false;
  safetyFlags: typeof readOnlyBusinessSafetyFlags;
};

export type ReadOnlySyncReport = {
  ok: true;
  generatedAt: string;
  snapshots: BusinessDataSnapshotRecord[];
  morningBrief: LiveMorningBrief;
  integrationsCompleted: string[];
  businessSystemsConnected: string[];
  dataGaps: string[];
  providerCalled: boolean;
  liveExecutionAllowed: false;
  safetyFlags: typeof readOnlyBusinessSafetyFlags;
};

export type ReadOnlySyncOptions = {
  categories?: BusinessDataCategory[];
  persistDailyBriefing?: boolean;
  syncMode?: "all_readonly" | "week1_level1_ordered";
  allowProviderReads?: boolean;
};

type SnapshotDb = typeof prisma & {
  businessDataSnapshot: {
    upsert(args: unknown): Promise<BusinessDataSnapshotRecord>;
    findMany(args?: unknown): Promise<BusinessDataSnapshotRecord[]>;
  };
  dailyBriefingSnapshot: {
    create(args: unknown): Promise<unknown>;
    findFirst(args?: unknown): Promise<{ panels?: unknown; createdAt?: Date | string } | null>;
  };
};

type FetchLike = typeof fetch;
type OAuthProvider = "google" | "canva";

export type AdapterDefinition = {
  id: BusinessDataCategory;
  provider: string;
  connectorId: string;
  featureFlags: FeatureFlagKey[];
  requiredEnv: string[];
  requiredScopes?: string[];
  oauthProvider: OAuthProvider;
  approvedRequests: Array<{ method: "GET" | "POST"; urlIncludes: string }>;
  ueipManaged?: boolean;
  run: (context: AdapterContext) => Promise<BusinessDataSnapshotRecord>;
};

type AdapterContext = {
  accessToken: string;
  fetcher: FetchLike;
  snapshotDate: Date;
  now: Date;
  env: NodeJS.ProcessEnv;
  executionContext: UeipExecutionContext;
};

export const week1Level1ReadOnlyCategories = Object.freeze([
  "internal_website_lead_intake",
  "internal_lead_database",
  "internal_crm",
  "internal_property_pipeline",
  "gmail_inbox",
  "google_calendar_events",
  "google_drive_documents",
  "google_analytics_traffic",
] satisfies BusinessDataCategory[]);

const week1Level1ReadOnlyCategorySet = new Set<BusinessDataCategory>(week1Level1ReadOnlyCategories);

let db = prisma as unknown as SnapshotDb;
let fetcher: FetchLike = fetch;
let internalLeadLoader = listDbLeads;

export function setReadOnlyBusinessConnectionsDbForTest(testDb: SnapshotDb) {
  db = testDb;

  return () => {
    db = prisma as unknown as SnapshotDb;
  };
}

export function setReadOnlyBusinessConnectionsFetchForTest(testFetch: FetchLike) {
  fetcher = testFetch;

  return () => {
    fetcher = fetch;
  };
}

export function setReadOnlyBusinessConnectionsLeadLoaderForTest(testLeadLoader: typeof listDbLeads) {
  internalLeadLoader = testLeadLoader;

  return () => {
    internalLeadLoader = listDbLeads;
  };
}

function dayStart(date = new Date()) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function dateOnly(date: Date) {
  return date.toISOString().slice(0, 10);
}

function daysAgo(days: number, from = new Date()) {
  const next = new Date(from);
  next.setUTCDate(next.getUTCDate() - days);

  return dateOnly(next);
}

function hasEnv(env: NodeJS.ProcessEnv, keys: string[]) {
  return keys.every((key) => Boolean(env[key]?.trim()) && !env[key]?.includes("replace-with"));
}

function envGap(keys: string[]) {
  return `Missing required read-only credential/configuration: ${keys.join(", ")}.`;
}

function hasRequiredScopeEvidence(env: NodeJS.ProcessEnv, requiredScopes: string[] = []) {
  if (requiredScopes.length === 0) return true;
  const grantedScopes = new Set(
    `${env.GOOGLE_OAUTH_GRANTED_SCOPES ?? ""} ${env.GOOGLE_GRANTED_SCOPES ?? ""}`
      .split(/[\s,]+/)
      .map((scope) => scope.trim())
      .filter(Boolean),
  );
  return requiredScopes.every((scope) => grantedScopes.has(scope));
}

function safeScopeLabels(requiredScopes: string[] = []) {
  return requiredScopes.map((scope) => scope.split("/").pop() ?? "required_readonly_scope");
}

function baseSnapshot(input: {
  snapshotDate: Date;
  provider: string;
  connectorId: string;
  category: BusinessDataCategory;
  status: BusinessSnapshotStatus;
  sourceLabel: string;
  provenance: string;
  freshness?: string;
  summary: string;
  metrics?: Record<string, unknown>;
  records?: Array<Record<string, unknown>>;
  dataGaps?: string[];
  assumptions?: string[];
  observationStart?: Date | string | null;
  observationEnd?: Date | string | null;
  traceId?: string | null;
  reliability?: Record<string, unknown> | null;
  providerCalled?: boolean;
}): BusinessDataSnapshotRecord {
  return {
    tenantId: "unpersisted",
    snapshotDate: input.snapshotDate,
    provider: input.provider,
    connectorId: input.connectorId,
    category: input.category,
    status: input.status,
    sourceLabel: input.sourceLabel,
    provenance: input.provenance,
    freshness: input.freshness ?? new Date().toISOString(),
    summary: input.summary,
    metrics: input.metrics ?? {},
    records: input.records ?? [],
    dataGaps: input.dataGaps ?? [],
    assumptions: [
      "Read-only provider snapshot; verify business decisions before action.",
      "No provider writes, publishing, email/SMS, ads, or CRM mutation are authorized.",
      ...(input.assumptions ?? []),
    ],
    safetyFlags: readOnlyBusinessSafetyFlags,
    providerCalled: input.providerCalled ?? false,
    sent: false,
    published: false,
    crmMutated: false,
    liveExecutionAllowed: false,
    observationStart: input.observationStart ?? null,
    observationEnd: input.observationEnd ?? null,
    traceId: input.traceId ?? null,
    reliability: input.reliability ?? null,
  };
}

function dataGapSnapshot(definition: AdapterDefinition, snapshotDate: Date, dataGaps: string[]) {
  return baseSnapshot({
    snapshotDate,
    provider: definition.provider,
    connectorId: definition.connectorId,
    category: definition.id,
    status: "data_gap",
    sourceLabel: `${definition.connectorId}:${definition.id}:data_gap`,
    provenance: "Configuration, feature flag, scope, or provider access was not ready; no live provider read was attempted.",
    summary: `${definition.provider} ${definition.id.replaceAll("_", " ")} is not connected yet.`,
    dataGaps,
  });
}

function withExecutionEvidence(snapshot: BusinessDataSnapshotRecord, executionContext: UeipExecutionContext, now: Date) {
  return {
    ...snapshot,
    observationStart: snapshot.observationStart ?? snapshot.snapshotDate,
    observationEnd: snapshot.observationEnd ?? now,
    traceId: snapshot.traceId ?? executionContext.traceId,
    reliability: snapshot.reliability ?? {
      status: snapshot.status === "fresh" ? "verified" : "advisory",
      providerCalled: snapshot.providerCalled,
      dataGapCount: snapshot.dataGaps.length,
    },
  } satisfies BusinessDataSnapshotRecord;
}

async function readJson(response: Response) {
  const text = await response.text();

  if (!text) return {};

  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return { unparsed: true };
  }
}

async function providerFetch(context: AdapterContext, url: string, init?: RequestInit) {
  const method = (init?.method ?? "GET").toUpperCase();
  if (!["GET", "POST"].includes(method)) {
    throw new Error(`Read-only adapter attempted forbidden HTTP method: ${method}`);
  }

  return context.fetcher(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${context.accessToken}`,
      Accept: "application/json",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });
}

async function refreshAccessToken(provider: OAuthProvider, env: NodeJS.ProcessEnv, activeFetch: FetchLike) {
  const config =
    provider === "google"
      ? {
          tokenUrl: "https://oauth2.googleapis.com/token",
          clientId: env.GOOGLE_OAUTH_CLIENT_ID,
          clientSecret: env.GOOGLE_OAUTH_CLIENT_SECRET,
          refreshToken: env.GOOGLE_OAUTH_REFRESH_TOKEN,
        }
      : {
          tokenUrl: "https://api.canva.com/rest/v1/oauth/token",
          clientId: env.CANVA_OAUTH_CLIENT_ID,
          clientSecret: env.CANVA_OAUTH_CLIENT_SECRET,
          refreshToken: env.CANVA_OAUTH_REFRESH_TOKEN,
        };

  if (!config.clientId || !config.clientSecret || !config.refreshToken) {
    throw new Error(`${provider} OAuth refresh token configuration is missing.`);
  }

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: config.clientId,
    client_secret: config.clientSecret,
    refresh_token: config.refreshToken,
  });
  const response = await activeFetch(config.tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
    body,
  });
  const json = await readJson(response);
  const accessToken = typeof json.access_token === "string" ? json.access_token : "";

  if (!response.ok || !accessToken) {
    throw new Error(`${provider} OAuth token refresh failed with status ${response.status}.`);
  }

  return accessToken;
}

function rowsFromTable(json: Record<string, unknown>) {
  const headers = Array.isArray(json.columnHeaders) ? json.columnHeaders : [];
  const rows = Array.isArray(json.rows) ? json.rows : [];

  return rows.map((row) => {
    const values = Array.isArray(row) ? row : [];

    return Object.fromEntries(
      headers.map((header, index) => {
        const name = typeof (header as { name?: unknown }).name === "string" ? (header as { name: string }).name : `column_${index}`;

        return [name, values[index]];
      }),
    );
  });
}

async function gmailInbox(context: AdapterContext) {
  const observationStart = new Date(context.now.getTime() - 48 * 60 * 60 * 1000).toISOString();
  const observationEnd = context.now.toISOString();
  const gateway = await runUeipGoogleWorkspaceGateway({ context: context.executionContext, request: { connectorId: "gmail", capabilityKey: "gmail.inbox.metadata.read", capabilityVersion: "1.0.0", parameters: { observationStart, observationEnd, rowLimit: 5 }, freshnessSeconds: 300, idempotencyKey: `gmail:inbox:${observationStart.slice(0, 10)}:${observationEnd.slice(0, 13)}` }, env: context.env });
  const signals = gateway.ok ? gateway.result.signals : {};
  const records = Array.isArray(signals.messages) ? signals.messages as Array<Record<string, unknown>> : [];

  return baseSnapshot({
    snapshotDate: context.snapshotDate,
    provider: "Google Workspace",
    connectorId: "gmail",
    category: "gmail_inbox",
    status: gateway.ok && gateway.providerCalled ? "fresh" : gateway.ok ? "partial" : "data_gap",
    sourceLabel: gateway.ok ? gateway.result.sourceLabel : "ueip:gmail:inbox:data_gap",
    provenance: gateway.ok ? gateway.result.provenance : "UEIP blocked the Gmail read before a safe normalized result was available.",
    summary: `${records.length} recent inbox message(s) visible for CEO review.`,
    metrics: { recentInboxMessages: records.length, actionableMessageSignals: typeof signals.actionableMessageSignals === "number" ? signals.actionableMessageSignals : 0, traceId: gateway.traceId },
    records,
    dataGaps: gateway.ok ? gateway.result.dataGaps : gateway.dataGaps,
    observationStart: gateway.ok ? gateway.result.observationWindow?.startDate ?? observationStart : observationStart,
    observationEnd: gateway.ok ? gateway.result.observationWindow?.endDate ?? observationEnd : observationEnd,
    traceId: gateway.traceId,
    reliability: gateway.ok ? gateway.result.reliability : { status: gateway.healthStatus },
    providerCalled: gateway.providerCalled,
  });
}

async function calendarEvents(context: AdapterContext) {
  const timeMin = context.now.toISOString();
  const timeMax = new Date(context.now.getTime() + 36 * 60 * 60 * 1000).toISOString();
  const gateway = await runUeipGoogleWorkspaceGateway({ context: context.executionContext, request: { connectorId: "google_calendar", capabilityKey: "calendar.events.read", capabilityVersion: "1.0.0", parameters: { observationStart: timeMin, observationEnd: timeMax, rowLimit: 10 }, freshnessSeconds: 300, idempotencyKey: `calendar:events:${timeMin.slice(0, 13)}` }, env: context.env });
  const signals = gateway.ok ? gateway.result.signals : {};
  const records = Array.isArray(signals.events) ? signals.events as Array<Record<string, unknown>> : [];

  return baseSnapshot({
    snapshotDate: context.snapshotDate,
    provider: "Google Workspace",
    connectorId: "google_calendar",
    category: "google_calendar_events",
    status: gateway.ok && gateway.providerCalled ? "fresh" : gateway.ok ? "partial" : "data_gap",
    sourceLabel: gateway.ok ? gateway.result.sourceLabel : "ueip:google_calendar:events:data_gap",
    provenance: gateway.ok ? gateway.result.provenance : "UEIP blocked the Calendar read before a safe normalized result was available.",
    summary: `${records.length} upcoming calendar event(s) found.`,
    metrics: { upcomingEvents: records.length, schedulingConflicts: typeof signals.schedulingConflicts === "number" ? signals.schedulingConflicts : 0, traceId: gateway.traceId },
    records,
    dataGaps: gateway.ok ? gateway.result.dataGaps : gateway.dataGaps,
    observationStart: gateway.ok ? gateway.result.observationWindow?.startDate ?? timeMin : timeMin,
    observationEnd: gateway.ok ? gateway.result.observationWindow?.endDate ?? timeMax : timeMax,
    traceId: gateway.traceId,
    reliability: gateway.ok ? gateway.result.reliability : { status: gateway.healthStatus },
    providerCalled: gateway.providerCalled,
  });
}

async function driveDocuments(context: AdapterContext) {
  const observationStart = new Date(context.now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const observationEnd = context.now.toISOString();
  const gateway = await runUeipGoogleWorkspaceGateway({ context: context.executionContext, request: { connectorId: "google_drive", capabilityKey: "drive.metadata.read", capabilityVersion: "1.0.0", parameters: { observationStart, observationEnd, rowLimit: 10 }, freshnessSeconds: 300, idempotencyKey: `drive:metadata:${observationStart.slice(0, 10)}:${observationEnd.slice(0, 13)}` }, env: context.env });
  const signals = gateway.ok ? gateway.result.signals : {};
  const records = Array.isArray(signals.documents) ? signals.documents as Array<Record<string, unknown>> : [];

  return baseSnapshot({
    snapshotDate: context.snapshotDate,
    provider: "Google Workspace",
    connectorId: "google_drive",
    category: "google_drive_documents",
    status: gateway.ok && gateway.providerCalled ? "fresh" : gateway.ok ? "partial" : "data_gap",
    sourceLabel: gateway.ok ? gateway.result.sourceLabel : "ueip:google_drive:metadata:data_gap",
    provenance: gateway.ok ? gateway.result.provenance : "UEIP blocked the Drive metadata read before a safe normalized result was available.",
    summary: `${records.length} recent Drive document(s) found.`,
    metrics: { recentDocuments: records.length, relevantDocumentActivity: typeof signals.relevantDocumentActivity === "number" ? signals.relevantDocumentActivity : 0, traceId: gateway.traceId },
    records,
    dataGaps: gateway.ok ? gateway.result.dataGaps : gateway.dataGaps,
    observationStart: gateway.ok ? gateway.result.observationWindow?.startDate ?? observationStart : observationStart,
    observationEnd: gateway.ok ? gateway.result.observationWindow?.endDate ?? observationEnd : observationEnd,
    traceId: gateway.traceId,
    reliability: gateway.ok ? gateway.result.reliability : { status: gateway.healthStatus },
    providerCalled: gateway.providerCalled,
  });
}

async function searchConsolePerformance(context: AdapterContext) {
  const siteUrl = context.env.GOOGLE_SEARCH_CONSOLE_SITE_URL || publicSiteUrl;
  const endDate = daysAgo(3, context.now);
  const startDate = daysAgo(7, new Date(`${endDate}T00:00:00.000Z`));
  const gateway = await runUeipSearchConsoleGateway({
    context: context.executionContext,
    request: {
      connectorId: "google_search_console",
      capabilityKey: "seo.page.performance.read",
      capabilityVersion: "1.0.0",
      parameters: { siteUrl, startDate, endDate, rowLimit: 10 },
      freshnessSeconds: 300,
      idempotencyKey: `search-console:page:${siteUrl}:${startDate}:${endDate}`,
    },
    env: context.env,
  });
  const signals = gateway.ok ? gateway.result.signals : {};
  const records = Array.isArray(signals.pages) ? (signals.pages as Array<Record<string, unknown>>) : [];
  const clicks = typeof signals.clicks === "number" ? signals.clicks : 0;
  const impressions = typeof signals.impressions === "number" ? signals.impressions : 0;

  return baseSnapshot({
    snapshotDate: context.snapshotDate,
    provider: "Google Search Console",
    connectorId: "google_search_console",
    category: "search_console_performance",
    status: gateway.ok && gateway.providerCalled ? "fresh" : gateway.ok ? "partial" : "data_gap",
    sourceLabel: gateway.ok ? gateway.result.sourceLabel : "ueip:search_console:page_performance:data_gap",
    provenance: gateway.ok ? gateway.result.provenance : "UEIP blocked the provider read before a safe normalized result was available.",
    summary: `${impressions} impression(s) and ${clicks} click(s) across top pages.`,
    metrics: { clicks, impressions, topPages: records.length, traceId: gateway.traceId, reliability: gateway.ok ? gateway.result.reliability.status : gateway.healthStatus },
    records,
    dataGaps: gateway.ok ? gateway.result.dataGaps : gateway.dataGaps,
    assumptions: ["Search Console data is admitted only after UEIP tenant, policy, audit, adapter, and normalization gates."],
    providerCalled: gateway.providerCalled,
  });
}

async function searchConsoleIndexing(context: AdapterContext) {
  const siteUrl = context.env.GOOGLE_SEARCH_CONSOLE_SITE_URL || publicSiteUrl;
  const inspectionUrl = `${publicSiteUrl}/resources/inherited-property-oklahoma`;
  const gateway = await runUeipSearchConsoleGateway({
    context: context.executionContext,
    request: {
      connectorId: "google_search_console",
      capabilityKey: "seo.indexing.summary.read",
      capabilityVersion: "1.0.0",
      parameters: { siteUrl, inspectionUrl },
      freshnessSeconds: 300,
      idempotencyKey: `search-console:indexing:${siteUrl}:${inspectionUrl}`,
    },
    env: context.env,
  });
  const result = gateway.ok ? gateway.result.signals : {};

  return baseSnapshot({
    snapshotDate: context.snapshotDate,
    provider: "Google Search Console",
    connectorId: "google_search_console",
    category: "search_console_indexing",
    status: gateway.ok && gateway.providerCalled ? "fresh" : gateway.ok ? "partial" : "data_gap",
    sourceLabel: gateway.ok ? gateway.result.sourceLabel : "ueip:search_console:indexing_summary:data_gap",
    provenance: gateway.ok ? gateway.result.provenance : "UEIP blocked the provider read before a safe normalized result was available.",
    summary: gateway.ok ? "Index inspection snapshot is available for the approved probate resource page." : "Index inspection could not be loaded.",
    metrics: { verdict: result.verdict, coverageState: result.coverageState, robotsTxtState: result.robotsTxtState },
    records: [{ inspectionUrl, siteUrl, ...result }],
    dataGaps: gateway.ok ? gateway.result.dataGaps : gateway.dataGaps,
    assumptions: ["Search Console data is admitted only after UEIP tenant, policy, audit, adapter, and normalization gates."],
    providerCalled: gateway.providerCalled,
  });
}

async function ga4Traffic(context: AdapterContext) {
  const propertyId = context.env.GOOGLE_ANALYTICS_PROPERTY_ID || "";
  const startDate = daysAgo(9, context.now);
  const endDate = daysAgo(2, context.now);
  const gateway = await runUeipGa4Gateway({
    context: context.executionContext,
    request: {
      connectorId: "google_analytics",
      capabilityKey: "analytics.page.performance.read",
      capabilityVersion: "1.0.0",
      parameters: { propertyId, startDate, endDate, rowLimit: 10 },
      freshnessSeconds: 300,
      idempotencyKey: `ga4:page:${propertyId}:${startDate}:${endDate}`,
    },
    env: context.env,
  });
  const signals = gateway.ok ? gateway.result.signals : {};
  const records = Array.isArray(signals.pages) ? (signals.pages as Array<Record<string, unknown>>) : [];
  const sessions = typeof signals.sessions === "number" ? signals.sessions : 0;
  const activeUsers = typeof signals.activeUsers === "number" ? signals.activeUsers : 0;
  const pageViews = typeof signals.pageViews === "number" ? signals.pageViews : 0;
  const keyEvents = typeof signals.keyEvents === "number" ? signals.keyEvents : 0;

  return baseSnapshot({
    snapshotDate: context.snapshotDate,
    provider: "Google Analytics",
    connectorId: "google_analytics",
    category: "google_analytics_traffic",
    status: gateway.ok && gateway.providerCalled ? "fresh" : gateway.ok ? "partial" : "data_gap",
    sourceLabel: gateway.ok ? gateway.result.sourceLabel : "ueip:ga4:page_performance:data_gap",
    provenance: gateway.ok ? gateway.result.provenance : "UEIP blocked the GA4 provider read before a safe normalized result was available.",
    freshness: gateway.ok ? gateway.result.freshness : context.now.toISOString(),
    summary: `${sessions} session(s), ${activeUsers} active user(s), and ${keyEvents} key event(s) across top GA4 pages.`,
    metrics: {
      sessions,
      activeUsers,
      pageViews,
      keyEvents,
      conversions: keyEvents,
      topPages: records.length,
      traceId: gateway.traceId,
      reliability: gateway.ok ? gateway.result.reliability.status : gateway.healthStatus,
    },
    records,
    dataGaps: gateway.ok ? gateway.result.dataGaps : gateway.dataGaps,
    assumptions: ["GA4 data is admitted only after UEIP tenant, policy, audit, adapter, and normalization gates.", "GA4 key events are treated as conversion-readiness context, not proof of closed revenue."],
    observationStart: `${gateway.ok ? gateway.result.observationWindow?.startDate ?? startDate : startDate}T00:00:00.000Z`,
    observationEnd: `${gateway.ok ? gateway.result.observationWindow?.endDate ?? endDate : endDate}T23:59:59.999Z`,
    traceId: gateway.traceId,
    reliability: gateway.ok ? gateway.result.reliability : { status: gateway.healthStatus },
    providerCalled: gateway.providerCalled,
  });
}

async function googleBusinessProfilePerformance(context: AdapterContext) {
  const locationName = context.env.GOOGLE_BUSINESS_PROFILE_LOCATION_ID?.trim() || "";
  const endDate = daysAgo(2, context.now);
  const startDate = daysAgo(9, context.now);
  const gateway = await runUeipGbpGateway({
    context: context.executionContext,
    request: { connectorId: "google_business_profile", capabilityKey: "gbp.performance.read", capabilityVersion: "1.0.0", parameters: { locationName, startDate, endDate, rowLimit: 10 }, freshnessSeconds: 900, idempotencyKey: `gbp:performance:${locationName}:${startDate}:${endDate}` },
    env: context.env,
  });
  const signals = gateway.ok ? gateway.result.signals : {};
  const records = Array.isArray(signals.performance) ? signals.performance as Array<Record<string, unknown>> : [];
  const impressions = typeof signals.impressions === "number" ? signals.impressions : 0;
  const callClicks = typeof signals.callClicks === "number" ? signals.callClicks : 0;
  const directionRequests = typeof signals.directionRequests === "number" ? signals.directionRequests : 0;

  return baseSnapshot({
    snapshotDate: context.snapshotDate,
    provider: "Google Business Profile",
    connectorId: "google_business_profile",
    category: "google_business_profile_performance",
    status: gateway.ok && gateway.providerCalled ? "fresh" : gateway.ok ? "partial" : "data_gap",
    sourceLabel: gateway.ok ? gateway.result.sourceLabel : "ueip:gbp:performance:data_gap",
    provenance: gateway.ok ? gateway.result.provenance : "UEIP blocked the GBP provider read before a safe normalized result was available.",
    freshness: gateway.ok ? gateway.result.freshness : context.now.toISOString(),
    summary: `Google Business Profile performance returned ${records.length} metric series, ${callClicks} call click(s), and ${directionRequests} direction request(s).`,
    metrics: { metricSeries: records.length, impressions, callClicks, directionRequests, traceId: gateway.traceId, reliability: gateway.ok ? gateway.result.reliability.status : gateway.healthStatus },
    records,
    dataGaps: gateway.ok ? gateway.result.dataGaps : gateway.dataGaps,
    assumptions: ["GBP performance evidence is local visibility context only and does not authorize profile edits, posts, review replies, or outreach."],
    observationStart: gateway.ok ? gateway.result.observationWindow?.startDate ?? startDate : startDate,
    observationEnd: gateway.ok ? gateway.result.observationWindow?.endDate ?? endDate : endDate,
    traceId: gateway.traceId,
    reliability: gateway.ok ? gateway.result.reliability : { status: gateway.healthStatus },
    providerCalled: gateway.providerCalled,
  });
}

async function googleBusinessProfileReviews(context: AdapterContext) {
  const locationName = context.env.GOOGLE_BUSINESS_PROFILE_LOCATION_ID?.trim() || "";
  if (!locationName.startsWith("accounts/") || !locationName.includes("/locations/")) {
    return baseSnapshot({
      snapshotDate: context.snapshotDate,
      provider: "Google Business Profile",
      connectorId: "google_business_profile",
      category: "google_business_profile_reviews",
      status: "data_gap",
      sourceLabel: "google_business_profile:reviews:configuration_gap",
      provenance: "Review reads require a full Business Profile account/location resource name.",
      summary: "Google Business Profile reviews are not connected because the account resource was not configured.",
      dataGaps: ["Set GOOGLE_BUSINESS_PROFILE_LOCATION_ID to accounts/{accountId}/locations/{locationId} to enable review reads."],
    });
  }
  const endDate = daysAgo(2, context.now);
  const startDate = daysAgo(32, context.now);
  const gateway = await runUeipGbpGateway({
    context: context.executionContext,
    request: { connectorId: "google_business_profile", capabilityKey: "gbp.reviews.read", capabilityVersion: "1.0.0", parameters: { locationName, startDate, endDate, rowLimit: 10 }, freshnessSeconds: 900, idempotencyKey: `gbp:reviews:${locationName}:${startDate}:${endDate}` },
    env: context.env,
  });
  const signals = gateway.ok ? gateway.result.signals : {};
  const records = Array.isArray(signals.reviews) ? signals.reviews as Array<Record<string, unknown>> : [];
  const reviews = records.length;

  return baseSnapshot({
    snapshotDate: context.snapshotDate,
    provider: "Google Business Profile",
    connectorId: "google_business_profile",
    category: "google_business_profile_reviews",
    status: gateway.ok && gateway.providerCalled ? "fresh" : gateway.ok ? "partial" : "data_gap",
    sourceLabel: gateway.ok ? gateway.result.sourceLabel : "ueip:gbp:reviews:data_gap",
    provenance: gateway.ok ? gateway.result.provenance : "UEIP blocked the GBP review read before a safe normalized result was available.",
    freshness: gateway.ok ? gateway.result.freshness : context.now.toISOString(),
    summary: `${records.length} recent Google review(s) visible.`,
    metrics: { reviews, reviewRows: records.length, traceId: gateway.traceId, reliability: gateway.ok ? gateway.result.reliability.status : gateway.healthStatus },
    records,
    dataGaps: gateway.ok ? gateway.result.dataGaps : gateway.dataGaps,
    assumptions: ["GBP review evidence is read-only context; replies, profile changes, and outreach remain blocked."],
    observationStart: gateway.ok ? gateway.result.observationWindow?.startDate ?? startDate : startDate,
    observationEnd: gateway.ok ? gateway.result.observationWindow?.endDate ?? endDate : endDate,
    traceId: gateway.traceId,
    reliability: gateway.ok ? gateway.result.reliability : { status: gateway.healthStatus },
    providerCalled: gateway.providerCalled,
  });
}

async function youtubeChannel(context: AdapterContext) {
  const channelId = context.env.YOUTUBE_CHANNEL_ID || "";
  const videosResponse = await providerFetch(context, `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${encodeURIComponent(channelId)}&order=date&type=video&maxResults=5`);
  const videosJson = await readJson(videosResponse);
  const analyticsUrl = new URL("https://youtubeanalytics.googleapis.com/v2/reports");
  analyticsUrl.searchParams.set("ids", `channel==${channelId}`);
  analyticsUrl.searchParams.set("startDate", daysAgo(8, context.now));
  analyticsUrl.searchParams.set("endDate", daysAgo(1, context.now));
  analyticsUrl.searchParams.set("metrics", "views,estimatedMinutesWatched");
  const analyticsResponse = await providerFetch(context, analyticsUrl.toString());
  const analyticsJson = await readJson(analyticsResponse);
  const videoItems = Array.isArray(videosJson.items) ? videosJson.items : [];
  const analyticsRows = rowsFromTable(analyticsJson);
  const records = videoItems.map((video) => {
    const item = video as { id?: { videoId?: string }; snippet?: { title?: string; publishedAt?: string } };

    return { videoId: item.id?.videoId, title: item.snippet?.title, publishedAt: item.snippet?.publishedAt };
  });

  return baseSnapshot({
    snapshotDate: context.snapshotDate,
    provider: "YouTube",
    connectorId: "youtube",
    category: "youtube_channel",
    status: videosResponse.ok && analyticsResponse.ok ? "fresh" : "partial",
    sourceLabel: "youtube:data_and_analytics:readonly",
    provenance: "YouTube Data API search.list and YouTube Analytics reports.query in read-only mode.",
    summary: `${records.length} recent YouTube video(s); analytics rows: ${analyticsRows.length}.`,
    metrics: { recentVideos: records.length, analyticsRows: analyticsRows.length, ...analyticsRows[0] },
    records,
    dataGaps: [videosResponse.ok ? "" : `YouTube Data API returned status ${videosResponse.status}.`, analyticsResponse.ok ? "" : `YouTube Analytics API returned status ${analyticsResponse.status}.`].filter(Boolean),
    providerCalled: true,
  });
}

async function canvaDesigns(context: AdapterContext) {
  const response = await providerFetch(context, "https://api.canva.com/rest/v1/designs?limit=20");
  const json = await readJson(response);
  const items = Array.isArray(json.items) ? json.items : [];
  const records = items.map((design) => {
    const item = design as { id?: string; title?: string; updated_at?: number | string; urls?: { edit_url?: string; view_url?: string } };

    return { id: item.id, title: item.title, updatedAt: item.updated_at, editUrl: item.urls?.edit_url, viewUrl: item.urls?.view_url };
  });

  return baseSnapshot({
    snapshotDate: context.snapshotDate,
    provider: "Canva",
    connectorId: "canva",
    category: "canva_designs",
    status: response.ok ? "fresh" : "partial",
    sourceLabel: "canva:designs:list:readonly",
    provenance: "Canva Connect designs list endpoint; no design creation, export, or publish.",
    summary: `${records.length} recent Canva design(s) visible.`,
    metrics: { recentDesigns: records.length },
    records,
    dataGaps: response.ok ? [] : [`Canva designs API returned status ${response.status}.`],
    providerCalled: true,
  });
}

export const readOnlyAdapterDefinitions: AdapterDefinition[] = [
  { id: "gmail_inbox", provider: "Google Workspace", connectorId: "gmail", featureFlags: ["connector_live_reads", "connector_google", "connector_communication", "ueip_gateway_enforcement"], requiredEnv: ["GOOGLE_OAUTH_CLIENT_ID", "GOOGLE_OAUTH_CLIENT_SECRET", "GOOGLE_OAUTH_REFRESH_TOKEN"], requiredScopes: ["https://www.googleapis.com/auth/gmail.readonly"], oauthProvider: "google", approvedRequests: [{ method: "GET", urlIncludes: "gmail.googleapis.com/gmail/v1/users/me/messages" }], ueipManaged: true, run: gmailInbox },
  { id: "google_calendar_events", provider: "Google Workspace", connectorId: "google_calendar", featureFlags: ["connector_live_reads", "connector_google", "ueip_gateway_enforcement"], requiredEnv: ["GOOGLE_OAUTH_CLIENT_ID", "GOOGLE_OAUTH_CLIENT_SECRET", "GOOGLE_OAUTH_REFRESH_TOKEN"], requiredScopes: ["https://www.googleapis.com/auth/calendar.events.readonly"], oauthProvider: "google", approvedRequests: [{ method: "GET", urlIncludes: "www.googleapis.com/calendar/v3/calendars/primary/events" }], ueipManaged: true, run: calendarEvents },
  { id: "google_drive_documents", provider: "Google Workspace", connectorId: "google_drive", featureFlags: ["connector_live_reads", "connector_google", "ueip_gateway_enforcement"], requiredEnv: ["GOOGLE_OAUTH_CLIENT_ID", "GOOGLE_OAUTH_CLIENT_SECRET", "GOOGLE_OAUTH_REFRESH_TOKEN"], requiredScopes: ["https://www.googleapis.com/auth/drive.metadata.readonly"], oauthProvider: "google", approvedRequests: [{ method: "GET", urlIncludes: "www.googleapis.com/drive/v3/files" }], ueipManaged: true, run: driveDocuments },
  { id: "search_console_performance", provider: "Google Search Console", connectorId: "google_search_console", featureFlags: ["connector_live_reads", "connector_google", "executive_briefings", "ueip_gateway_enforcement", "ueip_search_console_runtime"], requiredEnv: ["GOOGLE_SEARCH_CONSOLE_SITE_URL"], requiredScopes: ["https://www.googleapis.com/auth/webmasters.readonly"], oauthProvider: "google", approvedRequests: [{ method: "POST", urlIncludes: "www.googleapis.com/webmasters/v3/sites" }], ueipManaged: true, run: searchConsolePerformance },
  { id: "search_console_indexing", provider: "Google Search Console", connectorId: "google_search_console", featureFlags: ["connector_live_reads", "connector_google", "executive_briefings", "ueip_gateway_enforcement", "ueip_search_console_runtime"], requiredEnv: ["GOOGLE_SEARCH_CONSOLE_SITE_URL"], requiredScopes: ["https://www.googleapis.com/auth/webmasters.readonly"], oauthProvider: "google", approvedRequests: [{ method: "POST", urlIncludes: "searchconsole.googleapis.com/v1/urlInspection/index:inspect" }], ueipManaged: true, run: searchConsoleIndexing },
  { id: "google_analytics_traffic", provider: "Google Analytics", connectorId: "google_analytics", featureFlags: ["connector_live_reads", "connector_google", "executive_briefings", "ueip_gateway_enforcement", "ueip_ga4_runtime"], requiredEnv: ["GOOGLE_ANALYTICS_PROPERTY_ID"], requiredScopes: ["https://www.googleapis.com/auth/analytics.readonly"], oauthProvider: "google", approvedRequests: [{ method: "POST", urlIncludes: "analyticsdata.googleapis.com/v1beta/properties" }], ueipManaged: true, run: ga4Traffic },
  { id: "google_business_profile_performance", provider: "Google Business Profile", connectorId: "google_business_profile", featureFlags: ["connector_live_reads", "connector_google", "connector_marketing", "ueip_gateway_enforcement", "ueip_gbp_runtime"], requiredEnv: ["GOOGLE_BUSINESS_PROFILE_LOCATION_ID"], oauthProvider: "google", approvedRequests: [{ method: "GET", urlIncludes: "businessprofileperformance.googleapis.com/v1/locations" }], ueipManaged: true, run: googleBusinessProfilePerformance },
  { id: "google_business_profile_reviews", provider: "Google Business Profile", connectorId: "google_business_profile", featureFlags: ["connector_live_reads", "connector_google", "connector_marketing", "ueip_gateway_enforcement", "ueip_gbp_runtime"], requiredEnv: ["GOOGLE_BUSINESS_PROFILE_LOCATION_ID"], oauthProvider: "google", approvedRequests: [{ method: "GET", urlIncludes: "mybusiness.googleapis.com/v4/accounts" }], ueipManaged: true, run: googleBusinessProfileReviews },
  { id: "youtube_channel", provider: "YouTube", connectorId: "youtube", featureFlags: ["connector_live_reads", "connector_google", "connector_marketing"], requiredEnv: ["GOOGLE_OAUTH_CLIENT_ID", "GOOGLE_OAUTH_CLIENT_SECRET", "GOOGLE_OAUTH_REFRESH_TOKEN", "YOUTUBE_CHANNEL_ID"], oauthProvider: "google", approvedRequests: [{ method: "GET", urlIncludes: "www.googleapis.com/youtube/v3/search" }, { method: "GET", urlIncludes: "youtubeanalytics.googleapis.com/v2/reports" }], run: youtubeChannel },
  { id: "canva_designs", provider: "Canva", connectorId: "canva", featureFlags: ["connector_live_reads", "connector_marketing"], requiredEnv: ["CANVA_OAUTH_CLIENT_ID", "CANVA_OAUTH_CLIENT_SECRET", "CANVA_OAUTH_REFRESH_TOKEN"], oauthProvider: "canva", approvedRequests: [{ method: "GET", urlIncludes: "api.canva.com/rest/v1/designs" }], run: canvaDesigns },
];

export function listReadOnlyAdapterMetadata() {
  return readOnlyAdapterDefinitions.map((definition) => ({
    id: definition.id,
    provider: definition.provider,
    connectorId: definition.connectorId,
    featureFlags: definition.featureFlags,
    requiredEnv: definition.requiredEnv,
    requiredScopes: definition.requiredScopes ?? [],
    oauthProvider: definition.oauthProvider,
    approvedRequests: definition.approvedRequests,
    readOnly: true as const,
    liveExecutionAllowed: false as const,
  }));
}

export function validateReadOnlyAdapterDefinitions() {
  return readOnlyAdapterDefinitions.map((definition) => ({
    id: definition.id,
    connectorId: definition.connectorId,
    approvedRequests: definition.approvedRequests,
    forbiddenMethods: ["PUT", "PATCH", "DELETE"],
    liveExecutionAllowed: false,
    safetyFlags: readOnlyBusinessSafetyFlags,
  }));
}

async function runAdapter(definition: AdapterDefinition, env: NodeJS.ProcessEnv, snapshotDate: Date, now: Date, executionContext: UeipExecutionContext) {
  const disabledFlags = definition.featureFlags.filter((flag) => !isFeatureEnabled(flag));
  if (disabledFlags.length > 0) {
    return withExecutionEvidence(dataGapSnapshot(definition, snapshotDate, [`Feature flag(s) disabled: ${disabledFlags.join(", ")}.`]), executionContext, now);
  }

  if (!hasEnv(env, definition.requiredEnv)) {
    return withExecutionEvidence(dataGapSnapshot(definition, snapshotDate, [envGap(definition.requiredEnv)]), executionContext, now);
  }

  if (!hasRequiredScopeEvidence(env, definition.requiredScopes)) {
    return withExecutionEvidence(dataGapSnapshot(definition, snapshotDate, [`Missing required read-only OAuth scope evidence: ${safeScopeLabels(definition.requiredScopes).join(", ")}.`]), executionContext, now);
  }

  try {
    if (definition.ueipManaged) {
      return withExecutionEvidence(await definition.run({ accessToken: "", fetcher, snapshotDate, now, env, executionContext }), executionContext, now);
    }
    const accessToken = await refreshAccessToken(definition.oauthProvider, env, fetcher);

    return withExecutionEvidence(await definition.run({ accessToken, fetcher, snapshotDate, now, env, executionContext }), executionContext, now);
  } catch (error) {
    return withExecutionEvidence(baseSnapshot({
      snapshotDate,
      provider: definition.provider,
      connectorId: definition.connectorId,
      category: definition.id,
      status: "partial",
      sourceLabel: `${definition.connectorId}:${definition.id}:read_error`,
      provenance: "Read-only adapter attempted a governed provider read and failed safely.",
      summary: `${definition.provider} ${definition.id.replaceAll("_", " ")} could not be refreshed.`,
      dataGaps: [error instanceof Error ? error.message : "Unknown read-only adapter error."],
      providerCalled: true,
    }), executionContext, now);
  }
}

function readinessOnlySnapshot(definition: AdapterDefinition, env: NodeJS.ProcessEnv, snapshotDate: Date) {
  const dataGaps = ["Week 1 Level 1 certification is readiness-only for provider connectors; no provider call was attempted."];
  if (!hasEnv(env, definition.requiredEnv)) dataGaps.push(envGap(definition.requiredEnv));
  if (!hasRequiredScopeEvidence(env, definition.requiredScopes)) {
    dataGaps.push(`Missing required read-only OAuth scope evidence: ${safeScopeLabels(definition.requiredScopes).join(", ")}.`);
  }

  return dataGapSnapshot(definition, snapshotDate, dataGaps);
}

export function validateWeek1Level1ReadOnlyCategories(categories: BusinessDataCategory[]) {
  const forbidden = categories.filter((category) => !week1Level1ReadOnlyCategorySet.has(category));
  if (forbidden.length > 0) {
    throw new Error(`week1_level1_forbidden_readonly_category:${forbidden.join(",")}`);
  }

  return categories;
}

export type Week1Level1SnapshotVerification = {
  ok: boolean;
  freshCategories: BusinessDataCategory[];
  advisoryExceptions: string[];
  requiredFields: Array<keyof BusinessDataSnapshotRecord>;
};

export function verifyWeek1Level1Snapshots(tenantIdValue: string, snapshots: BusinessDataSnapshotRecord[]): Week1Level1SnapshotVerification {
  const tenantId = requireTenantId(tenantIdValue, "week1_snapshot_verification");
  const requiredFields: Array<keyof BusinessDataSnapshotRecord> = [
    "tenantId",
    "connectorId",
    "category",
    "observationStart",
    "observationEnd",
    "version",
    "contractVersion",
    "evidenceHash",
    "traceId",
    "reliability",
    "freshness",
  ];
  const advisoryExceptions: string[] = [];
  const freshCategories: BusinessDataCategory[] = [];

  for (const category of week1Level1ReadOnlyCategories) {
    const snapshot = snapshots.find((item) => item.category === category && item.tenantId === tenantId);
    if (!snapshot) {
      advisoryExceptions.push(`${category}: required Week 1 evidence is missing.`);
      continue;
    }

    const missingFields = requiredFields.filter((field) => {
      const value = snapshot[field];
      return value === undefined || value === null || value === "";
    });
    if (missingFields.length > 0) {
      advisoryExceptions.push(`${category}: evidence is advisory because required field(s) are missing: ${missingFields.join(", ")}.`);
    }

    if (snapshot.status === "fresh" && missingFields.length === 0) {
      freshCategories.push(category);
    } else if (snapshot.status === "fresh") {
      advisoryExceptions.push(`${category}: fresh status ignored until complete evidence is present.`);
    } else {
      advisoryExceptions.push(`${category}: ${snapshot.status} snapshot is an advisory data gap, not fresh evidence.`);
    }
  }

  return {
    ok: advisoryExceptions.length === 0,
    freshCategories,
    advisoryExceptions,
    requiredFields,
  };
}

async function persistSnapshot(snapshot: BusinessDataSnapshotRecord, activeTenantIdValue: string) {
  const activeTenantId = requireTenantId(activeTenantIdValue, "business_snapshot_persist");
  const evidenceMaterial = JSON.stringify({ connectorId: snapshot.connectorId, category: snapshot.category, status: snapshot.status, sourceLabel: snapshot.sourceLabel, freshness: snapshot.freshness, metrics: snapshot.metrics, records: snapshot.records, dataGaps: snapshot.dataGaps, assumptions: snapshot.assumptions });
  const evidenceHash = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(evidenceMaterial))), (byte) => byte.toString(16).padStart(2, "0")).join("");
  const tenantSnapshot = { ...snapshot, tenantId: activeTenantId, contractVersion: "business-data-snapshot-v1" as const, evidenceHash, traceId: snapshot.traceId ?? null, reliability: snapshot.reliability ?? null };
  return db.businessDataSnapshot.upsert({
    where: {
      tenantId_snapshotDate_provider_category: {
        tenantId: activeTenantId,
        snapshotDate: tenantSnapshot.snapshotDate,
        provider: tenantSnapshot.provider,
        category: tenantSnapshot.category,
      },
    },
    create: tenantSnapshot,
    update: {
      connectorId: snapshot.connectorId,
      status: snapshot.status,
      sourceLabel: snapshot.sourceLabel,
      provenance: snapshot.provenance,
      freshness: snapshot.freshness,
      summary: snapshot.summary,
      metrics: snapshot.metrics,
      records: snapshot.records,
      dataGaps: snapshot.dataGaps,
      assumptions: snapshot.assumptions,
      safetyFlags: snapshot.safetyFlags,
      providerCalled: snapshot.providerCalled,
      sent: false,
      published: false,
      crmMutated: false,
      liveExecutionAllowed: false,
      contractVersion: "business-data-snapshot-v1",
      evidenceHash,
      observationStart: snapshot.observationStart ?? null,
      observationEnd: snapshot.observationEnd ?? null,
      traceId: snapshot.traceId ?? null,
      reliability: snapshot.reliability ?? undefined,
      version: { increment: 1 },
    },
  }) as Promise<BusinessDataSnapshotRecord>;
}

async function createInternalBusinessSnapshots(snapshotDate: Date, activeTenantId: string): Promise<BusinessDataSnapshotRecord[]> {
  const tenantId = requireTenantId(activeTenantId, "internal_business_snapshot");
  const leads = await internalLeadLoader({ tenantId });
  const pipeline = getRevenuePipelineSummary(leads);
  const leadRecords = leads.slice(0, 10).map((lead) => ({
    id: lead.id,
    source: lead.source,
    status: lead.status,
    priority: lead.priority,
    score: lead.score,
    propertyAddress: lead.propertyAddress,
    nextFollowUpAt: lead.nextFollowUpAt ?? null,
    approvalStatus: lead.approvalStatus ?? null,
    doNotContact: Boolean(lead.doNotContact),
  }));
  const pipelineRecords = pipeline.workFirstLeads.slice(0, 10).map((item) => ({
    leadId: item.lead.id,
    source: item.lead.source,
    propertyAddress: item.lead.propertyAddress,
    bucket: item.bucket,
    urgency: item.urgency,
    monetizationRank: item.monetizationRank,
    nextMoneyAction: item.nextMoneyAction.label,
    blockers: item.blockers,
    bottlenecks: item.bottlenecks,
  }));
  const dataGaps = [
    leads.length === 0 ? "No stored leads are available in the internal lead database." : "",
    pipeline.missingValueReasons.length > 0 ? `Pipeline value gaps: ${pipeline.missingValueReasons.join(", ")}.` : "",
  ].filter(Boolean);

  return [
    baseSnapshot({
      snapshotDate,
      provider: "Website Lead Intake",
      connectorId: "website_lead_intake",
      category: "internal_website_lead_intake",
      status: leads.length > 0 ? "fresh" : "data_gap",
      sourceLabel: "website_lead_intake:persisted_leads:readonly",
      provenance: "Website lead intake persistence evidence derived from stored leads; no provider call, outreach, or CRM mutation.",
      summary: `${leads.length} persisted lead(s), ${leads.filter((lead) => Boolean(lead.source?.trim())).length} with source attribution, and ${leads.filter((lead) => lead.requiresHumanApproval !== false).length} approval-gated lead(s).`,
      metrics: {
        persistedLeads: leads.length,
        sourceAttributedLeads: leads.filter((lead) => Boolean(lead.source?.trim())).length,
        approvalGatedLeads: leads.filter((lead) => lead.requiresHumanApproval !== false).length,
      },
      records: leadRecords,
      dataGaps: leads.length > 0 ? [] : ["No persisted website lead intake records are available yet."],
      providerCalled: false,
    }),
    baseSnapshot({
      snapshotDate,
      provider: "Internal Lead Database",
      connectorId: "lead_database",
      category: "internal_lead_database",
      status: leads.length > 0 ? "fresh" : "data_gap",
      sourceLabel: "internal_crm:lead_database:readonly",
      provenance: "Internal lead database via listDbLeads; no provider call and no CRM mutation.",
      summary: `${leads.length} stored lead(s), ${leads.filter((lead) => lead.priority === "High").length} high-priority lead(s), and ${leads.filter((lead) => lead.status !== "closed").length} open lead(s).`,
      metrics: {
        totalLeads: leads.length,
        highPriorityLeads: leads.filter((lead) => lead.priority === "High").length,
        openLeads: leads.filter((lead) => lead.status !== "closed").length,
      },
      records: leadRecords,
      dataGaps: leads.length > 0 ? [] : ["No stored leads are available in the internal lead database."],
      providerCalled: false,
    }),
    baseSnapshot({
      snapshotDate,
      provider: "Internal CRM",
      connectorId: "crm",
      category: "internal_crm",
      status: leads.length > 0 ? "fresh" : "data_gap",
      sourceLabel: "internal_crm:stored_leads:readonly",
      provenance: "Internal CRM posture derived from stored leads; no CRM mutation, task creation, outreach, or provider call.",
      summary: `${pipeline.actionableLeads} actionable lead(s), ${pipeline.blockedLeads} blocked lead(s), and ${pipeline.hotOpportunities} hot opportunity signal(s).`,
      metrics: {
        actionableLeads: pipeline.actionableLeads,
        blockedLeads: pipeline.blockedLeads,
        hotOpportunities: pipeline.hotOpportunities,
        buyerReadyLeads: pipeline.buyerReadyLeads,
        nearContractLeads: pipeline.nearContractLeads,
      },
      records: pipelineRecords,
      dataGaps,
      providerCalled: false,
    }),
    baseSnapshot({
      snapshotDate,
      provider: "Internal Property Pipeline",
      connectorId: "property_pipeline",
      category: "internal_property_pipeline",
      status: pipeline.totalLeads > 0 ? "fresh" : "data_gap",
      sourceLabel: "internal_pipeline:revenue_pipeline:readonly",
      provenance: "Revenue pipeline summary from stored lead/property records; no external property lookup, scraping, or CRM mutation.",
      summary: `${pipeline.workFirstLeads.length} work-first item(s), ${pipeline.nearContractLeads} near-contract lead(s), estimated pipeline value ${pipeline.estimatedPipelineValueLabel}.`,
      metrics: {
        totalLeads: pipeline.totalLeads,
        workFirstLeads: pipeline.workFirstLeads.length,
        nearContractLeads: pipeline.nearContractLeads,
        underContractLeads: pipeline.underContractLeads,
        closingBlockedLeads: pipeline.closingBlockedLeads,
        estimatedPipelineValue: pipeline.estimatedPipelineValue,
      },
      records: pipelineRecords,
      dataGaps: pipeline.totalLeads > 0 ? pipeline.missingValueReasons : ["No property pipeline records are available yet."],
      providerCalled: false,
    }),
  ];
}

export function createDepartmentRecommendationsFromSnapshots(snapshots: BusinessDataSnapshotRecord[]): DepartmentLiveRecommendation[] {
  const byCategory = new Map(snapshots.map((snapshot) => [snapshot.category, snapshot]));
  const ga4 = byCategory.get("google_analytics_traffic");
  const search = byCategory.get("search_console_performance");
  const gmail = byCategory.get("gmail_inbox");
  const gbpReviews = byCategory.get("google_business_profile_reviews");
  const canva = byCategory.get("canva_designs");
  const providerCalled = snapshots.some((snapshot) => snapshot.providerCalled);
  const mk = (department: DepartmentLiveRecommendation["department"], title: string, recommendation: string, source: BusinessDataSnapshotRecord | undefined, confidence: number): DepartmentLiveRecommendation => ({
    department,
    title,
    recommendation,
    sourceLabel: source?.sourceLabel ?? "business_data_snapshot:data_gap",
    confidence,
    dataGaps: source?.dataGaps ?? ["Required live data snapshot is unavailable."],
    approvalRequired: true,
    providerCalled,
    liveExecutionAllowed: false,
  });

  return [
    mk("Lead Intelligence", "Review new inbound demand", `Review ${gmail?.metrics.recentInboxMessages ?? 0} recent Gmail inbox signal(s) and match manually against stored lead sources before any outreach.`, gmail, gmail?.status === "fresh" ? 78 : 45),
    mk("SEO", "Prioritize proven search pages", `Use the current Search Console top-page snapshot before choosing the next SEO refresh.`, search, search?.status === "fresh" ? 82 : 44),
    mk("Marketing", "Turn traffic into reviewable drafts", `Use GA4 top pages and Search Console click data to create approval-only draft topics; do not publish.`, ga4, ga4?.status === "fresh" ? 76 : 42),
    mk("Brand", "Review public trust signals", `Review Google reviews and profile performance before deciding brand/trust tasks.`, gbpReviews, gbpReviews?.status === "fresh" ? 74 : 40),
    mk("Content", "Repurpose strongest content", `Use top pages, YouTube, and Canva recency to choose one content refresh or repurpose draft.`, search ?? canva, search || canva ? 70 : 38),
    mk("Revenue", "Protect CEO time", `Work live inbound inquiries, search demand, and conversion pages before lower-value admin work.`, gmail ?? ga4, gmail || ga4 ? 73 : 41),
    mk("Operations", "Clear connector data gaps", `Resolve missing credentials/scopes for any data-gap snapshots before expanding automation.`, snapshots.find((snapshot) => snapshot.dataGaps.length > 0), snapshots.some((snapshot) => snapshot.dataGaps.length > 0) ? 86 : 66),
  ];
}

export function getReadOnlyBusinessConnectorHealth(snapshots: BusinessDataSnapshotRecord[]) {
  return getConnectorHealth().map((connector) => {
    const related = snapshots.filter((snapshot) => snapshot.connectorId === connector.connectorId);
    const successful = related.find((snapshot) => snapshot.providerCalled && snapshot.status !== "data_gap") ?? null;
    const gap = related.find((snapshot) => snapshot.dataGaps.length > 0) ?? null;

    return {
      connectorId: connector.connectorId,
      displayName: connector.displayName,
      healthStatus: successful ? "healthy" : gap ? "degraded" : connector.healthStatus,
      lastSuccessfulRead: successful?.freshness ?? null,
      lastDataGap: gap?.dataGaps[0] ?? null,
      providerCalled: related.some((snapshot) => snapshot.providerCalled),
      liveExecutionAllowed: false as const,
    };
  });
}

export function createMorningBriefFromSnapshots(snapshots: BusinessDataSnapshotRecord[], generatedAt = new Date().toISOString()): LiveMorningBrief {
  const getMetric = (category: BusinessDataCategory, key: string) => {
    const value = snapshots.find((snapshot) => snapshot.category === category)?.metrics[key];

    return typeof value === "number" ? value : 0;
  };
  const dataGaps = snapshots.flatMap((snapshot) => snapshot.dataGaps.map((gap) => `${snapshot.provider} ${snapshot.category}: ${gap}`));
  const providerCalled = snapshots.some((snapshot) => snapshot.providerCalled);
  const impressions = getMetric("search_console_performance", "impressions");
  const clicks = getMetric("search_console_performance", "clicks");
  const sessions = getMetric("google_analytics_traffic", "sessions");
  const inbox = getMetric("gmail_inbox", "recentInboxMessages");
  const calendarEvents = getMetric("google_calendar_events", "upcomingEvents");
  const schedulingConflicts = getMetric("google_calendar_events", "schedulingConflicts");
  const driveActivity = getMetric("google_drive_documents", "relevantDocumentActivity");
  const reviews = getMetric("google_business_profile_reviews", "reviews");
  const designs = getMetric("canva_designs", "recentDesigns");
  const videos = getMetric("youtube_channel", "recentVideos");
  const leads = getMetric("internal_lead_database", "totalLeads");
  const actionableLeads = getMetric("internal_crm", "actionableLeads");
  const workFirstLeads = getMetric("internal_property_pipeline", "workFirstLeads");
  const departmentRecommendations = createDepartmentRecommendationsFromSnapshots(snapshots);
  const todayPriorities = departmentRecommendations.slice(0, 4).map((item) => item.title);

  return {
    greeting: "Good Morning Moses",
    generatedAt,
    overnightSummary: [
      `${inbox} new/recent Gmail inbox signal(s).`,
      `${calendarEvents} upcoming Calendar commitment(s)${schedulingConflicts > 0 ? ` with ${schedulingConflicts} potential conflict(s)` : ""}.`,
      `${driveActivity} relevant recent Drive metadata change(s).`,
      `${reviews} Google review(s) visible in the read-only review snapshot.`,
      `${sessions} GA4 session(s) across top pages.`,
      `${impressions} Search Console impression(s) and ${clicks} click(s).`,
      `${videos} recent YouTube video(s) and ${designs} recent Canva design(s) visible.`,
      `${leads} stored lead(s), ${actionableLeads} actionable CRM item(s), and ${workFirstLeads} property pipeline work-first item(s).`,
    ],
    todayPriorities,
    estimatedCeoTimeMinutes: Math.min(45, 10 + todayPriorities.length * 2 + Math.min(10, inbox + reviews)),
    sourceLabels: snapshots.map((snapshot) => snapshot.sourceLabel),
    dataGaps,
    departmentRecommendations,
    connectorHealth: getReadOnlyBusinessConnectorHealth(snapshots),
    featureFlags: getFeatureFlagSnapshot(),
    providerCalled,
    liveExecutionAllowed: false,
    safetyFlags: readOnlyBusinessSafetyFlags,
  };
}

export async function getLatestBusinessSnapshots(tenantIdValue: string, limit = 20) {
  const tenantId = requireTenantId(tenantIdValue, "business_snapshot_list");
  return db.businessDataSnapshot.findMany({
    where: { tenantId },
    orderBy: [{ snapshotDate: "desc" }, { updatedAt: "desc" }],
    take: limit,
  }) as Promise<BusinessDataSnapshotRecord[]>;
}

export async function getLatestTenantBusinessSnapshots(activeTenantId: string, limit = 20) {
  const tenantId = requireTenantId(activeTenantId, "business_snapshot_list");
  return db.businessDataSnapshot.findMany({
    where: { tenantId },
    orderBy: [{ snapshotDate: "desc" }, { updatedAt: "desc" }],
    take: Math.min(Math.max(limit, 1), 200),
  }) as Promise<BusinessDataSnapshotRecord[]>;
}

export async function getLatestLiveMorningBrief(tenantIdValue: string) {
  const tenantId = requireTenantId(tenantIdValue, "morning_brief");
  const snapshots = await getLatestBusinessSnapshots(tenantId, readOnlyAdapterDefinitions.length);

  if (snapshots.length === 0) {
    const snapshotDate = dayStart();
    const gapSnapshots = readOnlyAdapterDefinitions.map((definition) => dataGapSnapshot(definition, snapshotDate, ["No business data snapshot has been generated yet."]));

    return createMorningBriefFromSnapshots(gapSnapshots);
  }

  return createMorningBriefFromSnapshots(snapshots);
}

export async function runReadOnlyBusinessSync(
  env: NodeJS.ProcessEnv = process.env,
  executionContext: UeipExecutionContext,
  options: ReadOnlySyncOptions = {},
): Promise<ReadOnlySyncReport> {
  const now = new Date();
  const snapshotDate = dayStart(now);
  const snapshots: BusinessDataSnapshotRecord[] = [];
  const activeTenantId = requireTenantId(executionContext?.tenantId, "business_sync_execution_context");

  const requestedCategories = options.syncMode === "week1_level1_ordered"
    ? validateWeek1Level1ReadOnlyCategories(options.categories ?? [...week1Level1ReadOnlyCategories])
    : options.categories;
  const selectedCategories = requestedCategories ? new Set(requestedCategories) : null;
  const adapterByCategory = new Map(readOnlyAdapterDefinitions.map((definition) => [definition.id, definition]));
  const persistAdapterSnapshot = async (definition: AdapterDefinition) => {
    const snapshot = options.syncMode === "week1_level1_ordered" && options.allowProviderReads !== true
      ? withExecutionEvidence(readinessOnlySnapshot(definition, env, snapshotDate), executionContext, now)
      : await runAdapter(definition, env, snapshotDate, now, executionContext);
    snapshots.push(await persistSnapshot(snapshot, activeTenantId));
  };

  if (requestedCategories) {
    const internalSnapshots = await createInternalBusinessSnapshots(snapshotDate, activeTenantId);
    const internalByCategory = new Map(internalSnapshots.map((snapshot) => [snapshot.category as BusinessDataCategory, snapshot]));
    for (const category of requestedCategories) {
      const adapter = adapterByCategory.get(category);
      if (adapter) {
        await persistAdapterSnapshot(adapter);
        continue;
      }

      const internalSnapshot = internalByCategory.get(category);
      if (internalSnapshot) {
        snapshots.push(await persistSnapshot(withExecutionEvidence(internalSnapshot, executionContext, now), activeTenantId));
      }
    }
  } else {
    for (const definition of readOnlyAdapterDefinitions) {
      await persistAdapterSnapshot(definition);
    }

    const internalSnapshots = await createInternalBusinessSnapshots(snapshotDate, activeTenantId);
    for (const snapshot of selectedCategories ? internalSnapshots.filter((item) => selectedCategories.has(item.category as BusinessDataCategory)) : internalSnapshots) {
      snapshots.push(await persistSnapshot(withExecutionEvidence(snapshot, executionContext, now), activeTenantId));
    }
  }

  const morningBrief = createMorningBriefFromSnapshots(snapshots, now.toISOString());

  if (options.persistDailyBriefing !== false) {
    await db.dailyBriefingSnapshot.create({
      data: {
        tenantId: activeTenantId,
        briefingDate: snapshotDate,
        panels: morningBrief,
        verticalSlice: { source: "sprint18_readonly_business_connections", providerCalled: morningBrief.providerCalled, liveExecutionAllowed: false },
        approvalSummary: { recommendationsRequireApproval: true, externalActionsBlocked: true },
        connectorSummary: { connectorHealth: morningBrief.connectorHealth, featureFlags: morningBrief.featureFlags },
        providerCalled: morningBrief.providerCalled,
        sent: false,
        published: false,
        liveExecutionAllowed: false,
      },
    });
  }

  return {
    ok: true,
    generatedAt: now.toISOString(),
    snapshots,
    morningBrief,
    integrationsCompleted: [...new Set(snapshots.map((snapshot) => snapshot.provider))],
    businessSystemsConnected: [...new Set(snapshots.filter((snapshot) => snapshot.providerCalled && snapshot.status !== "data_gap").map((snapshot) => snapshot.provider))],
    dataGaps: morningBrief.dataGaps,
    providerCalled: morningBrief.providerCalled,
    liveExecutionAllowed: false,
    safetyFlags: readOnlyBusinessSafetyFlags,
  };
}
