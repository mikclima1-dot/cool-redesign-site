import { createFileRoute, Link } from "@tanstack/react-router";
import { Wrench, ShieldCheck, Truck, ClipboardCheck, Eye, ArrowRight, Check } from "lucide-react";
import { services } from "@/data/services";

const icons = {
  wrench: Wrench,
  shield: ShieldCheck,
  truck: Truck,
  clipboard: ClipboardCheck,
  eye: Eye,
} as const;

export const Route = createFileRoute("/uslugi/")({
  head: () => ({
    meta: [
      { title: "Услуги - Монтаж, профилактика и демонтаж на климатици | MIK Clima" },
      {
        name: "description",
        content:
          "Професионален монтаж на климатици от 190 €, годишна профилактика от 60 €, демонтаж от 60 €, диагностика 40 € и оглед 25 €. Сертифициран екип и гаранция на работата.",
      },
      {
        name: "keywords",
        content:
          "монтаж на климатик, монтаж климатик цена, профилактика климатик, демонтаж климатик, диагностика климатик, оглед климатик, сервиз климатик, пренасяне климатик, MIK Clima, София",
      },
      { property: "og:title", content: "Услуги - Монтаж и Профилактика | MIK Clima" },
      {
        property: "og:description",
        content: "Монтаж, профилактика, демонтаж, диагностика и оглед на климатици.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.mikclima.com/uslugi" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Услуги - MIK Clima" },
      { name: "twitter:description", content: "Пълно обслужване на климатични системи." },
    ],
    links: [{ rel: "canonical", href: "https://www.mikclima.com/uslugi" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: services.map((s, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: s.title,
            url: `https://www.mikclima.com/uslugi/${s.slug}`,
          })),
        }),
      },
    ],
  }),
  component: Services,
});

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
          {services.map((s) => {
            const Icon = icons[s.icon];
            return (
              <Link
                key={s.slug}
                to="/uslugi/$slug"
                params={{ slug: s.slug }}
                className="flex flex-col rounded-2xl border border-border/60 bg-card p-6 shadow-card transition-shadow hover:shadow-soft"
              >
                <div className="grid h-12 w-12 place-items-center rounded-full bg-brand-sky-soft text-brand-teal">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-brand-navy">{s.title}</h2>
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
                <span className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-[1.02]">
                  Виж повече <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-16 rounded-3xl bg-brand-navy px-8 py-14 text-center text-white shadow-soft">
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">Свържете се с нас</h2>
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
