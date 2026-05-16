import type { DecisionVisualizationInput } from "@/types/design-intelligence";

type ScenarioDrilldownProps = {
  decisionOutput?: DecisionVisualizationInput | null;
};

function ScenarioBox({
  title,
  outcome,
  note,
}: {
  title: string;
  outcome?: string | null;
  note?: string | null;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
      <p className="mt-2 text-sm font-semibold leading-5 text-slate-900">{outcome || "Data unavailable."}</p>
      {note ? <p className="mt-2 text-sm leading-5 text-slate-600">{note}</p> : null}
    </div>
  );
}

export function ScenarioDrilldown({ decisionOutput }: ScenarioDrilldownProps) {
  const details = decisionOutput?.scenarioDetails;
  const summary = decisionOutput?.scenarioSummary;
  const assumptions = details?.keyAssumptions?.filter(Boolean) ?? [];

  return (
    <details className="rounded-lg border border-slate-200 bg-white p-4">
      <summary className="cursor-pointer list-none">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Scenario drilldown</p>
        <h3 className="mt-1 text-base font-semibold text-slate-950">Best, likely, and worst case</h3>
      </summary>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <ScenarioBox
          title="Best case"
          outcome={details?.bestCase?.expectedOutcome ?? summary?.bestScenario}
          note={details?.bestCase?.upside ?? "Upside data unavailable."}
        />
        <ScenarioBox
          title="Most likely"
          outcome={details?.mostLikely?.expectedOutcome ?? summary?.mostLikelyScenario}
          note={summary?.recommendedPath}
        />
        <ScenarioBox
          title="Worst case"
          outcome={details?.worstCase?.expectedOutcome ?? summary?.worstScenario}
          note={details?.worstCase?.downside ?? "Downside data unavailable."}
        />
      </div>

      <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Risk vs reward</p>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          {details?.riskRewardExplanation || summary?.riskRewardNote || "Data unavailable."}
        </p>
        <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Cross-check: risk breakdown identifies the specific factors behind these scenario outcomes.
        </p>
      </div>

      <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Key assumptions</p>
        {assumptions.length > 0 ? (
          <ul className="mt-2 space-y-2">
            {assumptions.slice(0, 6).map((assumption) => (
              <li key={assumption} className="text-sm leading-5 text-slate-700">{assumption}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-slate-500">Data unavailable.</p>
        )}
      </div>
    </details>
  );
}
