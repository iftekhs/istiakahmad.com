import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { Package } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { ProductCard, useProductsConfig } from "@/components/Products";
import { getActiveProducts } from "@/lib/cms.functions";
import { absUrl, buildBreadcrumbSchema, buildProductCollectionSchema, ldScript } from "@/lib/seo";

export const Route = createFileRoute("/products")({
  loader: async () => {
    const products = await getActiveProducts();
    return { products };
  },
  head: ({ loaderData }) => {
    const title = "Products | Istiak Ahmad";
    const desc =
      "Explore products and services built by Istiak Ahmad. Detailed walkthroughs, transparent pricing, and WhatsApp support on every listing.";
    const url = absUrl("/products");
    const products = loaderData?.products ?? [];

    const scripts: Array<any> = [
      ldScript(buildProductCollectionSchema(products, "/products")),
      ldScript(
        buildBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Products", url: "/products" },
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
  component: ProductsPage,
});

function ProductsPage() {
  const location = useLocation();
  const { heading, subheading, enabled } = useProductsConfig();
  const fetchProducts = useServerFn(getActiveProducts);
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["active-products"],
    queryFn: () => fetchProducts(),
    staleTime: 60_000,
    enabled,
  });

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.category && set.add(p.category));
    return Array.from(set);
  }, [products]);

  const [active, setActive] = useState<string | null>(null);
  const filtered = active ? products.filter((p) => p.category === active) : products;

  if (location.pathname !== "/products") {
    return <Outlet />;
  }

  return (
    <PageShell>
      <section className="relative pt-32 pb-12 sm:pt-40 sm:pb-16">
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-background" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full glass px-3 py-1.5 text-xs font-medium">
            <Package className="h-3.5 w-3.5 text-[color:var(--ph)]" /> Products
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
        <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-6">
          {!enabled ? (
            <div className="glass-strong rounded-2xl p-10 text-center">
              <p className="text-sm text-muted-foreground">
                Products are currently unavailable. Please check back soon.
              </p>
            </div>
          ) : isLoading ? (
            <p className="text-sm text-muted-foreground text-center py-10">Loading products…</p>
          ) : products.length === 0 ? (
            <div className="glass-strong rounded-2xl p-10 text-center">
              <Package className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                New products are on the way — check back soon.
              </p>
            </div>
          ) : (
            <>
              {categories.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    onClick={() => setActive(null)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                      active === null
                        ? "bg-gradient-brand text-white shadow"
                        : "glass text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    All
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => setActive(c)}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                        active === c
                          ? "bg-gradient-brand text-white shadow"
                          : "glass text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}

              {filtered.length === 0 ? (
                <div className="glass-strong rounded-2xl p-10 text-center">
                  <p className="text-sm text-muted-foreground">No products in this category.</p>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </PageShell>
  );
}
