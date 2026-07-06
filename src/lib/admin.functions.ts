import { createServerFn, createMiddleware } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

/** Middleware: require requireSupabaseAuth + admin role. */
const requireAdmin = createMiddleware({ type: "function" })
  .middleware([requireSupabaseAuth])
  .server(async ({ next, context }) => {
    const { userId } = context;
    const { data, error } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    if (error || !data) {
      throw new Error("Forbidden: admin role required");
    }
    return next({ context: { adminId: userId } });
  });

async function logAudit(
  userId: string,
  action: string,
  entity: string,
  entityId: string | null,
  changes: unknown,
) {
  await supabaseAdmin.from("admin_audit_log").insert({
    user_id: userId,
    action,
    entity,
    entity_id: entityId,
    changes: changes as any,
  });
}

/** Check current user is admin (called from the dashboard layout). */
export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    return { isAdmin: !!data, userId: context.userId };
  });

/* ============ LAUNCHES ============ */

const LaunchSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(200),
  role: z.string().min(1).max(100),
  launch_date: z.string().min(1).max(100),
  rank: z.string().min(1).max(100),
  extras: z.array(z.string().max(200)).max(20).default([]),
  description: z.string().max(2000),
  href: z.string().url(),
  featured: z.boolean().default(false),
  sort_order: z.number().int().default(0),
});

export const upsertLaunch = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((input: unknown) => LaunchSchema.parse(input))
  .handler(async ({ data, context }) => {
    const payload = { ...data };
    const { data: row, error } = await supabaseAdmin
      .from("launches")
      .upsert(payload)
      .select()
      .single();
    if (error) throw new Error(error.message);
    await logAudit(context.adminId, payload.id ? "update" : "create", "launches", row.id, payload);
    return row;
  });

export const deleteLaunch = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await supabaseAdmin.from("launches").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    await logAudit(context.adminId, "delete", "launches", data.id, null);
    return { ok: true };
  });

/* ============ SITE SETTINGS ============ */

const SiteSettingsSchema = z.object({
  name: z.string().max(200).optional(),
  url: z.string().max(500).optional(),
  title: z.string().max(200).optional(),
  description: z.string().max(500).optional(),
  contactEmail: z.string().max(200).optional(),
  links: z.record(z.string(), z.string().max(1000)).optional(),
});

export const updateSiteSettings = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((input: unknown) => SiteSettingsSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await supabaseAdmin
      .from("site_settings")
      .update({ data: data as any })
      .eq("id", 1)
      .select()
      .single();
    if (error) throw new Error(error.message);
    await logAudit(context.adminId, "update", "site_settings", "1", data);
    return row;
  });

/* ============ PAGE CONTENT ============ */

const PageContentSchema = z.object({
  page_key: z.string().min(1).max(64),
  content: z.record(z.string(), z.any()),
});

export const updatePageContent = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((input: unknown) => PageContentSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await supabaseAdmin
      .from("page_content")
      .update({ content: data.content as any })
      .eq("page_key", data.page_key)
      .select()
      .single();
    if (error) throw new Error(error.message);
    await logAudit(context.adminId, "update", "page_content", data.page_key, data.content);
    return row;
  });

/* ============ PAGE SEO ============ */

const PageSeoSchema = z.object({
  page_key: z.string().min(1).max(64),
  title: z.string().max(200).nullable().optional(),
  description: z.string().max(500).nullable().optional(),
  og_title: z.string().max(200).nullable().optional(),
  og_description: z.string().max(500).nullable().optional(),
  og_image_url: z.string().max(1000).nullable().optional(),
  canonical_path: z.string().max(500).nullable().optional(),
});

export const updatePageSeo = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((input: unknown) => PageSeoSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { page_key, ...fields } = data;
    const { data: row, error } = await supabaseAdmin
      .from("page_seo")
      .update(fields)
      .eq("page_key", page_key)
      .select()
      .single();
    if (error) throw new Error(error.message);
    await logAudit(context.adminId, "update", "page_seo", page_key, fields);
    return row;
  });

/* ============ MEDIA ============ */

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/avif",
]);

const MediaSchema = z.object({
  filename: z.string().min(1).max(255),
  base64: z.string().min(1),
  mime_type: z
    .string()
    .min(1)
    .max(100)
    .refine((m) => ALLOWED_MIME.has(m), "Unsupported file type"),
  alt: z.string().max(500).optional(),
});

