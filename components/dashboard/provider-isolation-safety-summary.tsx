type ProviderIsolationItem = {
  title: string;
  status: string;
  detail: string;
};

const safetyBadges = ["Read-only", "Providers blocked", "No env reads", "No fetch/network"];

const providerIsolationItems: ProviderIsolationItem[] = [
  {
    title: "Provider isolation doctrine",
    status: "Provider readiness is advisory only.",
    detail:
      "Provider readiness can support future review, but it cannot activate Twilio, email, SMS, calls, campaigns, or workflows.",
  },
  {
    title: "Provider activation boundary",
    status: "Provider activation remains blocked.",
    detail:
      "No provider is called, no provider client is created, no provider test is run, and no send path is reachable from this dashboard.",
  },
  {
    title: "Credential and env boundary",
    status: "No provider credentials or provider env vars are accessed.",
    detail:
      "This surface does not read secrets, provider credentials, environment variables, account tokens, or messaging configuration.",
  },
  {
    title: "Network boundary",
    status: "No fetch/network call is created.",
    detail:
      "Provider isolation visibility is static advisory UI only and cannot reach external services, APIs, webhooks, or provider endpoints.",
  },
  {
    title: "Runtime and polling boundary",
    status: "Runtime activation and polling remain blocked.",
    detail:
      "No runtime job, background worker, polling loop, auto-refresh, execution queue, workflow runner, or automation agent is created.",
  },
  {
    title: "Persistence and audit boundary",
    status: "Audit layer not active yet.",
    detail:
      "Audit persistence is not authorized now. Provider audit doctrine is future-facing only, and no audit records are written in this phase.",
  },
  {
    title: "Approval boundary",
    status: "Approval never triggers providers.",
    detail:
      "Approval labels cannot send messages, trigger provider calls, start campaigns, create runtime work, or grant provider permission.",
  },
  {
    title: "Signal boundary",
    status: "Simulation, readiness, queue, urgency, and revenue never trigger providers.",
    detail:
      "Operational signals can guide manual review only and cannot become provider activation, network access, or communication permission.",
  },
];

export function ProviderIsolationSafetySummary() {
  return (
    <section
      aria-labelledby="provider-isolation-safety-heading"
      aria-describedby="provider-isolation-safety-summary"
      className="overflow-hidden rounded-[1.5rem] border border-border bg-surface p-5 sm:p-6"
    >
      <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">
            Provider isolation and safety boundary
          </p>
          <h2 id="provider-isolation-safety-heading" className="break-words text-xl font-semibold text-primary">
            Read-only provider isolation summary
          </h2>
          <p id="provider-isolation-safety-summary" className="max-w-3xl break-words text-sm leading-6 text-muted">
            Provider activation remains blocked. No provider called. No message sent. No provider credentials accessed.
            No provider env vars read. No fetch/network call is created.
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
        {providerIsolationItems.map((item) => (
          <article key={item.title} className="min-w-0 rounded-2xl border border-border bg-white p-4">
            <h3 className="break-words text-sm font-semibold text-primary">{item.title}</h3>
            <p className="mt-2 break-words text-sm font-medium text-primary">{item.status}</p>
            <p className="mt-1 break-words text-sm leading-6 text-muted">{item.detail}</p>
          </article>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-950">
        <h3 className="break-words font-semibold text-blue-950">Provider safety posture</h3>
        <p className="mt-1 break-words">
          This surface is advisory text only. It does not add buttons, execution controls, provider controls, send
          controls, approval-to-send controls, workflow controls, campaign controls, polling, auto-refresh, runtime
          activation, automation-agent activation, audit writing, persistence, env reads, fetch/network calls, provider
          clients, autonomous routing, autonomous outreach, or autonomous negotiation.
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
          providerCredentialsAccessed:false
        </span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">
          providerEnvReadAllowed:false
        </span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">
          fetchNetworkAllowed:false
        </span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">
          runtimeActivationAllowed:false
        </span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">
          pollingAllowed:false
        </span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">
          auditRecordsWritten:false
        </span>
      </div>
    </section>
  );
}
