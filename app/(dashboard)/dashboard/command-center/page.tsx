import { CeoOperatingScorecard } from "@/components/dashboard/ceo-operating-scorecard";
import { createCeoOperatingScorecard } from "@/lib/ceo-operating-scorecard";

export const dynamic = "force-dynamic";

export default async function CommandCenterPage() {
  const report = await createCeoOperatingScorecard();

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6">
      <CeoOperatingScorecard report={report} />
    </main>
  );
}
