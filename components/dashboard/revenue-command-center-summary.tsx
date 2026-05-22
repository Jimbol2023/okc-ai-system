type RevenueCommandItem = {
  title: string;
  status: string;
  detail: string;
};

const safetyBadges = ["Read-only", "Revenue advisory", "No execution", "Providers blocked"];

const revenueCommandItems: RevenueCommandItem[] = [
  {
    title: "Revenue priority",
    status: "Revenue priority is advisory only.",
    detail:
      "High-value opportunity signals can guide manual review, but they cannot send, call, activate providers, launch campaigns, or execute workflows.",
  },
  {
    title: "Near-close opportunities",
    status: "Near-close does not execute.",
    detail:
      "Near-close status may deserve human attention, but it does not create workflow jobs, route deals, or contact sellers or buyers.",
  },
  {
    title: "Stuck deals",
    status: "Stuck-deal status requires manual review.",
    detail:
      "Bottleneck visibility is a review prompt only. It cannot activate providers, escalate automatically, or override governance stops.",
  },
  {
    title: "Buyer-ready deals",
    status: "Buyer-ready does not mean outreach.",
    detail:
      "Buyer-ready visibility can support package review, but it cannot contact buyers, send deal packages, or start disposition campaigns.",
  },
  {
    title: "Overdue manual work",
    status: "Overdue follow-up never sends.",
    detail:
      "Overdue manual work can help operators decide what to inspect first, but it does not send SMS, email, calls, or automated reminders.",
  },
  {
    title: "Missing-data blockers",
    status: "Missing data blocks action.",
    detail:
      "Incomplete source, contact, condition, pricing, buyer-fit, or timeline data can be surfaced without enrichment, scraping, persistence, or execution.",
  },
  {
    title: "Governance-blocked revenue risk",
    status: "Governance stops still dominate.",
    detail:
      "Governance stops outrank revenue score, urgency, near-close status, buyer readiness, workload pressure, approval status, and AI recommendations.",
  },
  {
    title: "Provider and audit boundary",
    status: "Provider activation remains blocked.",
    detail:
      "No provider called, no provider client created, no credential or env read, no fetch/network call, and no audit records are written in this phase.",
  },
];

export function RevenueCommandCenterSummary() {
  return (
    <section
      aria-labelledby="revenue-command-center-heading"
      aria-describedby="revenue-command-center-summary"
      className="overflow-hidden rounded-[1.5rem] border border-border bg-surface p-5 sm:p-6"
    >
      <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">
            Revenue command center
          </p>
          <h2 id="revenue-command-center-heading" className="break-words text-xl font-semibold text-primary">
            Read-only revenue opportunity command view
          </h2>
          <p id="revenue-command-center-summary" className="max-w-3xl break-words text-sm leading-6 text-muted">
            Human-controlled revenue visibility only. Revenue priority, revenue score, near-close status, stuck-deal
            status, buyer-ready status, overdue follow-up, urgency, queue, readiness, approval, provider readiness, and
            simulation never grant execution. Provider activation, campaigns, runtime activation, polling, persistence,
            audit writing, outreach, and sending remain blocked.
          </p>
        </div>
        <div className="flex max-w-full flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.1em]">
          {safetyBadges.map((badge) => (
            <span
              key={badge}
              className="max-w-full break-words rounded-full border border-border bg-white px-3 py-1 text-center leading-5 text-primary"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {revenueCommandItems.map((item) => (
          <article key={item.title} className="min-w-0 rounded-2xl border border-border bg-white p-4">
            <h3 className="break-words text-sm font-semibold text-primary">{item.title}</h3>
            <p className="mt-2 break-words text-sm font-medium text-primary">{item.status}</p>
            <p className="mt-1 break-words text-sm leading-6 text-muted">{item.detail}</p>
          </article>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-950">
        <h3 className="break-words font-semibold text-blue-950">Revenue command boundary</h3>
        <p className="mt-1 break-words">
          This surface is advisory text only. It does not add buttons, click handlers, forms, inputs, provider controls,
          send controls, call controls, SMS controls, email controls, workflow controls, campaign controls, approval
          controls, polling, auto-refresh, runtime jobs, provider activation, persistence, audit writing, credential or
          env reads, fetch/network calls, autonomous routing, autonomous outreach, autonomous negotiation, or execution.
        </p>
      </div>

      <div className="mt-4 flex max-w-full flex-wrap gap-2 text-xs font-bold">
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">
          readOnly:true
        </span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">
          advisoryOnly:true
        </span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">
          simulationOnly:true
        </span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">
          providerCalled:false
        </span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">
          sent:false
        </span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">
          revenueSignalGrantsExecution:false
        </span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">
          outreachAuthorizedNow:false
        </span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">
          campaignAllowedNow:false
        </span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">
          runtimeActivationAllowed:false
        </span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">
          auditRecordsWritten:false
        </span>
      </div>
    </section>
  );
}
