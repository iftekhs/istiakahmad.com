import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Tag, Package } from "lucide-react";
import logo from "@/assets/logo.png";
import { useSiteSettings } from "@/hooks/use-cms";
import { useDealsConfig } from "@/components/DiscountedDeals";
import { useProductsConfig } from "@/components/Products";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/playbook", label: "Playbook" },
  { to: "/services", label: "Services" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const SITE = useSiteSettings();
  const { enabled: dealsEnabled } = useDealsConfig();
  const { enabled: productsEnabled } = useProductsConfig();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4">
        <div
          className={`flex items-center justify-between rounded-2xl px-4 py-3 transition-all duration-300 ${
            scrolled ? "glass-strong shadow-card" : "bg-transparent"
          }`}
        >
          <Link to="/" className="flex items-center gap-2 group">
            <span className="grid h-9 w-9 place-items-center rounded-xl overflow-hidden shadow-[0_8px_30px_-8px_oklch(0.65_0.24_295/0.6)] transition-transform group-hover:scale-105">
              <img src={logo} alt="Istiak Ahmad" className="h-full w-full object-cover" />
            </span>
            <span className="font-display text-base font-bold tracking-tight">
              Istiak Ahmad
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-white/5 data-[status=active]:text-foreground data-[status=active]:bg-white/5"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            {productsEnabled && (
              <Link
                to="/products"
                className="inline-flex items-center gap-1.5 rounded-xl glass px-3.5 py-2 text-sm font-semibold hover:bg-white/10 transition-colors"
              >
                <Package className="h-3.5 w-3.5" /> Products
              </Link>
            )}
            {dealsEnabled && (
              <Link
                to="/deals"
                className="inline-flex items-center gap-1.5 rounded-xl border border-[color:var(--ph)]/40 bg-[color:var(--ph)]/10 px-3.5 py-2 text-sm font-semibold text-[color:var(--ph)] hover:bg-[color:var(--ph)]/20 transition-colors"
              >
                <Tag className="h-3.5 w-3.5" /> Deals
              </Link>
            )}
            <a
              href={SITE.links.gumroad}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-4 py-2 text-sm font-medium text-white shadow-[0_10px_40px_-10px_oklch(0.72_0.2_45/0.5)] hover:opacity-95 transition-opacity"
            >
              Get the Playbook
            </a>
          </div>

          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden grid place-items-center h-11 w-11 rounded-xl glass"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="lg:hidden mt-2 glass-strong rounded-2xl p-4 animate-fade-in">
            <div className="flex flex-col gap-1">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  activeOptions={{ exact: item.to === "/" }}
                  className="px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-white/5 data-[status=active]:text-foreground data-[status=active]:bg-white/5"
                >
                  {item.label}
                </Link>
              ))}
              {productsEnabled && (
                <Link
                  to="/products"
                  onClick={() => setOpen(false)}
                  className="mt-1 inline-flex items-center justify-center gap-1.5 rounded-xl glass px-3 py-2.5 text-sm font-semibold"
                >
                  <Package className="h-3.5 w-3.5" /> Products
                </Link>
              )}
              {dealsEnabled && (
                <Link
                  to="/deals"
                  onClick={() => setOpen(false)}
                  className="mt-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-[color:var(--ph)]/40 bg-[color:var(--ph)]/10 px-3 py-2.5 text-sm font-semibold text-[color:var(--ph)]"
                >
                  <Tag className="h-3.5 w-3.5" /> Discounted Deals
                </Link>
              )}
              <a
                href={SITE.links.gumroad}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-brand px-4 py-2.5 text-sm font-medium text-white"
              >
                Get the Playbook
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
