import type { FundingApprovalReadiness, FundingApprovalStatus, FundingGuardrail } from "@/types/funding-approval";

type FundingApprovalReadinessCardProps = {
  fundingApprovalReadiness?: FundingApprovalReadiness | null;
};

const statusLabels: Record<FundingApprovalStatus, string> = {
  approved: "APPROVED",
  approved_with_conditions: "APPROVED WITH CONDITIONS",
  review_required: "REVIEW REQUIRED",
  rejected: "REJECTED",
};

const statusStyles: Record<FundingApprovalStatus, string> = {
  approved: "border-emerald-200 bg-emerald-50 text-emerald-800",
  approved_with_conditions: "border-amber-200 bg-amber-50 text-amber-800",
  review_required: "border-orange-200 bg-orange-50 text-orange-800",
  rejected: "border-red-200 bg-red-50 text-red-800",
};

const guardrailStyles: Record<FundingGuardrail["status"], string> = {
  pass: "border-emerald-200 bg-emerald-50 text-emerald-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  fail: "border-red-200 bg-red-50 text-red-800",
};

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

export function FundingApprovalReadinessCard({ fundingApprovalReadiness }: FundingApprovalReadinessCardProps) {
  if (!fundingApprovalReadiness) {
    return (
      <section className="rounded-lg border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-600">
        Funding approval readiness unavailable. Add purchase price, ARV, repairs, timeline, funding assumptions, title status, and exit strategy.
      </section>
    );
  }

  return (
    <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Funding approval readiness</p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <span className={`rounded-md border px-4 py-2 text-xl font-black tracking-wide ${statusStyles[fundingApprovalReadiness.status]}`}>
              {statusLabels[fundingApprovalReadiness.status]}
            </span>
            <div>
              <h3 className="text-lg font-semibold text-slate-950">Internal readiness only</h3>
              <p className="mt-1 text-sm leading-5 text-slate-600">
                {fundingApprovalReadiness.approvalSummary || "This is not real funding approval."}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 lg:min-w-[180px]">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Readiness score</p>
          <p className="mt-1 text-3xl font-black text-slate-950">{fundingApprovalReadiness.readinessScore}/100</p>
        </div>
      </div>

      <div className="grid gap-2">
        {fundingApprovalReadiness.guardrails.map((guardrail) => (
          <div key={guardrail.name} className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-bold text-slate-950">{guardrail.name}</p>
              <p className="mt-1 text-sm leading-5 text-slate-600">{guardrail.message}</p>
            </div>
            <span className={`w-fit rounded-full border px-2 py-1 text-xs font-bold uppercase ${guardrailStyles[guardrail.status]}`}>
              {guardrail.status} | {guardrail.severity}
            </span>
          </div>
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <ListBlock title="Violated guardrails" tone="danger" items={fundingApprovalReadiness.violatedGuardrails?.map((guardrail) => `${guardrail.name}: ${guardrail.message}`)} />
        <ListBlock title="Required fixes" tone="danger" items={fundingApprovalReadiness.requiredFixes} />
        <ListBlock title="Missing documents" tone="warning" items={fundingApprovalReadiness.missingDocuments} />
        <ListBlock title="Missing data" tone="warning" items={fundingApprovalReadiness.missingData} />
        <ListBlock title="Funding conditions" tone="warning" items={fundingApprovalReadiness.fundingConditions} />
        <ListBlock title="Compliance warnings" tone="warning" items={fundingApprovalReadiness.complianceWarnings} />
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Recommended next step</p>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">
          {fundingApprovalReadiness.recommendedNextStep || "Review readiness findings with a qualified human operator before any funding review package is prepared."}
        </p>
      </div>
    </section>
  );
}
