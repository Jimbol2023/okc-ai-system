import Link from "next/link";
import type { Route } from "next";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { clsx } from "clsx";

import { getDashboardStatusClasses, getDashboardStatusLabel, type DashboardStatus } from "@/lib/dashboard-ui-status";

const focusClasses = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export function DashboardCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={clsx("rounded-lg border border-border bg-surface p-4", className)}>{children}</div>;
}

export function StatusBadge({ status, label }: { status: DashboardStatus; label?: string }) {
  return (
    <span className={clsx("inline-flex max-w-full items-center rounded-full border px-2 py-1 text-xs font-bold leading-5", getDashboardStatusClasses(status))}>
      {label ?? getDashboardStatusLabel(status)}
    </span>
  );
}

export function SafetyBadge({ children, tone = "neutral" }: { children: ReactNode; tone?: DashboardStatus }) {
  return (
    <span className={clsx("inline-flex max-w-full items-center rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.08em]", getDashboardStatusClasses(tone))}>
      {children}
    </span>
  );
}

export function ActionButton({
  children,
  href,
  className = "",
  ...buttonProps
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  href?: string;
  className?: string;
}) {
  const classes = clsx(
    "inline-flex min-h-10 items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition hover:bg-primary-strong disabled:cursor-not-allowed disabled:opacity-70",
    focusClasses,
    className,
  );

  if (href) {
    return (
      <Link href={href as Route} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button {...buttonProps} className={classes}>
      {children}
    </button>
  );
}

export function EmptyState({ title, detail, action }: { title: string; detail?: string; action?: ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-white p-4 text-sm">
      <p className="font-semibold text-primary">{title}</p>
      {detail ? <p className="mt-1 leading-6 text-muted">{detail}</p> : null}
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  );
}

export function LoadingState({ label = "Loading..." }: { label?: string }) {
  return (
    <div aria-live="polite" className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm font-semibold text-muted">
      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      {label}
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div role="alert" className="flex min-w-0 items-start gap-2 rounded-lg border border-red-100 bg-red-50 p-3 text-sm font-semibold text-red-700">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <span className="break-words">{message}</span>
    </div>
  );
}

export function DataTableShell({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-border bg-surface p-4">
      <div className="min-w-0">
        <h2 className="break-words text-xl font-semibold text-primary">{title}</h2>
        {description ? <p className="mt-2 break-words text-sm leading-6 text-muted">{description}</p> : null}
      </div>
      <div className="mt-4 overflow-x-auto">{children}</div>
    </section>
  );
}
