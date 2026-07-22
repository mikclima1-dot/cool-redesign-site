import { createFileRoute, Link } from "@tanstack/react-router";
import { Wrench, ShieldCheck, Truck, ClipboardCheck, Eye, ArrowRight, Check } from "lucide-react";

export const Route = createFileRoute("/uslugi")({
  head: () => ({
    meta: [
      { title: "Услуги - Монтаж, профилактика и демонтаж | MIK Clima" },
      {
        name: "description",
        content:
          "Професионален монтаж на климатици от 190 €, годишна профилактика и демонтаж на стара техника. Сертифициран екип и гаранция на работата.",
      },
      { property: "og:title", content: "Услуги | MIK Clima" },
      { property: "og:description", content: "Монтаж, поддръжка и демонтаж на климатици." },
      { property: "og:url", content: "/uslugi" },
    ],
    links: [{ rel: "canonical", href: "/uslugi" }],
  }),
  component: Services,
});

const services = [
  {
    icon: Wrench,
    title: "Монтаж на климатик",
    price: "от 190 €",
    desc: "Стандартен монтаж до 3 л.м. тръбен път. Сертифицирани техници, вакуумиране, тест и настройка.",
    points: [
      "Пробиване и заложни елементи",
      "Медни тръби с изолация",
      "Вакуумиране на системата",
      "Тестова експлоатация",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Профилактика",
    price: "от 60 €",
    desc: "Годишна поддръжка за максимална ефективност и по-дълъг живот на машината.",
    points: [
      "Химическо почистване на филтри",
      "Дезинфекция на изпарителя",
      "Проверка на хладилен агент",
      "Функционален тест",
    ],
  },
  {
    icon: Truck,
    title: "Демонтаж и пренасяне",
    price: "от 90 €",
    desc: "Бърз и безопасен демонтаж на стар климатик или пренасяне на нов адрес.",
    points: [
      "Изсмукване на хладилен агент",
      "Запечатване на щуцери",
      "Транспорт до нов адрес",
      "Повторен монтаж (опция)",
    ],
  },
  {
    icon: ClipboardCheck,
    title: "Посещение и диагностика",
    price: "40 €",
    desc: "Извършваме професионална диагностика на място и отстраняваме конкретния проблем възможно най-бързо.",
    points: [
      "Проверка на място",
      "Диагностика на неизправността",
      "Професионална оценка",
      "Препоръка за решение",
    ],
  },
  {
    icon: Eye,
    title: "Оглед",
    price: "25 € | 48,89 лв.",
    desc: "Идваме на адрес, за да огледаме помещението и да планираме най-доброто решение за монтаж.",
    points: [
      "Оценка на помещението",
      "Избор на място за вътрешно и външно тяло",
      "Предварителна оферта",
      "План за монтаж",
    ],
  },
];

function Services() {
  return (
    <>
      <section style={{ background: "var(--gradient-hero)" }}>
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-teal">Услуги</p>
          <h1 className="mt-3 text-5xl font-extrabold tracking-tight text-brand-navy md:text-6xl">
            От избора до монтажа
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Пълно обслужване от нашия екип с над 17 години опит на пазара.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div key={s.title} className="flex flex-col rounded-2xl border border-border/60 bg-card p-6 shadow-card">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-brand-sky-soft text-brand-teal">
                <s.icon className="h-6 w-6" />
              </div>
              <div className="mt-5 flex items-center justify-between">
                <h3 className="text-lg font-bold text-brand-navy">{s.title}</h3>
                <span className="rounded-full bg-brand-sky px-3 py-1 text-xs font-bold text-brand-navy">
                  {s.price}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              <ul className="mt-4 space-y-2">
                {s.points.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 flex-none text-brand-teal" />
                    <span className="text-foreground/80">{p}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/kontakti"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-[1.02]"
              >
                Заяви услуга <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-3xl bg-brand-navy px-8 py-14 text-center text-white shadow-soft">
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
            Свържете се с нас
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-white/80">
            Нашият специалист ще ви посъветва каква мощност е нужна и къде най-добре да се монтира
            външното и вътрешното тяло.
          </p>
          <Link
            to="/kontakti"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-navy transition-transform hover:scale-[1.02]"
          >
            Свържи се <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
