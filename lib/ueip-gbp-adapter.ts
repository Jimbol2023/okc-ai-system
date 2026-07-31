import { z } from "zod";

export const gbpCapabilities = [
  "gbp.performance.read",
  "gbp.reviews.read",
] as const;

export type GbpCapability = (typeof gbpCapabilities)[number];

export type GbpCredential = {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
};

export type GbpAdapterInput = {
  capability: GbpCapability;
  locationName: string;
  startDate: string;
  endDate: string;
  rowLimit?: number;
};

export type GbpNormalizedResult = {
  contractVersion: "ueip-gbp-result-v1";
  capability: GbpCapability;
  sourceLabel: string;
  provenance: string;
  observationWindow: { startDate: string; endDate: string };
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

const gbpLocationPattern = /^accounts\/[A-Za-z0-9_-]+\/locations\/[A-Za-z0-9_-]+$/;
const gbpPerformanceLocationPattern = /^(?:locations\/)?[A-Za-z0-9_-]+$/;

const performanceSchema = z.object({
  multiDailyMetricTimeSeries: z.array(z.object({
    dailyMetric: z.string().optional(),
    timeSeries: z.object({
      datedValues: z.array(z.object({
        date: z.object({ year: z.number().optional(), month: z.number().optional(), day: z.number().optional() }).optional(),
        value: z.string().optional(),
      }).passthrough()).optional(),
    }).passthrough().optional(),
  }).passthrough()).optional(),
}).passthrough();

const reviewsSchema = z.object({
  reviews: z.array(z.object({
    reviewId: z.string().optional(),
    starRating: z.string().optional(),
    updateTime: z.string().optional(),
    comment: z.string().optional(),
  }).passthrough()).optional(),
}).passthrough();

const inputSchema = z.object({
  capability: z.enum(gbpCapabilities),
  locationName: z.string().min(4).max(220),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  rowLimit: z.number().int().min(1).max(50).optional(),
}).superRefine((value, context) => {
  const start = new Date(`${value.startDate}T00:00:00.000Z`);
  const end = new Date(`${value.endDate}T00:00:00.000Z`);
  if (start > end) context.addIssue({ code: "custom", path: ["endDate"], message: "GBP end date must be on or after start date." });
  if ((end.getTime() - start.getTime()) / 86_400_000 > 90) context.addIssue({ code: "custom", path: ["endDate"], message: "GBP observation window is too large." });
  if (value.capability === "gbp.reviews.read" && !gbpLocationPattern.test(value.locationName)) context.addIssue({ code: "custom", path: ["locationName"], message: "GBP review reads require accounts/{accountId}/locations/{locationId}." });
  if (value.capability === "gbp.performance.read" && !gbpPerformanceLocationPattern.test(value.locationName)) context.addIssue({ code: "custom", path: ["locationName"], message: "GBP performance reads require a location id or locations/{locationId}." });
});

const endpointPolicies = {
  oauth_token: { hostname: "oauth2.googleapis.com", path: "/token", method: "POST" },
  performance: { hostname: "businessprofileperformance.googleapis.com", pathPattern: /^\/v1\/locations\/[A-Za-z0-9_-]+:fetchMultiDailyMetricsTimeSeries$/, method: "GET" },
  reviews: { hostname: "mybusiness.googleapis.com", pathPattern: /^\/v4\/accounts\/[A-Za-z0-9_-]+\/locations\/[A-Za-z0-9_-]+\/reviews$/, method: "GET" },
} as const;

export class UeipGbpAdapterError extends Error {
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
  const pathAllowed = "path" in policy ? url.pathname === policy.path : policy.pathPattern.test(url.pathname);
  if (url.protocol !== "https:" || url.hostname !== policy.hostname || method !== policy.method || !pathAllowed) throw new UeipGbpAdapterError("endpoint_blocked", "GBP endpoint policy rejected the request.", false);
}

async function readBoundedJson(response: Response, maxBytes = 1_000_000) {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType && !contentType.toLowerCase().includes("json")) throw new UeipGbpAdapterError("invalid_response", "Provider returned an unsupported content type.", true);
  const text = await response.text();
  if (new TextEncoder().encode(text).byteLength > maxBytes) throw new UeipGbpAdapterError("invalid_response", "Provider response exceeded the allowed size.", true);
  try {
    return text ? (JSON.parse(text) as unknown) : {};
  } catch {
    throw new UeipGbpAdapterError("invalid_response", "Provider returned invalid JSON.", true);
  }
}

