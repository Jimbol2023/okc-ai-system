import { z } from "zod";

export const googleWorkspaceCapabilities = [
  "gmail.inbox.metadata.read",
  "calendar.events.read",
  "drive.metadata.read",
] as const;

export type GoogleWorkspaceCapability = (typeof googleWorkspaceCapabilities)[number];
export type GoogleWorkspaceConnectorId = "gmail" | "google_calendar" | "google_drive";

export type GoogleWorkspaceCredential = {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
};

export type GoogleWorkspaceAdapterInput = {
  capability: GoogleWorkspaceCapability;
  rowLimit?: number;
  observationStart: string;
  observationEnd: string;
};

export type GoogleWorkspaceNormalizedResult = {
  contractVersion: "ueip-google-workspace-result-v1";
  capability: GoogleWorkspaceCapability;
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

const inputSchema = z.object({
  capability: z.enum(googleWorkspaceCapabilities),
  rowLimit: z.number().int().min(1).max(10).optional(),
  observationStart: z.string().datetime(),
  observationEnd: z.string().datetime(),
}).superRefine((value, context) => {
  const start = new Date(value.observationStart);
  const end = new Date(value.observationEnd);
  if (start > end) context.addIssue({ code: "custom", path: ["observationEnd"], message: "Observation end must follow observation start." });
  if (end.getTime() - start.getTime() > 7 * 86_400_000) context.addIssue({ code: "custom", path: ["observationEnd"], message: "Workspace observation window must not exceed seven days." });
});

const endpointPolicies = {
  oauth_token: { hostname: "oauth2.googleapis.com", method: "POST", path: /^\/token$/ },
  gmail_list: { hostname: "gmail.googleapis.com", method: "GET", path: /^\/gmail\/v1\/users\/me\/messages$/ },
  gmail_detail: { hostname: "gmail.googleapis.com", method: "GET", path: /^\/gmail\/v1\/users\/me\/messages\/[^/]+$/ },
  calendar_events: { hostname: "www.googleapis.com", method: "GET", path: /^\/calendar\/v3\/calendars\/primary\/events$/ },
  drive_files: { hostname: "www.googleapis.com", method: "GET", path: /^\/drive\/v3\/files$/ },
} as const;

type EndpointId = keyof typeof endpointPolicies;

export class UeipGoogleWorkspaceAdapterError extends Error {
  constructor(
    public readonly category: "invalid_request" | "auth_failed" | "timeout" | "quota" | "provider_unavailable" | "invalid_response" | "endpoint_blocked",
    message: string,
    public readonly providerAttempted: boolean,
    public readonly attempts = 0,
  ) {
    super(message);
  }
}

function assertEndpoint(endpointId: EndpointId, rawUrl: string, method: string) {
  const url = new URL(rawUrl);
  const policy = endpointPolicies[endpointId];
  if (url.protocol !== "https:" || url.hostname !== policy.hostname || method !== policy.method || !policy.path.test(url.pathname)) {
    throw new UeipGoogleWorkspaceAdapterError("endpoint_blocked", "Google Workspace endpoint policy rejected the request.", false);
  }
}

async function readBoundedJson(response: Response, maxBytes = 512_000) {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType && !contentType.toLowerCase().includes("json")) {
    throw new UeipGoogleWorkspaceAdapterError("invalid_response", "Provider returned an unsupported content type.", true);
  }
  const text = await response.text();
  if (new TextEncoder().encode(text).byteLength > maxBytes) {
    throw new UeipGoogleWorkspaceAdapterError("invalid_response", "Provider response exceeded the governed size limit.", true);
  }
  try {
    return text ? JSON.parse(text) as Record<string, unknown> : {};
  } catch {
    throw new UeipGoogleWorkspaceAdapterError("invalid_response", "Provider returned invalid JSON.", true);
  }
}

async function governedFetch(input: { endpointId: EndpointId; url: string; init?: RequestInit; fetcher: typeof fetch; timeoutMs: number }) {
  const method = String(input.init?.method ?? "GET").toUpperCase();
  assertEndpoint(input.endpointId, input.url, method);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), input.timeoutMs);
  const startedAt = Date.now();
  try {
    const response = await input.fetcher(input.url, { ...input.init, signal: controller.signal });
    if (response.status === 429) throw new UeipGoogleWorkspaceAdapterError("quota", "Google Workspace quota is unavailable.", true, 1);
    if (response.status === 401 || response.status === 403) throw new UeipGoogleWorkspaceAdapterError("auth_failed", "Google Workspace authorization failed.", true, 1);
    if (!response.ok) throw new UeipGoogleWorkspaceAdapterError("provider_unavailable", `Google Workspace read failed with status ${response.status}.`, true, 1);
    return { response, latencyMs: Date.now() - startedAt };
  } catch (error) {
    if (error instanceof UeipGoogleWorkspaceAdapterError) throw error;
    if (error instanceof Error && error.name === "AbortError") throw new UeipGoogleWorkspaceAdapterError("timeout", "Google Workspace read timed out.", true, 1);
    throw new UeipGoogleWorkspaceAdapterError("provider_unavailable", "Google Workspace read was unavailable.", true, 1);
  } finally {
    clearTimeout(timer);
  }
}

