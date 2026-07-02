import { DashboardCard, SafetyBadge, StatusBadge } from "@/components/dashboard/dashboard-ui";
import { createCorePlatformRegistryReport, type BusinessModuleMarketplaceItem } from "@/lib/core-platform-registry";

export const dynamic = "force-dynamic";

function moduleTone(module: BusinessModuleMarketplaceItem) {
  if (module.safetyStatus === "blocked") return "urgent";
  if (module.status === "installed") return "neutral";
  return "watch";
}

function formatLabel(value: string) {
  return value.replaceAll("_", " ");
}

export default function BusinessModulesPage() {
  const report = createCorePlatformRegistryReport();

  return (
    <div className="space-y-6">
      <DashboardCard className="p-5 md:p-6">
        <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0 space-y-2">
            <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">Business Modules</p>
            <h1 className="break-words text-3xl font-semibold text-primary">Module Marketplace</h1>
            <p className="max-w-4xl break-words text-sm leading-6 text-muted">
              Installable business modules declare their capabilities, required connectors, permissions, source tracking, and safety status before activation.
            </p>
          </div>
          <div className="flex max-w-full flex-wrap gap-2">
            <SafetyBadge>installed:{report.totals.installedBusinessModules}</SafetyBadge>
            <SafetyBadge>planned:{report.totals.plannedBusinessModules}</SafetyBadge>
            <SafetyBadge>providerCalled:false</SafetyBadge>
            <SafetyBadge tone="urgent">liveExecution:false</SafetyBadge>
          </div>
        </div>
      </DashboardCard>

      <section className="grid gap-4 xl:grid-cols-2">
        {report.businessModules.map((module) => (
          <article key={module.moduleKey} className="rounded-lg border border-border bg-white p-4">
            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="break-words text-sm font-semibold uppercase tracking-[0.12em] text-muted">{module.industry}</p>
                <h2 className="mt-1 break-words text-lg font-semibold text-primary">{module.displayName}</h2>
                <p className="mt-2 break-words text-sm leading-6 text-muted">{module.highRoiReason}</p>
              </div>
              <StatusBadge status={moduleTone(module)} label={formatLabel(module.status)} />
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Capabilities</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted">
                  {module.capabilities.map((capability) => (
                    <li key={`${module.moduleKey}-${capability}`}>{capability}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-blue-900">Permissions</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-blue-950">
                  {module.requiredPermissions.map((permission) => (
                    <li key={`${module.moduleKey}-${permission}`}>{permission}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <SafetyBadge>safety:{module.safetyStatus}</SafetyBadge>
              <SafetyBadge>sourceTracking:{String(module.sourceTrackingRequired)}</SafetyBadge>
              <SafetyBadge>approvalRequired:true</SafetyBadge>
              {module.requiredConnectors.slice(0, 4).map((connector) => (
                <SafetyBadge key={`${module.moduleKey}-${connector}`}>{connector}</SafetyBadge>
              ))}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
