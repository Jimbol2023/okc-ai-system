import { FinanceWorkspaceClient } from "@/components/dashboard/finance-workspace-client";

export default function FinancePage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted">Finance Department</p>
        <h1 className="break-words text-3xl font-semibold text-primary">Manual KPI and profit tracking</h1>
        <p className="max-w-3xl break-words text-sm leading-6 text-muted">
          Track marketing spend, cost per lead, cost per acquisition, gross profit, cash flow, and monthly notes from manually entered records only. This is not accounting software and does not automate spend.
        </p>
      </div>
      <FinanceWorkspaceClient />
    </div>
  );
}
