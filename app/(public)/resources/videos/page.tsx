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
    "Transcript-first Oklahoma property education pages ready for future Canva, Loom, or YouTube videos."
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
              Property education built for future video
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-white/82 md:text-lg">
              These pages provide summaries, transcripts, FAQs, and related resources now. Canva, Loom, or YouTube
              embeds can be added later without redesigning the Education Center.
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
              Transcript-first pages help visitors learn today and give future recorded presentations a permanent
              home.
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
                <span className="mt-3 block text-sm leading-6 text-[#4B5563]">{page.summary}</span>
                <span className="mt-5 inline-flex min-h-11 items-center rounded-md bg-white px-4 py-2 font-heading text-sm font-bold text-[#02213D]">
                  Open Lesson
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F2F4F7] py-16 md:py-24" aria-labelledby="future-video-heading">
        <div className="container-shell">
          <div className="mx-auto max-w-4xl border-l-4 border-[#D4A017] bg-white p-6 shadow-sm">
            <h2 id="future-video-heading" className="font-heading text-2xl font-bold text-[#02213D]">
              Future video-ready structure
            </h2>
            <p className="mt-3 text-base leading-7 text-[#4B5563]">
              Each lesson has a reserved video area, transcript, FAQ, and related links. When final video URLs are
              ready, the embed can be added without changing the page purpose or internal linking strategy.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
