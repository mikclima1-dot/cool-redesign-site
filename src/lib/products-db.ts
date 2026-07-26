import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CATEGORY_TYPE, type Category, type Product } from "@/data/products";

export interface DbProductRow {
  id: string;
  slug: string;
  title: string;
  brand: string;
  price: number;
  old_price: number | null;
  btu: number | null;
  image_url: string;
  description: string;
  specs: Record<string, unknown> | null;
  original_url: string | null;
}

const EUR_TO_BGN = 1.95583;

export function deriveCategory(title: string): Category {
  const t = title.toLowerCase();
  if (t.includes("мултисистема")) return "multi";
  if (t.includes("хипер")) return "hyper";
  if (t.includes("подов")) return "floor";
  if (t.includes("колон")) return "column";
  return "inverter";
}


function deriveEnergyClass(title: string, description: string): string {
  const m = (title + " " + description).match(/клас\s*(A\+{0,3})/i);
  return m ? m[1].toUpperCase() : "A++";
}

function deriveModel(title: string, brand: string, category: Category): string {
  const typePrefix = CATEGORY_TYPE[category];
  let out = title;
  const prefixRe = new RegExp(`^${escapeRe(typePrefix)}\\s+`, "i");
  out = out.replace(prefixRe, "");
  const brandRe = new RegExp(`^${escapeRe(brand)}\\s+`, "i");
  out = out.replace(brandRe, "");
  return out.trim();
}

function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function shortDesc(description: string): string {
  const clean = description.replace(/\s+/g, " ").trim();
  const dot = clean.indexOf(". ");
  if (dot > 40 && dot < 220) return clean.slice(0, dot + 1);
  return clean.slice(0, 180) + (clean.length > 180 ? "…" : "");
}

function extractFeatures(specs: Record<string, unknown> | null): string[] {
  if (!specs) return [];
  const raw = (specs as { features?: unknown }).features;
  if (Array.isArray(raw)) return raw.filter((x): x is string => typeof x === "string");
  return [];
}

export function toProduct(row: DbProductRow): Product {
  const category = deriveCategory(row.title);
  const model = deriveModel(row.title, row.brand, category);
  const priceEur = Number(row.price) || 0;
  const btu = row.btu ?? 0;
  return {
    slug: row.slug,
    brand: row.brand,
    model,
    fullName: row.title,
    category,
    btu,
    energyClass: deriveEnergyClass(row.title, row.description),
    priceEur,
    priceBgn: Math.round(priceEur * EUR_TO_BGN * 100) / 100,
    image: row.image_url,
    shortDescription: shortDesc(row.description),
    description: row.description,
    features: extractFeatures(row.specs),
    sourceUrl: row.original_url ?? "",
  };
}

async function fetchAll(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("id, slug, title, brand, price, old_price, btu, image_url, description, specs, original_url")
    .order("brand", { ascending: true })
    .order("price", { ascending: true })
    .limit(2000);
  if (error) throw error;
  return (data as unknown as DbProductRow[]).map(toProduct);
}

async function fetchBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("id, slug, title, brand, price, old_price, btu, image_url, description, specs, original_url")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return toProduct(data as unknown as DbProductRow);
}

export const productsQueryOptions = () =>
  queryOptions({
    queryKey: ["products", "all"],
    queryFn: fetchAll,
    staleTime: 5 * 60_000,
  });

export const productBySlugQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["products", "slug", slug],
    queryFn: () => fetchBySlug(slug),
    staleTime: 5 * 60_000,
  });
