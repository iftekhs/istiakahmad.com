import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Section } from "@/components/Section";
import { SITE } from "@/lib/site";
import { useReveal } from "@/hooks/use-reveal";
import { Briefcase, Rocket, Trophy, Globe, ExternalLink, Linkedin, Youtube, Sparkles, Star, Award, TrendingUp, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Istiak Ahmad | SaaS Founder & PH Launch Expert" },
      {
        name: "description",
        content:
          "From freelance developer in 2017 to SaaS founder and verified Product Hunt hunter. This is Istiak Ahmad's founder journey.",
      },
      { property: "og:title", content: "About Istiak Ahmad" },
      {
        property: "og:description",
        content: "Founder journey: freelancer → SaaS CEO → Product Hunt launch expert.",
      },
      { property: "og:url", content: "https://istiakahmad.com/about" },
    ],
    links: [{ rel: "canonical", href: "https://istiakahmad.com/about" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE.url}/` },
            { "@type": "ListItem", position: 2, name: "About", item: `${SITE.url}/about` },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          url: `${SITE.url}/about`,
          mainEntity: {
            "@type": "Person",
            name: "Istiak Ahmad",
            jobTitle: "SaaS Founder & Product Hunt Launch Expert",
            url: SITE.url,
            worksFor: { "@type": "Organization", name: "Lancepilot" },
            knowsAbout: [
              "Product Hunt launches",
              "SaaS marketing",
              "Go-to-market strategy",
              "WhatsApp marketing",
              "Founder-led growth",
            ],
            sameAs: [
              SITE.links.producthunt,
              SITE.links.linkedin,
              SITE.links.youtube,
              SITE.links.upwork,
            ],
          },
        }),
      },
    ],
  }),
  component: AboutPage,
});

const TIMELINE = [
  {
    year: "2017",
    title: "Started freelancing",
    desc: "Began building custom software for clients on Fiverr and Upwork. Shipped hundreds of projects across stacks.",
  },
  {
    year: "2017 – 2023",
    title: "Developer → Product → Founder",
    desc: "Wore every hat: dev, PM, marketer, team lead. Learned how products actually get built and sold.",
  },
  {
    year: "2024",
    title: "Launched Lancepilot",
    desc: "Founded and shipped Lancepilot, a WhatsApp marketing SaaS. Took CEO role.",
  },
  {
    year: "Apr 8, 2024",
    title: "#1 on Product Hunt",
    desc: "Lancepilot launch swept Product Hunt: #1 Day, #2 Week, #1 Marketing Week, #1 Marketing Month.",
  },
  {
    year: "2024 – 2026",
    title: "Hunting for other founders",
    desc: "Verified PH hunter. Hunted Ginix, Jector-AI, ToolSpend, Simply, Nomie. All Top 5.",
  },
  {
    year: "Today",
    title: "Helping founders launch",
    desc: "Running the playbook, 1:1 consultations, and full launch management for founders worldwide.",
  },
];

function AboutPage() {
  return (
    <PageShell>
      <Section eyebrow="About" title="From freelancer to Product Hunt #1.">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] items-start">
          <Portrait />
          <div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              I'm Istiak Ahmad, a SaaS entrepreneur, developer, and verified
              Product Hunt hunter. I started in 2017 building custom software for
              clients on Fiverr and Upwork. By 2023, I'd shipped hundreds of
              projects and worn every hat in the building.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              In 2024 I launched my own SaaS,{" "}
              <a
                href={SITE.links.lancepilot}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline-offset-4 hover:underline"
              >
                Lancepilot
              </a>
              , and took it to <span className="text-foreground">#1 on Product Hunt</span> on launch day. That
              changed everything. Investors reached out, sign-ups poured in, and
              other founders started asking me to run their launches.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Today I split my time between Lancepilot and helping other founders
              ship great launches. Every product I've hunted has finished Top 5.
              I've built a deep network across the Product Hunt and indie-founder
              ecosystem, and I love nothing more than seeing a great product
              finally get the spotlight it deserves.
            </p>
            <Stats />
            <Highlights />
          </div>
        </div>
      </Section>

      <Section eyebrow="Journey" title="A founder's timeline.">
        <Timeline />
      </Section>

      <Section eyebrow="Watch" title="Why I wrote the playbook.">
        <div className="mx-auto max-w-3xl aspect-video overflow-hidden rounded-2xl glass-strong shadow-card">
          <iframe
            src={SITE.links.ebookVideo}
            title="Istiak Ahmad PH Launch Success Playbook intro"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      </Section>
    </PageShell>
  );
}

function Portrait() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className="reveal relative">
      <div className="absolute -inset-6 bg-gradient-brand opacity-30 blur-3xl rounded-full animate-pulse" />
      <div className="relative glass-strong rounded-3xl overflow-hidden shadow-card">
        {/* Animated creative scene */}
        <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-[color:var(--purple)]/30 via-background to-[color:var(--ph)]/30">
          {/* Starfield */}
          <div className="absolute inset-0">
            {Array.from({ length: 40 }).map((_, i) => (
              <span
                key={i}
                className="absolute h-1 w-1 rounded-full bg-white/70 animate-twinkle"
                style={{
                  left: `${(i * 53) % 100}%`,
                  top: `${(i * 31) % 100}%`,
                  animationDelay: `${(i % 10) * 0.3}s`,
                  opacity: 0.3 + ((i % 5) / 10),
                }}
              />
            ))}
          </div>

          {/* Orbit rings */}
          <div className="absolute inset-8 rounded-full border border-white/10 animate-spin-slow" />
          <div className="absolute inset-16 rounded-full border border-white/10 animate-spin-slower" />
          <div className="absolute inset-24 rounded-full border border-[color:var(--ph)]/30" />

          {/* Center trophy/rocket cluster */}
          <div className="absolute inset-0 grid place-items-center">
            <div className="relative">
              <div className="absolute -inset-10 bg-gradient-brand opacity-40 blur-2xl rounded-full animate-pulse-slow" />
              <div className="relative grid h-28 w-28 place-items-center rounded-3xl bg-gradient-brand shadow-card animate-float">
                <Trophy className="h-14 w-14 text-white drop-shadow-lg" strokeWidth={1.5} />
              </div>
              {/* Orbiting badges */}
              <div className="absolute inset-0 animate-spin-slow">
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 grid h-10 w-10 place-items-center rounded-full glass-strong">
                  <Rocket className="h-5 w-5 text-[color:var(--ph)]" />
                </span>
              </div>
              <div className="absolute inset-0 animate-spin-reverse">
                <span className="absolute top-1/2 -right-8 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full glass-strong">
                  <Star className="h-4 w-4 text-yellow-400" fill="currentColor" />
                </span>
                <span className="absolute top-1/2 -left-8 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full glass-strong">
                  <Sparkles className="h-4 w-4 text-[color:var(--purple)]" />
                </span>
              </div>
            </div>
          </div>

          {/* Rank ribbon */}
          <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-gradient-brand px-3 py-1 text-xs font-bold text-white shadow-card">
            <Award className="h-3 w-3" /> #1 Product Hunt
          </div>
          <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 rounded-full glass-strong px-3 py-1 text-xs font-semibold">
            <TrendingUp className="h-3 w-3 text-[color:var(--ph)]" /> 8+ launches
          </div>
        </div>

        <div className="p-5">
          <div className="font-display text-lg font-bold">Istiak Ahmad</div>
          <div className="text-xs text-muted-foreground">
            Founder, Lancepilot · Verified PH Hunter
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href={SITE.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="inline-flex items-center gap-1.5 rounded-full glass px-3 py-1 text-xs hover:bg-white/10"
            >
              <Linkedin className="h-3 w-3" /> LinkedIn
            </a>
            <a
              href={SITE.links.youtube}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="inline-flex items-center gap-1.5 rounded-full glass px-3 py-1 text-xs hover:bg-white/10"
            >
              <Youtube className="h-3 w-3" /> YouTube
            </a>
            <a
              href={SITE.links.producthunt}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Product Hunt"
              className="inline-flex items-center gap-1.5 rounded-full glass px-3 py-1 text-xs hover:bg-white/10"
            >
              <Rocket className="h-3 w-3 text-[color:var(--ph)]" /> Product Hunt
            </a>
            <a
              href={SITE.links.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="inline-flex items-center gap-1.5 rounded-full glass px-3 py-1 text-xs hover:bg-white/10"
            >
              <MessageCircle className="h-3 w-3 text-green-400" /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stats() {
  const items = [
    { v: "8+", l: "Years building" },
    { v: "8+", l: "Top 5 launches" },
    { v: "2000+", l: "Network" },
    { v: "$62k", l: "30-day valuation" },
  ];
  return (
    <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
      {items.map((s) => (
        <div key={s.l} className="glass rounded-xl p-4 text-center">
          <div className="font-display text-2xl font-bold text-gradient">{s.v}</div>
          <div className="mt-1 text-xs text-muted-foreground">{s.l}</div>
        </div>
      ))}
    </div>
  );
}

function Highlights() {
  const items = [
    { Icon: Trophy, label: "#1 on Product Hunt", sub: "Lancepilot, April 2024" },
    { Icon: Rocket, label: "8 launches", sub: "All ranked Top 5" },
    { Icon: Briefcase, label: "8 years", sub: "Building and shipping" },
    { Icon: Globe, label: "Global network", sub: "PH + LinkedIn ecosystem" },
  ];
  return (
    <div className="mt-6 grid sm:grid-cols-2 gap-3">
      {items.map(({ Icon, label, sub }) => (
        <div key={label} className="flex items-start gap-3 glass rounded-xl p-4">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-brand text-white">
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-semibold">{label}</div>
            <div className="text-xs text-muted-foreground">{sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Timeline() {
  return (
    <ol className="relative mx-auto max-w-3xl">
      <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[color:var(--purple)]/60 via-border to-[color:var(--ph)]/60" />
      {TIMELINE.map((item, i) => (
        <TimelineItem key={item.year} item={item} index={i} />
      ))}
    </ol>
  );
}

function TimelineItem({
  item,
  index,
}: {
  item: (typeof TIMELINE)[number];
  index: number;
}) {
  const ref = useReveal<HTMLLIElement>();
  const right = index % 2 === 1;
  return (
    <li
      ref={ref}
      className={`reveal relative grid sm:grid-cols-2 gap-4 mb-10 ${
        right ? "sm:[&>div:first-child]:order-2" : ""
      }`}
    >
      <div className={`pl-12 sm:pl-0 ${right ? "sm:pl-12" : "sm:pr-12 sm:text-right"}`}>
        <div className="text-xs font-mono text-[color:var(--ph)]">{item.year}</div>
        <div className="mt-1 font-display text-lg font-bold">{item.title}</div>
        <p className="mt-1.5 text-sm text-muted-foreground">{item.desc}</p>
      </div>
      <div className="hidden sm:block" />
      <span className="absolute left-4 sm:left-1/2 top-1.5 -translate-x-1/2 grid h-3 w-3 place-items-center rounded-full bg-gradient-brand ring-4 ring-background" />
    </li>
  );
}
