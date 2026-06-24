import Link from "next/link";
import type { Route } from "next";

import type { BreadcrumbItem } from "@/lib/public-seo";

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  variant?: "dark" | "light";
};

export function Breadcrumbs({ items, variant = "dark" }: BreadcrumbsProps) {
  const textClass = variant === "dark" ? "text-white/78" : "text-[#4B5563]";
  const linkClass =
    variant === "dark"
      ? "underline underline-offset-4 transition hover:text-white"
      : "underline underline-offset-4 transition hover:text-[#02213D]";
  const separatorClass = variant === "dark" ? "text-white/45" : "text-[#94A3B8]";

  return (
    <nav aria-label="Breadcrumb" className={`mb-8 text-sm font-semibold ${textClass}`}>
      <ol className="flex flex-wrap items-center gap-y-2">
        {items.map((item, index) => (
          <li key={`${item.name}-${index}`} className="flex items-center">
            {index > 0 ? (
              <span aria-hidden="true" className={`mx-2 ${separatorClass}`}>
                /
              </span>
            ) : null}
            {index === items.length - 1 ? (
              <span aria-current="page">{item.name}</span>
            ) : (
              <Link href={item.path as Route} className={linkClass}>
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
