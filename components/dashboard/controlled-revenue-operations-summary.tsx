import { r86AdvisoryRevenueOperationsCategories } from "@/lib/r86-controlled-revenue-operations-scope-contract";
import { r86BlockedDriftTransitions } from "@/lib/r86-controlled-revenue-operations-drift-risk-audit";
import { r86ReadonlyUiWording } from "@/lib/r86-controlled-revenue-operations-readonly-ui-scope-contract";

type RevenueOperationsSignal = {
  title: string;
  status: string;
  detail: string;
};

const safetyBadges = ["Read-only", "Advisory only", "Manual review", "No provider"];

const revenueSignals: RevenueOperationsSignal[] = [
  {
    title: "Revenue review visibility",
    status: r86ReadonlyUiWording.manualReview,
    detail: "Revenue review labels help humans inspect opportunity timing, incomplete signals, blocked paths, and low-confidence revenue data without changing records.",
  },
  {
    title: "Throughput bottleneck",
    status: r86ReadonlyUiWording.throughput,
    detail: "Throughput bottlenecks may show where deal-flow clarity needs human attention. Runtime jobs, polling, and automation remain blocked.",
  },
  {
    title: "Manual pipeline clarity",
    status: r86ReadonlyUiWording.pipelineOptimization,
    detail: "Pipeline review visibility can support manual coordination across assignment, closing, and deal-flow stages without provider behavior.",
  },
  {
    title: "Revenue delay risk",
    status: r86ReadonlyUiWording.revenueDelay,
    detail: "Revenue-delay labels are advisory only. They do not contact buyers or sellers, activate providers, or start workflows.",
  },
  {
    title: "Assignment and closing readiness",
    status: r86ReadonlyUiWording.assignmentReadiness,
    detail: `${r86ReadonlyUiWording.closingReadiness} Human review required before any real-world action.`,
  },
  {
    title: "Governance boundary",
    status: r86ReadonlyUiWording.governance,
    detail: `${r86ReadonlyUiWording.noExecution} ${r86ReadonlyUiWording.noProvider} ${r86ReadonlyUiWording.noContact}`,
  },
];

function formatCategory(value: string) {
  return value.replaceAll("-", " ");
}

export function ControlledRevenueOperationsSummary() {
  return (
    <section
      aria-labelledby="controlled-revenue-operations-heading"
      aria-describedby="controlled-revenue-operations-summary"
      className="overflow-hidden rounded-[1.5rem] border border-border bg-surface p-5 sm:p-6"
    >
      <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">
            Controlled revenue operations
          </p>
          <h2 id="controlled-revenue-operations-heading" className="break-words text-xl font-semibold text-primary">
            Read-only revenue operations intelligence
          </h2>
          <p id="controlled-revenue-operations-summary" className="max-w-3xl break-words text-sm leading-6 text-muted">
            {r86ReadonlyUiWording.revenueOperations} It helps operators review revenue opportunities, throughput
            bottlenecks, deal-flow delay risk, assignment readiness, closing readiness, incomplete revenue data, manual
            pipeline review needs, and governance review needs. No execution, provider activation, outreach, automation,
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
        {revenueSignals.map((item) => (
          <article key={item.title} className="min-w-0 rounded-2xl border border-border bg-white p-4">
            <h3 className="break-words text-sm font-semibold text-primary">{item.title}</h3>
            <p className="mt-2 break-words text-sm font-medium text-primary">{item.status}</p>
            <p className="mt-1 break-words text-sm leading-6 text-muted">{item.detail}</p>
          </article>
        ))}
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div className="min-w-0 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-950">
          <h3 className="break-words font-semibold text-blue-950">Advisory revenue operations categories</h3>
          <div className="mt-3 flex max-w-full flex-wrap gap-2">
            {r86AdvisoryRevenueOperationsCategories.map((category) => (
              <span key={category} className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 text-xs font-bold leading-5 text-blue-950">
                {formatCategory(category)}
              </span>
            ))}
          </div>
        </div>
        <div className="min-w-0 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-950">
          <h3 className="break-words font-semibold text-blue-950">Revenue operations drift boundary</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {r86BlockedDriftTransitions.slice(0, 7).map((transition) => (
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
