import { createFileRoute } from "@tanstack/react-router";
import { AcCalculator } from "@/components/AcCalculator";
import { CheckCircle } from "lucide-react";

export const Route = createFileRoute("/kalkulator")({
  head: () => ({
    meta: [
      { title: "Калкулатор за мощност на климатик | MIK Clima" },
      {
        name: "description",
        content:
          "Безплатен калкулатор за изчисляване на нужната мощност на климатик според площ, ориентация и изолация. Получете оферта от MIK Clima.",
      },
      {
        name: "keywords",
        content:
          "калкулатор климатик, мощност климатик, BTU калкулатор, kW климатик, колко BTU ми трябват, климатик за площ, MIK Clima",
      },
      { property: "og:title", content: "Калкулатор за мощност на климатик | MIK Clima" },
      {
        property: "og:description",
        content: "Изчислете бързо нужната мощност на климатик за вашето помещение.",
      },
      { property: "og:url", content: "https://www.mikclima.com/kalkulator" },
    ],
    links: [{ rel: "canonical", href: "https://www.mikclima.com/kalkulator" }],
  }),
  component: CalculatorPage,
});

const tips = [
  "Пресметнете си площта дължина × ширина",
  "Южни и западни стаи се нагряват повече",
  "Лошата изолация изисква по-мощен климатик",
  "Висок таван над 2.7 м добавя допълнителна мощност",
];

function CalculatorPage() {
  return (
    <>
      <section style={{ background: "var(--gradient-hero)" }}>
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-teal">Калкулатор</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-brand-navy md:text-5xl">
            Колко мощен климатик ви трябва?
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Въведете площта, ориентацията и изолацията на помещението, за да получите ориентировъчна препоръка за
            мощност в BTU и kW.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 md:px-8 md:py-16">
        <AcCalculator />

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {tips.map((tip, idx) => (
            <div key={idx} className="flex items-start gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-card">
              <CheckCircle className="mt-0.5 h-5 w-5 flex-none text-brand-teal" />
              <p className="text-sm text-muted-foreground">{tip}</p>
            </div>
          ))}
        </div>

      </section>
    </>
  );
}
