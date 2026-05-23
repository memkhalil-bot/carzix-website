export interface Database {
  public: {
    Tables: {
      products: {
        Row: Product;
        Insert: Omit<Product, "id" | "created_at">;
        Update: Partial<Omit<Product, "id" | "created_at">>;
      };
      clients: {
        Row: Client;
        Insert: Omit<Client, "id">;
        Update: Partial<Omit<Client, "id">>;
      };
      contact_messages: {
        Row: ContactMessage;
        Insert: Omit<ContactMessage, "id" | "created_at">;
        Update: Partial<Omit<ContactMessage, "id" | "created_at">>;
      };
      product_requests: {
        Row: ProductRequest;
        Insert: Omit<ProductRequest, "id" | "created_at">;
        Update: Partial<Omit<ProductRequest, "id" | "created_at">>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number | null;
  category: string | null;
  image_url: string | null;
  in_stock: boolean;
  created_at: string;
}

export interface Client {
  id: number;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  display_order: number;
  active: boolean;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  created_at: string;
}

export interface ProductRequest {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  product_name: string | null;
  quantity: number | null;
  message: string | null;
  created_at: string;
}
