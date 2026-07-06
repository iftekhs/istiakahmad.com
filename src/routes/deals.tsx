import { createFileRoute } from "@tanstack/react-router";
import { Tag } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { DealsGrid, useDealsConfig } from "@/components/DiscountedDeals";
import { getActiveDeals } from "@/lib/cms.functions";
import { absUrl, buildBreadcrumbSchema, buildDealsListSchema, ldScript } from "@/lib/seo";

export const Route = createFileRoute("/deals")({
  loader: async () => {
    const deals = await getActiveDeals();
    return { deals };
  },
  head: ({ loaderData }) => {
    const title = "Discounted Deals | Istiak Ahmad";
    const desc =
      "Limited-time discounted products and services from Istiak Ahmad. Tap WhatsApp on any deal to grab yours.";
    const url = absUrl("/deals");
    const deals = loaderData?.deals ?? [];

    const scripts: Array<any> = [
      ldScript(buildDealsListSchema(deals, "/deals")),
      ldScript(
        buildBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Deals", url: "/deals" },
        ]),
      ),
    ];

    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts,
    };
  },
  component: DealsPage,
});

function DealsPage() {
  const { heading, subheading } = useDealsConfig();
  return (
    <PageShell>
      <section className="relative pt-32 pb-12 sm:pt-40 sm:pb-16">
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-background" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full glass px-3 py-1.5 text-xs font-medium">
            <Tag className="h-3.5 w-3.5 text-[color:var(--ph)]" /> Limited Offers
          </span>
          <h1 className="mt-6 font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            <span className="text-gradient-brand">{heading}</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground">
            {subheading}
          </p>
        </div>
      </section>

      <section className="pb-24 sm:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <DealsGrid />
        </div>
      </section>
    </PageShell>
  );
}
