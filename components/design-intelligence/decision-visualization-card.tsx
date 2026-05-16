import { DecisionReasonList } from "@/components/design-intelligence/decision-reason-list";
import { ScenarioSummaryCard } from "@/components/design-intelligence/scenario-summary-card";
import { ScoreBar } from "@/components/design-intelligence/score-bar";
import type { DecisionVisualizationInput, ExecutionDecisionType, ScoreTone } from "@/types/design-intelligence";

type DecisionVisualizationCardProps = {
  decisionOutput?: DecisionVisualizationInput | null;
};

const decisionMeta: Record<ExecutionDecisionType, { label: string; badge: string; tone: ScoreTone; className: string }> = {
  go: {
    label: "GO",
    badge: "GO",
    tone: "positive",
    className: "border-emerald-200 bg-emerald-50 text-emerald-800",
  },
  no_go: {
    label: "NO GO",
    badge: "NO GO",
    tone: "danger",
    className: "border-red-200 bg-red-50 text-red-800",
  },
  wait: {
    label: "WAIT",
    badge: "WAIT",
    tone: "caution",
    className: "border-amber-200 bg-amber-50 text-amber-800",
  },
  fix: {
    label: "FIX",
    badge: "FIX",
    tone: "warning",
    className: "border-orange-200 bg-orange-50 text-orange-800",
  },
  switch: {
    label: "SWITCH",
    badge: "SWITCH",
    tone: "strategic",
    className: "border-blue-200 bg-blue-50 text-blue-800",
  },
  kill: {
    label: "KILL",
    badge: "KILL",
    tone: "danger",
    className: "border-slate-700 bg-slate-950 text-white",
  },
};

function normalizeDecision(decision?: string): ExecutionDecisionType {
  if (decision === "execute_now" || decision === "go") return "go";
  if (decision === "fix_blockers_first" || decision === "fix") return "fix";
  if (decision === "switch_strategy" || decision === "switch") return "switch";
  if (decision === "kill_deal" || decision === "kill") return "kill";
  if (decision === "manual_review_required" || decision === "no_go") return "no_go";
  return "wait";
}

function getRiskTone(score?: number | null): ScoreTone {
  if (typeof score !== "number") return "neutral";
  if (score >= 75) return "danger";
  if (score >= 55) return "warning";
  if (score >= 35) return "caution";
  return "positive";
}

function getUncertaintyTone(level?: string | null, score?: number | null): ScoreTone {
  if (level === "extreme" || (typeof score === "number" && score >= 75)) return "danger";
  if (level === "high" || (typeof score === "number" && score >= 55)) return "warning";
  if (level === "moderate" || (typeof score === "number" && score >= 35)) return "caution";
  return "positive";
}

function formatScore(score?: number | null) {
  return typeof score === "number" && Number.isFinite(score) ? `${Math.round(score)}` : "Missing";
}

export function DecisionVisualizationCard({ decisionOutput }: DecisionVisualizationCardProps) {
  if (!decisionOutput) {
    return (
      <section className="rounded-lg border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-600">
        Decision visualization unavailable. Run execution intelligence first.
      </section>
    );
  }

  const decision = normalizeDecision(decisionOutput.decision);
  const meta = decisionMeta[decision];
  const explanation =
    decisionOutput.investorSummary?.plainEnglishDecision ||
    decisionOutput.decisionLabel ||
    "Decision explanation unavailable.";
  const recommendedNextAction =
    decisionOutput.recommendedNextAction ||
    decisionOutput.investorSummary?.recommendedNextStep ||
    "Recommended next action unavailable.";

  return (
    <section className="space-y-5 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className={`rounded-lg border p-4 ${meta.className}`}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch lg:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wide opacity-75">Execution decision</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="rounded-md bg-white/80 px-4 py-2 text-3xl font-black tracking-wide text-slate-950 shadow-sm">
                {meta.badge}
              </span>
              <div>
                <h3 className="text-2xl font-bold">{meta.label}</h3>
                <p className="mt-1 text-sm font-medium opacity-90">{decisionOutput.decisionLabel || "Read-only decision support"}</p>
              </div>
            </div>
            <p className="mt-4 max-w-3xl text-sm font-medium leading-6 opacity-95">{explanation}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[420px]">
            <div className="rounded-lg bg-white/85 p-3 text-slate-950 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Confidence</p>
              <p className="mt-1 text-3xl font-black">{formatScore(decisionOutput.confidenceScore)}</p>
              <p className="text-xs font-semibold text-slate-500">Primary trust signal</p>
            </div>
            <div className="rounded-lg bg-white/70 p-3 text-slate-950 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Reliability</p>
              <p className="mt-1 text-2xl font-black">{formatScore(decisionOutput.reliabilityScore)}</p>
              <p className="text-xs font-semibold text-slate-500">Model stability</p>
            </div>
            <div className="rounded-lg bg-white/70 p-3 text-slate-950 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Uncertainty</p>
              <p className="mt-1 text-2xl font-black">{decisionOutput.uncertaintyLevel || "Missing"}</p>
              <p className="text-xs font-semibold text-slate-500">{formatScore(decisionOutput.uncertaintyScore)}/100</p>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-lg bg-white p-4 text-slate-950 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Next action</p>
          <p className="mt-1 text-base font-black leading-6">{recommendedNextAction}</p>
        </div>
      </div>

      {decisionOutput.overconfidenceDetected ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-800">
          {decisionOutput.overconfidenceReason || "Overconfidence detected. Review data quality before relying on this decision."}
        </div>
      ) : null}

      <div className="grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 md:grid-cols-2">
        <ScoreBar label="Confidence" score={decisionOutput.confidenceScore} tone={meta.tone} />
        <ScoreBar label="Reliability" score={decisionOutput.reliabilityScore} tone={meta.tone} />
        <ScoreBar label="Risk" score={decisionOutput.riskScore} tone={getRiskTone(decisionOutput.riskScore)} />
        <ScoreBar
          label={`Uncertainty${decisionOutput.uncertaintyLevel ? `: ${decisionOutput.uncertaintyLevel}` : ""}`}
          score={decisionOutput.uncertaintyScore}
          tone={getUncertaintyTone(decisionOutput.uncertaintyLevel, decisionOutput.uncertaintyScore)}
        />
      </div>

      <DecisionReasonList
        reasons={decisionOutput.reasons}
        rejectedOptions={decisionOutput.rejectedOptions}
        missingData={decisionOutput.missingData ?? decisionOutput.investorSummary?.missingData}
        riskFactors={decisionOutput.warnings}
        executionBlockers={decisionOutput.executionBlockers}
      />

      <ScenarioSummaryCard scenarioSummary={decisionOutput.scenarioSummary} />
    </section>
  );
}
