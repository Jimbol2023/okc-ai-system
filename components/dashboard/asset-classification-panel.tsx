"use client";

import { FormEvent, useMemo, useState } from "react";

type AssetClassification = {
  assetClass: string;
  assetSubtype: string;
  confidenceScore: number;
  riskLevel: string;
  strategyFit: Record<string, number>;
  recommendedStrategies: string[];
  classificationReasons: string[];
  riskFlags: string[];
  opportunityFlags: string[];
  dataQuality: {
    score: number;
    missingFields: string[];
  };
  assumptions: string[];
  assetStrategyReadiness: {
    score: number;
    level: string;
    missingInputs: string[];
    recommendedNextStep: string;
  };
  canProceedToStrategySelection: boolean;
};

type StrategyDecision = {
  recommendedStrategy: string;
  secondaryStrategies: string[];
  strategyConfidence: number;
  strategyReadiness: string;
  reason: string;
  requiredMissingData: string[];
  riskFlags: Array<{
    type: string;
    severity: string;
    impactScore: number;
  }>;
  opportunityFlags: string[];
  assetTypeUsed: string;
  luxurySignal?: boolean;
  developmentSignal?: boolean;
  creativeFinanceSignal?: boolean;
  passReason?: string;
  strategyScores: Record<string, number>;
  strategyScoreBreakdown: Record<string, {
    equityScore: number;
    arvScore: number;
    repairImpact: number;
    demandScore: number;
    readinessScore: number;
  }>;
  rejectedStrategies: Array<{
    strategy: string;
    reason: string;
  }>;
  portfolioFit: string;
};

type StrategyComparison = {
  bestStrategy: string | null;
  recommendationStrength: string;
  strategies: Array<{
    strategy: string;
    score: number;
    roiScore: number;
    riskScore: number;
    speedScore: number;
    capitalEfficiencyScore: number;
    executionDifficultyScore: number;
    confidenceScore: number;
    totalComparisonScore: number;
    pros: string[];
    cons: string[];
    tradeOffs: string[];
  }>;
  comparisons: Array<{
    strategyA: string;
    strategyB: string;
    scoreDelta: number;
    roiDelta: number;
    riskDelta: number;
    speedDelta: number;
    confidenceDelta: number;
    betterIn: string[];
    worseIn: string[];
    summary: string;
  }>;
  dominance: Array<{
    strategy: string;
    dominanceScore: number;
    rank: number;
    explanation: string;
  }>;
  summary: string;
  warnings: string[];
};

type ApiResponse<T> =
  | ({
      success: true;
    } & T)
  | {
      success: false;
      error?: string;
      errors?: {
        formErrors?: string[];
        fieldErrors?: Record<string, string[]>;
      };
    };

const initialForm = {
  propertyType: "",
  zip: "",
  units: "",
  bedrooms: "",
  bathrooms: "",
  squareFeet: "",
  lotSizeSqft: "",
  yearBuilt: "",
  occupancy: "",
  condition: "",
  askingPrice: "",
  arv: "",
  estimatedRepairs: "",
  monthlyRent: "",
  mortgageBalance: "",
  sellerMotivation: "",
  flexibleTerms: false,
  knownBuyerDemand: false,
  notes: "",
};

function formatLabel(value: string) {
  return value.replaceAll("_", " ");
}

function optionalNumber(value: string) {
  return value.trim() === "" ? null : Number(value);
}

function buildPayload(form: typeof initialForm) {
  return {
    propertyType: form.propertyType,
    zip: form.zip,
    units: optionalNumber(form.units),
    bedrooms: optionalNumber(form.bedrooms),
    bathrooms: optionalNumber(form.bathrooms),
    squareFeet: optionalNumber(form.squareFeet),
    lotSizeSqft: optionalNumber(form.lotSizeSqft),
    yearBuilt: optionalNumber(form.yearBuilt),
    occupancy: form.occupancy,
    condition: form.condition,
    askingPrice: optionalNumber(form.askingPrice),
    arv: optionalNumber(form.arv),
    estimatedRepairs: optionalNumber(form.estimatedRepairs),
    monthlyRent: optionalNumber(form.monthlyRent),
    mortgageBalance: optionalNumber(form.mortgageBalance),
    sellerMotivation: form.sellerMotivation,
    flexibleTerms: form.flexibleTerms,
    knownBuyerDemand: form.knownBuyerDemand,
    notes: form.notes,
  };
}

