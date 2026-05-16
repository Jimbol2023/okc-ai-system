import type { ClosingChecklistItem, ClosingPath, ClosingReadinessStatus, DealExecutionClosingRecommendation } from "@/types/deal-execution-closing";

type DealExecutionClosingCardProps = {
  dealExecutionClosingRecommendation?: DealExecutionClosingRecommendation | null;
};

const pathLabels: Record<ClosingPath, string> = {
  assignment: "ASSIGNMENT",
  double_close: "DOUBLE CLOSE",
  direct_purchase: "DIRECT PURCHASE",
  seller_finance_close: "SELLER FINANCE CLOSE",
  subject_to_close: "SUBJECT-TO CLOSE",
  hold_internal: "HOLD INTERNAL",
  pause_review: "PAUSE / REVIEW",
  do_not_close: "DO NOT CLOSE",
};

const statusLabels: Record<ClosingReadinessStatus, string> = {
  ready_to_close: "Ready To Close",
  almost_ready: "Almost Ready",
  review_required: "Review Required",
  not_ready: "Not Ready",
  do_not_close: "Do Not Close",
};

const pathStyles: Record<ClosingPath, string> = {
  assignment: "border-emerald-200 bg-emerald-50 text-emerald-800",
  double_close: "border-blue-200 bg-blue-50 text-blue-800",
  direct_purchase: "border-cyan-200 bg-cyan-50 text-cyan-800",
  seller_finance_close: "border-violet-200 bg-violet-50 text-violet-800",
  subject_to_close: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-800",
  hold_internal: "border-slate-200 bg-slate-50 text-slate-800",
  pause_review: "border-amber-200 bg-amber-50 text-amber-800",
  do_not_close: "border-red-300 bg-red-50 text-red-800",
};

const statusStyles: Record<ClosingReadinessStatus, string> = {
  ready_to_close: "border-emerald-200 bg-emerald-50 text-emerald-800",
  almost_ready: "border-blue-200 bg-blue-50 text-blue-800",
  review_required: "border-amber-200 bg-amber-50 text-amber-800",
  not_ready: "border-orange-200 bg-orange-50 text-orange-800",
  do_not_close: "border-red-300 bg-red-50 text-red-800",
};

const checklistStyles: Record<ClosingChecklistItem["status"], string> = {
  complete: "border-emerald-200 bg-emerald-50 text-emerald-800",
  missing: "border-red-200 bg-red-50 text-red-800",
  needs_review: "border-amber-200 bg-amber-50 text-amber-800",
  not_applicable: "border-slate-200 bg-slate-50 text-slate-700",
};

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

function ChecklistItemCard({ item }: { item: ClosingChecklistItem }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-bold text-slate-950">{item.name}</p>
          {item.note ? <p className="mt-1 text-sm leading-5 text-slate-600">{item.note}</p> : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <span className={`w-fit rounded-md border px-2 py-1 text-xs font-black uppercase tracking-wide ${checklistStyles[item.status]}`}>
            {formatLabel(item.status)}
          </span>
          {item.severity ? (
            <span className="w-fit rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
              {formatLabel(item.severity)}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function DealExecutionClosingCard({ dealExecutionClosingRecommendation }: DealExecutionClosingCardProps) {
  if (!dealExecutionClosingRecommendation) {
    return (
      <section className="rounded-lg border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-600">
        Closing readiness unavailable. Add title status, seller agreement status, buyer/funding status, escrow status, and closing timeline.
      </section>
    );
  }

  return (
    <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Deal execution / closing engine</p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <span className={`rounded-md border px-4 py-2 text-xl font-black tracking-wide ${pathStyles[dealExecutionClosingRecommendation.closingPath]}`}>
              {pathLabels[dealExecutionClosingRecommendation.closingPath]}
            </span>
            <div>
              <h3 className="text-lg font-semibold text-slate-950">Internal closing readiness only</h3>
              <p className="mt-1 text-sm leading-5 text-slate-600">No contracts, messages, buyer contact, seller contact, automation, or closing execution are generated.</p>
            </div>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 lg:min-w-[360px]">
          <div className={`rounded-lg border p-3 ${statusStyles[dealExecutionClosingRecommendation.readinessStatus]}`}>
            <p className="text-xs font-semibold uppercase tracking-wide">Readiness status</p>
            <p className="mt-1 text-xl font-black">{statusLabels[dealExecutionClosingRecommendation.readinessStatus]}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Readiness score</p>
            <p className="mt-1 text-2xl font-black text-slate-950">{dealExecutionClosingRecommendation.readinessScore}/100</p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Closing checklist</p>
          <p className="text-xs font-semibold text-slate-500">Review status only, no execution</p>
        </div>
        {dealExecutionClosingRecommendation.checklist.length > 0 ? (
          <div className="mt-3 grid gap-3 lg:grid-cols-2">
            {dealExecutionClosingRecommendation.checklist.map((item) => (
              <ChecklistItemCard key={`${item.name}-${item.status}`} item={item} />
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm font-semibold text-slate-700">
            Closing readiness unavailable. Add title status, seller agreement status, buyer/funding status, escrow status, and closing timeline.
          </p>
        )}
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <ListBlock title="Missing items" tone="warning" items={dealExecutionClosingRecommendation.missingItems} />
        <ListBlock title="Blocker items" tone="danger" items={dealExecutionClosingRecommendation.blockerItems} />
        <ListBlock title="Title risks" tone="warning" items={dealExecutionClosingRecommendation.titleRisks} />
        <ListBlock title="Buyer risks" tone="warning" items={dealExecutionClosingRecommendation.buyerRisks} />
        <ListBlock title="Seller risks" tone="warning" items={dealExecutionClosingRecommendation.sellerRisks} />
        <ListBlock title="Funding risks" tone="warning" items={dealExecutionClosingRecommendation.fundingRisks} />
        <ListBlock title="Timeline risks" tone="warning" items={dealExecutionClosingRecommendation.timelineRisks} />
        <ListBlock title="Required verifications" tone="warning" items={dealExecutionClosingRecommendation.requiredVerifications} />
        <div className="lg:col-span-2">
          <ListBlock title="Recommended closing sequence" items={dealExecutionClosingRecommendation.recommendedClosingSequence} />
        </div>
        <div className="lg:col-span-2">
          <ListBlock title="Compliance warnings" tone="warning" items={dealExecutionClosingRecommendation.complianceWarnings} />
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Recommended next step</p>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">
          {dealExecutionClosingRecommendation.recommendedNextStep || "Resolve closing blockers and prepare for human review only."}
        </p>
      </div>
    </section>
  );
}
