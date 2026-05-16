import type { PortfolioAction, PortfolioDecision } from "@/types/portfolio";

type PortfolioDecisionCardProps = {
  portfolioDecision?: PortfolioDecision | null;
};

const actionStyles: Record<PortfolioAction, { label: string; className: string }> = {
  wholesale: { label: "WHOLESALE", className: "border-emerald-200 bg-emerald-50 text-emerald-800" },
  flip: { label: "FLIP", className: "border-orange-200 bg-orange-50 text-orange-800" },
  hold: { label: "HOLD", className: "border-blue-200 bg-blue-50 text-blue-800" },
  creative_finance: { label: "CREATIVE FINANCE", className: "border-violet-200 bg-violet-50 text-violet-800" },
  package_portfolio: { label: "PACKAGE PORTFOLIO", className: "border-cyan-200 bg-cyan-50 text-cyan-800" },
  pass: { label: "PASS", className: "border-slate-700 bg-slate-950 text-white" },
};

const feasibilityStyles = {
  high: "border-emerald-200 bg-emerald-50 text-emerald-800",
  medium: "border-amber-200 bg-amber-50 text-amber-800",
  low: "border-red-200 bg-red-50 text-red-800",
};

const fitStyles = {
  good: "text-emerald-700",
  tight: "text-amber-700",
  insufficient: "text-red-700",
};

function formatMoney(value?: number) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "Unavailable";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value?: number, suffix = "") {
  return typeof value === "number" && Number.isFinite(value) ? `${Math.round(value)}${suffix}` : "Unavailable";
}

function ListBlock({ title, items }: { title: string; items?: string[] }) {
  const visibleItems = items?.filter(Boolean) ?? [];

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
      {visibleItems.length > 0 ? (
        <ul className="mt-2 space-y-2">
          {visibleItems.slice(0, 5).map((item) => (
            <li key={item} className="text-sm leading-5 text-slate-700">{item}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-slate-500">None available.</p>
      )}
    </div>
  );
}

function getWarningSignals(portfolioDecision: PortfolioDecision) {
  const warnings: string[] = [];

  if ((portfolioDecision.estimatedReturn?.roi ?? 0) >= 20 && portfolioDecision.feasibilityStatus === "low") {
    warnings.push("High return but low feasibility.");
  }

  if (portfolioDecision.capitalFit === "insufficient") {
    warnings.push("Capital insufficient.");
  }

  if (portfolioDecision.timelineRisk === "high") {
    warnings.push("Timeline risk too high.");
  }

  if (portfolioDecision.executionBlockers?.some((blocker) => blocker.toLowerCase().includes("data"))) {
    warnings.push("Data quality too low for this strategy.");
  }

  return warnings;
}

export function PortfolioDecisionCard({ portfolioDecision }: PortfolioDecisionCardProps) {
  if (!portfolioDecision) {
    return (
      <section className="rounded-lg border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-600">
        Insufficient data to determine portfolio action.
      </section>
    );
  }

  const action = actionStyles[portfolioDecision.action] ?? actionStyles.pass;
  const feasibilityStatus = portfolioDecision.feasibilityStatus ?? "medium";
  const warningSignals = getWarningSignals(portfolioDecision);

  return (
    <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Portfolio builder agent</p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <span className={`rounded-md border px-4 py-2 text-2xl font-black tracking-wide ${action.className}`}>
              {action.label}
            </span>
            <div>
              <h3 className="text-lg font-semibold text-slate-950">Recommended portfolio action</h3>
              <p className="mt-1 text-sm text-slate-600">Read-only allocation guidance. No execution is triggered.</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase ${feasibilityStyles[feasibilityStatus]}`}>
              {feasibilityStatus} feasibility
            </span>
            <span className={`rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase ${fitStyles[portfolioDecision.capitalFit ?? "tight"]}`}>
              Capital {portfolioDecision.capitalFit ?? "tight"}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase text-slate-700">
              Timeline risk {portfolioDecision.timelineRisk ?? "medium"}
            </span>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[420px]">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Confidence</p>
            <p className="mt-1 text-2xl font-black text-slate-950">{formatNumber(portfolioDecision.confidence, "/100")}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Timeline</p>
            <p className="mt-1 text-2xl font-black text-slate-950">{formatNumber(portfolioDecision.timelineDays, " days")}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Capital required</p>
            <p className="mt-1 text-xl font-black text-slate-950">{formatMoney(portfolioDecision.capitalRequired)}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Estimated return</p>
            <p className="mt-1 text-xl font-black text-slate-950">
              {formatMoney(portfolioDecision.estimatedReturn?.profit)}
            </p>
            <p className="text-xs font-semibold text-slate-500">ROI {formatNumber(portfolioDecision.estimatedReturn?.roi, "%")}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <ListBlock title="Top reasons" items={portfolioDecision.rationale?.slice(0, 3)} />
        <ListBlock title="Key risks" items={portfolioDecision.risks} />
        <ListBlock title="Assumptions" items={portfolioDecision.assumptions} />
      </div>

      {warningSignals.length > 0 ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">Warning signals</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {warningSignals.map((warning) => (
              <span key={warning} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-amber-800">
                {warning}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <div className="grid gap-3 lg:grid-cols-2">
        <ListBlock title="Execution issues" items={portfolioDecision.feasibilityIssues} />
        <div className="rounded-lg border border-red-200 bg-red-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-red-800">Blockers</p>
          {portfolioDecision.executionBlockers && portfolioDecision.executionBlockers.length > 0 ? (
            <ul className="mt-2 space-y-2">
              {portfolioDecision.executionBlockers.slice(0, 5).map((blocker) => (
                <li key={blocker} className="text-sm font-medium leading-5 text-red-800">{blocker}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-red-700">No feasibility blockers detected.</p>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Feasibility explanation</p>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          Feasibility is {feasibilityStatus} based on capital fit ({portfolioDecision.capitalFit ?? "tight"}), timeline risk ({portfolioDecision.timelineRisk ?? "medium"}), confidence, data quality, and execution blockers. This is read-only validation and does not execute the action.
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Alternative ranking</p>
        {portfolioDecision.alternativeRank && portfolioDecision.alternativeRank.length > 0 ? (
          <div className="mt-2 grid gap-2 md:grid-cols-3">
            {portfolioDecision.alternativeRank.slice(0, 3).map((alternative) => (
              <div key={alternative.action} className="flex items-center justify-between gap-3 rounded-md bg-white px-3 py-2 text-sm">
                <span className="font-semibold text-slate-800">{actionStyles[alternative.action]?.label ?? alternative.action}</span>
                <span className="text-slate-500">{alternative.score}/100</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-slate-500">No alternative ranking available.</p>
        )}
      </div>
    </section>
  );
}
