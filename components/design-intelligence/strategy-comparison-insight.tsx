import type { DecisionVisualizationInput } from "@/types/design-intelligence";

type StrategyComparisonInsightProps = {
  decisionOutput?: DecisionVisualizationInput | null;
};

function formatDelta(value?: number | null) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return "Data unavailable";
  }

  return value > 0 ? `+${Math.round(value)}` : `${Math.round(value)}`;
}

export function StrategyComparisonInsight({ decisionOutput }: StrategyComparisonInsightProps) {
  const comparison = decisionOutput?.strategyComparison;
  const alternatives = comparison?.alternatives?.filter((item) => item.strategy) ?? [];

  return (
    <details className="rounded-lg border border-slate-200 bg-white p-4">
      <summary className="cursor-pointer list-none">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Strategy comparison</p>
        <h3 className="mt-1 text-base font-semibold text-slate-950">
          {comparison?.selectedStrategy ? `Why ${comparison.selectedStrategy} was selected` : "Strategy insight"}
        </h3>
      </summary>

      <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Why selected strategy won</p>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          {comparison?.whySelectedWon || "Data unavailable."}
        </p>
      </div>

      <div className="mt-3 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Why other strategies lost</p>
        {alternatives.length > 0 ? (
          alternatives.slice(0, 5).map((alternative) => (
            <div key={alternative.strategy} className="rounded-lg border border-slate-200 bg-white p-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-950">{alternative.strategy}</p>
                  <p className="mt-1 text-sm leading-5 text-slate-600">{alternative.whyLost || "Reason unavailable."}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-right text-xs font-semibold text-slate-500 sm:min-w-40">
                  <span>Score {formatDelta(alternative.scoreDifference)}</span>
                  <span>Risk {formatDelta(alternative.riskDifference)}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3 text-sm text-slate-500">
            Data unavailable.
          </p>
        )}
      </div>
    </details>
  );
}
