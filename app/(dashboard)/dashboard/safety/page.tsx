import { DashboardCard, SafetyBadge, StatusBadge } from "@/components/dashboard/dashboard-ui";
import { createOperationalSafetyCenterReport, type OperationalSafetyCard, type OperationalSafetyStatus } from "@/lib/operational-safety-center";

export const dynamic = "force-dynamic";

function getStatusTone(status: OperationalSafetyStatus) {
  if (status === "blocked") return "urgent";
  if (status === "simulation_only") return "watch";

  return "neutral";
}

function formatStatus(status: OperationalSafetyStatus) {
  return status.replaceAll("_", " ");
}

function SafetyCard({ card }: { card: OperationalSafetyCard }) {
  return (
    <article className="rounded-lg border border-border bg-white p-4">
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="break-words text-base font-semibold text-primary">{card.title}</h2>
          <p className="mt-2 break-words text-sm leading-6 text-muted">{card.summary}</p>
        </div>
        <StatusBadge status={getStatusTone(card.status)} label={formatStatus(card.status)} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {card.flags.map((flag) => (
          <SafetyBadge key={`${card.id}-${flag}`} tone={flag.includes("false") ? "neutral" : "missing"}>
            {flag}
          </SafetyBadge>
        ))}
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Blocked capabilities</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted">
            {card.blockedCapabilities.map((capability) => (
              <li key={`${card.id}-${capability}`}>{capability}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-blue-900">Safe next step</p>
          <p className="mt-2 text-sm leading-6 text-blue-950">{card.safeNextStep}</p>
        </div>
      </div>
    </article>
  );
}

export default function DashboardSafetyPage() {
  const report = createOperationalSafetyCenterReport();

  return (
    <div className="space-y-6">
      <DashboardCard className="p-5 md:p-6">
        <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0 space-y-2">
            <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">Operational Safety</p>
            <h1 className="break-words text-3xl font-semibold text-primary">Safety Center</h1>
            <p className="max-w-4xl break-words text-sm leading-6 text-muted">{report.summary}</p>
          </div>
          <div className="flex max-w-full flex-wrap gap-2">
            <SafetyBadge>providerCalled:false</SafetyBadge>
            <SafetyBadge>outreachSent:false</SafetyBadge>
            <SafetyBadge>workflowTriggered:false</SafetyBadge>
            <SafetyBadge tone="urgent">generatedFacts:false</SafetyBadge>
          </div>
        </div>
      </DashboardCard>

      <div className="grid gap-4 xl:grid-cols-2">
        {report.cards.map((card) => (
          <SafetyCard key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}
