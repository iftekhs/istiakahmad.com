import type { Product } from "./products.shared";
import type { DiscountedDeal } from "./cms.functions";
import { parseYoutubeId } from "./products.shared";
import { SITE } from "./site";

/** Returns absolute URL using SITE.url base. */
export function absUrl(path: string): string {
  if (!path) return SITE.url;
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
}

function availabilityFor(p: Product): string {
  if (p.pricing_mode === "quote_only") return "https://schema.org/InStock";
  return "https://schema.org/InStock";
}

/** Product/Service JSON-LD with nested Offer. */
export function buildProductSchema(p: Product) {
  const url = absUrl(`/products/${p.slug}`);
  const images = [p.banner_url, ...p.gallery].filter(Boolean).map((u) => absUrl(u!));
  const isService = p.pricing_mode === "quote_only";

  const base: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": isService ? "Service" : "Product",
    name: p.name,
    description: p.short_description || p.tagline || p.long_description?.slice(0, 300) || p.name,
    url,
    ...(images.length ? { image: images } : {}),
    ...(p.category ? { category: p.category } : {}),
    brand: { "@type": "Brand", name: SITE.name },
    ...(isService
      ? { provider: { "@type": "Person", name: SITE.name, url: SITE.url } }
      : {}),
  };

  if (p.pricing_mode === "fixed" && p.price !== null) {
    base.offers = {
      "@type": "Offer",
      price: p.price,
      priceCurrency: p.currency,
      availability: availabilityFor(p),
      url,
      seller: { "@type": "Person", name: SITE.name },
    };
  } else if (p.pricing_mode === "from" && p.price !== null) {
    base.offers = {
      "@type": "AggregateOffer",
      lowPrice: p.price,
      priceCurrency: p.currency,
      availability: availabilityFor(p),
      offerCount: 1,
      url,
    };
  } else {
    base.offers = {
      "@type": "Offer",
      price: 0,
      priceCurrency: p.currency,
      availability: availabilityFor(p),
      url,
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: p.currency,
        valueAddedTaxIncluded: false,
      },
      description: "Custom quote — contact for pricing",
    };
  }

  return base;
}

export function buildFaqSchema(faqs: { question: string; answer: string }[]) {
  if (!faqs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function buildVideoSchema(p: Product) {
  const id = parseYoutubeId(p.youtube_url);
  if (!id) return null;
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: `${p.name} — video walkthrough`,
    description: p.short_description || p.tagline || `Video walkthrough of ${p.name}.`,
    thumbnailUrl: [`https://i.ytimg.com/vi/${id}/hqdefault.jpg`],
    uploadDate: new Date().toISOString().slice(0, 10),
    embedUrl: `https://www.youtube.com/embed/${id}`,
    contentUrl: `https://www.youtube.com/watch?v=${id}`,
  };
}

export function buildBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absUrl(it.url),
    })),
  };
}

export function buildProductCollectionSchema(products: Product[], pageUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    url: absUrl(pageUrl),
    name: "Products",
    description: "Hand-built products and services available for purchase or custom quote.",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: absUrl(`/products/${p.slug}`),
        name: p.name,
        ...(p.banner_url ? { image: absUrl(p.banner_url) } : {}),
      })),
    },
  };
}

export function buildDealsListSchema(deals: DiscountedDeal[], pageUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    url: absUrl(pageUrl),
    name: "Discounted Deals",
    description: "Limited-time discounted products and services.",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: deals.length,
      itemListElement: deals.map((d, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Offer",
          name: d.name,
          ...(d.description ? { description: d.description } : {}),
          ...(d.banner_url ? { image: absUrl(d.banner_url) } : {}),
          price: d.discounted_price,
          priceCurrency: d.currency,
          ...(d.original_price > d.discounted_price
            ? {
                priceSpecification: {
                  "@type": "UnitPriceSpecification",
                  price: d.original_price,
                  priceCurrency: d.currency,
                  priceType: "https://schema.org/ListPrice",
                },
              }
            : {}),
          availability: "https://schema.org/InStock",
          url: absUrl("/deals"),
        },
      })),
    },
  };
}

/** Convenience to wrap a JSON-LD object into a script meta entry for head(). */
export function ldScript(obj: any) {
  return { type: "application/ld+json", children: JSON.stringify(obj) };
}
