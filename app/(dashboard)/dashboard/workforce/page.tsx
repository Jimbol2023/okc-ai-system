import { AiWorkforceDashboard } from "@/components/dashboard/ai-workforce-dashboard";
import { createAiWorkforceReport } from "@/lib/ai-workforce";

export const dynamic = "force-dynamic";

export default async function WorkforcePage() {
  const report = await createAiWorkforceReport();

  return <AiWorkforceDashboard report={report} />;
}
