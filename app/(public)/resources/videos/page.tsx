import Link from "next/link";
import type { Route } from "next";

import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { JsonLdScript } from "@/components/public/JsonLdScript";
import { createBreadcrumbListJsonLd, createPublicPageMetadata, type BreadcrumbItem } from "@/lib/public-seo";
import { publicVideoPages } from "@/lib/public-video-pages";

export const metadata = createPublicPageMetadata({
  path: "/resources/videos",
  title: "Video Learning Center",
  description:
    "Property education videos and lesson guides for Oklahoma property owners."
});

const breadcrumbs: BreadcrumbItem[] = [
  { name: "Home", path: "/" },
  { name: "Education Center", path: "/resources/education" },
  { name: "Videos" }
];

export default function VideoLearningCenterPage() {
  return (
    <div className="bg-white">
      <JsonLdScript data={createBreadcrumbListJsonLd(breadcrumbs)} />
      <section className="bg-[#02213D] py-16 text-white md:py-24">
        <div className="container-shell">
          <Breadcrumbs items={breadcrumbs} />
          <div className="max-w-4xl">
            <p className="font-heading text-xs font-bold uppercase tracking-[0.22em] text-[#D4A017]">
              Video Learning Center
            </p>
            <h1 className="mt-5 font-heading text-4xl font-bold leading-tight md:text-6xl">
              Property education videos and lesson guides
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-white/82 md:text-lg">
              Property education videos and lesson guides for Oklahoma property owners who want to organize practical
              questions before making decisions.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24" aria-labelledby="video-pages-heading">
        <div className="container-shell">
          <div className="mx-auto max-w-3xl text-center">
            <h2 id="video-pages-heading" className="font-heading text-3xl font-bold text-[#02213D] md:text-5xl">
              Initial video lessons
            </h2>
            <p className="mt-4 text-base leading-7 text-[#4B5563]">
              Start with short visual overviews, teaching notes, FAQs, and related resources for common property
              situations.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {publicVideoPages.map((page) => (
              <Link
                key={page.path}
                href={page.path as Route}
                className="border border-slate-200 bg-[#F2F4F7] p-6 transition hover:bg-[#e7ebf0]"
              >
                <span className="block font-heading text-xl font-bold text-[#02213D]">{page.title}</span>
                <span className="mt-3 inline-flex min-h-8 items-center rounded-md bg-white px-3 py-1 font-heading text-xs font-bold uppercase tracking-[0.16em] text-[#4B5563]">
                  {page.videoAsset?.reviewStatus === "ready" ? "Short overview available" : "Lesson guide available"}
                </span>
                <span className="mt-3 block text-sm leading-6 text-[#4B5563]">{page.summary}</span>
                <span className="mt-5 inline-flex min-h-11 items-center rounded-md bg-white px-4 py-2 font-heading text-sm font-bold text-[#02213D]">
                  View Lesson Guide
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F2F4F7] py-16 md:py-24" aria-labelledby="video-guide-heading">
        <div className="container-shell">
          <div className="mx-auto max-w-4xl border-l-4 border-[#D4A017] bg-white p-6 shadow-sm">
            <h2 id="video-guide-heading" className="font-heading text-2xl font-bold text-[#02213D]">
              Education-first lesson structure
            </h2>
            <p className="mt-3 text-base leading-7 text-[#4B5563]">
              Each lesson is designed to support learning first with a short visual overview when available, practical
              teaching notes, common questions, related resources, and clear educational disclaimers.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
