import type { BuyerMatch, BuyerType, DispositionPath, DispositionRecommendation } from "@/types/disposition-buyer-matching";

type DispositionBuyerMatchingCardProps = {
  dispositionRecommendation?: DispositionRecommendation | null;
};

const pathLabels: Record<DispositionPath, string> = {
  assign_contract: "ASSIGN CONTRACT",
  double_close: "DOUBLE CLOSE",
  sell_owned_asset: "SELL OWNED ASSET",
  package_portfolio: "PACKAGE PORTFOLIO",
  hold_internal: "HOLD INTERNAL",
  pause_review: "PAUSE / REVIEW",
  do_not_dispose: "DO NOT DISPOSE",
};

const buyerTypeLabels: Record<BuyerType, string> = {
  cash_buyer: "Cash Buyer",
  fix_and_flip_investor: "Fix-and-Flip Investor",
  land_investor: "Land Investor",
  rental_buyer: "Rental Buyer",
  str_buyer: "STR Buyer",
  multifamily_buyer: "Multifamily Buyer",
  commercial_buyer: "Commercial Buyer",
  builder_developer: "Builder / Developer",
  creative_finance_buyer: "Creative Finance Buyer",
  institutional_buyer: "Institutional Buyer",
  unknown: "Unknown",
};

const pathStyles: Record<DispositionPath, string> = {
  assign_contract: "border-emerald-200 bg-emerald-50 text-emerald-800",
  double_close: "border-blue-200 bg-blue-50 text-blue-800",
  sell_owned_asset: "border-cyan-200 bg-cyan-50 text-cyan-800",
  package_portfolio: "border-indigo-200 bg-indigo-50 text-indigo-800",
  hold_internal: "border-slate-200 bg-slate-50 text-slate-800",
  pause_review: "border-amber-200 bg-amber-50 text-amber-800",
  do_not_dispose: "border-red-300 bg-red-50 text-red-800",
};

const demandStyles: Record<NonNullable<DispositionRecommendation["buyerDemandSignal"]>, string> = {
  strong: "border-emerald-200 bg-emerald-50 text-emerald-800",
  moderate: "border-amber-200 bg-amber-50 text-amber-800",
  weak: "border-orange-200 bg-orange-50 text-orange-800",
  unknown: "border-slate-200 bg-slate-50 text-slate-700",
};

function formatMoney(value?: number) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "Unavailable";

  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

function formatPercent(value?: number) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "Unknown";

  return `${Math.round(value)}%`;
}

function formatLabel(value?: string) {
  return value ? value.replaceAll("_", " ") : "Unknown";
}

