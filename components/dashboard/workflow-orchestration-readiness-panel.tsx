import { DashboardCard, SafetyBadge, StatusBadge } from "@/components/dashboard/dashboard-ui";
import {
  createWorkflowOrchestrationReadinessReport,
  type WorkflowOrchestrationCapability,
  type WorkflowOrchestrationStatus,
} from "@/lib/workflow-orchestration-readiness";

function getStatusTone(status: WorkflowOrchestrationStatus) {
  if (status === "recommended_readiness_only") return "good";
  if (status === "manual_review_required") return "watch";

  return "urgent";
}

function formatLabel(value: string) {
  return value.replaceAll("_", " ");
}

function CapabilityCard({ capability }: { capability: WorkflowOrchestrationCapability }) {
  return (
    <article className="rounded-lg border border-border bg-white p-4">
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="break-words text-sm font-semibold text-primary">{capability.label}</h3>
          <p className="mt-1 break-words text-xs font-bold uppercase tracking-[0.08em] text-muted">{capability.role}</p>
        </div>
        <StatusBadge status={getStatusTone(capability.status)} label={formatLabel(capability.status)} />
      </div>
      <p className="mt-3 break-words text-sm leading-6 text-muted">{capability.recommendedUse}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <SafetyBadge tone="neutral">providerCalled:false</SafetyBadge>
        <SafetyBadge tone="neutral">workflowTriggered:false</SafetyBadge>
        <SafetyBadge tone="urgent">outreach:false</SafetyBadge>
      </div>
      <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Blocked until governed</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-xs leading-5 text-muted">
          {capability.blockedUntil.slice(0, 3).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export function WorkflowOrchestrationReadinessPanel() {
  const report = createWorkflowOrchestrationReadinessReport();

  return (
    <section aria-labelledby="workflow-orchestration-readiness-heading" className="space-y-4">
      <DashboardCard className="p-5 md:p-6">
        <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0 space-y-2">
            <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">Workflow orchestration readiness</p>
            <h2 id="workflow-orchestration-readiness-heading" className="break-words text-xl font-semibold text-primary">
              n8n-first orchestration, safety locked
            </h2>
            <p className="max-w-4xl break-words text-sm leading-6 text-muted">{report.summary}</p>
          </div>
          <div className="flex max-w-full flex-wrap gap-2">
            <SafetyBadge tone="good">preferred:n8n</SafetyBadge>
            <SafetyBadge>readinessOnly:true</SafetyBadge>
            <SafetyBadge tone="urgent">liveTriggers:false</SafetyBadge>
            <SafetyBadge tone="urgent">desktopAutomation:false</SafetyBadge>
          </div>
        </div>
      </DashboardCard>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {report.capabilities.map((capability) => (
          <CapabilityCard key={capability.id} capability={capability} />
        ))}
      </div>

      <DashboardCard>
        <h3 className="break-words text-base font-semibold text-primary">Safe implementation order</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-muted">
          {report.suggestedSequence.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </DashboardCard>
    </section>
  );
}
