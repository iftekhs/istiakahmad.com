import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getAllProducts, getSiteSettings, type SiteSettings } from "@/lib/cms.functions";
import {
  upsertProduct,
  deleteProduct,
  uploadMedia,
  updateSiteSettings,
} from "@/lib/admin.functions";
import { Pencil, Trash2, Plus, X, Upload, Package } from "lucide-react";
import { slugify, type Product } from "@/lib/products.shared";

export const Route = createFileRoute("/admin/products")({
  head: () => ({
    meta: [{ title: "Products | Admin" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: ProductsAdmin,
});

type ProductForm = {
  id?: string;
  slug: string;
  name: string;
  tagline: string;
  category: string;
  short_description: string;
  long_description: string;
  banner_url: string;
  gallery: string[];
  youtube_url: string;
  features: string[];
  links: { label: string; url: string }[];
  faqs: { question: string; answer: string }[];
  pricing_mode: "fixed" | "from" | "quote_only";
  price: number | null;
  currency: string;
  whatsapp_message: string;
  featured: boolean;
  active: boolean;
  sort_order: number;
};

const blank: ProductForm = {
  slug: "",
  name: "",
  tagline: "",
  category: "",
  short_description: "",
  long_description: "",
  banner_url: "",
  gallery: [],
  youtube_url: "",
  features: [],
  links: [],
  faqs: [],
  pricing_mode: "quote_only",
  price: null,
  currency: "USD",
  whatsapp_message: "",
  featured: false,
  active: true,
  sort_order: 100,
};

function ProductsAdmin() {
  const fetchProducts = useServerFn(getAllProducts);
  const fetchSettings = useServerFn(getSiteSettings);
  const saveSettings = useServerFn(updateSiteSettings);
  const upsert = useServerFn(upsertProduct);
  const remove = useServerFn(deleteProduct);
  const qc = useQueryClient();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => fetchProducts(),
  });
  const { data: settings } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: () => fetchSettings(),
  });

  const [cfg, setCfg] = useState({ enabled: true, heading: "Our Products", subheading: "" });
  useEffect(() => {
    if (!settings) return;
    const links = (settings as any)?.links ?? {};
    const pc = links.productsConfig ?? {};
    setCfg({
      enabled: pc.enabled === undefined ? true : pc.enabled === true || pc.enabled === "true",
      heading: pc.heading ?? "Our Products",
      subheading: pc.subheading ?? "",
    });
  }, [settings]);

  const cfgMut = useMutation({
    mutationFn: (next: typeof cfg) => {
      const links = { ...(((settings as SiteSettings | null)?.links ?? {}) as Record<string, any>) };
      links.productsConfig = { enabled: !!next.enabled, heading: next.heading, subheading: next.subheading };
      const payload: SiteSettings = { ...(settings ?? {}), links };
      return saveSettings({ data: payload as any });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-settings"] });
      qc.invalidateQueries({ queryKey: ["site-settings"] });
    },
  });

  const [editing, setEditing] = useState<ProductForm | null>(null);

  const saveMut = useMutation({
    mutationFn: (payload: ProductForm) => {
      const data = {
        ...payload,
        tagline: payload.tagline || null,
        category: payload.category || null,
        short_description: payload.short_description || null,
        long_description: payload.long_description || null,
        banner_url: payload.banner_url || null,
        youtube_url: payload.youtube_url || null,
        whatsapp_message: payload.whatsapp_message || null,
        price: payload.pricing_mode === "quote_only" ? null : payload.price,
      };
      return upsert({ data: data as any });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["active-products"] });
      setEditing(null);
    },
  });

  const delMut = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["active-products"] });
    },
  });

  function toForm(p: Product): ProductForm {
    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      tagline: p.tagline ?? "",
      category: p.category ?? "",
      short_description: p.short_description ?? "",
      long_description: p.long_description ?? "",
      banner_url: p.banner_url ?? "",
      gallery: p.gallery ?? [],
      youtube_url: p.youtube_url ?? "",
      features: p.features ?? [],
      links: p.links ?? [],
      faqs: p.faqs ?? [],
      pricing_mode: p.pricing_mode,
      price: p.price,
      currency: p.currency || "USD",
      whatsapp_message: p.whatsapp_message ?? "",
      featured: p.featured,
      active: p.active,
      sort_order: p.sort_order,
    };
  }

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-2">
            <Package className="h-7 w-7 text-[color:var(--ph)]" /> Products
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your full product catalog. Each product gets a dedicated detail page.
          </p>
        </div>
        <button
          onClick={() => setEditing({ ...blank })}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-brand px-4 py-2 text-sm font-semibold text-white"
        >
          <Plus className="h-4 w-4" /> Add product
        </button>
      </div>

      {/* Section visibility */}
      <div className="mt-6 glass-strong rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-base font-bold">Section visibility</h2>
            <p className="text-xs text-muted-foreground">
              When off, the Products link is hidden from the header and /products shows an unavailable message.
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
            <input className={input} value={cfg.heading} onChange={(e) => setCfg({ ...cfg, heading: e.target.value })} />
          </Field>
          <Field label="Section subheading">
            <input className={input} value={cfg.subheading} onChange={(e) => setCfg({ ...cfg, subheading: e.target.value })} />
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

      {/* Products table */}
      {isLoading ? (
        <p className="mt-8 text-sm text-muted-foreground">Loading…</p>
      ) : products.length === 0 ? (
        <div className="mt-6 glass-strong rounded-2xl p-10 text-center">
          <p className="text-sm text-muted-foreground">No products yet. Click "Add product".</p>
        </div>
      ) : (
        <div className="mt-6 glass-strong rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase text-muted-foreground bg-black/30">
              <tr>
                <th className="text-left px-4 py-3">Product</th>
                <th className="text-left px-4 py-3">Category</th>
                <th className="text-left px-4 py-3">Pricing</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-white/5">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {p.banner_url ? (
                        <img src={p.banner_url} alt="" className="h-10 w-16 object-cover rounded" />
                      ) : (
                        <div className="h-10 w-16 rounded bg-white/5" />
                      )}
                      <div>
                        <div className="font-medium">{p.name}</div>
                        <div className="text-xs text-muted-foreground">/{p.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{p.category || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {p.pricing_mode === "quote_only" || p.price === null
                      ? "Quote only"
                      : `${p.pricing_mode === "from" ? "From " : ""}${p.currency} ${p.price}`}
                  </td>
                  <td className="px-4 py-3 space-x-1">
                    <span className={`text-[10px] rounded px-1.5 py-0.5 ${p.active ? "bg-green-500/20 text-green-300" : "bg-white/10 text-muted-foreground"}`}>
                      {p.active ? "ACTIVE" : "HIDDEN"}
                    </span>
                    {p.featured && (
                      <span className="text-[10px] rounded bg-[color:var(--ph)]/20 text-[color:var(--ph)] px-1.5 py-0.5">FEATURED</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => setEditing(toForm(p))}
                      className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs hover:bg-white/10"
                    >
                      <Pencil className="h-3 w-3" /> Edit
                    </button>
                    <button
                      onClick={() => confirm(`Delete "${p.name}"?`) && delMut.mutate(p.id)}
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
        <ProductModal
          editing={editing}
          setEditing={setEditing}
          onSave={(p) => saveMut.mutate(p)}
          saving={saveMut.isPending}
          error={(saveMut.error as Error | null)?.message ?? null}
        />
      )}
    </div>
  );
}

