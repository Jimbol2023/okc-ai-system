type DecisionReasonListProps = {
  reasons?: string[];
  rejectedOptions?: string[];
  missingData?: string[];
  riskFactors?: string[];
  executionBlockers?: string[];
};

function ReasonGroup({
  title,
  items,
  marker = "-",
  prominent = false,
}: {
  title: string;
  items?: string[];
  marker?: string;
  prominent?: boolean;
}) {
  const visibleItems = items?.filter(Boolean) ?? [];

  return (
    <div className={`rounded-lg border p-3 ${prominent ? "border-slate-300 bg-slate-50" : "border-slate-200 bg-white"}`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
      {visibleItems.length > 0 ? (
        <ul className="mt-2 space-y-2">
          {visibleItems.slice(0, 5).map((item) => (
            <li key={item} className="flex gap-2 text-sm leading-5 text-slate-700">
              <span className="shrink-0 text-sm" aria-hidden="true">{marker}</span>
              <span className={prominent ? "font-medium text-slate-900" : ""}>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-slate-500">None detected.</p>
      )}
    </div>
  );
}

export function DecisionReasonList({
  reasons,
  rejectedOptions,
  missingData,
  riskFactors,
  executionBlockers,
}: DecisionReasonListProps) {
  const primaryDrivers = reasons?.slice(0, 3) ?? [];
  const supportingReasons = reasons?.slice(3) ?? [];

  return (
    <div className="space-y-3">
      <ReasonGroup title="Strong signal - Primary drivers" items={primaryDrivers} marker="*" prominent />
      {supportingReasons.length > 0 ? (
        <ReasonGroup title="Supporting reasons" items={supportingReasons} />
      ) : null}
      <div className="grid gap-3 md:grid-cols-2">
        <ReasonGroup title="Risk - Risk factors" items={riskFactors} marker="!" />
        <ReasonGroup title="Blockers" items={executionBlockers} marker="x" />
        <ReasonGroup title="Missing data" items={missingData} marker="?" />
      </div>
      {rejectedOptions && rejectedOptions.length > 0 ? (
        <ReasonGroup title="Rejected - Other options" items={rejectedOptions} marker="x" />
      ) : null}
    </div>
  );
}
