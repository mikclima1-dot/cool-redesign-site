import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { ChevronDown, Filter } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { CATEGORY_LABEL, products, type Category } from "@/data/products";

const searchSchema = z.object({
  cat: z.enum(["inverter", "hyper", "floor", "column"]).optional(),
  brand: z.string().optional(),
  room: z.enum(["small", "medium", "large", "xlarge"]).optional(),
  sort: z.enum(["default", "price-asc", "price-desc", "btu-asc", "btu-desc"]).optional(),
});

export const Route = createFileRoute("/produkti/")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Всички климатици - Каталог | MIK Clima" },
      {
        name: "description",
        content:
          "Пълен каталог инверторни, хиперинверторни, подови и колонни климатици. Daikin, Mitsubishi, Toshiba, Fujitsu, Gree, Cooper & Hunter.",
      },
      { property: "og:title", content: "Всички климатици - Каталог | MIK Clima" },
      { property: "og:description", content: "38 модела климатици от водещи производители." },
      { property: "og:url", content: "https://www.mikclima.com/produkti" },
    ],
    links: [{ rel: "canonical", href: "https://www.mikclima.com/produkti" }],
  }),
  component: ProductsPage,
});

const CATEGORIES: { value: Category; label: string }[] = [
  { value: "inverter", label: CATEGORY_LABEL.inverter },
  { value: "hyper", label: CATEGORY_LABEL.hyper },
  { value: "floor", label: CATEGORY_LABEL.floor },
  { value: "column", label: CATEGORY_LABEL.column },
];

const ROOM_SIZES = [
  { value: "small", label: "До 20 м² (9 000 BTU)", match: (btu: number) => btu <= 9000 },
  { value: "medium", label: "20–30 м² (12 000 BTU)", match: (btu: number) => btu > 9000 && btu <= 14000 },
  { value: "large", label: "30–45 м² (18 000 BTU)", match: (btu: number) => btu > 14000 && btu <= 20000 },
  { value: "xlarge", label: "45+ м² (24 000+ BTU)", match: (btu: number) => btu > 20000 },
] as const;

const SORT_OPTIONS = [
  { value: "default", label: "Подредба по подразбиране" },
  { value: "price-asc", label: "Цена: ниска към висока" },
  { value: "price-desc", label: "Цена: висока към ниска" },
  { value: "btu-asc", label: "Мощност: ниска към висока" },
  { value: "btu-desc", label: "Мощност: висока към ниска" },
] as const;

function ProductsPage() {
  const { cat, brand, room, sort } = Route.useSearch();
  const navigate = useNavigate({ from: "/produkti" });
  const [open, setOpen] = useState(false);

  const brandOptions = Array.from(new Set(products.map((p) => p.brand))).sort();

  let filtered = products.slice();
  if (cat) filtered = filtered.filter((p) => p.category === cat);
  if (brand) filtered = filtered.filter((p) => p.brand === brand);
  if (room) {
    const rs = ROOM_SIZES.find((r) => r.value === room);
    if (rs) filtered = filtered.filter((p) => rs.match(p.btu));
  }
  if (sort === "price-asc") filtered.sort((a, b) => a.priceEur - b.priceEur);
  else if (sort === "price-desc") filtered.sort((a, b) => b.priceEur - a.priceEur);
  else if (sort === "btu-asc") filtered.sort((a, b) => a.btu - b.btu);
  else if (sort === "btu-desc") filtered.sort((a, b) => b.btu - a.btu);

  const update = (patch: Record<string, string | undefined>) => {
    navigate({
      search: (prev: Record<string, string | undefined>) => {
        const next: Record<string, string | undefined> = { ...prev, ...patch };
        Object.keys(next).forEach((k) => {
          if (!next[k]) delete next[k];
        });
        return next as never;
      },
    });
  };

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
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-card">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex w-full items-center justify-between bg-brand-navy px-6 py-4 text-white"
          >
            <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest">
              <Filter className="h-4 w-4" /> Филтри
            </span>
            <ChevronDown
              className={`h-5 w-5 transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>
          {open && (
            <div className="grid gap-5 p-6 md:grid-cols-2 lg:grid-cols-4">
              <FilterSelect
                label="Категория"
                value={cat ?? ""}
                onChange={(v) => update({ cat: v || undefined })}
                allLabel="Всички категории"
                options={CATEGORIES.map((c) => ({ value: c.value, label: c.label }))}
              />
              <FilterSelect
                label="Марка"
                value={brand ?? ""}
                onChange={(v) => update({ brand: v || undefined })}
                allLabel="Всички марки"
                options={brandOptions.map((b) => ({ value: b, label: b }))}
              />
              <FilterSelect
                label="Квадратура"
                value={room ?? ""}
                onChange={(v) => update({ room: v || undefined })}
                allLabel="Всяко помещение"
                options={ROOM_SIZES.map((r) => ({ value: r.value, label: r.label }))}
              />
              <FilterSelect
                label="Сортиране"
                value={sort ?? "default"}
                onChange={(v) => update({ sort: v === "default" ? undefined : v })}
                options={SORT_OPTIONS.map((s) => ({ value: s.value, label: s.label }))}
              />
            </div>
          )}
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

function FilterSelect({
  label,
  value,
  onChange,
  options,
  allLabel,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  allLabel?: string;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <div className="relative mt-2">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-full border border-border bg-background px-4 py-2.5 pr-10 text-sm font-medium text-brand-navy shadow-sm outline-none transition-colors focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/30"
        >
          {allLabel && <option value="">{allLabel}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-navy/60" />
      </div>
    </label>
  );
}
