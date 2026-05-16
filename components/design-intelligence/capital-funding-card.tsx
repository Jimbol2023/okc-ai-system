import type { FundingMethod, FundingRecommendation } from "@/types/capital-funding";

type CapitalFundingCardProps = {
  fundingRecommendation?: FundingRecommendation | null;
};

const methodLabels: Record<FundingMethod, string> = {
  cash: "Cash",
  private_money: "Private Money",
  hard_money: "Hard Money",
  bridge_lending: "Bridge Lending",
  transactional_funding: "Transactional Funding",
  seller_finance: "Seller Finance",
  subject_to: "Subject To",
  partnership: "Partnership",
  buyer_funded_double_close: "Buyer-Funded Double Close",
  pass_or_wait: "Pass / Wait",
};

const fitStyles = {
  strong: "border-emerald-200 bg-emerald-50 text-emerald-800",
  moderate: "border-amber-200 bg-amber-50 text-amber-800",
  weak: "border-red-200 bg-red-50 text-red-800",
  fast: "border-emerald-200 bg-emerald-50 text-emerald-800",
  slow: "border-red-200 bg-red-50 text-red-800",
};

function formatMoney(value?: number) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "Unavailable";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function ListBlock({ title, items, danger = false }: { title: string; items?: string[]; danger?: boolean }) {
  const visibleItems = items?.filter(Boolean) ?? [];

  return (
    <div className={`rounded-lg border p-3 ${danger ? "border-red-200 bg-red-50" : "border-slate-200 bg-white"}`}>
      <p className={`text-xs font-semibold uppercase tracking-wide ${danger ? "text-red-800" : "text-slate-500"}`}>{title}</p>
      {visibleItems.length > 0 ? (
        <ul className="mt-2 space-y-2">
          {visibleItems.slice(0, 5).map((item) => (
            <li key={item} className={`text-sm leading-5 ${danger ? "font-medium text-red-800" : "text-slate-700"}`}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className={`mt-2 text-sm ${danger ? "text-red-700" : "text-slate-500"}`}>None available.</p>
      )}
    </div>
  );
}

export function CapitalFundingCard({ fundingRecommendation }: CapitalFundingCardProps) {
  if (!fundingRecommendation) {
    return (
      <section className="rounded-lg border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-600">
        Funding recommendation unavailable. Add purchase price, ARV, repair estimate, timeline, and strategy details.
      </section>
    );
  }

  return (
    <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Capital & funding intelligence</p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <span className="rounded-md border border-blue-200 bg-blue-50 px-4 py-2 text-2xl font-black tracking-wide text-blue-800">
              {methodLabels[fundingRecommendation.primaryMethod] ?? fundingRecommendation.primaryMethod}
            </span>
            <div>
              <h3 className="text-lg font-semibold text-slate-950">Recommended funding path</h3>
              <p className="mt-1 text-sm text-slate-600">Read-only funding guidance. No lender contact is triggered.</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase ${fitStyles[fundingRecommendation.fundingFit ?? "weak"]}`}>
              Funding {fundingRecommendation.fundingFit ?? "weak"}
            </span>
            <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase ${fitStyles[fundingRecommendation.speedFit ?? "slow"]}`}>
              Speed {fundingRecommendation.speedFit ?? "slow"}
            </span>
            <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase ${fitStyles[fundingRecommendation.strategyFit ?? "weak"]}`}>
              Strategy {fundingRecommendation.strategyFit ?? "weak"}
            </span>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[420px]">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Capital required</p>
            <p className="mt-1 text-xl font-black text-slate-950">{formatMoney(fundingRecommendation.capitalRequired)}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Confidence</p>
            <p className="mt-1 text-xl font-black text-slate-950">{fundingRecommendation.confidence ?? "Unavailable"}/100</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Estimated down</p>
            <p className="mt-1 text-xl font-black text-slate-950">{formatMoney(fundingRecommendation.estimatedDownPayment)}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Loan amount</p>
            <p className="mt-1 text-xl font-black text-slate-950">{formatMoney(fundingRecommendation.estimatedLoanAmount)}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <ListBlock title="Reasons" items={fundingRecommendation.reasons} />
        <ListBlock title="Risks" items={fundingRecommendation.risks} />
        <ListBlock title="Blockers" items={fundingRecommendation.blockers} danger />
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Backup funding methods</p>
        {fundingRecommendation.backupMethods && fundingRecommendation.backupMethods.length > 0 ? (
          <div className="mt-2 grid gap-2 md:grid-cols-3">
            {fundingRecommendation.backupMethods.slice(0, 3).map((backup) => (
              <div key={backup.method} className="rounded-md bg-white px-3 py-2 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-slate-800">{methodLabels[backup.method]}</span>
                  <span className="text-slate-500">{backup.score}/100</span>
                </div>
                {backup.reason ? <p className="mt-1 text-xs text-slate-500">{backup.reason}</p> : null}
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-slate-500">No backup funding methods available.</p>
        )}
      </div>

      {fundingRecommendation.complianceWarnings && fundingRecommendation.complianceWarnings.length > 0 ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">Compliance warnings</p>
          <ul className="mt-2 space-y-2">
            {fundingRecommendation.complianceWarnings.map((warning) => (
              <li key={warning} className="text-sm font-medium leading-5 text-amber-800">{warning}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Recommended next step</p>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">
          {fundingRecommendation.recommendedNextStep || "Review funding assumptions with a qualified human operator before action."}
        </p>
      </div>
    </section>
  );
}
