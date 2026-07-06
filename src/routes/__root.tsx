import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { SITE } from "@/lib/site";
import ogDefault from "@/assets/og-default.jpg";
import { getTrackingSettings, defaultTracking } from "@/lib/tracking.functions";
import {
  buildHeadScripts,
  filterSnippets,
  isTrackingBlocked,
  SnippetSlot,
  NoscriptPixels,
} from "@/lib/tracking";

const OG_IMAGE = `${SITE.url}${ogDefault}`;

function NotFoundComponent() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-gradient-brand">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-brand px-4 py-2 text-sm font-medium text-white"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-xl bg-gradient-brand px-4 py-2 text-sm font-medium text-white"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-xl glass px-4 py-2 text-sm font-medium text-foreground"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  loader: async ({ context }) => {
    try {
      const tracking = await context.queryClient.ensureQueryData({
        queryKey: ["tracking-settings"],
        queryFn: () => getTrackingSettings(),
        staleTime: 60_000,
      });
      return { tracking };
    } catch (e) {
      console.error("root loader tracking", e);
      return { tracking: defaultTracking() };
    }
  },
  head: ({ loaderData }) => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: SITE.title },
      { name: "description", content: SITE.description },
      { name: "author", content: "Istiak Ahmad" },
      { name: "theme-color", content: "#0b0a14" },
      {
        name: "robots",
        content: "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1",
      },
      { name: "application-name", content: SITE.name },
      { name: "apple-mobile-web-app-title", content: SITE.name },
      { property: "og:site_name", content: SITE.name },
      { property: "og:type", content: "website" },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:width", content: "1216" },
      { property: "og:image:height", content: "640" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: OG_IMAGE },
      { name: "twitter:creator", content: "@istiakahmad" },
      { title: "Lovable App" },
      { property: "og:title", content: "Lovable App" },
      { name: "twitter:title", content: "Lovable App" },
      { name: "description", content: "Launch Mastery Hub empowers founders to achieve top rankings on Product Hunt." },
      { property: "og:description", content: "Launch Mastery Hub empowers founders to achieve top rankings on Product Hunt." },
      { name: "twitter:description", content: "Launch Mastery Hub empowers founders to achieve top rankings on Product Hunt." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/b2183f77-bef0-46f0-8d86-6fe81ad02f44/id-preview-c5b00b94--c427f48d-fb70-4eee-9e6f-444ab7c1ead2.lovable.app-1779685219962.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/b2183f77-bef0-46f0-8d86-6fe81ad02f44/id-preview-c5b00b94--c427f48d-fb70-4eee-9e6f-444ab7c1ead2.lovable.app-1779685219962.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebSite",
              "@id": `${SITE.url}/#website`,
              url: SITE.url,
              name: SITE.name,
              description: SITE.description,
              inLanguage: "en",
              publisher: { "@id": `${SITE.url}/#person` },
            },
            {
              "@type": "Person",
              "@id": `${SITE.url}/#person`,
              name: "Istiak Ahmad",
              jobTitle: "SaaS Founder & Product Hunt Launch Expert",
              url: SITE.url,
              image: OG_IMAGE,
              sameAs: [
                SITE.links.producthunt,
                SITE.links.linkedin,
                SITE.links.youtube,
                SITE.links.upwork,
              ],
              knowsAbout: [
                "Product Hunt launches",
                "SaaS marketing",
                "Go-to-market strategy",
                "Product launch strategy",
                "Founder-led growth",
              ],
            },
            {
              "@type": "ProfessionalService",
              "@id": `${SITE.url}/#service`,
              name: "Istiak Ahmad — Product Hunt Launch Services",
              url: `${SITE.url}/services`,
              image: OG_IMAGE,
              priceRange: "$$",
              areaServed: "Worldwide",
              serviceType: "Product Hunt launch strategy and management",
              provider: { "@id": `${SITE.url}/#person` },
            },
          ],
        }),
      },
      {
        type: "text/javascript",
        children: `!function(e,t,n,r){(n=e.createElement("script")).src="//visitor.leadsourcing.co/n?tid="+t,(r=e.getElementsByTagName("script")[0]).parentNode.insertBefore(n,r)}(document,"08lPv6AWmzKr0ZVFeJlw");`,
      },
      ...buildHeadScripts(loaderData?.tracking ?? defaultTracking()),
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const loaderData = Route.useLoaderData();
  const tracking = loaderData?.tracking ?? defaultTracking();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const blocked = isTrackingBlocked(pathname);
  const buckets = blocked
    ? { head: [], bodyStart: [], bodyEnd: [] }
    : filterSnippets(tracking, pathname);
  return (
    <QueryClientProvider client={queryClient}>
      {!blocked && <NoscriptPixels t={tracking} />}
      {!blocked && <SnippetSlot snippets={buckets.bodyStart} slot="body-start" />}
      <Outlet />
      {!blocked && <SnippetSlot snippets={buckets.bodyEnd} slot="body-end" />}
    </QueryClientProvider>
  );
}