export const listMedia = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async () => {
    const { data, error } = await supabaseAdmin
      .from("media")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const listPageSeo = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async () => {
    const { data, error } = await supabaseAdmin
      .from("page_seo")
      .select("*")
      .order("page_key");
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const uploadMedia = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((input: unknown) => MediaSchema.parse(input))
  .handler(async ({ data, context }) => {
    const safeName = data.filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `uploads/${Date.now()}_${safeName}`;
    const bin = Uint8Array.from(atob(data.base64), (c) => c.charCodeAt(0));
    const { error: upErr } = await supabaseAdmin.storage
      .from("site-media")
      .upload(path, bin, { contentType: data.mime_type, upsert: false });
    if (upErr) throw new Error(upErr.message);
    const { data: pub } = supabaseAdmin.storage.from("site-media").getPublicUrl(path);
    const { data: row, error: insErr } = await supabaseAdmin
      .from("media")
      .insert({
        filename: safeName,
        storage_path: path,
        public_url: pub.publicUrl,
        mime_type: data.mime_type,
        size_bytes: bin.length,
        alt: data.alt ?? null,
        uploaded_by: context.adminId,
      })
      .select()
      .single();
    if (insErr) throw new Error(insErr.message);
    await logAudit(context.adminId, "upload", "media", row.id, { filename: safeName });
    return row;
  });

export const deleteMedia = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: row } = await supabaseAdmin
      .from("media")
      .select("storage_path")
      .eq("id", data.id)
      .single();
    if (row?.storage_path) {
      await supabaseAdmin.storage.from("site-media").remove([row.storage_path]);
    }
    const { error } = await supabaseAdmin.from("media").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    await logAudit(context.adminId, "delete", "media", data.id, null);
    return { ok: true };
  });

/* ============ AUDIT LOG ============ */

export const getAuditLog = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async () => {
    const { data, error } = await supabaseAdmin
      .from("admin_audit_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

/* ============ DISCOUNTED DEALS ============ */

const DealSchema = z
  .object({
    id: z.string().uuid().optional(),
    name: z.string().min(1).max(200),
    tagline: z.string().max(300).nullable().optional(),
    description: z.string().max(2000).nullable().optional(),
    banner_url: z
      .string()
      .max(1000)
      .nullable()
      .optional()
      .transform((v) => (v && v.length > 0 ? v : null)),
    original_price: z.number().min(0).max(1_000_000),
    discounted_price: z.number().min(0).max(1_000_000),
    currency: z.string().min(1).max(8).default("USD"),
    whatsapp_message: z.string().max(500).nullable().optional(),
    featured: z.boolean().default(false),
    active: z.boolean().default(true),
    sort_order: z.number().int().default(0),
  })
  .refine((d) => d.discounted_price <= d.original_price, {
    message: "Discounted price must be ≤ original price",
    path: ["discounted_price"],
  });

export const upsertDeal = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((input: unknown) => DealSchema.parse(input))
  .handler(async ({ data, context }) => {
    const payload: Record<string, unknown> = { ...data };
    if (!payload.id) delete payload.id;
    const { data: row, error } = await supabaseAdmin
      .from("discounted_deals")
      .upsert(payload as any)
      .select()
      .single();
    if (error) throw new Error(error.message);
    await logAudit(context.adminId, data.id ? "update" : "create", "discounted_deals", row.id, payload);
    return row;
  });

export const deleteDeal = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await supabaseAdmin.from("discounted_deals").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    await logAudit(context.adminId, "delete", "discounted_deals", data.id, null);
    return { ok: true };
  });

/* ============ PRODUCTS ============ */

const ProductLinkSchema = z.object({
  label: z.string().min(1).max(100),
  url: z.string().url().max(1000),
});

const ProductFaqSchema = z.object({
  question: z.string().min(1).max(300),
  answer: z.string().min(1).max(2000),
});

const ProductSchema = z
  .object({
    id: z.string().uuid().optional(),
    slug: z
      .string()
      .min(1)
      .max(120)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase, dashes only"),
    name: z.string().min(1).max(200),
    tagline: z.string().max(300).nullable().optional(),
    category: z.string().max(80).nullable().optional(),
    short_description: z.string().max(500).nullable().optional(),
    long_description: z.string().max(8000).nullable().optional(),
    banner_url: z
      .string()
      .max(1000)
      .nullable()
      .optional()
      .transform((v) => (v && v.length > 0 ? v : null)),
    gallery: z.array(z.string().url().max(1000)).max(20).default([]),
    youtube_url: z
      .string()
      .max(500)
      .nullable()
      .optional()
      .transform((v) => (v && v.length > 0 ? v : null)),
    features: z.array(z.string().min(1).max(300)).max(30).default([]),
    links: z.array(ProductLinkSchema).max(20).default([]),
    faqs: z.array(ProductFaqSchema).max(30).default([]),
    pricing_mode: z.enum(["fixed", "from", "quote_only"]).default("quote_only"),
    price: z.number().min(0).max(1_000_000).nullable().optional(),
    currency: z.string().min(1).max(8).default("USD"),
    whatsapp_message: z.string().max(500).nullable().optional(),
    featured: z.boolean().default(false),
    active: z.boolean().default(true),
    sort_order: z.number().int().default(0),
  });

export const upsertProduct = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((input: unknown) => ProductSchema.parse(input))
  .handler(async ({ data, context }) => {
    const payload: Record<string, unknown> = { ...data };
    if (!payload.id) delete payload.id;
    const { data: row, error } = await supabaseAdmin
      .from("products")
      .upsert(payload as any)
      .select()
      .single();
    if (error) throw new Error(error.message);
    await logAudit(context.adminId, data.id ? "update" : "create", "products", row.id, payload);
    return row;
  });

export const deleteProduct = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await supabaseAdmin.from("products").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    await logAudit(context.adminId, "delete", "products", data.id, null);
    return { ok: true };
  });
