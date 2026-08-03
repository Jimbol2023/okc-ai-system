import { z } from "zod";

export const searchConsoleCapabilities = [
  "seo.site.list",
  "seo.performance.read",
  "seo.query.performance.read",
  "seo.page.performance.read",
  "seo.indexing.summary.read",
] as const;

export const implementedSearchConsoleCapabilities = [
  "seo.page.performance.read",
  "seo.query.performance.read",
  "seo.indexing.summary.read",
] as const;

export type SearchConsoleCapability = (typeof searchConsoleCapabilities)[number];

export type SearchConsoleCredential = {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
};

export type SearchConsoleAdapterInput = {
  capability: SearchConsoleCapability;
  siteUrl: string;
  inspectionUrl?: string;
  startDate?: string;
  endDate?: string;
  rowLimit?: number;
};

export type SearchConsoleNormalizedResult = {
  contractVersion: "ueip-search-console-result-v1";
  capability: SearchConsoleCapability;
  sourceLabel: string;
  provenance: string;
  observationWindow: { startDate: string; endDate: string } | null;
  freshness: string;
  confidence: number;
  signals: Record<string, unknown>;
  dataGaps: string[];
  reliability: {
    status: "healthy" | "partial";
    latencyMs: number;
    attempts: number;
    quotaRemaining: number | null;
  };
};

const performanceSchema = z.object({
  rows: z.array(z.object({
    keys: z.array(z.string()).optional(),
    clicks: z.number().optional(),
    impressions: z.number().optional(),
    ctr: z.number().optional(),
    position: z.number().optional(),
  }).passthrough()).optional(),
}).passthrough();

const indexingSchema = z.object({
  inspectionResult: z.object({
    indexStatusResult: z.object({
      verdict: z.string().optional(),
      coverageState: z.string().optional(),
      robotsTxtState: z.string().optional(),
      indexingState: z.string().optional(),
      lastCrawlTime: z.string().optional(),
    }).passthrough().optional(),
  }).passthrough().optional(),
}).passthrough();

const sitePropertySchema = z.string().max(500).refine((value) => {
  if (value.startsWith("sc-domain:")) return /^[a-z0-9.-]+$/i.test(value.slice("sc-domain:".length)) && value.slice("sc-domain:".length).includes(".");
  try { return new URL(value).protocol === "https:"; } catch { return false; }
}, "Unsupported Search Console property format.");

const inputSchema = z.object({
  capability: z.enum(searchConsoleCapabilities),
  siteUrl: sitePropertySchema,
  inspectionUrl: z.string().url().max(500).optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  rowLimit: z.number().int().min(1).max(100).optional(),
}).superRefine((value, context) => {
  const performance = value.capability === "seo.page.performance.read" || value.capability === "seo.query.performance.read";
  if (performance && !value.startDate) context.addIssue({ code: "custom", path: ["startDate"], message: "Performance start date is required." });
  if (performance && !value.endDate) context.addIssue({ code: "custom", path: ["endDate"], message: "Performance end date is required." });
  if (value.capability === "seo.indexing.summary.read" && !value.inspectionUrl) context.addIssue({ code: "custom", path: ["inspectionUrl"], message: "Inspection URL is required." });
});

const endpointPolicies = {
  oauth_token: { hostname: "oauth2.googleapis.com", path: "/token", method: "POST" },
  search_analytics: { hostname: "www.googleapis.com", pathPrefix: "/webmasters/v3/sites/", pathSuffix: "/searchAnalytics/query", method: "POST" },
  url_inspection: { hostname: "searchconsole.googleapis.com", path: "/v1/urlInspection/index:inspect", method: "POST" },
} as const;

export class UeipSearchConsoleAdapterError extends Error {
  constructor(
    public readonly category: "not_implemented" | "invalid_request" | "auth_failed" | "timeout" | "quota" | "provider_unavailable" | "invalid_response" | "endpoint_blocked",
    message: string,
    public readonly providerAttempted: boolean,
    public readonly attempts = 0,
  ) {
    super(message);
  }
}

function assertEndpoint(endpointId: keyof typeof endpointPolicies, rawUrl: string, method: string) {
  const url = new URL(rawUrl);
  const policy = endpointPolicies[endpointId];
  const pathAllowed = "path" in policy ? url.pathname === policy.path : url.pathname.startsWith(policy.pathPrefix) && url.pathname.endsWith(policy.pathSuffix);
  if (url.protocol !== "https:" || url.hostname !== policy.hostname || method !== policy.method || !pathAllowed) {
    throw new UeipSearchConsoleAdapterError("endpoint_blocked", "Search Console endpoint policy rejected the request.", false);
  }
}

