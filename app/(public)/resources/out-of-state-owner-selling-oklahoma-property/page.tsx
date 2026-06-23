import { PropertyResourceArticlePage } from "@/components/public/PropertyResourceArticlePage";
import { createPublicPageMetadata } from "@/lib/public-seo";
import { resourcePagesByPath } from "@/lib/public-resource-pages";

const page = resourcePagesByPath["/resources/out-of-state-owner-selling-oklahoma-property"];

export const metadata = createPublicPageMetadata({
  path: page.path,
  title: page.title,
  description: page.description
});

export default function OutOfStateOwnerSellingOklahomaPropertyPage() {
  return <PropertyResourceArticlePage page={page} />;
}
