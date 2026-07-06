import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { checkIsAdmin } from "@/lib/admin.functions";
import { LogOut, LayoutDashboard, Trophy, Settings, FileText, Search, Image as ImageIcon, ClipboardList, Tag, Package, Activity, Menu, X, KeyRound } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => setMobileOpen(false), [pathname]);
  const check = useServerFn(checkIsAdmin);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-check"],
    queryFn: () => check(),
    retry: false,
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate({ to: "/ia-login" });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) navigate({ to: "/ia-login" });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  if (isLoading) {
    return <div className="min-h-dvh grid place-items-center text-sm text-muted-foreground">Loading…</div>;
  }
  if (isError || !data?.isAdmin) {
    return (
      <div className="min-h-dvh grid place-items-center px-4">
        <div className="max-w-sm text-center space-y-3">
          <h1 className="font-display text-xl font-bold">Not authorized</h1>
          <p className="text-sm text-muted-foreground">Your account doesn't have admin access.</p>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/ia-login" });
            }}
            className="rounded-lg glass px-4 py-2 text-sm"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  const nav = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { to: "/admin/launches", label: "Launches", icon: Trophy },
    { to: "/admin/products", label: "Products", icon: Package },
    { to: "/admin/deals", label: "Discounted Deals", icon: Tag },
    { to: "/admin/pages", label: "Pages", icon: FileText },
    { to: "/admin/seo", label: "SEO", icon: Search },
    { to: "/admin/media", label: "Media", icon: ImageIcon },
    { to: "/admin/site-settings", label: "Site Settings", icon: Settings },
    { to: "/admin/tracking", label: "Tracking & Pixels", icon: Activity },
    { to: "/admin/audit", label: "Audit log", icon: ClipboardList },
    { to: "/admin/account", label: "Account", icon: KeyRound },
  ];

  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  const SidebarBody = (
    <>
      <div className="mb-6 px-2">
        <div className="font-display text-lg font-bold">Admin</div>
        <div className="text-xs text-muted-foreground">istiakahmad.com</div>
      </div>
      <nav className="space-y-1">
        {nav.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
              isActive(n.to, n.exact)
                ? "bg-white/10 text-foreground"
                : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
            }`}
          >
            <n.icon className="h-4 w-4" />
            {n.label}
          </Link>
        ))}
      </nav>
      <button
        onClick={async () => {
          await supabase.auth.signOut();
          navigate({ to: "/ia-login" });
        }}
        className="mt-6 md:mt-auto flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <LogOut className="h-4 w-4" /> Sign out
      </button>
    </>
  );

  return (
    <div className="min-h-dvh flex bg-background">
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-border/60 bg-black/30 p-4">
        {SidebarBody}
      </aside>
      <div className="md:hidden fixed top-0 inset-x-0 z-40 flex items-center justify-between border-b border-border/60 bg-background/95 backdrop-blur px-4 py-3">
        <div className="font-display text-base font-bold">Admin</div>
        <button aria-label="Open menu" onClick={() => setMobileOpen(true)} className="rounded-lg glass p-2">
          <Menu className="h-5 w-5" />
        </button>
      </div>
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/70" onClick={() => setMobileOpen(false)}>
          <aside
            className="absolute left-0 top-0 h-full w-64 flex flex-col bg-background border-r border-border/60 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
              className="self-end rounded-lg glass p-2 mb-2"
            >
              <X className="h-5 w-5" />
            </button>
            {SidebarBody}
          </aside>
        </div>
      )}
      <main className="flex-1 p-6 sm:p-10 pt-20 md:pt-10 overflow-x-auto">
        <Outlet />
      </main>
    </div>
  );
}
