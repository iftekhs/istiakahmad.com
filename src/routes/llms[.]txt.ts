import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: async () => {
        const { data: products } = await supabaseAdmin
          .from("products")
          .select("name, slug, tagline, short_description, category, pricing_mode, price, currency")
          .eq("active", true)
          .order("sort_order", { ascending: true });

        const { data: deals } = await supabaseAdmin
          .from("discounted_deals")
          .select("name, tagline, discounted_price, original_price, currency")
          .eq("active", true)
          .order("sort_order", { ascending: true });

        const lines: string[] = [];
        lines.push(`# ${SITE.name}`);
        lines.push("");
        lines.push(`> ${SITE.description}`);
        lines.push("");
        lines.push(
          "Istiak Ahmad is a SaaS founder, verified Product Hunt hunter, and launch strategist. He has driven 8+ Top-ranked Product Hunt launches and works with founders worldwide on go-to-market strategy.",
        );
        lines.push("");

        lines.push("## Key Pages");
        lines.push("");
        lines.push(`- [Home](${SITE.url}/): Overview, social proof, featured launches.`);
        lines.push(`- [Services](${SITE.url}/services): Product Hunt launch management, consultation, and growth services.`);
        lines.push(`- [Playbook](${SITE.url}/playbook): The Product Hunt Launch Success Playbook (ebook).`);
        lines.push(`- [Portfolio](${SITE.url}/portfolio): Past launches and outcomes.`);
        lines.push(`- [Products](${SITE.url}/products): All listed products and services.`);
        lines.push(`- [Deals](${SITE.url}/deals): Limited-time discounted offers.`);
        lines.push(`- [About](${SITE.url}/about): Background and credentials.`);
        lines.push(`- [Contact](${SITE.url}/contact): Get in touch.`);
        lines.push("");

        if (products && products.length > 0) {
          lines.push("## Products");
          lines.push("");
          for (const p of products) {
            const url = `${SITE.url}/products/${p.slug}`;
            const summary = p.tagline || p.short_description || p.name;
            let priceTag = "";
            if (p.pricing_mode === "fixed" && p.price !== null) {
              priceTag = ` — ${p.currency} ${p.price}`;
            } else if (p.pricing_mode === "from" && p.price !== null) {
              priceTag = ` — from ${p.currency} ${p.price}`;
            } else {
              priceTag = " — custom quote";
            }
            lines.push(`- [${p.name}](${url}): ${summary}${priceTag}.`);
          }
          lines.push("");
        }

        if (deals && deals.length > 0) {
          lines.push("## Active Deals");
          lines.push("");
          for (const d of deals) {
            const pct =
              d.original_price > 0
                ? Math.round(((d.original_price - d.discounted_price) / d.original_price) * 100)
                : 0;
            const summary = d.tagline ? `${d.tagline} — ` : "";
            lines.push(
              `- ${d.name}: ${summary}${d.currency} ${d.discounted_price} (was ${d.currency} ${d.original_price}${pct > 0 ? `, ${pct}% off` : ""}).`,
            );
          }
          lines.push("");
        }

        lines.push("## Contact");
        lines.push("");
        lines.push(`- WhatsApp: ${SITE.links.whatsapp}`);
        lines.push(`- LinkedIn: ${SITE.links.linkedin}`);
        lines.push(`- Product Hunt: ${SITE.links.producthunt}`);
        lines.push("");

        const body = lines.join("\n");
        return new Response(body, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
