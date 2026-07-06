import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getSiteSettings, getLaunches, type SiteSettings } from "@/lib/cms.functions";
import { SITE, LAUNCHES } from "@/lib/site";

export type CmsLaunch = {
  name: string;
  role: string;
  date: string;
  rank: string;
  extra: string[];
  description: string;
  href: string;
  featured?: boolean;
};

/** Returns live site settings, falling back to static SITE if DB is empty / loading. */
export function useSiteSettings() {
  const fetchSettings = useServerFn(getSiteSettings);
  const { data } = useQuery({
    queryKey: ["site-settings"],
    queryFn: () => fetchSettings(),
    staleTime: 60_000,
  });

  const merged: Required<Pick<SiteSettings, "name" | "url" | "title" | "description">> & {
    contactEmail: string;
    links: Record<string, string>;
  } = {
    name: data?.name ?? SITE.name,
    url: data?.url ?? SITE.url,
    title: data?.title ?? SITE.title,
    description: data?.description ?? SITE.description,
    contactEmail: data?.contactEmail ?? "",
    links: { ...SITE.links, ...(data?.links ?? {}) },
  };
  return merged;
}

/** Returns live launches, falling back to static LAUNCHES if DB is empty / loading. */
export function useLaunches(): CmsLaunch[] {
  const fetchLaunches = useServerFn(getLaunches);
  const { data } = useQuery({
    queryKey: ["launches"],
    queryFn: () => fetchLaunches(),
    staleTime: 60_000,
  });

  if (!data || data.length === 0) {
    return LAUNCHES.map((l) => ({
      name: l.name,
      role: l.role,
      date: l.date,
      rank: l.rank,
      extra: [...l.extra],
      description: l.description,
      href: l.href,
      featured: (l as any).featured ?? false,
    }));
  }
  return data.map((l: any) => ({
    name: l.name,
    role: l.role,
    date: l.launch_date,
    rank: l.rank,
    extra: Array.isArray(l.extras) ? l.extras : [],
    description: l.description,
    href: l.href,
    featured: !!l.featured,
  }));
}
