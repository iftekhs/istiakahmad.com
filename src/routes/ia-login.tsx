import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/ia-login")({
  head: () => ({
    meta: [
      { title: "Login" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return setError(error.message);
    navigate({ to: "/admin" });
  };

  return (
    <div className="min-h-dvh grid place-items-center bg-background px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm glass-strong rounded-2xl p-8 space-y-5">
        <div>
          <h1 className="font-display text-2xl font-bold">Admin</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to manage the site.</p>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Email</label>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Password</label>
          <input
            type="password"
            required
            minLength={6}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm"
          />
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-gradient-brand px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Please wait…" : "Sign in"}
        </button>
        <p className="text-[11px] text-muted-foreground text-center">
          Admin accounts are provisioned by the site owner.
        </p>
      </form>
    </div>
  );
}
