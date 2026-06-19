import { track } from "@vercel/analytics";

export type AnalyticsEvent =
  | "click_request_quote"
  | "submit_quote_request"
  | "click_whatsapp"
  | "view_product_detail"
  | "click_contact_email"
  | "click_contact_phone"
  | "switch_language";

type EventProps = Record<string, string | number | boolean>;

export function trackEvent(event: AnalyticsEvent, props?: EventProps) {
  track(event, props);
}
