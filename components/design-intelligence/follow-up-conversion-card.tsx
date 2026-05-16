import type { ConversionPriority, FollowUpAction, FollowUpRecommendation, SellerState } from "@/types/follow-up-conversion";

type FollowUpConversionCardProps = {
  followUpRecommendation?: FollowUpRecommendation | null;
};

const sellerStateLabels: Record<SellerState, string> = {
  new_uncontacted: "NEW / UNCONTACTED",
  interested: "INTERESTED",
  needs_time: "NEEDS TIME",
  price_gap: "PRICE GAP",
  follow_up_needed: "FOLLOW-UP NEEDED",
  hot_ready: "HOT / READY",
  cold: "COLD",
  dead: "DEAD",
  do_not_contact: "DO NOT CONTACT",
  review_required: "REVIEW REQUIRED",
};

const priorityLabels: Record<ConversionPriority, string> = {
  urgent: "Urgent",
  high: "High",
  medium: "Medium",
  low: "Low",
  do_not_pursue: "Do Not Pursue",
};

const actionLabels: Record<FollowUpAction, string> = {
  call: "Call Task",
  sms_draft: "SMS Draft Guidance",
  email_draft: "Email Draft Guidance",
  task_only: "Task Only",
  human_review: "Human Review",
  pause: "Pause",
  kill: "Kill",
};

const stateStyles: Record<SellerState, string> = {
  new_uncontacted: "border-slate-200 bg-slate-50 text-slate-800",
  interested: "border-blue-200 bg-blue-50 text-blue-800",
  needs_time: "border-amber-200 bg-amber-50 text-amber-800",
  price_gap: "border-orange-200 bg-orange-50 text-orange-800",
  follow_up_needed: "border-cyan-200 bg-cyan-50 text-cyan-800",
  hot_ready: "border-emerald-200 bg-emerald-50 text-emerald-800",
  cold: "border-slate-300 bg-white text-slate-700",
  dead: "border-slate-700 bg-slate-950 text-white",
  do_not_contact: "border-red-300 bg-red-50 text-red-800",
  review_required: "border-violet-200 bg-violet-50 text-violet-800",
};

const priorityStyles: Record<ConversionPriority, string> = {
  urgent: "border-red-200 bg-red-50 text-red-800",
  high: "border-orange-200 bg-orange-50 text-orange-800",
  medium: "border-amber-200 bg-amber-50 text-amber-800",
  low: "border-slate-200 bg-slate-50 text-slate-700",
  do_not_pursue: "border-slate-700 bg-slate-950 text-white",
};

function formatTiming(hours?: number) {
  if (typeof hours !== "number" || !Number.isFinite(hours)) return "Human review required";
  if (hours < 24) return `${Math.round(hours)} hours`;

  const days = Math.round(hours / 24);

  return `${days} ${days === 1 ? "day" : "days"}`;
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

export function FollowUpConversionCard({ followUpRecommendation }: FollowUpConversionCardProps) {
  if (!followUpRecommendation) {
    return (
      <section className="rounded-lg border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-600">
        Follow-up recommendation unavailable. Add seller response, motivation, timeline, offer, negotiation status, and contact safety status.
      </section>
    );
  }

  return (
    <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Follow-up conversion engine</p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <span className={`rounded-md border px-4 py-2 text-xl font-black tracking-wide ${stateStyles[followUpRecommendation.sellerState]}`}>
              {sellerStateLabels[followUpRecommendation.sellerState]}
            </span>
            <div>
              <h3 className="text-lg font-semibold text-slate-950">Internal conversion guidance only</h3>
              <p className="mt-1 text-sm leading-5 text-slate-600">No SMS, email, seller contact, automation, or contract is generated.</p>
            </div>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 lg:min-w-[360px]">
          <div className={`rounded-lg border p-3 ${priorityStyles[followUpRecommendation.priority]}`}>
            <p className="text-xs font-semibold uppercase tracking-wide">Conversion priority</p>
            <p className="mt-1 text-2xl font-black">{priorityLabels[followUpRecommendation.priority]}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Recommended action</p>
            <p className="mt-1 text-2xl font-black text-slate-950">{actionLabels[followUpRecommendation.recommendedAction]}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Next follow-up timing</p>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">{formatTiming(followUpRecommendation.nextFollowUpInHours)}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Follow-up angle</p>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">{followUpRecommendation.followUpAngle ?? "Unavailable."}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Conversion goal</p>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">{followUpRecommendation.conversionGoal ?? "Unavailable."}</p>
        </div>
      </div>

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-blue-900">
        <p className="text-xs font-semibold uppercase tracking-wide">Message guidance for human approval</p>
        <p className="mt-2 text-sm font-semibold leading-6">
          {followUpRecommendation.messageGuidance ?? "No message guidance recommended for this seller state."}
        </p>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <ListBlock title="Escalation triggers" tone="warning" items={followUpRecommendation.escalationTriggers} />
        <ListBlock title="Stop conditions" tone="danger" items={followUpRecommendation.stopConditions} />
        <ListBlock title="Risks if waiting or proceeding" tone="warning" items={followUpRecommendation.risks} />
        <ListBlock title="Required verifications" tone="warning" items={followUpRecommendation.requiredVerifications} />
        <div className="lg:col-span-2">
          <ListBlock title="Compliance warnings" tone="warning" items={followUpRecommendation.complianceWarnings} />
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Recommended next step</p>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">
          {followUpRecommendation.recommendedNextStep || "Review internally before any seller-facing action is considered."}
        </p>
      </div>
    </section>
  );
}
