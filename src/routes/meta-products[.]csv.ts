import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

const BASE_URL = "https://www.mikclima.com";
const CURRENCY = "EUR";
const GOOGLE_CATEGORY =
  "Home & Garden > Household Appliances > Climate Control Appliances > Air Conditioners";

const COLUMNS = [
  "id",
  "title",
  "description",
  "availability",
  "condition",
  "price",
  "link",
  "image_link",
  "brand",
  "mpn",
  "product_type",
  "google_product_category",
] as const;

interface Row {
  id: string;
  slug: string;
  title: string;
  brand: string;
  price: number | string;
  image_url: string;
  description: string;
}

const CATEGORY_LABELS: { test: RegExp; label: string; type: string }[] = [
  { test: /мултисистема/i, label: "Мултисистеми", type: "Мултисистема" },
  { test: /хипер/i, label: "Хиперинверторни климатици", type: "Хиперинверторен климатик" },
  { test: /подов/i, label: "Подови климатици", type: "Подов климатик" },
  { test: /колон/i, label: "Колонни климатици", type: "Колонен климатик" },
];

function productType(title: string): string {
  const hit = CATEGORY_LABELS.find((c) => c.test.test(title));
  return `Климатици > ${hit ? hit.label : "Инверторни климатици"}`;
}

function typePrefix(title: string): string {
  const hit = CATEGORY_LABELS.find((c) => c.test.test(title));
  return hit ? hit.type : "Инверторен климатик";
}

function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function deriveMpn(title: string, brand: string): string {
  let out = title.replace(new RegExp(`^${escapeRe(typePrefix(title))}\\s+`, "i"), "");
  out = out.replace(new RegExp(`^${escapeRe(brand)}\\s+`, "i"), "");
  return out.trim();
}

function plainText(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function csvCell(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

export const Route = createFileRoute("/meta-products.csv")({
  server: {
    handlers: {
      GET: async () => {
        const env = import.meta.env as Record<string, string | undefined>;
        const url =
          env.VITE_SUPABASE_URL ?? process.env["VITE_SUPABASE_URL"] ?? process.env["SUPABASE_URL"]!;
        const key =
          env.VITE_SUPABASE_PUBLISHABLE_KEY ??
          process.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ??
          process.env["SUPABASE_ANON_KEY"]!;
        const supabase = createClient(url, key, { auth: { persistSession: false } });

        const all: Row[] = [];
        const pageSize = 1000;
        for (let from = 0; ; from += pageSize) {
          const { data, error } = await supabase
            .from("products")
            .select("id, slug, title, brand, price, image_url, description")
            .order("brand", { ascending: true })
            .range(from, from + pageSize - 1);
          if (error || !data || data.length === 0) break;
          all.push(...(data as unknown as Row[]));
          if (data.length < pageSize) break;
        }

        const lines = [COLUMNS.join(",")];
        for (const p of all) {
          if (!p.slug || !p.title || !p.image_url) continue;
          const priceNum = Number(p.price) || 0;
          const image = p.image_url.startsWith("http")
            ? p.image_url
            : `${BASE_URL}${p.image_url.startsWith("/") ? "" : "/"}${p.image_url}`;
          const description = plainText(p.description || p.title);
          lines.push(
            [
              p.id,
              p.title,
              description,
              priceNum > 0 ? "in stock" : "out of stock",
              "new",
              `${priceNum.toFixed(2)} ${CURRENCY}`,
              `${BASE_URL}/produkti/${p.slug}`,
              image,
              p.brand ?? "",
              deriveMpn(p.title, p.brand ?? ""),
              productType(p.title),
              GOOGLE_CATEGORY,
            ]
              .map((v) => csvCell(String(v ?? "")))
              .join(","),
          );
        }

        const csv = "\uFEFF" + lines.join("\r\n") + "\r\n";
        return new Response(csv, {
          headers: {
            "Content-Type": "text/csv; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
            "Access-Control-Allow-Origin": "*",
          },
        });
      },
    },
  },
});
