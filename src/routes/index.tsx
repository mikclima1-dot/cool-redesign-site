import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Wind, Zap, Snowflake, Sparkles, ShieldCheck, Wrench, Truck, Phone } from "lucide-react";


import { ProductCard } from "@/components/ProductCard";
import { products, categoryCount } from "@/data/products";
import { BrandStrip } from "@/components/BrandStrip";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MIKCLIMA | Продажба, Монтаж и Профилактика на Климатици" },
      {
        name: "description",
        content:
          "Професионална доставка, бърз монтаж, демонтаж и профилактика на климатични системи за дома и офиса. Гарантирано качество и консултация от експерти.",
      },
      {
        name: "keywords",
        content:
          "климатици, климатик, инверторен климатик, хиперинверторен климатик, монтаж на климатик, профилактика, демонтаж, MIK Clima, София, България",
      },
      { property: "og:title", content: "MIKCLIMA | Продажба, Монтаж и Профилактика на Климатици" },
      {
        property: "og:description",
        content:
          "Професионална доставка, бърз монтаж, демонтаж и профилактика на климатични системи за дома и офиса. Гарантирано качество и консултация от експерти.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.mikclima.com/" },
    ],
    links: [{ rel: "canonical", href: "https://www.mikclima.com/" }],
  }),
  component: Home,
});

const categoryCards = [
  { key: "inverter", label: "Инверторни", icon: Wind, href: "/produkti", search: { cat: "inverter" as const } },
  { key: "hyper", label: "Хиперинверторни", icon: Zap, href: "/produkti", search: { cat: "hyper" as const } },
  { key: "floor", label: "Подови", icon: Snowflake, href: "/produkti", search: { cat: "floor" as const } },
  { key: "column", label: "Колонни", icon: Sparkles, href: "/produkti", search: { cat: "column" as const } },
] as const;

function Home() {
  const featured = products.slice(0, 8);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:px-8 md:py-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-navy backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> Над 17 години опит · 10 000+ монтажа
            </div>
            <h1 className="mt-5 text-5xl font-extrabold leading-[1.05] tracking-tight text-brand-navy md:text-6xl">
              Свеж въздух. <br />
              <span className="text-brand-teal">Прецизен монтаж.</span>
            </h1>
            <p className="mt-5 max-w-md text-lg text-muted-foreground">
              Усетете чистотата и качеството на въздуха във вашия климатик.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/produkti"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-[1.02]"
              >
                Виж продуктите <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="tel:+359897203732"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-brand-navy hover:bg-brand-sky-soft"
              >
                Обади се
              </a>
              <Link
                to="/kontakti"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-brand-navy hover:bg-brand-sky-soft"
              >
                Изпрати запитване
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-border/60 pt-6">
              {[
                { n: "17+", l: "години опит" },
                { n: "10 000+", l: "монтажа" },
                { n: "Хиляди", l: "доволни клиенти" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="text-2xl font-extrabold text-brand-navy md:text-3xl">{s.n}</div>
                  <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <img
              src="/images/hero-living-room.jpg"
              alt="Модерна дневна с монтиран климатик"
              width={1400}
              height={1000}
              className="w-full rounded-3xl object-cover shadow-soft"
            />
            <div className="absolute -bottom-6 left-6 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-soft">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-brand-sky text-brand-navy">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-brand-navy">Гаранция</div>
                <div className="text-xs text-muted-foreground">на всички модели</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-brand-navy md:text-3xl">
              Категории климатици
            </h2>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              Изберете правилното решение според площта и типа помещение.
            </p>
          </div>
          <Link
            to="/produkti"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-teal hover:underline"
          >
            Всички продукти <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          {categoryCards.map(({ key, label, icon: Icon, href, search }) => (
            <Link
              key={key}
              to={href}
              search={search}
              className="group flex items-center gap-3 rounded-xl border border-border/60 bg-card px-4 py-3 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-soft"
            >
              <div className="grid h-9 w-9 flex-none place-items-center rounded-lg bg-brand-sky-soft text-brand-teal transition-colors group-hover:bg-brand-sky">
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-brand-navy">{label}</div>
                <div className="text-xs text-muted-foreground">
                  {categoryCount(key as never)} модела
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="bg-brand-sky-soft/50 py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-brand-navy md:text-4xl">
                Препоръчани модели
              </h2>
              <p className="mt-2 max-w-xl text-muted-foreground">
                Топ избор от нашия каталог - с подробни спецификации и описания.
              </p>
            </div>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-brand-navy md:text-4xl">Услуги</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Пълно обслужване - от избора на модел до монтажа и годишната поддръжка.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Wrench,
              title: "Монтаж на климатик",
              desc: "Стандартен монтаж до 3 л.м. тръбен път от 190 €. Екип от сертифицирани специалисти.",
            },
            {
              icon: ShieldCheck,
              title: "Профилактика",
              desc: "Годишна поддръжка за максимална ефективност и по-дълъг живот на машината.",
            },
            {
              icon: Truck,
              title: "Демонтаж и пренасяне",
              desc: "Бърз и безопасен демонтаж на стар климатик или пренасяне на нов адрес.",
            },
          ].map((s) => (
            <div
              key={s.title}
              className="rounded-2xl border border-border/60 bg-card p-6 shadow-card"
            >
              <div className="grid h-12 w-12 place-items-center rounded-full bg-brand-sky-soft text-brand-teal">
                <s.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-brand-navy">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              <Link
                to="/uslugi"
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-teal hover:underline"
              >
                Научи повече <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* BRANDS */}
      <section className="border-y border-border/60 bg-white py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 md:px-8">
          <p className="text-sm uppercase tracking-widest text-muted-foreground">
            Работим с водещите марки в бранша
          </p>
          <BrandStrip variant="light" size="lg" />
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <div className="rounded-3xl bg-brand-navy px-8 py-14 text-center text-white shadow-soft">
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
            Не сте сигурни кой модел ви трябва?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-white/80">
            Свържете се с нас. Ще преценим площта, изолацията и нуждите ви и ще ви предложим
            най-подходящия климатик.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="tel:+359897203732"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-navy transition-transform hover:scale-[1.02]"
            >
              Обади се <Phone className="h-4 w-4" />
            </a>
            <Link
              to="/kontakti"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
            >
              Изпрати запитване <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
