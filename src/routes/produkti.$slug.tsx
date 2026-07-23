import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check, Phone } from "lucide-react";
import { CATEGORY_LABEL, CATEGORY_TYPE, products, type Product } from "@/data/products";

export const Route = createFileRoute("/produkti/$slug")({
  loader: ({ params }): { product: Product } => {
    const product = products.find((p) => p.slug === params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Продукт не е намерен | MIK Clima" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { product } = loaderData;
    const title = `${CATEGORY_TYPE[product.category]} ${product.brand} ${product.model} - ${product.btu.toLocaleString("bg-BG")} BTU, клас ${product.energyClass} | MIK Clima`;
    const description = `${product.brand} ${product.model} - ${CATEGORY_LABEL[product.category]} климатик ${product.btu.toLocaleString("bg-BG")} BTU, енергиен клас ${product.energyClass}. ${product.shortDescription} Цена ${product.priceEur} € / ${product.priceBgn.toFixed(2)} лв. Доставка и монтаж в цялата страна.`;
    const url = `https://www.mikclima.com/produkti/${params.slug}`;
    const productLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.fullName,
      description,
      brand: { "@type": "Brand", name: product.brand },
      sku: product.slug,
      image: product.image,
      offers: {
        "@type": "Offer",
        priceCurrency: "BGN",
        price: product.priceBgn.toFixed(2),
        availability: "https://schema.org/InStock",
        url,
      },
      additionalProperty: [
        { "@type": "PropertyValue", name: "BTU", value: String(product.btu) },
        { "@type": "PropertyValue", name: "Енергиен клас", value: product.energyClass },
        { "@type": "PropertyValue", name: "Категория", value: CATEGORY_LABEL[product.category] },
        { "@type": "PropertyValue", name: "Модел", value: product.model },
      ],
    };
    const breadcrumbLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Начало", item: "/" },
        { "@type": "ListItem", position: 2, name: "Продукти", item: "/produkti" },
        { "@type": "ListItem", position: 3, name: CATEGORY_LABEL[product.category], item: `/produkti?cat=${product.category}` },
        { "@type": "ListItem", position: 4, name: product.model, item: url },
      ],
    };
    const faqLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: buildFaqs(product).map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    };
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: product.image },
        { property: "og:type", content: "product" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: product.image },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(productLd) },
        { type: "application/ld+json", children: JSON.stringify(breadcrumbLd) },
        { type: "application/ld+json", children: JSON.stringify(faqLd) },
      ],
    };
  },
  component: ProductDetail,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-3xl font-bold text-brand-navy">Продуктът не е намерен</h1>
      <Link to="/produkti" className="mt-4 inline-block text-brand-teal hover:underline">
        Обратно към каталога
      </Link>
    </div>
  ),
});

function buildFaqs(product: Product) {
  const cat = CATEGORY_LABEL[product.category].toLowerCase();
  return [
    {
      q: `Каква площ обслужва ${product.brand} ${product.model}?`,
      a: `Модел ${product.model} е с мощност ${product.btu.toLocaleString("bg-BG")} BTU и е подходящ за помещения с площ около ${Math.round(product.btu / 550)}-${Math.round(product.btu / 400)} м², в зависимост от изолацията и височината на тавана.`,
    },
    {
      q: `Какъв е енергийният клас на ${product.model}?`,
      a: `${product.brand} ${product.model} е с енергиен клас ${product.energyClass}, което гарантира ниска консумация на електроенергия и по-ниски сметки при ежедневна употреба.`,
    },
    {
      q: `Включва ли цената монтаж?`,
      a: `Цената от ${product.priceEur} € (${product.priceBgn.toFixed(2)} лв.) е за самия климатик. За стандартен монтаж и допълнителни услуги се свържете с нас на +359 897 203 732 за индивидуална оферта.`,
    },
    {
      q: `Какъв тип е ${product.model}?`,
      a: `Това е ${cat} климатик от марката ${product.brand}. ${product.shortDescription}`,
    },
    {
      q: `Каква е гаранцията?`,
      a: `Всички климатици, които предлагаме, идват с официална производствена гаранция и възможност за абонаментна поддръжка от MIK Clima.`,
    },
  ];
}

