import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, Clock, MapPin } from "lucide-react";

export const Route = createFileRoute("/kontakti")({
  head: () => ({
    meta: [
      { title: "Контакти - MIK Clima | Свържете се с нас" },
      {
        name: "description",
        content:
          "Свържете се с MIK Clima за оферта или сервиз. Работно време понеделник–петък 09:00–18:00.",
      },
      { property: "og:title", content: "Контакти - MIK Clima" },
      { property: "og:description", content: "Телефон, имейл и работно време." },
      { property: "og:url", content: "/kontakti" },
    ],
    links: [{ rel: "canonical", href: "/kontakti" }],
  }),
  component: Contact,
});

function Contact() {
  return (
    <>
      <section style={{ background: "var(--gradient-hero)" }}>
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-teal">Контакти</p>
          <h1 className="mt-3 text-5xl font-extrabold tracking-tight text-brand-navy md:text-6xl">
            Свържете се с нас
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Обадете се или ни пишете за оферта или сервизна заявка.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 md:grid-cols-2 md:px-8">
        <div className="space-y-4">
          {[
            { icon: Phone, label: "Телефон", value: "+359 897 203 732", href: "tel:+359897203732" },
            { icon: Mail, label: "Имейл", value: "info@mikclima.com", href: "mailto:info@mikclima.com" },
            { icon: Clock, label: "Работно време", value: "Понеделник – Петък: 09:00 – 18:00" },
            { icon: MapPin, label: "Локация", value: "България" },
          ].map((c) => (
            <a
              key={c.label}
              href={c.href}
              className="flex items-start gap-4 rounded-2xl border border-border/60 bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-soft"
            >
              <div className="grid h-11 w-11 place-items-center rounded-full bg-brand-sky-soft text-brand-teal">
                <c.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</div>
                <div className="mt-1 text-lg font-semibold text-brand-navy">{c.value}</div>
              </div>
            </a>
          ))}
        </div>

        <form className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
          <h2 className="text-xl font-bold text-brand-navy">Запитване</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Оставете съобщение и ще се свържем с вас в рамките на работния ден.
          </p>
          <div className="mt-5 space-y-4">
            <input
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-brand-teal"
              placeholder="Име"
            />
            <input
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-brand-teal"
              placeholder="Телефон или имейл"
            />
            <textarea
              rows={5}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-brand-teal"
              placeholder="Съобщение"
            />
            <button
              type="button"
              className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-soft"
            >
              Изпрати
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
