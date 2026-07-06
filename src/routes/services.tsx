import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Section } from "@/components/Section";
import { SITE } from "@/lib/site";
import { useReveal } from "@/hooks/use-reveal";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Megaphone,
  Rocket,
  Target,
  Trophy,
  Users,
  Sparkles,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services | 1:1 Consultation & Done-for-You PH Launches" },
      {
        name: "description",
        content:
          "Two ways to work with me: a 1:1 launch strategy consultation, or full done-for-you Product Hunt launch management.",
      },
      { property: "og:title", content: "Work with Istiak Ahmad" },
      {
        property: "og:description",
        content:
          "Book a launch strategy call or hire me to run your Product Hunt launch end-to-end.",
      },
      { property: "og:url", content: "https://istiakahmad.com/services" },
    ],
    links: [{ rel: "canonical", href: "https://istiakahmad.com/services" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE.url}/` },
            { "@type": "ListItem", position: 2, name: "Services", item: `${SITE.url}/services` },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: "Product Hunt launch strategy and management",
          provider: {
            "@type": "Person",
            name: "Istiak Ahmad",
            url: SITE.url,
          },
          areaServed: "Worldwide",
          url: `${SITE.url}/services`,
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Product Hunt launch services",
            itemListElement: [
              {
                "@type": "Offer",
                url: SITE.links.consultation,
                itemOffered: {
                  "@type": "Service",
                  name: "1:1 Launch Strategy Consultation",
                  description:
                    "Focused video call to review your product, design your launch strategy, and pressure-test your roadmap.",
                },
              },
              {
                "@type": "Offer",
                url: SITE.links.upwork,
                itemOffered: {
                  "@type": "Service",
                  name: "Full Product Hunt Launch Management",
                  description:
                    "End-to-end Product Hunt launch ops: launch page, assets, outreach, network activation, and 24h launch-day execution.",
                },
              },
            ],
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: ServicesPage,
});

const PROCESS = [
  { Icon: Target, t: "Strategy", d: "Audience, positioning, launch slot, and goal-setting." },
  { Icon: Rocket, t: "Assets", d: "Launch page, copy, gallery, video, first comment." },
  { Icon: Megaphone, t: "Outreach", d: "Activating my private hunter and maker network." },
  { Icon: Calendar, t: "Launch Day", d: "24h of active ops: comments, escalation, momentum." },
  { Icon: Trophy, t: "Post-Launch", d: "Turning rank into traffic, signups, and partnerships." },
];

const FAQ = [
  {
    q: "How early do I need to start?",
    a: "Ideally 2–3 weeks before launch. We can move faster if your assets are mostly ready, but more lead time = more outreach = better rank.",
  },
  {
    q: "Do you guarantee a #1 finish?",
    a: "No serious operator guarantees rank. What I do guarantee: a complete launch system, real homepage strategy, and active outreach. Every product I've hunted has finished Top 5.",
  },
  {
    q: "How do payments work?",
    a: "All work happens through my Upwork profile for trust and protection on both sides.",
  },
  {
    q: "Can you launch products outside of SaaS?",
    a: "Yes. AI tools, dev tools, marketing tools, indie apps, marketplaces. The playbook adapts to the category.",
  },
];

function ServicesPage() {
  return (
    <PageShell>
      <HeroBlock />
      <Offerings />
      <ProcessTimeline />
      <FAQBlock />
      <CTA />
    </PageShell>
  );
}

function HeroBlock() {
  return (
    <Section
      eyebrow="Services"
      title="Two ways to work with me."
      description="Pick what matches where you are: a focused strategy call, or hand me the whole launch."
    >
      <div className="grid lg:grid-cols-2 gap-6">
        <BigOffer
          tag="1:1 · Best for getting unstuck"
          title="Launch Strategy Consultation"
          desc="A focused video call to review your product, design your launch strategy, and pressure-test your roadmap."
          bullets={[
            "Pre-call review of your product and target audience",
            "Custom launch strategy you can act on the next day",
            "Featuring + outreach playbook walkthrough",
            "Written summary after the call",
          ]}
          cta="Book on Upwork"
          href={SITE.links.consultation}
          accent="purple"
        />
        <BigOffer
          tag="Done-for-you · Best for serious launches"
          title="Full Launch Management"
          desc="End-to-end Product Hunt launch ops. I become your launch partner. You ship the product, I rank it."
          bullets={[
            "Launch page, copy, gallery, video, first comment",
            "Coordination with my hunter & maker network",
            "Homepage featuring strategy",
            "24h active launch-day ops",
            "Post-launch follow-through and reporting",
          ]}
          cta="Hire me on Upwork"
          href={SITE.links.upwork}
          accent="orange"
          featured
        />
      </div>
    </Section>
  );
}

function BigOffer({
  tag,
  title,
  desc,
  bullets,
  cta,
  href,
  accent,
  featured,
}: {
  tag: string;
  title: string;
  desc: string;
  bullets: string[];
  cta: string;
  href: string;
  accent: "orange" | "purple";
  featured?: boolean;
}) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`reveal relative flex flex-col glass-strong rounded-3xl p-8 shadow-card overflow-hidden ${
        featured ? "ring-1 ring-[color:var(--ph)]/40" : ""
      }`}
    >
      <div
        className={`absolute -top-24 -right-24 h-72 w-72 rounded-full opacity-20 blur-3xl ${
          accent === "orange" ? "bg-[color:var(--ph)]" : "bg-[color:var(--purple)]"
        }`}
      />
      <div className="relative">
        <div className="text-xs text-muted-foreground">{tag}</div>
        <h3 className="mt-2 font-display text-3xl font-bold">{title}</h3>
        <p className="mt-3 text-muted-foreground">{desc}</p>
        <ul className="mt-6 space-y-2.5">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-2.5 text-sm">
              <CheckCircle2
                className={`mt-0.5 h-4 w-4 shrink-0 ${
                  accent === "orange"
                    ? "text-[color:var(--ph)]"
                    : "text-[color:var(--purple)]"
                }`}
              />
              <span className="text-foreground/85">{b}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="relative mt-auto pt-8">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold ${
            accent === "orange"
              ? "bg-gradient-brand text-white"
              : "glass hover:bg-white/10"
          }`}
        >
          {cta} <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}

