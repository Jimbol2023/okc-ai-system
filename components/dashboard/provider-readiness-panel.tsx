"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type ProviderGroup = "lead_enrichment" | "marketing_ads" | "ops_tooling";

type ProviderReadinessItem = {
  id: string;
  label: string;
  icon?: string;
  group: ProviderGroup;
  roiPriority: number;
  requiredEnvKeys: string[];
  optionalEnvKeys?: string[];
  readiness: string;
  connectionState: "connected" | "not_connected" | "not_required";
  publicProfileUrl?: string;
  authenticationRequired: boolean;
  supportedCapabilities: string[];
  governanceLevel: string;
  permissionsRequired: string[];
  safeNextAction: string;
  status: "configured" | "partial" | "missing" | "no_credentials_required";
  configuredEnvKeys: string[];
  missingEnvKeys: string[];
  activationState: "blocked_readiness_only";
  providerCalled: false;
  liveExecutionAllowed: false;
  liveCallsAllowed: false;
  oauthStarted: false;
  published: false;
  scheduled: false;
  connectorWrite: false;
  adsCreated: false;
  enrichmentWritten: false;
};

type ProviderReadinessResponse = {
  ok: boolean;
  providers?: ProviderReadinessItem[];
  roiPriority?: string[];
  liveCallsAllowed?: false;
  providerCalled?: false;
  recommendedNextActions?: string[];
  error?: string;
};

const groupLabels: Record<ProviderGroup, string> = {
  lead_enrichment: "Lead capture and enrichment",
  ops_tooling: "Operations tooling",
  marketing_ads: "Marketing ads",
};

const groupOrder: ProviderGroup[] = ["lead_enrichment", "ops_tooling", "marketing_ads"];

function getStatusClass(status: ProviderReadinessItem["status"]) {
  if (status === "configured" || status === "no_credentials_required") {
    return "border-emerald-200 bg-emerald-50 text-emerald-900";
  }

  if (status === "partial") {
    return "border-amber-200 bg-amber-50 text-amber-900";
  }

  return "border-slate-200 bg-slate-50 text-slate-700";
}

function formatStatus(status: ProviderReadinessItem["status"]) {
  return status.replaceAll("_", " ");
}

async function readJsonResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    throw new Error("Unexpected non-JSON response from provider readiness API.");
  }

  return response.json() as Promise<T>;
}

export function ProviderReadinessPanel() {
  const [providers, setProviders] = useState<ProviderReadinessItem[]>([]);
  const [recommendedNextActions, setRecommendedNextActions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReadiness = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/provider-readiness", {
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      });
      const data = await readJsonResponse<ProviderReadinessResponse>(response);

      if (!response.ok || !data.ok || !data.providers) {
        throw new Error(data.error || "Failed to load provider readiness.");
      }

      setProviders(data.providers);
      setRecommendedNextActions(data.recommendedNextActions ?? []);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load provider readiness.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReadiness();
  }, [loadReadiness]);

  const providersByGroup = useMemo(
    () =>
      groupOrder.map((group) => ({
        group,
        providers: providers.filter((provider) => provider.group === group),
      })),
    [providers],
  );

  return (
    <section
      aria-labelledby="provider-readiness-heading"
      className="overflow-hidden rounded-[1.5rem] border border-border bg-surface p-5 sm:p-6"
    >
      <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">
            API readiness layer
          </p>
          <h2 id="provider-readiness-heading" className="break-words text-xl font-semibold text-primary">
            Provider setup status
          </h2>
          <p className="max-w-3xl break-words text-sm leading-6 text-muted">
            Readiness checks for future integrations. This panel only verifies placeholder setup and keeps all provider
            calls, OAuth starts, enrichment writes, ads, posts, workflow triggers, and automated outreach blocked.
          </p>
        </div>
        <div className="flex max-w-full flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.1em]">
          <span className="max-w-full break-words rounded-full border border-red-200 bg-red-50 px-3 py-1 text-center leading-5 text-red-800">
            Live calls blocked
          </span>
          <span className="max-w-full break-words rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-center leading-5 text-blue-900">
            providerCalled:false
          </span>
        </div>
      </div>

      {loading ? <p className="mt-4 text-sm text-muted">Loading provider readiness...</p> : null}
      {error ? <p className="mt-4 text-sm font-medium text-red-700">{error}</p> : null}

      <div className="mt-5 grid gap-4">
        {providersByGroup.map(({ group, providers: groupProviders }) => (
          <div key={group} className="min-w-0">
            <h3 className="break-words text-base font-semibold text-primary">{groupLabels[group]}</h3>
            <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {groupProviders.map((provider) => (
                <article key={provider.id} className="min-w-0 rounded-xl border border-border bg-white p-4">
                  <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <h4 className="break-words text-sm font-semibold text-primary">
                      {provider.icon ? <span aria-hidden="true" className="mr-2 uppercase">{provider.icon}</span> : null}
                      {provider.label}
                    </h4>
                    <span
                      className={`max-w-full break-words rounded-full border px-3 py-1 text-xs font-bold uppercase leading-5 ${getStatusClass(
                        provider.status,
                      )}`}
                    >
                      {formatStatus(provider.status)}
                    </span>
                  </div>
                  <p className="mt-3 break-words text-xs font-bold uppercase leading-5 tracking-[0.08em] text-blue-950">
                    {provider.readiness}
                  </p>
                  <p className="mt-3 break-words text-sm leading-6 text-muted">{provider.safeNextAction}</p>
                  {provider.publicProfileUrl ? (
                    <p className="mt-3 break-words text-xs font-semibold leading-5 text-primary">
                      Public page: {provider.publicProfileUrl}
                    </p>
                  ) : null}
                  {provider.supportedCapabilities.length > 0 ? (
                    <p className="mt-3 break-words text-xs font-semibold uppercase leading-5 tracking-[0.08em] text-muted">
                      Capabilities: {provider.supportedCapabilities.join(", ")}
                    </p>
                  ) : null}
                  {provider.permissionsRequired.length > 0 ? (
                    <p className="mt-2 break-words text-xs font-semibold uppercase leading-5 tracking-[0.08em] text-muted">
                      Permissions: {provider.permissionsRequired.join(", ")}
                    </p>
                  ) : null}
                  <p className="mt-3 break-words text-xs font-semibold uppercase leading-5 tracking-[0.08em] text-muted">
                    Missing: {provider.missingEnvKeys.length > 0 ? provider.missingEnvKeys.join(", ") : "none"}
                  </p>
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>

      {recommendedNextActions.length > 0 ? (
        <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-950">
          <h3 className="font-semibold text-blue-950">Recommended next actions</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {recommendedNextActions.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <p className="mt-4 break-words text-xs font-semibold uppercase leading-5 tracking-[0.1em] text-muted">
        readinessOnly:true liveExecutionAllowed:false liveCallsAllowed:false oauthStarted:false published:false scheduled:false connectorWrite:false adsCreated:false enrichmentWritten:false
      </p>
    </section>
  );
}
