import { r89AdvisoryBottleneckResolutionCategories } from "@/lib/r89-revenue-bottleneck-resolution-scope-contract";
import { r89BlockedDriftTransitions } from "@/lib/r89-revenue-bottleneck-resolution-drift-risk-audit";
import { r89ReadonlyUiWording } from "@/lib/r89-revenue-bottleneck-resolution-readonly-ui-scope-contract";

type BottleneckResolutionSignal = {
  title: string;
  status: string;
  detail: string;
};

const safetyBadges = ["Read-only", "Advisory only", "Manual review", "No provider"];

const bottleneckSignals: BottleneckResolutionSignal[] = [
  {
    title: "Manual bottleneck review",
    status: r89ReadonlyUiWording.manualReview,
    detail: "Bottleneck labels help humans inspect workflow friction, incomplete revenue paths, and low-confidence high-impact bottleneck areas without changing records.",
  },
  {
    title: "Throughput recovery visibility",
    status: r89ReadonlyUiWording.throughputRecovery,
    detail: "Recovery visibility is advisory only. Runtime jobs, polling, automation, and provider activation remain blocked.",
  },
  {
    title: "Revenue-delay classification",
    status: r89ReadonlyUiWording.revenueDelay,
    detail: "Revenue-delay labels can support manual classification before any operator action. They do not authorize outreach or execution.",
  },
  {
    title: "Manual remediation review",
    status: r89ReadonlyUiWording.remediation,
    detail: "Remediation guidance is a human review signal only and cannot become automated workflow recovery.",
  },
  {
    title: "Assignment and closing blockage",
    status: r89ReadonlyUiWording.assignmentClosingBlockage,
    detail: "Assignment and closing blockage visibility does not contact buyers, activate providers, or execute closing actions.",
  },
  {
    title: "Governance boundary",
    status: r89ReadonlyUiWording.governance,
    detail: `${r89ReadonlyUiWording.noExecution} ${r89ReadonlyUiWording.noProvider} ${r89ReadonlyUiWording.noContact}`,
  },
];

function formatCategory(value: string) {
  return value.replaceAll("-", " ");
}

export function RevenueBottleneckResolutionSummary() {
  return (
    <section
      aria-labelledby="revenue-bottleneck-resolution-heading"
      aria-describedby="revenue-bottleneck-resolution-summary"
      className="overflow-hidden rounded-[1.5rem] border border-border bg-surface p-5 sm:p-6"
    >
      <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">
            Manual revenue bottleneck resolution
          </p>
          <h2 id="revenue-bottleneck-resolution-heading" className="break-words text-xl font-semibold text-primary">
            Read-only revenue bottleneck resolution intelligence
          </h2>
          <p id="revenue-bottleneck-resolution-summary" className="max-w-3xl break-words text-sm leading-6 text-muted">
            {r89ReadonlyUiWording.bottleneckDiagnosis} It helps operators review bottleneck diagnosis,
            throughput recovery, revenue-delay classification, blocked workflow areas, assignment and closing blockage,
            manual remediation needs, recovery coordination, and governance review needs. No execution, provider activation,
            outreach, automation, lead generation, scraping, skip tracing, MLS/public-record behavior, fetch/network behavior,
            runtime job, polling, persistence, audit writing, or contact is authorized.
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
        {bottleneckSignals.map((item) => (
          <article key={item.title} className="min-w-0 rounded-2xl border border-border bg-white p-4">
            <h3 className="break-words text-sm font-semibold text-primary">{item.title}</h3>
            <p className="mt-2 break-words text-sm font-medium text-primary">{item.status}</p>
            <p className="mt-1 break-words text-sm leading-6 text-muted">{item.detail}</p>
          </article>
        ))}
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div className="min-w-0 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-950">
          <h3 className="break-words font-semibold text-blue-950">Advisory revenue bottleneck resolution categories</h3>
          <div className="mt-3 flex max-w-full flex-wrap gap-2">
            {r89AdvisoryBottleneckResolutionCategories.map((category) => (
              <span key={category} className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 text-xs font-bold leading-5 text-blue-950">
                {formatCategory(category)}
              </span>
            ))}
          </div>
        </div>
        <div className="min-w-0 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-950">
          <h3 className="break-words font-semibold text-blue-950">Bottleneck resolution drift boundary</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {r89BlockedDriftTransitions.slice(0, 7).map((transition) => (
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
