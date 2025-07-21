export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      clients: {
        Row: {
          company: string
          created_at: string
          deleted_at: string | null
          email: string
          id: string
          intake_form_completed: boolean | null
          name: string
          plan_id: string | null
          seller_id: string | null
          status: string | null
          tier2_seller_id: string | null
          updated_at: string
        }
        Insert: {
          company: string
          created_at?: string
          deleted_at?: string | null
          email: string
          id?: string
          intake_form_completed?: boolean | null
          name: string
          plan_id?: string | null
          seller_id?: string | null
          status?: string | null
          tier2_seller_id?: string | null
          updated_at?: string
        }
        Update: {
          company?: string
          created_at?: string
          deleted_at?: string | null
          email?: string
          id?: string
          intake_form_completed?: boolean | null
          name?: string
          plan_id?: string | null
          seller_id?: string | null
          status?: string | null
          tier2_seller_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clients_plan_fk"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clients_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "sellers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clients_tier2_seller_id_fkey"
            columns: ["tier2_seller_id"]
            isOneToOne: false
            referencedRelation: "tier2_sellers"
            referencedColumns: ["id"]
          },
        ]
      }
      commissions: {
        Row: {
          amount: number
          client_id: string | null
          commission_amount: number
          created_at: string
          id: string
          seller_id: string | null
          status: string | null
          tier2_seller_id: string | null
          transaction_date: string
          type: string
        }
        Insert: {
          amount: number
          client_id?: string | null
          commission_amount: number
          created_at?: string
          id?: string
          seller_id?: string | null
          status?: string | null
          tier2_seller_id?: string | null
          transaction_date?: string
          type: string
        }
        Update: {
          amount?: number
          client_id?: string | null
          commission_amount?: number
          created_at?: string
          id?: string
          seller_id?: string | null
          status?: string | null
          tier2_seller_id?: string | null
          transaction_date?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "commissions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "sellers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_tier2_seller_id_fkey"
            columns: ["tier2_seller_id"]
            isOneToOne: false
            referencedRelation: "tier2_sellers"
            referencedColumns: ["id"]
          },
        ]
      }
      sellers: {
        Row: {
          admin_email: string
          admin_password_hash: string
          commission_type: string | null
          commission_value: number | null
          created_at: string
          id: string
          logo_url: string | null
          name: string
          site_content: Json | null
          status: string | null
          stylesheet_url: string | null
          subdomain: string
          updated_at: string
        }
        Insert: {
          admin_email: string
          admin_password_hash: string
          commission_type?: string | null
          commission_value?: number | null
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
          site_content?: Json | null
          status?: string | null
          stylesheet_url?: string | null
          subdomain: string
          updated_at?: string
        }
        Update: {
          admin_email?: string
          admin_password_hash?: string
          commission_type?: string | null
          commission_value?: number | null
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          site_content?: Json | null
          status?: string | null
          stylesheet_url?: string | null
          subdomain?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          active: boolean | null
          billing: string
          created_at: string
          currency: string
          currency_symbol: string
          deleted_at: string | null
          features: Json | null
          id: string
          max_clients: number | null
          name: string
          price: number
          seller_id: string | null
          tier2_seller_id: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          billing?: string
          created_at?: string
          currency?: string
          currency_symbol?: string
          deleted_at?: string | null
          features?: Json | null
          id?: string
          max_clients?: number | null
          name: string
          price: number
          seller_id?: string | null
          tier2_seller_id?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          billing?: string
          created_at?: string
          currency?: string
          currency_symbol?: string
          deleted_at?: string | null
          features?: Json | null
          id?: string
          max_clients?: number | null
          name?: string
          price?: number
          seller_id?: string | null
          tier2_seller_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_plans_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "sellers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscription_plans_tier2_seller_id_fkey"
            columns: ["tier2_seller_id"]
            isOneToOne: false
            referencedRelation: "tier2_sellers"
            referencedColumns: ["id"]
          },
        ]
      }
      tier2_sellers: {
        Row: {
          admin_email: string
          admin_password_hash: string
          commission_type: string | null
          commission_value: number | null
          created_at: string
          deleted_at: string | null
          id: string
          logo_url: string | null
          name: string
          site_content: Json | null
          status: string | null
          stylesheet_url: string | null
          subdomain: string
          tier1_seller_id: string | null
          updated_at: string
        }
        Insert: {
          admin_email: string
          admin_password_hash: string
          commission_type?: string | null
          commission_value?: number | null
          created_at?: string
          deleted_at?: string | null
          id?: string
          logo_url?: string | null
          name: string
          site_content?: Json | null
          status?: string | null
          stylesheet_url?: string | null
          subdomain: string
          tier1_seller_id?: string | null
          updated_at?: string
        }
        Update: {
          admin_email?: string
          admin_password_hash?: string
          commission_type?: string | null
          commission_value?: number | null
          created_at?: string
          deleted_at?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          site_content?: Json | null
          status?: string | null
          stylesheet_url?: string | null
          subdomain?: string
          tier1_seller_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tier2_sellers_tier1_seller_id_fkey"
            columns: ["tier1_seller_id"]
            isOneToOne: false
            referencedRelation: "sellers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      soft_delete_client: {
        Args: { client_id: string }
        Returns: boolean
      }
      soft_delete_plan: {
        Args: { plan_id: string }
        Returns: boolean
      }
      soft_delete_tier2_seller: {
        Args: { seller_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
