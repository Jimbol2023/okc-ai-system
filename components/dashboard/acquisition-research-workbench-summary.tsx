type AcquisitionResearchWorkbenchItem = {
  title: string;
  status: string;
  detail: string;
};

const safetyBadges = ["Read-only", "Research advisory", "No sourcing", "No contacts"];

const researchItems: AcquisitionResearchWorkbenchItem[] = [
  {
    title: "Research categories",
    status: "Acquisition Research Workbench is advisory only.",
    detail:
      "Future research visibility may organize acquisition summaries, distress research, neighborhood patterns, buyer-demand alignment, and manual checkpoints.",
  },
  {
    title: "Uncertainty and confidence",
    status: "Research may be uncertain and confidence may be limited.",
    detail:
      "Research summaries are future review prompts only. They do not confirm property facts, owner identity, buyer demand, or acquisition readiness.",
  },
  {
    title: "Missing data",
    status: "Missing data and governance-blocked research require manual review.",
    detail:
      "Missing research context cannot trigger scraping, geocoding, map crawling, public-record crawling, enrichment, provider activation, persistence, or external APIs.",
  },
  {
    title: "Data sourcing boundary",
    status: "No scraping, geocoding, map crawling, Street View automation, or external APIs are authorized.",
    detail:
      "This surface does not include research execution controls, scraping links, geocoding controls, map controls, fetch/network calls, or automated research behavior.",
  },
  {
    title: "Contact and lead boundary",
    status: "No lead creation, owner contact, buyer contact, seller contact, skip tracing, or campaigns are authorized.",
    detail:
      "Research cannot call, text, email, skip trace, create leads, contact owners, contact buyers, contact sellers, blast deals, or launch campaigns.",
  },
  {
    title: "Provider boundary",
    status: "Provider activation remains blocked.",
    detail:
      "No provider client is created, no credentials or env vars are read, and no fetch/network path is reachable from this surface.",
  },
];

export function AcquisitionResearchWorkbenchSummary() {
  return (
    <section
      aria-labelledby="acquisition-research-workbench-heading"
      aria-describedby="acquisition-research-workbench-summary"
      className="overflow-hidden rounded-[1.5rem] border border-border bg-surface p-5 sm:p-6"
    >
      <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">
            Acquisition research workbench
          </p>
          <h2 id="acquisition-research-workbench-heading" className="break-words text-xl font-semibold text-primary">
            Read-only research checkpoint review
          </h2>
          <p id="acquisition-research-workbench-summary" className="max-w-3xl break-words text-sm leading-6 text-muted">
            Acquisition research visibility is advisory only. Research may be uncertain, confidence may be limited, and
            data may be missing. Scraping, geocoding, map crawling, Street View automation, external APIs, lead creation,
            owner contact, buyer contact, seller contact, skip tracing, campaigns, provider activation, persistence,
            polling, audit writing, automation, and execution remain blocked.
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
        {researchItems.map((item) => (
          <article key={item.title} className="min-w-0 rounded-2xl border border-border bg-white p-4">
            <h3 className="break-words text-sm font-semibold text-primary">{item.title}</h3>
            <p className="mt-2 break-words text-sm font-medium text-primary">{item.status}</p>
            <p className="mt-1 break-words text-sm leading-6 text-muted">{item.detail}</p>
          </article>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-950">
        <h3 className="break-words font-semibold text-blue-950">Acquisition research boundary</h3>
        <p className="mt-1 break-words">
          This surface is advisory text only. It does not add buttons, click handlers, forms, inputs, research execution
          controls, scraping, geocoding, map crawling, Street View automation, external APIs, fetch/network calls, skip
          tracing, lead creation, owner contact, buyer contact, seller contact, campaigns, provider activation,
          persistence, audit writing, polling, automation, or execution.
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
          scrapingAllowed:false
        </span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">
          geocodingAllowed:false
        </span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">
          leadCreationAllowed:false
        </span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">
          ownerContactAllowed:false
        </span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">
          providerCalled:false
        </span>
      </div>
    </section>
  );
}
