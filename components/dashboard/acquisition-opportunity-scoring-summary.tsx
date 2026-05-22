type AcquisitionScoreItem = {
  title: string;
  status: string;
  detail: string;
};

const safetyBadges = ["Read-only", "Scoring advisory", "No lead creation", "Providers blocked"];

const acquisitionScoreItems: AcquisitionScoreItem[] = [
  {
    title: "Opportunity score categories",
    status: "Acquisition scores are advisory only.",
    detail:
      "Future score categories may describe manual review fit, distress weight, buyer-demand alignment, neighborhood fit, and risk/reward signals.",
  },
  {
    title: "Confidence limitations",
    status: "Scores may be uncertain and confidence may be limited.",
    detail:
      "Scoring visibility cannot become a verified property fact, execution permission, acquisition instruction, or lead-creation trigger.",
  },
  {
    title: "Missing-data blockers",
    status: "Missing data may affect scoring.",
    detail:
      "Missing address, source, condition, seller context, buyer demand, or review data should reduce confidence, not trigger scraping or enrichment.",
  },
  {
    title: "Lead creation boundary",
    status: "No lead creation is authorized.",
    detail:
      "Acquisition scores, high scores, opportunity fit, buyer-demand alignment, and distress weight cannot create leads or persist opportunities.",
  },
  {
    title: "Owner contact boundary",
    status: "No owner contact, skip tracing, or outreach is authorized.",
    detail:
      "Scores cannot call, text, email, skip trace, contact owners, launch campaigns, or send messages.",
  },
  {
    title: "Data and provider boundary",
    status: "No scraping, external APIs, or provider activation is authorized.",
    detail:
      "No provider client is created, no credentials or env vars are read, and no fetch/network path is reachable from this surface.",
  },
];

export function AcquisitionOpportunityScoringSummary() {
  return (
    <section
      aria-labelledby="acquisition-opportunity-scoring-heading"
      aria-describedby="acquisition-opportunity-scoring-summary"
      className="overflow-hidden rounded-[1.5rem] border border-border bg-surface p-5 sm:p-6"
    >
      <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">
            Acquisition opportunity scoring
          </p>
          <h2 id="acquisition-opportunity-scoring-heading" className="break-words text-xl font-semibold text-primary">
            Read-only scoring review
          </h2>
          <p id="acquisition-opportunity-scoring-summary" className="max-w-3xl break-words text-sm leading-6 text-muted">
            Acquisition scoring is advisory only. Scores may be uncertain, confidence may be limited, and missing data
            may affect review. Lead creation, owner contact, skip tracing, scraping, external APIs, provider
            activation, persistence, polling, audit writing, campaigns, automation, and execution remain blocked.
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
        {acquisitionScoreItems.map((item) => (
          <article key={item.title} className="min-w-0 rounded-2xl border border-border bg-white p-4">
            <h3 className="break-words text-sm font-semibold text-primary">{item.title}</h3>
            <p className="mt-2 break-words text-sm font-medium text-primary">{item.status}</p>
            <p className="mt-1 break-words text-sm leading-6 text-muted">{item.detail}</p>
          </article>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-950">
        <h3 className="break-words font-semibold text-blue-950">Acquisition scoring boundary</h3>
        <p className="mt-1 break-words">
          This surface is advisory text only. It does not add buttons, click handlers, forms, inputs, lead creation,
          scraping, skip tracing, owner contact, external APIs, fetch/network calls, provider activation, outreach,
          persistence, audit writing, polling, automation, campaigns, or execution.
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
          scoringGrantsExecution:false
        </span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">
          leadCreationAllowed:false
        </span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">
          ownerContactAllowed:false
        </span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">
          skipTracingAllowed:false
        </span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">
          providerCalled:false
        </span>
      </div>
    </section>
  );
}
