type ControlledOutreachItem = {
  title: string;
  status: string;
  detail: string;
};

const safetyBadges = ["Read-only", "Contact not authorized", "Providers blocked", "No send controls"];

const controlledOutreachItems: ControlledOutreachItem[] = [
  {
    title: "Outreach preparation",
    status: "Outreach preparation is advisory only.",
    detail:
      "Preparation visibility can help organize context for a human, but it cannot send, call, text, email, launch campaigns, or execute workflows.",
  },
  {
    title: "Contact authorization",
    status: "Contact is not authorized in this phase.",
    detail:
      "No seller or buyer contact is initiated here. Human review would be required before any future contact workflow could be considered.",
  },
  {
    title: "Message preview boundary",
    status: "Message preview never sends.",
    detail:
      "Future message-prep concepts remain review-only and cannot become SMS, email, provider calls, or approval-to-send behavior.",
  },
  {
    title: "Call preparation boundary",
    status: "Call preparation never calls.",
    detail:
      "Call-prep visibility can describe context, but it does not dial, queue calls, activate providers, or create runtime jobs.",
  },
  {
    title: "Provider boundary",
    status: "Provider activation remains blocked.",
    detail:
      "No provider called, no provider client created, no provider credentials read, no provider env vars read, and no fetch/network call is created.",
  },
  {
    title: "Campaign boundary",
    status: "No campaign launched.",
    detail:
      "Outreach preparation does not create campaigns, audience queues, blasts, autonomous routing, or automated follow-up sequences.",
  },
  {
    title: "Governance stop visibility",
    status: "Governance stop signals must be resolved first.",
    detail:
      "Governance stops outrank outreach readiness, revenue priority, urgency, approval status, simulation readiness, and provider readiness.",
  },
  {
    title: "Audit and persistence boundary",
    status: "Audit layer not active yet.",
    detail:
      "Audit persistence is not authorized now. No outreach records, contact records, persistence, or audit records are written in this phase.",
  },
];

export function ControlledHumanOutreachSummary() {
  return (
    <section
      aria-labelledby="controlled-human-outreach-heading"
      aria-describedby="controlled-human-outreach-summary"
      className="overflow-hidden rounded-[1.5rem] border border-border bg-surface p-5 sm:p-6"
    >
      <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">
            Controlled human outreach workflow
          </p>
          <h2 id="controlled-human-outreach-heading" className="break-words text-xl font-semibold text-primary">
            Read-only outreach preparation boundary
          </h2>
          <p id="controlled-human-outreach-summary" className="max-w-3xl break-words text-sm leading-6 text-muted">
            Human review required before any future contact. Contact is not authorized in this phase. No SMS sent. No
            email sent. No call placed. Provider activation, campaigns, runtime activation, polling, persistence, audit
            writing, and execution remain blocked.
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
        {controlledOutreachItems.map((item) => (
          <article key={item.title} className="min-w-0 rounded-2xl border border-border bg-white p-4">
            <h3 className="break-words text-sm font-semibold text-primary">{item.title}</h3>
            <p className="mt-2 break-words text-sm font-medium text-primary">{item.status}</p>
            <p className="mt-1 break-words text-sm leading-6 text-muted">{item.detail}</p>
          </article>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-950">
        <h3 className="break-words font-semibold text-blue-950">Controlled outreach boundary</h3>
        <p className="mt-1 break-words">
          This surface is advisory text only. It does not add buttons, click handlers, forms, inputs, provider controls,
          send controls, call controls, SMS controls, email controls, campaign controls, approval-to-send controls,
          polling, auto-refresh, runtime jobs, provider activation, persistence, audit writing, env reads, fetch/network
          calls, autonomous routing, autonomous outreach, or autonomous negotiation.
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
          outreachAuthorizedNow:false
        </span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">
          smsAllowedNow:false
        </span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">
          emailAllowedNow:false
        </span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">
          callAllowedNow:false
        </span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">
          campaignAllowedNow:false
        </span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">
          auditRecordsWritten:false
        </span>
      </div>
    </section>
  );
}
