import { getOperatorDecisionQualityUiDraft } from "@/lib/operator-decision-quality-ui-draft";

const decisionQualityPanels = [
  {
    title: "Lead worthiness",
    signal: "Why this lead may deserve manual attention",
    detail: "Looks for visible value cues, review priority context, and operator confidence without creating a score.",
  },
  {
    title: "Blockers",
    signal: "What must stop action",
    detail: "Keeps DNC, opt-out, property-first, missing seller detail, and governance blockers visible before review.",
  },
  {
    title: "Missing data",
    signal: "What is incomplete",
    detail: "Highlights missing source, owner, address, phone, email, or provenance so cleanup stays manual.",
  },
  {
    title: "Source and provenance",
    signal: "Where the record came from",
    detail: "Keeps source context visible and avoids invented property facts or external lookup drift.",
  },
  {
    title: "Review readiness",
    signal: "Whether manual review is shaped enough",
    detail: "Explains readiness as advisory text only, not qualification, approval, or record creation.",
  },
  {
    title: "Safe manual next action",
    signal: "What a human can review next",
    detail: "Names a manual review focus while keeping automatic work movement and follow-up blocked.",
  },
  {
    title: "AI assist explanation",
    signal: "Why the draft says what it says",
    detail: "Frames AI as explainable operator support only, with no persuasion, scoring, or execution.",
  },
] as const;

const safetyBadges = [
  "Manual review only",
  "No scoring",
  "No lead creation",
  "No provider activation",
  "No seller messaging",
  "No automatic work movement",
] as const;

export function OperatorDecisionQualityUiDraft() {
  const contract = getOperatorDecisionQualityUiDraft();

  return (
    <section
      aria-labelledby="operator-decision-quality-heading"
      aria-describedby="operator-decision-quality-summary"
      className="mb-4 overflow-hidden rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
    >
      <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-gray-500">A4.4 UI draft</p>
          <h2 id="operator-decision-quality-heading" className="break-words text-xl font-semibold text-gray-900">
            Operator decision quality review draft
          </h2>
          <p id="operator-decision-quality-summary" className="max-w-3xl break-words text-sm leading-6 text-gray-600">
            Read-only surface for deciding what matters, what is blocked, what is missing, and what a human can review
            next. This draft does not write records, create work, score leads, or activate seller-facing systems.
          </p>
        </div>

        <div className="flex max-w-full flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.1em]">
          {safetyBadges.map((badge) => (
            <span key={badge} className="max-w-full break-words rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-gray-700">
              {badge}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {decisionQualityPanels.map((panel) => (
          <article key={panel.title} className="min-w-0 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <h3 className="break-words text-sm font-semibold text-gray-900">{panel.title}</h3>
            <p className="mt-2 break-words text-sm font-medium text-blue-800">{panel.signal}</p>
            <p className="mt-1 break-words text-sm leading-6 text-gray-600">{panel.detail}</p>
          </article>
        ))}
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_18rem]">
        <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-950">
          <h3 className="font-semibold">Explainable operator assist</h3>
          <p className="mt-1 break-words">
            AI-style assistance is limited to summaries, rationale, and prompts that help a human review source,
            blockers, missing data, and safe manual next review. It does not approve action or operate seller-facing
            systems.
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-gray-500">Draft lock</p>
          <p className="mt-2 break-words text-sm font-semibold text-gray-900">{contract.operatorDecisionQualityUiDraftStatus}</p>
          <p className="mt-1 break-words text-sm leading-6 text-gray-600">Next stage: {contract.nextStageRecommendation}</p>
          <button
            type="button"
            disabled
            aria-describedby="operator-decision-quality-draft-lock"
            className="mt-3 w-full cursor-not-allowed rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-sm font-bold text-gray-500"
          >
            Review only
          </button>
          <p id="operator-decision-quality-draft-lock" className="mt-2 text-xs leading-5 text-gray-500">
            Action blocked. Safety and usability review is required before this draft can move beyond display.
          </p>
        </div>
      </div>
    </section>
  );
}
