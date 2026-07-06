import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Section } from "@/components/Section";
import { SITE } from "@/lib/site";
import { useReveal } from "@/hooks/use-reveal";
import ebook from "@/assets/ebook-mockup.png";
import { ArrowRight, CheckCircle2, BookOpen, Sparkles } from "lucide-react";

export const Route = createFileRoute("/playbook")({
  head: () => ({
    meta: [
      { title: "PH Launch Success Playbook | by Istiak Ahmad" },
      {
        name: "description",
        content:
          "The exact step-by-step playbook I used to launch Lancepilot to #1 on Product Hunt. Strategy, featuring checklist, outreach, launch-day ops.",
      },
      { property: "og:title", content: "PH Launch Success Playbook" },
      {
        property: "og:description",
        content:
          "The exact strategy that took my own SaaS to #1 on Product Hunt. Read it. Launch like a winner.",
      },
      { property: "og:url", content: "https://istiakahmad.com/playbook" },
      { property: "og:type", content: "product" },
    ],
    links: [{ rel: "canonical", href: "https://istiakahmad.com/playbook" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: "PH Launch Success Playbook",
          description:
            "Step-by-step Product Hunt launch strategy by Istiak Ahmad, founder of Lancepilot.",
          brand: { "@type": "Brand", name: "Istiak Ahmad" },
          author: { "@type": "Person", name: "Istiak Ahmad", url: SITE.url },
          offers: {
            "@type": "Offer",
            url: SITE.links.gumroad,
            availability: "https://schema.org/InStock",
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE.url}/` },
            { "@type": "ListItem", position: 2, name: "Playbook", item: `${SITE.url}/playbook` },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "How to launch and rank #1 on Product Hunt",
          description:
            "The 8-chapter Product Hunt launch playbook used to take Lancepilot to #1 Product of the Day.",
          totalTime: "P21D",
          step: [
            { "@type": "HowToStep", position: 1, name: "Understand why ranking matters", text: "Learn what actually happens after you rank: visibility, credibility, AppSumo, integration invites." },
            { "@type": "HowToStep", position: 2, name: "Start your PH journey", text: "Build presence with streaks, engagement, discussion posts, and a complete profile." },
            { "@type": "HowToStep", position: 3, name: "Build your launch network", text: "Grow a network of 2000+ PH-aware connections on LinkedIn before you need them." },
            { "@type": "HowToStep", position: 4, name: "Create a launch page that gets featured", text: "Nail title, tagline, video, description, first comment, and graphics." },
            { "@type": "HowToStep", position: 5, name: "Run the 8-point featuring checklist", text: "The exact pre-launch checklist that lands you on the PH homepage." },
            { "@type": "HowToStep", position: 6, name: "Decide whether to use a Hunter", text: "When to bring in a hunter, when not to, and what to look for." },
            { "@type": "HowToStep", position: 7, name: "Execute launch day", text: "Hour-by-hour ops: outreach, comments, escalation, momentum." },
            { "@type": "HowToStep", position: 8, name: "Convert rank into outcomes", text: "Turn rank into traffic, signups, partnerships, and valuation lift." },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "What format is the playbook?",
              acceptedAnswer: { "@type": "Answer", text: "A downloadable ebook delivered instantly via Gumroad after purchase, plus access to a private group and lifetime updates." },
            },
            {
              "@type": "Question",
              name: "Will I get future updates?",
              acceptedAnswer: { "@type": "Answer", text: "Yes. All future updates to the PH Launch Success Playbook are free for existing buyers." },
            },
            {
              "@type": "Question",
              name: "Is the playbook for non-SaaS products?",
              acceptedAnswer: { "@type": "Answer", text: "Yes. The playbook works for SaaS, AI tools, dev tools, indie apps, and marketplaces. The featuring rules are the same; positioning adapts to the category." },
            },
          ],
        }),
      },
    ],
  }),
  component: PlaybookPage,
});

const CHAPTERS = [
  { n: "01", t: "Why ranking #1 matters", d: "Visibility, credibility, AppSumo, integration invites: what actually happens after you rank." },
  { n: "02", t: "How to start your PH journey", d: "Build presence: streaks, engagement, discussion posts, profile setup." },
  { n: "03", t: "Building your launch network", d: "How I grew a network of 2000+ PH-aware connections on LinkedIn." },
  { n: "04", t: "Creating a launch page that gets featured", d: "Title, tagline, video, description, first comment, graphics, done right." },
  { n: "05", t: "The 8-point featuring checklist", d: "The exact pre-launch checklist that lands you on the PH homepage." },
  { n: "06", t: "Do you really need a Hunter?", d: "When yes, when no, and what to look for if you hire one." },
  { n: "07", t: "Launch day reality", d: "What to do hour-by-hour. Outreach, comments, escalation, momentum." },
  { n: "08", t: "After the launch", d: "Turning rank into traffic, signups, partnerships, and valuation lift." },
];

const BONUSES = [
  "Private premium LinkedIn group to connect with launch veterans",
  "Featured-on-homepage checklist, copy-paste ready",
  "Optional: I'll hunt your product for you",
  "Author DMs open for buyer questions",
];

function PlaybookPage() {
  return (
    <PageShell>
      <Hero />
      <Chapters />
      <Video />
      <Author />
      <Bonus />
      <FinalBuy />
    </PageShell>
  );
}

function Hero() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <Section>
      <div
        ref={ref}
        className="reveal grid items-center gap-12 lg:grid-cols-[1.2fr_1fr]"
      >
        <div>
          <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs">
            <Sparkles className="h-3.5 w-3.5 text-[color:var(--ph)]" />
            New · Updated for 2026
          </span>
          <h1 className="mt-5 font-display text-5xl sm:text-6xl font-bold tracking-tight leading-[1.05]">
            <span className="text-gradient">The exact playbook</span>
            <br />
            <span className="text-gradient-brand">that ranked my SaaS #1.</span>
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-xl">
            No fluff. The launch strategy, featuring checklist, outreach scripts,
            and day-of-launch playbook I used to take Lancepilot to #1 on Product
            Hunt, now packaged for any founder.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 items-center">
            <a
              href={SITE.links.gumroad}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-6 py-3.5 text-sm font-semibold text-white shadow-[0_20px_50px_-15px_oklch(0.72_0.2_45/0.5)]"
            >
              Get Instant Access <ArrowRight className="h-4 w-4" />
            </a>
            <span className="text-xs text-muted-foreground">
              Delivered via Gumroad · Instant download
            </span>
          </div>
          <div className="mt-8 grid grid-cols-3 max-w-md gap-3">
            {[
              { v: "8", l: "Chapters" },
              { v: "100%", l: "From real launches" },
              { v: "Free", l: "Lifetime updates" },
            ].map((s) => (
              <div key={s.l} className="glass rounded-xl p-3 text-center">
                <div className="font-display text-lg font-bold text-gradient">{s.v}</div>
                <div className="mt-0.5 text-[10px] text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-10 bg-gradient-brand opacity-25 blur-3xl rounded-full animate-pulse-glow" />
          <img
            src={ebook}
            alt="PH Launch Success Playbook by Istiak Ahmad"
            width={520}
            height={780}
            className="relative mx-auto w-[400px] animate-float drop-shadow-[0_40px_80px_oklch(0.65_0.24_295/0.45)]"
          />
        </div>
      </div>
    </Section>
  );
}

function Chapters() {
  return (
    <Section
      eyebrow="What's inside"
      title="8 chapters. Zero theory."
      description="Each chapter maps to something I actually did to win a launch."
    >
      <div className="grid sm:grid-cols-2 gap-5">
        {CHAPTERS.map((c) => {
          const ref = useReveal<HTMLDivElement>();
          return (
            <div
              key={c.n}
              ref={ref}
              className="reveal glass-strong rounded-2xl p-6 hover-lift"
            >
              <div className="flex items-start gap-4">
                <span className="shrink-0 font-display text-2xl font-bold text-gradient-brand">
                  {c.n}
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold">{c.t}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{c.d}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

function Video() {
  return (
    <Section eyebrow="Watch" title="A 60-second look at the playbook.">
      <div className="mx-auto max-w-3xl aspect-video overflow-hidden rounded-2xl glass-strong shadow-card">
        <iframe
          src={SITE.links.ebookVideo}
          title="PH Launch Success Playbook intro by Istiak Ahmad"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
    </Section>
  );
}

function Author() {
  return (
    <Section eyebrow="Why learn from me" title="A founder who shipped, not a guru.">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
        {[
          { v: "#1", l: "PH Product of the Day (Lancepilot)" },
          { v: "8+", l: "Top-5 launches hunted" },
          { v: "2000+", l: "PH-aware LinkedIn network" },
          { v: "8y", l: "Building and shipping SaaS" },
        ].map((s) => (
          <div key={s.l} className="glass-strong rounded-2xl p-6 text-center">
            <div className="font-display text-3xl font-bold text-gradient">{s.v}</div>
            <div className="mt-2 text-xs text-muted-foreground">{s.l}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Bonus() {
  return (
    <Section eyebrow="Bonus" title="More than just an ebook.">
      <div className="mx-auto max-w-2xl glass-strong rounded-2xl p-8">
        <ul className="space-y-3">
          {BONUSES.map((b) => (
            <li key={b} className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--ph)]" />
              <span className="text-sm text-foreground/85">{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

function FinalBuy() {
  return (
    <Section>
      <div className="relative overflow-hidden rounded-3xl glass-strong p-10 sm:p-16 text-center shadow-card">
        <div className="absolute inset-0 bg-gradient-hero opacity-80" />
        <div className="relative">
          <BookOpen className="mx-auto h-8 w-8 text-[color:var(--ph)]" />
          <h2 className="mt-4 font-display text-4xl sm:text-5xl font-bold tracking-tight text-gradient">
            Ready to launch and rank?
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-muted-foreground">
            Stop guessing. Get the exact strategy that ranked my SaaS #1, used by
            8+ founders since.
          </p>
          <a
            href={SITE.links.gumroad}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-6 py-3.5 text-sm font-semibold text-white"
          >
            Buy on Gumroad <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </Section>
  );
}
