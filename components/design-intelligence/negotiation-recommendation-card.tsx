import type { NegotiationPosture, NegotiationRecommendation, NegotiationStatus, SellerObjection } from "@/types/negotiation-engine";

type NegotiationRecommendationCardProps = {
  negotiationRecommendation?: NegotiationRecommendation | null;
};

const statusLabels: Record<NegotiationStatus, string> = {
  ready_to_negotiate: "READY TO NEGOTIATE",
  negotiate_with_conditions: "NEGOTIATE WITH CONDITIONS",
  review_required: "REVIEW REQUIRED",
  do_not_negotiate: "DO NOT NEGOTIATE",
};

const postureLabels: Record<NegotiationPosture, string> = {
  soft_consultative: "Soft Consultative",
  firm_investor: "Firm Investor",
  problem_solver: "Problem Solver",
  urgent_deadline: "Urgent Deadline",
  data_driven: "Data Driven",
  pause_review: "Pause / Review",
};

const statusStyles: Record<NegotiationStatus, string> = {
  ready_to_negotiate: "border-emerald-200 bg-emerald-50 text-emerald-800",
  negotiate_with_conditions: "border-amber-200 bg-amber-50 text-amber-800",
  review_required: "border-orange-200 bg-orange-50 text-orange-800",
  do_not_negotiate: "border-red-200 bg-red-50 text-red-800",
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
          {visibleItems.slice(0, 7).map((item) => (
            <li key={item} className="text-sm font-medium leading-5">{item}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm">None flagged.</p>
      )}
    </div>
  );
}

function ObjectionCard({ objection }: { objection: SellerObjection }) {
  const riskStyle = objection.riskLevel === "high"
    ? "border-red-200 bg-red-50 text-red-800"
    : objection.riskLevel === "medium"
      ? "border-amber-200 bg-amber-50 text-amber-800"
      : "border-emerald-200 bg-emerald-50 text-emerald-800";

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <p className="text-sm font-bold text-slate-950">{objection.objection}</p>
        <span className={`w-fit rounded-full border px-2 py-1 text-xs font-bold uppercase ${riskStyle}`}>{objection.riskLevel ?? "medium"}</span>
      </div>
      <p className="mt-2 text-sm leading-5 text-slate-600">{objection.likelyReason}</p>
      <p className="mt-2 text-sm font-semibold leading-5 text-slate-800">{objection.responseStrategy}</p>
      {objection.sampleResponse ? (
        <p className="mt-2 rounded-md border border-slate-200 bg-slate-50 p-2 text-sm leading-5 text-slate-700">{objection.sampleResponse}</p>
      ) : null}
    </div>
  );
}

export function NegotiationRecommendationCard({ negotiationRecommendation }: NegotiationRecommendationCardProps) {
  if (!negotiationRecommendation) {
    return (
      <section className="rounded-lg border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-600">
        Negotiation recommendation unavailable. Add offer, seller motivation, timeline, ARV, repairs, title status, and approval readiness details.
      </section>
    );
  }

  return (
    <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Negotiation engine</p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <span className={`rounded-md border px-4 py-2 text-xl font-black tracking-wide ${statusStyles[negotiationRecommendation.status]}`}>
              {statusLabels[negotiationRecommendation.status]}
            </span>
            <div>
              <h3 className="text-lg font-semibold text-slate-950">{postureLabels[negotiationRecommendation.posture]}</h3>
              <p className="mt-1 text-sm leading-5 text-slate-600">Internal seller-conversation guidance only. No message is sent.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Opening position</p>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">{negotiationRecommendation.openingPosition ?? "Unavailable."}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Target outcome</p>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">{negotiationRecommendation.targetOutcome ?? "Unavailable."}</p>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-800">
          <p className="text-xs font-semibold uppercase tracking-wide">Walk-away trigger</p>
          <p className="mt-2 text-sm font-semibold leading-6">{negotiationRecommendation.walkAwayTrigger ?? "Unavailable."}</p>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <ListBlock title="Safe concessions" items={negotiationRecommendation.safeConcessions} />
        <ListBlock title="Unsafe concessions" tone="danger" items={negotiationRecommendation.unsafeConcessions} />
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Likely seller objections</p>
        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          {(negotiationRecommendation.likelyObjections ?? []).slice(0, 8).map((objection) => (
            <ObjectionCard key={objection.objection} objection={objection} />
          ))}
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <ListBlock title="Talking points" items={negotiationRecommendation.talkingPoints} />
        <ListBlock title="Negotiation risks" tone="warning" items={negotiationRecommendation.negotiationRisks} />
        <ListBlock title="Required verifications" tone="warning" items={negotiationRecommendation.requiredVerifications} />
        <ListBlock title="Compliance warnings" tone="warning" items={negotiationRecommendation.complianceWarnings} />
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Recommended next step</p>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">
          {negotiationRecommendation.recommendedNextStep || "Review internally before any seller conversation."}
        </p>
      </div>
    </section>
  );
}
