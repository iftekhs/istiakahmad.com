import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { updatePageSeo, listPageSeo } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/seo")({
  head: () => ({ meta: [{ title: "SEO | Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: SeoAdmin,
});

type SeoRow = {
  page_key: string;
  title: string | null;
  description: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image_url: string | null;
  canonical_path: string | null;
};

function SeoAdmin() {
  const save = useServerFn(updatePageSeo);
  const fetchRows = useServerFn(listPageSeo);
  const qc = useQueryClient();
  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["admin-seo"],
    queryFn: async () => (await fetchRows()) as SeoRow[],
  });

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl font-bold">SEO</h1>
      <p className="mt-2 text-sm text-muted-foreground">Per-page meta tags and Open Graph overrides.</p>

      {isLoading ? (
        <p className="mt-6 text-sm text-muted-foreground">Loading…</p>
      ) : (
        <div className="mt-6 space-y-4">
          {rows.map((row) => (
            <SeoCard key={row.page_key} row={row} onSave={async (next) => {
              await save({ data: next });
              qc.invalidateQueries({ queryKey: ["admin-seo"] });
            }} />
          ))}
        </div>
      )}
    </div>
  );
}

function SeoCard({ row, onSave }: { row: SeoRow; onSave: (n: any) => Promise<void> }) {
  const [form, setForm] = useState(row);
  useEffect(() => setForm(row), [row]);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const update = (k: keyof SeoRow, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    setSaving(true);
    try {
      await onSave({
        page_key: form.page_key,
        title: form.title || null,
        description: form.description || null,
        og_title: form.og_title || null,
        og_description: form.og_description || null,
        og_image_url: form.og_image_url || null,
        canonical_path: form.canonical_path || null,
      });
      setSavedAt(Date.now());
    } finally {
      setSaving(false);
    }
  };

  return (
    <details className="glass-strong rounded-xl p-5" open={false}>
      <summary className="cursor-pointer font-display text-lg font-bold capitalize">{form.page_key}</summary>
      <div className="mt-4 grid gap-3">
        <Field label="Title" value={form.title ?? ""} onChange={(v) => update("title", v)} />
        <Field label="Description" value={form.description ?? ""} onChange={(v) => update("description", v)} textarea />
        <Field label="OG title" value={form.og_title ?? ""} onChange={(v) => update("og_title", v)} />
        <Field label="OG description" value={form.og_description ?? ""} onChange={(v) => update("og_description", v)} textarea />
        <Field label="OG image URL" value={form.og_image_url ?? ""} onChange={(v) => update("og_image_url", v)} />
        <Field label="Canonical path" value={form.canonical_path ?? ""} onChange={(v) => update("canonical_path", v)} />
        <div className="flex items-center gap-3">
          <button onClick={submit} disabled={saving} className="rounded-lg bg-gradient-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
            {saving ? "Saving…" : "Save"}
          </button>
          {savedAt && <span className="text-xs text-green-400">Saved.</span>}
        </div>
      </div>
    </details>
  );
}

function Field({ label, value, onChange, textarea }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean }) {
  return (
    <label className="block">
      <span className="text-xs text-muted-foreground">{label}</span>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={2} className="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm" />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm" />
      )}
    </label>
  );
}
