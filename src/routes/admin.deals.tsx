import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getAllDeals, getSiteSettings, type DiscountedDeal, type SiteSettings } from "@/lib/cms.functions";
import { upsertDeal, deleteDeal, uploadMedia, updateSiteSettings } from "@/lib/admin.functions";
import { Pencil, Trash2, Plus, X, Upload, Tag } from "lucide-react";

export const Route = createFileRoute("/admin/deals")({
  head: () => ({
    meta: [{ title: "Discounted Deals | Admin" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: DealsAdmin,
});

type DealForm = {
  id?: string;
  name: string;
  tagline: string;
  description: string;
  banner_url: string;
  original_price: number;
  discounted_price: number;
  currency: string;
  whatsapp_message: string;
  featured: boolean;
  active: boolean;
  sort_order: number;
};

const blank: DealForm = {
  name: "",
  tagline: "",
  description: "",
  banner_url: "",
  original_price: 0,
  discounted_price: 0,
  currency: "USD",
  whatsapp_message: "",
  featured: false,
  active: true,
  sort_order: 100,
};

function DealsAdmin() {
  const fetchDeals = useServerFn(getAllDeals);
  const fetchSettings = useServerFn(getSiteSettings);
  const saveSettings = useServerFn(updateSiteSettings);
  const upsert = useServerFn(upsertDeal);
  const remove = useServerFn(deleteDeal);
  const qc = useQueryClient();

  const { data: deals = [], isLoading } = useQuery({
    queryKey: ["admin-deals"],
    queryFn: () => fetchDeals(),
  });

  const { data: settings } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: () => fetchSettings(),
  });

  const [cfg, setCfg] = useState({
    enabled: true,
    heading: "Discounted Deals",
    subheading: "",
  });

  useEffect(() => {
    if (!settings) return;
    const links = (settings as any)?.links ?? {};
    const dc = links.dealsConfig ?? {};
    setCfg({
      enabled: dc.enabled === undefined ? true : dc.enabled === true || dc.enabled === "true",
      heading: dc.heading ?? "Discounted Deals",
      subheading: dc.subheading ?? "",
    });
  }, [settings]);

  const cfgMut = useMutation({
    mutationFn: (next: typeof cfg) => {
      const links = { ...(((settings as SiteSettings | null)?.links ?? {}) as Record<string, any>) };
      links.dealsConfig = { enabled: !!next.enabled, heading: next.heading, subheading: next.subheading };
      const payload: SiteSettings = { ...(settings ?? {}), links };
      return saveSettings({ data: payload as any });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-settings"] });
      qc.invalidateQueries({ queryKey: ["site-settings"] });
    },
  });

  const [editing, setEditing] = useState<DealForm | null>(null);

  const saveMut = useMutation({
    mutationFn: (payload: DealForm) => {
      const data = {
        ...payload,
        tagline: payload.tagline || null,
        description: payload.description || null,
        banner_url: payload.banner_url || null,
        whatsapp_message: payload.whatsapp_message || null,
      };
      return upsert({ data: data as any });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-deals"] });
      qc.invalidateQueries({ queryKey: ["active-deals"] });
      setEditing(null);
    },
  });

  const delMut = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-deals"] });
      qc.invalidateQueries({ queryKey: ["active-deals"] });
    },
  });

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-2">
            <Tag className="h-7 w-7 text-[color:var(--ph)]" /> Discounted Deals
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Products you're selling at a discount. Visitors contact you via WhatsApp.
          </p>
        </div>
        <button
          onClick={() => setEditing({ ...blank })}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-brand px-4 py-2 text-sm font-semibold text-white"
        >
          <Plus className="h-4 w-4" /> Add deal
        </button>
      </div>

      {/* Section toggle */}
      <div className="mt-6 glass-strong rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-base font-bold">Section visibility</h2>
            <p className="text-xs text-muted-foreground">
              When off, the Discounted Deals section is completely hidden from the landing page.
            </p>
          </div>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={cfg.enabled}
              onChange={(e) => setCfg({ ...cfg, enabled: e.target.checked })}
              className="h-5 w-5"
            />
            <span className="text-sm font-medium">{cfg.enabled ? "Visible" : "Hidden"}</span>
          </label>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Section heading">
            <input
              className={input}
              value={cfg.heading}
              onChange={(e) => setCfg({ ...cfg, heading: e.target.value })}
            />
          </Field>
          <Field label="Section subheading">
            <input
              className={input}
              value={cfg.subheading}
              onChange={(e) => setCfg({ ...cfg, subheading: e.target.value })}
            />
          </Field>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => cfgMut.mutate(cfg)}
            disabled={cfgMut.isPending}
            className="rounded-lg bg-gradient-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {cfgMut.isPending ? "Saving…" : "Save section settings"}
          </button>
          {cfgMut.isSuccess && <span className="text-xs text-green-400">Saved.</span>}
          {cfgMut.isError && <span className="text-xs text-red-400">{(cfgMut.error as Error).message}</span>}
        </div>
      </div>

      {/* Deals table */}
      {isLoading ? (
        <p className="mt-8 text-sm text-muted-foreground">Loading…</p>
      ) : deals.length === 0 ? (
        <div className="mt-6 glass-strong rounded-2xl p-10 text-center">
          <p className="text-sm text-muted-foreground">No deals yet. Click "Add deal" to create your first one.</p>
        </div>
      ) : (
        <div className="mt-6 glass-strong rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase text-muted-foreground bg-black/30">
              <tr>
                <th className="text-left px-4 py-3">Deal</th>
                <th className="text-left px-4 py-3">Price</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Order</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(deals as DiscountedDeal[]).map((d) => (
                <tr key={d.id} className="border-t border-white/5">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {d.banner_url ? (
                        <img src={d.banner_url} alt="" className="h-10 w-16 object-cover rounded" />
                      ) : (
                        <div className="h-10 w-16 rounded bg-white/5" />
                      )}
                      <div>
                        <div className="font-medium">{d.name}</div>
                        {d.tagline && <div className="text-xs text-muted-foreground">{d.tagline}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    <span className="text-foreground font-medium">
                      {d.currency} {Number(d.discounted_price)}
                    </span>
                    {Number(d.original_price) > Number(d.discounted_price) && (
                      <span className="ml-2 line-through text-xs">
                        {d.currency} {Number(d.original_price)}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 space-x-1">
                    <span
                      className={`text-[10px] rounded px-1.5 py-0.5 ${
                        d.active
                          ? "bg-green-500/20 text-green-300"
                          : "bg-white/10 text-muted-foreground"
                      }`}
                    >
                      {d.active ? "ACTIVE" : "HIDDEN"}
                    </span>
                    {d.featured && (
                      <span className="text-[10px] rounded bg-[color:var(--ph)]/20 text-[color:var(--ph)] px-1.5 py-0.5">
                        FEATURED
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{d.sort_order}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() =>
                        setEditing({
                          id: d.id,
                          name: d.name,
                          tagline: d.tagline ?? "",
                          description: d.description ?? "",
                          banner_url: d.banner_url ?? "",
                          original_price: Number(d.original_price),
                          discounted_price: Number(d.discounted_price),
                          currency: d.currency || "USD",
                          whatsapp_message: d.whatsapp_message ?? "",
                          featured: d.featured,
                          active: d.active,
                          sort_order: d.sort_order,
                        })
                      }
                      className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs hover:bg-white/10"
                    >
                      <Pencil className="h-3 w-3" /> Edit
                    </button>
                    <button
                      onClick={() => confirm(`Delete "${d.name}"?`) && delMut.mutate(d.id)}
                      className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-3 w-3" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <DealModal
          editing={editing}
          setEditing={setEditing}
          onSave={(d) => saveMut.mutate(d)}
          saving={saveMut.isPending}
          error={(saveMut.error as Error | null)?.message ?? null}
          uploadFn={uploadMedia}
        />
      )}
    </div>
  );
}

function DealModal({
  editing,
  setEditing,
  onSave,
  saving,
  error,
  uploadFn,
}: {
  editing: DealForm;
  setEditing: (d: DealForm | null) => void;
  onSave: (d: DealForm) => void;
  saving: boolean;
  error: string | null;
  uploadFn: typeof uploadMedia;
}) {
  const upload = useServerFn(uploadFn);
  const [uploading, setUploading] = useState(false);

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const s = String(reader.result || "");
          resolve(s.split(",")[1] || "");
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const res: any = await upload({
        data: { filename: file.name, base64, mime_type: file.type, alt: editing.name },
      });
      if (res?.public_url) {
        setEditing({ ...editing, banner_url: res.public_url });
      }
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 grid place-items-center p-4 overflow-y-auto">
      <div className="w-full max-w-xl glass-strong rounded-2xl p-6 my-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">{editing.id ? "Edit" : "Add"} deal</h2>
          <button onClick={() => setEditing(null)}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(editing);
          }}
          className="mt-5 space-y-3"
        >
          <Field label="Product name">
            <input
              required
              maxLength={200}
              value={editing.name}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              className={input}
            />
          </Field>
          <Field label="Tagline (short)">
            <input
              maxLength={300}
              value={editing.tagline}
              onChange={(e) => setEditing({ ...editing, tagline: e.target.value })}
              className={input}
            />
          </Field>
          <Field label="Description / Features">
            <textarea
              rows={5}
              maxLength={2000}
              value={editing.description}
              onChange={(e) => setEditing({ ...editing, description: e.target.value })}
              placeholder={"1K Lovable Pro credits\nProject transferrable\n1 month validity"}
              className={input}
            />
            <p className="mt-1 text-[11px] text-muted-foreground">
              Tip: put each feature on its own line to show them as bullet points on the card.
            </p>
          </Field>

          <Field label="Banner image URL">
            <div className="flex gap-2">
              <input
                value={editing.banner_url}
                onChange={(e) => setEditing({ ...editing, banner_url: e.target.value })}
                placeholder="https://..."
                className={input}
              />
              <label className="shrink-0 inline-flex items-center gap-1 rounded-lg glass px-3 py-2 text-xs cursor-pointer hover:bg-white/10">
                <Upload className="h-3 w-3" />
                {uploading ? "…" : "Upload"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleUpload(f);
                  }}
                />
              </label>
            </div>
            {editing.banner_url && (
              <img
                src={editing.banner_url}
                alt=""
                className="mt-2 h-28 w-full object-cover rounded-lg border border-white/10"
              />
            )}
          </Field>

          <div className="grid grid-cols-3 gap-3">
            <Field label="Original price">
              <input
                required
                type="number"
                min={0}
                step="0.01"
                value={editing.original_price}
                onChange={(e) => setEditing({ ...editing, original_price: Number(e.target.value) })}
                className={input}
              />
            </Field>
            <Field label="Discounted price">
              <input
                required
                type="number"
                min={0}
                step="0.01"
                value={editing.discounted_price}
                onChange={(e) => setEditing({ ...editing, discounted_price: Number(e.target.value) })}
                className={input}
              />
            </Field>
            <Field label="Currency">
              <input
                required
                maxLength={8}
                value={editing.currency}
                onChange={(e) => setEditing({ ...editing, currency: e.target.value.toUpperCase() })}
                className={input}
              />
            </Field>
          </div>

          <Field label="WhatsApp message (optional override)">
            <input
              maxLength={500}
              placeholder={`Hi! I'm interested in "${editing.name || "your deal"}".`}
              value={editing.whatsapp_message}
              onChange={(e) => setEditing({ ...editing, whatsapp_message: e.target.value })}
              className={input}
            />
          </Field>

          <div className="grid grid-cols-3 gap-3">
            <Field label="Sort order">
              <input
                required
                type="number"
                value={editing.sort_order}
                onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })}
                className={input}
              />
            </Field>
            <Field label="Active">
              <select
                value={editing.active ? "1" : "0"}
                onChange={(e) => setEditing({ ...editing, active: e.target.value === "1" })}
                className={input}
              >
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
            </Field>
            <Field label="Featured">
              <select
                value={editing.featured ? "1" : "0"}
                onChange={(e) => setEditing({ ...editing, featured: e.target.value === "1" })}
                className={input}
              >
                <option value="0">No</option>
                <option value="1">Yes</option>
              </select>
            </Field>
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-lg bg-gradient-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save deal"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="rounded-lg glass px-4 py-2 text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const input = "w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
