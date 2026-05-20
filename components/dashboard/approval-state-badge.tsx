type ApprovalStateBadgeProps = {
  approvalStatus?: string | null;
};

const stateLabels: Record<string, string> = {
  pending_review: "Pending Review",
  approved_for_outreach: "Approved, not sent",
  rejected: "Rejected",
  needs_human_review: "Needs Human Review",
  follow_up_only: "Follow-Up Only",
};

const stateClasses: Record<string, string> = {
  pending_review: "border-amber-200 bg-amber-50 text-amber-800",
  approved_for_outreach: "border-blue-200 bg-blue-50 text-blue-800",
  rejected: "border-slate-200 bg-slate-100 text-slate-700",
  needs_human_review: "border-orange-200 bg-orange-50 text-orange-800",
  follow_up_only: "border-emerald-200 bg-emerald-50 text-emerald-800",
};

export function getApprovalStateLabel(approvalStatus?: string | null) {
  const status = approvalStatus || "pending_review";

  return stateLabels[status] ?? status.replaceAll("_", " ");
}

export function ApprovalStateBadge({ approvalStatus }: ApprovalStateBadgeProps) {
  const status = approvalStatus || "pending_review";

  return (
    <span className={`rounded border px-2 py-1 text-xs font-bold ${stateClasses[status] ?? "border-slate-200 bg-slate-50 text-slate-700"}`}>
      {getApprovalStateLabel(status)}
    </span>
  );
}
