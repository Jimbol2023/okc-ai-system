type VirtualD4dItem = {
  title: string;
  status: string;
  detail: string;
};

const safetyBadges = ["Read-only", "No scraping", "Manual review only", "Providers blocked"];

const virtualD4dItems: VirtualD4dItem[] = [
  {
    title: "Opportunity patterns",
    status: "Property opportunity patterns are advisory only.",
    detail:
      "Future Virtual D4D intelligence may describe possible acquisition pattern categories, but it cannot create leads, persist records, or start workflows.",
  },
  {
    title: "Distress signals",
    status: "Distress signals do not authorize contact.",
    detail:
      "Distress indicators are manual-review prompts only. They cannot trigger owner contact, skip tracing, outreach, campaigns, or provider activation.",
  },
  {
    title: "Data sourcing boundary",
    status: "No scraping, map crawling, or Street View automation is authorized.",
    detail:
      "This surface does not crawl maps, automate Street View, call external APIs, fetch network data, or infer property facts from unverified sources.",
  },
  {
    title: "Owner contact boundary",
    status: "No owner contact or outreach is authorized.",
    detail:
      "Virtual D4D visibility cannot call, text, email, skip trace, contact owners, launch campaigns, or send messages.",
  },
  {
    title: "Provider boundary",
    status: "Provider activation remains blocked.",
    detail:
      "No provider client is created, no credentials or env vars are read, and no external provider path is reachable from this summary.",
  },
  {
    title: "Manual acquisition review",
    status: "Manual acquisition review may be useful.",
    detail:
      "The only permitted meaning is that a human operator may later review property research needs under future governance.",
  },
];

export function VirtualDrivingForDollarsSummary() {
  return (
    <section
      aria-labelledby="virtual-driving-for-dollars-heading"
      aria-describedby="virtual-driving-for-dollars-summary"
      className="overflow-hidden rounded-[1.5rem] border border-border bg-surface p-5 sm:p-6"
    >
      <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">
            Virtual driving for dollars intelligence
          </p>
          <h2 id="virtual-driving-for-dollars-heading" className="break-words text-xl font-semibold text-primary">
            Read-only property opportunity review
          </h2>
          <p id="virtual-driving-for-dollars-summary" className="max-w-3xl break-words text-sm leading-6 text-muted">
            Virtual D4D intelligence is advisory only. Opportunity patterns and distress signals require human review.
            Scraping, map crawling, Street View automation, external APIs, owner contact, skip tracing, outreach,
            provider activation, runtime activation, polling, persistence, audit writing, campaigns, automation, and
            execution remain blocked.
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
        {virtualD4dItems.map((item) => (
          <article key={item.title} className="min-w-0 rounded-2xl border border-border bg-white p-4">
            <h3 className="break-words text-sm font-semibold text-primary">{item.title}</h3>
            <p className="mt-2 break-words text-sm font-medium text-primary">{item.status}</p>
            <p className="mt-1 break-words text-sm leading-6 text-muted">{item.detail}</p>
          </article>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-950">
        <h3 className="break-words font-semibold text-blue-950">Virtual D4D boundary</h3>
        <p className="mt-1 break-words">
          This surface is advisory text only. It does not add buttons, click handlers, forms, inputs, map automation,
          external links implying scraping, send controls, contact controls, provider controls, fetch/network calls,
          polling, runtime jobs, persistence, audit writing, scraping, skip tracing, owner contact, campaigns,
          automation, or execution.
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
          scrapingAllowed:false
        </span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">
          mapCrawlingAllowed:false
        </span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">
          externalApiAllowed:false
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
