import type { OfferRecommendation, OfferType } from "@/types/offer-engine";

type OfferRecommendationCardProps = {
  offerRecommendation?: OfferRecommendation | null;
};

const offerTypeLabels: Record<OfferType, string> = {
  cash_offer: "Cash Offer",
  wholesale_offer: "Wholesale Offer",
  flip_offer: "Flip Offer",
  rental_hold_offer: "Rental Hold Offer",
  seller_finance_offer: "Seller Finance Offer",
  subject_to_offer: "Subject-To Offer",
  land_offer: "Land Offer",
  partnership_offer: "Partnership Offer",
  pass_no_offer: "Pass / No Offer",
};

const strengthStyles = {
  strong: "border-emerald-200 bg-emerald-50 text-emerald-800",
  moderate: "border-amber-200 bg-amber-50 text-amber-800",
  weak: "border-red-200 bg-red-50 text-red-800",
};

function formatMoney(value?: number) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "Unavailable";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value?: number, suffix = "") {
  if (typeof value !== "number" || !Number.isFinite(value)) return "Unavailable";

  return `${Math.round(value)}${suffix}`;
}

function ListBlock({ title, items, tone = "neutral" }: { title: string; items?: string[]; tone?: "neutral" | "warning" | "danger" }) {
  const visibleItems = items?.filter(Boolean) ?? [];
  const styles = tone === "danger"
    ? "border-red-200 bg-red-50 text-red-800"
    : tone === "warning"
      ? "border-amber-200 bg-amber-50 text-amber-800"
      : "border-slate-200 bg-white text-slate-700";

  return (
    <div className={`rounded-lg border p-3 ${styles}`}>
      <p className="text-xs font-semibold uppercase tracking-wide">{title}</p>
      {visibleItems.length > 0 ? (
        <ul className="mt-2 space-y-2">
          {visibleItems.slice(0, 6).map((item) => (
            <li key={item} className="text-sm font-medium leading-5">{item}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm">None flagged.</p>
      )}
    </div>
  );
}

export function OfferRecommendationCard({ offerRecommendation }: OfferRecommendationCardProps) {
  if (!offerRecommendation) {
    return (
      <section className="rounded-lg border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-600">
        Offer recommendation unavailable. Add ARV, repairs, asking price, timeline, strategy, and funding readiness details.
      </section>
    );
  }

  return (
    <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Offer engine</p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <span className={`rounded-md border px-4 py-2 text-xl font-black tracking-wide ${strengthStyles[offerRecommendation.offerStrength ?? "weak"]}`}>
              {offerTypeLabels[offerRecommendation.offerType]}
            </span>
            <div>
              <h3 className="text-lg font-semibold text-slate-950">Internal offer guidance only</h3>
              <p className="mt-1 text-sm leading-5 text-slate-600">This is not a legal contract and no offer is sent.</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 lg:min-w-[220px]">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Recommended offer</p>
          <p className="mt-1 text-3xl font-black text-slate-950">{formatMoney(offerRecommendation.recommendedOffer)}</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Opening offer</p>
          <p className="mt-1 text-xl font-black text-slate-950">{formatMoney(offerRecommendation.openingOffer)}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Max allowable</p>
          <p className="mt-1 text-xl font-black text-slate-950">{formatMoney(offerRecommendation.maxAllowableOffer)}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Walk-away</p>
          <p className="mt-1 text-xl font-black text-slate-950">{formatMoney(offerRecommendation.walkAwayPrice)}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Confidence</p>
          <p className="mt-1 text-xl font-black text-slate-950">{formatNumber(offerRecommendation.confidence, "/100")}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Strength</p>
          <p className="mt-1 text-xl font-black capitalize text-slate-950">{offerRecommendation.offerStrength ?? "weak"}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Negotiation room</p>
          <p className="mt-1 text-xl font-black text-slate-950">{formatMoney(offerRecommendation.negotiationRoom)}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Expected profit</p>
          <p className="mt-1 text-xl font-black text-slate-950">{formatMoney(offerRecommendation.expectedProfit)}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Margin of safety</p>
          <p className="mt-1 text-xl font-black text-slate-950">{formatNumber(offerRecommendation.marginOfSafety, "%")}</p>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <ListBlock title="Suggested terms" items={offerRecommendation.terms} />
        <ListBlock title="Rationale" items={offerRecommendation.rationale} />
        <ListBlock title="Risk adjustments" tone="warning" items={offerRecommendation.riskAdjustments} />
        <ListBlock title="Required verifications" tone="warning" items={offerRecommendation.requiredVerifications} />
        <ListBlock title="Missing data" tone="danger" items={offerRecommendation.missingData} />
        <ListBlock title="Compliance warnings" tone="warning" items={offerRecommendation.complianceWarnings} />
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Recommended next step</p>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">
          {offerRecommendation.recommendedNextStep || "Review all assumptions before presenting or signing any offer."}
        </p>
      </div>
    </section>
  );
}
