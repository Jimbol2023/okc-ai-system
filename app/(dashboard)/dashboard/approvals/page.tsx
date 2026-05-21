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

      <section
        aria-labelledby="approval-queue-sop-heading"
        className="rounded-xl border border-blue-100 bg-blue-50 p-4"
      >
        <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr_1fr]">
          <div>
            <h2
              id="approval-queue-sop-heading"
              className="text-lg font-bold text-blue-950"
            >
              Approval queue guidance
            </h2>
            <p className="mt-2 text-sm leading-6 text-blue-950">
              Approval means review only. It does not send SMS, email, or provider messages.
              Providers remain disabled and simulation-first controls remain active.
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-blue-900">
              Manual review required
            </p>
            <p className="mt-2 text-sm leading-6 text-blue-950">
              Manual follow-up must happen outside the app after human review, before any
              seller or buyer-facing action.
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-blue-900">
              Do not proceed if
            </p>
            <ul className="mt-2 space-y-1 text-sm leading-6 text-blue-950" aria-label="Approval queue do not proceed conditions">
              <li>! DNC or opt-out risk exists.</li>
              <li>! Critical data is missing.</li>
              <li>! Buyer package is incomplete.</li>
              <li>! Governance state is blocked.</li>
            </ul>
          </div>
        </div>
      </section>

      <ApprovalQueueClient />
    </div>
  );
}
