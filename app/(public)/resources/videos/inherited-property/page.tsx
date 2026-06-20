import { VideoLearningPage } from "@/components/public/VideoLearningPage";
import { createPublicPageMetadata } from "@/lib/public-seo";
import { publicVideoPagesByPath } from "@/lib/public-video-pages";

const page = publicVideoPagesByPath["/resources/videos/inherited-property"];

export const metadata = createPublicPageMetadata({
  path: page.path,
  title: page.title,
  description: page.description
});

export default function InheritedPropertyVideoPage() {
  return <VideoLearningPage page={page} />;
}
