import {
  r82ReadinessCategories,
  r82WarningCategories,
} from "@/lib/r82-acquisition-data-verification-readiness-scope-contract";
import {
  r82BlockedDriftTransitions,
} from "@/lib/r82-acquisition-data-verification-drift-risk-audit";
import {
  r82ReadonlyUiWording,
} from "@/lib/r82-acquisition-data-verification-readonly-ui-scope-contract";

type VerificationReadinessItem = {
  title: string;
  status: string;
  detail: string;
};

const safetyBadges = ["Read-only", "Advisory-only", "Manual review", "No live verification"];

const readinessItems: VerificationReadinessItem[] = [
  {
    title: "Completeness categories",
    status: r82ReadonlyUiWording.completeness,
    detail:
      "Review categories include seller identity, property location, property condition, financial inputs, and human review readiness. These labels never create leads or trigger sourcing.",
  },
  {
    title: "Consistency warnings",
    status: r82ReadonlyUiWording.consistency,
    detail:
      "Internal conflicts may be shown for ownership claims, property details, acquisition intent, or contact permission. Conflicts remain manual-review prompts only.",
  },
  {
    title: "Missing data warnings",
    status: r82ReadonlyUiWording.missingData,
    detail:
      "Missing seller, property, or acquisition data stays visible as a warning. It cannot trigger scraping, skip tracing, MLS access, public-record crawling, provider use, or contact.",
  },
  {
    title: "Unverifiable data warnings",
    status: r82ReadonlyUiWording.unverifiableData,
    detail:
      "Unverifiable claims are not validated externally here. No external API, fetch/network call, live verification, owner lookup, or provider activation is authorized.",
  },
  {
    title: "Manual review boundary",
    status: r82ReadonlyUiWording.manualReviewOnly,
    detail:
      "Readiness visibility may improve operator review speed, but it does not approve acquisition action, outreach, lead creation, audit writing, persistence, or execution.",
  },
  {
    title: "Provider and execution boundary",
    status: r82ReadonlyUiWording.providerBlocked,
    detail:
      "Verification readiness cannot activate providers, call Twilio, create jobs, poll records, write audit logs, mutate records, or execute acquisition workflows.",
  },
];

function formatCategory(value: string) {
  return value.replaceAll("_", " ");
}

export function AcquisitionDataVerificationReadinessSummary() {
  return (
    <section
      aria-labelledby="acquisition-data-verification-heading"
      aria-describedby="acquisition-data-verification-summary"
      className="overflow-hidden rounded-[1.5rem] border border-border bg-surface p-5 sm:p-6"
    >
      <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">
            Acquisition data verification readiness
          </p>
          <h2 id="acquisition-data-verification-heading" className="break-words text-xl font-semibold text-primary">
            Read-only verification readiness review
          </h2>
          <p id="acquisition-data-verification-summary" className="max-w-3xl break-words text-sm leading-6 text-muted">
            Acquisition data verification readiness is advisory only. It helps operators see whether seller, property,
            and acquisition data may be complete, internally consistent, review-ready, or missing. No live verification,
            scraping, skip tracing, MLS access, public-record crawling, external APIs, owner lookup, contact, provider
            activation, persistence, audit writing, polling, automation, lead creation, or execution is authorized.
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

      <div className="mt-5 grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
        {readinessItems.map((item) => (
          <article key={item.title} className="min-w-0 rounded-2xl border border-border bg-white p-4">
            <h3 className="break-words text-sm font-semibold text-primary">{item.title}</h3>
            <p className="mt-2 break-words text-sm font-medium text-primary">{item.status}</p>
            <p className="mt-1 break-words text-sm leading-6 text-muted">{item.detail}</p>
          </article>
        ))}
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div className="min-w-0 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-950">
          <h3 className="break-words font-semibold text-blue-950">Readiness and warning categories</h3>
          <div className="mt-3 flex max-w-full flex-wrap gap-2">
            {[...r82ReadinessCategories, ...r82WarningCategories].map((category) => (
              <span
                key={category}
                className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 text-xs font-bold leading-5 text-blue-950"
              >
                {formatCategory(category)}
              </span>
            ))}
          </div>
        </div>

        <div className="min-w-0 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-950">
          <h3 className="break-words font-semibold text-blue-950">Verification drift boundary</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {r82BlockedDriftTransitions.slice(0, 6).map((transition) => (
              <li key={transition} className="break-words">
                {transition}
              </li>
            ))}
          </ul>
        </div>
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
          persistenceAllowedNow:false
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
