import { type ConnectorActivationGateReport, type ConnectorActivationGateRecord } from "@/lib/connector-activation-gate";
import { readOnlyBusinessSafetyFlags, type BusinessDataCategory, type BusinessDataSnapshotRecord, type BusinessSnapshotStatus } from "@/lib/read-only-business-connections";

export type ReadOnlyConnectorHealth = {
  connectorId: string;
  mode: "read_only";
  status: "ready" | "blocked" | "not_configured" | "rate_limited" | "partial";
  reason: string;
  providerCalled: false;
  liveExecutionAllowed: false;
};

export type ReadOnlyConnectorSnapshot = BusinessDataSnapshotRecord;

export type ReadOnlyConnectorAdapter = {
  connectorId: string;
  mode: "read_only";
  requiredScopes: string[];
  healthCheck(): Promise<ReadOnlyConnectorHealth>;
  readSnapshot(): Promise<ReadOnlyConnectorSnapshot>;
};

const categoryByConnector: Record<string, BusinessDataCategory> = {
  gmail: "gmail_inbox",
  google_calendar: "google_calendar_events",
  google_drive: "google_drive_documents",
  google_search_console: "search_console_performance",
  google_analytics: "google_analytics_traffic",
  google_business_profile: "google_business_profile_performance",
  youtube: "youtube_channel",
};

const scopesByConnector: Record<string, string[]> = {
  gmail: ["https://www.googleapis.com/auth/gmail.readonly"],
  google_calendar: ["https://www.googleapis.com/auth/calendar.events.readonly"],
  google_drive: ["https://www.googleapis.com/auth/drive.metadata.readonly"],
  google_search_console: ["https://www.googleapis.com/auth/webmasters.readonly"],
  google_analytics: ["https://www.googleapis.com/auth/analytics.readonly"],
  google_business_profile: ["https://www.googleapis.com/auth/business.manage"],
  youtube: ["https://www.googleapis.com/auth/youtube.readonly", "https://www.googleapis.com/auth/yt-analytics.readonly"],
};

function snapshot(input: {
  connectorId: string;
  status: BusinessSnapshotStatus;
  summary: string;
  dataGaps: string[];
  generatedAt: string;
}): BusinessDataSnapshotRecord {
  return {
    tenantId: "default",
    snapshotDate: input.generatedAt,
    provider: input.connectorId.startsWith("google") || input.connectorId === "gmail" || input.connectorId === "youtube" ? "Google" : "Internal",
    connectorId: input.connectorId,
    category: categoryByConnector[input.connectorId] ?? "internal_crm",
    status: input.status,
    sourceLabel: `read_only_adapter:${input.connectorId}`,
    provenance: "Sprint 6 read-only adapter boundary",
    freshness: input.generatedAt,
    summary: input.summary,
    metrics: {},
    records: [],
    dataGaps: input.dataGaps,
    assumptions: ["Sprint 6 adapter boundary does not call providers; live reads require future approval."],
    safetyFlags: readOnlyBusinessSafetyFlags,
    providerCalled: false,
    sent: false,
    published: false,
    crmMutated: false,
    liveExecutionAllowed: false,
  };
}

function adapterStatus(record: ConnectorActivationGateRecord): ReadOnlyConnectorHealth["status"] {
  if (record.healthStatus === "ready") return "ready";
  if (record.healthStatus === "rate_limited") return "rate_limited";
  if (record.healthStatus === "not_configured") return "not_configured";
  if (record.healthStatus === "blocked") return "blocked";

  return "partial";
}

export function createReadOnlyConnectorAdaptersFromGate(gate: ConnectorActivationGateReport, generatedAt = gate.generatedAt): ReadOnlyConnectorAdapter[] {
  return gate.googleWorkspaceFoundation.map((record) => ({
    connectorId: record.connectorId,
    mode: "read_only" as const,
    requiredScopes: scopesByConnector[record.connectorId] ?? [],
    async healthCheck() {
      return {
        connectorId: record.connectorId,
        mode: "read_only",
        status: adapterStatus(record),
        reason: record.nextSafeAction,
        providerCalled: false,
        liveExecutionAllowed: false,
      };
    },
    async readSnapshot() {
      const health = await this.healthCheck();
      if (health.status !== "ready") {
        return snapshot({
          connectorId: record.connectorId,
          status: health.status === "rate_limited" ? "blocked" : "data_gap",
          summary: `${record.connector} is not approved for read-only snapshot collection yet.`,
          dataGaps: [health.reason, "Sprint 6 live provider reads remain disabled until explicit approval."],
          generatedAt,
        });
      }

      return snapshot({
        connectorId: record.connectorId,
        status: "partial",
        summary: `${record.connector} is ready at the gate, but Sprint 6 does not perform live provider reads without a later explicit approval.`,
        dataGaps: ["Live read adapter execution remains disabled in this foundation sprint."],
        generatedAt,
      });
    },
  }));
}

export async function createReadOnlyConnectorAdapterReport(gate: ConnectorActivationGateReport) {
  const adapters = createReadOnlyConnectorAdaptersFromGate(gate);
  const health = await Promise.all(adapters.map((adapter) => adapter.healthCheck()));
  const snapshots = await Promise.all(adapters.map((adapter) => adapter.readSnapshot()));

  return {
    ok: true as const,
    generatedAt: gate.generatedAt,
    adapters: adapters.map((adapter) => ({
      connectorId: adapter.connectorId,
      mode: adapter.mode,
      requiredScopes: adapter.requiredScopes,
      hasWriteMethod: false,
    })),
    health,
    snapshots,
    safety: {
      readOnly: true as const,
      providerCalled: false as const,
      liveExecutionAllowed: false as const,
      externalWritesAllowed: false as const,
      adapterWritesExposed: false as const,
    },
    providerCalled: false as const,
    liveExecutionAllowed: false as const,
  };
}
