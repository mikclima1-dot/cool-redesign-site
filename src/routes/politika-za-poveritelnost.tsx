import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/politika-za-poveritelnost")({
  head: () => ({
    meta: [
      { title: "Политика за поверителност - MIK Clima" },
      {
        name: "description",
        content:
          "Политика за поверителност на MIK Clima. Научете какви лични данни събираме, как ги използваме и какви са вашите права.",
      },
      {
        name: "keywords",
        content:
          "политика за поверителност, лични данни, GDPR, бисквитки, MIK Clima, поверителност",
      },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Политика за поверителност - MIK Clima" },
      { property: "og:description", content: "Как събираме, обработваме и защитаваме личните ви данни." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.mikclima.com/politika-za-poveritelnost" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Политика за поверителност - MIK Clima" },
      { name: "twitter:description", content: "Как събираме, обработваме и защитаваме личните ви данни." },
    ],
    links: [
      { rel: "canonical", href: "https://www.mikclima.com/politika-za-poveritelnost" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Политика за поверителност",
          url: "https://www.mikclima.com/politika-za-poveritelnost",
          isPartOf: { "@id": "https://www.mikclima.com" },
        }),
      },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <article className="mx-auto max-w-4xl px-4 py-16 md:px-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-brand-teal">
        Правна информация
      </p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-brand-navy md:text-5xl">
        Политика за поверителност
      </h1>
      <p className="mt-4 text-sm text-muted-foreground">
        Тази страница се поддържа от MIK Clima с цел да отговори на често задавани въпроси за
        поверителността и сигурността при използването на сайта. Тя описва практиките на сайта, а
        не представлява независима правна проверка или сертификат.
      </p>

      <section className="mt-10">
        <h2 className="text-2xl font-bold text-brand-navy">1. Кои сме ние</h2>
        <p className="mt-3 text-muted-foreground">
          Сайтът www.mikclima.com се управлява от MIK Clima. Можете да се свържете с нас на
          електронна поща info@mikclima.com или на телефон +359 897 203 732.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-bold text-brand-navy">2. Какви данни събираме</h2>
        <p className="mt-3 text-muted-foreground">
          Събираме само информация, необходима за предоставянето на услугите ни:
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">
          <li>Име, телефон и имейл, които предоставяте чрез формите за запитване.</li>
          <li>Технически данни за устройството и браузъра, необходими за коректна работа на сайта.</li>
          <li>Информация за взаимодействието със страниците - например кои продукти разглеждате.</li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-bold text-brand-navy">3. За какво използваме данните</h2>
        <p className="mt-3 text-muted-foreground">Използваме събраната информация, за да:</p>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">
          <li>Отговорим на запитвания и организираме оглед, монтаж или сервиз.</li>
          <li>Обработваме поръчки и издадем необходимите документи.</li>
          <li>Подобрим работата на сайта и клиентското обслужване.</li>
        </ul>
        <p className="mt-3 text-muted-foreground">
          Не продаваме лични данни на трети страни и не ги използваме за несъвместими с тези цели.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-bold text-brand-navy">4. Бисквитки и анализи</h2>
        <p className="mt-3 text-muted-foreground">
          Сайтът използва бисквитки, за да функционира коректно и да ни помогне да разберем как
          посетителите го използват. Чрез настройките на браузъра можете да ограничите или изтриете
          бисквитки по всяко време. За анализ на трафика и маркетингови цели можем да използваме
          утвърдени външни услуги, които обработват данни от наше име.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-bold text-brand-navy">5. Споделяне с трети страни</h2>
        <p className="mt-3 text-muted-foreground">
          Споделяме лични данни само с партньори, без които не можем да изпълним услугата - например
          куриери за доставка, сервизни техници или платформи за обработка на плащания. Всеки такъв
          партньор е длъжен да пази данните поверително и да ги използва само за уговорените цели.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-bold text-brand-navy">6. Съхранение и сигурност</h2>
        <p className="mt-3 text-muted-foreground">
          Пазим данните за срок, необходим за изпълнение на договорните и законовите задължения, след
          което ги изтриваме или анонимизираме. Прилагаме подходящи технически и организационни мерки,
          за да защитим информацията от нерегламентиран достъп, загуба или промяна.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-bold text-brand-navy">7. Вашите права</h2>
        <p className="mt-3 text-muted-foreground">
          Имате право да поискате достъп, корекция или изтриване на личните си данни, както и да
          ограничите или възразите срещу тяхната обработка. За въпроси свързани с данните, моля
          пишете ни на info@mikclima.com.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-bold text-brand-navy">8. Промени в политиката</h2>
        <p className="mt-3 text-muted-foreground">
          Можем да актуализираме настоящата политика при промяна на законодателството или на
          практиките на сайта. Публикуваната дата на последна промяна е в края на страницата.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-bold text-brand-navy">9. Контакт</h2>
        <p className="mt-3 text-muted-foreground">
          Ако имате въпроси относно поверителността, свържете се с нас на:
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">
          <li>Имейл: info@mikclima.com</li>
          <li>Телефон: +359 897 203 732</li>
          <li>Адрес: България</li>
        </ul>
      </section>

      <p className="mt-12 text-sm text-muted-foreground">
        Последна актуализация: {new Date().getFullYear()} г.
      </p>
    </article>
  );
}