function ListBlock({ title, items, tone = "neutral" }: { title: string; items?: string[]; tone?: "neutral" | "warning" | "danger" }) {
  const visibleItems = items?.filter(Boolean) ?? [];
  const styles =
    tone === "danger"
      ? "border-red-200 bg-red-50 text-red-800"
      : tone === "warning"
        ? "border-amber-200 bg-amber-50 text-amber-800"
        : "border-slate-200 bg-white text-slate-700";

  return (
    <div className={`rounded-lg border p-3 ${styles}`}>
      <p className="text-xs font-semibold uppercase tracking-wide">{title}</p>
      {visibleItems.length > 0 ? (
        <ul className="mt-2 space-y-2">
          {visibleItems.slice(0, 8).map((item) => (
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

function BuyerMatchRow({ match }: { match: BuyerMatch }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-bold text-slate-950">{match.buyerName || match.buyerId || "Buyer profile"}</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">{buyerTypeLabels[match.buyerType]}</p>
        </div>
        <span className="w-fit rounded-md border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-black text-slate-800">
          {match.matchScore}/100
        </span>
      </div>
      <p className="mt-2 text-sm leading-5 text-slate-600">{match.reason ?? "Buyer fit scored from available profile details."}</p>
      <div className="mt-3 grid gap-2 text-xs font-semibold text-slate-600 sm:grid-cols-3">
        <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1">Close: {formatLabel(match.expectedCloseSpeed)}</span>
        <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1">Price: {formatLabel(match.priceFit)}</span>
        <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1">Funding: {formatLabel(match.fundingReliability)}</span>
      </div>
      {match.risks && match.risks.length > 0 ? (
        <ul className="mt-3 space-y-1 text-sm font-medium text-amber-800">
          {match.risks.map((risk) => (
            <li key={risk}>{risk}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function DispositionBuyerMatchingCard({ dispositionRecommendation }: DispositionBuyerMatchingCardProps) {
  if (!dispositionRecommendation) {
    return (
      <section className="rounded-lg border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-600">
        Disposition recommendation unavailable. Add buyer demand, title status, asset type, offer, strategy, and closing readiness details.
      </section>
    );
  }

  const buyerDemandSignal = dispositionRecommendation.buyerDemandSignal ?? "unknown";
  const buyerMatches = dispositionRecommendation.recommendedBuyerMatches ?? [];

  return (
    <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Disposition / buyer matching engine</p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <span className={`rounded-md border px-4 py-2 text-xl font-black tracking-wide ${pathStyles[dispositionRecommendation.dispositionPath]}`}>
              {pathLabels[dispositionRecommendation.dispositionPath]}
            </span>
            <div>
              <h3 className="text-lg font-semibold text-slate-950">Internal disposition guidance only</h3>
              <p className="mt-1 text-sm leading-5 text-slate-600">No buyer outreach, messages, automation, contracts, or assignment agreements are generated.</p>
            </div>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 lg:min-w-[360px]">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Target buyer type</p>
            <p className="mt-1 text-xl font-black text-slate-950">{buyerTypeLabels[dispositionRecommendation.targetBuyerType]}</p>
          </div>
          <div className={`rounded-lg border p-3 ${demandStyles[buyerDemandSignal]}`}>
            <p className="text-xs font-semibold uppercase tracking-wide">Buyer demand</p>
            <p className="mt-1 text-xl font-black">{formatLabel(buyerDemandSignal)}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Confidence</p>
          <p className="mt-2 text-2xl font-black text-slate-950">{formatPercent(dispositionRecommendation.confidence)}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Expected assignment fee</p>
          <p className="mt-2 text-2xl font-black text-slate-950">{formatMoney(dispositionRecommendation.expectedAssignmentFee)}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Expected exit price</p>
          <p className="mt-2 text-2xl font-black text-slate-950">{formatMoney(dispositionRecommendation.expectedExitPrice)}</p>
        </div>
      </div>

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-blue-900">
        <p className="text-xs font-semibold uppercase tracking-wide">Recommended marketing angle for later human approval</p>
        <p className="mt-2 text-sm font-semibold leading-6">
          {dispositionRecommendation.recommendedMarketingAngle ?? "Disposition recommendation unavailable. Add buyer demand, title status, asset type, offer, strategy, and closing readiness details."}
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Recommended buyer matches</p>
          <p className="text-xs font-semibold text-slate-500">Priority order only, no outreach</p>
        </div>
        {buyerMatches.length > 0 ? (
          <div className="mt-3 grid gap-3 lg:grid-cols-2">
            {buyerMatches.map((match) => (
              <BuyerMatchRow key={`${match.buyerId ?? match.buyerName ?? match.matchScore}-${match.buyerType}`} match={match} />
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm font-semibold text-slate-700">No buyer list found. Showing target buyer profile and deal package checklist only.</p>
        )}
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <ListBlock title="Deal package checklist" items={dispositionRecommendation.dealPackageChecklist} />
        <ListBlock title="Required verifications" tone="warning" items={dispositionRecommendation.requiredVerifications} />
        <ListBlock title="Disposition risks" tone="warning" items={dispositionRecommendation.dispositionRisks} />
        <ListBlock title="Stop conditions" tone="danger" items={dispositionRecommendation.stopConditions} />
        <div className="lg:col-span-2">
          <ListBlock title="Compliance warnings" tone="warning" items={dispositionRecommendation.complianceWarnings} />
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Recommended next step</p>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">
          {dispositionRecommendation.recommendedNextStep || "Prepare the internal deal package for human approval only."}
        </p>
      </div>
    </section>
  );
}
