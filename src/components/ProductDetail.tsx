import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  CheckCircle2,
  MessageCircle,
  FileText,
  Tag,
  Sparkles,
  ExternalLink,
  Quote,
  ChevronDown,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  buildWhatsAppHref,
  formatPrice,
  parseYoutubeId,
  type Product,
} from "@/lib/products.shared";

function priceBlock(p: Product) {
  if (p.pricing_mode === "quote_only" || p.price === null) {
    return { primary: "Custom Quote", secondary: "Tailored to your needs" };
  }
  if (p.pricing_mode === "from") {
    return {
      primary: `From ${formatPrice(p.price, p.currency)}`,
      secondary: "Starting price",
    };
  }
  return { primary: formatPrice(p.price, p.currency), secondary: null };
}

export function ProductDetail({
  product,
  whatsappTarget,
  related = [],
}: {
  product: Product;
  whatsappTarget: string;
  related?: Product[];
}) {
  const youtubeId = parseYoutubeId(product.youtube_url);
  const allImages = product.banner_url
    ? [product.banner_url, ...product.gallery.filter((g) => g !== product.banner_url)]
    : product.gallery;
  const [active, setActive] = useState(0);

  const buyMessage =
    product.whatsapp_message?.trim() ||
    `Hi! I'm interested in "${product.name}". Can you share more details?`;
  const quoteMessage = `Hi! I'd like a quote for "${product.name}". Could you share pricing and next steps?`;

  const buyHref = buildWhatsAppHref(whatsappTarget, buyMessage);
  const quoteHref = buildWhatsAppHref(whatsappTarget, quoteMessage);
  const price = priceBlock(product);

  return (
    <>
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-28 sm:pt-32">
        <nav className="text-xs text-muted-foreground flex items-center gap-1.5 flex-wrap">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-foreground">Products</Link>
          <span>/</span>
          <span className="text-foreground/80">{product.name}</span>
        </nav>
      </div>

      {/* HERO */}
      <section className="relative pt-6 pb-12 sm:pb-16">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-2 gap-10 items-start">
          {/* Gallery */}
          <div>
            {allImages.length > 0 ? (
              <div className="glass-strong rounded-2xl overflow-hidden">
                <div className="relative aspect-[16/10] w-full bg-black/40">
                  <img
                    src={allImages[active]}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                  {allImages.length > 1 && (
                    <>
                      <button
                        type="button"
                        aria-label="Previous image"
                        onClick={() => setActive((i) => (i - 1 + allImages.length) % allImages.length)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 grid place-items-center h-9 w-9 rounded-full bg-black/60 hover:bg-black/80 text-white"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        aria-label="Next image"
                        onClick={() => setActive((i) => (i + 1) % allImages.length)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 grid place-items-center h-9 w-9 rounded-full bg-black/60 hover:bg-black/80 text-white"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </div>
                {allImages.length > 1 && (
                  <div className="p-3 flex gap-2 overflow-x-auto">
                    {allImages.map((src, i) => (
                      <button
                        key={src + i}
                        type="button"
                        onClick={() => setActive(i)}
                        className={`shrink-0 h-16 w-24 rounded-md overflow-hidden border-2 transition ${
                          i === active ? "border-[color:var(--ph)]" : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                      >
                        <img src={src} alt="" className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-[16/10] w-full rounded-2xl bg-gradient-brand opacity-30 grid place-items-center">
                <Package className="h-16 w-16 text-white/70" />
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              {product.featured && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--ph)]/15 text-[color:var(--ph)] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider">
                  <Sparkles className="h-3 w-3" /> Featured
                </span>
              )}
              {product.category && (
                <span className="inline-flex items-center gap-1 rounded-full glass px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider">
                  <Tag className="h-3 w-3" /> {product.category}
                </span>
              )}
            </div>

            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight">
              <span className="text-gradient-brand">{product.name}</span>
            </h1>
            {product.tagline && (
              <p className="text-base sm:text-lg text-foreground/90 font-medium leading-relaxed">
                {product.tagline}
              </p>
            )}
            {product.short_description && (
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {product.short_description}
              </p>
            )}

            {/* Quick Facts (AEO-friendly, citeable structured content) */}
            <dl className="glass rounded-xl p-4 grid grid-cols-2 gap-3 text-xs">
              {product.category && (
                <div>
                  <dt className="uppercase tracking-wider text-muted-foreground/80 text-[10px] font-semibold">
                    Category
                  </dt>
                  <dd className="mt-0.5 text-sm font-semibold text-foreground">{product.category}</dd>
                </div>
              )}
              <div>
                <dt className="uppercase tracking-wider text-muted-foreground/80 text-[10px] font-semibold">
                  Pricing
                </dt>
                <dd className="mt-0.5 text-sm font-semibold text-foreground">
                  {product.pricing_mode === "fixed"
                    ? "Fixed price"
                    : product.pricing_mode === "from"
                      ? "Starts from"
                      : "Custom quote"}
                </dd>
              </div>
              <div>
                <dt className="uppercase tracking-wider text-muted-foreground/80 text-[10px] font-semibold">
                  Support
                </dt>
                <dd className="mt-0.5 text-sm font-semibold text-foreground">WhatsApp · usually within hours</dd>
              </div>
              <div>
                <dt className="uppercase tracking-wider text-muted-foreground/80 text-[10px] font-semibold">
                  Delivery
                </dt>
                <dd className="mt-0.5 text-sm font-semibold text-foreground">Worldwide · digital</dd>
              </div>
            </dl>

            {/* Trust row */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Quote className="h-3.5 w-3.5 text-[color:var(--ph)]" />
              <span>Backed by real launches & happy customers</span>
            </div>

            {/* Price block */}
            <div className="glass-strong rounded-2xl p-5 flex items-end justify-between gap-4">
              <div>
                <div className="font-display text-3xl font-bold text-gradient">{price.primary}</div>
                {price.secondary && (
                  <div className="text-xs text-muted-foreground mt-1">{price.secondary}</div>
                )}
              </div>
              {product.pricing_mode === "quote_only" ? (
                <span className="text-[10px] uppercase tracking-wider font-semibold text-[color:var(--ph)]">
                  Tailored
                </span>
              ) : null}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={buyHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] text-white px-5 py-3 text-sm font-semibold transition-colors shadow"
              >
                <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
              </a>
              <a
                href={quoteHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-brand text-white px-5 py-3 text-sm font-semibold shadow"
              >
                <FileText className="h-4 w-4" /> Get a Quote
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* FEATURES */}
      {product.features.length > 0 && (
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-center">
              What you get
            </h2>
            <p className="mt-2 text-sm text-muted-foreground text-center max-w-xl mx-auto">
              Every feature designed to save you time and ship faster.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {product.features.map((f, i) => (
                <div
                  key={i}
                  className="glass rounded-xl p-4 flex items-start gap-3 hover:bg-white/[0.06] transition-colors"
                >
                  <CheckCircle2 className="h-5 w-5 mt-0.5 shrink-0 text-[color:var(--ph)]" />
                  <span className="text-sm leading-snug text-foreground/90">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* VIDEO */}
      {youtubeId && (
        <section className="py-8 sm:py-12">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-center mb-6">
              See it in action
            </h2>
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl glass-strong">
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}`}
                title={`${product.name} video`}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>
          </div>
        </section>
      )}

      {/* LONG DESCRIPTION */}
      {product.long_description && (
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-6">About this product</h2>
            <div className="prose-custom space-y-4 text-foreground/85 leading-relaxed">
              {product.long_description.split(/\r?\n\r?\n/).map((para, i) => (
                <p key={i} className="text-base">
                  {para.split(/\r?\n/).map((line, j, arr) => (
                    <span key={j}>
                      {line}
                      {j < arr.length - 1 && <br />}
                    </span>
                  ))}
                </p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* GALLERY (extra images beyond hero) */}
      {product.gallery.length > 1 && (
        <section className="py-8 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-center mb-6">Gallery</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {product.gallery.map((src, i) => (
                <div key={src + i} className="aspect-[4/3] rounded-xl overflow-hidden glass-strong">
                  <img
                    src={src}
                    alt={`${product.name} screenshot ${i + 1}`}
                    loading="lazy"
                    className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* USEFUL LINKS */}
      {product.links.length > 0 && (
        <section className="py-8 sm:py-12">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-6">Useful links</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {product.links.map((l, i) => (
                <a
                  key={i}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass rounded-xl p-4 flex items-center justify-between gap-3 hover:bg-white/[0.06] transition-colors group"
                >
                  <span className="text-sm font-medium">{l.label}</span>
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-[color:var(--ph)] transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {product.faqs.length > 0 && (
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-center mb-8">
              Frequently asked questions
            </h2>
            <div className="space-y-3">
              {product.faqs.map((f, i) => (
                <FaqItem key={i} q={f.question} a={f.answer} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* MID-PAGE CTA */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="glass-strong rounded-2xl p-8 sm:p-10 text-center">
            <h3 className="font-display text-2xl sm:text-3xl font-bold">
              Ready to get <span className="text-gradient-brand">{product.name}</span>?
            </h3>
            <p className="mt-3 text-sm text-muted-foreground max-w-lg mx-auto">
              Message on WhatsApp for a quick response — usually within a few hours.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={buyHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] text-white px-6 py-3 text-sm font-semibold shadow"
              >
                <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
              </a>
              <a
                href={quoteHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-brand text-white px-6 py-3 text-sm font-semibold shadow"
              >
                <FileText className="h-4 w-4" /> Get a Quote
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* RELATED */}
      {related.length > 0 && (
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-center mb-8">
              Other products you'll love
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.slice(0, 3).map((r) => (
                <Link
                  key={r.id}
                  to="/products/$slug"
                  params={{ slug: r.slug }}
                  className="group glass-strong rounded-2xl overflow-hidden hover-lift"
                >
                  {r.banner_url ? (
                    <div className="aspect-[16/9] overflow-hidden bg-black/40">
                      <img src={r.banner_url} alt={r.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                  ) : (
                    <div className="aspect-[16/9] bg-gradient-brand opacity-30" />
                  )}
                  <div className="p-4">
                    <div className="font-display text-base font-bold">{r.name}</div>
                    {r.tagline && (
                      <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{r.tagline}</div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* STICKY MOBILE CTA */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 p-3 bg-background/95 backdrop-blur border-t border-white/10">
        <div className="flex gap-2">
          <a
            href={buyHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#25D366] text-white px-3 py-2.5 text-xs font-semibold"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </a>
          <a
            href={quoteHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-gradient-brand text-white px-3 py-2.5 text-xs font-semibold"
          >
            <FileText className="h-4 w-4" /> Get Quote
          </a>
        </div>
      </div>
      {/* Spacer so sticky bar doesn't overlap content on mobile */}
      <div className="lg:hidden h-20" />
    </>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 px-4 py-4 text-left"
      >
        <span className="text-sm font-semibold">{q}</span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-4 pb-4 text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
          {a}
        </div>
      )}
    </div>
  );
}
