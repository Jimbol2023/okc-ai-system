type NeighborhoodOpportunityClusterItem = {
  title: string;
  status: string;
  detail: string;
};

const safetyBadges = ["Read-only", "Cluster advisory", "No maps", "No contacts"];

const clusterItems: NeighborhoodOpportunityClusterItem[] = [
  {
    title: "Broad area patterns",
    status: "Neighborhood opportunity clustering is advisory only.",
    detail:
      "Future clustering may describe broad area-level concentration, acquisition fit, buyer-demand concentration, and manual review priority categories.",
  },
  {
    title: "Unverified patterns",
    status: "Area patterns may be unverified and confidence may be limited.",
    detail:
      "Cluster labels are future review prompts only. They do not confirm property facts, neighborhood conditions, ownership, or market demand.",
  },
  {
    title: "Missing area data",
    status: "Missing area data requires manual review.",
    detail:
      "Missing area context cannot trigger geocoding, map crawling, public-record crawling, scraping, enrichment, provider activation, persistence, or external APIs.",
  },
  {
    title: "Geodata boundary",
    status: "No geocoding, map crawling, Street View automation, or scraping is authorized.",
    detail:
      "This surface does not include maps, map controls, geocoding controls, external links for sourcing, fetch/network calls, or automated research behavior.",
  },
  {
    title: "Contact and lead boundary",
    status: "No lead creation, owner contact, buyer contact, seller contact, or campaigns are authorized.",
    detail:
      "Clusters cannot call, text, email, skip trace, create leads, contact owners, contact buyers, contact sellers, blast deals, or launch campaigns.",
  },
  {
    title: "Provider boundary",
    status: "Provider activation remains blocked.",
    detail:
      "No provider client is created, no credentials or env vars are read, and no fetch/network path is reachable from this surface.",
  },
];

export function NeighborhoodOpportunityClusteringSummary() {
  return (
    <section
      aria-labelledby="neighborhood-opportunity-clustering-heading"
      aria-describedby="neighborhood-opportunity-clustering-summary"
      className="overflow-hidden rounded-[1.5rem] border border-border bg-surface p-5 sm:p-6"
    >
      <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">
            Neighborhood opportunity clustering
          </p>
          <h2 id="neighborhood-opportunity-clustering-heading" className="break-words text-xl font-semibold text-primary">
            Read-only area pattern review
          </h2>
          <p id="neighborhood-opportunity-clustering-summary" className="max-w-3xl break-words text-sm leading-6 text-muted">
            Neighborhood clustering is advisory only. Clusters may be uncertain, patterns may be unverified, and area
            data may be missing. Geocoding, map crawling, Street View automation, scraping, lead creation, owner contact,
            buyer contact, seller contact, campaigns, provider activation, persistence, polling, audit writing,
            automation, and execution remain blocked.
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
        {clusterItems.map((item) => (
          <article key={item.title} className="min-w-0 rounded-2xl border border-border bg-white p-4">
            <h3 className="break-words text-sm font-semibold text-primary">{item.title}</h3>
            <p className="mt-2 break-words text-sm font-medium text-primary">{item.status}</p>
            <p className="mt-1 break-words text-sm leading-6 text-muted">{item.detail}</p>
          </article>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-950">
        <h3 className="break-words font-semibold text-blue-950">Neighborhood clustering boundary</h3>
        <p className="mt-1 break-words">
          This surface is advisory text only. It does not add buttons, click handlers, forms, inputs, maps, geocoding,
          map crawling, Street View automation, external APIs, scraping, skip tracing, lead creation, owner contact,
          buyer contact, seller contact, campaigns, fetch/network calls, provider activation, persistence, audit writing,
          polling, automation, or execution.
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
          geocodingAllowed:false
        </span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">
          mapCrawlingAllowed:false
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