function ProductModal({
  editing,
  setEditing,
  onSave,
  saving,
  error,
}: {
  editing: ProductForm;
  setEditing: (p: ProductForm | null) => void;
  onSave: (p: ProductForm) => void;
  saving: boolean;
  error: string | null;
}) {
  const upload = useServerFn(uploadMedia);
  const [uploading, setUploading] = useState(false);

  async function handleUpload(file: File, target: "banner" | "gallery") {
    setUploading(true);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || "").split(",")[1] || "");
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const res: any = await upload({
        data: { filename: file.name, base64, mime_type: file.type, alt: editing.name },
      });
      if (res?.public_url) {
        if (target === "banner") setEditing({ ...editing, banner_url: res.public_url });
        else setEditing({ ...editing, gallery: [...editing.gallery, res.public_url] });
      }
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setUploading(false);
    }
  }

  function patchListItem<T>(arr: T[], i: number, patch: Partial<T>): T[] {
    return arr.map((it, idx) => (idx === i ? { ...it, ...patch } : it));
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 grid place-items-center p-4 overflow-y-auto">
      <div className="w-full max-w-3xl glass-strong rounded-2xl p-6 my-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">{editing.id ? "Edit" : "Add"} product</h2>
          <button onClick={() => setEditing(null)}><X className="h-5 w-5" /></button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(editing);
          }}
          className="mt-5 space-y-5"
        >
          {/* Basics */}
          <Section title="Basics">
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Product name">
                <input
                  required maxLength={200} className={input}
                  value={editing.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setEditing({
                      ...editing,
                      name,
                      slug: editing.slug && editing.id ? editing.slug : slugify(name),
                    });
                  }}
                />
              </Field>
              <Field label="Slug (URL)">
                <div className="flex gap-2">
                  <input
                    required maxLength={120} className={input}
                    value={editing.slug}
                    onChange={(e) => setEditing({ ...editing, slug: e.target.value.toLowerCase() })}
                  />
                  <button type="button" onClick={() => setEditing({ ...editing, slug: slugify(editing.name) })}
                    className="shrink-0 rounded-lg glass px-3 text-xs">Auto</button>
                </div>
              </Field>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Category">
                <input maxLength={80} className={input} value={editing.category}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })} />
              </Field>
              <Field label="Tagline (short)">
                <input maxLength={300} className={input} value={editing.tagline}
                  onChange={(e) => setEditing({ ...editing, tagline: e.target.value })} />
              </Field>
            </div>
            <Field label="Short description (card)">
              <textarea rows={2} maxLength={500} className={input} value={editing.short_description}
                onChange={(e) => setEditing({ ...editing, short_description: e.target.value })} />
            </Field>
            <Field label="Long description (detail page)">
              <textarea rows={6} maxLength={8000} className={input} value={editing.long_description}
                onChange={(e) => setEditing({ ...editing, long_description: e.target.value })}
                placeholder="Use blank lines to separate paragraphs." />
            </Field>
          </Section>

          {/* Media */}
          <Section title="Media">
            <Field label="Banner image">
              <div className="flex gap-2">
                <input className={input} placeholder="https://..." value={editing.banner_url}
                  onChange={(e) => setEditing({ ...editing, banner_url: e.target.value })} />
                <label className="shrink-0 inline-flex items-center gap-1 rounded-lg glass px-3 py-2 text-xs cursor-pointer hover:bg-white/10">
                  <Upload className="h-3 w-3" />{uploading ? "…" : "Upload"}
                  <input type="file" accept="image/*" className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f, "banner"); }} />
                </label>
              </div>
              {editing.banner_url && (
                <img src={editing.banner_url} alt="" className="mt-2 h-28 w-full object-cover rounded-lg border border-white/10" />
              )}
            </Field>
            <Field label="Gallery images">
              <label className="inline-flex items-center gap-1 rounded-lg glass px-3 py-2 text-xs cursor-pointer hover:bg-white/10">
                <Upload className="h-3 w-3" /> Add image
                <input type="file" accept="image/*" className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f, "gallery"); }} />
              </label>
              {editing.gallery.length > 0 && (
                <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {editing.gallery.map((g, i) => (
                    <div key={g + i} className="relative group">
                      <img src={g} alt="" className="h-20 w-full object-cover rounded border border-white/10" />
                      <button type="button"
                        onClick={() => setEditing({ ...editing, gallery: editing.gallery.filter((_, idx) => idx !== i) })}
                        className="absolute top-1 right-1 grid place-items-center h-6 w-6 rounded-full bg-black/80 opacity-0 group-hover:opacity-100">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Field>
            <Field label="YouTube URL (optional)">
              <input maxLength={500} className={input} placeholder="https://www.youtube.com/watch?v=..."
                value={editing.youtube_url}
                onChange={(e) => setEditing({ ...editing, youtube_url: e.target.value })} />
            </Field>
          </Section>

          {/* Features */}
          <Section title="Key features">
            <ListEditor
              items={editing.features.map((f) => ({ value: f }))}
              onAdd={() => setEditing({ ...editing, features: [...editing.features, ""] })}
              onRemove={(i) => setEditing({ ...editing, features: editing.features.filter((_, idx) => idx !== i) })}
              render={(it, i) => (
                <input className={input} placeholder="Feature" value={it.value}
                  onChange={(e) => setEditing({ ...editing, features: editing.features.map((v, idx) => idx === i ? e.target.value : v) })} />
              )}
              addLabel="Add feature"
            />
          </Section>

          {/* Links */}
          <Section title="Useful links">
            <ListEditor
              items={editing.links}
              onAdd={() => setEditing({ ...editing, links: [...editing.links, { label: "", url: "" }] })}
              onRemove={(i) => setEditing({ ...editing, links: editing.links.filter((_, idx) => idx !== i) })}
              render={(it, i) => (
                <div className="flex gap-2 w-full">
                  <input className={input + " flex-1"} placeholder="Label" value={it.label}
                    onChange={(e) => setEditing({ ...editing, links: patchListItem(editing.links, i, { label: e.target.value }) })} />
                  <input className={input + " flex-[2]"} placeholder="https://..." value={it.url}
                    onChange={(e) => setEditing({ ...editing, links: patchListItem(editing.links, i, { url: e.target.value }) })} />
                </div>
              )}
              addLabel="Add link"
            />
          </Section>

          {/* FAQ */}
          <Section title="FAQ">
            <ListEditor
              items={editing.faqs}
              onAdd={() => setEditing({ ...editing, faqs: [...editing.faqs, { question: "", answer: "" }] })}
              onRemove={(i) => setEditing({ ...editing, faqs: editing.faqs.filter((_, idx) => idx !== i) })}
              render={(it, i) => (
                <div className="w-full space-y-2">
                  <input className={input} placeholder="Question" value={it.question}
                    onChange={(e) => setEditing({ ...editing, faqs: patchListItem(editing.faqs, i, { question: e.target.value }) })} />
                  <textarea className={input} rows={2} placeholder="Answer" value={it.answer}
                    onChange={(e) => setEditing({ ...editing, faqs: patchListItem(editing.faqs, i, { answer: e.target.value }) })} />
                </div>
              )}
              addLabel="Add question"
            />
          </Section>

          {/* Pricing & Contact */}
          <Section title="Pricing & contact">
            <div className="grid sm:grid-cols-3 gap-3">
              <Field label="Pricing mode">
                <select className={input} value={editing.pricing_mode}
                  onChange={(e) => setEditing({ ...editing, pricing_mode: e.target.value as ProductForm["pricing_mode"] })}>
                  <option value="quote_only">Quote only</option>
                  <option value="fixed">Fixed price</option>
                  <option value="from">From price</option>
                </select>
              </Field>
              <Field label="Price">
                <input type="number" min={0} step="0.01" className={input}
                  disabled={editing.pricing_mode === "quote_only"}
                  value={editing.price ?? ""}
                  onChange={(e) => setEditing({ ...editing, price: e.target.value === "" ? null : Number(e.target.value) })} />
              </Field>
              <Field label="Currency">
                <input maxLength={8} className={input} value={editing.currency}
                  onChange={(e) => setEditing({ ...editing, currency: e.target.value.toUpperCase() })} />
              </Field>
            </div>
            <Field label="WhatsApp message (optional override)">
              <input maxLength={500} className={input}
                placeholder={`Hi! I'm interested in "${editing.name || "this product"}".`}
                value={editing.whatsapp_message}
                onChange={(e) => setEditing({ ...editing, whatsapp_message: e.target.value })} />
            </Field>
          </Section>

          {/* Status */}
          <Section title="Status">
            <div className="grid grid-cols-3 gap-3">
              <Field label="Sort order">
                <input type="number" className={input} value={editing.sort_order}
                  onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} />
              </Field>
              <Field label="Active">
                <select className={input} value={editing.active ? "1" : "0"}
                  onChange={(e) => setEditing({ ...editing, active: e.target.value === "1" })}>
                  <option value="1">Yes</option><option value="0">No</option>
                </select>
              </Field>
              <Field label="Featured">
                <select className={input} value={editing.featured ? "1" : "0"}
                  onChange={(e) => setEditing({ ...editing, featured: e.target.value === "1" })}>
                  <option value="0">No</option><option value="1">Yes</option>
                </select>
              </Field>
            </div>
          </Section>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={saving}
              className="flex-1 rounded-lg bg-gradient-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
              {saving ? "Saving…" : "Save product"}
            </button>
            <button type="button" onClick={() => setEditing(null)} className="rounded-lg glass px-4 py-2 text-sm">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3 border-t border-white/5 pt-4 first:border-0 first:pt-0">
      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</h3>
      {children}
    </div>
  );
}

function ListEditor<T>({
  items, onAdd, onRemove, render, addLabel,
}: {
  items: T[];
  onAdd: () => void;
  onRemove: (i: number) => void;
  render: (item: T, i: number) => React.ReactNode;
  addLabel: string;
}) {
  return (
    <div className="space-y-2">
      {items.map((it, i) => (
        <div key={i} className="flex items-start gap-2">
          <div className="flex-1">{render(it, i)}</div>
          <button type="button" onClick={() => onRemove(i)}
            className="shrink-0 grid place-items-center h-9 w-9 rounded-lg glass hover:bg-red-500/10 text-red-400">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button type="button" onClick={onAdd}
        className="inline-flex items-center gap-1.5 rounded-lg glass px-3 py-1.5 text-xs hover:bg-white/10">
        <Plus className="h-3 w-3" /> {addLabel}
      </button>
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
