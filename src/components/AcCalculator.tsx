import { useState, useMemo } from "react";
import { Calculator, ArrowRight, Phone, Home, Sun, Thermometer } from "lucide-react";

const PRESETS = [
  { m2: 15, label: "15 м²" },
  { m2: 20, label: "20 м²" },
  { m2: 25, label: "25 м²" },
  { m2: 35, label: "35 м²" },
  { m2: 50, label: "50 м²" },
  { m2: 65, label: "65 м²" },
  { m2: 80, label: "80 м²" },
];

const ORIENTATIONS = [
  { value: "north-east", label: "Север / Изток", factor: 1 },
  { value: "south-west", label: "Юг / Запад", factor: 1.15 },
];

const INSULATIONS = [
  { value: "good", label: "Добра изолация", factor: 1 },
  { value: "none", label: "Без изолация", factor: 1.25 },
];

function nearestStandardBtu(raw: number): { btu: number; kw: number } {
  const standards = [9000, 12000, 18000, 24000];
  const next = standards.find((b) => b >= raw) ?? 24000;
  return { btu: next, kw: Math.round((next * 0.000293) * 10) / 10 };
}

export function AcCalculator() {
  const [area, setArea] = useState<number>(25);
  const [orientation, setOrientation] = useState<string>("north-east");
  const [insulation, setInsulation] = useState<string>("good");

  const result = useMemo(() => {
    const orientFactor = ORIENTATIONS.find((o) => o.value === orientation)?.factor ?? 1;
    const insulFactor = INSULATIONS.find((i) => i.value === insulation)?.factor ?? 1;
    const baseBtu = area * 650 * orientFactor * insulFactor;
    return nearestStandardBtu(baseBtu);
  }, [area, orientation, insulation]);

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
                max={80}
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

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-brand-navy">
              <Sun className="h-4 w-4 text-brand-teal" />
              Ориентация
            </label>
            <select
              value={orientation}
              onChange={(e) => setOrientation(e.target.value)}
              className="mt-2 w-full rounded-full border border-border bg-background px-4 py-2.5 text-sm font-medium text-brand-navy outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/30"
            >
              {ORIENTATIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-brand-navy">
              <Thermometer className="h-4 w-4 text-brand-teal" />
              Изолация
            </label>
            <select
              value={insulation}
              onChange={(e) => setInsulation(e.target.value)}
              className="mt-2 w-full rounded-full border border-border bg-background px-4 py-2.5 text-sm font-medium text-brand-navy outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/30"
            >
              {INSULATIONS.map((i) => (
                <option key={i.value} value={i.value}>
                  {i.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl bg-brand-sky-soft/60 p-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Препоръчителна мощност</p>
            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-4xl font-extrabold text-brand-navy md:text-5xl">{result.btu.toLocaleString("bg")}</span>
              <span className="text-lg font-semibold text-brand-navy">BTU</span>
            </div>
            <p className="mt-1 text-lg font-medium text-brand-teal">≈ {result.kw} kW</p>
            <p className="mt-4 text-sm text-muted-foreground">
              Изчислението е ориентировъчно. За точна оферта се свържете с нас — ще преценим височината на тавана,
              броя прозорци, изложението и начина на използване.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href="tel:+359897203732"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-[1.02]"
            >
              <Phone className="h-4 w-4" />
              Обади се
            </a>
            <a
              href="/kontakti"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-5 py-3 text-sm font-semibold text-brand-navy transition-colors hover:bg-white"
            >
              Поискай оферта за този размер
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
