import { CeoOperatingScorecard } from "@/components/dashboard/ceo-operating-scorecard";
import { createCeoOperatingScorecard } from "@/lib/ceo-operating-scorecard";
import { requireAuthenticatedServerTenant } from "@/lib/server-tenant-context";

export const dynamic = "force-dynamic";

export default async function CommandCenterPage() {
  const actor = await requireAuthenticatedServerTenant();
  const report = await createCeoOperatingScorecard(actor.tenantId);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6">
      <CeoOperatingScorecard report={report} />
    </main>
  );
}