function getApiError(data: ApiResponse<unknown>, fallback: string) {
  if (data.success) {
    return fallback;
  }

  const fieldErrors = data.errors?.fieldErrors ? Object.values(data.errors.fieldErrors).flat() : [];

  return fieldErrors[0] ?? data.error ?? fallback;
}

function SignalList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{title}</p>
      {items.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-2">
          {items.map((item) => (
            <span key={item} className="rounded-full border border-border bg-white px-2 py-1 text-xs font-medium text-[#173447]">
              {formatLabel(item)}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-sm text-muted">None flagged.</p>
      )}
    </div>
  );
}

export function AssetClassificationPanel() {
  const [form, setForm] = useState(initialForm);
  const [classification, setClassification] = useState<AssetClassification | null>(null);
  const [strategyDecision, setStrategyDecision] = useState<StrategyDecision | null>(null);
  const [strategyComparison, setStrategyComparison] = useState<StrategyComparison | null>(null);
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const strategyRows = useMemo(() => {
    if (!classification) {
      return [];
    }

    return Object.entries(classification.strategyFit).sort((a, b) => b[1] - a[1]);
  }, [classification]);
  const decisionScoreRows = useMemo(() => {
    if (!strategyDecision) {
      return [];
    }

    return Object.entries(strategyDecision.strategyScores).sort((a, b) => b[1] - a[1]);
  }, [strategyDecision]);

  function updateField(field: keyof typeof initialForm, value: string | boolean) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus("");

    try {
      const payload = buildPayload(form);
      const [classificationResponse, strategyResponse, comparisonResponse] = await Promise.all([
        fetch("/api/asset-classification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }),
        fetch("/api/strategy-decision", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }),
        fetch("/api/strategy-comparison", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }),
      ]);
      const classificationData = (await classificationResponse.json()) as ApiResponse<{ classification: AssetClassification }>;
      const strategyData = (await strategyResponse.json()) as ApiResponse<{ strategyDecision: StrategyDecision }>;
      const comparisonData = (await comparisonResponse.json()) as ApiResponse<{ strategyComparison: StrategyComparison }>;

      if (!classificationData.success) {
        setStatus(getApiError(classificationData, "Unable to classify this asset."));
        return;
      }

      if (!strategyData.success) {
        setStatus(getApiError(strategyData, "Unable to decide strategy."));
        return;
      }

      if (!comparisonData.success) {
        setStatus(getApiError(comparisonData, "Unable to compare strategies."));
        return;
      }

      setClassification(classificationData.classification);
      setStrategyDecision(strategyData.strategyDecision);
      setStrategyComparison(comparisonData.strategyComparison);
      setStatus("Classification, strategy decision, and comparison generated. No outreach, routing, or automation was triggered.");
    } catch {
      setStatus("Unable to analyze this asset right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="space-y-4 rounded-lg border border-border bg-white p-4 shadow-sm">
      <div>
        <h2 className="text-xl font-semibold text-primary">Asset Classification</h2>
        <p className="mt-1 text-sm leading-6 text-muted">
          Read-only asset intelligence for identifying property class, risk, readiness, and strategy fit.
        </p>
      </div>

      <form className="grid gap-3 md:grid-cols-3" onSubmit={handleSubmit}>
        <label className="space-y-1 text-sm font-medium text-[#173447]">
          Property type
          <input className="w-full rounded-md border border-border px-3 py-2 text-sm" value={form.propertyType} onChange={(event) => updateField("propertyType", event.target.value)} placeholder="single family, duplex, land" />
        </label>
        <label className="space-y-1 text-sm font-medium text-[#173447]">
          ZIP
          <input className="w-full rounded-md border border-border px-3 py-2 text-sm" value={form.zip} onChange={(event) => updateField("zip", event.target.value)} inputMode="numeric" placeholder="73112" />
        </label>
        <label className="space-y-1 text-sm font-medium text-[#173447]">
          Units
          <input className="w-full rounded-md border border-border px-3 py-2 text-sm" value={form.units} onChange={(event) => updateField("units", event.target.value)} inputMode="numeric" />
        </label>
        <label className="space-y-1 text-sm font-medium text-[#173447]">
          Condition
          <input className="w-full rounded-md border border-border px-3 py-2 text-sm" value={form.condition} onChange={(event) => updateField("condition", event.target.value)} placeholder="light, heavy, foundation" />
        </label>
        <label className="space-y-1 text-sm font-medium text-[#173447]">
          Asking price
          <input className="w-full rounded-md border border-border px-3 py-2 text-sm" value={form.askingPrice} onChange={(event) => updateField("askingPrice", event.target.value)} inputMode="decimal" />
        </label>
        <label className="space-y-1 text-sm font-medium text-[#173447]">
          ARV
          <input className="w-full rounded-md border border-border px-3 py-2 text-sm" value={form.arv} onChange={(event) => updateField("arv", event.target.value)} inputMode="decimal" />
        </label>
        <label className="space-y-1 text-sm font-medium text-[#173447]">
          Estimated repairs
          <input className="w-full rounded-md border border-border px-3 py-2 text-sm" value={form.estimatedRepairs} onChange={(event) => updateField("estimatedRepairs", event.target.value)} inputMode="decimal" />
        </label>
        <label className="space-y-1 text-sm font-medium text-[#173447]">
          Monthly rent
          <input className="w-full rounded-md border border-border px-3 py-2 text-sm" value={form.monthlyRent} onChange={(event) => updateField("monthlyRent", event.target.value)} inputMode="decimal" />
        </label>
        <label className="space-y-1 text-sm font-medium text-[#173447]">
          Mortgage balance
          <input className="w-full rounded-md border border-border px-3 py-2 text-sm" value={form.mortgageBalance} onChange={(event) => updateField("mortgageBalance", event.target.value)} inputMode="decimal" />
        </label>
        <label className="space-y-1 text-sm font-medium text-[#173447]">
          Bedrooms
          <input className="w-full rounded-md border border-border px-3 py-2 text-sm" value={form.bedrooms} onChange={(event) => updateField("bedrooms", event.target.value)} inputMode="decimal" />
        </label>
        <label className="space-y-1 text-sm font-medium text-[#173447]">
          Bathrooms
          <input className="w-full rounded-md border border-border px-3 py-2 text-sm" value={form.bathrooms} onChange={(event) => updateField("bathrooms", event.target.value)} inputMode="decimal" />
        </label>
        <label className="space-y-1 text-sm font-medium text-[#173447]">
          Year built
          <input className="w-full rounded-md border border-border px-3 py-2 text-sm" value={form.yearBuilt} onChange={(event) => updateField("yearBuilt", event.target.value)} inputMode="numeric" />
        </label>
        <label className="space-y-1 text-sm font-medium text-[#173447]">
          Square feet
          <input className="w-full rounded-md border border-border px-3 py-2 text-sm" value={form.squareFeet} onChange={(event) => updateField("squareFeet", event.target.value)} inputMode="numeric" />
        </label>
        <label className="space-y-1 text-sm font-medium text-[#173447]">
          Lot size sqft
          <input className="w-full rounded-md border border-border px-3 py-2 text-sm" value={form.lotSizeSqft} onChange={(event) => updateField("lotSizeSqft", event.target.value)} inputMode="numeric" />
        </label>
        <label className="space-y-1 text-sm font-medium text-[#173447]">
          Occupancy
          <input className="w-full rounded-md border border-border px-3 py-2 text-sm" value={form.occupancy} onChange={(event) => updateField("occupancy", event.target.value)} placeholder="vacant, tenant occupied" />
        </label>
        <label className="space-y-1 text-sm font-medium text-[#173447] md:col-span-3">
          Seller motivation
          <input className="w-full rounded-md border border-border px-3 py-2 text-sm" value={form.sellerMotivation} onChange={(event) => updateField("sellerMotivation", event.target.value)} placeholder="Optional known motivation or terms signal" />
        </label>
        <div className="flex flex-wrap gap-4 text-sm font-medium text-[#173447] md:col-span-3">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={form.flexibleTerms} onChange={(event) => updateField("flexibleTerms", event.target.checked)} />
            Flexible terms signal
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={form.knownBuyerDemand} onChange={(event) => updateField("knownBuyerDemand", event.target.checked)} />
            Known buyer demand
          </label>
        </div>
        <label className="space-y-1 text-sm font-medium text-[#173447] md:col-span-3">
          Notes
          <textarea className="min-h-24 w-full rounded-md border border-border px-3 py-2 text-sm" value={form.notes} onChange={(event) => updateField("notes", event.target.value)} placeholder="Optional property notes or known facts" />
        </label>
        <div className="md:col-span-3">
          <button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-60" disabled={isSubmitting}>
            {isSubmitting ? "Analyzing..." : "Analyze asset strategy"}
          </button>
          {status ? <p className="mt-2 text-sm text-muted">{status}</p> : null}
        </div>
      </form>

      {strategyDecision ? (
        <div className="grid gap-4 border-t border-border pt-4 md:grid-cols-3">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Recommended strategy</p>
            <p className="text-lg font-semibold text-primary">{formatLabel(strategyDecision.recommendedStrategy)}</p>
            <p className="text-sm text-muted">Confidence {strategyDecision.strategyConfidence}/100</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Strategy readiness</p>
            <p className="text-lg font-semibold text-primary">{formatLabel(strategyDecision.strategyReadiness)}</p>
            <p className="text-sm text-muted">Asset type used: {formatLabel(strategyDecision.assetTypeUsed)}</p>
            <p className="text-sm text-muted">Portfolio fit: {formatLabel(strategyDecision.portfolioFit)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Signals</p>
            <p className="text-sm text-muted">Luxury: {strategyDecision.luxurySignal ? "Yes" : "No"}</p>
            <p className="text-sm text-muted">Development: {strategyDecision.developmentSignal ? "Yes" : "No"}</p>
            <p className="text-sm text-muted">Creative finance: {strategyDecision.creativeFinanceSignal ? "Yes" : "No"}</p>
          </div>
          <p className="text-sm leading-6 text-muted md:col-span-3">{strategyDecision.reason}</p>
          <SignalList title="Secondary strategies" items={strategyDecision.secondaryStrategies} />
          <SignalList title="Required missing data" items={strategyDecision.requiredMissingData} />
          <SignalList title="Opportunity flags" items={strategyDecision.opportunityFlags} />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Strategy risk flags</p>
            {strategyDecision.riskFlags.length > 0 ? (
              <div className="mt-2 space-y-2">
                {strategyDecision.riskFlags.map((risk) => (
                  <div key={risk.type} className="rounded-md border border-border px-3 py-2 text-sm">
                    <p className="font-medium text-[#173447]">{formatLabel(risk.type)}</p>
                    <p className="text-muted">{formatLabel(risk.severity)} impact {risk.impactScore}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm text-muted">None flagged.</p>
            )}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Strategy scores</p>
            <div className="mt-2 space-y-2">
              {decisionScoreRows.map(([strategy, score]) => (
                <div key={strategy} className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2 text-sm">
                  <span className="font-medium text-[#173447]">{formatLabel(strategy)}</span>
                  <span className="text-muted">{score}/100</span>
                </div>
              ))}
            </div>
          </div>
          <div className="md:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Rejected strategies</p>
            <div className="mt-2 space-y-2">
              {strategyDecision.rejectedStrategies.slice(0, 5).map((rejected) => (
                <div key={rejected.strategy} className="rounded-md border border-border px-3 py-2 text-sm">
                  <p className="font-medium text-[#173447]">{formatLabel(rejected.strategy)}</p>
                  <p className="text-muted">{rejected.reason}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="md:col-span-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Score breakdown</p>
            <div className="mt-2 grid gap-2 md:grid-cols-3">
              {decisionScoreRows.slice(0, 3).map(([strategy]) => {
                const breakdown = strategyDecision.strategyScoreBreakdown[strategy];

                return breakdown ? (
                  <div key={strategy} className="rounded-md border border-border px-3 py-2 text-sm">
                    <p className="font-medium text-[#173447]">{formatLabel(strategy)}</p>
                    <p className="text-muted">Equity {breakdown.equityScore} | ARV {breakdown.arvScore}</p>
                    <p className="text-muted">Repair {breakdown.repairImpact} | Demand {breakdown.demandScore}</p>
                    <p className="text-muted">Readiness {breakdown.readinessScore}</p>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        </div>
      ) : null}

      {strategyComparison ? (
        <div className="grid gap-4 border-t border-border pt-4 md:grid-cols-3">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Best comparison strategy</p>
            <p className="text-lg font-semibold text-primary">{strategyComparison.bestStrategy ? formatLabel(strategyComparison.bestStrategy) : "None"}</p>
            <p className="text-sm text-muted">Strength: {formatLabel(strategyComparison.recommendationStrength)}</p>
          </div>
          <div className="space-y-1 md:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Comparison summary</p>
            <p className="text-sm leading-6 text-muted">{strategyComparison.summary}</p>
          </div>
          <div className="md:col-span-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Top strategy comparison</p>
            <div className="mt-2 grid gap-2 md:grid-cols-3">
              {strategyComparison.strategies.slice(0, 3).map((strategy) => (
                <div key={strategy.strategy} className="rounded-md border border-border px-3 py-2 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-[#173447]">{formatLabel(strategy.strategy)}</p>
                    <span className="text-muted">{strategy.totalComparisonScore}/100</span>
                  </div>
                  <p className="text-muted">ROI {strategy.roiScore} | Risk {strategy.riskScore} | Speed {strategy.speedScore}</p>
                  <p className="text-muted">Capital {strategy.capitalEfficiencyScore} | Confidence {strategy.confidenceScore}</p>
                </div>
              ))}
            </div>
          </div>
          <SignalList title="Comparison warnings" items={strategyComparison.warnings} />
          <SignalList title="Top trade-offs" items={strategyComparison.strategies[0]?.tradeOffs ?? []} />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Dominance</p>
            <div className="mt-2 space-y-2">
              {strategyComparison.dominance.slice(0, 3).map((item) => (
                <div key={item.strategy} className="rounded-md border border-border px-3 py-2 text-sm">
                  <p className="font-medium text-[#173447]">#{item.rank} {formatLabel(item.strategy)}</p>
                  <p className="text-muted">Dominance {item.dominanceScore}/100</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {classification ? (
        <div className="grid gap-4 border-t border-border pt-4 md:grid-cols-3">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Asset class</p>
            <p className="text-lg font-semibold text-primary">{classification.assetSubtype}</p>
            <p className="text-sm text-muted">Confidence {classification.confidenceScore}/100</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Risk level</p>
            <p className="text-lg font-semibold text-primary">{formatLabel(classification.riskLevel)}</p>
            <p className="text-sm text-muted">Data quality {classification.dataQuality.score}/100</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Asset readiness</p>
            <p className="text-lg font-semibold text-primary">{classification.assetStrategyReadiness.score}/100</p>
            <p className="text-sm text-muted">{formatLabel(classification.assetStrategyReadiness.level)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Proceed to strategy</p>
            <p className="text-lg font-semibold text-primary">{classification.canProceedToStrategySelection ? "Yes" : "No"}</p>
            <p className="text-sm text-muted">{classification.assetStrategyReadiness.recommendedNextStep}</p>
          </div>
          <SignalList title="Missing inputs" items={classification.assetStrategyReadiness.missingInputs} />
          <SignalList title="Opportunity flags" items={classification.opportunityFlags} />
          <div className="space-y-3 md:col-span-2">
            <SignalList title="Classification reasons" items={classification.classificationReasons} />
            <SignalList title="Risk flags" items={classification.riskFlags} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Strategy fit</p>
            <div className="mt-2 space-y-2">
              {strategyRows.map(([strategy, score]) => (
                <div key={strategy} className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2 text-sm">
                  <span className="font-medium text-[#173447]">{formatLabel(strategy)}</span>
                  <span className="text-muted">{score}/100</span>
                </div>
              ))}
            </div>
          </div>
          {classification.assumptions.length > 0 ? (
            <div className="md:col-span-3">
              <SignalList title="Assumptions" items={classification.assumptions} />
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
