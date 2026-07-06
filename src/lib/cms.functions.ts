import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

/** Public reads — no auth required, served via admin client (read-only queries). */

export type SiteSettings = {
  name?: string;
  url?: string;
  title?: string;
  description?: string;
  contactEmail?: string;
  links?: Record<string, string>;
};

export const getSiteSettings = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("site_settings")
    .select("data")
    .eq("id", 1)
    .maybeSingle();
  if (error) {
    console.error("getSiteSettings", error);
    return null;
  }
  return (data?.data ?? null) as SiteSettings | null;
});


export const getLaunches = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("launches")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) {
    console.error("getLaunches", error);
    return [];
  }
  return data ?? [];
});

export type PageContent = Record<string, any>;

export const getPageContent = createServerFn({ method: "GET" })
  .inputValidator((input: { key: string }) => z.object({ key: z.string().min(1).max(64) }).parse(input))
  .handler(async ({ data }) => {
    const { data: row, error } = await supabaseAdmin
      .from("page_content")
      .select("content")
      .eq("page_key", data.key)
      .maybeSingle();
    if (error) {
      console.error("getPageContent", error);
      return {} as PageContent;
    }
    return (row?.content ?? {}) as PageContent;
  });


export const getPageSeo = createServerFn({ method: "GET" })
  .inputValidator((input: { key: string }) => z.object({ key: z.string().min(1).max(64) }).parse(input))
  .handler(async ({ data }) => {
    const { data: row, error } = await supabaseAdmin
      .from("page_seo")
      .select("*")
      .eq("page_key", data.key)
      .maybeSingle();
    if (error) {
      console.error("getPageSeo", error);
      return null;
    }
    return row;
  });

export const getAllPageContent = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("page_content")
    .select("*")
    .order("page_key");
  if (error) {
    console.error("getAllPageContent", error);
    return [];
  }
  return data ?? [];
});

export const getAllPageSeo = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin.from("page_seo").select("*").order("page_key");
  if (error) {
    console.error("getAllPageSeo", error);
    return [];
  }
  return data ?? [];
});

export const getMedia = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("media")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("getMedia", error);
    return [];
  }
  return data ?? [];
});

/* ============ DISCOUNTED DEALS ============ */

export type DiscountedDeal = {
  id: string;
  name: string;
  tagline: string | null;
  description: string | null;
  banner_url: string | null;
  original_price: number;
  discounted_price: number;
  currency: string;
  whatsapp_message: string | null;
  featured: boolean;
  active: boolean;
  sort_order: number;
};

export const getActiveDeals = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("discounted_deals")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) {
    console.error("getActiveDeals", error);
    return [];
  }
  return (data ?? []) as DiscountedDeal[];
});

export const getAllDeals = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("discounted_deals")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) {
    console.error("getAllDeals", error);
    return [];
  }
  return (data ?? []) as DiscountedDeal[];
});

/* ============ PRODUCTS ============ */

import type { Product } from "./products.shared";

function normalizeProduct(row: any): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    category: row.category,
    short_description: row.short_description,
    long_description: row.long_description,
    banner_url: row.banner_url,
    gallery: Array.isArray(row.gallery) ? row.gallery : [],
    youtube_url: row.youtube_url,
    features: Array.isArray(row.features) ? row.features : [],
    links: Array.isArray(row.links) ? row.links : [],
    faqs: Array.isArray(row.faqs) ? row.faqs : [],
    pricing_mode: (row.pricing_mode ?? "quote_only") as Product["pricing_mode"],
    price: row.price === null || row.price === undefined ? null : Number(row.price),
    currency: row.currency ?? "USD",
    whatsapp_message: row.whatsapp_message,
    featured: !!row.featured,
    active: !!row.active,
    sort_order: row.sort_order ?? 0,
  };
}

export const getActiveProducts = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) {
    console.error("getActiveProducts", error);
    return [];
  }
  return (data ?? []).map(normalizeProduct);
});

export const getAllProducts = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) {
    console.error("getAllProducts", error);
    return [];
  }
  return (data ?? []).map(normalizeProduct);
});

export const getProductBySlug = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string }) =>
    z.object({ slug: z.string().min(1).max(120) }).parse(input),
  )
  .handler(async ({ data }) => {
    const { data: row, error } = await supabaseAdmin
      .from("products")
      .select("*")
      .eq("slug", data.slug)
      .eq("active", true)
      .maybeSingle();
    if (error) {
      console.error("getProductBySlug", error);
      return null;
    }
    return row ? normalizeProduct(row) : null;
  });
