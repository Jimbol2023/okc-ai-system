type MarketTimingMomentumItem = {
  title: string;
  status: string;
  detail: string;
};

const safetyBadges = ["Read-only", "Timing advisory", "No live data", "No execution"];

const marketTimingItems: MarketTimingMomentumItem[] = [
  {
    title: "Momentum signals",
    status: "Market Timing & Momentum Intelligence is advisory only.",
    detail:
      "Future visibility may describe broad timing, momentum, opportunity-window, slowdown, and demand-shift categories for manual review.",
  },
  {
    title: "Uncertainty boundary",
    status: "Momentum signals and opportunity windows may be uncertain.",
    detail:
      "Market timing text is a review prompt only. It does not confirm market facts, live prices, buyer demand, MLS data, or acquisition readiness.",
  },
  {
    title: "Missing market data",
    status: "Missing market data requires manual review.",
    detail:
      "Missing market context cannot trigger live data ingestion, scraping, MLS access, public-record crawling, provider activation, persistence, or external APIs.",
  },
  {
    title: "Live-data boundary",
    status: "No live data ingestion, scraping, MLS access, public-record crawling, or external APIs are authorized.",
    detail:
      "This surface has no data fetch controls, live market controls, MLS controls, scraping links, fetch/network calls, or automated research behavior.",
  },
  {
    title: "Execution boundary",
    status: "No execution, lead creation, contact, campaigns, or outreach are authorized.",
    detail:
      "Timing signals cannot create leads, contact owners, contact buyers, contact sellers, send messages, launch campaigns, or execute workflows.",
  },
  {
    title: "Provider boundary",
    status: "Provider activation remains blocked.",
    detail:
      "No provider client is created, no credentials or env vars are read, and no fetch/network path is reachable from this surface.",
  },
];

export function MarketTimingMomentumSummary() {
  return (
    <section
      aria-labelledby="market-timing-momentum-heading"
      aria-describedby="market-timing-momentum-summary"
      className="overflow-hidden rounded-[1.5rem] border border-border bg-surface p-5 sm:p-6"
    >
      <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">
            Market timing and momentum intelligence
          </p>
          <h2 id="market-timing-momentum-heading" className="break-words text-xl font-semibold text-primary">
            Read-only market signal review
          </h2>
          <p id="market-timing-momentum-summary" className="max-w-3xl break-words text-sm leading-6 text-muted">
            Market timing and momentum visibility is advisory only. Timing signals may be uncertain, opportunity windows
            may be limited, and market data may be missing. Live data ingestion, scraping, MLS access, public-record
            crawling, external APIs, lead creation, buyer contact, seller contact, owner contact, campaigns, provider
            activation, persistence, polling, audit writing, automation, and execution remain blocked.
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
        {marketTimingItems.map((item) => (
          <article key={item.title} className="min-w-0 rounded-2xl border border-border bg-white p-4">
            <h3 className="break-words text-sm font-semibold text-primary">{item.title}</h3>
            <p className="mt-2 break-words text-sm font-medium text-primary">{item.status}</p>
            <p className="mt-1 break-words text-sm leading-6 text-muted">{item.detail}</p>
          </article>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-950">
        <h3 className="break-words font-semibold text-blue-950">Market timing boundary</h3>
        <p className="mt-1 break-words">
          This surface is advisory text only. It does not add buttons, click handlers, forms, inputs, live market data,
          MLS integration, scraping, public-record crawling, external APIs, fetch/network calls, provider activation,
          outreach, persistence, audit writing, polling, automation, or execution.
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
          liveDataIngestionAllowed:false
        </span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">
          mlsAccessAllowed:false
        </span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">
          externalApiAllowed:false
        </span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">
          executionAllowed:false
        </span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">
          providerCalled:false
        </span>
      </div>
    </section>
  );
}
