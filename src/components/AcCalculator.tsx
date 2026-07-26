import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calculator, ArrowRight, Phone, Home, CheckCircle, Info } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { productsQueryOptions } from "@/lib/products-db";


const PRESETS = [
  { m2: 15, label: "15 м²" },
  { m2: 20, label: "20 м²" },
  { m2: 25, label: "25 м²" },
  { m2: 35, label: "35 м²" },
  { m2: 45, label: "45 м²" },
  { m2: 60, label: "60 м²" },
];

function recommendBtu(area: number): { btus: number[]; label: string } {
  if (area < 15) return { btus: [9000], label: "9 000 BTU" };
  if (area <= 20) return { btus: [9000, 12000], label: "9 000 - 12 000 BTU" };
  if (area <= 25) return { btus: [12000], label: "12 000 BTU" };
  if (area <= 35) return { btus: [12000, 18000], label: "12 000 - 18 000 BTU" };
  if (area <= 45) return { btus: [18000], label: "18 000 BTU" };
  return { btus: [24000], label: "24 000 BTU" };
}

function findMatchingProducts(products: import("@/data/products").Product[], btus: number[], limit = 4) {
  const matches = products.filter((p) => btus.includes(p.btu));
  if (matches.length >= limit) return matches.slice(0, limit);

  const target = btus[0];
  const others = products
    .filter((p) => !btus.includes(p.btu))
    .sort((a, b) => Math.abs(a.btu - target) - Math.abs(b.btu - target) || a.priceEur - b.priceEur);

  return [...matches, ...others].slice(0, limit);
}

export function AcCalculator() {
  const [area, setArea] = useState<number>(25);
  const [calculated, setCalculated] = useState(false);
  const { data: products = [] } = useQuery(productsQueryOptions());

  const result = useMemo(() => recommendBtu(area), [area]);

  const matchingProducts = useMemo(
    () => (calculated ? findMatchingProducts(products, result.btus) : []),
    [calculated, products, result.btus],
  );


  const handleCalculate = () => {
    setCalculated(true);
    const resultsEl = document.getElementById("calculator-results");
    if (resultsEl) {
      resultsEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-card md:p-8">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-brand-sky-soft text-brand-teal">
          <Calculator className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-xl font-extrabold text-brand-navy">Калкулатор за мощност</h3>
          <p className="text-sm text-muted-foreground">Пресметнете нужната мощност за вашето помещение</p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-brand-navy">
              <Home className="h-4 w-4 text-brand-teal" />
              Площ на помещението
            </label>
            <div className="mt-3 flex items-center gap-4">
              <input
                type="range"
                min={10}
                max={60}
                step={1}
                value={area}
                onChange={(e) => setArea(Number(e.target.value))}
                className="w-full accent-brand-teal"
              />
              <div className="flex min-w-[5.5rem] items-center justify-center rounded-full border border-border bg-background px-3 py-2 text-sm font-bold text-brand-navy">
                {area} м²
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.m2}
                  type="button"
                  onClick={() => setArea(p.m2)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    area === p.m2
                      ? "bg-brand-navy text-white"
                      : "bg-brand-sky-soft text-brand-navy hover:bg-brand-sky"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-brand-sky-soft/40 p-4">
            <div className="flex items-start gap-2">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-teal" />
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-brand-navy">Забележка:</span> Ориентацията на помещението (юг/запад изисква по-висока мощност) и качеството на изолацията също влияят на препоръката. За прецизен избор е добре да ги вземем предвид заедно с броя прозорци и начина на използване - обадете ни се за индивидуална консултация.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl bg-brand-sky-soft/60 p-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Препоръчителна мощност</p>
            <div className="mt-3">
              <span className="text-3xl font-extrabold text-brand-navy md:text-4xl">{result.label}</span>
            </div>
            <p className="mt-4 text-sm font-medium text-brand-navy">
              За стая с площ <span className="font-extrabold text-brand-teal">{area} м²</span>
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Изчислението е ориентировъчно и служи като начален ориентир. За най-точен избор на модел спрямо вашето конкретно помещение, най-добре се свържете с нас - ще Ви препоръчаме кой е точният климатик за Вас.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCalculate}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-[1.02]"
          >
            <Calculator className="h-4 w-4" />
            Покажи подходящи модели
          </button>
        </div>
      </div>

      {calculated && (
        <div id="calculator-results" className="mt-10 border-t border-border/60 pt-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-brand-teal" />
              <h4 className="text-lg font-extrabold text-brand-navy">Подходящи модели за {result.label}</h4>
            </div>
            <a
              href="tel:+359897203732"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-[1.02]"
            >
              <Phone className="h-4 w-4" />
              Обади се
            </a>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Тези модели покриват препоръчителната мощност за вашето помещение.
          </p>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {matchingProducts.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      )}

      {calculated && (
        <div className="mt-12 rounded-2xl bg-brand-navy px-6 py-8 text-center text-white shadow-soft md:px-10">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-white/10">
            <Phone className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-4 text-2xl font-extrabold md:text-3xl">Не сте сигурни в избора?</h2>
          <p className="mx-auto mt-2 max-w-xl text-white/80">
            Свържете се с нас и ще Ви помогнем да изберете оптималния модел за вашия дом или офис.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href="tel:+359897203732"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-navy transition-transform hover:scale-[1.02]"
            >
              <Phone className="h-4 w-4" />
              Обади се
            </a>
            <a
              href="/kontakti"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
            >
              Поискай оферта
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
