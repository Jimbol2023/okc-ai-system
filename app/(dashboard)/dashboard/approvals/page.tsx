import { ApprovalQueueClient } from "@/components/dashboard/approval-queue-client";
import { prisma } from "@/lib/prisma";
import { requireAuthenticatedServerTenant } from "@/lib/server-tenant-context";

export const dynamic = "force-dynamic";

export default async function DashboardApprovalsPage() {
  const actor = await requireAuthenticatedServerTenant();
  const packets = await prisma.unifiedApprovalItem.findMany({ where: { tenantId: actor.tenantId, itemType: "acquisition_review_packet", status: "pending_review" }, orderBy: { createdAt: "desc" }, take: 25 });
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

      <section className="rounded-xl border border-border bg-surface p-5" aria-labelledby="acquisition-packets-heading">
        <h2 id="acquisition-packets-heading" className="text-xl font-semibold text-primary">Internal acquisition-review packets</h2>
        <p className="mt-2 text-sm text-muted">Lead, task, provenance, contact posture, missing evidence, and audit linkage. Review does not authorize execution.</p>
        <div className="mt-4 grid gap-4">
          {packets.length === 0 ? <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted">No acquisition-review packet is awaiting CEO review.</p> : packets.map((packet) => {
            const payload = packet.payload && typeof packet.payload === "object" && !Array.isArray(packet.payload) ? packet.payload as Record<string, unknown> : {};
            const missing = Array.isArray(payload.missingEvidence) ? payload.missingEvidence.map(String) : [];
            const posture = payload.contactPosture && typeof payload.contactPosture === "object" && !Array.isArray(payload.contactPosture) ? payload.contactPosture as Record<string, unknown> : {};
            return <article key={packet.id} className="rounded-lg border border-border bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-2"><h3 className="font-semibold text-primary">{packet.title}</h3><span className="rounded border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-bold text-amber-900">{packet.riskLevel} risk</span></div>
              <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2"><div><dt className="font-semibold">Lead</dt><dd className="break-all text-muted">{String(payload.leadId ?? "Missing")}</dd></div><div><dt className="font-semibold">Task</dt><dd className="break-all text-muted">{String(payload.taskId ?? "Missing")}</dd></div><div><dt className="font-semibold">Contact posture</dt><dd className="text-muted">{String(posture.contactPermission ?? "unknown")} / DNC {String(posture.doNotContact ?? false)}</dd></div><div><dt className="font-semibold">Audit request</dt><dd className="break-all text-muted">{String(payload.taskAuditRequestId ?? "Missing")}</dd></div></dl>
              <div className="mt-3"><p className="text-sm font-semibold">Missing evidence</p>{missing.length ? <ul className="mt-1 list-disc pl-5 text-sm text-muted">{missing.map((item) => <li key={item}>{item}</li>)}</ul> : <p className="text-sm text-muted">No missing evidence recorded.</p>}</div>
              <p className="mt-3 text-xs font-semibold text-red-800">{packet.executionBlockedReason}</p>
            </article>;
          })}
        </div>
      </section>

      <ApprovalQueueClient />
    </div>
  );
}
