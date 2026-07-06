import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Package } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { ProductDetail } from "@/components/ProductDetail";
import { useProductsConfig } from "@/components/Products";
import { getActiveProducts, getProductBySlug } from "@/lib/cms.functions";
import {
  absUrl,
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildProductSchema,
  buildVideoSchema,
  ldScript,
} from "@/lib/seo";

export const Route = createFileRoute("/products/$slug")({
  loader: async ({ params }) => {
    const product = await getProductBySlug({ data: { slug: params.slug } });
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData, params }) => {
    const p = loaderData?.product;
    if (!p) return { meta: [{ title: "Product not found" }] };
    const title = `${p.name} | Istiak Ahmad`;
    const desc = p.short_description || p.tagline || `Learn more about ${p.name}.`;
    const url = `/products/${params.slug}`;
    const absoluteUrl = absUrl(url);
    const image = p.banner_url ? absUrl(p.banner_url) : undefined;

    const meta: Array<Record<string, string>> = [
      { title },
      { name: "description", content: desc },
      { property: "og:title", content: title },
      { property: "og:description", content: desc },
      { property: "og:url", content: absoluteUrl },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: desc },
    ];
    if (image) {
      meta.push({ property: "og:image", content: image });
      meta.push({ name: "twitter:image", content: image });
    }

    const scripts: Array<any> = [
      ldScript(buildProductSchema(p)),
      ldScript(
        buildBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Products", url: "/products" },
          { name: p.name, url },
        ]),
      ),
    ];
    const faq = buildFaqSchema(p.faqs);
    if (faq) scripts.push(ldScript(faq));
    const video = buildVideoSchema(p);
    if (video) scripts.push(ldScript(video));

    return {
      meta,
      links: [{ rel: "canonical", href: absoluteUrl }],
      scripts,
    };
  },
  notFoundComponent: ProductNotFound,
  errorComponent: ProductError,
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { whatsappTarget } = useProductsConfig();
  const fetchAll = useServerFn(getActiveProducts);
  const { data: all = [] } = useQuery({
    queryKey: ["active-products"],
    queryFn: () => fetchAll(),
    staleTime: 60_000,
  });
  const related = all.filter((p) => p.id !== product.id);

  return (
    <PageShell>
      <ProductDetail product={product} whatsappTarget={whatsappTarget} related={related} />
    </PageShell>
  );
}

function ProductNotFound() {
  return (
    <PageShell>
      <section className="min-h-[60dvh] grid place-items-center px-4">
        <div className="text-center max-w-md">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h1 className="font-display text-3xl font-bold">Product not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The product you're looking for doesn't exist or isn't available right now.
          </p>
          <Link
            to="/products"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-white"
          >
            Browse all products
          </Link>
        </div>
      </section>
    </PageShell>
  );
}

function ProductError({ error }: { error: Error }) {
  return (
    <PageShell>
      <section className="min-h-[60dvh] grid place-items-center px-4">
        <div className="text-center max-w-md">
          <h1 className="font-display text-2xl font-bold">Couldn't load this product</h1>
          <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        </div>
      </section>
    </PageShell>
  );
}
