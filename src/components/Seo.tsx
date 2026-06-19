import { useEffect } from "react";

interface SeoProps {
  title: string;
  description: string;
  image?: string;
  type?: string;
  jsonLd?: object | object[];
}

const DEFAULT_OG_IMAGE = "https://carzix-website.vercel.app/og-image.png";

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export default function Seo({ title, description, image, type = "website", jsonLd }: SeoProps) {
  useEffect(() => {
    const fullTitle = `${title} | CARZIX`;
    const ogImage = image || DEFAULT_OG_IMAGE;
    document.title = fullTitle;
    upsertMeta("name", "description", description);
    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:url", window.location.href);
    upsertMeta("property", "og:site_name", "CARZIX");
    upsertMeta("property", "og:image", ogImage);
    if (!image) {
      upsertMeta("property", "og:image:width", "1200");
      upsertMeta("property", "og:image:height", "630");
    }
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", fullTitle);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", ogImage);

    let script: HTMLScriptElement | null = null;
    if (jsonLd) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.text = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
    return () => {
      if (script) document.head.removeChild(script);
    };
  }, [title, description, image, type, jsonLd]);

  return null;
}
