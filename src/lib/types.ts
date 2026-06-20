export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          name_ar: string | null;
          category: string;
          description: string | null;
          description_ar: string | null;
          price: number | null;
          image_url: string | null;
          status: string | null;
          features: string[] | null;
          features_ar: string[] | null;
          sizes: string[] | null;
          suitable_for: string | null;
          dilution_ratio: string | null;
          display_order: number;
          is_featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          name_ar?: string | null;
          category: string;
          description?: string | null;
          description_ar?: string | null;
          price?: number | null;
          image_url?: string | null;
          status?: string | null;
          features?: string[] | null;
          features_ar?: string[] | null;
          sizes?: string[] | null;
          suitable_for?: string | null;
          dilution_ratio?: string | null;
          display_order?: number;
          is_featured?: boolean;
        };
        Update: {
          id?: string;
          name?: string;
          name_ar?: string | null;
          category?: string;
          description?: string | null;
          description_ar?: string | null;
          price?: number | null;
          image_url?: string | null;
          status?: string | null;
          features?: string[] | null;
          features_ar?: string[] | null;
          sizes?: string[] | null;
          suitable_for?: string | null;
          dilution_ratio?: string | null;
          display_order?: number;
          is_featured?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      clients: {
        Row: {
          id: string;
          name: string;
          logo_url: string | null;
          website_url: string | null;
          display_order: number;
          active: boolean;
          created_at: string;
        };
        Insert: {
          name: string;
          logo_url?: string | null;
          website_url?: string | null;
          display_order?: number;
          active?: boolean;
        };
        Update: {
          id?: string;
          name?: string;
          logo_url?: string | null;
          website_url?: string | null;
          display_order?: number;
          active?: boolean;
        };
        Relationships: [];
      };
      contact_messages: {
        Row: {
          id: string;
          full_name: string;
          phone: string | null;
          email: string;
          message: string;
          status: string | null;
          created_at: string;
        };
        Insert: {
          full_name: string;
          phone?: string | null;
          email: string;
          message: string;
          status?: string | null;
        };
        Update: {
          id?: string;
          full_name?: string;
          phone?: string | null;
          email?: string;
          message?: string;
          status?: string | null;
        };
        Relationships: [];
      };
      product_requests: {
        Row: {
          id: string;
          customer_name: string;
          phone: string | null;
          email: string;
          product_id: string | null;
          product_name: string | null;
          quantity: number | null;
          notes: string | null;
          status: string | null;
          company_name: string | null;
          city: string | null;
          business_type: string | null;
          internal_notes: string | null;
          next_follow_up_at: string | null;
          lost_reason: string | null;
          estimated_value: number | null;
          quoted_value: number | null;
          created_at: string;
        };
        Insert: {
          customer_name: string;
          phone?: string | null;
          email: string;
          product_id?: string | null;
          product_name?: string | null;
          quantity?: number | null;
          notes?: string | null;
          status?: string | null;
          company_name?: string | null;
          city?: string | null;
          business_type?: string | null;
          internal_notes?: string | null;
          next_follow_up_at?: string | null;
          lost_reason?: string | null;
          estimated_value?: number | null;
          quoted_value?: number | null;
        };
        Update: {
          id?: string;
          customer_name?: string;
          phone?: string | null;
          email?: string;
          product_id?: string | null;
          product_name?: string | null;
          quantity?: number | null;
          notes?: string | null;
          status?: string | null;
          company_name?: string | null;
          city?: string | null;
          business_type?: string | null;
          internal_notes?: string | null;
          next_follow_up_at?: string | null;
          lost_reason?: string | null;
          estimated_value?: number | null;
          quoted_value?: number | null;
        };
        Relationships: [];
      };
      analytics_events: {
        Row: {
          id: string;
          event_name: string;
          pathname: string | null;
          product_id: string | null;
          product_name: string | null;
          category: string | null;
          source: string | null;
          metadata: Record<string, unknown> | null;
          created_at: string;
        };
        Insert: {
          event_name: string;
          pathname?: string | null;
          product_id?: string | null;
          product_name?: string | null;
          category?: string | null;
          source?: string | null;
          metadata?: Record<string, unknown> | null;
        };
        Update: {
          event_name?: string;
          pathname?: string | null;
          product_id?: string | null;
          product_name?: string | null;
          category?: string | null;
          source?: string | null;
          metadata?: Record<string, unknown> | null;
        };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};

export type Product = Database["public"]["Tables"]["products"]["Row"];
export type Client = Database["public"]["Tables"]["clients"]["Row"];
export type ContactMessage = Database["public"]["Tables"]["contact_messages"]["Row"];
export type ProductRequest = Database["public"]["Tables"]["product_requests"]["Row"];
export type AnalyticsEventRow = Database["public"]["Tables"]["analytics_events"]["Row"];
