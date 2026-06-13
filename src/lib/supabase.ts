import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Diagnostic — visible in browser console (never logs the full key)
if (!supabaseUrl || supabaseUrl.includes("placeholder")) {
  console.warn("[Supabase] VITE_SUPABASE_URL is missing or placeholder:", supabaseUrl);
} else {
  console.info("[Supabase] URL:", supabaseUrl);
}

if (!supabaseAnonKey) {
  console.warn("[Supabase] VITE_SUPABASE_ANON_KEY is missing");
} else if (supabaseAnonKey.startsWith("sb_publishable_") || supabaseAnonKey.startsWith("sb_anon_")) {
  console.warn(
    "[Supabase] VITE_SUPABASE_ANON_KEY is a new-format publishable key (" +
      supabaseAnonKey.slice(0, 20) + "…). " +
      "Supabase Storage requires the legacy JWT anon key (starts with eyJ). " +
      "Go to Supabase Dashboard → Project Settings → API → anon (JWT) and copy that key into Vercel."
  );
} else if (!supabaseAnonKey.startsWith("eyJ")) {
  console.warn(
    "[Supabase] VITE_SUPABASE_ANON_KEY does not look like a JWT (expected eyJ…). " +
      "First 6 chars: " + supabaseAnonKey.slice(0, 6)
  );
} else {
  console.info("[Supabase] Anon key format: JWT ✓ (starts with eyJ)");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
