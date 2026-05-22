type ProviderReadinessItem = {
  title: string;
  status: string;
  detail: string;
};

const safetyBadges = ["Read-only", "Readiness advisory", "Activation blocked", "No provider controls"];

const providerReadinessItems: ProviderReadinessItem[] = [
  {
    title: "Provider readiness",
    status: "Provider readiness is advisory only.",
    detail:
      "Readiness visibility can help operators understand future prerequisites, but it cannot activate providers, create clients, or reach networks.",
  },
  {
    title: "Governance prerequisites",
    status: "Governance review required first.",
    detail:
      "Governance stops outrank provider readiness, revenue pressure, urgency, queue priority, AI recommendation, approval status, simulation readiness, and preview readiness.",
  },
  {
    title: "Future kill switch",
    status: "Future kill switch required before activation.",
    detail:
      "Any future provider activation would require a separate kill-switch doctrine before providers could ever be reachable.",
  },
  {
    title: "Future audit prerequisite",
    status: "Audit layer not active yet.",
    detail:
      "Future audit logging would be required before provider activation could be considered. No audit records are written in this phase.",
  },
  {
    title: "Provider client boundary",
    status: "No provider client created.",
    detail:
      "This surface does not create Twilio, email, SMS, calling, enrichment, network, or provider client objects.",
  },
  {
    title: "Credential boundary",
    status: "No credential or env read.",
    detail:
      "Provider credentials and environment variables remain untouched. Readiness review cannot inspect secrets or configuration.",
  },
  {
    title: "Network boundary",
    status: "No fetch/network call.",
    detail:
      "Provider readiness visibility is static dashboard text only and cannot perform fetches, API calls, polling, or background work.",
  },
  {
    title: "Execution boundary",
    status: "Execution remains blocked.",
    detail:
      "Provider readiness cannot send, call, text, email, launch campaigns, start workflows, run automation, persist data, or execute runtime jobs.",
  },
];

export function ProviderActivationReadinessSummary() {
  return (
    <section
      aria-labelledby="provider-activation-readiness-heading"
      aria-describedby="provider-activation-readiness-summary"
      className="overflow-hidden rounded-[1.5rem] border border-border bg-surface p-5 sm:p-6"
    >
      <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">
            Controlled provider activation readiness
          </p>
          <h2 id="provider-activation-readiness-heading" className="break-words text-xl font-semibold text-primary">
            Read-only provider readiness prerequisites
          </h2>
          <p id="provider-activation-readiness-summary" className="max-w-3xl break-words text-sm leading-6 text-muted">
            Provider readiness is advisory only. Provider activation is not authorized in this phase. No provider client
            is created, no credential or env variable is read, no fetch/network call is made, no SMS is sent, no email is
            sent, no call is placed, and execution remains blocked.
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
        {providerReadinessItems.map((item) => (
          <article key={item.title} className="min-w-0 rounded-2xl border border-border bg-white p-4">
            <h3 className="break-words text-sm font-semibold text-primary">{item.title}</h3>
            <p className="mt-2 break-words text-sm font-medium text-primary">{item.status}</p>
            <p className="mt-1 break-words text-sm leading-6 text-muted">{item.detail}</p>
          </article>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-950">
        <h3 className="break-words font-semibold text-blue-950">Provider readiness boundary</h3>
        <p className="mt-1 break-words">
          This surface is advisory text only. It does not add buttons, click handlers, forms, inputs, provider controls,
          activation controls, send controls, call controls, SMS controls, email controls, polling, auto-refresh,
          runtime jobs, provider activation, provider clients, credential reads, env reads, fetch/network calls,
          persistence, audit writing, campaigns, automation, autonomous outreach, or execution.
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
          providerActivationAllowed:false
        </span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">
          providerClientAllowed:false
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
          auditRecordsWritten:false
        </span>
      </div>
    </section>
  );
}
