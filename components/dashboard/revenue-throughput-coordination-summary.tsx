import { r88AdvisoryThroughputCoordinationCategories } from "@/lib/r88-revenue-throughput-coordination-scope-contract";
import { r88BlockedDriftTransitions } from "@/lib/r88-revenue-throughput-coordination-drift-risk-audit";
import { r88ReadonlyUiWording } from "@/lib/r88-revenue-throughput-coordination-readonly-ui-scope-contract";

type ThroughputCoordinationSignal = {
  title: string;
  status: string;
  detail: string;
};

const safetyBadges = ["Read-only", "Advisory only", "Manual review", "No provider"];

const throughputSignals: ThroughputCoordinationSignal[] = [
  {
    title: "Manual throughput review",
    status: r88ReadonlyUiWording.manualReview,
    detail: "Manual throughput labels help humans inspect workflow friction, blocked revenue paths, and low-confidence high-opportunity throughput areas without changing records.",
  },
  {
    title: "Acquisition velocity visibility",
    status: r88ReadonlyUiWording.throughput,
    detail: `${r88ReadonlyUiWording.acquisitionVelocity} Runtime jobs, polling, and automation remain blocked.`,
  },
  {
    title: "Revenue bottleneck intelligence",
    status: r88ReadonlyUiWording.bottleneck,
    detail: "Bottleneck visibility can support manual coordination across delayed revenue paths, stalled throughput, and blocked revenue paths without provider behavior.",
  },
  {
    title: "Manual sequencing review",
    status: r88ReadonlyUiWording.manualSequencing,
    detail: "Sequencing labels are advisory only. They do not contact buyers or sellers, activate providers, or start workflows.",
  },
  {
    title: "Assignment and closing delay risk",
    status: r88ReadonlyUiWording.assignmentClosingDelay,
    detail: "Human review required before any operational action.",
  },
  {
    title: "Governance boundary",
    status: r88ReadonlyUiWording.governance,
    detail: `${r88ReadonlyUiWording.noExecution} ${r88ReadonlyUiWording.noProvider} ${r88ReadonlyUiWording.noContact}`,
  },
];

function formatCategory(value: string) {
  return value.replaceAll("-", " ");
}

export function RevenueThroughputCoordinationSummary() {
  return (
    <section
      aria-labelledby="revenue-throughput-coordination-heading"
      aria-describedby="revenue-throughput-coordination-summary"
      className="overflow-hidden rounded-[1.5rem] border border-border bg-surface p-5 sm:p-6"
    >
      <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">
            Manual revenue throughput coordination
          </p>
          <h2 id="revenue-throughput-coordination-heading" className="break-words text-xl font-semibold text-primary">
            Read-only revenue throughput coordination intelligence
          </h2>
          <p id="revenue-throughput-coordination-summary" className="max-w-3xl break-words text-sm leading-6 text-muted">
            {r88ReadonlyUiWording.throughputCoordination} It helps operators review throughput coordination,
            acquisition velocity risk, revenue bottlenecks, delayed revenue paths, sequencing review needs, assignment delay risk,
            closing delay risk, operator coordination, and governance review needs. No execution, provider activation, outreach, automation,
            lead generation, scraping, skip tracing, MLS/public-record behavior, fetch/network behavior, runtime job,
            polling, persistence, audit writing, or contact is authorized.
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
        {throughputSignals.map((item) => (
          <article key={item.title} className="min-w-0 rounded-2xl border border-border bg-white p-4">
            <h3 className="break-words text-sm font-semibold text-primary">{item.title}</h3>
            <p className="mt-2 break-words text-sm font-medium text-primary">{item.status}</p>
            <p className="mt-1 break-words text-sm leading-6 text-muted">{item.detail}</p>
          </article>
        ))}
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div className="min-w-0 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-950">
          <h3 className="break-words font-semibold text-blue-950">Advisory revenue throughput coordination categories</h3>
          <div className="mt-3 flex max-w-full flex-wrap gap-2">
            {r88AdvisoryThroughputCoordinationCategories.map((category) => (
              <span key={category} className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 text-xs font-bold leading-5 text-blue-950">
                {formatCategory(category)}
              </span>
            ))}
          </div>
        </div>
        <div className="min-w-0 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-950">
          <h3 className="break-words font-semibold text-blue-950">Throughput coordination drift boundary</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {r88BlockedDriftTransitions.slice(0, 7).map((transition) => (
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
