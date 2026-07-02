import { DashboardCard, SafetyBadge, StatusBadge } from "@/components/dashboard/dashboard-ui";
import { createCorePlatformRegistryReport, type CorePlatformStatus } from "@/lib/core-platform-registry";

export const dynamic = "force-dynamic";

function statusTone(status: CorePlatformStatus) {
  if (status === "blocked") return "urgent";
  if (status === "partial" || status === "planned") return "watch";
  return "neutral";
}

function formatLabel(value: string) {
  return value.replaceAll("_", " ");
}

export default function PlatformRegistryPage() {
  const report = createCorePlatformRegistryReport();

  return (
    <div className="space-y-6">
      <DashboardCard className="p-5 md:p-6">
        <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0 space-y-2">
            <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">AI OS Registry</p>
            <h1 className="break-words text-3xl font-semibold text-primary">Core Platform Registry</h1>
            <p className="max-w-4xl break-words text-sm leading-6 text-muted">{report.summary}</p>
          </div>
          <div className="flex max-w-full flex-wrap gap-2">
            <SafetyBadge>providerCalled:false</SafetyBadge>
            <SafetyBadge>liveExecution:false</SafetyBadge>
            <SafetyBadge>core:{report.totals.corePlatforms}</SafetyBadge>
            <SafetyBadge>modules:{report.totals.businessModules}</SafetyBadge>
          </div>
        </div>
      </DashboardCard>

      <section className="grid gap-4 md:grid-cols-4">
        <DashboardCard>
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted">Core Platforms</p>
          <p className="mt-2 text-3xl font-semibold text-primary">{report.totals.corePlatforms}</p>
        </DashboardCard>
        <DashboardCard>
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted">Ready</p>
          <p className="mt-2 text-3xl font-semibold text-primary">{report.totals.readyCorePlatforms}</p>
        </DashboardCard>
        <DashboardCard>
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted">Installed Modules</p>
          <p className="mt-2 text-3xl font-semibold text-primary">{report.totals.installedBusinessModules}</p>
        </DashboardCard>
        <DashboardCard>
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted">Planned Modules</p>
          <p className="mt-2 text-3xl font-semibold text-primary">{report.totals.plannedBusinessModules}</p>
        </DashboardCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        {report.corePlatforms.map((platform) => (
          <article key={platform.key} className="rounded-lg border border-border bg-white p-4">
            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="break-words text-sm font-semibold uppercase tracking-[0.12em] text-muted">{formatLabel(platform.category)}</p>
                <h2 className="mt-1 break-words text-lg font-semibold text-primary">{platform.name}</h2>
                <p className="mt-2 break-words text-sm leading-6 text-muted">{platform.purpose}</p>
              </div>
              <StatusBadge status={statusTone(platform.status)} label={platform.status} />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {platform.capabilities.slice(0, 5).map((capability) => (
                <SafetyBadge key={`${platform.key}-${capability}`}>{capability}</SafetyBadge>
              ))}
            </div>

            <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-3">
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-blue-900">High ROI reason</p>
              <p className="mt-2 text-sm leading-6 text-blue-950">{platform.highRoiReason}</p>
            </div>
          </article>
        ))}
      </section>

      <DashboardCard>
        <h2 className="break-words text-xl font-semibold text-primary">Next High-ROI Moves</h2>
        <ol className="mt-4 space-y-3">
          {report.nextHighRoiMoves.map((move, index) => (
            <li key={move} className="rounded-lg border border-border bg-white p-3 text-sm leading-6 text-muted">
              <span className="font-semibold text-primary">{index + 1}. </span>
              {move}
            </li>
          ))}
        </ol>
      </DashboardCard>
    </div>
  );
}
