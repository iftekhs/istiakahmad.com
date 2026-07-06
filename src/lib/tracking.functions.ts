import { createServerFn, createMiddleware } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

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
    if (error || !data) throw new Error("Forbidden: admin role required");
    return next({ context: { adminId: userId } });
  });

export type PixelConfig = { id: string; enabled: boolean };
export type CustomSnippet = {
  id: string;
  name: string;
  code: string;
  placement: "head" | "body-start" | "body-end";
  routes: string; // "all" | "include:/foo,/bar" | "exclude:/admin"
  enabled: boolean;
};

export type TrackingSettings = {
  ga4: PixelConfig;
  gtm: PixelConfig;
  metaPixel: PixelConfig;
  linkedin: PixelConfig;
  tiktok: PixelConfig;
  clarity: PixelConfig;
  hotjar: PixelConfig;
  customSnippets: CustomSnippet[];
};

const EMPTY: TrackingSettings = {
  ga4: { id: "", enabled: false },
  gtm: { id: "", enabled: false },
  metaPixel: { id: "", enabled: false },
  linkedin: { id: "", enabled: false },
  tiktok: { id: "", enabled: false },
  clarity: { id: "", enabled: false },
  hotjar: { id: "", enabled: false },
  customSnippets: [],
};

export function defaultTracking(): TrackingSettings {
  return EMPTY;
}

export const getTrackingSettings = createServerFn({ method: "GET" }).handler(
  async (): Promise<TrackingSettings> => {
    const { data, error } = await supabaseAdmin
      .from("site_settings")
      .select("data")
      .eq("id", 1)
      .maybeSingle();
    if (error) {
      console.error("getTrackingSettings", error);
      return EMPTY;
    }
    const tracking = (data?.data as any)?.tracking as TrackingSettings | undefined;
    return { ...EMPTY, ...(tracking ?? {}) };
  },
);

const PixelSchema = z.object({
  id: z.string().max(200).default(""),
  enabled: z.boolean().default(false),
});

const SnippetSchema = z.object({
  id: z.string().min(1).max(64),
  name: z.string().min(1).max(120),
  code: z.string().max(20000),
  placement: z.enum(["head", "body-start", "body-end"]),
  routes: z.string().max(500).default("all"),
  enabled: z.boolean().default(true),
});

const TrackingSchema = z.object({
  ga4: PixelSchema,
  gtm: PixelSchema,
  metaPixel: PixelSchema,
  linkedin: PixelSchema,
  tiktok: PixelSchema,
  clarity: PixelSchema,
  hotjar: PixelSchema,
  customSnippets: z.array(SnippetSchema).max(50),
});

export const updateTrackingSettings = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((input: unknown) => TrackingSchema.parse(input))
  .handler(async ({ data, context }) => {
    // Merge into existing site_settings.data
    const { data: existing } = await supabaseAdmin
      .from("site_settings")
      .select("data")
      .eq("id", 1)
      .maybeSingle();
    const next = { ...((existing?.data as any) ?? {}), tracking: data };
    const { error } = await supabaseAdmin
      .from("site_settings")
      .update({ data: next as any })
      .eq("id", 1);
    if (error) throw new Error(error.message);
    await supabaseAdmin.from("admin_audit_log").insert({
      user_id: context.adminId,
      action: "update",
      entity: "tracking",
      entity_id: "1",
      changes: data as any,
    });
    return { ok: true };
  });
