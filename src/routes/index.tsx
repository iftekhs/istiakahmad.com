import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Trophy,
  Users,
  Rocket,
  BadgeCheck,
  Target,
  MessageSquareHeart,
  Megaphone,
  CalendarClock,
  Compass,
  ExternalLink,
} from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Section } from "@/components/Section";
import { SITE, LAUNCHES } from "@/lib/site";
import { useCountUp, useReveal } from "@/hooks/use-reveal";
import heroBg from "@/assets/hero-bg.jpg";
import ebookMock from "@/assets/ebook-mockup.png";
import phBadge from "@/assets/ph-badge.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Istiak Ahmad | Rank #1 on Product Hunt" },
      {
        name: "description",
        content:
          "Proven Product Hunt launch expert. SaaS founder, verified hunter, 8+ Top 5 launches. Get the playbook, book a call, or launch with me.",
      },
      { property: "og:title", content: "Istiak Ahmad | Rank #1 on Product Hunt" },
      {
        property: "og:description",
        content:
          "I help founders launch and rank Top #1 on Product Hunt. Get the playbook or book a 1:1 strategy call.",
      },
      { property: "og:url", content: "https://istiakahmad.com/" },
    ],
    links: [{ rel: "canonical", href: "https://istiakahmad.com/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "How do you rank #1 on Product Hunt?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Ranking #1 on Product Hunt comes from three things: a launch page built for the homepage (clear tagline, demo video, strong first comment), a pre-warmed network of PH-active supporters who comment in the first 4 hours, and 24h of active launch-day operations. There is no shortcut — upvote farms get penalized. Real momentum from real users wins.",
              },
            },
            {
              "@type": "Question",
              name: "What does a Product Hunt hunter do?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "A hunter is a trusted Product Hunt member who submits your product to the platform. A verified hunter with an active network gives you a higher chance of being featured on the homepage and reaches their followers automatically when the launch goes live.",
              },
            },
            {
              "@type": "Question",
              name: "How long does it take to prepare a Product Hunt launch?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Plan for 2–3 weeks of preparation: 1 week for assets (page, video, copy, first comment), 1–2 weeks for outreach and warming your network. You can move faster if assets are ready, but more lead time consistently produces a better rank.",
              },
            },
            {
              "@type": "Question",
              name: "Do you guarantee a #1 finish on Product Hunt?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "No serious operator guarantees rank — too many variables are outside your control. What is guaranteed: a complete launch system, real homepage strategy, and active outreach. Every product I have personally hunted has finished in the Top 5.",
              },
            },
            {
              "@type": "Question",
              name: "What is Istiak Ahmad known for?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Istiak Ahmad is a SaaS founder and verified Product Hunt hunter who launched his own product Lancepilot to #1 Product of the Day. He has since hunted or managed 8+ Product Hunt launches that all finished in the Top 5, and authored the PH Launch Success Playbook.",
              },
            },
            {
              "@type": "Question",
              name: "Where can I work with Istiak Ahmad?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "You can book a 1:1 launch strategy consultation or hire done-for-you launch management through his Upwork profile, get the self-serve playbook on Gumroad, or message him directly on WhatsApp and LinkedIn.",
              },
            },
          ],
        }),
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <PageShell>
      <Hero />
      <TrustMarquee />
      <LancepilotProof />
      <PortfolioPreview />
      <Offerings />
      <WhyMe />
      <AboutTeaser />
      <FinalCTA />
    </PageShell>
  );
}

