import { deriveHumanGuidedSellerConversationSupport } from "@/lib/x3-human-guided-seller-conversation-support-helper";
import { x3ReadonlyUiWording } from "@/lib/x3-human-guided-seller-conversation-support-readonly-ui-scope-contract";

const demoItems = [
  { id: "x3-1", label: "High-opportunity seller context review", priority: 4, estimatedRevenue: 18000, offerReadinessScore: 82, hasObjection: true, motivationKnown: true, timelineKnown: true, askingPriceKnown: true, source: "read-only dashboard signal" },
  { id: "x3-2", label: "Missing seller timeline review", priority: 3, motivationKnown: true, timelineKnown: false, askingPriceKnown: true, source: "read-only dashboard signal" },
  { id: "x3-3", label: "Follow-up language review", priority: 2, daysSinceSellerTouch: 7, needsFollowUpLanguageReview: true, motivationKnown: false, timelineKnown: true, askingPriceKnown: false, source: "read-only dashboard signal" },
  { id: "x3-4", label: "Offer-readiness conversation review", priority: 3, estimatedRevenue: 22000, offerReadinessScore: 76, motivationKnown: true, timelineKnown: true, askingPriceKnown: true, source: "read-only dashboard signal" },
];

function renderList(items: { id: string; label: string }[]) {
  return items.length > 0 ? items.map((item) => <li key={item.id} className="break-words">{item.label}</li>) : <li>No read-only signals available.</li>;
}

export function HumanGuidedSellerConversationSupportSummary() {
  const summary = deriveHumanGuidedSellerConversationSupport({ items: demoItems, maxItemsPerSection: 3 });
  return (
    <section aria-labelledby="human-guided-seller-conversation-support-heading" aria-describedby="human-guided-seller-conversation-support-summary" className="overflow-hidden rounded-[1.5rem] border border-border bg-surface p-5 sm:p-6">
      <div className="space-y-2">
        <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">Controlled revenue operations</p>
        <h2 id="human-guided-seller-conversation-support-heading" className="break-words text-xl font-semibold text-primary">Human-guided seller conversation support</h2>
        <p id="human-guided-seller-conversation-support-summary" className="max-w-4xl break-words text-sm leading-6 text-muted">{x3ReadonlyUiWording.sellerConversation} {x3ReadonlyUiWording.followUpLanguage} Human operator review is required before any real-world action. No seller contact, message sending, execution, provider activation, outreach, routing, polling, persistence, audit writing, scraping, skip tracing, or automation is authorized.</p>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-border bg-white p-4"><h3 className="text-sm font-semibold text-primary">Seller context review</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted">{renderList(summary.sellerContextReviewItems)}</ul></article>
        <article className="rounded-2xl border border-border bg-white p-4"><h3 className="text-sm font-semibold text-primary">Motivation and timeline</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted">{renderList([...summary.motivationReviewItems, ...summary.timelineReviewItems].slice(0, 4))}</ul></article>
        <article className="rounded-2xl border border-border bg-white p-4"><h3 className="text-sm font-semibold text-primary">Objection and offer readiness</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted">{renderList([...summary.objectionReviewItems, ...summary.offerReadinessConversationItems].slice(0, 4))}</ul></article>
        <article className="rounded-2xl border border-border bg-white p-4"><h3 className="text-sm font-semibold text-primary">Follow-up language review</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted">{renderList(summary.followUpLanguageReviewItems)}</ul></article>
      </div>
      <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
        <h3 className="font-semibold text-amber-950">Manual conversation guidance labels</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5">{summary.manualConversationGuidance.map((guidance) => <li key={guidance} className="break-words">{guidance}</li>)}</ul>
      </div>
      <div className="mt-4 flex max-w-full flex-wrap gap-2 text-xs font-bold">
        <span className="rounded border border-amber-200 bg-white px-2 py-1 text-amber-950">readOnly:true</span><span className="rounded border border-amber-200 bg-white px-2 py-1 text-amber-950">advisoryOnly:true</span><span className="rounded border border-amber-200 bg-white px-2 py-1 text-amber-950">humanReviewOnly:true</span><span className="rounded border border-amber-200 bg-white px-2 py-1 text-amber-950">providerCalled:false</span><span className="rounded border border-amber-200 bg-white px-2 py-1 text-amber-950">sent:false</span><span className="rounded border border-amber-200 bg-white px-2 py-1 text-amber-950">persistenceWritten:false</span><span className="rounded border border-amber-200 bg-white px-2 py-1 text-amber-950">runtimeActivated:false</span><span className="rounded border border-amber-200 bg-white px-2 py-1 text-amber-950">approvalGrantsExecution:false</span>
      </div>
    </section>
  );
}
