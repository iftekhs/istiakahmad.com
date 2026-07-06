import type { TrackingSettings, CustomSnippet } from "./tracking.functions";

/** Pages where tracking should NEVER load (admin panel, login). */
const BLOCKED_PREFIXES = ["/admin", "/ia-login"];

export function isTrackingBlocked(pathname: string): boolean {
  return BLOCKED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/") || pathname.startsWith(p));
}

function snippetMatchesRoute(snippet: CustomSnippet, pathname: string): boolean {
  const routes = (snippet.routes || "all").trim();
  if (!routes || routes === "all") return true;
  if (routes.startsWith("include:")) {
    const list = routes
      .slice("include:".length)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    return list.some((r) => pathname === r || pathname.startsWith(r));
  }
  if (routes.startsWith("exclude:")) {
    const list = routes
      .slice("exclude:".length)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    return !list.some((r) => pathname === r || pathname.startsWith(r));
  }
  return true;
}

/** Build script entries for the document <head> based on pixel config. */
export function buildHeadScripts(t: TrackingSettings): Array<{
  type?: string;
  src?: string;
  async?: boolean;
  children?: string;
}> {
  const scripts: Array<{ type?: string; src?: string; async?: boolean; children?: string }> = [];

  // Google Tag Manager (head part)
  if (t.gtm.enabled && t.gtm.id) {
    const id = JSON.stringify(t.gtm.id);
    scripts.push({
      type: "text/javascript",
      children: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer',${id});`,
    });
  }

  // Google Analytics 4 (gtag)
  if (t.ga4.enabled && t.ga4.id) {
    const id = t.ga4.id;
    scripts.push({
      src: `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`,
      async: true,
    });
    scripts.push({
      type: "text/javascript",
      children: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config',${JSON.stringify(id)});`,
    });
  }

  // Meta (Facebook) Pixel
  if (t.metaPixel.enabled && t.metaPixel.id) {
    const id = JSON.stringify(t.metaPixel.id);
    scripts.push({
      type: "text/javascript",
      children: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init',${id});fbq('track','PageView');`,
    });
  }

  // LinkedIn Insight Tag
  if (t.linkedin.enabled && t.linkedin.id) {
    const id = JSON.stringify(t.linkedin.id);
    scripts.push({
      type: "text/javascript",
      children: `_linkedin_partner_id=${id};window._linkedin_data_partner_ids=window._linkedin_data_partner_ids||[];window._linkedin_data_partner_ids.push(_linkedin_partner_id);(function(l){if(!l){window.lintrk=function(a,b){window.lintrk.q.push([a,b])};window.lintrk.q=[]}var s=document.getElementsByTagName("script")[0];var b=document.createElement("script");b.type="text/javascript";b.async=true;b.src="https://snap.licdn.com/li.lms-analytics/insight.min.js";s.parentNode.insertBefore(b,s);})(window.lintrk);`,
    });
  }

  // TikTok Pixel
  if (t.tiktok.enabled && t.tiktok.id) {
    const id = JSON.stringify(t.tiktok.id);
    scripts.push({
      type: "text/javascript",
      children: `!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=i;ttq._t=ttq._t||{};ttq._t[e]=+new Date;ttq._o=ttq._o||{};ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};ttq.load(${id});ttq.page();}(window,document,'ttq');`,
    });
  }

  // Microsoft Clarity
  if (t.clarity.enabled && t.clarity.id) {
    const id = JSON.stringify(t.clarity.id);
    scripts.push({
      type: "text/javascript",
      children: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script",${id});`,
    });
  }

  // Hotjar
  if (t.hotjar.enabled && t.hotjar.id) {
    const id = JSON.stringify(t.hotjar.id);
    scripts.push({
      type: "text/javascript",
      children: `(function(h,o,t,j,a,r){h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};h._hjSettings={hjid:${id},hjsv:6};a=o.getElementsByTagName('head')[0];r=o.createElement('script');r.async=1;r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;a.appendChild(r);})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`,
    });
  }

  return scripts;
}

type CustomBuckets = {
  bodyStart: CustomSnippet[];
  bodyEnd: CustomSnippet[];
  head: CustomSnippet[];
};

export function filterSnippets(
  t: TrackingSettings,
  pathname: string,
): CustomBuckets {
  const enabled = t.customSnippets.filter((s) => s.enabled && snippetMatchesRoute(s, pathname));
  return {
    head: enabled.filter((s) => s.placement === "head"),
    bodyStart: enabled.filter((s) => s.placement === "body-start"),
    bodyEnd: enabled.filter((s) => s.placement === "body-end"),
  };
}

/** Render a list of snippets (raw HTML) into a hidden div. */
export function SnippetSlot({ snippets, slot }: { snippets: CustomSnippet[]; slot: string }) {
  if (!snippets.length) return null;
  const html = snippets.map((s) => s.code).join("\n");
  return (
    <div
      data-tracking-slot={slot}
      style={{ display: "contents" }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/** Meta-pixel <noscript> img fallbacks — must live in <body>, not <head>. */
export function NoscriptPixels({ t }: { t: TrackingSettings }) {
  return (
    <>
      {t.metaPixel.enabled && t.metaPixel.id && (
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            alt=""
            src={`https://www.facebook.com/tr?id=${encodeURIComponent(t.metaPixel.id)}&ev=PageView&noscript=1`}
          />
        </noscript>
      )}
      {t.gtm.enabled && t.gtm.id && (
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${encodeURIComponent(t.gtm.id)}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
      )}
    </>
  );
}
