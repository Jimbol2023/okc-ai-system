import { DailyRevenueOperatingLoopDashboard } from "@/components/dashboard/daily-revenue-operating-loop-dashboard";
import { createDailyRevenueOperatingLoop } from "@/lib/daily-revenue-operating-loop";
import { requireAuthenticatedServerTenant } from "@/lib/server-tenant-context";

export const dynamic = "force-dynamic";

export default async function DailyRevenuePage() {
  const actor = await requireAuthenticatedServerTenant();
  const report = await createDailyRevenueOperatingLoop(actor.tenantId);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6">
      <DailyRevenueOperatingLoopDashboard report={report} />
    </main>
  );
}
