import {
  marketingApiRoadmap,
  marketingConnectedAccounts,
  marketingContentPipeline,
  marketingDraftQueue,
  marketingGovernanceRules,
  marketingLeadAttributionReadiness,
  marketingPublishedSnapshots,
  marketingSafetyBadges,
  marketingSocialCalendar,
  marketingSourceHygieneChecklist,
  marketingTopRoiQuestions,
  type MarketingConnectionStatus,
  type MarketingRiskLevel,
} from "@/lib/marketing-hub";
import { MarketingWorkflowClient } from "@/components/dashboard/marketing-workflow-client";
import { ManualLeadIntakeClient } from "@/components/dashboard/manual-lead-intake-client";
import { OfferReadinessWorkspaceClient } from "@/components/dashboard/offer-readiness-workspace-client";
import { SalesConversionAssistClient } from "@/components/dashboard/sales-conversion-assist-client";
import { SalesFollowUpWorkspaceClient } from "@/components/dashboard/sales-follow-up-workspace-client";
import type { ReactNode } from "react";

function formatStatus(status: MarketingConnectionStatus) {
  return status.replaceAll("_", " ");
}

function statusTone(status: MarketingConnectionStatus) {
  if (status === "manual_setup") {
    return "border-amber-200 bg-amber-50 text-amber-900";
  }

  return "border-slate-200 bg-slate-50 text-slate-700";
}

function riskTone(riskLevel: MarketingRiskLevel) {
  if (riskLevel === "high") return "border-red-200 bg-red-50 text-red-900";
  if (riskLevel === "medium") return "border-amber-200 bg-amber-50 text-amber-900";
  return "border-emerald-200 bg-emerald-50 text-emerald-900";
}

