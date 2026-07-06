import { createFileRoute, Link } from "@tanstack/react-router";
import { Trophy, Settings, FileText, Search, Image as ImageIcon, ClipboardList, ArrowRight, Tag, Package, Activity, KeyRound } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Dashboard | Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: AdminHome,
});

function AdminHome() {
  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-3xl font-bold">Dashboard</h1>
      <p className="mt-2 text-sm text-muted-foreground">Manage the site content from here.</p>
      <div className="mt-8 grid sm:grid-cols-2 gap-4">
        <Card to="/admin/launches" icon={Trophy} title="Launches" desc="Add, edit, or remove Product Hunt launches." />
        <Card to="/admin/products" icon={Package} title="Products" desc="Manage your products: details, media, pricing, FAQs." />
        <Card to="/admin/deals" icon={Tag} title="Discounted Deals" desc="Manage discounted products and the section toggle on the landing page." />
        <Card to="/admin/pages" icon={FileText} title="Pages" desc="Edit hero copy, sections, and content per page." />
        <Card to="/admin/seo" icon={Search} title="SEO" desc="Per-page meta tags and Open Graph overrides." />
        <Card to="/admin/media" icon={ImageIcon} title="Media" desc="Upload and manage images." />
        <Card to="/admin/site-settings" icon={Settings} title="Site Settings" desc="Links (WhatsApp, Upwork, Gumroad…) and contact info." />
        <Card to="/admin/tracking" icon={Activity} title="Tracking & Pixels" desc="Analytics pixels (GA4, Meta, GTM…) and chat widget snippets." />
        <Card to="/admin/audit" icon={ClipboardList} title="Audit log" desc="Every change made through the dashboard." />
        <Card to="/admin/account" icon={KeyRound} title="Account" desc="Change your admin password securely." />
      </div>
    </div>
  );
}

function Card({ to, icon: Icon, title, desc }: { to: string; icon: any; title: string; desc: string }) {
  return (
    <Link to={to} className="group glass-strong rounded-2xl p-6 hover:bg-white/5">
      <div className="flex items-start justify-between">
        <Icon className="h-6 w-6 text-[color:var(--ph)]" />
        <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </div>
      <h2 className="mt-4 font-display text-lg font-bold">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
    </Link>
  );
}