async function exchangeToken(credentials: GoogleWorkspaceCredential, fetcher: typeof fetch, timeoutMs: number) {
  const body = new URLSearchParams({ grant_type: "refresh_token", client_id: credentials.clientId, client_secret: credentials.clientSecret, refresh_token: credentials.refreshToken });
  const result = await governedFetch({ endpointId: "oauth_token", url: "https://oauth2.googleapis.com/token", init: { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" }, body }, fetcher, timeoutMs });
  const parsed = z.object({ access_token: z.string().min(1) }).passthrough().safeParse(await readBoundedJson(result.response, 64_000));
  if (!parsed.success) throw new UeipGoogleWorkspaceAdapterError("auth_failed", "Google OAuth token response was invalid.", true, 1);
  return parsed.data.access_token;
}

function headersFromMessage(value: unknown) {
  const payload = value && typeof value === "object" ? (value as { payload?: { headers?: unknown } }).payload : undefined;
  return Array.isArray(payload?.headers) ? payload.headers.filter((item): item is { name?: string; value?: string } => Boolean(item && typeof item === "object")) : [];
}

async function readGmail(input: z.infer<typeof inputSchema>, accessToken: string, fetcher: typeof fetch, timeoutMs: number) {
  const limit = input.rowLimit ?? 5;
  const listUrl = new URL("https://gmail.googleapis.com/gmail/v1/users/me/messages");
  listUrl.searchParams.set("labelIds", "INBOX");
  listUrl.searchParams.set("maxResults", String(limit));
  listUrl.searchParams.set("q", `after:${Math.floor(new Date(input.observationStart).getTime() / 1000)} before:${Math.ceil(new Date(input.observationEnd).getTime() / 1000)}`);
  const list = await governedFetch({ endpointId: "gmail_list", url: listUrl.toString(), init: { headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" } }, fetcher, timeoutMs });
  const listJson = await readBoundedJson(list.response);
  const messages = Array.isArray(listJson.messages) ? listJson.messages.slice(0, limit) : [];
  const records: Array<Record<string, unknown>> = [];
  let latencyMs = list.latencyMs;
  for (const message of messages) {
    const id = message && typeof message === "object" && typeof (message as { id?: unknown }).id === "string" ? (message as { id: string }).id : "";
    if (!id) continue;
    const detailUrl = new URL(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${encodeURIComponent(id)}`);
    detailUrl.searchParams.set("format", "metadata");
    for (const header of ["From", "Subject", "Date"]) detailUrl.searchParams.append("metadataHeaders", header);
    const detail = await governedFetch({ endpointId: "gmail_detail", url: detailUrl.toString(), init: { headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" } }, fetcher, timeoutMs });
    latencyMs += detail.latencyMs;
    const json = await readBoundedJson(detail.response);
    const headers = headersFromMessage(json);
    records.push({ id, threadId: json.threadId ?? null, snippet: typeof json.snippet === "string" ? json.snippet.slice(0, 160) : "", from: headers.find((item) => item.name === "From")?.value ?? "", subject: headers.find((item) => item.name === "Subject")?.value ?? "", date: headers.find((item) => item.name === "Date")?.value ?? "" });
  }
  const actionableMessageSignals = records.filter((record) => /seller|property|house|offer|closing|title|lead|appointment|contract/i.test(`${record.subject ?? ""} ${record.snippet ?? ""}`)).length;
  return { records, latencyMs, signals: { messages: records, recentInboxMessages: records.length, actionableMessageSignals } };
}

async function readCalendar(input: z.infer<typeof inputSchema>, accessToken: string, fetcher: typeof fetch, timeoutMs: number) {
  const url = new URL("https://www.googleapis.com/calendar/v3/calendars/primary/events");
  url.searchParams.set("timeMin", input.observationStart);
  url.searchParams.set("timeMax", input.observationEnd);
  url.searchParams.set("singleEvents", "true");
  url.searchParams.set("orderBy", "startTime");
  url.searchParams.set("maxResults", String(input.rowLimit ?? 10));
  const result = await governedFetch({ endpointId: "calendar_events", url: url.toString(), init: { headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" } }, fetcher, timeoutMs });
  const json = await readBoundedJson(result.response);
  const records = (Array.isArray(json.items) ? json.items : []).map((value) => {
    const event = value as { id?: string; summary?: string; status?: string; start?: { dateTime?: string; date?: string }; end?: { dateTime?: string; date?: string } };
    return { id: event.id ?? null, summary: event.summary ?? "", status: event.status ?? "", start: event.start?.dateTime ?? event.start?.date ?? null, end: event.end?.dateTime ?? event.end?.date ?? null };
  });
  const ordered = records.map((event) => ({ start: event.start ? new Date(event.start).getTime() : Number.NaN, end: event.end ? new Date(event.end).getTime() : Number.NaN })).filter((event) => Number.isFinite(event.start) && Number.isFinite(event.end)).sort((left, right) => left.start - right.start);
  const schedulingConflicts = ordered.reduce((count, event, index) => index > 0 && event.start < ordered[index - 1].end ? count + 1 : count, 0);
  return { records, latencyMs: result.latencyMs, signals: { events: records, upcomingEvents: records.length, schedulingConflicts } };
}

async function readDrive(input: z.infer<typeof inputSchema>, accessToken: string, fetcher: typeof fetch, timeoutMs: number) {
  const url = new URL("https://www.googleapis.com/drive/v3/files");
  url.searchParams.set("pageSize", String(input.rowLimit ?? 10));
  url.searchParams.set("orderBy", "modifiedTime desc");
  url.searchParams.set("fields", "files(id,name,mimeType,modifiedTime,webViewLink)");
  url.searchParams.set("q", `modifiedTime >= '${input.observationStart}' and trashed = false`);
  const result = await governedFetch({ endpointId: "drive_files", url: url.toString(), init: { headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" } }, fetcher, timeoutMs });
  const json = await readBoundedJson(result.response);
  const records = (Array.isArray(json.files) ? json.files : []).map((value) => {
    const file = value as { id?: string; name?: string; mimeType?: string; modifiedTime?: string; webViewLink?: string };
    return { id: file.id ?? null, name: file.name ?? "", mimeType: file.mimeType ?? "", modifiedTime: file.modifiedTime ?? null, webViewLink: file.webViewLink ?? null };
  });
  const relevantDocumentActivity = records.filter((record) => /seller|property|acquisition|closing|title|deal|lead|contract/i.test(record.name)).length;
  return { records, latencyMs: result.latencyMs, signals: { documents: records, recentDocuments: records.length, relevantDocumentActivity } };
}

export function connectorIdForWorkspaceCapability(capability: GoogleWorkspaceCapability): GoogleWorkspaceConnectorId {
  if (capability === "gmail.inbox.metadata.read") return "gmail";
  if (capability === "calendar.events.read") return "google_calendar";
  return "google_drive";
}

export async function executeGoogleWorkspaceRead(input: { request: GoogleWorkspaceAdapterInput; credentials: GoogleWorkspaceCredential; fetcher?: typeof fetch; timeoutMs?: number; now?: Date }): Promise<GoogleWorkspaceNormalizedResult> {
  const parsed = inputSchema.safeParse(input.request);
  if (!parsed.success) throw new UeipGoogleWorkspaceAdapterError("invalid_request", "Google Workspace request validation failed.", false);
  const fetcher = input.fetcher ?? fetch;
  const timeoutMs = input.timeoutMs ?? 8_000;
  const accessToken = await exchangeToken(input.credentials, fetcher, timeoutMs);
  const read = parsed.data.capability === "gmail.inbox.metadata.read"
    ? await readGmail(parsed.data, accessToken, fetcher, timeoutMs)
    : parsed.data.capability === "calendar.events.read"
      ? await readCalendar(parsed.data, accessToken, fetcher, timeoutMs)
      : await readDrive(parsed.data, accessToken, fetcher, timeoutMs);
  const connectorId = connectorIdForWorkspaceCapability(parsed.data.capability);
  const dataGaps = read.records.length === 0 ? [`${connectorId} returned no records for the bounded observation window.`] : [];
  return {
    contractVersion: "ueip-google-workspace-result-v1",
    capability: parsed.data.capability,
    sourceLabel: `ueip:${connectorId}:${parsed.data.capability.replaceAll(".", "_")}:readonly`,
    provenance: `Google ${connectorId} read-only API normalized by certified UEIP Google Workspace adapter v1.`,
    observationWindow: { startDate: parsed.data.observationStart, endDate: parsed.data.observationEnd },
    freshness: (input.now ?? new Date()).toISOString(),
    confidence: read.records.length > 0 ? 88 : 58,
    signals: read.signals,
    dataGaps,
    reliability: { status: read.records.length > 0 ? "healthy" : "partial", latencyMs: read.latencyMs, attempts: 1, quotaRemaining: null },
  };
}