function SectionCard({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[1.5rem] border border-border bg-surface p-5 shadow-[0_18px_40px_rgba(17,37,52,0.05)] sm:p-6">
      <div className="space-y-2">
        <p className="break-words text-xs font-bold uppercase tracking-[0.16em] text-muted">{eyebrow}</p>
        <h2 className="break-words text-xl font-semibold text-primary">{title}</h2>
        <p className="max-w-3xl break-words text-sm leading-6 text-muted">{description}</p>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function MarketingHub() {
  return (
    <div className="space-y-6">
      <div className="rounded-[1.5rem] border border-border bg-white p-5 shadow-[0_18px_40px_rgba(17,37,52,0.05)] sm:p-6">
        <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0 space-y-3">
            <p className="break-words text-sm font-semibold uppercase tracking-[0.18em] text-muted">Marketing Integration Layer v1</p>
            <h1 className="break-words text-3xl font-semibold text-primary md:text-4xl">Marketing Hub</h1>
            <p className="max-w-4xl break-words text-sm leading-6 text-muted md:text-base">
              Read-only command center for lead attribution readiness, source hygiene, approval-safe content operations,
              and manual analytics scaffolding. This foundation prepares future integrations without connecting,
              posting, messaging, or mutating any external account.
            </p>
          </div>
          <div className="flex max-w-full flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.1em]">
            {marketingSafetyBadges.map((badge) => (
              <span key={badge} className="max-w-full break-words rounded-full border border-blue-200 bg-blue-50 px-3 py-1 leading-5 text-blue-950">
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>

      <MarketingWorkflowClient />

      <SalesConversionAssistClient />

      <SalesFollowUpWorkspaceClient />

      <OfferReadinessWorkspaceClient />

      <ManualLeadIntakeClient />

      <SectionCard
        eyebrow="Phase 2F+ Roadmap"
        title="Social, analytics, content, and publishing gates"
        description="Provider integrations stay phased behind connection readiness, read-only analytics, draft-only content, and explicit human publish approval."
      >
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {marketingApiRoadmap.map((phase) => (
            <article key={phase.phase} className="rounded-2xl border border-border bg-white p-4">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">{phase.phase}</p>
              <h3 className="mt-2 text-base font-semibold text-primary">{phase.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{phase.summary}</p>
              <p className="mt-3 text-xs font-bold uppercase leading-5 tracking-[0.08em] text-blue-950">{phase.guardrail}</p>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        eyebrow="Highest ROI focus"
        title="Lead Attribution Readiness"
        description="Manual source tracking comes first so future marketing work can be measured against seller lead quality without live integrations."
      >
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {marketingLeadAttributionReadiness.map((item) => (
            <article key={item.channel} className="min-w-0 rounded-2xl border border-border bg-white p-4">
              <div className="flex min-w-0 items-start justify-between gap-3">
                <h3 className="break-words text-sm font-semibold text-primary">{item.channel}</h3>
                <span className="shrink-0 rounded-full border border-border bg-slate-50 px-2 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-700">
                  Source
                </span>
              </div>
              <p className="mt-2 break-words text-sm font-medium text-primary">{item.status}</p>
              <p className="mt-2 break-words text-sm leading-6 text-muted">{item.sourceTracking}</p>
              <p className="mt-3 break-words text-xs font-semibold uppercase leading-5 tracking-[0.08em] text-muted">{item.nextAction}</p>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        eyebrow="Connected Accounts"
        title="Manual platform connection status"
        description="Current platform visibility is static and manual. No account tokens, OAuth flows, env variables, provider clients, or external checks are used."
      >
        <div className="grid gap-3 lg:grid-cols-2">
          {marketingConnectedAccounts.map((account) => (
            <article key={account.platform} className="min-w-0 rounded-2xl border border-border bg-white p-4">
              <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h3 className="break-words text-base font-semibold text-primary">{account.label}</h3>
                  <p className="mt-1 break-words text-sm text-muted">{account.accountName}</p>
                  <p className="mt-1 break-words text-sm font-medium text-primary">{account.handle}</p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.08em]">
                  <span className={`rounded-full border px-3 py-1 leading-5 ${statusTone(account.status)}`}>{formatStatus(account.status)}</span>
                  <span className={`rounded-full border px-3 py-1 leading-5 ${riskTone(account.riskLevel)}`}>{account.riskLevel} risk</span>
                </div>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-[1fr_1.15fr]">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-600">Permissions</p>
                  <ul className="mt-2 space-y-1 text-sm leading-6 text-slate-700">
                    {account.permissions.map((permission) => (
                      <li key={permission}>{permission}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 text-blue-950">
                  <p className="text-xs font-bold uppercase tracking-[0.1em]">Next best manual action</p>
                  <p className="mt-2 text-sm leading-6">{account.nextAction}</p>
                </div>
              </div>
              <p className="mt-3 break-words text-xs font-semibold uppercase tracking-[0.08em] text-muted">
                Last checked: {account.lastChecked ?? "Not checked by system"}
              </p>
            </article>
          ))}
        </div>
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <SectionCard
          eyebrow="Content Pipeline"
          title="Weekly campaign workflow"
          description="Topic to multi-platform content remains draft-only until a human reviews and approves each channel."
        >
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            {marketingContentPipeline.map((step, index) => (
              <article key={step.label} className="rounded-2xl border border-border bg-white p-4">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">Step {index + 1}</p>
                <h3 className="mt-2 text-base font-semibold text-primary">{step.label}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{step.purpose}</p>
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Source Hygiene"
          title="Attribution guardrails"
          description="High ROI depends on clean source data. The Marketing Hub should improve source quality before automation expands."
        >
          <ul className="grid gap-3">
            {marketingSourceHygieneChecklist.map((item) => (
              <li key={item} className="rounded-2xl border border-border bg-white p-4 text-sm leading-6 text-muted">
                {item}
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard
          eyebrow="Draft Queue"
          title="Read-only content drafts"
          description="Drafts are placeholders for planning only. They do not create posts, messages, leads, or external platform changes."
        >
          <div className="space-y-3">
            {marketingDraftQueue.map((item) => (
              <article key={item.title} className="rounded-2xl border border-border bg-white p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <h3 className="break-words text-sm font-semibold text-primary">{item.title}</h3>
                  <span className="w-fit rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-amber-900">
                    {item.status}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted">{item.source}</p>
                <p className="mt-2 text-sm font-medium leading-6 text-primary">{item.nextAction}</p>
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Approval Queue"
          title="Human approval required before publishing"
          description="Approval is a review gate only. It cannot publish content, send messages, create outreach, mutate CRM data, or call providers."
        >
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-950">
            <h3 className="text-base font-semibold">Publishing is blocked until human approval is complete.</h3>
            <p className="mt-2 text-sm leading-6">
              The required flow is AI draft to human review to approve to publish. Phase 1 contains no publish button,
              no provider control, no platform API route, and no execution path.
            </p>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-white p-4">
              <p className="text-sm font-semibold text-primary">Approval status</p>
              <p className="mt-2 text-sm leading-6 text-muted">Manual review required for every channel-specific draft.</p>
            </div>
            <div className="rounded-2xl border border-border bg-white p-4">
              <p className="text-sm font-semibold text-primary">Execution status</p>
              <p className="mt-2 text-sm leading-6 text-muted">Publishing, outreach, and provider calls remain unavailable.</p>
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <SectionCard
          eyebrow="Published Content"
          title="Manual snapshot only"
          description="Published content is recorded manually after human action outside this app."
        >
          {marketingPublishedSnapshots.map((item) => (
            <article key={item.title} className="rounded-2xl border border-border bg-white p-4">
              <h3 className="text-sm font-semibold text-primary">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{item.source}</p>
              <p className="mt-2 text-sm font-medium leading-6 text-primary">{item.nextAction}</p>
            </article>
          ))}
        </SectionCard>

        <SectionCard
          eyebrow="Analytics"
          title="Manual analytics scaffolding"
          description="Traffic, engagement, conversions, and channel performance are placeholders until approved Phase 2 API routes exist."
        >
          <div className="grid gap-3">
            {marketingTopRoiQuestions.map((question) => (
              <div key={question} className="rounded-2xl border border-border bg-white p-4">
                <p className="text-sm font-semibold text-primary">{question}</p>
                <p className="mt-2 text-sm leading-6 text-muted">Manual/read-only snapshot pending.</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="SEO"
          title="Search visibility status"
          description="Search Console visibility remains manual until future approved server-side routes are added."
        >
          <div className="space-y-3">
            <div className="rounded-2xl border border-border bg-white p-4">
              <p className="text-sm font-semibold text-primary">Indexing status</p>
              <p className="mt-2 text-sm leading-6 text-muted">Manual Search Console review needed for jcapitalpropertygroup.com.</p>
            </div>
            <div className="rounded-2xl border border-border bg-white p-4">
              <p className="text-sm font-semibold text-primary">Content visibility</p>
              <p className="mt-2 text-sm leading-6 text-muted">Track article topics and search visibility manually before automation.</p>
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <SectionCard
          eyebrow="GBP"
          title="Google Business Profile checklist"
          description="GBP remains a manual setup surface for post and photo readiness only."
        >
          <div className="grid gap-3">
            {["Confirm business profile ownership", "Prepare approved weekly update", "Select approved photo", "Record manual view snapshot", "Do not auto-post"].map((item) => (
              <div key={item} className="rounded-2xl border border-border bg-white p-4 text-sm font-medium leading-6 text-primary">
                {item}
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Social Calendar"
          title="Weekly publishing rhythm"
          description="The calendar is a planning rhythm only. It does not schedule, queue, or publish content."
        >
          <div className="grid gap-3 md:grid-cols-2">
            {marketingSocialCalendar.map((item) => (
              <article key={item.day} className="rounded-2xl border border-border bg-white p-4">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">{item.day}</p>
                <h3 className="mt-2 text-base font-semibold text-primary">{item.rhythm}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{item.objective}</p>
              </article>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard
        eyebrow="Governance"
        title="Marketing safety boundary"
        description="These rules preserve the approval-first operating model and prevent Phase 1 from becoming live platform automation."
      >
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {marketingGovernanceRules.map((rule) => (
            <div key={rule} className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm font-bold uppercase leading-5 tracking-[0.08em] text-blue-950">
              {rule}
            </div>
          ))}
        </div>
        <div className="mt-4 flex max-w-full flex-wrap gap-2 text-xs font-bold">
          <span className="rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">readOnly:true</span>
          <span className="rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">providerCalled:false</span>
          <span className="rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">fetchNetworkAllowed:false</span>
          <span className="rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">published:false</span>
          <span className="rounded border border-blue-200 bg-white px-2 py-1 leading-5 text-blue-950">crmMutationAllowed:false</span>
        </div>
      </SectionCard>
    </div>
  );
}
