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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      about_us_content: {
        Row: {
          contact_description: string
          contact_title: string
          created_at: string
          feature_1_description: string
          feature_1_title: string
          feature_2_description: string
          feature_2_title: string
          feature_3_description: string
          feature_3_title: string
          feature_4_description: string
          feature_4_title: string
          hero_description: string
          hero_title: string
          id: string
          mission_description: string
          mission_title: string
          updated_at: string
        }
        Insert: {
          contact_description: string
          contact_title?: string
          created_at?: string
          feature_1_description?: string
          feature_1_title?: string
          feature_2_description?: string
          feature_2_title?: string
          feature_3_description?: string
          feature_3_title?: string
          feature_4_description?: string
          feature_4_title?: string
          hero_description?: string
          hero_title?: string
          id?: string
          mission_description: string
          mission_title?: string
          updated_at?: string
        }
        Update: {
          contact_description?: string
          contact_title?: string
          created_at?: string
          feature_1_description?: string
          feature_1_title?: string
          feature_2_description?: string
          feature_2_title?: string
          feature_3_description?: string
          feature_3_title?: string
          feature_4_description?: string
          feature_4_title?: string
          hero_description?: string
          hero_title?: string
          id?: string
          mission_description?: string
          mission_title?: string
          updated_at?: string
        }
        Relationships: []
      }
      daily_spins: {
        Row: {
          created_at: string
          id: string
          last_spin_at: string
          user_id: string
          won_ticket: boolean
        }
        Insert: {
          created_at?: string
          id?: string
          last_spin_at?: string
          user_id: string
          won_ticket?: boolean
        }
        Update: {
          created_at?: string
          id?: string
          last_spin_at?: string
          user_id?: string
          won_ticket?: boolean
        }
        Relationships: []
      }
      entries: {
        Row: {
          created_at: string
          id: string
          product_id: string
          status: Database["public"]["Enums"]["entry_status"]
          tickets_spent: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          status?: Database["public"]["Enums"]["entry_status"]
          tickets_spent: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          status?: Database["public"]["Enums"]["entry_status"]
          tickets_spent?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "entries_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_inquiries: {
        Row: {
          company_name: string
          contact_name: string
          created_at: string
          email: string
          id: string
          message: string
          phone: string
          product_category: string
          status: string
          updated_at: string
          website: string | null
        }
        Insert: {
          company_name: string
          contact_name: string
          created_at?: string
          email: string
          id?: string
          message: string
          phone: string
          product_category: string
          status?: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          company_name?: string
          contact_name?: string
          created_at?: string
          email?: string
          id?: string
          message?: string
          phone?: string
          product_category?: string
          status?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      partners: {
        Row: {
          created_at: string
          description: string | null
          id: string
          logo_url: string | null
          name: string
          updated_at: string
          website: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          available_countries: string[] | null
          category: Database["public"]["Enums"]["product_category"]
          created_at: string
          description: string
          draw_date: string
          featured: boolean
          id: string
          images: string[]
          name: string
          partner_description: string | null
          partner_id: string | null
          partner_logo_url: string | null
          partner_name: string | null
          partner_website: string | null
          status: Database["public"]["Enums"]["draw_status"]
          ticket_price: number
          tickets_required: number
          tickets_sold: number
          updated_at: string
          verification_hash: string | null
          winner_id: string | null
        }
        Insert: {
          available_countries?: string[] | null
          category: Database["public"]["Enums"]["product_category"]
          created_at?: string
          description: string
          draw_date: string
          featured?: boolean
          id?: string
          images?: string[]
          name: string
          partner_description?: string | null
          partner_id?: string | null
          partner_logo_url?: string | null
          partner_name?: string | null
          partner_website?: string | null
          status?: Database["public"]["Enums"]["draw_status"]
          ticket_price: number
          tickets_required: number
          tickets_sold?: number
          updated_at?: string
          verification_hash?: string | null
          winner_id?: string | null
        }
        Update: {
          available_countries?: string[] | null
          category?: Database["public"]["Enums"]["product_category"]
          created_at?: string
          description?: string
          draw_date?: string
          featured?: boolean
          id?: string
          images?: string[]
          name?: string
          partner_description?: string | null
          partner_id?: string | null
          partner_logo_url?: string | null
          partner_name?: string | null
          partner_website?: string | null
          status?: Database["public"]["Enums"]["draw_status"]
          ticket_price?: number
          tickets_required?: number
          tickets_sold?: number
          updated_at?: string
          verification_hash?: string | null
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          country: string | null
          created_at: string
          email: string
          email_notifications: boolean | null
          full_name: string | null
          id: string
          middle_name: string | null
          notifications_enabled: boolean | null
          preferred_language: string | null
          push_notifications: boolean | null
          total_wins: number
          updated_at: string
          wallet_balance: number
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          country?: string | null
          created_at?: string
          email: string
          email_notifications?: boolean | null
          full_name?: string | null
          id: string
          middle_name?: string | null
          notifications_enabled?: boolean | null
          preferred_language?: string | null
          push_notifications?: boolean | null
          total_wins?: number
          updated_at?: string
          wallet_balance?: number
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          country?: string | null
          created_at?: string
          email?: string
          email_notifications?: boolean | null
          full_name?: string | null
          id?: string
          middle_name?: string | null
          notifications_enabled?: boolean | null
          preferred_language?: string | null
          push_notifications?: boolean | null
          total_wins?: number
          updated_at?: string
          wallet_balance?: number
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
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      wallet_transactions: {
        Row: {
          amount: number
          created_at: string
          description: string
          id: string
          product_id: string | null
          receipt_url: string | null
          stripe_payment_id: string | null
          stripe_session_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description: string
          id?: string
          product_id?: string | null
          receipt_url?: string | null
          stripe_payment_id?: string | null
          stripe_session_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          id?: string
          product_id?: string | null
          receipt_url?: string | null
          stripe_payment_id?: string | null
          stripe_session_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wallet_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_entry_atomic: {
        Args: { _product_id: string; _tickets_spent: number; _user_id: string }
        Returns: Json
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      draw_status: "active" | "completed" | "cancelled"
      entry_status: "active" | "won" | "lost"
      product_category:
        | "electronics"
        | "gaming"
        | "fashion"
        | "home"
        | "sports"
        | "other"
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
      app_role: ["admin", "user"],
      draw_status: ["active", "completed", "cancelled"],
      entry_status: ["active", "won", "lost"],
      product_category: [
        "electronics",
        "gaming",
        "fashion",
        "home",
        "sports",
        "other",
      ],
    },
  },
} as const
