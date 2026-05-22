import { StatCard } from "@/components/shared/stat-card";

type ReadinessItem = {
  title: string;
  status: string;
  detail: string;
};

const readinessItems: ReadinessItem[] = [
  {
    title: "Governance stop dominance",
    status: "Governance stop signals must be resolved first.",
    detail:
      "Governance outranks revenue opportunity, lead quality, acquisition readiness, disposition readiness, operator priority, execution eligibility, urgency, workload pressure, and stale workflow pressure.",
  },
  {
    title: "Execution eligibility review",
    status: "Execution readiness is advisory only.",
    detail: "Readiness visibility does not execute now, send now, activate providers, launch workflows, contact sellers, contact buyers, or start automation.",
  },
  {
    title: "Approval separation",
    status: "Approval does not grant execution.",
    detail: "Approval is a review signal only and cannot send messages, trigger providers, create queues, launch campaigns, or start workflows.",
  },
  {
    title: "Provider activation boundary",
    status: "Provider activation remains blocked.",
    detail: "No Twilio, SMS, email, call, campaign, provider test, provider credential, or provider call is activated by this dashboard.",
  },
  {
    title: "Runtime activation boundary",
    status: "Runtime activation remains blocked.",
    detail: "No polling, background jobs, scheduled work, execution queues, workflow runners, or hidden state machines are enabled.",
  },
  {
    title: "Simulation-first requirement",
    status: "Simulation must precede any future action review.",
    detail: "Simulation output is advisory only and cannot mutate data, contact anyone, call providers, create jobs, or grant execution permission.",
  },
  {
    title: "Audit-before-action requirement",
    status: "Audit review must come before future action consideration.",
    detail: "Audit visibility cannot execute, queue, persist, poll, activate providers, or override governance stop signals.",
  },
  {
    title: "Manual operator confirmation",
    status: "Separate human confirmation would be required later.",
    detail: "Manual confirmation is not present here and cannot be implied by approval, eligibility, readiness, or review labels.",
  },
];

const safetyBadges = ["Read-only", "Advisory-only", "Simulation-only", "Execution blocked"];

export function ControlledExecutionReadinessSummary() {
  return (
    <section
      aria-labelledby="controlled-execution-readiness-heading"
      aria-describedby="controlled-execution-readiness-summary"
      className="rounded-[1.5rem] border border-border bg-surface p-6"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted">
            Controlled execution readiness
          </p>
          <h2 id="controlled-execution-readiness-heading" className="text-xl font-semibold text-primary">
            Read-only execution boundary summary
          </h2>
          <p id="controlled-execution-readiness-summary" className="max-w-3xl text-sm leading-6 text-muted">
            Controlled execution readiness is advisory only. Execution remains blocked. Approval does not grant
            execution. Provider activation remains blocked. Governance stop signals must be resolved first.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.1em]">
          {safetyBadges.map((badge) => (
            <span key={badge} className="rounded-full border border-border bg-white px-3 py-1 text-primary">
              {badge}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-4">
        {readinessItems.map((item) => (
          <article key={item.title} className="rounded-2xl border border-border bg-white p-4">
            <h3 className="text-sm font-semibold text-primary">{item.title}</h3>
            <p className="mt-2 text-sm font-medium text-primary">{item.status}</p>
            <p className="mt-1 text-sm leading-6 text-muted">{item.detail}</p>
          </article>
        ))}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Controlled execution readiness summary">
        <StatCard label="Execution allowed" value="false" helper="Read-only readiness visibility" />
        <StatCard label="Provider activation" value="false" helper="Blocked" />
        <StatCard label="Runtime activation" value="false" helper="Blocked" />
        <StatCard label="Approval grants execution" value="false" helper="Separated" />
      </div>

      <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-950">
        <h3 className="font-semibold text-blue-950">Controlled execution boundary</h3>
        <p className="mt-1">
          This surface is advisory text only and does not create send controls, provider controls, approval-to-send
          controls, runtime activation, polling, campaign controls, execution queues, workflow execution, background
          jobs, autonomous routing, autonomous outreach, autonomous negotiation, persistence, or hidden execution state.
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold">
        <span className="rounded border border-blue-200 bg-white px-2 py-1 text-blue-950">readOnly:true</span>
        <span className="rounded border border-blue-200 bg-white px-2 py-1 text-blue-950">advisoryOnly:true</span>
        <span className="rounded border border-blue-200 bg-white px-2 py-1 text-blue-950">simulationOnly:true</span>
        <span className="rounded border border-blue-200 bg-white px-2 py-1 text-blue-950">providerCalled:false</span>
        <span className="rounded border border-blue-200 bg-white px-2 py-1 text-blue-950">sent:false</span>
        <span className="rounded border border-blue-200 bg-white px-2 py-1 text-blue-950">pollingAllowed:false</span>
        <span className="rounded border border-blue-200 bg-white px-2 py-1 text-blue-950">
          runtimeActivationAllowed:false
        </span>
        <span className="rounded border border-blue-200 bg-white px-2 py-1 text-blue-950">
          approvalGrantsExecution:false
        </span>
      </div>
    </section>
  );
}
