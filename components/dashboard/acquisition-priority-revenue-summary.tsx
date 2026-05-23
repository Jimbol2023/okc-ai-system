import {
  r83AdvisoryPriorityCategories,
} from "@/lib/r83-acquisition-priority-revenue-scoring-scope-contract";
import {
  r83BlockedDriftTransitions,
} from "@/lib/r83-acquisition-priority-revenue-drift-risk-audit";
import {
  r83ReadonlyUiWording,
} from "@/lib/r83-acquisition-priority-revenue-readonly-ui-scope-contract";

type PriorityRevenueItem = {
  title: string;
  status: string;
  detail: string;
};

const safetyBadges = ["Read-only", "Revenue advisory", "Manual review", "No execution"];

const priorityItems: PriorityRevenueItem[] = [
  {
    title: "Revenue scoring",
    status: r83ReadonlyUiWording.revenueScoring,
    detail: "Revenue labels can help compare lead attention, opportunity strength, near-close potential, and throughput pressure without triggering outreach.",
  },
  {
    title: "Acquisition priority",
    status: r83ReadonlyUiWording.acquisitionPriority,
    detail: "Priority labels are operator review prompts only. They do not rank work automatically, assign owners, mutate leads, or create tasks.",
  },
  {
    title: "Urgency and decay",
    status: r83ReadonlyUiWording.urgency,
    detail: `${r83ReadonlyUiWording.decay} Decay visibility cannot scrape, enrich, skip trace, fetch data, or activate a provider.`,
  },
  {
    title: "Opportunity and blockers",
    status: r83ReadonlyUiWording.highOpportunity,
    detail: r83ReadonlyUiWording.blockedReviewNeeded,
  },
  {
    title: "Contact boundary",
    status: r83ReadonlyUiWording.noContact,
    detail: "No owner contact, buyer contact, seller contact, outreach, call, text, email, campaign, or automation path is authorized.",
  },
  {
    title: "Execution boundary",
    status: r83ReadonlyUiWording.noExecution,
    detail: `${r83ReadonlyUiWording.noProvider} No runtime jobs, polling, persistence, audit writing, fetch/network behavior, or execution is authorized.`,
  },
];

function formatCategory(value: string) {
  return value.replaceAll("-", " ");
}

export function AcquisitionPriorityRevenueSummary() {
  return (
    <section
      aria-labelledby="acquisition-priority-revenue-heading"
      aria-describedby="acquisition-priority-revenue-summary"
      className="overflow-hidden rounded-[1.5rem] border border-border bg-surface p-5 sm:p-6"
    >
      <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">
            Acquisition priority and revenue scoring
          </p>
          <h2 id="acquisition-priority-revenue-heading" className="break-words text-xl font-semibold text-primary">
            Read-only revenue priority review
          </h2>
          <p id="acquisition-priority-revenue-summary" className="max-w-3xl break-words text-sm leading-6 text-muted">
            Acquisition priority and revenue scoring visibility is advisory only. It helps operators review lead urgency,
            decay, opportunity strength, near-close potential, blocked status, and low-confidence status. Priority scores,
            revenue scores, urgency, and close probability do not authorize outreach, provider activation, automation,
            lead creation, scraping, skip tracing, fetch/network behavior, persistence, audit writing, runtime jobs,
            polling, or execution.
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
        {priorityItems.map((item) => (
          <article key={item.title} className="min-w-0 rounded-2xl border border-border bg-white p-4">
            <h3 className="break-words text-sm font-semibold text-primary">{item.title}</h3>
            <p className="mt-2 break-words text-sm font-medium text-primary">{item.status}</p>
            <p className="mt-1 break-words text-sm leading-6 text-muted">{item.detail}</p>
          </article>
        ))}
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div className="min-w-0 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-950">
          <h3 className="break-words font-semibold text-blue-950">Advisory revenue categories</h3>
          <div className="mt-3 flex max-w-full flex-wrap gap-2">
            {r83AdvisoryPriorityCategories.map((category) => (
              <span key={category} className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 text-xs font-bold leading-5 text-blue-950">
                {formatCategory(category)}
              </span>
            ))}
          </div>
        </div>
        <div className="min-w-0 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-950">
          <h3 className="break-words font-semibold text-blue-950">Revenue scoring drift boundary</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {r83BlockedDriftTransitions.slice(0, 6).map((transition) => (
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
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">runtimeActivationAllowed:false</span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">approvalGrantsExecution:false</span>
      </div>
    </section>
  );
}
