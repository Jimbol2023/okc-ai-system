import type { DecisionScenarioSummary } from "@/types/design-intelligence";

type ScenarioSummaryCardProps = {
  scenarioSummary?: DecisionScenarioSummary | null;
};

function SummaryItem({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-medium leading-5 text-slate-800">{value || "Missing scenario data"}</p>
    </div>
  );
}

export function ScenarioSummaryCard({ scenarioSummary }: ScenarioSummaryCardProps) {
  if (!scenarioSummary) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
        Missing scenario comparison.
      </div>
    );
  }

  return (
    <details className="rounded-lg border border-slate-200 bg-white p-4">
      <summary className="cursor-pointer list-none">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Scenario - Lower-priority detail</p>
            <h3 className="mt-1 text-base font-semibold text-slate-950">
              {scenarioSummary.recommendedPath || "Recommended path unavailable"}
            </h3>
          </div>
          <span className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:mt-0">
            Expand
          </span>
        </div>
      </summary>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <SummaryItem label="Best scenario" value={scenarioSummary.bestScenario} />
        <SummaryItem label="Most likely" value={scenarioSummary.mostLikelyScenario} />
        <SummaryItem label="Worst scenario" value={scenarioSummary.worstScenario} />
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <SummaryItem label="Key tradeoff" value={scenarioSummary.keyTradeoff} />
        <SummaryItem label="Risk / reward" value={scenarioSummary.riskRewardNote} />
      </div>
    </details>
  );
}
