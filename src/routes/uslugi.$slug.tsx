import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  Wrench,
  ShieldCheck,
  Truck,
  ClipboardCheck,
  Eye,
  ArrowRight,
  Check,
  Phone,
} from "lucide-react";
import { getService, services } from "@/data/services";

const icons = {
  wrench: Wrench,
  shield: ShieldCheck,
  truck: Truck,
  clipboard: ClipboardCheck,
  eye: Eye,
} as const;

export const Route = createFileRoute("/uslugi/$slug")({
  loader: ({ params }) => {
    const service = getService(params.slug);
    if (!service) throw notFound();
    return { service };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Услугата не е намерена | MIK Clima" }, { name: "robots", content: "noindex" }] };
    }
    const s = loaderData.service;
    const url = `https://www.mikclima.com/uslugi/${params.slug}`;
    return {
      meta: [
        { title: s.metaTitle },
        { name: "description", content: s.metaDescription },
        { name: "keywords", content: s.keywords },
        { property: "og:title", content: s.metaTitle },
        { property: "og:description", content: s.metaDescription },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: s.metaTitle },
        { name: "twitter:description", content: s.metaDescription },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Service",
                name: s.h1,
                serviceType: s.title,
                description: s.summary,
                url,
                areaServed: { "@type": "Country", name: "България" },
                provider: {
                  "@type": "LocalBusiness",
                  name: "MIK Clima",
                  url: "https://www.mikclima.com",
                  telephone: "+359897203732",
                  email: "info@mikclima.com",
                },
                offers: {
                  "@type": "Offer",
                  price: s.priceValue,
                  priceCurrency: "EUR",
                  url,
                  availability: "https://schema.org/InStock",
                },
              },
              {
                "@type": "FAQPage",
                mainEntity: s.faq.map((f) => ({
                  "@type": "Question",
                  name: f.q,
                  acceptedAnswer: { "@type": "Answer", text: f.a },
                })),
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Начало", item: "https://www.mikclima.com/" },
                  { "@type": "ListItem", position: 2, name: "Услуги", item: "https://www.mikclima.com/uslugi" },
                  { "@type": "ListItem", position: 3, name: s.title, item: url },
                ],
              },
            ],
          }),
        },
      ],
    };
  },
  notFoundComponent: ServiceNotFound,
  component: ServicePage,
});

function ServiceNotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-3xl font-extrabold text-brand-navy">Услугата не е намерена</h1>
      <Link to="/uslugi" className="mt-6 inline-block font-semibold text-brand-teal">
        Виж всички услуги
      </Link>
    </div>
  );
}

function ServicePage() {
  const { service: s } = Route.useLoaderData();
  const Icon = icons[s.icon];
  const others = services.filter((o) => o.slug !== s.slug);

  return (
    <>
      <section style={{ background: "var(--gradient-hero)" }}>
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
          <nav aria-label="Пътека" className="text-sm text-muted-foreground">
            <Link to="/" className="hover:text-brand-navy">Начало</Link>
            <span className="px-2">/</span>
            <Link to="/uslugi" className="hover:text-brand-navy">Услуги</Link>
            <span className="px-2">/</span>
            <span className="text-brand-navy">{s.title}</span>
          </nav>
          <div className="mt-6 flex items-start gap-4">
            <div className="grid h-14 w-14 flex-none place-items-center rounded-full bg-white text-brand-teal shadow-soft">
              <Icon className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-brand-navy md:text-5xl">
                {s.h1}
              </h1>
              <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{s.desc}</p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-brand-navy px-4 py-2 text-sm font-bold text-white">
                  Цена: {s.price}
                </span>
                <a
                  href="tel:+359897203732"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-[1.02]"
                >
                  <Phone className="h-4 w-4" /> Обади се
                </a>
                <Link
                  to="/kontakti"
                  className="inline-flex items-center gap-2 rounded-full border border-brand-navy/20 bg-white px-5 py-2.5 text-sm font-semibold text-brand-navy transition-transform hover:scale-[1.02]"
                >
                  Изпрати запитване <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-8">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
              <h2 className="text-xl font-bold text-brand-navy">Накратко</h2>
              <p className="mt-2 text-foreground/80">{s.summary}</p>
            </div>

            <p className="mt-8 text-muted-foreground">{s.intro}</p>

            <h2 className="mt-10 text-2xl font-bold text-brand-navy">Какво включва услугата</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {s.points.map((p) => (
                <li key={p} className="flex items-start gap-2 rounded-xl border border-border/60 bg-card p-4 text-sm">
                  <Check className="mt-0.5 h-4 w-4 flex-none text-brand-teal" />
                  <span className="text-foreground/80">{p}</span>
                </li>
              ))}
            </ul>

            <h2 className="mt-10 text-2xl font-bold text-brand-navy">Как протича</h2>
            <ol className="mt-4 space-y-4">
              {s.steps.map((st, i) => (
                <li key={st.title} className="flex gap-4 rounded-xl border border-border/60 bg-card p-4">
                  <span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-brand-sky text-sm font-bold text-brand-navy">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-brand-navy">{st.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{st.text}</p>
                  </div>
                </li>
              ))}
            </ol>

            <h2 className="mt-10 text-2xl font-bold text-brand-navy">Често задавани въпроси</h2>
            <div className="mt-4 space-y-3">
              {s.faq.map((f) => (
                <details key={f.q} className="rounded-xl border border-border/60 bg-card p-4">
                  <summary className="cursor-pointer font-semibold text-brand-navy">{f.q}</summary>
                  <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
                </details>
              ))}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
              <h2 className="text-lg font-bold text-brand-navy">Основна информация</h2>
              <dl className="mt-4 divide-y divide-border/60 text-sm">
                {s.facts.map((f) => (
                  <div key={f.label} className="flex items-center justify-between py-2">
                    <dt className="text-muted-foreground">{f.label}</dt>
                    <dd className="font-semibold text-brand-navy">{f.value}</dd>
                  </div>
                ))}
              </dl>
              <a
                href="tel:+359897203732"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft"
              >
                <Phone className="h-4 w-4" /> Обади се
              </a>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
              <h2 className="text-lg font-bold text-brand-navy">Други услуги</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {others.map((o) => (
                  <li key={o.slug}>
                    <Link
                      to="/uslugi/$slug"
                      params={{ slug: o.slug }}
                      className="flex items-center justify-between gap-2 text-foreground/80 hover:text-brand-navy"
                    >
                      <span>{o.title}</span>
                      <span className="text-xs font-semibold text-brand-teal">{o.price}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
