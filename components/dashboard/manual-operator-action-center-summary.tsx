type ManualActionItem = {
  title: string;
  status: string;
  detail: string;
};

const safetyBadges = ["Read-only", "Manual review", "No execution", "Providers blocked"];

const manualActionItems: ManualActionItem[] = [
  {
    title: "Revenue-priority review",
    status: "Revenue priority is advisory only.",
    detail:
      "High-value signals can help an operator decide what to review first, but they cannot send, call, trigger providers, or execute workflows.",
  },
  {
    title: "Seller follow-up visibility",
    status: "Manual review recommended.",
    detail:
      "Seller follow-up visibility means a human may want to inspect the lead context before deciding whether any future action is appropriate.",
  },
  {
    title: "Stuck-deal visibility",
    status: "Human decision required.",
    detail:
      "Stuck-deal and bottleneck signals are review prompts only. They do not route work, escalate automatically, or launch campaigns.",
  },
  {
    title: "Near-close visibility",
    status: "Recommendations do not execute.",
    detail:
      "Near-close opportunity labels can support manual attention, but they cannot contact sellers, contact buyers, or activate automation.",
  },
  {
    title: "Buyer-ready visibility",
    status: "Buyer-ready does not mean send.",
    detail:
      "Buyer-ready labels remain advisory. They do not blast buyers, start disposition workflows, or grant provider permission.",
  },
  {
    title: "Missing-data blockers",
    status: "Missing data requires manual cleanup review.",
    detail:
      "Incomplete data can be highlighted for operator attention only and cannot trigger enrichment, scraping, skip tracing, or external lookup.",
  },
  {
    title: "Governance-blocked items",
    status: "Governance stop signals must be resolved first.",
    detail:
      "Governance stops outrank revenue priority, urgency, readiness, workload pressure, AI recommendation, and approval status.",
  },
  {
    title: "Provider and audit boundary",
    status: "Provider activation remains blocked.",
    detail:
      "No provider called, no message sent, no fetch/network call, no persistence, and no audit records are written in this phase.",
  },
];

export function ManualOperatorActionCenterSummary() {
  return (
    <section
      aria-labelledby="manual-operator-action-center-heading"
      aria-describedby="manual-operator-action-center-summary"
      className="overflow-hidden rounded-[1.5rem] border border-border bg-surface p-5 sm:p-6"
    >
      <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">
            Manual operator action center
          </p>
          <h2 id="manual-operator-action-center-heading" className="break-words text-xl font-semibold text-primary">
            Read-only manual revenue work guidance
          </h2>
          <p id="manual-operator-action-center-summary" className="max-w-3xl break-words text-sm leading-6 text-muted">
            Human-in-control visibility only. Manual recommendations do not execute. Revenue priority is advisory only.
            Provider activation, runtime activation, polling, persistence, audit writing, campaigns, and sending remain blocked.
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
        {manualActionItems.map((item) => (
          <article key={item.title} className="min-w-0 rounded-2xl border border-border bg-white p-4">
            <h3 className="break-words text-sm font-semibold text-primary">{item.title}</h3>
            <p className="mt-2 break-words text-sm font-medium text-primary">{item.status}</p>
            <p className="mt-1 break-words text-sm leading-6 text-muted">{item.detail}</p>
          </article>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-950">
        <h3 className="break-words font-semibold text-blue-950">Manual action boundary</h3>
        <p className="mt-1 break-words">
          This surface is advisory text only. It does not add buttons, click handlers, forms, execution controls, send
          controls, provider controls, approval controls, workflow controls, campaign controls, polling, auto-refresh,
          runtime activation, automation-agent activation, audit writing, persistence, env reads, fetch/network calls,
          provider clients, autonomous routing, autonomous outreach, or autonomous negotiation.
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
          persistenceAllowedNow:false
        </span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">
          pollingAllowed:false
        </span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">
          runtimeActivationAllowed:false
        </span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">
          providerActivationAllowed:false
        </span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">
          auditRecordsWritten:false
        </span>
      </div>
    </section>
  );
}
