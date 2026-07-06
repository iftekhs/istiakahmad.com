import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Section } from "@/components/Section";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | Istiak Ahmad" },
      {
        name: "description",
        content:
          "How istiakahmad.com collects, uses, and protects your information.",
      },
      { property: "og:title", content: "Privacy Policy | Istiak Ahmad" },
      {
        property: "og:description",
        content: "How istiakahmad.com collects, uses, and protects your information.",
      },
      { property: "og:url", content: "/privacy" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <PageShell>
      <Section
        eyebrow="Legal"
        title="Privacy Policy"
        description="Last updated: May 24, 2026"
      >
        <div className="glass-strong rounded-3xl p-8 sm:p-12 space-y-8 text-sm leading-relaxed text-muted-foreground">
          <Block title="Who we are">
            <p>
              This website (istiakahmad.com) is operated by Istiak Ahmad, an
              independent SaaS founder and Product Hunt launch consultant. If
              you have any questions about this policy, contact me via the{" "}
              <Link to="/contact" className="text-foreground underline">contact page</Link>.
            </p>
          </Block>

          <Block title="What we collect">
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-foreground">Visitor analytics</strong>{" "}
                via Leadsourcing — including IP address, approximate location,
                referring company, pages viewed, and device type. This helps me
                understand which content resonates with founders.
              </li>
              <li>
                <strong className="text-foreground">Contact form data</strong>{" "}
                — only the name, email, and message you choose to send via the
                contact form. This is delivered to me directly and is not
                stored in a database.
              </li>
            </ul>
          </Block>

          <Block title="Why we collect it">
            <p>
              To measure site performance, improve content, and respond to
              inquiries about launches and consulting. I do not sell your data
              to anyone, ever.
            </p>
          </Block>

          <Block title="Third parties">
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-foreground">Leadsourcing</strong> —
                visitor analytics. See their{" "}
                <a
                  href="https://leadsourcing.co/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground underline"
                >
                  privacy policy
                </a>
                .
              </li>
              <li>
                <strong className="text-foreground">Google Fonts</strong> —
                used to render typography. Requests are made directly from your
                browser to Google.
              </li>
            </ul>
          </Block>

          <Block title="Your rights">
            <p>
              You can request access to, correction of, or deletion of any
              personal data I hold about you. To opt out of Leadsourcing
              tracking, use your browser's "Do Not Track" setting or a
              tracker-blocking extension. Send any data request to me via the{" "}
              <Link to="/contact" className="text-foreground underline">contact page</Link>.
            </p>
          </Block>

          <Block title="Changes">
            <p>
              I may update this policy from time to time. Material changes will
              be reflected by updating the "Last updated" date above.
            </p>
          </Block>
        </div>
      </Section>
    </PageShell>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-xl font-bold text-foreground mb-3">{title}</h2>
      {children}
    </div>
  );
}
