import { PropertyResourceArticlePage } from "@/components/public/PropertyResourceArticlePage";
import { createPublicPageMetadata } from "@/lib/public-seo";
import { resourcePagesByPath } from "@/lib/public-resource-pages";

const page = resourcePagesByPath["/resources/shared-inherited-property-oklahoma"];

export const metadata = createPublicPageMetadata({
  path: page.path,
  title: page.title,
  description: page.description
});

export default function SharedInheritedPropertyOklahomaPage() {
  return <PropertyResourceArticlePage page={page} />;
}
