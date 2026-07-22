import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { CATEGORY_LABEL, CATEGORY_TYPE, type Product } from "@/data/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to="/produkti/$slug"
      params={{ slug: product.slug }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-card transition-all hover:-translate-y-1 hover:shadow-soft"
    >
      <div className="relative bg-white p-4">
        <div className="absolute left-4 top-4 rounded-full bg-brand-sky-soft px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-navy">
          {CATEGORY_LABEL[product.category]}
        </div>
        <div className="absolute right-4 top-4 rounded-full bg-brand-teal px-3 py-1 text-xs font-bold text-white">
          {product.energyClass}
        </div>
        <img
          src={product.image}
          alt={product.model}
          loading="lazy"
          className="mx-auto aspect-[4/3] w-full object-contain"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {product.brand} · {product.btu.toLocaleString("bg-BG")} BTU
        </p>
        <h3 className="text-lg font-bold text-brand-navy">{product.model}</h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{product.shortDescription}</p>
        <div className="mt-auto flex items-end justify-between border-t border-border/60 pt-3">
          <div>
            <div className="text-xl font-bold text-brand-navy">{product.priceEur} €</div>
            <div className="text-xs text-muted-foreground">
              {product.priceBgn.toLocaleString("bg-BG", { minimumFractionDigits: 2 })} лв.
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-teal transition-transform group-hover:translate-x-1">
            Виж <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
