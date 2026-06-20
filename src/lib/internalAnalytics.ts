import { supabase } from "@/lib/supabase";

// Internal CARZIX commercial-event analytics — stored in Supabase, never personal data.
// Complements (does not replace) Vercel Web Analytics in @/lib/analytics.
export type InternalAnalyticsEvent =
  | "product_view"
  | "quote_click"
  | "quote_submit"
  | "whatsapp_click"
  | "contact_click";

interface InternalEventPayload {
  product_id?: string | null;
  product_name?: string | null;
  category?: string | null;
  source?: string | null;
  pathname?: string | null;
  metadata?: Record<string, string | number | boolean | null>;
}

export function trackEvent(eventName: InternalAnalyticsEvent, payload: InternalEventPayload = {}): void {
  try {
    const { product_id, product_name, category, source, pathname, metadata } = payload;
    void (async () => {
      try {
        const { error } = await supabase.from("analytics_events").insert({
          event_name: eventName,
          pathname: pathname ?? (typeof window !== "undefined" ? window.location.pathname : null),
          product_id: product_id ?? null,
          product_name: product_name ?? null,
          category: category ?? null,
          source: source ?? null,
          metadata: metadata ?? null,
        });
        if (error) console.warn("[InternalAnalytics] insert failed (ignored):", error.message);
      } catch (err) {
        console.warn("[InternalAnalytics] insert threw (ignored):", err);
      }
    })();
  } catch (err) {
    console.warn("[InternalAnalytics] trackEvent threw synchronously (ignored):", err);
  }
}
