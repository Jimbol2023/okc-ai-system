"use client";

import { useState } from "react";

type SecurityFinding = {
  title: string;
  severity: "high" | "medium" | "low";
  file: string;
  location?: string;
  recommendedFix: string;
};

type SecurityReport = {
  ranAt: string;
  findings: SecurityFinding[];
};

function formatRunTime(timestamp: string) {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

export default function DashboardSecurityReviewPage() {
  const [report, setReport] = useState<SecurityReport | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRunReview() {
    setIsRunning(true);
    setError(null);

    try {
      const response = await fetch("/api/security-review", {
        method: "GET"
      });

      if (!response.ok) {
        throw new Error("Security review failed.");
      }

      const data = (await response.json()) as {
        ok: boolean;
        report: SecurityReport;
      };

      if (!data.ok) {
        throw new Error("Security review failed.");
      }

      setReport(data.report);
    } catch {
      setError("Unable to run the security review right now.");
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-primary">Security Review Agent</h1>
          <p className="max-w-3xl text-sm leading-6 text-muted md:text-base">
            Read-only internal review for common application and information security risks across the current project.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRunReview}
          disabled={isRunning}
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#d89a42] px-5 py-2.5 text-sm font-bold text-[#102437] transition hover:bg-[#e5a64f] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isRunning ? "Running Review..." : "Run Security Review"}
        </button>
      </div>

      {error ? <p className="text-sm font-medium text-red-700">{error}</p> : null}

      {report ? (
        <>
          <section className="rounded-[1.5rem] border border-border bg-surface p-5 shadow-[0_18px_40px_rgba(17,37,52,0.05)] md:p-6">
            <div className="grid gap-4 md:grid-cols-3">
              <SummaryCard label="Last Run" value={formatRunTime(report.ranAt)} />
              <SummaryCard label="Findings" value={String(report.findings.length)} />
              <SummaryCard
                label="Highest Severity"
                value={report.findings.some((finding) => finding.severity === "high") ? "High" : report.findings.some((finding) => finding.severity === "medium") ? "Medium" : "Low"}
              />
            </div>
          </section>

          <section className="space-y-4">
            {report.findings.length === 0 ? (
              <div className="rounded-[1.5rem] border border-dashed border-border bg-surface p-6 text-sm leading-6 text-muted">
                No obvious issues were detected by the starter review rules.
              </div>
            ) : (
              report.findings.map((finding, index) => (
                <article
                  key={`${finding.title}-${index}`}
                  className="rounded-[1.5rem] border border-border bg-surface p-5 shadow-[0_18px_40px_rgba(17,37,52,0.05)] md:p-6"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-2">
                      <h2 className="text-xl font-semibold text-primary">{finding.title}</h2>
                      <p className="text-sm text-muted">
                        {finding.file}
                        {finding.location ? ` • ${finding.location}` : ""}
                      </p>
                    </div>
                    <SeverityBadge severity={finding.severity} />
                  </div>

                  <div className="mt-4 rounded-2xl border border-border bg-white px-4 py-4">
                    <p className="text-sm font-semibold text-primary">Recommended Fix</p>
                    <p className="mt-2 text-sm leading-6 text-[#40576b]">{finding.recommendedFix}</p>
                  </div>
                </article>
              ))
            )}
          </section>
        </>
      ) : (
        <div className="rounded-[1.5rem] border border-dashed border-border bg-surface p-6 text-sm leading-6 text-muted">
          Run the security review to generate a structured report.
        </div>
      )}
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-white px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{label}</p>
      <p className="mt-2 text-lg font-semibold text-primary">{value}</p>
    </div>
  );
}

function SeverityBadge({ severity }: { severity: SecurityFinding["severity"] }) {
  const className =
    severity === "high"
      ? "bg-[#f7ddd7] text-[#9f3a22]"
      : severity === "medium"
        ? "bg-[#f6e8cc] text-[#9a6a1a]"
        : "bg-[#e7eef5] text-[#355066]";

  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${className}`}>{severity}</span>;
}