function ProcessTimeline() {
  return (
    <Section
      eyebrow="Process"
      title="A 7-day launch sprint."
      description="Once you book a launch slot, here's how the work flows."
    >
      <div className="relative mx-auto max-w-5xl">
        <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[color:var(--purple)]/60 via-border to-[color:var(--ph)]/60 sm:left-1/2" />
        <ol className="space-y-8">
          {PROCESS.map(({ Icon, t, d }, i) => {
            const ref = useReveal<HTMLLIElement>();
            return (
              <li
                key={t}
                ref={ref}
                className="reveal relative grid sm:grid-cols-2 gap-4 items-start"
              >
                <div className={`pl-16 sm:pl-0 ${i % 2 ? "sm:order-2 sm:pl-12" : "sm:pr-12 sm:text-right"}`}>
                  <div className="text-xs font-mono text-[color:var(--ph)]">
                    Step {i + 1}
                  </div>
                  <div className="mt-1 font-display text-xl font-bold">{t}</div>
                  <p className="mt-1.5 text-sm text-muted-foreground">{d}</p>
                </div>
                <div className="hidden sm:block" />
                <span className="absolute left-6 sm:left-1/2 top-1.5 -translate-x-1/2 grid h-10 w-10 place-items-center rounded-full bg-gradient-brand text-white ring-4 ring-background">
                  <Icon className="h-4 w-4" />
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}

function Offerings() {
  return (
    <Section eyebrow="Why founders choose me" title="It's about credibility, not promises.">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { Icon: Trophy, t: "#1 on PH myself", d: "Lancepilot, April 2024" },
          { Icon: Users, t: "Real network", d: "2000+ PH-aware founders" },
          { Icon: Rocket, t: "8+ launches", d: "All Top 5" },
          { Icon: Sparkles, t: "Verified Hunter", d: "Green tick on PH" },
        ].map(({ Icon, t, d }) => (
          <div key={t} className="glass rounded-2xl p-5">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-brand text-white">
              <Icon className="h-5 w-5" />
            </div>
            <div className="mt-4 font-display text-base font-semibold">{t}</div>
            <div className="mt-1 text-xs text-muted-foreground">{d}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function FAQBlock() {
  return (
    <Section eyebrow="FAQ" title="Common questions, straight answers.">
      <div className="mx-auto max-w-3xl glass-strong rounded-2xl p-2 sm:p-4">
        <Accordion type="single" collapsible className="w-full">
          {FAQ.map((f, i) => (
            <AccordionItem key={f.q} value={`item-${i}`} className="border-border/60">
              <AccordionTrigger className="px-4 text-left font-display text-base font-semibold hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="px-4 text-sm text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Section>
  );
}

function CTA() {
  return (
    <Section>
      <div className="relative overflow-hidden rounded-3xl glass-strong p-10 sm:p-16 text-center shadow-card">
        <div className="absolute inset-0 bg-gradient-hero opacity-80" />
        <div className="relative">
          <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-gradient">
            Let's plan your launch.
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-muted-foreground">
            Book a strategy call or message me directly. We'll figure out if your
            launch is ready and what to do next.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={SITE.links.consultation}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-5 py-3 text-sm font-semibold text-white"
            >
              Book a Call
            </a>
            <a
              href={SITE.links.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl glass px-5 py-3 text-sm font-semibold hover:bg-white/10"
            >
              Message on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
}
