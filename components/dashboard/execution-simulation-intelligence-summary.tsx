type SimulationBoundaryItem = {
  title: string;
  status: string;
  detail: string;
};

const safetyBadges = ["Read-only", "Simulation-only", "No provider calls", "No audit writing"];

const simulationBoundaryItems: SimulationBoundaryItem[] = [
  {
    title: "Digital rehearsal",
    status: "Simulation result is advisory only.",
    detail:
      "The preview explains what a future action might require, but it cannot send, call, execute workflows, or activate providers.",
  },
  {
    title: "Governance stop explanation",
    status: "Governance stop signals must be resolved first.",
    detail:
      "Governance stops outrank simulation readiness, action preview, revenue opportunity, urgency, approval status, and AI recommendation.",
  },
  {
    title: "Missing prerequisites",
    status: "Human review remains required.",
    detail:
      "Any future action would require separate human review, future audit readiness, and explicit controlled-execution gates that are not active here.",
  },
  {
    title: "Provider boundary",
    status: "Provider activation remains blocked.",
    detail:
      "No Twilio, SMS, email, call, provider call, provider test, campaign, or external execution path is activated by this dashboard.",
  },
  {
    title: "Runtime boundary",
    status: "Runtime activation and polling remain blocked.",
    detail:
      "No runtime job, background worker, polling loop, auto-refresh, execution queue, workflow runner, or automation agent is created.",
  },
  {
    title: "Persistence and audit boundary",
    status: "Audit layer not active yet.",
    detail:
      "Audit persistence is not authorized now. No simulation result is persisted, and no audit records are written in this phase.",
  },
  {
    title: "Approval boundary",
    status: "Approval does not execute.",
    detail:
      "Approval labels cannot send messages, trigger providers, start workflows, create audit records, or grant execution permission.",
  },
  {
    title: "Signal boundary",
    status: "Readiness, queue, urgency, and revenue do not execute.",
    detail:
      "Operational signals can support manual review only and cannot become workflow permission, provider permission, or automation permission.",
  },
];

export function ExecutionSimulationIntelligenceSummary() {
  return (
    <section
      aria-labelledby="execution-simulation-intelligence-heading"
      aria-describedby="execution-simulation-intelligence-summary"
      className="overflow-hidden rounded-[1.5rem] border border-border bg-surface p-5 sm:p-6"
    >
      <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">
            Execution simulation intelligence
          </p>
          <h2 id="execution-simulation-intelligence-heading" className="break-words text-xl font-semibold text-primary">
            Read-only simulation boundary summary
          </h2>
          <p id="execution-simulation-intelligence-summary" className="max-w-3xl break-words text-sm leading-6 text-muted">
            Digital rehearsal only. No provider called. No message sent. No workflow executed. Runtime activation,
            polling, persistence, and audit writing remain blocked.
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
        {simulationBoundaryItems.map((item) => (
          <article key={item.title} className="min-w-0 rounded-2xl border border-border bg-white p-4">
            <h3 className="break-words text-sm font-semibold text-primary">{item.title}</h3>
            <p className="mt-2 break-words text-sm font-medium text-primary">{item.status}</p>
            <p className="mt-1 break-words text-sm leading-6 text-muted">{item.detail}</p>
          </article>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-950">
        <h3 className="break-words font-semibold text-blue-950">Simulation-only safety posture</h3>
        <p className="mt-1 break-words">
          This surface is advisory text only. It does not add buttons, execution controls, provider controls, send
          controls, approval-to-send controls, workflow controls, campaign controls, polling, auto-refresh, runtime
          activation, automation-agent activation, audit writing, persistence, autonomous routing, autonomous outreach,
          or autonomous negotiation.
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
          approvalGrantsExecution:false
        </span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">
          auditRecordsWritten:false
        </span>
      </div>
    </section>
  );
}
