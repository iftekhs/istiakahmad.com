import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { getAllPageContent } from "@/lib/cms.functions";

export const Route = createFileRoute("/admin/pages")({
  head: () => ({ meta: [{ title: "Pages | Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: PagesAdmin,
});

function PagesAdmin() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const fetchAll = useServerFn(getAllPageContent);
  const { data = [], isLoading } = useQuery({ queryKey: ["admin-pages"], queryFn: () => fetchAll() });

  if (pathname !== "/admin/pages") return <Outlet />;

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-3xl font-bold">Pages</h1>
      <p className="mt-2 text-sm text-muted-foreground">Edit the structured content for each page.</p>
      {isLoading ? (
        <p className="mt-6 text-sm text-muted-foreground">Loading…</p>
      ) : (
        <div className="mt-6 grid sm:grid-cols-2 gap-3">
          {data.map((p: any) => (
            <Link
              key={p.page_key}
              to="/admin/pages/$key"
              params={{ key: p.page_key }}
              className="glass-strong rounded-xl p-5 hover:bg-white/5"
            >
              <div className="font-display text-lg font-bold">{p.label}</div>
              <div className="mt-1 text-xs text-muted-foreground">/{p.page_key === "home" ? "" : p.page_key}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
