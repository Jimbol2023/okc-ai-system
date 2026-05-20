import { ApprovalQueueClient } from "@/components/dashboard/approval-queue-client";

export default function DashboardApprovalsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">Human Review</p>
        <h1 className="text-3xl font-semibold text-primary">Approval queue</h1>
        <p className="max-w-3xl text-sm leading-6 text-muted">
          Review seller leads, approval state, scoring context, and safety flags. State changes here do not send SMS or email.
        </p>
      </div>

      <ApprovalQueueClient />
    </div>
  );
}
