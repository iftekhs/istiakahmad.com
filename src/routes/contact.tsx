import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Section } from "@/components/Section";
import { SITE } from "@/lib/site";
import { useReveal } from "@/hooks/use-reveal";
import { z } from "zod";
import { toast } from "sonner";
import {
  Linkedin,
  Youtube,
  MessageCircle,
  Calendar,
  ExternalLink,
  Radio,
} from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Istiak Ahmad" },
      {
        name: "description",
        content:
          "Get in touch with Istiak Ahmad on WhatsApp, LinkedIn, Upwork, Product Hunt, or YouTube. Or book a consultation.",
      },
      { property: "og:title", content: "Contact Istiak Ahmad" },
      {
        property: "og:description",
        content: "Reach out via WhatsApp, LinkedIn, Upwork, or book a strategy call.",
      },
      { property: "og:url", content: "https://istiakahmad.com/contact" },
    ],
    links: [{ rel: "canonical", href: "https://istiakahmad.com/contact" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          url: `${SITE.url}/contact`,
          name: "Contact Istiak Ahmad",
          mainEntity: {
            "@type": "Person",
            name: "Istiak Ahmad",
            url: SITE.url,
            contactPoint: [
              {
                "@type": "ContactPoint",
                contactType: "Sales",
                url: SITE.links.whatsapp,
                availableLanguage: ["English"],
              },
              {
                "@type": "ContactPoint",
                contactType: "Customer Support",
                url: SITE.links.linkedin,
                availableLanguage: ["English"],
              },
            ],
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
            { "@type": "ListItem", position: 2, name: "Contact", item: `${SITE.url}/contact` },
          ],
        }),
      },
    ],
  }),
  component: ContactPage,
});

const CHANNELS = [
  {
    Icon: MessageCircle,
    label: "WhatsApp",
    value: "+44 7480 676 782",
    href: SITE.links.whatsapp,
    accent: "orange" as const,
  },
  {
    Icon: Calendar,
    label: "Book a 1:1 call",
    value: "Upwork consultation",
    href: SITE.links.consultation,
    accent: "purple" as const,
  },
  {
    Icon: Linkedin,
    label: "LinkedIn",
    value: "in/istiak-ahmad",
    href: SITE.links.linkedin,
    accent: "purple" as const,
  },
  {
    Icon: ExternalLink,
    label: "Product Hunt",
    value: "@istiakahmad",
    href: SITE.links.producthunt,
    accent: "orange" as const,
  },
  {
    Icon: ExternalLink,
    label: "Upwork",
    value: "Top-rated PH launch expert",
    href: SITE.links.upwork,
    accent: "purple" as const,
  },
  {
    Icon: Youtube,
    label: "YouTube",
    value: "@istiakahmadyoutube",
    href: SITE.links.youtube,
    accent: "purple" as const,
  },
  {
    Icon: Radio,
    label: "WhatsApp Channel",
    value: "Founder updates",
    href: SITE.links.whatsappChannel,
    accent: "orange" as const,
  },
];

function ContactPage() {
  return (
    <PageShell>
      <Section
        eyebrow="Contact"
        title="Let's talk launches."
        description="Fastest reply is on WhatsApp or LinkedIn. For booked sessions, use Upwork."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CHANNELS.map((c) => (
            <ChannelCard key={c.label} c={c} />
          ))}
        </div>
      </Section>

      <Section eyebrow="Message me" title="Drop a quick note.">
        <ContactForm />
      </Section>
    </PageShell>
  );
}

function ChannelCard({ c }: { c: (typeof CHANNELS)[number] }) {
  const ref = useReveal<HTMLAnchorElement>();
  return (
    <a
      ref={ref}
      href={c.href}
      target="_blank"
      rel="noopener noreferrer"
      className="reveal group relative glass-strong rounded-2xl p-6 hover-lift overflow-hidden"
    >
      <div
        className={`absolute -top-16 -right-16 h-36 w-36 rounded-full blur-3xl opacity-25 ${
          c.accent === "orange" ? "bg-[color:var(--ph)]" : "bg-[color:var(--purple)]"
        }`}
      />
      <div className="relative">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-brand text-white">
          <c.Icon className="h-5 w-5" />
        </div>
        <div className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">
          {c.label}
        </div>
        <div className="mt-1 font-display text-base font-semibold">{c.value}</div>
        <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-foreground/70 group-hover:text-foreground">
          Open <ExternalLink className="h-3 w-3" />
        </div>
      </div>
    </a>
  );
}

function ContactForm() {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        const name = String(f.get("name") || "").trim();
        const email = String(f.get("email") || "").trim();
        const product = String(f.get("product") || "").trim();
        const msg = String(f.get("message") || "").trim();

        const schema = z.object({
          name: z.string().min(1, "Please enter your name").max(100),
          email: z.string().email("Please enter a valid email").max(255),
          product: z.string().max(200).optional(),
          message: z
            .string()
            .min(1, "Tell me a bit about your launch")
            .max(1000, "Please keep it under 1000 characters"),
        });

        const result = schema.safeParse({ name, email, product, message: msg });
        if (!result.success) {
          toast.error(result.error.issues[0]?.message ?? "Please check the form");
          return;
        }

        const phone = "447480676782";
        const text =
          `🚀 New Product Hunt Launch Inquiry\n\n` +
          `👤 Name: ${name}\n` +
          `📧 Email: ${email}\n` +
          `🌐 Product / Website: ${product || "N/A"}\n` +
          `📝 What they want to launch:\n${msg}`;
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
        window.open(url, "_blank", "noopener,noreferrer");
      }}
      className="mx-auto max-w-2xl glass-strong rounded-3xl p-8 space-y-4 shadow-card"
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <Field name="name" label="Your name" placeholder="Jane Founder" required />
        <Field
          name="email"
          type="email"
          label="Email"
          placeholder="jane@startup.com"
          required
        />
      </div>
      <Field
        name="product"
        label="Product / website"
        placeholder="startup.com"
      />
      <div>
        <label className="text-xs font-medium text-muted-foreground">
          What do you want to launch?
        </label>
        <textarea
          name="message"
          required
          rows={5}
          placeholder="Tell me about your product, launch target date, and what you've already done..."
          className="mt-1.5 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)]"
        />
      </div>
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-5 py-3 text-sm font-semibold text-white"
        >
          <MessageCircle className="h-4 w-4" />
          Send on WhatsApp
        </button>
        <span className="text-xs text-muted-foreground">
          Opens WhatsApp in a new tab with your message pre-filled.
        </span>
      </div>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  placeholder,
  required,
}: {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)]"
      />
    </div>
  );
}
