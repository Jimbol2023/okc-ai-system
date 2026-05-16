"use client";

import { useCallback, useEffect, useState } from "react";

type SystemHealth = {
  database: "ok" | "error";
  twilio: "configured" | "missing" | "unverified";
  aiOptimization: "on" | "off";
  activeStrategiesCount: number;
  recentFailuresCount: number;
  status: "healthy" | "warning" | "critical";
};

type RevenueReadiness = {
  ready: boolean;
  checklist: {
    item: string;
    status: boolean;
  }[];
};

type RiskFlag = {
  type: string;
  severity: "low" | "medium" | "high";
  message: string;
  recommendedAction: string;
};

type ReadinessResponse = {
  success?: boolean;
  systemHealth?: SystemHealth;
  revenueReadiness?: RevenueReadiness;
  riskFlags?: RiskFlag[];
  recommendedNextActions?: string[];
  error?: string;
};

function getScaleLabel(
  systemHealth: SystemHealth | null,
  revenueReadiness: RevenueReadiness | null,
  riskFlags: RiskFlag[],
) {
  if (!systemHealth || !revenueReadiness) {
    return {
      label: "NOT READY",
      className: "bg-red-100 text-red-800 border-red-200",
    };
  }

  if (
    systemHealth.status === "critical" ||
    riskFlags.some((flag) => flag.severity === "high")
  ) {
    return {
      label: "NOT READY",
      className: "bg-red-100 text-red-800 border-red-200",
    };
  }

  if (!revenueReadiness.ready || systemHealth.status === "warning" || riskFlags.length > 0) {
    return {
      label: "WARNING",
      className: "bg-yellow-100 text-yellow-800 border-yellow-200",
    };
  }

  return {
    label: "SAFE TO SCALE",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
  };
}

function getSeverityClass(severity: RiskFlag["severity"]) {
  if (severity === "high") {
    return "border-red-200 bg-red-50 text-red-800";
  }

  if (severity === "medium") {
    return "border-yellow-200 bg-yellow-50 text-yellow-800";
  }

  return "border-slate-200 bg-slate-50 text-slate-700";
}

function formatItem(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

async function readJsonResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    throw new Error("Unexpected non-JSON response from readiness API.");
  }

  return response.json() as Promise<T>;
}

export default function SystemReadinessPanel() {
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [revenueReadiness, setRevenueReadiness] =
    useState<RevenueReadiness | null>(null);
  const [riskFlags, setRiskFlags] = useState<RiskFlag[]>([]);
  const [recommendedNextActions, setRecommendedNextActions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReadiness = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/system-readiness", {
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      });
      const data = await readJsonResponse<ReadinessResponse>(response);

      if (!response.ok || !data.success || !data.systemHealth || !data.revenueReadiness) {
        throw new Error(data.error || "Failed to load system readiness.");
      }

      setSystemHealth(data.systemHealth);
      setRevenueReadiness(data.revenueReadiness);
      setRiskFlags(data.riskFlags ?? []);
      setRecommendedNextActions(data.recommendedNextActions ?? []);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load system readiness.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReadiness();
  }, [loadReadiness]);

  const scale = getScaleLabel(systemHealth, revenueReadiness, riskFlags);

  return (
    <section className="rounded-[1.5rem] border border-border bg-surface p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">
            System Readiness
          </p>
          <h2 className="mt-2 text-xl font-semibold text-primary">
            Production Safety + Revenue Readiness
          </h2>
        </div>
        <span
          className={`inline-flex w-fit rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] ${scale.className}`}
        >
          {scale.label}
        </span>
      </div>

      {loading ? <p className="mt-4 text-sm text-muted">Loading readiness...</p> : null}
      {error ? <p className="mt-4 text-sm font-medium text-red-700">{error}</p> : null}

      {systemHealth && revenueReadiness ? (
        <>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <div className="rounded-2xl border border-border bg-white p-4">
              <p className="text-xs uppercase text-muted">Database</p>
              <p className="mt-1 font-semibold text-primary">{systemHealth.database}</p>
            </div>
            <div className="rounded-2xl border border-border bg-white p-4">
              <p className="text-xs uppercase text-muted">Twilio</p>
              <p className="mt-1 font-semibold text-primary">{systemHealth.twilio}</p>
            </div>
            <div className="rounded-2xl border border-border bg-white p-4">
              <p className="text-xs uppercase text-muted">AI Optimization</p>
              <p className="mt-1 font-semibold text-primary">
                {systemHealth.aiOptimization}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-white p-4">
              <p className="text-xs uppercase text-muted">Active Strategies</p>
              <p className="mt-1 font-semibold text-primary">
                {systemHealth.activeStrategiesCount}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-white p-4">
              <p className="text-xs uppercase text-muted">Recent Failures</p>
              <p className="mt-1 font-semibold text-primary">
                {systemHealth.recentFailuresCount}
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-3">
            <div className="rounded-2xl border border-border bg-white p-4">
              <h3 className="font-semibold text-primary">Readiness Checklist</h3>
              <div className="mt-3 space-y-2">
                {revenueReadiness.checklist.map((item) => (
                  <div key={item.item} className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-muted">{formatItem(item.item)}</span>
                    <span
                      className={
                        item.status
                          ? "font-semibold text-emerald-700"
                          : "font-semibold text-red-700"
                      }
                    >
                      {item.status ? "OK" : "Needs Work"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-white p-4">
              <h3 className="font-semibold text-primary">Risk Flags</h3>
              {riskFlags.length > 0 ? (
                <div className="mt-3 space-y-2">
                  {riskFlags.map((flag) => (
                    <div
                      key={`${flag.type}-${flag.message}`}
                      className={`rounded-xl border p-3 text-sm ${getSeverityClass(flag.severity)}`}
                    >
                      <p className="font-semibold uppercase">{flag.severity}</p>
                      <p className="mt-1">{flag.message}</p>
                      <p className="mt-2 text-xs">{flag.recommendedAction}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted">No risk flags detected.</p>
              )}
            </div>

            <div className="rounded-2xl border border-border bg-white p-4">
              <h3 className="font-semibold text-primary">Recommended Next Actions</h3>
              <div className="mt-3 space-y-2">
                {recommendedNextActions.map((action) => (
                  <p key={action} className="rounded-xl bg-slate-50 p-3 text-sm text-muted">
                    {action}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : null}
    </section>
  );
}
