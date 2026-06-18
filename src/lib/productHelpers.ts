import type { Product } from "@/lib/types";
import type { StaticProduct } from "@/lib/products";

export type DisplayProduct = Product | StaticProduct;

export function isDbProduct(p: DisplayProduct): p is Product {
  return "status" in p;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Slugs are derived from the English name (not a stored DB field) so URLs
// stay stable across the language toggle and require no schema change.
// When `allProducts` is supplied, a short id suffix is appended on name
// collisions so two differently-named-but-similarly-slugified products
// (or duplicate names) each resolve to their own detail page.
export function productSlug(p: DisplayProduct, allProducts?: DisplayProduct[]): string {
  const nameEn = isDbProduct(p) ? p.name : p.nameEn;
  const base = slugify(nameEn) || p.id;
  if (!allProducts) return base;
  const baseOf = (other: DisplayProduct) => slugify(isDbProduct(other) ? other.name : other.nameEn) || other.id;
  const hasCollision = allProducts.some((other) => other !== p && baseOf(other) === base);
  return hasCollision ? `${base}-${p.id.slice(0, 6)}` : base;
}

export function productName(p: DisplayProduct, isAr: boolean): string {
  return isAr
    ? isDbProduct(p) ? (p.name_ar || p.name) : p.nameAr
    : isDbProduct(p) ? p.name : p.nameEn;
}

export function productDesc(p: DisplayProduct, isAr: boolean): string {
  return isAr
    ? isDbProduct(p) ? (p.description_ar || p.description || "") : p.descriptionAr
    : isDbProduct(p) ? (p.description ?? "") : p.descriptionEn;
}

export function productCat(p: DisplayProduct): string {
  return p.category;
}

export function productImage(p: DisplayProduct): string | null {
  return isDbProduct(p) ? p.image_url : null;
}

export function productFeatures(p: DisplayProduct, isAr: boolean): string[] {
  if (isDbProduct(p)) return (isAr ? (p.features_ar || p.features) : p.features) ?? [];
  return isAr ? p.featuresAr : p.featuresEn;
}

export function productSizes(p: DisplayProduct): string[] {
  if (isDbProduct(p)) return p.sizes ?? [];
  return p.sizes ?? [];
}

export function usageInstructions(p: DisplayProduct, t: (en: string, ar: string) => string): string {
  const ratio = isDbProduct(p) ? p.dilution_ratio : undefined;
  if (!ratio) return t("Follow label instructions for best results.", "اتبع تعليمات الملصق للحصول على أفضل النتائج.");
  if (/ready/i.test(ratio))
    return t("Apply directly to the surface — no dilution required.", "يستخدم مباشرة على السطح — لا حاجة للتخفيف.");
  const match = ratio.match(/1\s*:\s*(\d+)/);
  if (match)
    return t(
      `Mix 1 part concentrate with ${match[1]} parts water for a ready-to-use solution.`,
      `اخلط جزء واحد من المركز مع ${match[1]} جزء من الماء للحصول على محلول جاهز للاستخدام.`
    );
  return t("Follow label instructions for best results.", "اتبع تعليمات الملصق للحصول على أفضل النتائج.");
}
