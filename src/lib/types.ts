export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: number;
          name: string;
          description: string | null;
          price: number | null;
          category: string | null;
          image_url: string | null;
          in_stock: boolean;
          created_at: string;
        };
        Insert: {
          name: string;
          description?: string | null;
          price?: number | null;
          category?: string | null;
          image_url?: string | null;
          in_stock?: boolean;
          created_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          description?: string | null;
          price?: number | null;
          category?: string | null;
          image_url?: string | null;
          in_stock?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      clients: {
        Row: {
          id: number;
          name: string;
          logo_url: string | null;
          website_url: string | null;
          display_order: number;
          active: boolean;
        };
        Insert: {
          name: string;
          logo_url?: string | null;
          website_url?: string | null;
          display_order?: number;
          active?: boolean;
        };
        Update: {
          id?: number;
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
          id: number;
          name: string;
          email: string;
          phone: string | null;
          subject: string | null;
          message: string;
          created_at: string;
        };
        Insert: {
          name: string;
          email: string;
          phone?: string | null;
          subject?: string | null;
          message: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          email?: string;
          phone?: string | null;
          subject?: string | null;
          message?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      product_requests: {
        Row: {
          id: number;
          name: string;
          email: string;
          phone: string | null;
          product_name: string | null;
          quantity: number | null;
          message: string | null;
          created_at: string;
        };
        Insert: {
          name: string;
          email: string;
          phone?: string | null;
          product_name?: string | null;
          quantity?: number | null;
          message?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          email?: string;
          phone?: string | null;
          product_name?: string | null;
          quantity?: number | null;
          message?: string | null;
          created_at?: string;
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

export type Product =
  Database["public"]["Tables"]["products"]["Row"];
export type Client =
  Database["public"]["Tables"]["clients"]["Row"];
export type ContactMessage =
  Database["public"]["Tables"]["contact_messages"]["Row"];
export type ProductRequest =
  Database["public"]["Tables"]["product_requests"]["Row"];
