import type { DecisionIntegrityLevel, DecisionVisualizationInput } from "@/types/design-intelligence";

type InsightSummaryProps = {
  decisionOutput?: DecisionVisualizationInput | null;
};

const integrityStyles: Record<DecisionIntegrityLevel, string> = {
  high: "border-emerald-200 bg-emerald-50 text-emerald-800",
  medium: "border-amber-200 bg-amber-50 text-amber-800",
  low: "border-red-200 bg-red-50 text-red-800",
};

function getIntegrityLevel(decisionOutput: DecisionVisualizationInput): DecisionIntegrityLevel {
  if (decisionOutput.insightSummary?.integrityLevel) {
    return decisionOutput.insightSummary.integrityLevel;
  }

  const confidence = decisionOutput.confidenceScore ?? 0;
  const reliability = decisionOutput.reliabilityScore ?? 0;
  const completeness = decisionOutput.dataConfidence?.completenessScore ?? 0;
  const uncertainty = decisionOutput.uncertaintyScore ?? 100;

  if (confidence >= 75 && reliability >= 75 && completeness >= 70 && uncertainty < 45) {
    return "high";
  }

  if (confidence >= 55 && reliability >= 60 && completeness >= 55 && uncertainty < 70) {
    return "medium";
  }

  return "low";
}

function buildInsights(decisionOutput: DecisionVisualizationInput) {
  const providedInsights = decisionOutput.insightSummary?.keyInsights?.filter(Boolean) ?? [];

  if (providedInsights.length > 0) {
    return providedInsights.slice(0, 5);
  }

  const insights: string[] = [];
  const missing = decisionOutput.missingData?.[0] ?? decisionOutput.dataConfidence?.missingCriticalFields?.[0];
  const risk = decisionOutput.riskDetails?.[0]?.risk ?? decisionOutput.warnings?.[0];
  const uncertainty = decisionOutput.uncertaintyDetails?.[0]?.area;

  if (missing) insights.push(`Confidence is sensitive to missing or weak ${missing}.`);
  if (risk) insights.push(`Risk is being driven by ${risk}.`);
  if (uncertainty) insights.push(`Uncertainty is concentrated around ${uncertainty}.`);
  if (decisionOutput.strategyComparison?.selectedStrategy) {
    insights.push(`${decisionOutput.strategyComparison.selectedStrategy} is viable, but the recommendation depends on current input quality.`);
  }
  if (decisionOutput.scenarioSummary?.worstScenario) {
    insights.push("Worst-case scenario should be reviewed before execution planning.");
  }

  return insights.slice(0, 5);
}

function buildAlerts(decisionOutput: DecisionVisualizationInput) {
  const providedAlerts = decisionOutput.insightSummary?.alertSignals?.filter(Boolean) ?? [];
  const alerts = [...providedAlerts];
  const confidence = decisionOutput.confidenceScore ?? 0;
  const completeness = decisionOutput.dataConfidence?.completenessScore ?? 100;
  const uncertainty = decisionOutput.uncertaintyLevel;
  const worstCase = decisionOutput.scenarioSummary?.worstScenario?.toLowerCase() ?? "";

  if (confidence >= 75 && completeness < 60) {
    alerts.push("High confidence but low data quality detected.");
  }

  if (uncertainty === "high" || uncertainty === "extreme" || (decisionOutput.uncertaintyScore ?? 0) >= 65) {
    alerts.push("High uncertainty detected; review data gaps and assumptions.");
  }

  if (worstCase.includes("fail") || worstCase.includes("risk") || worstCase.includes("blocker")) {
    alerts.push("Worst-case outcome may outweigh reward if blockers are unresolved.");
  }

  if (decisionOutput.overconfidenceDetected) {
    alerts.push(decisionOutput.overconfidenceReason || "Overconfidence detected.");
  }

  return [...new Set(alerts)].slice(0, 4);
}

export function InsightSummary({ decisionOutput }: InsightSummaryProps) {
  if (!decisionOutput) {
    return (
      <section className="rounded-lg border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-600">
        Insight summary unavailable. Run execution intelligence first.
      </section>
    );
  }

  const integrityLevel = getIntegrityLevel(decisionOutput);
  const insights = buildInsights(decisionOutput);
  const alerts = buildAlerts(decisionOutput);
  const integrityReason =
    decisionOutput.insightSummary?.integrityReason ||
    `Integrity reflects confidence ${decisionOutput.confidenceScore ?? "missing"}, reliability ${decisionOutput.reliabilityScore ?? "missing"}, data completeness ${decisionOutput.dataConfidence?.completenessScore ?? "missing"}, and uncertainty ${decisionOutput.uncertaintyScore ?? "missing"}.`;

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Cross-panel intelligence</p>
          <h3 className="mt-1 text-base font-semibold text-slate-950">Top correlated insights</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{integrityReason}</p>
        </div>
        <div className={`rounded-lg border px-3 py-2 text-sm font-bold uppercase ${integrityStyles[integrityLevel]}`}>
          {integrityLevel} integrity
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Key insights</p>
          {insights.length > 0 ? (
            <ul className="mt-2 space-y-2">
              {insights.map((insight) => (
                <li key={insight} className="text-sm leading-5 text-slate-700">{insight}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-slate-500">Data unavailable.</p>
          )}
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Alert signals</p>
          {alerts.length > 0 ? (
            <ul className="mt-2 space-y-2">
              {alerts.map((alert) => (
                <li key={alert} className="rounded-md border border-amber-200 bg-amber-50 p-2 text-sm font-medium leading-5 text-amber-800">
                  {alert}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-slate-500">No major cross-panel alerts detected.</p>
          )}
        </div>
      </div>
    </section>
  );
}
