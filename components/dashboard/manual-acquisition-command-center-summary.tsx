import { r85AdvisoryCommandCenterCategories } from "@/lib/r85-manual-acquisition-command-center-scope-contract";
import { r85BlockedDriftTransitions } from "@/lib/r85-manual-acquisition-command-center-drift-risk-audit";
import { r85ReadonlyUiWording } from "@/lib/r85-manual-acquisition-command-center-readonly-ui-scope-contract";

type CommandCenterSignal = {
  title: string;
  status: string;
  detail: string;
};

const safetyBadges = ["Read-only", "Advisory only", "Human review", "Provider blocked"];

const commandCenterSignals: CommandCenterSignal[] = [
  {
    title: "Operator review priority",
    status: r85ReadonlyUiWording.operatorReview,
    detail: "Review priority can help humans decide attention order. It does not contact sellers, assign work, activate a queue, or execute an acquisition.",
  },
  {
    title: "Command center visibility",
    status: r85ReadonlyUiWording.commandCenter,
    detail: "The command center summarizes oversight readiness, coordination pressure, incomplete acquisition areas, and blocked workflow visibility without runtime behavior.",
  },
  {
    title: "Bottleneck and escalation",
    status: r85ReadonlyUiWording.escalation,
    detail: `${r85ReadonlyUiWording.bottleneck} Escalation visibility remains a manual oversight signal only.`,
  },
  {
    title: "Acquisition review coordination",
    status: r85ReadonlyUiWording.acquisitionReview,
    detail: "Coordination labels may identify seller, buyer, contract, follow-up, readiness, or governance review needs without automation.",
  },
  {
    title: "Revenue delay visibility",
    status: r85ReadonlyUiWording.revenueDelay,
    detail: "Revenue timing risk is advisory visibility only. It does not launch outreach, provider behavior, negotiation, or execution.",
  },
  {
    title: "Governance boundary",
    status: r85ReadonlyUiWording.governance,
    detail: `${r85ReadonlyUiWording.noExecution} ${r85ReadonlyUiWording.noProvider} ${r85ReadonlyUiWording.noContact}`,
  },
];

function formatCategory(value: string) {
  return value.replaceAll("-", " ");
}

export function ManualAcquisitionCommandCenterSummary() {
  return (
    <section
      aria-labelledby="manual-acquisition-command-center-heading"
      aria-describedby="manual-acquisition-command-center-summary"
      className="overflow-hidden rounded-[1.5rem] border border-border bg-surface p-5 sm:p-6"
    >
      <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">
            Manual acquisition command center
          </p>
          <h2 id="manual-acquisition-command-center-heading" className="break-words text-xl font-semibold text-primary">
            Human-reviewed acquisition readiness
          </h2>
          <p id="manual-acquisition-command-center-summary" className="max-w-3xl break-words text-sm leading-6 text-muted">
            Manual Acquisition Command Center Readiness is advisory visibility only. It helps operators review oversight
            priority, human escalation needs, workflow blocks, acquisition bottlenecks, incomplete opportunities,
            revenue-delay risk, and governance review needs. No execution, provider activation, outreach, automation,
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
        {commandCenterSignals.map((item) => (
          <article key={item.title} className="min-w-0 rounded-2xl border border-border bg-white p-4">
            <h3 className="break-words text-sm font-semibold text-primary">{item.title}</h3>
            <p className="mt-2 break-words text-sm font-medium text-primary">{item.status}</p>
            <p className="mt-1 break-words text-sm leading-6 text-muted">{item.detail}</p>
          </article>
        ))}
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div className="min-w-0 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-950">
          <h3 className="break-words font-semibold text-blue-950">Advisory command-center categories</h3>
          <div className="mt-3 flex max-w-full flex-wrap gap-2">
            {r85AdvisoryCommandCenterCategories.map((category) => (
              <span key={category} className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 text-xs font-bold leading-5 text-blue-950">
                {formatCategory(category)}
              </span>
            ))}
          </div>
        </div>
        <div className="min-w-0 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-950">
          <h3 className="break-words font-semibold text-blue-950">Command-center drift boundary</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {r85BlockedDriftTransitions.slice(0, 7).map((transition) => (
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
