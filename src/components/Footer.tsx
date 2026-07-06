import { Link } from "@tanstack/react-router";
import { Linkedin, Youtube, MessageCircle, ExternalLink } from "lucide-react";
import logo from "@/assets/logo.png";
import { useSiteSettings } from "@/hooks/use-cms";

export function Footer() {
  const SITE = useSiteSettings();
  return (
    <footer className="mt-32 border-t border-border/60 bg-black/30">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          <div className="sm:col-span-2">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="grid h-9 w-9 place-items-center rounded-xl overflow-hidden shadow-[0_8px_30px_-8px_oklch(0.65_0.24_295/0.6)] transition-transform group-hover:scale-105">
                <img src={logo} alt="Istiak Ahmad" className="h-full w-full object-cover" />
              </span>
              <span className="font-display text-base font-bold">Istiak Ahmad</span>
            </Link>
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              SaaS founder & verified Product Hunt hunter. I help founders rank Top
              #1 on Product Hunt with proven strategy and end-to-end launch
              execution.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <SocialChip href={SITE.links.producthunt} label="Product Hunt" />
              <SocialChip href={SITE.links.linkedin} label="LinkedIn" Icon={Linkedin} />
              <SocialChip href={SITE.links.youtube} label="YouTube" Icon={Youtube} />
              <SocialChip
                href={SITE.links.whatsapp}
                label="WhatsApp"
                Icon={MessageCircle}
              />
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Navigate
            </p>
            <ul className="mt-4 space-y-1 text-sm">
              <li><Link to="/" className="inline-block py-1.5 text-muted-foreground hover:text-foreground">Home</Link></li>
              <li><Link to="/about" className="inline-block py-1.5 text-muted-foreground hover:text-foreground">About</Link></li>
              <li><Link to="/portfolio" className="inline-block py-1.5 text-muted-foreground hover:text-foreground">Portfolio</Link></li>
              <li><Link to="/playbook" className="inline-block py-1.5 text-muted-foreground hover:text-foreground">Playbook</Link></li>
              <li><Link to="/services" className="inline-block py-1.5 text-muted-foreground hover:text-foreground">Services</Link></li>
              <li><Link to="/contact" className="inline-block py-1.5 text-muted-foreground hover:text-foreground">Contact</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Work with me
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a href={SITE.links.gumroad} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
                  Get the Playbook <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a href={SITE.links.consultation} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
                  Book a Consultation <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a href={SITE.links.upwork} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
                  Hire on Upwork <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Istiak Ahmad. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link to="/terms" className="hover:text-foreground">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialChip({
  href,
  label,
  Icon,
}: {
  href: string;
  label: string;
  Icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-full glass px-3 py-1.5 text-xs hover:bg-white/10 transition-colors"
    >
      {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
      {label}
    </a>
  );
}
