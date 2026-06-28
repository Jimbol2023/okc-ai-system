export type DashboardStatus = "good" | "watch" | "urgent" | "missing" | "neutral";

export function getDashboardStatusLabel(status: DashboardStatus) {
  if (status === "good") return "Healthy";
  if (status === "watch") return "Watch";
  if (status === "urgent") return "Needs Attention";
  if (status === "missing") return "Missing";

  return "Ready";
}

export function getDashboardStatusClasses(status: DashboardStatus) {
  if (status === "urgent") return "border-red-200 bg-red-50 text-red-900";
  if (status === "watch") return "border-amber-200 bg-amber-50 text-amber-900";
  if (status === "missing") return "border-slate-200 bg-slate-50 text-slate-700";
  if (status === "neutral") return "border-blue-200 bg-blue-50 text-blue-900";

  return "border-emerald-200 bg-emerald-50 text-emerald-900";
}

export function getDashboardStatusColor(status: DashboardStatus) {
  if (status === "urgent") return "#dc2626";
  if (status === "watch") return "#d97706";
  if (status === "missing") return "#64748b";
  if (status === "neutral") return "#2563eb";

  return "#059669";
}
