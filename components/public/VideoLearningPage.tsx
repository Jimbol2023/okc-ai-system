import Link from "next/link";
import type { Route } from "next";

import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { JsonLdScript } from "@/components/public/JsonLdScript";
import type { PublicVideoPage } from "@/lib/public-video-pages";
import { createBreadcrumbListJsonLd, type BreadcrumbItem } from "@/lib/public-seo";

type VideoLearningPageProps = {
  page: PublicVideoPage;
};

export function VideoLearningPage({ page }: VideoLearningPageProps) {
  const breadcrumbs: BreadcrumbItem[] = [
    { name: "Home", path: "/" },
    { name: "Education Center", path: "/resources/education" },
    { name: "Videos", path: "/resources/videos" },
    { name: page.title }
  ];
  const videoAssetReady = page.videoAsset?.reviewStatus === "ready";
  const hasLessonGuide = Boolean(page.lessonGuide);

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
            <h1 className="mt-5 font-heading text-4xl font-bold leading-tight md:text-6xl">{page.title}</h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-white/82 md:text-lg">{page.summary}</p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24" aria-labelledby="video-heading">
        <div className="container-shell">
          <div className="mx-auto max-w-4xl">
            <div className="border border-slate-200 bg-[#F2F4F7] p-5 md:p-6">
              <h2 id="video-heading" className="font-heading text-2xl font-bold text-[#02213D]">
                {videoAssetReady ? "Short visual overview" : "Video production review"}
              </h2>
              {videoAssetReady ? (
                <>
                  <video
                    className="mt-5 aspect-video w-full max-w-[720px] bg-[#02213D]"
                    controls
                    preload="metadata"
                    src={page.videoAsset?.src}
                  >
                    <track kind="captions" />
                  </video>
                  <p className="mt-4 max-w-2xl text-sm leading-6 text-[#4B5563]">
                    This short visual overview introduces the topic. Full teaching notes and key takeaways are provided
                    below.
                  </p>
                </>
              ) : (
                <div className="mt-5 border border-dashed border-[#D4A017]/70 bg-white p-5">
                  <p className="text-base leading-7 text-[#4B5563]">
                    The corrected MP4 will appear here after Canva text, logo placement, and brand review are complete.
                    This page is already structured for the reviewed website video asset.
                  </p>
                  {page.videoAsset ? (
                    <p className="mt-4 text-sm font-semibold text-[#02213D]">
                      Target video length: {page.videoAsset.targetDuration}
                    </p>
                  ) : null}
                </div>
              )}
              <div className="mt-6 border-l-4 border-[#D4A017] bg-white p-5">
                <h3 className="font-heading text-xl font-bold text-[#02213D]">General educational guidance</h3>
                <p className="mt-3 text-sm leading-6 text-[#4B5563]">
                  This page is general information only. It is not legal, tax, financial, title, valuation, or property
                  repair advice.
                </p>
                {page.primaryCta ? (
                  <p className="mt-4 text-sm font-semibold leading-6 text-[#02213D]">{page.primaryCta}</p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      {page.lessonGuide ? (
        <LessonGuideContent lessonGuide={page.lessonGuide} page={page} />
      ) : (
        <>
          <section className="bg-[#F2F4F7] py-16 md:py-24" aria-labelledby="transcript-heading">
            <div className="container-shell">
              <div className="mx-auto max-w-4xl">
                <h2 id="transcript-heading" className="font-heading text-3xl font-bold text-[#02213D] md:text-5xl">
                  Transcript
                </h2>
                <ol className="mt-8 grid gap-4">
                  {page.transcript.map((line, index) => (
                    <li key={line} className="grid gap-3 bg-white p-5 shadow-sm md:grid-cols-[3rem_1fr]">
                      <span className="font-heading text-sm font-bold text-[#D4A017]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-base leading-7 text-[#4B5563]">{line}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>

          <section className="bg-white py-16 md:py-24" aria-labelledby="video-faq-heading">
            <div className="container-shell">
              <div className="mx-auto max-w-4xl">
                <h2 id="video-faq-heading" className="font-heading text-3xl font-bold text-[#02213D] md:text-5xl">
                  FAQ
                </h2>
                <div className="mt-8 grid gap-4 md:grid-cols-3">
                  {page.faqs.map((faq) => (
                    <article key={faq.question} className="border border-slate-200 bg-[#F2F4F7] p-5">
                      <h3 className="font-heading text-lg font-bold text-[#02213D]">{faq.question}</h3>
                      <p className="mt-3 text-sm leading-6 text-[#4B5563]">{faq.answer}</p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {page.secondaryWebsiteCta ? (
        <section className="bg-white py-16 md:py-24" aria-labelledby="website-cta-heading">
          <div className="container-shell">
            <div className="mx-auto max-w-4xl border-l-4 border-[#D4A017] bg-[#F2F4F7] p-6">
              <h2 id="website-cta-heading" className="font-heading text-2xl font-bold text-[#02213D]">
                Property discussion
              </h2>
              <p className="mt-3 text-base leading-7 text-[#4B5563]">{page.secondaryWebsiteCta}</p>
              <Link
                href={`/sell-your-house?source=video_${page.path.replace("/resources/videos/", "").replaceAll("-", "_")}_cta`}
                className="mt-5 inline-flex min-h-12 items-center justify-center rounded-md bg-[#D4A017] px-5 py-3 font-heading text-sm font-bold text-[#02213D] transition hover:bg-[#e0af2e]"
              >
                Open Property Discussion Form
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {!hasLessonGuide ? (
        <section className="bg-[#F2F4F7] py-16 md:py-24">
          <div className="container-shell">
            <div className="mx-auto max-w-4xl">
              <RelatedResourceSection page={page} />
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}

function LessonGuideContent({
  lessonGuide,
  page
}: {
  lessonGuide: NonNullable<PublicVideoPage["lessonGuide"]>;
  page: PublicVideoPage;
}) {
  return (
    <section className="bg-[#F2F4F7] py-16 md:py-24" aria-labelledby="lesson-guide-heading">
      <div className="container-shell">
        <article className="mx-auto max-w-4xl">
          <h2 id="lesson-guide-heading" className="font-heading text-3xl font-bold text-[#02213D] md:text-5xl">
            {lessonGuide.heading}
          </h2>
          <p className="mt-5 text-base leading-8 text-[#4B5563]">{lessonGuide.intro}</p>

          <div className="mt-10 grid gap-5">
            <section className="bg-white p-6 shadow-sm" aria-labelledby="lesson-summary-heading">
              <h3 id="lesson-summary-heading" className="font-heading text-2xl font-bold text-[#02213D]">
                Lesson Summary
              </h3>
              <p className="mt-3 text-base leading-7 text-[#4B5563]">{lessonGuide.lessonSummary}</p>
            </section>

            <section className="bg-white p-6 shadow-sm" aria-labelledby="voiceover-script-heading">
              <h3 id="voiceover-script-heading" className="font-heading text-2xl font-bold text-[#02213D]">
                Voiceover Script
              </h3>
              <div className="mt-4 grid gap-3">
                {page.transcript.map((line) => (
                  <p key={line} className="text-base leading-7 text-[#4B5563]">
                    {line}
                  </p>
                ))}
              </div>
            </section>

            <section className="bg-white p-6 shadow-sm" aria-labelledby="key-takeaways-heading">
              <h3 id="key-takeaways-heading" className="font-heading text-2xl font-bold text-[#02213D]">
                Key Takeaways
              </h3>
              <ul className="mt-4 grid gap-3">
                {lessonGuide.keyTakeaways.map((takeaway) => (
                  <li key={takeaway} className="border-l-4 border-[#D4A017] pl-4 text-base leading-7 text-[#4B5563]">
                    {takeaway}
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-white p-6 shadow-sm" aria-labelledby="common-questions-heading">
              <h3 id="common-questions-heading" className="font-heading text-2xl font-bold text-[#02213D]">
                Common Questions
              </h3>
              <div className="mt-4 grid gap-4">
                {lessonGuide.commonQuestions.map((item) => (
                  <article key={item.question} className="border border-slate-200 bg-[#F2F4F7] p-5">
                    <h4 className="font-heading text-lg font-bold text-[#02213D]">Q: {item.question}</h4>
                    <p className="mt-3 text-sm leading-6 text-[#4B5563]">A: {item.answer}</p>
                  </article>
                ))}
              </div>
            </section>

            <RelatedResourceSection page={page} />

            <section className="bg-white p-6 shadow-sm" aria-labelledby="educational-disclaimer-heading">
              <h3 id="educational-disclaimer-heading" className="font-heading text-2xl font-bold text-[#02213D]">
                Educational Disclaimer
              </h3>
              <p className="mt-3 text-base leading-7 text-[#4B5563]">{lessonGuide.educationalDisclaimer}</p>
            </section>
          </div>
        </article>
      </div>
    </section>
  );
}

function RelatedResourceSection({ page }: { page: PublicVideoPage }) {
  return (
    <section className="bg-white p-6 shadow-sm" aria-labelledby="video-related-heading">
      <h3 id="video-related-heading" className="font-heading text-2xl font-bold text-[#02213D]">
        Related Resources
      </h3>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {page.relatedResources.map((resource) => (
          <Link
            key={resource.href}
            href={resource.href as Route}
            className="border border-slate-200 bg-[#F2F4F7] p-5 shadow-sm transition hover:bg-[#eef1f5]"
          >
            <span className="block font-heading text-lg font-bold text-[#02213D]">{resource.label}</span>
            <span className="mt-2 block text-sm leading-6 text-[#4B5563]">{resource.description}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
