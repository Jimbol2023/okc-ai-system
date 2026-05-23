import { r84AdvisoryWorkflowCategories } from "@/lib/r84-controlled-acquisition-workflow-intelligence-scope-contract";
import { r84BlockedDriftTransitions } from "@/lib/r84-controlled-acquisition-workflow-drift-risk-audit";
import { r84ReadonlyUiWording } from "@/lib/r84-controlled-acquisition-workflow-readonly-ui-scope-contract";

type WorkflowSignal = {
  title: string;
  status: string;
  detail: string;
};

const safetyBadges = ["Read-only", "Advisory only", "Manual review", "No execution"];

const workflowSignals: WorkflowSignal[] = [
  {
    title: "Manual workflow sequence",
    status: r84ReadonlyUiWording.manualSequence,
    detail: "Sequence visibility can help an operator decide which review area to inspect first. It does not assign work, mutate records, or start a job.",
  },
  {
    title: "Bottleneck visibility",
    status: r84ReadonlyUiWording.bottleneck,
    detail: "Bottleneck labels can highlight missing decisions, delayed reviews, or blocked readiness without provider activation or external lookup.",
  },
  {
    title: "Stalled workflow review",
    status: r84ReadonlyUiWording.stalledWorkflow,
    detail: "Stalled labels are review signals only. They do not scrape records, skip trace, fetch data, create leads, or contact anyone.",
  },
  {
    title: "Throughput opportunity",
    status: r84ReadonlyUiWording.throughputVisibility,
    detail: "Throughput visibility may reveal manual review order issues while runtime jobs, polling, persistence, and audit writing remain blocked.",
  },
  {
    title: "Human decision required",
    status: r84ReadonlyUiWording.manualReviewOnly,
    detail: "Human decision required before any real-world action. R84 does not grant permission to call, text, email, negotiate, verify, or execute.",
  },
  {
    title: "Execution boundary",
    status: r84ReadonlyUiWording.noExecution,
    detail: `${r84ReadonlyUiWording.noProvider} ${r84ReadonlyUiWording.noContact}`,
  },
];

function formatCategory(value: string) {
  return value.replaceAll("-", " ");
}

export function ControlledAcquisitionWorkflowIntelligenceSummary() {
  return (
    <section
      aria-labelledby="controlled-acquisition-workflow-heading"
      aria-describedby="controlled-acquisition-workflow-summary"
      className="overflow-hidden rounded-[1.5rem] border border-border bg-surface p-5 sm:p-6"
    >
      <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">
            Controlled acquisition workflow intelligence
          </p>
          <h2 id="controlled-acquisition-workflow-heading" className="break-words text-xl font-semibold text-primary">
            Manual workflow review visibility
          </h2>
          <p id="controlled-acquisition-workflow-summary" className="max-w-3xl break-words text-sm leading-6 text-muted">
            {r84ReadonlyUiWording.workflowIntelligence} It helps operators review manual sequence, bottlenecks,
            stalled workflows, missing data, throughput opportunity, revenue delay risk, and human-decision needs. No
            provider, contact, outreach, automation, lead creation, scraping, skip tracing, MLS/public-record behavior,
            fetch/network behavior, runtime job, polling, persistence, audit writing, or execution is authorized.
          </p>
        </div>
        <div className="flex max-w-full flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.1em]">
          {safetyBadges.map((badge) => (
            <span key={badge} className="max-w-full break-words rounded-full border border-border bg-white px-3 py-1 text-center leading-5 text-primary">
              {badge}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
        {workflowSignals.map((item) => (
          <article key={item.title} className="min-w-0 rounded-2xl border border-border bg-white p-4">
            <h3 className="break-words text-sm font-semibold text-primary">{item.title}</h3>
            <p className="mt-2 break-words text-sm font-medium text-primary">{item.status}</p>
            <p className="mt-1 break-words text-sm leading-6 text-muted">{item.detail}</p>
          </article>
        ))}
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div className="min-w-0 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-950">
          <h3 className="break-words font-semibold text-blue-950">Advisory workflow categories</h3>
          <div className="mt-3 flex max-w-full flex-wrap gap-2">
            {r84AdvisoryWorkflowCategories.map((category) => (
              <span key={category} className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 text-xs font-bold leading-5 text-blue-950">
                {formatCategory(category)}
              </span>
            ))}
          </div>
        </div>
        <div className="min-w-0 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-950">
          <h3 className="break-words font-semibold text-blue-950">Workflow drift boundary</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {r84BlockedDriftTransitions.slice(0, 7).map((transition) => (
              <li key={transition} className="break-words">
                {transition}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 flex max-w-full flex-wrap gap-2 text-xs font-bold">
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">readOnly:true</span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">advisoryOnly:true</span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">simulationOnly:true</span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">providerCalled:false</span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">sent:false</span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">persistenceAllowedNow:false</span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">pollingAllowed:false</span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">runtimeActivationAllowed:false</span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">providerActivationAllowed:false</span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">approvalGrantsExecution:false</span>
      </div>
    </section>
  );
}
