import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Package, Sparkles, Tag } from "lucide-react";
import { getActiveProducts } from "@/lib/cms.functions";
import { useSiteSettings } from "@/hooks/use-cms";
import { useReveal } from "@/hooks/use-reveal";
import { formatPrice, type Product } from "@/lib/products.shared";

export function useProductsConfig() {
  const settings = useSiteSettings();
  const cfg = ((settings as any)?.links?.productsConfig ?? {}) as {
    enabled?: string | boolean;
    heading?: string;
    subheading?: string;
  };
  const enabled =
    cfg.enabled === undefined || cfg.enabled === "" || cfg.enabled === true || cfg.enabled === "true";
  return {
    enabled,
    heading: cfg.heading || "Our Products",
    subheading:
      cfg.subheading ||
      "Battle-tested products built for makers and founders. Tap any product to see the full details.",
    whatsappTarget: settings.links?.whatsapp || "",
  };
}

function priceLabel(p: Product) {
  if (p.pricing_mode === "quote_only" || p.price === null) return "Get a Quote";
  if (p.pricing_mode === "from") return `From ${formatPrice(p.price, p.currency)}`;
  return formatPrice(p.price, p.currency);
}

export function ProductsGrid() {
  const { enabled } = useProductsConfig();
  const fetchProducts = useServerFn(getActiveProducts);
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["active-products"],
    queryFn: () => fetchProducts(),
    staleTime: 60_000,
    enabled,
  });

  if (!enabled) {
    return (
      <div className="glass-strong rounded-2xl p-10 text-center">
        <p className="text-sm text-muted-foreground">
          Products are currently unavailable. Please check back soon.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return <p className="text-sm text-muted-foreground text-center py-10">Loading products…</p>;
  }

  if (products.length === 0) {
    return (
      <div className="glass-strong rounded-2xl p-10 text-center">
        <Package className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">
          New products are on the way — check back soon.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

export function ProductCard({ product: p }: { product: Product }) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className="reveal group relative glass-strong rounded-2xl overflow-hidden flex flex-col hover-lift"
    >
      {p.featured && (
        <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1 rounded-full bg-[color:var(--ph)]/90 text-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow">
          <Sparkles className="h-3 w-3" /> Featured
        </span>
      )}
      {p.category && (
        <span className="absolute top-3 right-3 z-10 inline-flex items-center gap-1 rounded-full bg-black/50 backdrop-blur text-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider">
          <Tag className="h-3 w-3" /> {p.category}
        </span>
      )}

      {p.banner_url ? (
        <div className="aspect-[16/9] w-full overflow-hidden bg-black/40">
          <img
            src={p.banner_url}
            alt={p.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="aspect-[16/9] w-full bg-gradient-brand opacity-30 grid place-items-center">
          <Package className="h-10 w-10 text-white/60" />
        </div>
      )}

      <div className="p-5 flex flex-col gap-3 flex-1">
        <div>
          <h3 className="font-display text-lg font-bold leading-snug">{p.name}</h3>
          {p.tagline && (
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{p.tagline}</p>
          )}
        </div>

        {p.short_description && (
          <p className="text-sm text-foreground/80 line-clamp-3">{p.short_description}</p>
        )}

        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <div className="font-display text-lg font-bold text-gradient">{priceLabel(p)}</div>
          <Link
            to="/products/$slug"
            params={{ slug: p.slug }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-brand text-white px-3.5 py-2 text-xs font-semibold shadow group/btn"
          >
            View Product
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
