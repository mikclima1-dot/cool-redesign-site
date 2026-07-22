import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { Filter } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { CATEGORY_LABEL, products, type Category } from "@/data/products";

const searchSchema = z.object({
  cat: z.enum(["inverter", "hyper", "floor", "column"]).optional(),
});

export const Route = createFileRoute("/produkti/")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Всички климатици — Каталог | MIK Clima" },
      {
        name: "description",
        content:
          "Пълен каталог инверторни, хиперинверторни, подови и колонни климатици. Daikin, Mitsubishi, Toshiba, Fujitsu, Gree, Cooper & Hunter.",
      },
      { property: "og:title", content: "Всички климатици — Каталог | MIK Clima" },
      { property: "og:description", content: "38 модела климатици от водещи производители." },
      { property: "og:url", content: "/produkti" },
    ],
    links: [{ rel: "canonical", href: "/produkti" }],
  }),
  component: ProductsPage,
});

const categoryOptions: { key: Category | "all"; label: string }[] = [
  { key: "all", label: "Всички" },
  { key: "inverter", label: CATEGORY_LABEL.inverter },
  { key: "hyper", label: CATEGORY_LABEL.hyper },
  { key: "floor", label: CATEGORY_LABEL.floor },
  { key: "column", label: CATEGORY_LABEL.column },
];

function ProductsPage() {
  const { cat } = Route.useSearch();
  const filtered = cat ? products.filter((p) => p.category === cat) : products;

  return (
    <>
      <section style={{ background: "var(--gradient-hero)" }}>
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-teal">Каталог</p>
          <h1 className="mt-3 text-5xl font-extrabold tracking-tight text-brand-navy md:text-6xl">
            Всички климатици
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Разгледайте пълния каталог модели от водещи японски и европейски марки. Всяка продуктова
            страница съдържа подробни технически спецификации и описание на функциите.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-card">
          <div className="flex flex-wrap items-center gap-2">
            <div className="mr-2 inline-flex items-center gap-2 text-sm font-semibold text-brand-navy">
              <Filter className="h-4 w-4" /> Филтри
            </div>
            {categoryOptions.map((o) => {
              const active = (o.key === "all" && !cat) || o.key === cat;
              return (
                <Link
                  key={o.key}
                  to="/produkti"
                  search={o.key === "all" ? {} : { cat: o.key as Category }}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "bg-brand-sky-soft text-brand-navy hover:bg-brand-sky"
                  }`}
                >
                  {o.label}
                </Link>
              );
            })}
          </div>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          Показани <span className="font-bold text-brand-navy">{filtered.length}</span> от{" "}
          {products.length} модела
        </p>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}
