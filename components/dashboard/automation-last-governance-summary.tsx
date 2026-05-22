type GovernanceItem = {
  title: string;
  status: string;
  detail: string;
};

const safetyBadges = ["Read-only", "Advisory-only", "Automation blocked", "No execution controls"];

const governanceItems: GovernanceItem[] = [
  {
    title: "Automation-last doctrine",
    status: "Automation remains last.",
    detail: "Automation readiness is governance visibility only and cannot run automation, start workflows, or route work.",
  },
  {
    title: "Intelligence boundary",
    status: "Intelligence does not grant permission.",
    detail: "Scores, recommendations, revenue signals, and AI guidance stay advisory and cannot become action permission.",
  },
  {
    title: "Approval boundary",
    status: "Approval does not grant execution.",
    detail: "Approval status remains separate from sending, calling, provider activation, campaigns, and workflow execution.",
  },
  {
    title: "Readiness boundary",
    status: "Readiness does not grant execution.",
    detail: "Readiness labels do not send now, call now, launch campaigns, activate providers, or start runtime work.",
  },
  {
    title: "Queue priority boundary",
    status: "Queue priority does not grant execution.",
    detail: "Queue pressure and operator priority remain manual review labels and do not trigger workflows.",
  },
  {
    title: "Urgency and revenue boundary",
    status: "Urgency and revenue opportunity do not grant execution.",
    detail: "Urgent or high-value signals may deserve human attention but cannot activate autonomous escalation.",
  },
  {
    title: "Provider and runtime boundary",
    status: "Provider activation and runtime activation remain blocked.",
    detail: "No Twilio, email, SMS, polling, background worker, runtime job, provider call, or campaign is enabled here.",
  },
  {
    title: "Governance stop dominance",
    status: "Governance stop signals must be resolved first.",
    detail: "Governance stops outrank automation readiness, approval status, AI recommendation, urgency, and revenue opportunity.",
  },
];

export function AutomationLastGovernanceSummary() {
  return (
    <section
      aria-labelledby="automation-last-governance-heading"
      aria-describedby="automation-last-governance-summary"
      className="overflow-hidden rounded-[1.5rem] border border-border bg-surface p-5 sm:p-6"
    >
      <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">
            Automation-last governance
          </p>
          <h2 id="automation-last-governance-heading" className="break-words text-xl font-semibold text-primary">
            Read-only automation boundary summary
          </h2>
          <p id="automation-last-governance-summary" className="max-w-3xl break-words text-sm leading-6 text-muted">
            Automation remains last. Intelligence does not grant permission. Approval does not grant execution.
            Provider activation, runtime activation, polling, campaigns, and execution remain blocked.
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
        {governanceItems.map((item) => (
          <article key={item.title} className="min-w-0 rounded-2xl border border-border bg-white p-4">
            <h3 className="break-words text-sm font-semibold text-primary">{item.title}</h3>
            <p className="mt-2 break-words text-sm font-medium text-primary">{item.status}</p>
            <p className="mt-1 break-words text-sm leading-6 text-muted">{item.detail}</p>
          </article>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-950">
        <h3 className="break-words font-semibold text-blue-950">Automation-last safety posture</h3>
        <p className="mt-1 break-words">
          This surface is advisory text only. It does not add buttons, execution controls, provider controls, send
          controls, approval-to-send controls, workflow controls, campaign controls, polling, auto-refresh, runtime
          activation, automation-agent activation, autonomous routing, autonomous outreach, or autonomous negotiation.
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
          pollingAllowed:false
        </span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">
          runtimeActivationAllowed:false
        </span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">
          approvalGrantsExecution:false
        </span>
      </div>
    </section>
  );
}
