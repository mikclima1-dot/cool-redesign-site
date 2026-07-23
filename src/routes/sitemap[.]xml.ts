import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { products } from "@/data/products";

const BASE_URL = "https://www.mikclima.com";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const staticEntries = [
          { path: "/", priority: "1.0", changefreq: "weekly" },
          { path: "/produkti", priority: "0.9", changefreq: "weekly" },
          { path: "/uslugi", priority: "0.8", changefreq: "monthly" },
          { path: "/za-nas", priority: "0.6", changefreq: "monthly" },
          { path: "/kontakti", priority: "0.6", changefreq: "monthly" },
        ];
        const productEntries = products.map((p) => ({
          path: `/produkti/${p.slug}`,
          priority: "0.7",
          changefreq: "monthly",
        }));
        const urls = [...staticEntries, ...productEntries].map(
          (e) =>
            `  <url>\n    <loc>${BASE_URL}${e.path}</loc>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`,
        );
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");
        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
