import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Section } from "@/components/Section";
import { LAUNCHES, SITE } from "@/lib/site";
import { useLaunches, useSiteSettings, type CmsLaunch } from "@/hooks/use-cms";
import { useReveal } from "@/hooks/use-reveal";
import { ExternalLink, Trophy, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Launch Portfolio | Istiak Ahmad" },
      {
        name: "description",
        content:
          "6 Product Hunt launches, all ranked Top 5. Lancepilot, Ginix, Jector AI, ToolSpend, Simply, Nomie.",
      },
      { property: "og:title", content: "Launch Portfolio | Istiak Ahmad" },
      {
        property: "og:description",
        content: "Every product I've hunted has finished Top 5 on Product Hunt.",
      },
      { property: "og:url", content: "https://istiakahmad.com/portfolio" },
    ],
    links: [{ rel: "canonical", href: "https://istiakahmad.com/portfolio" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE.url}/` },
            { "@type": "ListItem", position: 2, name: "Portfolio", item: `${SITE.url}/portfolio` },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Product Hunt launches by Istiak Ahmad",
          numberOfItems: LAUNCHES.length,
          itemListElement: LAUNCHES.map((l, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "CreativeWork",
              name: l.name,
              url: l.href,
              description: l.description,
              datePublished: l.date,
              award: l.rank,
              creator: { "@type": "Person", name: "Istiak Ahmad" },
            },
          })),
        }),
      },
    ],
  }),
  component: PortfolioPage,
});

function PortfolioPage() {
  const launches = useLaunches();
  const site = useSiteSettings();
  return (
    <PageShell>
      <Section
        eyebrow="Portfolio"
        title="Every launch. Top 5. Every time."
        description="Below are all the Product Hunt launches I've hunted or made, with rankings, dates, and direct links to each launch."
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {launches.map((l) => (
            <BigLaunchCard key={l.name} l={l} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <a
            href={site.links.producthunt}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl glass px-5 py-3 text-sm font-semibold hover:bg-white/10"
          >
            See my Product Hunt profile <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </Section>

      <Section
        eyebrow="Featured case"
        title="Lancepilot: the launch that started it all."
        description="My own SaaS. Launched April 8, 2024. Held #1 the entire day and swept the marketing category."
      >
        <div className="relative glass-strong rounded-3xl p-8 sm:p-12 shadow-card overflow-hidden">
          <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-[color:var(--ph)] opacity-20 blur-3xl" />
          <div className="grid lg:grid-cols-3 gap-8 relative">
            {[
              { v: "#1", l: "Product of the Day" },
              { v: "#2", l: "Product of the Week" },
              { v: "#1", l: "Marketing of the Month" },
            ].map((s) => (
              <div key={s.l} className="glass rounded-2xl p-6 text-center">
                <div className="font-display text-5xl font-bold text-gradient">{s.v}</div>
                <div className="mt-2 text-sm text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
          <div className="relative mt-10 grid sm:grid-cols-3 gap-6 text-sm">
            <Insight title="300+ signups" desc="In the first 24 hours, all organic." />
            <Insight title="$62k valuation" desc="Hit one month after the launch (Founderpath)." />
            <Insight title="2 investors" desc="Inbound from the US and Europe within 60 days." />
          </div>
          <div className="relative mt-10 flex justify-center">
            <a
              href={SITE.links.lancepilot}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-5 py-3 text-sm font-semibold text-white"
            >
              View the Lancepilot launch <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </Section>
    </PageShell>
  );
}

function Insight({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="glass rounded-xl p-5">
      <div className="font-display text-lg font-bold">{title}</div>
      <p className="mt-1 text-muted-foreground">{desc}</p>
    </div>
  );
}

function BigLaunchCard({ l }: { l: CmsLaunch }) {
  const ref = useReveal<HTMLAnchorElement>();
  const isOne = l.rank.startsWith("#1");
  return (
    <a
      ref={ref}
      href={l.href}
      target="_blank"
      rel="noopener noreferrer"
      className="reveal group relative glass-strong rounded-2xl p-6 hover-lift overflow-hidden flex flex-col"
    >
      <div
        className={`absolute -top-20 -right-20 h-44 w-44 rounded-full blur-3xl opacity-30 ${
          isOne ? "bg-[color:var(--ph)]" : "bg-[color:var(--purple)]"
        }`}
      />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <div className="text-xs text-muted-foreground">{l.date}</div>
          <h3 className="mt-1 font-display text-2xl font-bold">{l.name}</h3>
          <div className="mt-1 text-xs text-muted-foreground">{l.role}</div>
        </div>
        <Trophy
          className={`h-5 w-5 ${
            isOne ? "text-[color:var(--ph)]" : "text-[color:var(--purple)]"
          }`}
        />
      </div>
      <p className="relative mt-4 text-sm text-muted-foreground">{l.description}</p>
      <div className="relative mt-5 flex flex-wrap gap-1.5">
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
            isOne
              ? "bg-[color:var(--ph)]/20 text-[color:var(--ph)] border border-[color:var(--ph)]/40"
              : "bg-[color:var(--purple)]/20 text-[color:var(--purple)] border border-[color:var(--purple)]/40"
          }`}
        >
          {l.rank}
        </span>
        {l.extra.map((e) => (
          <span
            key={e}
            className="rounded-full bg-white/5 border border-white/10 px-2.5 py-1 text-[11px] text-muted-foreground"
          >
            {e}
          </span>
        ))}
      </div>
      <div className="relative mt-auto pt-6 inline-flex items-center gap-1.5 text-xs font-medium text-foreground/70 group-hover:text-foreground">
        Open on Product Hunt <ExternalLink className="h-3 w-3" />
      </div>
    </a>
  );
}
