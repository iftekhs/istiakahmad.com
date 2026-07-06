import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { KeyRound, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/admin/account")({
  head: () => ({ meta: [{ title: "Account | Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: AccountAdmin,
});

function AccountAdmin() {
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    if (newPw.length < 8) return setMsg({ kind: "err", text: "New password must be at least 8 characters." });
    if (newPw !== confirmPw) return setMsg({ kind: "err", text: "New passwords don't match." });
    if (newPw === currentPw) return setMsg({ kind: "err", text: "New password must be different from the current one." });

    setLoading(true);
    try {
      // Step 1: re-authenticate with current password to prove identity
      const { data: sessionData } = await supabase.auth.getUser();
      const email = sessionData.user?.email;
      if (!email) throw new Error("No active session.");

      const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password: currentPw });
      if (signInErr) throw new Error("Current password is incorrect.");

      // Step 2: update password
      const { error: updErr } = await supabase.auth.updateUser({ password: newPw });
      if (updErr) throw updErr;

      setMsg({ kind: "ok", text: "Password updated successfully." });
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
    } catch (err: any) {
      setMsg({ kind: "err", text: err?.message ?? "Failed to update password." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-3xl font-bold">Account</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage your admin login credentials.</p>

      <form onSubmit={onSubmit} className="mt-8 glass-strong rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-2">
          <KeyRound className="h-5 w-5 text-[color:var(--ph)]" />
          <h2 className="font-display text-lg font-bold">Change password</h2>
        </div>

        <Field label="Current password" type={show ? "text" : "password"} value={currentPw} onChange={setCurrentPw} autoComplete="current-password" />
        <Field label="New password" type={show ? "text" : "password"} value={newPw} onChange={setNewPw} autoComplete="new-password" />
        <Field label="Confirm new password" type={show ? "text" : "password"} value={confirmPw} onChange={setConfirmPw} autoComplete="new-password" />

        <label className="flex items-center gap-2 text-xs text-muted-foreground select-none">
          <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} className="accent-[color:var(--ph)]" />
          {show ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
          Show passwords
        </label>

        {msg && (
          <div className={`flex items-start gap-2 rounded-lg px-3 py-2 text-xs ${msg.kind === "ok" ? "bg-emerald-500/10 text-emerald-300" : "bg-red-500/10 text-red-300"}`}>
            {msg.kind === "ok" ? <CheckCircle2 className="h-4 w-4 mt-0.5" /> : <AlertCircle className="h-4 w-4 mt-0.5" />}
            <span>{msg.text}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-gradient-brand px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Updating…" : "Update password"}
        </button>

        <p className="text-[11px] text-muted-foreground">
          Tip: use at least 12 characters with a mix of letters, numbers and symbols. Avoid reused or leaked passwords.
        </p>
      </form>
    </div>
  );
}

function Field({
  label, type, value, onChange, autoComplete,
}: { label: string; type: string; value: string; onChange: (v: string) => void; autoComplete?: string }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <input
        type={type}
        required
        minLength={8}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--ph)]/40"
      />
    </div>
  );
}
