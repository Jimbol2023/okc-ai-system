import { z } from "zod";

export const ga4Capabilities = [
  "analytics.traffic.read",
  "analytics.page.performance.read",
  "analytics.conversion.summary.read",
] as const;

export type Ga4Capability = (typeof ga4Capabilities)[number];

export type Ga4Credential = {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
};

export type Ga4AdapterInput = {
  capability: Ga4Capability;
  propertyId: string;
  startDate: string;
  endDate: string;
  rowLimit?: number;
};

export type Ga4NormalizedResult = {
  contractVersion: "ueip-ga4-result-v1";
  capability: Ga4Capability;
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

const metricValueSchema = z.object({ value: z.string().optional() }).passthrough();
const dimensionValueSchema = z.object({ value: z.string().optional() }).passthrough();
const runReportSchema = z.object({
  rows: z.array(z.object({
    dimensionValues: z.array(dimensionValueSchema).optional(),
    metricValues: z.array(metricValueSchema).optional(),
  }).passthrough()).optional(),
  rowCount: z.number().optional(),
}).passthrough();

const inputSchema = z.object({
  capability: z.enum(ga4Capabilities),
  propertyId: z.string().regex(/^\d{4,30}$/),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  rowLimit: z.number().int().min(1).max(50).optional(),
}).superRefine((value, context) => {
  const start = new Date(`${value.startDate}T00:00:00.000Z`);
  const end = new Date(`${value.endDate}T00:00:00.000Z`);
  if (start > end) context.addIssue({ code: "custom", path: ["endDate"], message: "GA4 end date must be on or after start date." });
  if ((end.getTime() - start.getTime()) / 86_400_000 > 90) context.addIssue({ code: "custom", path: ["endDate"], message: "GA4 observation window is too large." });
});

const endpointPolicies = {
  oauth_token: { hostname: "oauth2.googleapis.com", path: "/token", method: "POST" },
  run_report: { hostname: "analyticsdata.googleapis.com", pathPattern: /^\/v1beta\/properties\/\d{4,30}:runReport$/, method: "POST" },
} as const;

export class UeipGa4AdapterError extends Error {
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
  if (url.protocol !== "https:" || url.hostname !== policy.hostname || method !== policy.method || !pathAllowed) {
    throw new UeipGa4AdapterError("endpoint_blocked", "GA4 endpoint policy rejected the request.", false);
  }
}

async function readBoundedJson(response: Response, maxBytes = 1_000_000) {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType && !contentType.toLowerCase().includes("json")) {
    throw new UeipGa4AdapterError("invalid_response", "Provider returned an unsupported content type.", true);
  }
  const text = await response.text();
  if (new TextEncoder().encode(text).byteLength > maxBytes) {
    throw new UeipGa4AdapterError("invalid_response", "Provider response exceeded the allowed size.", true);
  }
  try {
    return text ? (JSON.parse(text) as unknown) : {};
  } catch {
    throw new UeipGa4AdapterError("invalid_response", "Provider returned invalid JSON.", true);
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
      if (response.status === 429) throw new UeipGa4AdapterError("quota", "Provider quota is unavailable.", true, attempts);
      if (response.status === 401 || response.status === 403) throw new UeipGa4AdapterError("auth_failed", "Provider authorization failed.", true, attempts);
      if (response.status >= 500 && attempts <= input.maxRetries) continue;
      if (!response.ok) throw new UeipGa4AdapterError("provider_unavailable", `Provider read failed with status ${response.status}.`, true, attempts);
      return { response, attempts, latencyMs: Date.now() - startedAt };
    } catch (error) {
      if (error instanceof UeipGa4AdapterError) throw error;
      if (error instanceof Error && error.name === "AbortError") throw new UeipGa4AdapterError("timeout", "Provider read timed out.", true, attempts);
      if (attempts > input.maxRetries) throw new UeipGa4AdapterError("provider_unavailable", "Provider read was unavailable.", true, attempts);
    } finally {
      clearTimeout(timer);
    }
  }
  throw new UeipGa4AdapterError("provider_unavailable", "Provider read was unavailable.", true, attempts);
}

async function exchangeToken(credentials: Ga4Credential, fetcher: typeof fetch, timeoutMs: number) {
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
  if (!json.success) throw new UeipGa4AdapterError("auth_failed", "Provider token response was invalid.", true, result.attempts);
  return json.data.access_token;
}

