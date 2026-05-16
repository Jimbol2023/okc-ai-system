import type { CapitalStackMethod, FundingSensitivityResult } from "@/types/capital-stack";

type CapitalStackComparisonCardProps = {
  capitalStackComparison?: FundingSensitivityResult | null;
};

const methodLabels: Record<CapitalStackMethod, string> = {
  cash: "Cash",
  private_money: "Private Money",
  hard_money: "Hard Money",
  bridge_lending: "Bridge Lending",
  transactional_funding: "Transactional Funding",
  seller_finance: "Seller Finance",
  subject_to: "Subject To",
  partnership: "Partnership",
  buyer_funded_double_close: "Buyer-Funded Double Close",
  pass_or_wait: "Pass / Wait",
};

function formatMoney(value?: number) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "Unavailable";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function badgeClass(value?: string) {
  if (value === "high" || value === "fast" || value === "strong" || value === "low") {
    return "bg-emerald-50 text-emerald-800 border-emerald-200";
  }

  if (value === "medium" || value === "moderate") {
    return "bg-amber-50 text-amber-800 border-amber-200";
  }

  return "bg-red-50 text-red-800 border-red-200";
}

export function CapitalStackComparisonCard({ capitalStackComparison }: CapitalStackComparisonCardProps) {
  if (!capitalStackComparison) {
    return (
      <section className="rounded-lg border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-600">
        Capital stack comparison unavailable. Add purchase price, ARV, repairs, timeline, expected exit, and funding assumptions.
      </section>
    );
  }

  return (
    <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Capital stack comparison</p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <span className="rounded-md border border-indigo-200 bg-indigo-50 px-4 py-2 text-2xl font-black tracking-wide text-indigo-800">
              {methodLabels[capitalStackComparison.bestMethod]}
            </span>
            <div>
              <h3 className="text-lg font-semibold text-slate-950">Best funding choice</h3>
              <p className="mt-1 text-sm leading-5 text-slate-600">{capitalStackComparison.bestReason || "Best reason unavailable."}</p>
            </div>
          </div>
        </div>
        <p className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm font-semibold text-slate-700">
          Some funding comparison values are estimated using default assumptions.
        </p>
      </div>

      <div className="grid gap-3">
        {capitalStackComparison.scenarios.slice(0, 5).map((scenario) => (
          <div key={scenario.method} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-bold text-slate-950">{methodLabels[scenario.method]}</p>
                <p className="mt-1 text-xs font-semibold text-slate-500">Score {scenario.score}/100</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className={`rounded-full border px-2 py-1 text-xs font-bold uppercase ${badgeClass(scenario.riskLevel)}`}>
                  Risk {scenario.riskLevel ?? "medium"}
                </span>
                <span className={`rounded-full border px-2 py-1 text-xs font-bold uppercase ${badgeClass(scenario.speedFit)}`}>
                  Speed {scenario.speedFit ?? "moderate"}
                </span>
                <span className={`rounded-full border px-2 py-1 text-xs font-bold uppercase ${badgeClass(scenario.feasibility)}`}>
                  Feasibility {scenario.feasibility ?? "medium"}
                </span>
              </div>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
              <p className="text-sm text-slate-700"><strong>Profit:</strong> {formatMoney(scenario.estimatedProfit)}</p>
              <p className="text-sm text-slate-700"><strong>Cash:</strong> {formatMoney(scenario.cashRequired)}</p>
              <p className="text-sm text-slate-700"><strong>Financing:</strong> {formatMoney(scenario.totalFinancingCost)}</p>
              <p className="text-sm text-slate-700"><strong>Carry/mo:</strong> {formatMoney(scenario.monthlyCarryingCost)}</p>
              <p className="text-sm text-slate-700"><strong>Timeline:</strong> {scenario.timelineDays ?? "Unavailable"} days</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Stress tests</p>
          <div className="mt-2 space-y-2 text-sm leading-5 text-slate-700">
            <p>{capitalStackComparison.stressTests?.interestRateIncrease || "Rate stress unavailable."}</p>
            <p>{capitalStackComparison.stressTests?.repairCostIncrease || "Repair stress unavailable."}</p>
            <p>{capitalStackComparison.stressTests?.timelineDelay || "Timeline stress unavailable."}</p>
            <p>{capitalStackComparison.stressTests?.lowerExitPrice || "Exit price stress unavailable."}</p>
          </div>
        </div>

        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">Sensitivity alerts</p>
          {capitalStackComparison.sensitivityAlerts && capitalStackComparison.sensitivityAlerts.length > 0 ? (
            <ul className="mt-2 space-y-2">
              {capitalStackComparison.sensitivityAlerts.map((alert) => (
                <li key={alert} className="text-sm font-medium leading-5 text-amber-800">{alert}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-amber-700">No major sensitivity alerts detected.</p>
          )}
        </div>
      </div>

      {capitalStackComparison.avoidMethods && capitalStackComparison.avoidMethods.length > 0 ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-red-800">Avoid methods</p>
          <div className="mt-2 grid gap-2 md:grid-cols-2">
            {capitalStackComparison.avoidMethods.map((item) => (
              <p key={item.method} className="text-sm font-medium leading-5 text-red-800">
                {methodLabels[item.method]}: {item.reason}
              </p>
            ))}
          </div>
        </div>
      ) : null}

      {capitalStackComparison.complianceWarnings && capitalStackComparison.complianceWarnings.length > 0 ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">Compliance warnings</p>
          <ul className="mt-2 space-y-2">
            {capitalStackComparison.complianceWarnings.map((warning) => (
              <li key={warning} className="text-sm font-medium leading-5 text-amber-800">{warning}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Recommended next step</p>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">
          {capitalStackComparison.recommendedNextStep || "Review capital stack assumptions before any funding or execution step."}
        </p>
      </div>
    </section>
  );
}
