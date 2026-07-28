import { DailyRevenueOperatingLoopDashboard } from "@/components/dashboard/daily-revenue-operating-loop-dashboard";
import { createDailyRevenueOperatingLoop } from "@/lib/daily-revenue-operating-loop";

export const dynamic = "force-dynamic";

export default async function DailyRevenuePage() {
  const report = await createDailyRevenueOperatingLoop();

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6">
      <DailyRevenueOperatingLoopDashboard report={report} />
    </main>
  );
}
