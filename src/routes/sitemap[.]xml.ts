import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const BASE_URL = "https://istiakahmad.com";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
  imageUrl?: string;
  imageCaption?: string;
}

const STATIC_ENTRIES: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/services", changefreq: "monthly", priority: "0.9" },
  { path: "/playbook", changefreq: "monthly", priority: "0.9" },
  { path: "/portfolio", changefreq: "monthly", priority: "0.8" },
  { path: "/products", changefreq: "weekly", priority: "0.9" },
  { path: "/deals", changefreq: "weekly", priority: "0.8" },
  { path: "/about", changefreq: "monthly", priority: "0.7" },
  { path: "/contact", changefreq: "yearly", priority: "0.6" },
];

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [...STATIC_ENTRIES];

        const { data: products } = await supabaseAdmin
          .from("products")
          .select("slug, name, updated_at, banner_url")
          .eq("active", true)
          .order("sort_order", { ascending: true });

        if (products) {
          for (const p of products) {
            entries.push({
              path: `/products/${p.slug}`,
              lastmod: (p.updated_at as string | null)?.slice(0, 10),
              changefreq: "weekly",
              priority: "0.8",
              imageUrl: p.banner_url ?? undefined,
              imageCaption: p.name,
            });
          }
        }

        const urls = entries.map((e) => {
          const parts = [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
          ];
          if (e.imageUrl) {
            parts.push(`    <image:image>`);
            parts.push(`      <image:loc>${esc(e.imageUrl)}</image:loc>`);
            if (e.imageCaption) parts.push(`      <image:caption>${esc(e.imageCaption)}</image:caption>`);
            parts.push(`    </image:image>`);
          }
          parts.push(`  </url>`);
          return parts.filter(Boolean).join("\n");
        });

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
