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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      app_settings: {
        Row: {
          key: string
          updated_at: string
          value: string | null
        }
        Insert: {
          key: string
          updated_at?: string
          value?: string | null
        }
        Update: {
          key?: string
          updated_at?: string
          value?: string | null
        }
        Relationships: []
      }
      automation_log: {
        Row: {
          channel: string | null
          created_at: string
          detail: string | null
          id: string
          lead_id: string | null
          quote_id: string | null
          status: string
          step: string
        }
        Insert: {
          channel?: string | null
          created_at?: string
          detail?: string | null
          id?: string
          lead_id?: string | null
          quote_id?: string | null
          status: string
          step: string
        }
        Update: {
          channel?: string | null
          created_at?: string
          detail?: string | null
          id?: string
          lead_id?: string | null
          quote_id?: string | null
          status?: string
          step?: string
        }
        Relationships: [
          {
            foreignKeyName: "automation_log_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "automation_log_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string | null
          content: string
          cover_image_url: string | null
          created_at: string
          excerpt: string | null
          id: string
          published: boolean
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          content: string
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published?: boolean
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          content?: string
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published?: boolean
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      construction_payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          paid_at: string
          project_id: string | null
          type: string
        }
        Insert: {
          amount?: number
          created_at?: string
          id?: string
          paid_at?: string
          project_id?: string | null
          type?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          paid_at?: string
          project_id?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "construction_payments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_items: {
        Row: {
          created_at: string
          description: string
          id: string
          invoice_id: string
          quantity: number
          sort_order: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          invoice_id: string
          quantity?: number
          sort_order?: number
          unit_price?: number
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          invoice_id?: string
          quantity?: number
          sort_order?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount: number | null
          created_at: string
          due_date: string | null
          id: string
          invoice_number: string | null
          last_sent_at: string | null
          last_sent_channel: string | null
          pdf_url: string | null
          project_id: string | null
          status: string | null
          updated_at: string
          vat: number | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          due_date?: string | null
          id?: string
          invoice_number?: string | null
          last_sent_at?: string | null
          last_sent_channel?: string | null
          pdf_url?: string | null
          project_id?: string | null
          status?: string | null
          updated_at?: string
          vat?: number | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          due_date?: string | null
          id?: string
          invoice_number?: string | null
          last_sent_at?: string | null
          last_sent_channel?: string | null
          pdf_url?: string | null
          project_id?: string | null
          status?: string | null
          updated_at?: string
          vat?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          client_id: string | null
          created_at: string
          email: string | null
          estimated_value: number | null
          id: string
          message: string | null
          name: string
          notes: string | null
          phone: string | null
          project_type: string | null
          source: string
          status: string
          updated_at: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          email?: string | null
          estimated_value?: number | null
          id?: string
          message?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          project_type?: string | null
          source?: string
          status?: string
          updated_at?: string
        }
        Update: {
          client_id?: string | null
          created_at?: string
          email?: string | null
          estimated_value?: number | null
          id?: string
          message?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          project_type?: string | null
          source?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      message_templates: {
        Row: {
          body: string
          channel: string
          created_at: string
          id: string
          key: string
          subject: string | null
          updated_at: string
        }
        Insert: {
          body: string
          channel: string
          created_at?: string
          id?: string
          key: string
          subject?: string | null
          updated_at?: string
        }
        Update: {
          body?: string
          channel?: string
          created_at?: string
          id?: string
          key?: string
          subject?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      portfolio_items: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          media_type: string
          media_url: string
          sort_order: number
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          media_type?: string
          media_url: string
          sort_order?: number
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          media_type?: string
          media_url?: string
          sort_order?: number
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      portfolio_media: {
        Row: {
          created_at: string
          id: string
          media_type: string
          media_url: string
          phase: string
          project_id: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          media_type?: string
          media_url: string
          phase?: string
          project_id: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          media_type?: string
          media_url?: string
          phase?: string
          project_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_media_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "portfolio_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_projects: {
        Row: {
          category: string
          completion_year: number | null
          created_at: string
          description: string | null
          id: string
          location: string | null
          services_completed: string | null
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          completion_year?: number | null
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          services_completed?: string | null
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          completion_year?: number | null
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          services_completed?: string | null
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          budget: number
          client_id: string | null
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          project_number: string | null
          start_date: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          budget?: number
          client_id?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          project_number?: string | null
          start_date?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          budget?: number
          client_id?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          project_number?: string | null
          start_date?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      push_subscriptions: {
        Row: {
          auth_key: string
          created_at: string
          endpoint: string
          id: string
          p256dh: string
          user_id: string | null
        }
        Insert: {
          auth_key: string
          created_at?: string
          endpoint: string
          id?: string
          p256dh: string
          user_id?: string | null
        }
        Update: {
          auth_key?: string
          created_at?: string
          endpoint?: string
          id?: string
          p256dh?: string
          user_id?: string | null
        }
        Relationships: []
      }
      quote_items: {
        Row: {
          created_at: string
          description: string
          id: string
          quantity: number
          quote_id: string
          sort_order: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          quantity?: number
          quote_id: string
          sort_order?: number
          unit_price?: number
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          quantity?: number
          quote_id?: string
          sort_order?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "quote_items_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          amount: number | null
          client_id: string | null
          created_at: string
          description: string | null
          expiry_date: string | null
          id: string
          last_sent_at: string | null
          last_sent_channel: string | null
          pdf_url: string | null
          project_id: string | null
          quote_number: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          amount?: number | null
          client_id?: string | null
          created_at?: string
          description?: string | null
          expiry_date?: string | null
          id?: string
          last_sent_at?: string | null
          last_sent_channel?: string | null
          pdf_url?: string | null
          project_id?: string | null
          quote_number?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number | null
          client_id?: string | null
          created_at?: string
          description?: string | null
          expiry_date?: string | null
          id?: string
          last_sent_at?: string | null
          last_sent_channel?: string | null
          pdf_url?: string | null
          project_id?: string | null
          quote_number?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quotes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          created_at: string
          due_at: string | null
          id: string
          lead_id: string | null
          notes: string | null
          project_id: string | null
          status: string
          title: string
          type: string
        }
        Insert: {
          created_at?: string
          due_at?: string | null
          id?: string
          lead_id?: string | null
          notes?: string | null
          project_id?: string | null
          status?: string
          title: string
          type?: string
        }
        Update: {
          created_at?: string
          due_at?: string | null
          id?: string
          lead_id?: string | null
          notes?: string | null
          project_id?: string | null
          status?: string
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
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
      app_role: "admin" | "user"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
    },
  },
} as const