function numberFromMetric(value: string | undefined) {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function requestShape(capability: Ga4Capability, rowLimit: number) {
  if (capability === "analytics.traffic.read") {
    return {
      dimensions: [{ name: "sessionDefaultChannelGroup" }],
      metrics: [{ name: "sessions" }, { name: "activeUsers" }, { name: "screenPageViews" }, { name: "engagementRate" }, { name: "keyEvents" }],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      limit: String(rowLimit),
    };
  }
  if (capability === "analytics.page.performance.read") {
    return {
      dimensions: [{ name: "pagePath" }],
      metrics: [{ name: "sessions" }, { name: "activeUsers" }, { name: "screenPageViews" }, { name: "engagementRate" }, { name: "keyEvents" }],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      limit: String(rowLimit),
    };
  }
  return {
    dimensions: [{ name: "eventName" }],
    metrics: [{ name: "keyEvents" }, { name: "eventCount" }, { name: "activeUsers" }],
    orderBys: [{ metric: { metricName: "keyEvents" }, desc: true }],
    limit: String(rowLimit),
  };
}

function normalizeRows(capability: Ga4Capability, rows: z.infer<typeof runReportSchema>["rows"]) {
  if (capability === "analytics.conversion.summary.read") {
    const conversions = (rows ?? []).map((row) => ({
      eventName: (row.dimensionValues?.[0]?.value ?? "").slice(0, 160),
      keyEvents: numberFromMetric(row.metricValues?.[0]?.value),
      eventCount: numberFromMetric(row.metricValues?.[1]?.value),
      activeUsers: numberFromMetric(row.metricValues?.[2]?.value),
    })).filter((row) => row.eventName.length > 0);
    return {
      recordsKey: "keyEvents",
      records: conversions,
      metrics: {
        keyEvents: conversions.reduce((sum, row) => sum + row.keyEvents, 0),
        eventCount: conversions.reduce((sum, row) => sum + row.eventCount, 0),
        activeUsers: conversions.reduce((sum, row) => sum + row.activeUsers, 0),
      },
    };
  }

  const records = (rows ?? []).map((row) => ({
    dimension: (row.dimensionValues?.[0]?.value ?? "").slice(0, 500),
    sessions: numberFromMetric(row.metricValues?.[0]?.value),
    activeUsers: numberFromMetric(row.metricValues?.[1]?.value),
    pageViews: numberFromMetric(row.metricValues?.[2]?.value),
    engagementRate: numberFromMetric(row.metricValues?.[3]?.value),
    keyEvents: numberFromMetric(row.metricValues?.[4]?.value),
  })).filter((row) => row.dimension.length > 0);
  return {
    recordsKey: capability === "analytics.page.performance.read" ? "pages" : "channels",
    records,
    metrics: {
      sessions: records.reduce((sum, row) => sum + row.sessions, 0),
      activeUsers: records.reduce((sum, row) => sum + row.activeUsers, 0),
      pageViews: records.reduce((sum, row) => sum + row.pageViews, 0),
      keyEvents: records.reduce((sum, row) => sum + row.keyEvents, 0),
      topRows: records.length,
    },
  };
}

export async function executeGa4Read(input: {
  request: Ga4AdapterInput;
  credentials: Ga4Credential;
  fetcher?: typeof fetch;
  timeoutMs?: number;
  maxRetries?: number;
  now?: Date;
}): Promise<Ga4NormalizedResult> {
  const parsed = inputSchema.safeParse(input.request);
  if (!parsed.success) throw new UeipGa4AdapterError("invalid_request", "GA4 request validation failed.", false);
  const now = input.now ?? new Date();
  const end = new Date(`${parsed.data.endDate}T00:00:00.000Z`);
  const latestComplete = new Date(now);
  latestComplete.setUTCDate(latestComplete.getUTCDate() - 2);
  if (end > latestComplete) throw new UeipGa4AdapterError("invalid_request", "GA4 observation window must use complete data.", false);

  const fetcher = input.fetcher ?? fetch;
  const timeoutMs = input.timeoutMs ?? 8_000;
  const accessToken = await exchangeToken(input.credentials, fetcher, timeoutMs);
  const rowLimit = parsed.data.rowLimit ?? 10;
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${encodeURIComponent(parsed.data.propertyId)}:runReport`;
  const result = await fetchWithReliability({
    endpointId: "run_report",
    url,
    init: {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ dateRanges: [{ startDate: parsed.data.startDate, endDate: parsed.data.endDate }], ...requestShape(parsed.data.capability, rowLimit) }),
    },
    fetcher,
    timeoutMs,
    maxRetries: input.maxRetries ?? 1,
  });
  const json = runReportSchema.safeParse(await readBoundedJson(result.response));
  if (!json.success) throw new UeipGa4AdapterError("invalid_response", "GA4 runReport schema validation failed.", true, result.attempts);
  const normalized = normalizeRows(parsed.data.capability, json.data.rows);
  const dataGaps = normalized.records.length === 0 ? ["GA4 returned no rows for the requested bounded observation window."] : [];
  return {
    contractVersion: "ueip-ga4-result-v1",
    capability: parsed.data.capability,
    sourceLabel: `ueip:ga4:${parsed.data.capability.replaceAll(".", "_")}:readonly`,
    provenance: "Google Analytics Data API properties.runReport normalized by certified UEIP GA4 adapter v1.",
    observationWindow: { startDate: parsed.data.startDate, endDate: parsed.data.endDate },
    freshness: now.toISOString(),
    confidence: normalized.records.length > 0 ? 88 : 58,
    signals: { [normalized.recordsKey]: normalized.records, ...normalized.metrics },
    dataGaps,
    reliability: { status: normalized.records.length > 0 ? "healthy" : "partial", latencyMs: result.latencyMs, attempts: result.attempts, quotaRemaining: null },
  };
}
