import { createFileRoute } from "@tanstack/react-router";
import { AcCalculator } from "@/components/AcCalculator";
import { CheckCircle, Phone, ArrowRight, HelpCircle, Zap, Sun, Thermometer, Home, Wrench } from "lucide-react";
import { Link } from "@tanstack/react-router";

const faqs = [
  {
    question: "Как се изчислява мощността на климатик?",
    answer:
      "Мощността се определя от площта на помещението, ориентацията на прозорците, качеството на изолацията и височината на тавана. Стандартната норма е около 650 BTU на квадратен метър, която се коригира според конкретните условия.",
  },
  {
    question: "Колко BTU са нужни за 20 квадратни метра?",
    answer:
      "За помещение от 20 м² с добра изолация и северно/източно изложение обикновено са достатъчни 9 000 BTU, което отговаря на около 2.5 kW. При южно/западно изложение или лоша изолация се препоръчват 12 000 BTU.",
  },
  {
    question: "Каква е разликата между BTU и kW?",
    answer:
      "BTU (British Thermal Unit) е мярка за количеството енергия, а kW (киловат) е мощност. За практически преобразувания: 9 000 BTU ≈ 2.6 kW, 12 000 BTU ≈ 3.5 kW, 18 000 BTU ≈ 5.3 kW, а 24 000 BTU ≈ 7 kW.",
  },
  {
    question: "Трябва ли ми по-мощен климатик, ако таванът е висок?",
    answer:
      "Да, при тавани над 2.70 м обемът на въздуха в помещението нараства и е нужна допълнителна мощност. Препоръчително е да добавите около 10-15% към изчислената стойност или да се обърнете към специалист за точна оценка.",
  },
  {
    question: "Може ли климатикът да е прекалено мощен?",
    answer:
      "Прекомерно мощният климатик охлажда или отоплява бързо, но изключва и пуска често, което нарушава комфорта, повишава разхода на енергия и съкращава живота на компресора. Правилният размер е ключов за ефективността.",
  },
];

const tips = [
  "Пресметнете си площта дължина x ширина",
  "Южни и западни стаи се нагряват повече",
  "Лошата изолация изисква по-мощен климатик",
  "Висок таван над 2.7 м добавя допълнителна мощност",
];

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
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: f.answer,
            },
          })),
        }),
      },
    ],
  }),
  component: CalculatorPage,
});

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

        <SeoContent />
      </section>
    </>
  );
}

function SeoContent() {
  return (
    <div className="mt-16 space-y-12">
      <article className="prose prose-lg max-w-none text-foreground">
        <h2 className="text-2xl font-extrabold text-brand-navy md:text-3xl">
          Защо правилният избор на мощност е важен
        </h2>
        <p>
          Изборът на климатик с правилната мощност е първата и най-важна стъпка към комфорта и ниските сметки за
          електроенергия. Прекалено малкият уред няма да охлади или отопли помещението ефективно, а прекалено мощният
          ще пуска и спира често, което води до неравномерна температура и по-висок разход.
        </p>
        <p>
          С нашия <strong>калкулатор за мощност на климатик</strong> можете бързо да прецените дали ви трябват{" "}
          <strong>9 000 BTU</strong>, <strong>12 000 BTU</strong>, <strong>18 000 BTU</strong> или{" "}
          <strong>24 000 BTU</strong> за вашето помещение.
        </p>

        <h2 className="mt-10 text-2xl font-extrabold text-brand-navy md:text-3xl">
          Как работи калкулаторът за климатик
        </h2>
        <p>
          Калкулаторът използва стандартна формула, която умножава площта на помещението по базова стойност от 650 BTU
          на квадратен метър. След това добавя корекции според ориентацията и изолацията, за да получите по-реалистична
          препоръка.
        </p>

        <div className="not-prose mt-6 grid gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-brand-sky-soft text-brand-teal">
              <Home className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-brand-navy">Площ на помещението</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Въведете квадратурата в m² или използвайте бързите бутони за най-честите стойности.
            </p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-brand-sky-soft text-brand-teal">
              <Sun className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-brand-navy">Ориентация</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Южни и западни стаи получават повече слънце и се нуждаят от около 15% допълнителна мощност.
            </p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-brand-sky-soft text-brand-teal">
              <Thermometer className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-brand-navy">Изолация</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Помещения без изолация губят повече топлина през зимата и се нагряват през лятото, което изисква по-мощен
              климатик.
            </p>
          </div>
        </div>

        <h2 className="mt-10 text-2xl font-extrabold text-brand-navy md:text-3xl">BTU vs kW - каква е връзката</h2>
        <p>
          Производителите посочват мощността на климатика в BTU, а електрическата мощност в kW. Ето бърз справочник за
          най-популярните стойности:
        </p>
        <ul>
          <li>
            <strong>9 000 BTU</strong> ≈ 2.6 kW - подходящ за спални и малки стаи до 20-25 m²
          </li>
          <li>
            <strong>12 000 BTU</strong> ≈ 3.5 kW - идеален за дневни и помещения до 30-35 m²
          </li>
          <li>
            <strong>18 000 BTU</strong> ≈ 5.3 kW - за големи дневни, отворени пространства до 50 m²
          </li>
          <li>
            <strong>24 000 BTU</strong> ≈ 7 kW - за офиси, магазини и помещения над 60 m²
          </li>
        </ul>

        <h2 className="mt-10 text-2xl font-extrabold text-brand-navy md:text-3xl">
          Кога се нуждаете от помощ от специалист
        </h2>
        <p>
          Онлайн калкулаторът дава ориентировъчна стойност, но за точна оценка е добре да се обърнете към технолог. Ние
          от <strong>MIK Clima</strong> оглеждаме на място, измерваме помещението, проверяваме изложението и
          препоръчваме модел, който отговаря на вашите нужди и бюджет.
        </p>
        <p>
          Разгледайте нашите <Link to="/produkti" className="font-semibold text-brand-teal hover:underline">продукти</Link>,
          услугите за{" "}
          <Link to="/uslugi" className="font-semibold text-brand-teal hover:underline">монтаж и профилактика</Link>, или
          се свържете директно чрез{" "}
          <Link to="/kontakti" className="font-semibold text-brand-teal hover:underline">формата за контакт</Link>.
        </p>
      </article>

      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card md:p-8">
        <div className="flex items-center gap-3">
          <HelpCircle className="h-6 w-6 text-brand-teal" />
          <h2 className="text-xl font-extrabold text-brand-navy md:text-2xl">Често задавани въпроси</h2>
        </div>
        <div className="mt-6 divide-y divide-border/60">
          {faqs.map((faq, idx) => (
            <details key={idx} className="group py-4 first:pt-0 last:pb-0">
              <summary className="flex cursor-pointer list-none items-center justify-between text-base font-semibold text-brand-navy">
                {faq.question}
                <Zap className="h-4 w-4 rotate-0 text-brand-teal transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-brand-navy px-6 py-8 text-center text-white shadow-soft md:px-10">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-white/10">
          <Wrench className="h-6 w-6 text-white" />
        </div>
        <h2 className="mt-4 text-2xl font-extrabold md:text-3xl">Готови сте за оферта?</h2>
        <p className="mx-auto mt-2 max-w-xl text-white/80">
          Независимо дали сте избрали модел или искате консултация, ние сме на разположение. Обадете се сега или
          изпратете запитване.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a
            href="tel:+359897203732"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-navy transition-transform hover:scale-[1.02]"
          >
            <Phone className="h-4 w-4" />
            Обади се
          </a>
          <Link
            to="/kontakti"
            className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
          >
            Поискай оферта
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