function normalizeApprovedPage(rawPage: string | undefined, approvedSite: string) {
  if (!rawPage) return null;
  try {
    const page = new URL(rawPage);
    if (approvedSite.startsWith("sc-domain:")) {
      const domain = approvedSite.slice("sc-domain:".length).toLowerCase();
      if (page.hostname.toLowerCase() !== domain && !page.hostname.toLowerCase().endsWith(`.${domain}`)) return null;
    } else {
      const site = new URL(approvedSite);
      if (page.origin !== site.origin || !page.pathname.startsWith(site.pathname)) return null;
    }
    page.search = "";
    page.hash = "";
    return page.toString();
  } catch {
    return null;
  }
}

async function readBoundedJson(response: Response, maxBytes = 1_000_000) {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType && !contentType.toLowerCase().includes("json")) {
    throw new UeipSearchConsoleAdapterError("invalid_response", "Provider returned an unsupported content type.", true);
  }
  const text = await response.text();
  if (new TextEncoder().encode(text).byteLength > maxBytes) {
    throw new UeipSearchConsoleAdapterError("invalid_response", "Provider response exceeded the allowed size.", true);
  }
  try {
    return text ? (JSON.parse(text) as unknown) : {};
  } catch {
    throw new UeipSearchConsoleAdapterError("invalid_response", "Provider returned invalid JSON.", true);
  }
}

async function fetchWithReliability(input: {
  endpointId: keyof typeof endpointPolicies;
  url: string;
  init: RequestInit;
  fetcher: typeof fetch;
  timeoutMs: number;
  maxRetries: number;
}) {
  let attempts = 0;
  const startedAt = Date.now();
  while (attempts <= input.maxRetries) {
    attempts += 1;
    assertEndpoint(input.endpointId, input.url, String(input.init.method ?? "GET").toUpperCase());
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), input.timeoutMs);
    try {
      const response = await input.fetcher(input.url, { ...input.init, signal: controller.signal });
      if (response.status === 429) throw new UeipSearchConsoleAdapterError("quota", "Provider quota is unavailable.", true, attempts);
      if (response.status === 401 || response.status === 403) throw new UeipSearchConsoleAdapterError("auth_failed", "Provider authorization failed.", true, attempts);
      if (response.status >= 500 && attempts <= input.maxRetries) continue;
      if (!response.ok) throw new UeipSearchConsoleAdapterError("provider_unavailable", `Provider read failed with status ${response.status}.`, true, attempts);
      return { response, attempts, latencyMs: Date.now() - startedAt };
    } catch (error) {
      if (error instanceof UeipSearchConsoleAdapterError) throw error;
      if (error instanceof Error && error.name === "AbortError") throw new UeipSearchConsoleAdapterError("timeout", "Provider read timed out.", true, attempts);
      if (attempts > input.maxRetries) throw new UeipSearchConsoleAdapterError("provider_unavailable", "Provider read was unavailable.", true, attempts);
    } finally {
      clearTimeout(timer);
    }
  }
  throw new UeipSearchConsoleAdapterError("provider_unavailable", "Provider read was unavailable.", true, attempts);
}

async function exchangeToken(credentials: SearchConsoleCredential, fetcher: typeof fetch, timeoutMs: number) {
  const url = "https://oauth2.googleapis.com/token";
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: credentials.clientId,
    client_secret: credentials.clientSecret,
    refresh_token: credentials.refreshToken,
  });
  const result = await fetchWithReliability({
    endpointId: "oauth_token",
    url,
    init: { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" }, body },
    fetcher,
    timeoutMs,
    maxRetries: 0,
  });
  const json = z.object({ access_token: z.string().min(1) }).passthrough().safeParse(await readBoundedJson(result.response, 64_000));
  if (!json.success) throw new UeipSearchConsoleAdapterError("auth_failed", "Provider token response was invalid.", true, result.attempts);
  return json.data.access_token;
}

