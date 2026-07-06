import { getConnectorHealth } from "@/lib/connector-platform";
import { getFeatureFlagSnapshot, isFeatureEnabled, type FeatureFlagKey } from "@/lib/feature-flags";
import { prisma } from "@/lib/prisma";
import { publicSiteUrl } from "@/lib/public-seo";

const tenantId = "default";

export const readOnlyBusinessSafetyFlags = {
  readOnly: true,
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
  | "canva_designs";

export type BusinessDataSnapshotRecord = {
  id?: string;
  tenantId?: string;
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

type AdapterDefinition = {
  id: BusinessDataCategory;
  provider: string;
  connectorId: string;
  featureFlags: FeatureFlagKey[];
  requiredEnv: string[];
  oauthProvider: OAuthProvider;
  approvedRequests: Array<{ method: "GET" | "POST"; urlIncludes: string }>;
  run: (context: AdapterContext) => Promise<BusinessDataSnapshotRecord>;
};

type AdapterContext = {
  accessToken: string;
  fetcher: FetchLike;
  snapshotDate: Date;
  now: Date;
  env: NodeJS.ProcessEnv;
};

let db = prisma as unknown as SnapshotDb;
let fetcher: FetchLike = fetch;

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
  providerCalled?: boolean;
}): BusinessDataSnapshotRecord {
  return {
    tenantId,
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
  const list = await providerFetch(context, "https://gmail.googleapis.com/gmail/v1/users/me/messages?labelIds=INBOX&maxResults=10&q=newer_than:2d");
  const listJson = await readJson(list);
  const messages = Array.isArray(listJson.messages) ? listJson.messages.slice(0, 5) : [];
  const records: Array<Record<string, unknown>> = [];

  for (const message of messages) {
    const id = typeof (message as { id?: unknown }).id === "string" ? (message as { id: string }).id : "";
    if (!id) continue;
    const detail = await providerFetch(
      context,
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/${encodeURIComponent(id)}?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date`,
    );
    const detailJson = await readJson(detail);
    const headers = (((detailJson.payload as { headers?: unknown } | undefined)?.headers ?? []) as Array<{ name?: string; value?: string }>) || [];

    records.push({
      id,
      threadId: detailJson.threadId,
      snippet: typeof detailJson.snippet === "string" ? detailJson.snippet.slice(0, 160) : "",
      from: headers.find((header) => header.name === "From")?.value ?? "",
      subject: headers.find((header) => header.name === "Subject")?.value ?? "",
      date: headers.find((header) => header.name === "Date")?.value ?? "",
    });
  }

  return baseSnapshot({
    snapshotDate: context.snapshotDate,
    provider: "Google Workspace",
    connectorId: "gmail",
    category: "gmail_inbox",
    status: list.ok ? "fresh" : "partial",
    sourceLabel: "gmail:inbox:readonly",
    provenance: "Gmail API users.messages list/get with metadata format and INBOX label only.",
    summary: `${records.length} recent inbox message(s) visible for CEO review.`,
    metrics: { recentInboxMessages: records.length },
    records,
    dataGaps: list.ok ? [] : [`Gmail API returned status ${list.status}.`],
    providerCalled: true,
  });
}

async function calendarEvents(context: AdapterContext) {
  const timeMin = context.now.toISOString();
  const timeMax = new Date(context.now.getTime() + 36 * 60 * 60 * 1000).toISOString();
  const url = new URL("https://www.googleapis.com/calendar/v3/calendars/primary/events");
  url.searchParams.set("timeMin", timeMin);
  url.searchParams.set("timeMax", timeMax);
  url.searchParams.set("singleEvents", "true");
  url.searchParams.set("orderBy", "startTime");
  url.searchParams.set("maxResults", "10");
  const response = await providerFetch(context, url.toString());
  const json = await readJson(response);
  const items = Array.isArray(json.items) ? json.items : [];
  const records = items.map((item) => {
    const event = item as { id?: string; summary?: string; start?: { dateTime?: string; date?: string }; end?: { dateTime?: string; date?: string } };

    return { id: event.id, summary: event.summary, start: event.start?.dateTime ?? event.start?.date, end: event.end?.dateTime ?? event.end?.date };
  });

  return baseSnapshot({
    snapshotDate: context.snapshotDate,
    provider: "Google Workspace",
    connectorId: "google_calendar",
    category: "google_calendar_events",
    status: response.ok ? "fresh" : "partial",
    sourceLabel: "google_calendar:events:readonly",
    provenance: "Google Calendar API events.list for primary calendar with forward-looking time window.",
    summary: `${records.length} upcoming calendar event(s) found.`,
    metrics: { upcomingEvents: records.length },
    records,
    dataGaps: response.ok ? [] : [`Calendar API returned status ${response.status}.`],
    providerCalled: true,
  });
}

async function driveDocuments(context: AdapterContext) {
  const url = "https://www.googleapis.com/drive/v3/files?pageSize=10&orderBy=modifiedTime%20desc&fields=files(id%2Cname%2CmimeType%2CmodifiedTime%2CwebViewLink)";
  const response = await providerFetch(context, url);
  const json = await readJson(response);
  const files = Array.isArray(json.files) ? json.files : [];
  const records = files.map((file) => {
    const item = file as { id?: string; name?: string; mimeType?: string; modifiedTime?: string; webViewLink?: string };

    return { id: item.id, name: item.name, mimeType: item.mimeType, modifiedTime: item.modifiedTime, webViewLink: item.webViewLink };
  });

  return baseSnapshot({
    snapshotDate: context.snapshotDate,
    provider: "Google Workspace",
    connectorId: "google_drive",
    category: "google_drive_documents",
    status: response.ok ? "fresh" : "partial",
    sourceLabel: "google_drive:files:metadata_readonly",
    provenance: "Google Drive API files.list using metadata fields only.",
    summary: `${records.length} recent Drive document(s) found.`,
    metrics: { recentDocuments: records.length },
    records,
    dataGaps: response.ok ? [] : [`Drive API returned status ${response.status}.`],
    providerCalled: true,
  });
}

async function searchConsolePerformance(context: AdapterContext) {
  const siteUrl = context.env.GOOGLE_SEARCH_CONSOLE_SITE_URL || publicSiteUrl;
  const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`;
  const response = await providerFetch(context, endpoint, {
    method: "POST",
    body: JSON.stringify({ startDate: daysAgo(8, context.now), endDate: daysAgo(1, context.now), dimensions: ["page"], rowLimit: 10 }),
  });
  const json = await readJson(response);
  const rows = Array.isArray(json.rows) ? (json.rows as Array<{ keys?: string[]; clicks?: number; impressions?: number; ctr?: number; position?: number }>) : [];
  const records = rows.map((row) => ({ page: row.keys?.[0], clicks: row.clicks ?? 0, impressions: row.impressions ?? 0, ctr: row.ctr ?? 0, position: row.position ?? 0 }));
  const clicks = records.reduce((sum, row) => sum + Number(row.clicks || 0), 0);
  const impressions = records.reduce((sum, row) => sum + Number(row.impressions || 0), 0);

  return baseSnapshot({
    snapshotDate: context.snapshotDate,
    provider: "Google Search Console",
    connectorId: "google_search_console",
    category: "search_console_performance",
    status: response.ok ? "fresh" : "partial",
    sourceLabel: "search_console:search_analytics:readonly",
    provenance: "Search Console Search Analytics query grouped by page.",
    summary: `${impressions} impression(s) and ${clicks} click(s) across top pages.`,
    metrics: { clicks, impressions, topPages: records.length },
    records,
    dataGaps: response.ok ? [] : [`Search Console API returned status ${response.status}.`],
    providerCalled: true,
  });
}

async function searchConsoleIndexing(context: AdapterContext) {
  const siteUrl = context.env.GOOGLE_SEARCH_CONSOLE_SITE_URL || publicSiteUrl;
  const inspectionUrl = `${publicSiteUrl}/resources/inherited-property-oklahoma`;
  const response = await providerFetch(context, "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", {
    method: "POST",
    body: JSON.stringify({ inspectionUrl, siteUrl }),
  });
  const json = await readJson(response);
  const result = (json.inspectionResult as { indexStatusResult?: Record<string, unknown> } | undefined)?.indexStatusResult ?? {};

  return baseSnapshot({
    snapshotDate: context.snapshotDate,
    provider: "Google Search Console",
    connectorId: "google_search_console",
    category: "search_console_indexing",
    status: response.ok ? "fresh" : "partial",
    sourceLabel: "search_console:url_inspection:readonly",
    provenance: "Search Console URL Inspection index.inspect for approved public site URL.",
    summary: response.ok ? "Index inspection snapshot is available for the approved probate resource page." : "Index inspection could not be loaded.",
    metrics: { verdict: result.verdict, coverageState: result.coverageState, robotsTxtState: result.robotsTxtState },
    records: [{ inspectionUrl, siteUrl, ...result }],
    dataGaps: response.ok ? [] : [`Search Console URL Inspection returned status ${response.status}.`],
    providerCalled: true,
  });
}

async function ga4Traffic(context: AdapterContext) {
  const propertyId = context.env.GOOGLE_ANALYTICS_PROPERTY_ID || "";
  const response = await providerFetch(context, `https://analyticsdata.googleapis.com/v1beta/properties/${encodeURIComponent(propertyId)}:runReport`, {
    method: "POST",
    body: JSON.stringify({
      dateRanges: [{ startDate: "7daysAgo", endDate: "yesterday" }],
      dimensions: [{ name: "pagePath" }],
      metrics: [{ name: "sessions" }, { name: "activeUsers" }, { name: "screenPageViews" }, { name: "conversions" }],
      limit: "10",
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
    }),
  });
  const json = await readJson(response);
  const rows = Array.isArray(json.rows) ? json.rows : [];
  const records = rows.map((row) => {
    const item = row as { dimensionValues?: Array<{ value?: string }>; metricValues?: Array<{ value?: string }> };

    return {
      pagePath: item.dimensionValues?.[0]?.value,
      sessions: Number(item.metricValues?.[0]?.value ?? 0),
      activeUsers: Number(item.metricValues?.[1]?.value ?? 0),
      pageViews: Number(item.metricValues?.[2]?.value ?? 0),
      conversions: Number(item.metricValues?.[3]?.value ?? 0),
    };
  });

  return baseSnapshot({
    snapshotDate: context.snapshotDate,
    provider: "Google Analytics",
    connectorId: "google_analytics",
    category: "google_analytics_traffic",
    status: response.ok ? "fresh" : "partial",
    sourceLabel: "ga4:data_api:readonly",
    provenance: "GA4 Data API properties.runReport for traffic, conversions, and top pages.",
    summary: `${records.reduce((sum, row) => sum + row.sessions, 0)} session(s) across top GA4 pages.`,
    metrics: {
      sessions: records.reduce((sum, row) => sum + row.sessions, 0),
      activeUsers: records.reduce((sum, row) => sum + row.activeUsers, 0),
      conversions: records.reduce((sum, row) => sum + row.conversions, 0),
      topPages: records.length,
    },
    records,
    dataGaps: response.ok ? [] : [`GA4 Data API returned status ${response.status}.`],
    providerCalled: true,
  });
}

async function googleBusinessProfilePerformance(context: AdapterContext) {
  const locationName = context.env.GOOGLE_BUSINESS_PROFILE_LOCATION_ID || "";
  const normalizedLocation = locationName.startsWith("locations/") ? locationName : `locations/${locationName}`;
  const url = new URL(`https://businessprofileperformance.googleapis.com/v1/${normalizedLocation}:fetchMultiDailyMetricsTimeSeries`);
  for (const metric of ["BUSINESS_IMPRESSIONS_DESKTOP_SEARCH", "BUSINESS_IMPRESSIONS_MOBILE_SEARCH", "CALL_CLICKS", "BUSINESS_DIRECTION_REQUESTS"]) {
    url.searchParams.append("dailyMetrics", metric);
  }
  url.searchParams.set("dailyRange.startDate.year", String(context.now.getUTCFullYear()));
  url.searchParams.set("dailyRange.startDate.month", String(context.now.getUTCMonth() + 1));
  url.searchParams.set("dailyRange.startDate.day", String(Math.max(1, context.now.getUTCDate() - 7)));
  url.searchParams.set("dailyRange.endDate.year", String(context.now.getUTCFullYear()));
  url.searchParams.set("dailyRange.endDate.month", String(context.now.getUTCMonth() + 1));
  url.searchParams.set("dailyRange.endDate.day", String(context.now.getUTCDate()));
  const response = await providerFetch(context, url.toString());
  const json = await readJson(response);
  const records = Array.isArray(json.multiDailyMetricTimeSeries) ? (json.multiDailyMetricTimeSeries as Array<Record<string, unknown>>) : [];

  return baseSnapshot({
    snapshotDate: context.snapshotDate,
    provider: "Google Business Profile",
    connectorId: "google_business_profile",
    category: "google_business_profile_performance",
    status: response.ok ? "fresh" : "partial",
    sourceLabel: "google_business_profile:performance:readonly",
    provenance: "Google Business Profile Performance API fetchMultiDailyMetricsTimeSeries.",
    summary: `Google Business Profile performance returned ${records.length} metric series.`,
    metrics: { metricSeries: records.length },
    records,
    dataGaps: response.ok ? [] : [`GBP Performance API returned status ${response.status}.`],
    providerCalled: true,
  });
}

async function googleBusinessProfileReviews(context: AdapterContext) {
  const locationName = context.env.GOOGLE_BUSINESS_PROFILE_LOCATION_ID || "";
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
  const response = await providerFetch(context, `https://mybusiness.googleapis.com/v4/${locationName}/reviews?pageSize=10&orderBy=updateTime%20desc`);
  const json = await readJson(response);
  const reviews = Array.isArray(json.reviews) ? json.reviews : [];
  const records = reviews.map((review) => {
    const item = review as { reviewId?: string; starRating?: string; updateTime?: string; comment?: string };

    return { reviewId: item.reviewId, starRating: item.starRating, updateTime: item.updateTime, commentPreview: item.comment?.slice(0, 160) ?? "" };
  });

  return baseSnapshot({
    snapshotDate: context.snapshotDate,
    provider: "Google Business Profile",
    connectorId: "google_business_profile",
    category: "google_business_profile_reviews",
    status: response.ok ? "fresh" : "partial",
    sourceLabel: "google_business_profile:reviews:readonly",
    provenance: "Google Business Profile reviews list endpoint, read-only.",
    summary: `${records.length} recent Google review(s) visible.`,
    metrics: { reviews: records.length },
    records,
    dataGaps: response.ok ? [] : [`GBP reviews API returned status ${response.status}.`],
    providerCalled: true,
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
  { id: "gmail_inbox", provider: "Google Workspace", connectorId: "gmail", featureFlags: ["connector_live_reads", "connector_google", "connector_communication"], requiredEnv: ["GOOGLE_OAUTH_CLIENT_ID", "GOOGLE_OAUTH_CLIENT_SECRET", "GOOGLE_OAUTH_REFRESH_TOKEN"], oauthProvider: "google", approvedRequests: [{ method: "GET", urlIncludes: "gmail.googleapis.com/gmail/v1/users/me/messages" }], run: gmailInbox },
  { id: "google_calendar_events", provider: "Google Workspace", connectorId: "google_calendar", featureFlags: ["connector_live_reads", "connector_google"], requiredEnv: ["GOOGLE_OAUTH_CLIENT_ID", "GOOGLE_OAUTH_CLIENT_SECRET", "GOOGLE_OAUTH_REFRESH_TOKEN"], oauthProvider: "google", approvedRequests: [{ method: "GET", urlIncludes: "www.googleapis.com/calendar/v3/calendars/primary/events" }], run: calendarEvents },
  { id: "google_drive_documents", provider: "Google Workspace", connectorId: "google_drive", featureFlags: ["connector_live_reads", "connector_google"], requiredEnv: ["GOOGLE_OAUTH_CLIENT_ID", "GOOGLE_OAUTH_CLIENT_SECRET", "GOOGLE_OAUTH_REFRESH_TOKEN"], oauthProvider: "google", approvedRequests: [{ method: "GET", urlIncludes: "www.googleapis.com/drive/v3/files" }], run: driveDocuments },
  { id: "search_console_performance", provider: "Google Search Console", connectorId: "google_search_console", featureFlags: ["connector_live_reads", "connector_google", "executive_briefings"], requiredEnv: ["GOOGLE_OAUTH_CLIENT_ID", "GOOGLE_OAUTH_CLIENT_SECRET", "GOOGLE_OAUTH_REFRESH_TOKEN", "GOOGLE_SEARCH_CONSOLE_SITE_URL"], oauthProvider: "google", approvedRequests: [{ method: "POST", urlIncludes: "www.googleapis.com/webmasters/v3/sites" }], run: searchConsolePerformance },
  { id: "search_console_indexing", provider: "Google Search Console", connectorId: "google_search_console", featureFlags: ["connector_live_reads", "connector_google", "executive_briefings"], requiredEnv: ["GOOGLE_OAUTH_CLIENT_ID", "GOOGLE_OAUTH_CLIENT_SECRET", "GOOGLE_OAUTH_REFRESH_TOKEN", "GOOGLE_SEARCH_CONSOLE_SITE_URL"], oauthProvider: "google", approvedRequests: [{ method: "POST", urlIncludes: "searchconsole.googleapis.com/v1/urlInspection/index:inspect" }], run: searchConsoleIndexing },
  { id: "google_analytics_traffic", provider: "Google Analytics", connectorId: "google_analytics", featureFlags: ["connector_live_reads", "connector_google", "executive_briefings"], requiredEnv: ["GOOGLE_OAUTH_CLIENT_ID", "GOOGLE_OAUTH_CLIENT_SECRET", "GOOGLE_OAUTH_REFRESH_TOKEN", "GOOGLE_ANALYTICS_PROPERTY_ID"], oauthProvider: "google", approvedRequests: [{ method: "POST", urlIncludes: "analyticsdata.googleapis.com/v1beta/properties" }], run: ga4Traffic },
  { id: "google_business_profile_performance", provider: "Google Business Profile", connectorId: "google_business_profile", featureFlags: ["connector_live_reads", "connector_google", "connector_marketing"], requiredEnv: ["GOOGLE_OAUTH_CLIENT_ID", "GOOGLE_OAUTH_CLIENT_SECRET", "GOOGLE_OAUTH_REFRESH_TOKEN", "GOOGLE_BUSINESS_PROFILE_LOCATION_ID"], oauthProvider: "google", approvedRequests: [{ method: "GET", urlIncludes: "businessprofileperformance.googleapis.com/v1/locations" }], run: googleBusinessProfilePerformance },
  { id: "google_business_profile_reviews", provider: "Google Business Profile", connectorId: "google_business_profile", featureFlags: ["connector_live_reads", "connector_google", "connector_marketing"], requiredEnv: ["GOOGLE_OAUTH_CLIENT_ID", "GOOGLE_OAUTH_CLIENT_SECRET", "GOOGLE_OAUTH_REFRESH_TOKEN", "GOOGLE_BUSINESS_PROFILE_LOCATION_ID"], oauthProvider: "google", approvedRequests: [{ method: "GET", urlIncludes: "mybusiness.googleapis.com/v4/accounts" }], run: googleBusinessProfileReviews },
  { id: "youtube_channel", provider: "YouTube", connectorId: "youtube", featureFlags: ["connector_live_reads", "connector_google", "connector_marketing"], requiredEnv: ["GOOGLE_OAUTH_CLIENT_ID", "GOOGLE_OAUTH_CLIENT_SECRET", "GOOGLE_OAUTH_REFRESH_TOKEN", "YOUTUBE_CHANNEL_ID"], oauthProvider: "google", approvedRequests: [{ method: "GET", urlIncludes: "www.googleapis.com/youtube/v3/search" }, { method: "GET", urlIncludes: "youtubeanalytics.googleapis.com/v2/reports" }], run: youtubeChannel },
  { id: "canva_designs", provider: "Canva", connectorId: "canva", featureFlags: ["connector_live_reads", "connector_marketing"], requiredEnv: ["CANVA_OAUTH_CLIENT_ID", "CANVA_OAUTH_CLIENT_SECRET", "CANVA_OAUTH_REFRESH_TOKEN"], oauthProvider: "canva", approvedRequests: [{ method: "GET", urlIncludes: "api.canva.com/rest/v1/designs" }], run: canvaDesigns },
];

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

async function runAdapter(definition: AdapterDefinition, env: NodeJS.ProcessEnv, snapshotDate: Date, now: Date) {
  const disabledFlags = definition.featureFlags.filter((flag) => !isFeatureEnabled(flag));
  if (disabledFlags.length > 0) {
    return dataGapSnapshot(definition, snapshotDate, [`Feature flag(s) disabled: ${disabledFlags.join(", ")}.`]);
  }

  if (!hasEnv(env, definition.requiredEnv)) {
    return dataGapSnapshot(definition, snapshotDate, [envGap(definition.requiredEnv)]);
  }

  try {
    const accessToken = await refreshAccessToken(definition.oauthProvider, env, fetcher);

    return definition.run({ accessToken, fetcher, snapshotDate, now, env });
  } catch (error) {
    return baseSnapshot({
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
    });
  }
}

async function persistSnapshot(snapshot: BusinessDataSnapshotRecord) {
  return db.businessDataSnapshot.upsert({
    where: {
      tenantId_snapshotDate_provider_category: {
        tenantId,
        snapshotDate: snapshot.snapshotDate,
        provider: snapshot.provider,
        category: snapshot.category,
      },
    },
    create: snapshot,
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
    },
  }) as Promise<BusinessDataSnapshotRecord>;
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
  const reviews = getMetric("google_business_profile_reviews", "reviews");
  const designs = getMetric("canva_designs", "recentDesigns");
  const videos = getMetric("youtube_channel", "recentVideos");
  const departmentRecommendations = createDepartmentRecommendationsFromSnapshots(snapshots);
  const todayPriorities = departmentRecommendations.slice(0, 4).map((item) => item.title);

  return {
    greeting: "Good Morning Moses",
    generatedAt,
    overnightSummary: [
      `${inbox} new/recent Gmail inbox signal(s).`,
      `${reviews} Google review(s) visible in the read-only review snapshot.`,
      `${sessions} GA4 session(s) across top pages.`,
      `${impressions} Search Console impression(s) and ${clicks} click(s).`,
      `${videos} recent YouTube video(s) and ${designs} recent Canva design(s) visible.`,
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

export async function getLatestBusinessSnapshots(limit = 20) {
  return db.businessDataSnapshot.findMany({
    where: { tenantId },
    orderBy: [{ snapshotDate: "desc" }, { updatedAt: "desc" }],
    take: limit,
  }) as Promise<BusinessDataSnapshotRecord[]>;
}

export async function getLatestLiveMorningBrief() {
  const snapshots = await getLatestBusinessSnapshots(readOnlyAdapterDefinitions.length);

  if (snapshots.length === 0) {
    const snapshotDate = dayStart();
    const gapSnapshots = readOnlyAdapterDefinitions.map((definition) => dataGapSnapshot(definition, snapshotDate, ["No business data snapshot has been generated yet."]));

    return createMorningBriefFromSnapshots(gapSnapshots);
  }

  return createMorningBriefFromSnapshots(snapshots);
}

export async function runReadOnlyBusinessSync(env: NodeJS.ProcessEnv = process.env): Promise<ReadOnlySyncReport> {
  const now = new Date();
  const snapshotDate = dayStart(now);
  const snapshots: BusinessDataSnapshotRecord[] = [];

  for (const definition of readOnlyAdapterDefinitions) {
    const snapshot = await runAdapter(definition, env, snapshotDate, now);
    snapshots.push(await persistSnapshot(snapshot));
  }

  const morningBrief = createMorningBriefFromSnapshots(snapshots, now.toISOString());

  await db.dailyBriefingSnapshot.create({
    data: {
      tenantId,
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

  return {
    ok: true,
    generatedAt: now.toISOString(),
    snapshots,
    morningBrief,
    integrationsCompleted: readOnlyAdapterDefinitions.map((definition) => definition.provider),
    businessSystemsConnected: [...new Set(snapshots.filter((snapshot) => snapshot.providerCalled && snapshot.status !== "data_gap").map((snapshot) => snapshot.provider))],
    dataGaps: morningBrief.dataGaps,
    providerCalled: morningBrief.providerCalled,
    liveExecutionAllowed: false,
    safetyFlags: readOnlyBusinessSafetyFlags,
  };
}
