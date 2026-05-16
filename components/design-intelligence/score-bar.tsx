import type { ScoreTone } from "@/types/design-intelligence";

type ScoreBarProps = {
  label: string;
  score?: number | null;
  tone?: ScoreTone;
  suffix?: string;
};

const toneStyles: Record<ScoreTone, string> = {
  positive: "bg-emerald-600",
  caution: "bg-amber-500",
  warning: "bg-orange-500",
  danger: "bg-red-600",
  strategic: "bg-blue-600",
  neutral: "bg-slate-500",
};

function normalizeScore(score?: number | null) {
  return typeof score === "number" && Number.isFinite(score)
    ? Math.max(0, Math.min(100, Math.round(score)))
    : null;
}

export function ScoreBar({ label, score, tone = "neutral", suffix = "/100" }: ScoreBarProps) {
  const normalizedScore = normalizeScore(score);
  const width = normalizedScore ?? 0;

  return (
    <div className="space-y-2" aria-label={`${label}: ${normalizedScore ?? "missing"}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
        <p className="text-sm font-semibold text-slate-900">
          {normalizedScore === null ? "Missing" : `${normalizedScore}${suffix}`}
        </p>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${toneStyles[tone]}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}