async function fetchWithReliability(input: { endpointId: keyof typeof endpointPolicies; url: string; init: RequestInit; fetcher: typeof fetch; timeoutMs: number; maxRetries: number }) {
  let attempts = 0;
  const startedAt = Date.now();
  while (attempts <= input.maxRetries) {
    attempts += 1;
    assertEndpoint(input.endpointId, input.url, String(input.init.method ?? "GET").toUpperCase());
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), input.timeoutMs);
    try {
      const response = await input.fetcher(input.url, { ...input.init, signal: controller.signal });
      if (response.status === 429) throw new UeipGbpAdapterError("quota", "Provider quota is unavailable.", true, attempts);
      if (response.status === 401 || response.status === 403) throw new UeipGbpAdapterError("auth_failed", "Provider authorization failed.", true, attempts);
      if (response.status >= 500 && attempts <= input.maxRetries) continue;
      if (!response.ok) throw new UeipGbpAdapterError("provider_unavailable", `Provider read failed with status ${response.status}.`, true, attempts);
      return { response, attempts, latencyMs: Date.now() - startedAt };
    } catch (error) {
      if (error instanceof UeipGbpAdapterError) throw error;
      if (error instanceof Error && error.name === "AbortError") throw new UeipGbpAdapterError("timeout", "Provider read timed out.", true, attempts);
      if (attempts > input.maxRetries) throw new UeipGbpAdapterError("provider_unavailable", "Provider read was unavailable.", true, attempts);
    } finally {
      clearTimeout(timer);
    }
  }
  throw new UeipGbpAdapterError("provider_unavailable", "Provider read was unavailable.", true, attempts);
}

