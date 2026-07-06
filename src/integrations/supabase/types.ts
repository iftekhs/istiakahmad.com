export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_audit_log: {
        Row: {
          action: string
          changes: Json | null
          created_at: string
          entity: string
          entity_id: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          action: string
          changes?: Json | null
          created_at?: string
          entity: string
          entity_id?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          changes?: Json | null
          created_at?: string
          entity?: string
          entity_id?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      discounted_deals: {
        Row: {
          active: boolean
          banner_url: string | null
          created_at: string
          currency: string
          description: string | null
          discounted_price: number
          featured: boolean
          id: string
          name: string
          original_price: number
          sort_order: number
          tagline: string | null
          updated_at: string
          whatsapp_message: string | null
        }
        Insert: {
          active?: boolean
          banner_url?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          discounted_price?: number
          featured?: boolean
          id?: string
          name: string
          original_price?: number
          sort_order?: number
          tagline?: string | null
          updated_at?: string
          whatsapp_message?: string | null
        }
        Update: {
          active?: boolean
          banner_url?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          discounted_price?: number
          featured?: boolean
          id?: string
          name?: string
          original_price?: number
          sort_order?: number
          tagline?: string | null
          updated_at?: string
          whatsapp_message?: string | null
        }
        Relationships: []
      }
      launches: {
        Row: {
          created_at: string
          description: string
          extras: string[]
          featured: boolean
          href: string
          id: string
          launch_date: string
          name: string
          rank: string
          role: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          extras?: string[]
          featured?: boolean
          href: string
          id?: string
          launch_date: string
          name: string
          rank: string
          role: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          extras?: string[]
          featured?: boolean
          href?: string
          id?: string
          launch_date?: string
          name?: string
          rank?: string
          role?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      media: {
        Row: {
          alt: string | null
          created_at: string
          filename: string
          id: string
          mime_type: string | null
          public_url: string
          size_bytes: number | null
          storage_path: string
          uploaded_by: string | null
        }
        Insert: {
          alt?: string | null
          created_at?: string
          filename: string
          id?: string
          mime_type?: string | null
          public_url: string
          size_bytes?: number | null
          storage_path: string
          uploaded_by?: string | null
        }
        Update: {
          alt?: string | null
          created_at?: string
          filename?: string
          id?: string
          mime_type?: string | null
          public_url?: string
          size_bytes?: number | null
          storage_path?: string
          uploaded_by?: string | null
        }
        Relationships: []
      }
      page_content: {
        Row: {
          content: Json
          label: string
          page_key: string
          updated_at: string
        }
        Insert: {
          content?: Json
          label: string
          page_key: string
          updated_at?: string
        }
        Update: {
          content?: Json
          label?: string
          page_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      page_seo: {
        Row: {
          canonical_path: string | null
          description: string | null
          og_description: string | null
          og_image_url: string | null
          og_title: string | null
          page_key: string
          title: string | null
          updated_at: string
        }
        Insert: {
          canonical_path?: string | null
          description?: string | null
          og_description?: string | null
          og_image_url?: string | null
          og_title?: string | null
          page_key: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          canonical_path?: string | null
          description?: string | null
          og_description?: string | null
          og_image_url?: string | null
          og_title?: string | null
          page_key?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          active: boolean
          banner_url: string | null
          category: string | null
          created_at: string
          currency: string
          faqs: Json
          featured: boolean
          features: Json
          gallery: Json
          id: string
          links: Json
          long_description: string | null
          name: string
          price: number | null
          pricing_mode: string
          short_description: string | null
          slug: string
          sort_order: number
          tagline: string | null
          updated_at: string
          whatsapp_message: string | null
          youtube_url: string | null
        }
        Insert: {
          active?: boolean
          banner_url?: string | null
          category?: string | null
          created_at?: string
          currency?: string
          faqs?: Json
          featured?: boolean
          features?: Json
          gallery?: Json
          id?: string
          links?: Json
          long_description?: string | null
          name: string
          price?: number | null
          pricing_mode?: string
          short_description?: string | null
          slug: string
          sort_order?: number
          tagline?: string | null
          updated_at?: string
          whatsapp_message?: string | null
          youtube_url?: string | null
        }
        Update: {
          active?: boolean
          banner_url?: string | null
          category?: string | null
          created_at?: string
          currency?: string
          faqs?: Json
          featured?: boolean
          features?: Json
          gallery?: Json
          id?: string
          links?: Json
          long_description?: string | null
          name?: string
          price?: number | null
          pricing_mode?: string
          short_description?: string | null
          slug?: string
          sort_order?: number
          tagline?: string | null
          updated_at?: string
          whatsapp_message?: string | null
          youtube_url?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          data: Json
          id: number
          updated_at: string
        }
        Insert: {
          data?: Json
          id?: number
          updated_at?: string
        }
        Update: {
          data?: Json
          id?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin"],
    },
  },
} as const
