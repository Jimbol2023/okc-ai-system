import { ScoreBar } from "@/components/design-intelligence/score-bar";
import type { DecisionVisualizationInput } from "@/types/design-intelligence";

type DataConfidencePanelProps = {
  decisionOutput?: DecisionVisualizationInput | null;
};

export function DataConfidencePanel({ decisionOutput }: DataConfidencePanelProps) {
  const dataConfidence = decisionOutput?.dataConfidence;
  const missingFields = dataConfidence?.missingCriticalFields?.filter(Boolean) ?? decisionOutput?.missingData ?? [];

  return (
    <details className="rounded-lg border border-slate-200 bg-white p-4" open>
      <summary className="cursor-pointer list-none">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Data confidence</p>
        <h3 className="mt-1 text-base font-semibold text-slate-950">Input quality and completeness</h3>
      </summary>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <ScoreBar
            label="Data completeness"
            score={dataConfidence?.completenessScore}
            tone={(dataConfidence?.completenessScore ?? 0) >= 70 ? "positive" : "warning"}
          />
          <p className="mt-3 text-sm leading-6 text-slate-700">
            {dataConfidence?.inputReliability || "Input reliability data unavailable."}
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Missing critical fields</p>
          {missingFields.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {missingFields.slice(0, 10).map((field) => (
                <span key={field} className="rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-800">
                  {field}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm text-slate-500">None detected.</p>
          )}
          <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Cross-check: missing fields often explain uncertainty gaps and confidence reductions.
          </p>
        </div>
      </div>

      {dataConfidence?.lowQualityWarning ? (
        <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm font-medium text-amber-800">
          {dataConfidence.lowQualityWarning}
        </div>
      ) : null}
    </details>
  );
}
