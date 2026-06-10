export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          category: string;
          description: string | null;
          price: number | null;
          image_url: string | null;
          status: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          category: string;
          description?: string | null;
          price?: number | null;
          image_url?: string | null;
          status?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string;
          description?: string | null;
          price?: number | null;
          image_url?: string | null;
          status?: string | null;
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
