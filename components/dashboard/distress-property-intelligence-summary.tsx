type DistressPropertyItem = {
  title: string;
  status: string;
  detail: string;
};

const safetyBadges = ["Read-only", "Unverified signals", "Manual review only", "No lead creation"];

const distressItems: DistressPropertyItem[] = [
  {
    title: "Distress signal categories",
    status: "Distress signals are advisory only.",
    detail:
      "Future distress categories may include visible neglect, vacancy-style indicators, deferred maintenance, tax-risk style categories, code-risk style categories, and neighborhood patterns.",
  },
  {
    title: "Confidence limitations",
    status: "Signals may be unverified and confidence may be limited.",
    detail:
      "Distress visibility cannot invent property facts. Any future signal must be treated as a possible review prompt, not a verified property condition.",
  },
  {
    title: "Lead creation boundary",
    status: "No lead creation is authorized.",
    detail:
      "Distress signals, scores, vacancy indicators, tax-risk categories, and neighborhood patterns cannot create leads or persist records.",
  },
  {
    title: "Owner contact boundary",
    status: "No owner contact, skip tracing, or outreach is authorized.",
    detail:
      "No signal can call, text, email, skip trace, contact an owner, launch a campaign, or trigger outreach.",
  },
  {
    title: "Data sourcing boundary",
    status: "No scraping, map crawling, Street View automation, or external APIs are authorized.",
    detail:
      "This surface does not scrape public records, crawl maps, automate Street View, call APIs, fetch network data, or crawl code-violation sources.",
  },
  {
    title: "Provider boundary",
    status: "Provider activation remains blocked.",
    detail:
      "No provider client is created, no credentials or env vars are read, and no external provider path is reachable from this surface.",
  },
];

export function DistressPropertyIntelligenceSummary() {
  return (
    <section
      aria-labelledby="distress-property-intelligence-heading"
      aria-describedby="distress-property-intelligence-summary"
      className="overflow-hidden rounded-[1.5rem] border border-border bg-surface p-5 sm:p-6"
    >
      <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">
            Distress property intelligence
          </p>
          <h2 id="distress-property-intelligence-heading" className="break-words text-xl font-semibold text-primary">
            Read-only distress signal review
          </h2>
          <p id="distress-property-intelligence-summary" className="max-w-3xl break-words text-sm leading-6 text-muted">
            Distress Property Intelligence is advisory only. Signals may be unverified and confidence may be limited.
            Manual review is required before any future research. Lead creation, owner contact, skip tracing, scraping,
            map crawling, Street View automation, external APIs, provider activation, persistence, polling, audit
            writing, campaigns, automation, and execution remain blocked.
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
        {distressItems.map((item) => (
          <article key={item.title} className="min-w-0 rounded-2xl border border-border bg-white p-4">
            <h3 className="break-words text-sm font-semibold text-primary">{item.title}</h3>
            <p className="mt-2 break-words text-sm font-medium text-primary">{item.status}</p>
            <p className="mt-1 break-words text-sm leading-6 text-muted">{item.detail}</p>
          </article>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-950">
        <h3 className="break-words font-semibold text-blue-950">Distress intelligence boundary</h3>
        <p className="mt-1 break-words">
          This surface is advisory text only. It does not add buttons, click handlers, forms, inputs, map crawling,
          Street View automation, external APIs, fetch/network calls, scraping, skip tracing, lead creation, owner
          contact, provider activation, outreach, persistence, audit writing, polling, automation, or execution.
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
          simulationOnly:true
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
          scrapingAllowed:false
        </span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">
          providerCalled:false
        </span>
      </div>
    </section>
  );
}
