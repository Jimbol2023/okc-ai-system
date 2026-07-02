import { DashboardCard, SafetyBadge, StatusBadge } from "@/components/dashboard/dashboard-ui";
import { createDocumentIntelligencePlatformReport, reviewDocumentWorkflow } from "@/lib/document-intelligence-platform";

export const dynamic = "force-dynamic";

export default function DocumentIntelligencePage() {
  const report = createDocumentIntelligencePlatformReport();
  const sampleReview = reviewDocumentWorkflow({
    workflowType: "productivity_workflow",
    businessModule: "cross_business",
    documentType: "proposal",
    templateKey: "cross_business_proposal_v1",
    sourceRecordLabels: ["crm_record", "revenue_engine_summary", "approved_brand_guidelines"],
    targetSuite: "microsoft_365",
    connectorKeys: ["google_workspace", "canva"],
    requestedTransformations: ["proposal_to_pdf", "proposal_to_slide_deck"],
    externalActionIntent: "share_publicly",
    containsSensitiveData: true,
  });

  return (
    <div className="space-y-6">
      <DashboardCard className="p-5 md:p-6">
        <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0 space-y-2">
            <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">Phase 7 AI Core</p>
            <h1 className="break-words text-3xl font-semibold text-primary">Document Intelligence Platform</h1>
            <p className="max-w-4xl break-words text-sm leading-6 text-muted">{report.summary}</p>
          </div>
          <div className="flex max-w-full flex-wrap gap-2">
            <SafetyBadge>aiCore:true</SafetyBadge>
            <SafetyBadge>templates:reusable</SafetyBadge>
            <SafetyBadge>providerCalled:false</SafetyBadge>
            <SafetyBadge tone="urgent">liveExecution:false</SafetyBadge>
          </div>
        </div>
      </DashboardCard>

      <section className="grid gap-4 lg:grid-cols-3">
        <DashboardCard>
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted">Capabilities</p>
          <p className="mt-2 text-3xl font-semibold text-primary">{report.capabilities.length}</p>
        </DashboardCard>
        <DashboardCard>
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted">Connector Families</p>
          <p className="mt-2 text-3xl font-semibold text-primary">{report.connectorFamilies.length}</p>
        </DashboardCard>
        <DashboardCard>
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted">External Sharing</p>
          <p className="mt-2 text-lg font-semibold text-primary">Approval blocked</p>
        </DashboardCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <DashboardCard>
          <h2 className="break-words text-xl font-semibold text-primary">Productivity Connectors</h2>
          <div className="mt-4 space-y-3">
            {report.connectorFamilies.map((family) => (
              <div key={family.suite} className="rounded-lg border border-border bg-white p-3">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-primary">{family.suite.replaceAll("_", " ")}</p>
                  <StatusBadge status="neutral" label={family.defaultMode.replaceAll("_", " ")} />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {family.connectors.map((connector) => (
                    <SafetyBadge key={`${family.suite}-${connector}`}>{connector}</SafetyBadge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard>
          <h2 className="break-words text-xl font-semibold text-primary">Document Safety</h2>
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
            <h2 className="break-words text-xl font-semibold text-primary">Governed Workflow Example</h2>
            <p className="mt-2 max-w-3xl break-words text-sm leading-6 text-muted">
              The platform can plan document generation, transformation, and storage workflows, while external email, public sharing, exports, and connector writes remain blocked.
            </p>
          </div>
          <StatusBadge status="urgent" label={sampleReview.safeAutoDecision.status.replaceAll("_", " ")} />
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Workflow Plan</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted">
              {sampleReview.workflowPlan.map((item) => (
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
