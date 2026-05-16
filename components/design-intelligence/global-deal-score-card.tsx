import type { DealPriority, GlobalDealScore } from "@/types/global-deal-score";

type GlobalDealScoreCardProps = {
  globalDealScore?: GlobalDealScore | null;
};

const priorityLabels: Record<DealPriority, string> = {
  urgent: "Urgent",
  high: "High",
  medium: "Medium",
  low: "Low",
  avoid: "Avoid",
};

const priorityStyles: Record<DealPriority, string> = {
  urgent: "border-red-200 bg-red-50 text-red-800",
  high: "border-orange-200 bg-orange-50 text-orange-800",
  medium: "border-amber-200 bg-amber-50 text-amber-800",
  low: "border-slate-200 bg-slate-50 text-slate-700",
  avoid: "border-slate-700 bg-slate-950 text-white",
};

const breakdownLabels: Record<keyof GlobalDealScore["scoreBreakdown"], string> = {
  decisionStrength: "Decision strength",
  riskControl: "Risk control",
  fundingStrength: "Funding strength",
  offerQuality: "Offer quality",
  negotiationReadiness: "Negotiation readiness",
  conversionLikelihood: "Conversion likelihood",
  buyerDemand: "Buyer demand",
  closingReadiness: "Closing readiness",
};

function ListBlock({ title, items, tone = "neutral" }: { title: string; items?: string[]; tone?: "neutral" | "warning" | "danger" | "positive" }) {
  const visibleItems = items?.filter(Boolean) ?? [];
  const styles =
    tone === "danger"
      ? "border-red-200 bg-red-50 text-red-800"
      : tone === "warning"
        ? "border-amber-200 bg-amber-50 text-amber-800"
        : tone === "positive"
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-slate-200 bg-white text-slate-700";

  return (
    <div className={`rounded-lg border p-3 ${styles}`}>
      <p className="text-xs font-semibold uppercase tracking-wide">{title}</p>
      {visibleItems.length > 0 ? (
        <ul className="mt-2 space-y-2">
          {visibleItems.slice(0, 7).map((item) => (
            <li key={item} className="text-sm font-medium leading-5">
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm">None flagged.</p>
      )}
    </div>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  const barColor = value >= 75 ? "bg-emerald-500" : value >= 50 ? "bg-amber-500" : value >= 30 ? "bg-orange-500" : "bg-red-500";

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-slate-800">{label}</p>
        <p className="text-sm font-black text-slate-950">{value}/100</p>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
      </div>
    </div>
  );
}

export function GlobalDealScoreCard({ globalDealScore }: GlobalDealScoreCardProps) {
  if (!globalDealScore) {
    return (
      <section className="rounded-lg border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-600">
        Global deal score unavailable. Add decision, risk, funding, offer, negotiation, conversion, buyer demand, and closing data.
      </section>
    );
  }

  const breakdownRows = Object.entries(globalDealScore.scoreBreakdown) as Array<[keyof GlobalDealScore["scoreBreakdown"], number]>;

  return (
    <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Global deal score</p>
          <div className="mt-2 flex flex-wrap items-end gap-4">
            <div>
              <p className="text-6xl font-black leading-none text-slate-950">{globalDealScore.score}</p>
              <p className="mt-1 text-sm font-semibold text-slate-500">out of 100</p>
            </div>
            <span className={`mb-2 rounded-md border px-4 py-2 text-xl font-black tracking-wide ${priorityStyles[globalDealScore.priority]}`}>
              {priorityLabels[globalDealScore.priority]}
            </span>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 lg:max-w-[420px]">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Recommended focus</p>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">
            {globalDealScore.recommendedFocus || "Global deal score unavailable. Add decision, risk, funding, offer, negotiation, conversion, buyer demand, and closing data."}
          </p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {breakdownRows.map(([key, value]) => (
          <ScoreBar key={key} label={breakdownLabels[key]} value={value} />
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <ListBlock title="Strongest signals" tone="positive" items={globalDealScore.strongestSignals} />
        <ListBlock title="Warnings" tone="warning" items={globalDealScore.warnings} />
        <ListBlock title="Blockers" tone="danger" items={globalDealScore.blockers} />
        <ListBlock title="Compliance warnings" tone="warning" items={globalDealScore.complianceWarnings} />
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Recommended next step</p>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">
          {globalDealScore.recommendedNextStep || "Review the weakest lifecycle score before advancing this deal."}
        </p>
      </div>
    </section>
  );
}