/* ───────────────────────── Hero ───────────────────────── */

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <img
        src={heroBg}
        alt=""
        aria-hidden="true"
        width={1920}
        height={1080}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-70"
      />
      <div className="absolute inset-0 grid-bg" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-12 pb-20 sm:pt-20 sm:pb-32 lg:pt-24 lg:pb-40">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <a
              href={SITE.links.producthunt}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs font-medium"
            >
              <BadgeCheck className="h-3.5 w-3.5 text-[color:var(--ph)]" />
              Verified Product Hunt Hunter
              <ArrowRight className="h-3 w-3 opacity-60" />
            </a>

            <h1 className="mt-6 font-display text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] tracking-tight break-words">
              <span className="text-gradient">Rank </span>
              <span className="text-gradient-brand">#1</span>
              <span className="text-gradient"> on Product Hunt.</span>
              <br />
              <span className="text-foreground/90">No guesswork. </span>
              <span className="text-foreground/60">Just proven launches.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base sm:text-lg text-muted-foreground">
              I'm Istiak Ahmad, a SaaS founder who launched{" "}
              <span className="text-foreground">Lancepilot</span> to{" "}
              <span className="text-foreground">#1 of the day</span>, then helped 5+
              founders do the same. End-to-end launch strategy, outreach, and
              execution.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={SITE.links.gumroad}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-5 py-3 text-sm font-semibold text-white shadow-[0_20px_50px_-15px_oklch(0.72_0.2_45/0.5)] hover:opacity-95 transition-opacity"
              >
                Get the Playbook
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href={SITE.links.consultation}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl glass px-5 py-3 text-sm font-semibold hover:bg-white/10 transition-colors"
              >
                Book a Call
              </a>
              <Link
                to="/portfolio"
                className="inline-flex items-center gap-2 px-3 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                View Launches <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <dl className="mt-12 grid grid-cols-3 gap-4 max-w-lg">
              <Stat value={6} suffix="+" label="Top-ranked launches" />
              <Stat value={2000} suffix="+" label="Founder network" />
              <Stat value={1} prefix="#" label="Product of the Day" />
            </dl>
          </div>

          <div className="relative hidden lg:block">
            <div className="absolute -inset-10 bg-gradient-brand opacity-20 blur-3xl rounded-full animate-pulse-glow" />
            <div className="relative animate-float">
              <img
                src={phBadge}
                alt="Product Hunt #1 Product of the Day badge"
                width={520}
                height={520}
                className="mx-auto w-[420px] drop-shadow-[0_30px_60px_oklch(0.72_0.2_45/0.45)]"
              />
            </div>
            <div className="absolute -bottom-2 left-6 glass-strong rounded-2xl p-4 shadow-card max-w-[220px]">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Trophy className="h-3.5 w-3.5 text-[color:var(--ph)]" />
                Lancepilot
              </div>
              <p className="mt-1 text-sm font-semibold">
                #1 Day · #2 Week · #1 Marketing/Month
              </p>
            </div>
            <div className="absolute top-2 right-2 glass-strong rounded-2xl p-4 shadow-card max-w-[200px]">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-[color:var(--purple)]" />
                ToolSpend
              </div>
              <p className="mt-1 text-sm font-semibold">#2 Product of the Day</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({
  value,
  suffix,
  prefix,
  label,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
}) {
  const ref = useCountUp(value);
  return (
    <div>
      <div className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-gradient">
        {prefix}
        <span ref={ref}>0</span>
        {suffix}
      </div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

/* ───────────────────────── Marquee ───────────────────────── */

function TrustMarquee() {
  const items = [
    "🏆 #1 Product of the Day",
    "🥈 #2 Product of the Week",
    "🚀 #1 Marketing of the Month",
    "✅ Verified Hunter",
    "🎯 8+ Top-Ranked Launches",
    "👥 2000+ Founder Network",
    "📈 300+ Signups in 24h",
    "💎 Featured on PH Homepage",
  ];
  const doubled = [...items, ...items];
  return (
    <section className="relative py-10 border-y border-border/60 bg-black/30 overflow-hidden">
      <div className="flex animate-marquee gap-12 whitespace-nowrap">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="text-sm font-medium text-muted-foreground tracking-wide"
          >
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}

/* ───────────────────────── Lancepilot proof ───────────────────────── */

function LancepilotProof() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <Section
      eyebrow="The Proof"
      title="Lancepilot: my own #1 launch."
      description="I didn't just consult on launches. I built and launched a real SaaS to the top of Product Hunt. 300+ signups in 24h. $62k valuation in one month."
    >
      <div
        ref={ref}
        className="reveal relative glass-strong rounded-3xl p-8 sm:p-12 shadow-card overflow-hidden"
      >
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-gradient-brand opacity-20 blur-3xl" />
        <div className="grid gap-10 lg:grid-cols-2 items-center">
          <div>
            <div className="flex flex-wrap gap-2">
              {[
                "#1 Product of the Day",
                "#2 Product of the Week",
                "#1 Marketing / Week",
                "#1 Marketing / Month",
              ].map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--ph)]/15 border border-[color:var(--ph)]/30 px-3 py-1 text-xs font-medium text-[color:var(--ph)]"
                >
                  <Trophy className="h-3 w-3" />
                  {b}
                </span>
              ))}
            </div>
            <h3 className="mt-6 font-display text-3xl sm:text-4xl font-bold">
              From idea to #1, without paid ads.
            </h3>
            <p className="mt-4 text-muted-foreground">
              Lancepilot is a WhatsApp marketing platform. We launched on April 8,
              2024, hit #1 on day one, swept the marketing category, and got
              inbound interest from investors in the US and Europe within 60 days.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-4">
              {[
                { v: "300+", l: "Signups in 24h" },
                { v: "$62k", l: "Valuation in 30d" },
                { v: "2", l: "Investors reached out" },
              ].map((s) => (
                <div key={s.l} className="glass rounded-xl p-4">
                  <div className="font-display text-2xl font-bold text-gradient">
                    {s.v}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{s.l}</div>
                </div>
              ))}
            </div>
            <a
              href={SITE.links.lancepilot}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-[color:var(--ph)] transition-colors"
            >
              View the Lancepilot launch <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 bg-gradient-brand opacity-20 blur-3xl rounded-full" />
            <div className="relative glass rounded-2xl p-6">
              <div className="text-xs text-muted-foreground">April 8, 2024</div>
              <div className="mt-1 font-display text-xl font-semibold">
                Launch Day Timeline
              </div>
              <ol className="mt-5 space-y-4 text-sm">
                {[
                  ["00:01 PST", "Live on Product Hunt. Featured on homepage."],
                  ["+02h", "Crossed 100 upvotes. Climbing leaderboard."],
                  ["+06h", "Took #1 of the day. Held it through EU + US peak."],
                  ["+24h", "Closed #1 Day. Week and month rankings followed."],
                ].map(([time, line]) => (
                  <li key={time} className="flex gap-3">
                    <span className="shrink-0 w-16 text-xs font-mono text-[color:var(--ph)]">
                      {time}
                    </span>
                    <span className="text-muted-foreground">{line}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ───────────────────────── Portfolio preview ───────────────────────── */

function PortfolioPreview() {
  return (
    <Section
      eyebrow="Launch Portfolio"
      title="8 launches. All Top 5."
      description="Every product I've hunted or launched has finished in the Top 5 of the day."
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {LAUNCHES.map((l) => (
          <LaunchCard key={l.name} l={l} />
        ))}
      </div>
      <div className="mt-12 text-center">
        <Link
          to="/portfolio"
          className="inline-flex items-center gap-2 rounded-xl glass px-5 py-3 text-sm font-semibold hover:bg-white/10 transition-colors"
        >
          See full portfolio <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </Section>
  );
}

function LaunchCard({ l }: { l: (typeof LAUNCHES)[number] }) {
  const ref = useReveal<HTMLAnchorElement>();
  const isOne = l.rank.startsWith("#1");
  return (
    <a
      ref={ref}
      href={l.href}
      target="_blank"
      rel="noopener noreferrer"
      className="reveal group relative glass-strong rounded-2xl p-6 hover-lift overflow-hidden"
    >
      <div
        className={`absolute -top-16 -right-16 h-40 w-40 rounded-full blur-3xl opacity-30 ${
          isOne ? "bg-[color:var(--ph)]" : "bg-[color:var(--purple)]"
        }`}
      />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <div className="text-xs text-muted-foreground">{l.date} · {l.role}</div>
          <h3 className="mt-1 font-display text-xl font-bold">{l.name}</h3>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
            isOne
              ? "bg-[color:var(--ph)]/20 text-[color:var(--ph)] border border-[color:var(--ph)]/40"
              : "bg-[color:var(--purple)]/20 text-[color:var(--purple)] border border-[color:var(--purple)]/40"
          }`}
        >
          {l.rank}
        </span>
      </div>
      <p className="relative mt-3 text-sm text-muted-foreground">{l.description}</p>
      {l.extra.length > 0 && (
        <div className="relative mt-3 flex flex-wrap gap-1.5">
          {l.extra.map((e) => (
            <span
              key={e}
              className="rounded-full bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] text-muted-foreground"
            >
              {e}
            </span>
          ))}
        </div>
      )}
      <div className="relative mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-foreground/70 group-hover:text-foreground">
        View launch <ExternalLink className="h-3 w-3" />
      </div>
    </a>
  );
}

/* ───────────────────────── Offerings ───────────────────────── */

function Offerings() {
  return (
    <Section
      eyebrow="Work with me"
      title="Three ways to launch like a winner."
      description="Whether you want the playbook, a one-time strategy call, or done-for-you launch management, start where you are."
    >
      <div className="grid gap-6 lg:grid-cols-3 items-stretch">
        <OfferCard
          tag="Self-serve · $"
          title="PH Launch Success Playbook"
          subtitle="The ebook"
          desc="My exact step-by-step launch strategy to get featured, gather support, and rank Top 5. Includes private LinkedIn group access."
          cta="Get the Playbook"
          href={SITE.links.gumroad}
          accent="orange"
          featured
        />
        <OfferCard
          tag="1:1 · $$"
          title="Strategy Consultation"
          subtitle="Book a call"
          desc="A focused video call to review your product, design your launch strategy, and pressure-test your roadmap."
          cta="Book a Call"
          href={SITE.links.consultation}
          accent="purple"
        />
        <OfferCard
          tag="Done-for-you · $$$"
          title="Full Launch Management"
          subtitle="I hunt & run it"
          desc="End-to-end launch ops: page, assets, outreach, launch-day execution, and post-launch follow-through."
          cta="Work With Me"
          href="/services"
          accent="purple"
          internal
        />
      </div>
    </Section>
  );
}

function OfferCard({
  tag,
  title,
  subtitle,
  desc,
  cta,
  href,
  accent,
  featured,
  internal,
}: {
  tag: string;
  title: string;
  subtitle: string;
  desc: string;
  cta: string;
  href: string;
  accent: "orange" | "purple";
  featured?: boolean;
  internal?: boolean;
}) {
  const ref = useReveal<HTMLDivElement>();
  const accentColor =
    accent === "orange" ? "var(--ph)" : "var(--purple)";
  return (
    <div
      ref={ref}
      className={`reveal relative flex flex-col glass-strong rounded-3xl p-7 shadow-card overflow-hidden ${
        featured ? "ring-1 ring-[color:var(--ph)]/40" : ""
      }`}
    >
      {featured && (
        <span className="absolute top-4 right-4 rounded-full bg-[color:var(--ph)] text-[color:var(--ph-foreground)] text-[10px] font-bold px-2 py-0.5">
          MOST POPULAR
        </span>
      )}
      <div
        className="absolute -top-24 -left-24 h-56 w-56 rounded-full opacity-20 blur-3xl"
        style={{ background: `oklch(from ${accentColor} l c h)` }}
      />
      <div className="relative">
        <div className="text-xs font-medium text-muted-foreground">{tag}</div>
        <div className="mt-2 text-xs uppercase tracking-wider text-muted-foreground/80">
          {subtitle}
        </div>
        <h3 className="mt-1 font-display text-2xl font-bold">{title}</h3>
        <p className="mt-3 text-sm text-muted-foreground">{desc}</p>
      </div>
      <div className="relative mt-auto pt-6">
        {internal ? (
          <Link
            to={href}
            className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-opacity ${
              accent === "orange"
                ? "bg-gradient-brand text-white"
                : "glass hover:bg-white/10"
            }`}
          >
            {cta} <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-opacity ${
              accent === "orange"
                ? "bg-gradient-brand text-white"
                : "glass hover:bg-white/10"
            }`}
          >
            {cta} <ArrowRight className="h-4 w-4" />
          </a>
        )}
      </div>
    </div>
  );
}

/* ───────────────────────── Why me ───────────────────────── */

function WhyMe() {
  const items = [
    {
      Icon: Target,
      title: "Launch Strategy",
      desc: "Positioning, target audience, launch slot timing, engineered for max momentum.",
    },
    {
      Icon: Rocket,
      title: "Launch Page Optimization",
      desc: "Title, tagline, gallery, video, first comment, built to get featured.",
    },
    {
      Icon: Megaphone,
      title: "Community Outreach",
      desc: "Authentic outreach to my private network of hunters, makers, and PH veterans.",
    },
    {
      Icon: BadgeCheck,
      title: "Featuring Strategy",
      desc: "I know the un-written rules to land on the PH homepage on launch day.",
    },
    {
      Icon: CalendarClock,
      title: "Launch Day Ops",
      desc: "I'm on the controls for 24h: comment responses, escalations, real-time push.",
    },
    {
      Icon: Compass,
      title: "Founder Mentorship",
      desc: "I've been the founder. I'll tell you the truth, not what you want to hear.",
    },
  ];
  return (
    <Section
      eyebrow="Why founders work with me"
      title="A founder who actually shipped, not a marketing agency."
      description="I built and shipped my own SaaS. I know launch-day reality. I've already made the mistakes for you."
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ Icon, title, desc }) => {
          const ref = useReveal<HTMLDivElement>();
          return (
            <div
              key={title}
              ref={ref}
              className="reveal glass rounded-2xl p-6 hover-lift"
            >
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-brand text-white">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

/* ───────────────────────── About teaser ───────────────────────── */

function AboutTeaser() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <Section>
      <div
        ref={ref}
        className="reveal grid items-center gap-12 lg:grid-cols-[1fr_1.3fr]"
      >
        <div className="relative">
          <div className="absolute -inset-6 bg-gradient-brand opacity-15 blur-3xl rounded-full" />
          <img
            src={ebookMock}
            alt="PH Launch Success Playbook ebook by Istiak Ahmad"
            width={400}
            height={600}
            loading="lazy"
            className="relative mx-auto w-[320px] drop-shadow-[0_30px_60px_oklch(0.65_0.24_295/0.35)]"
          />
        </div>
        <div>
          <span className="inline-flex items-center rounded-full glass px-3 py-1 text-xs font-medium">
            The Playbook
          </span>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl font-bold tracking-tight text-gradient">
            Everything I know, in one playbook.
          </h2>
          <p className="mt-5 text-muted-foreground">
            My exact launch strategy, featuring checklist, outreach scripts, and
            day-of-launch playbook. Built from real launches that finished #1.
          </p>
          <ul className="mt-6 space-y-2.5 text-sm">
            {[
              "Step-by-step Product Hunt launch strategy",
              "How to get featured on the PH homepage",
              "Outreach scripts that don't ask for upvotes",
              "Private premium LinkedIn group access",
              "Hunter-for-hire option included",
            ].map((b) => (
              <li key={b} className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--ph)]" />
                <span className="text-foreground/85">{b}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={SITE.links.gumroad}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-5 py-3 text-sm font-semibold text-white"
            >
              Get Instant Access <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              to="/playbook"
              className="inline-flex items-center gap-2 rounded-xl glass px-5 py-3 text-sm font-semibold hover:bg-white/10"
            >
              Preview chapters
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ───────────────────────── Final CTA ───────────────────────── */

function FinalCTA() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <Section>
      <div
        ref={ref}
        className="reveal relative overflow-hidden rounded-3xl glass-strong p-10 sm:p-16 text-center shadow-card"
      >
        <div className="absolute inset-0 bg-gradient-hero opacity-80" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs">
            <MessageSquareHeart className="h-3.5 w-3.5 text-[color:var(--ph)]" />
            Ready to launch?
          </div>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl font-bold tracking-tight text-gradient">
            Launch like a Top Product Hunt winner.
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-muted-foreground">
            Grab the playbook, book a call, or hand me the launch end-to-end.
            Either way, you go in with a real strategy.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={SITE.links.gumroad}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-5 py-3 text-sm font-semibold text-white"
            >
              Buy the Playbook
            </a>
            <a
              href={SITE.links.consultation}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl glass px-5 py-3 text-sm font-semibold hover:bg-white/10"
            >
              Book Consultation
            </a>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 rounded-xl glass px-5 py-3 text-sm font-semibold hover:bg-white/10"
            >
              Work With Me
            </Link>
          </div>
          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            Trusted by founders launching on Product Hunt
          </div>
        </div>
      </div>
    </Section>
  );
}