function ProductDetail() {
  const { product } = Route.useLoaderData() as { product: Product };


  const related = products
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 4);

  return (
    <>
      <section style={{ background: "var(--gradient-hero)" }}>
        <div className="mx-auto max-w-7xl px-4 pt-8 md:px-8">
          <Link
            to="/produkti"
            className="inline-flex items-center gap-1 text-sm text-brand-navy/70 hover:text-brand-navy"
          >
            <ArrowLeft className="h-4 w-4" /> Обратно към каталога
          </Link>
        </div>
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 md:grid-cols-2 md:gap-16 md:px-8 md:py-14">
          <div className="rounded-3xl bg-white p-8 shadow-card">
            <img
              src={product.image}
              alt={product.model}
              className="mx-auto aspect-square w-full object-contain"
            />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                to="/produkti"
                search={{ cat: product.category }}
                className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-navy backdrop-blur"
              >
                {CATEGORY_LABEL[product.category]}
              </Link>
              <span className="rounded-full bg-brand-teal px-3 py-1 text-xs font-bold text-white">
                Клас {product.energyClass}
              </span>
              <span className="rounded-full border border-brand-navy/20 px-3 py-1 text-xs font-semibold text-brand-navy">
                {product.btu.toLocaleString("bg-BG")} BTU
              </span>
            </div>
            <p className="mt-4 text-sm font-semibold uppercase tracking-widest text-brand-teal">
              {product.brand}
            </p>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-brand-navy md:text-5xl">
              {CATEGORY_TYPE[product.category]} {product.brand} {product.model}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">{product.shortDescription}</p>

            <div className="mt-8 flex items-end gap-4 rounded-2xl border border-border/60 bg-white p-5">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Цена</div>
                <div className="text-3xl font-extrabold text-brand-navy">{product.priceEur} €</div>
                <div className="text-sm text-muted-foreground">
                  {product.priceBgn.toLocaleString("bg-BG", { minimumFractionDigits: 2 })} лв.
                </div>
              </div>
              <a
                href="tel:+359897203732"
                className="ml-auto inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft"
              >
                <Phone className="h-4 w-4" /> Обади се
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-brand-navy">Описание</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">{product.description}</p>
            <div className="mt-6 rounded-2xl bg-brand-sky-soft/70 p-5 text-sm text-brand-navy/80">
              <span className="font-semibold text-brand-navy">Пълно наименование: </span>
              {product.fullName}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-brand-navy">Ключови функции</h2>
            <ul className="mt-4 space-y-3">
              {product.features.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full bg-brand-sky text-brand-navy">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-sm text-foreground/90">{f}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-2xl border border-border/60 bg-card p-5">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-navy">
                Спецификации
              </h3>
              <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <dt className="text-muted-foreground">Марка</dt>
                <dd className="font-medium text-brand-navy">{product.brand}</dd>
                <dt className="text-muted-foreground">Модел</dt>
                <dd className="font-medium text-brand-navy">{product.model}</dd>
                <dt className="text-muted-foreground">Мощност</dt>
                <dd className="font-medium text-brand-navy">
                  {product.btu.toLocaleString("bg-BG")} BTU
                </dd>
                <dt className="text-muted-foreground">Енергиен клас</dt>
                <dd className="font-medium text-brand-navy">{product.energyClass}</dd>
                <dt className="text-muted-foreground">Категория</dt>
                <dd className="font-medium text-brand-navy">{CATEGORY_LABEL[product.category]}</dd>
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-16 md:px-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-brand-navy">Често задавани въпроси</h2>
        <div className="mt-6 space-y-3">
          {buildFaqs(product).map((f) => (
            <details
              key={f.q}
              className="group rounded-2xl border border-border/60 bg-card p-5 shadow-card open:shadow-soft"
            >
              <summary className="cursor-pointer list-none text-base font-semibold text-brand-navy marker:hidden">
                <span className="mr-2 text-brand-teal group-open:hidden">+</span>
                <span className="mr-2 hidden text-brand-teal group-open:inline">-</span>
                {f.q}
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>


      {related.length > 0 && (
        <section className="bg-brand-sky-soft/40 py-16">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <h2 className="text-2xl font-extrabold tracking-tight text-brand-navy">
              Подобни модели
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <RelatedCard key={p.slug} slug={p.slug} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function RelatedCard({ slug }: { slug: string }) {
  const p = products.find((x) => x.slug === slug)!;
  return (
    <Link
      to="/produkti/$slug"
      params={{ slug: p.slug }}
      className="group rounded-2xl border border-border/60 bg-card p-4 shadow-card transition-all hover:-translate-y-1 hover:shadow-soft"
    >
      <div className="rounded-xl bg-white p-3">
        <img
          src={p.image}
          alt={p.model}
          loading="lazy"
          className="mx-auto aspect-[4/3] w-full object-contain"
        />
      </div>
      <div className="mt-3">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{p.brand}</p>
        <p className="mt-1 font-semibold text-brand-navy">{p.model}</p>
        <p className="mt-2 text-sm font-bold text-brand-teal">{p.priceEur} €</p>
      </div>
    </Link>
  );
}
