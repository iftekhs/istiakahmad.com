import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getTrackingSettings,
  updateTrackingSettings,
  defaultTracking,
  type TrackingSettings,
  type CustomSnippet,
  type PixelConfig,
} from "@/lib/tracking.functions";
import { AlertTriangle, Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/tracking")({
  head: () => ({
    meta: [
      { title: "Tracking & Integrations | Admin" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: TrackingAdmin,
});

const PIXELS: Array<{
  key: keyof Omit<TrackingSettings, "customSnippets">;
  label: string;
  placeholder: string;
  hint: string;
}> = [
  { key: "ga4", label: "Google Analytics 4", placeholder: "G-XXXXXXXXXX", hint: "Measurement ID" },
  { key: "gtm", label: "Google Tag Manager", placeholder: "GTM-XXXXXX", hint: "Container ID" },
  { key: "metaPixel", label: "Meta (Facebook) Pixel", placeholder: "123456789012345", hint: "Pixel ID" },
  { key: "linkedin", label: "LinkedIn Insight", placeholder: "1234567", hint: "Partner ID" },
  { key: "tiktok", label: "TikTok Pixel", placeholder: "C4XXXXXXXXXXXXXXXXX", hint: "Pixel Code" },
  { key: "clarity", label: "Microsoft Clarity", placeholder: "abcdef1234", hint: "Project ID" },
  { key: "hotjar", label: "Hotjar", placeholder: "1234567", hint: "Site ID" },
];

const PLACEMENTS: Array<{ value: CustomSnippet["placement"]; label: string }> = [
  { value: "body-end", label: "End of <body> (recommended)" },
  { value: "body-start", label: "Start of <body>" },
  { value: "head", label: "<head>" },
];

function TrackingAdmin() {
  const fetchFn = useServerFn(getTrackingSettings);
  const saveFn = useServerFn(updateTrackingSettings);
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-tracking"],
    queryFn: () => fetchFn(),
  });
  const [form, setForm] = useState<TrackingSettings>(defaultTracking());

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const mut = useMutation({
    mutationFn: (payload: TrackingSettings) => saveFn({ data: payload as any }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-tracking"] });
      qc.invalidateQueries({ queryKey: ["tracking-settings"] });
    },
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  const setPixel = (key: keyof Omit<TrackingSettings, "customSnippets">, patch: Partial<PixelConfig>) =>
    setForm({ ...form, [key]: { ...form[key], ...patch } });

  const addSnippet = () =>
    setForm({
      ...form,
      customSnippets: [
        ...form.customSnippets,
        {
          id: crypto.randomUUID(),
          name: "",
          code: "",
          placement: "body-end",
          routes: "all",
          enabled: true,
        },
      ],
    });

  const updateSnippet = (id: string, patch: Partial<CustomSnippet>) =>
    setForm({
      ...form,
      customSnippets: form.customSnippets.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    });

  const deleteSnippet = (id: string) =>
    setForm({ ...form, customSnippets: form.customSnippets.filter((s) => s.id !== id) });

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl font-bold">Tracking & Integrations</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Add analytics pixels and chat widgets without touching code. Changes apply on the next page load.
      </p>

      <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-amber-200">
        <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
        <div>
          Custom code runs on every visitor's browser. Only paste snippets from trusted vendors.
          Tracking is automatically skipped on <code>/admin</code> and <code>/ia-login</code>.
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          mut.mutate(form);
        }}
        className="mt-6 space-y-6"
      >
        {/* Quick-setup pixels */}
        <section className="glass-strong rounded-2xl p-5 space-y-4">
          <h2 className="font-display text-lg font-bold">Quick-setup pixels</h2>
          <p className="text-xs text-muted-foreground -mt-2">
            Just paste the ID — the snippet is generated automatically.
          </p>
          <div className="space-y-3">
            {PIXELS.map((p) => {
              const cfg = form[p.key] as PixelConfig;
              return (
                <div key={p.key} className="grid grid-cols-[1fr_auto] gap-3 items-end">
                  <label className="block space-y-1">
                    <span className="text-xs text-muted-foreground">
                      {p.label} <span className="opacity-60">— {p.hint}</span>
                    </span>
                    <input
                      className={input}
                      placeholder={p.placeholder}
                      value={cfg.id}
                      onChange={(e) => setPixel(p.key, { id: e.target.value.trim() })}
                    />
                  </label>
                  <label className="flex items-center gap-2 pb-2 text-xs">
                    <input
                      type="checkbox"
                      checked={cfg.enabled}
                      onChange={(e) => setPixel(p.key, { enabled: e.target.checked })}
                    />
                    Enabled
                  </label>
                </div>
              );
            })}
          </div>
        </section>

        {/* Custom code snippets */}
        <section className="glass-strong rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold">Custom code snippets</h2>
              <p className="text-xs text-muted-foreground">
                Chat widgets (Tawk, Crisp, Intercom), verification tags, anything with a script.
              </p>
            </div>
            <button
              type="button"
              onClick={addSnippet}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium hover:bg-white/15"
            >
              <Plus className="h-3.5 w-3.5" /> Add snippet
            </button>
          </div>

          {form.customSnippets.length === 0 && (
            <p className="text-xs text-muted-foreground italic">No custom snippets yet.</p>
          )}

          <div className="space-y-4">
            {form.customSnippets.map((s) => (
              <div key={s.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    className={input}
                    placeholder="Name (e.g. Tawk.to chat)"
                    value={s.name}
                    onChange={(e) => updateSnippet(s.id, { name: e.target.value })}
                  />
                  <label className="flex items-center gap-2 text-xs whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={s.enabled}
                      onChange={(e) => updateSnippet(s.id, { enabled: e.target.checked })}
                    />
                    Enabled
                  </label>
                  <button
                    type="button"
                    onClick={() => deleteSnippet(s.id)}
                    className="text-red-400 hover:text-red-300"
                    aria-label="Delete snippet"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="block space-y-1">
                    <span className="text-xs text-muted-foreground">Placement</span>
                    <select
                      className={input}
                      value={s.placement}
                      onChange={(e) =>
                        updateSnippet(s.id, { placement: e.target.value as CustomSnippet["placement"] })
                      }
                    >
                      {PLACEMENTS.map((p) => (
                        <option key={p.value} value={p.value}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block space-y-1">
                    <span className="text-xs text-muted-foreground">
                      Pages — <span className="opacity-60">all / include:/a,/b / exclude:/a</span>
                    </span>
                    <input
                      className={input}
                      placeholder="all"
                      value={s.routes}
                      onChange={(e) => updateSnippet(s.id, { routes: e.target.value })}
                    />
                  </label>
                </div>

                <label className="block space-y-1">
                  <span className="text-xs text-muted-foreground">Code (HTML/JS)</span>
                  <textarea
                    rows={6}
                    className={`${input} font-mono text-xs`}
                    placeholder="<script>...</script>"
                    value={s.code}
                    onChange={(e) => updateSnippet(s.id, { code: e.target.value })}
                  />
                </label>
              </div>
            ))}
          </div>
        </section>

        {mut.isError && (
          <p className="text-xs text-red-400">{(mut.error as Error).message}</p>
        )}
        {mut.isSuccess && <p className="text-xs text-green-400">Saved.</p>}

        <button
          type="submit"
          disabled={mut.isPending}
          className="rounded-lg bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {mut.isPending ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}

const input =
  "w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-white/20";
