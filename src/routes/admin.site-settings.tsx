import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getSiteSettings, type SiteSettings } from "@/lib/cms.functions";
import { updateSiteSettings } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/site-settings")({
  head: () => ({ meta: [{ title: "Site Settings | Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: SiteSettingsAdmin,
});

function SiteSettingsAdmin() {
  const fetchSettings = useServerFn(getSiteSettings);
  const save = useServerFn(updateSiteSettings);
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin-settings"], queryFn: () => fetchSettings() });
  const [form, setForm] = useState<SiteSettings>({});

  useEffect(() => { if (data) setForm(data); }, [data]);

  const mut = useMutation({
    mutationFn: (payload: SiteSettings) => save({ data: payload as any }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-settings"] }),
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  const links = form.links ?? {};
  const linkKeys = ["gumroad","upwork","consultation","producthunt","linkedin","youtube","whatsapp","whatsappChannel","tidycal","ebookVideo","lancepilot"];

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl font-bold">Site Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">Edit site-wide info and external links.</p>

      <form
        onSubmit={(e) => { e.preventDefault(); mut.mutate(form); }}
        className="mt-6 space-y-5"
      >
        <Section title="General">
          <Field label="Site name"><input className={input} value={form.name ?? ""} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="Public URL"><input className={input} value={form.url ?? ""} onChange={(e) => setForm({ ...form, url: e.target.value })} /></Field>
          <Field label="Default title"><input className={input} value={form.title ?? ""} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
          <Field label="Default description"><textarea rows={2} className={input} value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
          <Field label="Contact email"><input type="email" className={input} value={form.contactEmail ?? ""} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} /></Field>
        </Section>

        <Section title="External links">
          {linkKeys.map((k) => (
            <Field key={k} label={k}>
              <input
                className={input}
                value={links[k] ?? ""}
                onChange={(e) => setForm({ ...form, links: { ...links, [k]: e.target.value } })}
              />
            </Field>
          ))}
        </Section>

        {mut.isError && <p className="text-xs text-red-400">{(mut.error as Error).message}</p>}
        {mut.isSuccess && <p className="text-xs text-green-400">Saved.</p>}

        <button type="submit" disabled={mut.isPending} className="rounded-lg bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
          {mut.isPending ? "Saving…" : "Save"}
        </button>
      </form>
    </div>
  );
}

const input = "w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (<label className="block space-y-1"><span className="text-xs text-muted-foreground">{label}</span>{children}</label>);
}
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-strong rounded-2xl p-5 space-y-4">
      <h2 className="font-display text-lg font-bold">{title}</h2>
      {children}
    </div>
  );
}
