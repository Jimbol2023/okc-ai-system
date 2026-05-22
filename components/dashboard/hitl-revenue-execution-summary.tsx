type HitlExecutionItem = {
  title: string;
  status: string;
  detail: string;
};

const safetyBadges = ["Read-only", "Human accountable", "No autonomous execution", "Providers blocked"];

const hitlExecutionItems: HitlExecutionItem[] = [
  {
    title: "Human accountability",
    status: "Human accountability remains required.",
    detail:
      "Future revenue execution concepts must keep a human operator accountable for high-impact decisions before any future action can be considered.",
  },
  {
    title: "Review checkpoints",
    status: "Human review required.",
    detail:
      "Review checkpoints are advisory visibility only. They do not approve, execute, send, route, escalate, or activate providers.",
  },
  {
    title: "Governance override",
    status: "Governance overrides revenue pressure.",
    detail:
      "Governance stops outrank revenue pressure, urgency, queue priority, AI recommendation, approval readiness, and provider readiness.",
  },
  {
    title: "No autonomous execution",
    status: "HITL review does not authorize autonomous execution.",
    detail:
      "Human-in-the-loop preparation cannot become autonomous sending, calling, campaigns, routing, negotiation, escalation, or workflow execution.",
  },
  {
    title: "Provider boundary",
    status: "Provider activation remains blocked.",
    detail:
      "No provider client is created, no credentials or env vars are read, and no fetch/network call is made from this surface.",
  },
  {
    title: "Communication boundary",
    status: "No send, call, text, or email action exists.",
    detail:
      "Communication preparation remains future doctrine only. This dashboard surface cannot send SMS, send email, place calls, or start outreach.",
  },
  {
    title: "Workflow boundary",
    status: "Workflow execution controls are not present.",
    detail:
      "No workflow controls, runtime jobs, polling, auto-refresh, background workers, automation, persistence, or audit writing are added.",
  },
  {
    title: "Future final approval",
    status: "Manual final approval is future doctrine only.",
    detail:
      "Any future final-approval model would require separate governance. Approval does not grant execution in this phase.",
  },
];

export function HitlRevenueExecutionSummary() {
  return (
    <section
      aria-labelledby="hitl-revenue-execution-heading"
      aria-describedby="hitl-revenue-execution-summary"
      className="overflow-hidden rounded-[1.5rem] border border-border bg-surface p-5 sm:p-6"
    >
      <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">
            Human-in-the-loop revenue execution
          </p>
          <h2 id="hitl-revenue-execution-heading" className="break-words text-xl font-semibold text-primary">
            Read-only human accountability review
          </h2>
          <p id="hitl-revenue-execution-summary" className="max-w-3xl break-words text-sm leading-6 text-muted">
            HITL preparation is advisory only. Human review and human accountability remain required. Governance
            overrides revenue pressure. Provider activation, autonomous execution, runtime activation, polling,
            persistence, audit writing, campaigns, outreach, sending, and workflow execution remain blocked.
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
        {hitlExecutionItems.map((item) => (
          <article key={item.title} className="min-w-0 rounded-2xl border border-border bg-white p-4">
            <h3 className="break-words text-sm font-semibold text-primary">{item.title}</h3>
            <p className="mt-2 break-words text-sm font-medium text-primary">{item.status}</p>
            <p className="mt-1 break-words text-sm leading-6 text-muted">{item.detail}</p>
          </article>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-950">
        <h3 className="break-words font-semibold text-blue-950">HITL execution boundary</h3>
        <p className="mt-1 break-words">
          This surface is advisory text only. It does not add buttons, click handlers, forms, inputs, provider controls,
          activation controls, send controls, approval execution controls, workflow controls, polling, auto-refresh,
          runtime jobs, provider activation, provider clients, credential reads, env reads, fetch/network calls,
          persistence, audit writing, campaigns, automation, autonomous outreach, autonomous negotiation, autonomous
          routing, autonomous escalation, or execution.
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
          autonomousExecutionAllowed:false
        </span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">
          providerActivationAllowed:false
        </span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">
          runtimeActivationAllowed:false
        </span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">
          persistenceAllowedNow:false
        </span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">
          auditRecordsWritten:false
        </span>
      </div>
    </section>
  );
}