export async function executeSearchConsoleRead(input: {
  request: SearchConsoleAdapterInput;
  credentials: SearchConsoleCredential;
  fetcher?: typeof fetch;
  timeoutMs?: number;
  maxRetries?: number;
  now?: Date;
}): Promise<SearchConsoleNormalizedResult> {
  const parsed = inputSchema.safeParse(input.request);
  if (!parsed.success) throw new UeipSearchConsoleAdapterError("invalid_request", "Search Console request validation failed.", false);
  if (!(implementedSearchConsoleCapabilities as readonly string[]).includes(parsed.data.capability)) {
    throw new UeipSearchConsoleAdapterError("not_implemented", "Capability is registered but not implemented in UEIP Phase 2.", false);
  }

  const now = input.now ?? new Date();
  if (parsed.data.startDate && parsed.data.endDate) {
    const start = new Date(`${parsed.data.startDate}T00:00:00.000Z`);
    const end = new Date(`${parsed.data.endDate}T00:00:00.000Z`);
    const latestComplete = new Date(now);
    latestComplete.setUTCDate(latestComplete.getUTCDate() - 3);
    if (start > end || end > latestComplete || (end.getTime() - start.getTime()) / 86_400_000 > 90) throw new UeipSearchConsoleAdapterError("invalid_request", "Search Console observation window is invalid.", false);
  }
  const fetcher = input.fetcher ?? fetch;
  const timeoutMs = input.timeoutMs ?? 8_000;
  const accessToken = await exchangeToken(input.credentials, fetcher, timeoutMs);
  const headers = { Authorization: `Bearer ${accessToken}`, Accept: "application/json", "Content-Type": "application/json" };

  if (parsed.data.capability === "seo.page.performance.read" || parsed.data.capability === "seo.query.performance.read") {
    const startDate = parsed.data.startDate!;
    const endDate = parsed.data.endDate!;
    const url = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(parsed.data.siteUrl)}/searchAnalytics/query`;
    const result = await fetchWithReliability({
      endpointId: "search_analytics",
      url,
      init: { method: "POST", headers, body: JSON.stringify({ startDate, endDate, dimensions: [parsed.data.capability === "seo.query.performance.read" ? "query" : "page"], rowLimit: parsed.data.rowLimit ?? 10 }) },
      fetcher,
      timeoutMs,
      maxRetries: input.maxRetries ?? 1,
    });
    const json = performanceSchema.safeParse(await readBoundedJson(result.response));
    if (!json.success) throw new UeipSearchConsoleAdapterError("invalid_response", "Search Console performance schema validation failed.", true, result.attempts);
    const rows = parsed.data.capability === "seo.page.performance.read"
      ? (json.data.rows ?? []).map((row) => ({ dimension: normalizeApprovedPage(row.keys?.[0], parsed.data.siteUrl), clicks: row.clicks ?? 0, impressions: row.impressions ?? 0, ctr: row.ctr ?? 0, position: row.position ?? 0 })).filter((row) => row.dimension !== null)
      : (json.data.rows ?? []).map((row) => ({ dimension: (row.keys?.[0] ?? "").trim().slice(0, 500), clicks: row.clicks ?? 0, impressions: row.impressions ?? 0, ctr: row.ctr ?? 0, position: row.position ?? 0 })).filter((row) => row.dimension.length > 0);
    return {
      contractVersion: "ueip-search-console-result-v1",
      capability: parsed.data.capability,
      sourceLabel: parsed.data.capability === "seo.page.performance.read" ? "ueip:search_console:page_performance:readonly" : "ueip:search_console:query_performance:readonly",
      provenance: "Google Search Console Search Analytics API normalized by certified UEIP adapter v1.",
      observationWindow: { startDate, endDate },
      freshness: now.toISOString(),
      confidence: 90,
      signals: { [parsed.data.capability === "seo.page.performance.read" ? "pages" : "queries"]: rows, clicks: rows.reduce((sum, row) => sum + row.clicks, 0), impressions: rows.reduce((sum, row) => sum + row.impressions, 0) },
      dataGaps: [],
      reliability: { status: "healthy", latencyMs: result.latencyMs, attempts: result.attempts, quotaRemaining: null },
    };
  }

  if (!parsed.data.inspectionUrl) throw new UeipSearchConsoleAdapterError("invalid_request", "Approved inspection URL is required.", false);
  const result = await fetchWithReliability({
    endpointId: "url_inspection",
    url: "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect",
    init: { method: "POST", headers, body: JSON.stringify({ inspectionUrl: parsed.data.inspectionUrl, siteUrl: parsed.data.siteUrl }) },
    fetcher,
    timeoutMs,
    maxRetries: input.maxRetries ?? 1,
  });
  const json = indexingSchema.safeParse(await readBoundedJson(result.response));
  if (!json.success) throw new UeipSearchConsoleAdapterError("invalid_response", "Search Console indexing schema validation failed.", true, result.attempts);
  const status = json.data.inspectionResult?.indexStatusResult ?? {};
  return {
    contractVersion: "ueip-search-console-result-v1",
    capability: parsed.data.capability,
    sourceLabel: "ueip:search_console:indexing_summary:readonly",
    provenance: "Google Search Console URL Inspection API normalized by certified UEIP adapter v1.",
    observationWindow: null,
    freshness: now.toISOString(),
    confidence: 88,
    signals: { inspectionUrl: parsed.data.inspectionUrl, verdict: status.verdict ?? null, coverageState: status.coverageState ?? null, robotsTxtState: status.robotsTxtState ?? null, indexingState: status.indexingState ?? null, lastCrawlTime: status.lastCrawlTime ?? null },
    dataGaps: [],
    reliability: { status: "healthy", latencyMs: result.latencyMs, attempts: result.attempts, quotaRemaining: null },
  };
}
