import { PropertyResourceArticlePage } from "@/components/public/PropertyResourceArticlePage";
import { createPublicPageMetadata } from "@/lib/public-seo";
import { resourcePagesByPath } from "@/lib/public-resource-pages";

const page = resourcePagesByPath["/resources/education/probate-basics-oklahoma-property-owners"];

export const metadata = createPublicPageMetadata({
  path: page.path,
  title: page.title,
  description: page.description
});

export default function ProbateBasicsOklahomaPropertyOwnersPage() {
  return <PropertyResourceArticlePage page={page} />;
}
