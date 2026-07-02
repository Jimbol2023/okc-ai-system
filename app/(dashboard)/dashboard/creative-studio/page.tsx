import { DashboardCard, SafetyBadge, StatusBadge } from "@/components/dashboard/dashboard-ui";
import { createCreativeStudioPlatformReport, reviewCreativeStudioRequest } from "@/lib/ai-creative-growth-studio";

export const dynamic = "force-dynamic";

export default function CreativeStudioPage() {
  const report = createCreativeStudioPlatformReport();
  const sampleReview = reviewCreativeStudioRequest({
    requestType: "content_factory",
    businessModule: "cross_business",
    brandKey: "j_capital_ai_os",
    targetChannel: "linkedin",
    desiredAssetType: "repurposed thought leadership campaign",
    sourceLabels: ["approved_operator_brief", "existing_brand_guidelines"],
    connectorKeys: ["canva", "google_business_profile"],
    externalActionIntent: "publish",
    complianceSensitivity: "high_reputation_risk",
  });

  return (
    <div className="space-y-6">
      <DashboardCard className="p-5 md:p-6">
        <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0 space-y-2">
            <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">Phase 6 AI Core</p>
            <h1 className="break-words text-3xl font-semibold text-primary">AI Creative Growth Studio</h1>
            <p className="max-w-4xl break-words text-sm leading-6 text-muted">{report.summary}</p>
          </div>
          <div className="flex max-w-full flex-wrap gap-2">
            <SafetyBadge>aiCore:true</SafetyBadge>
            <SafetyBadge>reusable:true</SafetyBadge>
            <SafetyBadge>providerCalled:false</SafetyBadge>
            <SafetyBadge tone="urgent">liveExecution:false</SafetyBadge>
          </div>
        </div>
      </DashboardCard>

      <section className="grid gap-4 lg:grid-cols-3">
        <DashboardCard>
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted">Creative Agents</p>
          <p className="mt-2 text-3xl font-semibold text-primary">{report.agents.length}</p>
        </DashboardCard>
        <DashboardCard>
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted">Capabilities</p>
          <p className="mt-2 text-3xl font-semibold text-primary">{report.capabilities.length}</p>
        </DashboardCard>
        <DashboardCard>
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted">Approval Boundary</p>
          <p className="mt-2 text-lg font-semibold text-primary">External actions blocked</p>
        </DashboardCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <DashboardCard>
          <h2 className="break-words text-xl font-semibold text-primary">Agent Roster</h2>
          <div className="mt-4 space-y-3">
            {report.agents.map((agent) => (
              <div key={agent.role} className="rounded-lg border border-border bg-white p-3">
                <p className="text-sm font-semibold text-primary">{agent.label}</p>
                <p className="mt-1 text-sm leading-6 text-muted">{agent.purpose}</p>
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard>
          <h2 className="break-words text-xl font-semibold text-primary">Reputation Safety</h2>
          <div className="mt-4 space-y-3">
            {report.safetyRules.map((rule) => (
              <div key={rule} className="rounded-lg border border-amber-100 bg-amber-50 p-3 text-sm leading-6 text-amber-950">
                {rule}
              </div>
            ))}
          </div>
        </DashboardCard>
      </section>

      <DashboardCard>
        <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <h2 className="break-words text-xl font-semibold text-primary">Governed Review Example</h2>
            <p className="mt-2 max-w-3xl break-words text-sm leading-6 text-muted">
              The studio can prepare creative strategy and asset briefs, but publishing, scheduling, ad spend, messaging, and connector writes remain blocked.
            </p>
          </div>
          <StatusBadge status="urgent" label={sampleReview.safeAutoDecision.status.replaceAll("_", " ")} />
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">ROI Rationale</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted">
              {sampleReview.roiRationale.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-blue-900">Approval Requirements</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-blue-950">
              {sampleReview.approvalRequirements.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </DashboardCard>
    </div>
  );
}
