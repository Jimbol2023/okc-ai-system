import Link from "next/link";
import type { Route } from "next";

import { serviceAreaList } from "@/lib/public-service-areas";

type ServiceAreaLinksProps = {
  variant?: "light" | "white";
};

export function ServiceAreaLinks({ variant = "light" }: ServiceAreaLinksProps) {
  const itemClass =
    variant === "white"
      ? "border border-slate-200 bg-white p-4 shadow-sm transition hover:bg-[#F8FAFC]"
      : "border border-slate-200 bg-[#F2F4F7] p-4 transition hover:bg-[#e7ebf0]";

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {serviceAreaList.map((area) => (
        <Link key={area.slug} href={area.slug as Route} className={itemClass}>
          <span className="block font-heading text-base font-bold text-[#02213D]">{area.city}</span>
          <span className="mt-1 block text-sm leading-6 text-[#4B5563]">Property guidance in {area.city}</span>
        </Link>
      ))}
    </div>
  );
}
