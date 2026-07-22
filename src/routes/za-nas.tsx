import { createFileRoute } from "@tanstack/react-router";
import { Award, Users, Wrench, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/za-nas")({
  head: () => ({
    meta: [
      { title: "За нас - MIK Clima | 17+ години опит с климатици" },
      {
        name: "description",
        content:
          "MIK Clima е екип от специалисти по климатични системи с над 17 години опит, 10 000+ монтажа и 1100+ доволни клиенти в България.",
      },
      { property: "og:title", content: "За нас - MIK Clima" },
      { property: "og:description", content: "Историята и екипът зад MIK Clima." },
      { property: "og:url", content: "/za-nas" },
    ],
    links: [{ rel: "canonical", href: "/za-nas" }],
  }),
  component: About,
});

function About() {
  return (
    <>
      <section style={{ background: "var(--gradient-hero)" }}>
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-teal">За нас</p>
          <h1 className="mt-3 text-5xl font-extrabold tracking-tight text-brand-navy md:text-6xl">
            Хората зад MIK Clima
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Над 17 години помагаме на семейства и бизнеси в България да живеят по-комфортно.
            Работим само с проверени марки и не правим компромис с монтажа.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-2 md:gap-16 md:px-8">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-brand-navy">Нашата история</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            MIK Clima започна като малък семеен бизнес и днес обслужва хиляди клиенти в цялата
            страна. Мисията ни е една - да предлагаме качествени климатични системи с прецизен
            монтаж и коректно следпродажбено обслужване.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Работим с водещите японски и европейски марки: Daikin, Mitsubishi Electric, Mitsubishi
            Heavy, Toshiba, Fujitsu General, Gree и Cooper & Hunter.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: Award, n: "17+", l: "години опит" },
            { icon: Wrench, n: "10 000+", l: "монтажа" },
            { icon: Users, n: "1100+", l: "доволни клиенти" },
            { icon: ShieldCheck, n: "100%", l: "гаранция на работата" },
          ].map((s) => (
            <div key={s.l} className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-brand-sky-soft text-brand-teal">
                <s.icon className="h-5 w-5" />
              </div>
              <div className="mt-4 text-3xl font-extrabold text-brand-navy">{s.n}</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
