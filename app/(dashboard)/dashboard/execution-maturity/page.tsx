import { ControlledExecutionMaturityDashboard } from "@/components/dashboard/controlled-execution-maturity-dashboard";
import { createControlledExecutionMaturityReport } from "@/lib/controlled-execution-maturity";

export const dynamic = "force-dynamic";

export default async function ExecutionMaturityPage() {
  const report = await createControlledExecutionMaturityReport();

  return <ControlledExecutionMaturityDashboard report={report} />;
}