async function exchangeToken(credentials: GbpCredential, fetcher: typeof fetch, timeoutMs: number) {
  const url = "https://oauth2.googleapis.com/token";
  const body = new URLSearchParams({ grant_type: "refresh_token", client_id: credentials.clientId, client_secret: credentials.clientSecret, refresh_token: credentials.refreshToken });
  const result = await fetchWithReliability({ endpointId: "oauth_token", url, init: { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" }, body }, fetcher, timeoutMs, maxRetries: 0 });
  const json = z.object({ access_token: z.string().min(1) }).passthrough().safeParse(await readBoundedJson(result.response, 64_000));
  if (!json.success) throw new UeipGbpAdapterError("auth_failed", "Provider token response was invalid.", true, result.attempts);
  return json.data.access_token;
}

function numeric(value: string | undefined) {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function dateParts(date: string) {
  const [year, month, day] = date.split("-").map((part) => Number(part));
  return { year, month, day };
}

function performanceUrl(locationName: string, startDate: string, endDate: string) {
  const normalizedLocation = locationName.startsWith("locations/") ? locationName : `locations/${locationName}`;
  const url = new URL(`https://businessprofileperformance.googleapis.com/v1/${normalizedLocation}:fetchMultiDailyMetricsTimeSeries`);
  for (const metric of ["BUSINESS_IMPRESSIONS_DESKTOP_SEARCH", "BUSINESS_IMPRESSIONS_MOBILE_SEARCH", "CALL_CLICKS", "BUSINESS_DIRECTION_REQUESTS"]) url.searchParams.append("dailyMetrics", metric);
  const start = dateParts(startDate);
  const end = dateParts(endDate);
  url.searchParams.set("dailyRange.startDate.year", String(start.year));
  url.searchParams.set("dailyRange.startDate.month", String(start.month));
  url.searchParams.set("dailyRange.startDate.day", String(start.day));
  url.searchParams.set("dailyRange.endDate.year", String(end.year));
  url.searchParams.set("dailyRange.endDate.month", String(end.month));
  url.searchParams.set("dailyRange.endDate.day", String(end.day));
  return url.toString();
}

function normalizePerformance(json: unknown) {
  const parsed = performanceSchema.safeParse(json);
  if (!parsed.success) throw new UeipGbpAdapterError("invalid_response", "GBP performance schema validation failed.", true);
  const records = (parsed.data.multiDailyMetricTimeSeries ?? []).map((series) => {
    const values = series.timeSeries?.datedValues ?? [];
    return { metric: (series.dailyMetric ?? "").slice(0, 120), valueCount: values.length, total: values.reduce((sum, item) => sum + numeric(item.value), 0) };
  }).filter((record) => record.metric.length > 0);
  return {
    records,
    metrics: {
      metricSeries: records.length,
      impressions: records.filter((record) => record.metric.includes("IMPRESSIONS")).reduce((sum, record) => sum + record.total, 0),
      callClicks: records.find((record) => record.metric === "CALL_CLICKS")?.total ?? 0,
      directionRequests: records.find((record) => record.metric === "BUSINESS_DIRECTION_REQUESTS")?.total ?? 0,
    },
  };
}

function normalizeReviews(json: unknown, rowLimit: number) {
  const parsed = reviewsSchema.safeParse(json);
  if (!parsed.success) throw new UeipGbpAdapterError("invalid_response", "GBP reviews schema validation failed.", true);
  const records = (parsed.data.reviews ?? []).slice(0, rowLimit).map((review) => ({ reviewId: review.reviewId?.slice(0, 160) ?? "", starRating: review.starRating?.slice(0, 40) ?? "", updateTime: review.updateTime?.slice(0, 80) ?? "", commentPreview: review.comment?.slice(0, 160) ?? "" })).filter((record) => record.reviewId.length > 0 || record.starRating.length > 0);
  return { records, metrics: { reviews: records.length, reviewRows: records.length } };
}

export async function executeGbpRead(input: { request: GbpAdapterInput; credentials: GbpCredential; fetcher?: typeof fetch; timeoutMs?: number; maxRetries?: number; now?: Date }): Promise<GbpNormalizedResult> {
  const parsed = inputSchema.safeParse(input.request);
  if (!parsed.success) throw new UeipGbpAdapterError("invalid_request", "GBP request validation failed.", false);
  const now = input.now ?? new Date();
  const end = new Date(`${parsed.data.endDate}T00:00:00.000Z`);
  const latestComplete = new Date(now);
  latestComplete.setUTCDate(latestComplete.getUTCDate() - 2);
  if (end > latestComplete) throw new UeipGbpAdapterError("invalid_request", "GBP observation window must use complete data.", false);
  const fetcher = input.fetcher ?? fetch;
  const timeoutMs = input.timeoutMs ?? 8_000;
  const rowLimit = parsed.data.rowLimit ?? 10;
  const accessToken = await exchangeToken(input.credentials, fetcher, timeoutMs);
  const endpointId = parsed.data.capability === "gbp.performance.read" ? "performance" : "reviews";
  const url = parsed.data.capability === "gbp.performance.read" ? performanceUrl(parsed.data.locationName, parsed.data.startDate, parsed.data.endDate) : `https://mybusiness.googleapis.com/v4/${parsed.data.locationName}/reviews?pageSize=${rowLimit}&orderBy=updateTime%20desc`;
  const result = await fetchWithReliability({ endpointId, url, init: { method: "GET", headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" } }, fetcher, timeoutMs, maxRetries: input.maxRetries ?? 1 });
  const normalized = parsed.data.capability === "gbp.performance.read" ? normalizePerformance(await readBoundedJson(result.response)) : normalizeReviews(await readBoundedJson(result.response), rowLimit);
  const dataGaps = normalized.records.length === 0 ? ["GBP returned no rows for the requested bounded observation window."] : [];
  return {
    contractVersion: "ueip-gbp-result-v1",
    capability: parsed.data.capability,
    sourceLabel: `ueip:gbp:${parsed.data.capability.replaceAll(".", "_")}:readonly`,
    provenance: "Google Business Profile read-only evidence normalized by certified UEIP GBP adapter v1.",
    observationWindow: { startDate: parsed.data.startDate, endDate: parsed.data.endDate },
    freshness: now.toISOString(),
    confidence: normalized.records.length > 0 ? 84 : 55,
    signals: parsed.data.capability === "gbp.performance.read" ? { performance: normalized.records, ...normalized.metrics } : { reviews: normalized.records, ...normalized.metrics },
    dataGaps,
    reliability: { status: normalized.records.length > 0 ? "healthy" : "partial", latencyMs: result.latencyMs, attempts: result.attempts, quotaRemaining: null },
  };
}
