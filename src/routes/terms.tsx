import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Section } from "@/components/Section";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service | Istiak Ahmad" },
      {
        name: "description",
        content: "Terms governing your use of istiakahmad.com.",
      },
      { property: "og:title", content: "Terms of Service | Istiak Ahmad" },
      { property: "og:description", content: "Terms governing your use of istiakahmad.com." },
      { property: "og:url", content: "/terms" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <PageShell>
      <Section
        eyebrow="Legal"
        title="Terms of Service"
        description="Last updated: May 24, 2026"
      >
        <div className="glass-strong rounded-3xl p-8 sm:p-12 space-y-8 text-sm leading-relaxed text-muted-foreground">
          <Block title="Acceptance">
            <p>
              By accessing istiakahmad.com you agree to these terms. If you do
              not agree, please don't use the site.
            </p>
          </Block>

          <Block title="Use of the site">
            <p>
              Content on this site is provided for informational purposes
              only. It reflects my personal experience launching products on
              Product Hunt and is not legal, financial, or investment advice.
              Results vary — past launch performance does not guarantee future
              results.
            </p>
          </Block>

          <Block title="Intellectual property">
            <p>
              All content on this site — text, graphics, logos, the Playbook,
              and case studies — is owned by Istiak Ahmad unless credited
              otherwise. You may share and reference content with attribution
              and a link back. You may not republish, resell, or repurpose it
              commercially without written permission.
            </p>
          </Block>

          <Block title="Third-party links">
            <p>
              This site links to third-party services (Product Hunt, Upwork,
              Gumroad, LinkedIn, YouTube, WhatsApp, and others). I'm not
              responsible for the content, terms, or privacy practices of those
              sites.
            </p>
          </Block>

          <Block title="Services and consulting">
            <p>
              Any consulting, launch management, or hunter services are
              governed by a separate agreement provided at the time of
              engagement. Nothing on this site constitutes a binding offer of
              services.
            </p>
          </Block>

          <Block title="Limitation of liability">
            <p>
              The site is provided "as is" without warranties of any kind. To
              the maximum extent permitted by law, Istiak Ahmad is not liable
              for any indirect, incidental, or consequential damages arising
              from your use of the site or its content.
            </p>
          </Block>

          <Block title="Governing law">
            <p>
              These terms are governed by the laws of the United Kingdom. Any
              disputes will be handled in UK courts.
            </p>
          </Block>

          <Block title="Contact">
            <p>
              Questions about these terms? Reach out via the{" "}
              <Link to="/contact" className="text-foreground underline">contact page</Link>.
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
