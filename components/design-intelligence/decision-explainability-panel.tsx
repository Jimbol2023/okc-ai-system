import type { DecisionVisualizationInput } from "@/types/design-intelligence";

type DecisionExplainabilityPanelProps = {
  decisionOutput?: DecisionVisualizationInput | null;
};

function EmptyState() {
  return <p className="mt-2 text-sm text-slate-500">Data unavailable.</p>;
}

function BreakdownList({
  title,
  items,
}: {
  title: string;
  items?: Array<{ label: string; description?: string | null; value?: string | number | null; weight?: string | number | null }>;
}) {
  const visibleItems = items?.filter((item) => item.label) ?? [];

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
      {visibleItems.length > 0 ? (
        <div className="mt-3 space-y-2">
          {visibleItems.slice(0, 6).map((item) => (
            <div key={`${item.label}-${item.value ?? ""}`} className="rounded-md bg-slate-50 p-3">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                <p className="text-sm font-semibold text-slate-950">{item.label}</p>
                {item.value !== undefined && item.value !== null ? (
                  <span className="text-xs font-semibold text-slate-500">{item.value}</span>
                ) : null}
              </div>
              {item.description ? <p className="mt-1 text-sm leading-5 text-slate-600">{item.description}</p> : null}
              {item.weight !== undefined && item.weight !== null ? (
                <p className="mt-1 text-xs font-semibold text-slate-500">Weight: {item.weight}</p>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

function TextList({ title, items }: { title: string; items?: string[] }) {
  const visibleItems = items?.filter(Boolean) ?? [];

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
      {visibleItems.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {visibleItems.slice(0, 6).map((item) => (
            <li key={item} className="text-sm leading-5 text-slate-700">{item}</li>
          ))}
        </ul>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

export function DecisionExplainabilityPanel({ decisionOutput }: DecisionExplainabilityPanelProps) {
  const confidence = decisionOutput?.confidenceBreakdown;
  const reliability = decisionOutput?.reliabilityBreakdown;
  const risks = decisionOutput?.riskDetails ?? [];
  const uncertainty = decisionOutput?.uncertaintyDetails ?? [];

  return (
    <details className="rounded-lg border border-slate-200 bg-white p-4" open>
      <summary className="cursor-pointer list-none">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Explainability</p>
          <h3 className="mt-1 text-base font-semibold text-slate-950">Why the decision was made</h3>
        </div>
      </summary>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <BreakdownList title="Confidence increased by" items={confidence?.increasedBy} />
        <BreakdownList title="Confidence reduced by" items={confidence?.reducedBy} />
        <BreakdownList title="Reliability indicators" items={reliability?.dataQualityIndicators} />
        <TextList title="Missing fields impact" items={reliability?.missingFieldsImpact} />
      </div>

      <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Confidence vs reliability</p>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          {reliability?.confidenceVsReliability || "Data unavailable."}
        </p>
        <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Cross-check: risk contributors and uncertainty gaps below explain why confidence may not equal reliability.
        </p>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Risk breakdown</p>
          {risks.length > 0 ? (
            <div className="mt-3 space-y-2">
              {risks.slice(0, 6).map((risk) => (
                <div key={`${risk.risk}-${risk.severity ?? ""}`} className="rounded-md bg-slate-50 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-950">{risk.risk}</p>
                    <span className="rounded-full bg-slate-200 px-2 py-1 text-xs font-semibold uppercase text-slate-700">
                      {risk.severity || "medium"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm leading-5 text-slate-600">{risk.impact || "Impact description unavailable."}</p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
          <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Cross-check: compare these risks against worst-case scenario outcomes.
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Uncertainty breakdown</p>
          {uncertainty.length > 0 ? (
            <div className="mt-3 space-y-2">
              {uncertainty.slice(0, 6).map((item) => (
                <div key={`${item.area}-${item.source ?? ""}`} className="rounded-md bg-slate-50 p-3">
                  <p className="text-sm font-semibold text-slate-950">{item.area}</p>
                  <p className="mt-1 text-sm leading-5 text-slate-600">{item.explanation || "Explanation unavailable."}</p>
                  {item.source ? <p className="mt-1 text-xs font-semibold uppercase text-slate-500">{item.source}</p> : null}
                </div>
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
          <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Cross-check: data confidence shows which gaps are driving this uncertainty.
          </p>
        </div>
      </div>
    </details>
  );
}
