import { getConnectorHealth } from "@/lib/connector-platform";
import type { ProviderReadinessReport } from "@/lib/provider-readiness";
import type { BusinessDataSnapshotRecord, LiveMorningBrief } from "@/lib/read-only-business-connections";

export type NormalizedConnectorHealth = {
  connectorId: string;
  displayName: string;
  connected: boolean;
  authenticated: boolean;
  readOnly: true;
  healthy: boolean;
  lastSuccessfulRead: string | null;
  lastFailure: string | null;
  permissions: string[];
  dataFreshness: string;
  sourceLabel: string;
  providerCalled: boolean;
  liveExecutionAllowed: false;
};

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}

export function normalizeConnectorHealth(input: {
  snapshots?: BusinessDataSnapshotRecord[];
  morningBrief?: LiveMorningBrief | null;
  providerReadiness?: ProviderReadinessReport | null;
} = {}): NormalizedConnectorHealth[] {
  const snapshots = input.snapshots ?? [];
  const liveById = new Map((input.morningBrief?.connectorHealth ?? []).map((connector) => [connector.connectorId, connector]));
  const registry = getConnectorHealth();

  const normalized = registry.map((connector) => {
    const related = snapshots.filter((snapshot) => snapshot.connectorId === connector.connectorId);
    const successfulSnapshot = related.find((snapshot) => snapshot.providerCalled && snapshot.status !== "data_gap") ?? null;
    const failedSnapshot = related.find((snapshot) => snapshot.dataGaps.length > 0) ?? null;
    const live = liveById.get(connector.connectorId);
    const provider = input.providerReadiness?.providers.find(
      (item) => normalize(item.id) === normalize(connector.connectorId) || normalize(item.label) === normalize(connector.displayName),
    );
    const lastSuccessfulRead = successfulSnapshot?.freshness ?? live?.lastSuccessfulRead ?? connector.lastSuccessfulSync ?? null;
    const lastFailure = failedSnapshot?.dataGaps[0] ?? live?.lastDataGap ?? connector.lastFailedSync ?? null;
    const authenticated = provider ? provider.status === "configured" || provider.status === "no_credentials_required" : Boolean(lastSuccessfulRead);
    const connected = authenticated || Boolean(lastSuccessfulRead);
    const healthy = Boolean(lastSuccessfulRead) && !lastFailure;

    return {
      connectorId: connector.connectorId,
      displayName: connector.displayName,
      connected,
      authenticated,
      readOnly: true,
      healthy,
      lastSuccessfulRead,
      lastFailure,
      permissions: provider?.permissionsRequired ?? [],
      dataFreshness: lastSuccessfulRead ?? (lastFailure ? "data_gap" : "not_synced"),
      sourceLabel: successfulSnapshot?.sourceLabel ?? failedSnapshot?.sourceLabel ?? `connector:${connector.connectorId}:health`,
      providerCalled: related.some((snapshot) => snapshot.providerCalled) || Boolean(live?.providerCalled),
      liveExecutionAllowed: false,
    } satisfies NormalizedConnectorHealth;
  });

  const internalReadOnlyConnectors = [
    {
      connectorId: "lead_database",
      displayName: "Lead Database",
      sourceLabel: "internal_crm:lead_database",
      permissions: ["internal_lead_read"],
    },
    {
      connectorId: "crm",
      displayName: "CRM",
      sourceLabel: "internal_crm:stored_leads",
      permissions: ["internal_crm_read"],
    },
    {
      connectorId: "property_pipeline",
      displayName: "Property Pipeline",
      sourceLabel: "internal_pipeline:revenue_pipeline",
      permissions: ["internal_pipeline_read"],
    },
  ];

  for (const connector of internalReadOnlyConnectors) {
    const related = snapshots.filter((snapshot) => snapshot.connectorId === connector.connectorId);
    const successfulSnapshot = related.find((snapshot) => snapshot.status !== "data_gap") ?? null;
    const failedSnapshot = related.find((snapshot) => snapshot.dataGaps.length > 0) ?? null;

    normalized.push({
      connectorId: connector.connectorId,
      displayName: connector.displayName,
      connected: true,
      authenticated: true,
      readOnly: true,
      healthy: !failedSnapshot,
      lastSuccessfulRead: successfulSnapshot?.freshness ?? new Date().toISOString(),
      lastFailure: failedSnapshot?.dataGaps[0] ?? null,
      permissions: connector.permissions,
      dataFreshness: successfulSnapshot?.freshness ?? "current_internal_database",
      sourceLabel: successfulSnapshot?.sourceLabel ?? failedSnapshot?.sourceLabel ?? connector.sourceLabel,
      providerCalled: false,
      liveExecutionAllowed: false,
    });
  }

  return normalized;
}
