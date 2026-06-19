import { PropertyResourceArticlePage } from "@/components/public/PropertyResourceArticlePage";
import { createPublicPageMetadata } from "@/lib/public-seo";
import { resourcePagesByPath } from "@/lib/public-resource-pages";

const page = resourcePagesByPath["/resources/vacant-property-oklahoma"];

export const metadata = createPublicPageMetadata({
  path: page.path,
  title: page.title,
  description: page.description
});

export default function VacantPropertyOklahomaPage() {
  return <PropertyResourceArticlePage page={page} />;
}
