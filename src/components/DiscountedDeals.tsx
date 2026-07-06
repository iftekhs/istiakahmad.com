import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { MessageCircle, Tag, Sparkles, CheckCircle2 } from "lucide-react";
import { getActiveDeals, type DiscountedDeal } from "@/lib/cms.functions";
import { useSiteSettings } from "@/hooks/use-cms";
import { useReveal } from "@/hooks/use-reveal";

function formatPrice(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
}

function buildWhatsAppHref(phoneOrLink: string, message: string) {
  if (!phoneOrLink) return "#";
  if (/^https?:\/\//i.test(phoneOrLink)) {
    try {
      const url = new URL(phoneOrLink);
      url.searchParams.set("text", message);
      return url.toString();
    } catch {
      return phoneOrLink;
    }
  }
  const digits = phoneOrLink.replace(/[^\d]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

function parseFeatures(description: string | null | undefined): string[] {
  if (!description) return [];
  return description
    .split(/\r?\n/)
    .map((l) => l.replace(/^\s*(?:[-*•]|\d+[.)])\s+/, "").trim())
    .filter((l) => l.length > 0);
}

/** Reads admin-managed deals section config; returns `enabled` (default true). */
export function useDealsConfig() {
  const settings = useSiteSettings();
  const cfg = ((settings as any)?.links?.dealsConfig ?? {}) as {
    enabled?: string | boolean;
    heading?: string;
    subheading?: string;
  };
  const enabled =
    cfg.enabled === undefined || cfg.enabled === "" || cfg.enabled === true || cfg.enabled === "true";
  return {
    enabled,
    heading: cfg.heading || "Discounted Deals",
    subheading:
      cfg.subheading ||
      "Hand-picked products and services at a special price. Tap WhatsApp to grab yours.",
    whatsappTarget: settings.links?.whatsapp || "",
  };
}

/** Pure grid (no Section wrapper) — used by the dedicated /deals page. */
export function DealsGrid() {
  const { enabled, whatsappTarget } = useDealsConfig();
  const fetchDeals = useServerFn(getActiveDeals);
  const { data: deals = [], isLoading } = useQuery({
    queryKey: ["active-deals"],
    queryFn: () => fetchDeals(),
    staleTime: 60_000,
    enabled,
  });

  if (!enabled) {
    return (
      <div className="glass-strong rounded-2xl p-10 text-center">
        <p className="text-sm text-muted-foreground">
          Discounted deals are currently unavailable. Please check back soon.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return <p className="text-sm text-muted-foreground text-center py-10">Loading deals…</p>;
  }

  if (deals.length === 0) {
    return (
      <div className="glass-strong rounded-2xl p-10 text-center">
        <p className="text-sm text-muted-foreground">
          No deals available right now — new offers drop regularly. Check back soon.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {deals.map((d) => (
        <DealCard key={d.id} deal={d} whatsappTarget={whatsappTarget} />
      ))}
    </div>
  );
}

function DealCard({
  deal,
  whatsappTarget,
}: {
  deal: DiscountedDeal;
  whatsappTarget: string;
}) {
  const ref = useReveal<HTMLDivElement>();
  const original = Number(deal.original_price);
  const discounted = Number(deal.discounted_price);
  const off =
    original > 0 && discounted < original
      ? Math.round(((original - discounted) / original) * 100)
      : 0;

  const message =
    deal.whatsapp_message?.trim() ||
    `Hi! I'm interested in your "${deal.name}" deal. Can you share more details?`;
  const href = buildWhatsAppHref(whatsappTarget, message);

  return (
    <div
      ref={ref}
      className="reveal group relative glass-strong rounded-2xl overflow-hidden flex flex-col hover-lift"
    >
      {deal.featured && (
        <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1 rounded-full bg-[color:var(--ph)]/90 text-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow">
          <Sparkles className="h-3 w-3" /> Featured
        </span>
      )}
      {off > 0 && (
        <span className="absolute top-3 right-3 z-10 inline-flex items-center gap-1 rounded-full bg-gradient-brand text-white px-2.5 py-1 text-[11px] font-bold shadow">
          <Tag className="h-3 w-3" /> {off}% OFF
        </span>
      )}

      {deal.banner_url ? (
        <div className="aspect-[16/9] w-full overflow-hidden bg-black/40">
          <img
            src={deal.banner_url}
            alt={deal.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="aspect-[16/9] w-full bg-gradient-brand opacity-30" />
      )}

      <div className="p-5 flex flex-col gap-3 flex-1">
        <div>
          <h3 className="font-display text-lg font-bold leading-snug">{deal.name}</h3>
          {deal.tagline && (
            <p className="mt-1 text-xs text-muted-foreground">{deal.tagline}</p>
          )}
        </div>

        {(() => {
          const features = parseFeatures(deal.description);
          if (features.length >= 2) {
            const shown = features.slice(0, 5);
            const extra = features.length - shown.length;
            return (
              <ul className="space-y-1.5">
                {shown.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground/85 leading-snug">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-[color:var(--ph)] transition-transform group-hover:scale-110" />
                    <span>{f}</span>
                  </li>
                ))}
                {extra > 0 && (
                  <li className="pl-6 text-xs text-muted-foreground">+{extra} more</li>
                )}
              </ul>
            );
          }
          if (deal.description) {
            return <p className="text-sm text-muted-foreground line-clamp-3">{deal.description}</p>;
          }
          return null;
        })()}

        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <div>
            <div className="font-display text-2xl font-bold text-gradient">
              {formatPrice(discounted, deal.currency)}
            </div>
            {original > discounted && (
              <div className="text-xs text-muted-foreground line-through">
                {formatPrice(original, deal.currency)}
              </div>
            )}
          </div>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#25D366] hover:bg-[#1ebe5d] text-white px-3.5 py-2 text-xs font-semibold transition-colors shadow"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
