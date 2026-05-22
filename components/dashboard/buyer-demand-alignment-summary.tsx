type BuyerDemandAlignmentItem = {
  title: string;
  status: string;
  detail: string;
};

const safetyBadges = ["Read-only", "Alignment advisory", "No contacts", "No matches"];

const buyerDemandItems: BuyerDemandAlignmentItem[] = [
  {
    title: "Demand fit categories",
    status: "Buyer-demand alignment is advisory only.",
    detail:
      "Future alignment may describe broad buyer appetite, asset type, price-band, rehab-level, rental/hold, flip, land/infill, and small multifamily fit.",
  },
  {
    title: "Mismatch and confidence",
    status: "Demand fit may be uncertain and confidence may be limited.",
    detail:
      "Demand mismatch and assignment-readiness uncertainty are manual review prompts, not disposition instructions.",
  },
  {
    title: "Missing demand data",
    status: "Missing demand data requires manual review.",
    detail:
      "Missing buyer-demand data cannot trigger scraping, enrichment, provider activation, persistence, or external API calls.",
  },
  {
    title: "Contact boundary",
    status: "No buyer contact or seller contact is authorized.",
    detail:
      "Alignment cannot call, text, email, contact buyers, contact sellers, send messages, or trigger outreach.",
  },
  {
    title: "Disposition boundary",
    status: "No match creation, deal blast, or campaign is authorized.",
    detail:
      "Buyer-demand fit cannot create buyer matches, blast deals, launch campaigns, route deals, or execute disposition workflows.",
  },
  {
    title: "Provider boundary",
    status: "Provider activation remains blocked.",
    detail:
      "No provider client is created, no credentials or env vars are read, and no fetch/network path is reachable from this surface.",
  },
];

export function BuyerDemandAlignmentSummary() {
  return (
    <section
      aria-labelledby="buyer-demand-alignment-heading"
      aria-describedby="buyer-demand-alignment-summary"
      className="overflow-hidden rounded-[1.5rem] border border-border bg-surface p-5 sm:p-6"
    >
      <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">
            Buyer demand alignment intelligence
          </p>
          <h2 id="buyer-demand-alignment-heading" className="break-words text-xl font-semibold text-primary">
            Read-only demand fit review
          </h2>
          <p id="buyer-demand-alignment-summary" className="max-w-3xl break-words text-sm leading-6 text-muted">
            Buyer-demand alignment is advisory only. Demand fit may be uncertain, confidence may be limited, and demand
            data may be missing. Buyer contact, seller contact, match creation, deal blasts, campaigns, scraping,
            external APIs, provider activation, persistence, polling, audit writing, automation, and execution remain
            blocked.
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
        {buyerDemandItems.map((item) => (
          <article key={item.title} className="min-w-0 rounded-2xl border border-border bg-white p-4">
            <h3 className="break-words text-sm font-semibold text-primary">{item.title}</h3>
            <p className="mt-2 break-words text-sm font-medium text-primary">{item.status}</p>
            <p className="mt-1 break-words text-sm leading-6 text-muted">{item.detail}</p>
          </article>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-950">
        <h3 className="break-words font-semibold text-blue-950">Buyer demand alignment boundary</h3>
        <p className="mt-1 break-words">
          This surface is advisory text only. It does not add buttons, click handlers, forms, inputs, match creation,
          buyer contact, seller contact, deal blasts, campaigns, scraping, external APIs, fetch/network calls, provider
          activation, outreach, persistence, audit writing, polling, automation, or execution.
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
          buyerContactAllowed:false
        </span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">
          sellerContactAllowed:false
        </span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">
          matchCreationAllowed:false
        </span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">
          dealBlastAllowed:false
        </span>
        <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">
          providerCalled:false
        </span>
      </div>
    </section>
  );
}
