import { AiEmployeeToolboxReadinessDashboard } from "@/components/dashboard/ai-employee-toolbox-readiness-dashboard";
import { createAiEmployeeToolboxReadiness } from "@/lib/ai-employee-toolbox-readiness";

export const dynamic = "force-dynamic";

export default async function ToolboxReadinessPage() {
  const report = await createAiEmployeeToolboxReadiness();

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6">
      <AiEmployeeToolboxReadinessDashboard report={report} />
    </main>
  );
}
