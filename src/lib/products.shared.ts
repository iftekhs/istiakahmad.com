export type ProductLink = { label: string; url: string };
export type ProductFaq = { question: string; answer: string };

export type Product = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  category: string | null;
  short_description: string | null;
  long_description: string | null;
  banner_url: string | null;
  gallery: string[];
  youtube_url: string | null;
  features: string[];
  links: ProductLink[];
  faqs: ProductFaq[];
  pricing_mode: "fixed" | "from" | "quote_only";
  price: number | null;
  currency: string;
  whatsapp_message: string | null;
  featured: boolean;
  active: boolean;
  sort_order: number;
};

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export function parseYoutubeId(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1) || null;
    if (u.searchParams.get("v")) return u.searchParams.get("v");
    const m = u.pathname.match(/\/embed\/([^/?]+)/);
    if (m) return m[1];
    const sh = u.pathname.match(/\/shorts\/([^/?]+)/);
    if (sh) return sh[1];
  } catch {
    // ignore
  }
  return null;
}

export function formatPrice(amount: number, currency: string) {
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

export function buildWhatsAppHref(phoneOrLink: string, message: string) {
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
