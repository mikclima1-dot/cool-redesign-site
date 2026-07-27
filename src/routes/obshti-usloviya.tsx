import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/obshti-usloviya")({
  head: () => ({
    meta: [
      { title: "Общи условия - MIK Clima" },
      {
        name: "description",
        content:
          "Общи условия за ползване на сайта и услугите на MIK Clima. Информация за поръчки, доставка, монтаж, гаранции и плащания.",
      },
      {
        name: "keywords",
        content:
          "общи условия, условия за ползване, MIK Clima, поръчка климатик, доставка, монтаж, гаранция",
      },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Общи условия - MIK Clima" },
      { property: "og:description", content: "Условия за ползване на сайта и услугите на MIK Clima." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.mikclima.com/obshti-usloviya" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Общи условия - MIK Clima" },
      { name: "twitter:description", content: "Условия за ползване на сайта и услугите на MIK Clima." },
    ],
    links: [
      { rel: "canonical", href: "https://www.mikclima.com/obshti-usloviya" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Общи условия",
          url: "https://www.mikclima.com/obshti-usloviya",
          isPartOf: { "@id": "https://www.mikclima.com" },
        }),
      },
    ],
  }),
  component: Terms,
});

function Terms() {
  return (
    <article className="mx-auto max-w-4xl px-4 py-16 md:px-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-brand-teal">
        Правна информация
      </p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-brand-navy md:text-5xl">
        Общи условия
      </h1>
      <p className="mt-4 text-sm text-muted-foreground">
        Тази страница се поддържа от MIK Clima и представлява приложимо към момента описание на
        условията за ползване на сайта и услугите. Информацията не е независим правен сертификат.
        При нужда от специфични договорни условия, свържете се директно с нас.
      </p>

      <section className="mt-10">
        <h2 className="text-2xl font-bold text-brand-navy">1. Общи разпоредби</h2>
        <p className="mt-3 text-muted-foreground">
          Настоящите общи условия уреждат отношенията между MIK Clima и потребителите на сайта
          www.mikclima.com. С достъпа си до сайта или с подаването на запитване, приемате описаните
          условия. Ако не сте съгласни, моля не използвайте сайта.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-bold text-brand-navy">2. Описание на услугите</h2>
        <p className="mt-3 text-muted-foreground">
          MIK Clima предлага доставка, монтаж, демонтаж и профилактика на климатични системи за
          дома и офиса. Информацията за продуктите, цените и наличностите се обновява редовно, но
          е възможно технически несъответствия. При такива случаи се свързваме с вас, за да
          потвърдим детайлите.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-bold text-brand-navy">3. Поръчки и оферти</h2>
        <p className="mt-3 text-muted-foreground">
          Публикуваните цени са крайни за съответния продукт без монтаж, освен ако изрично не е
          посочено друго. Монтажът се договаря отделно и се калкулира спрямо мощността на избрания
          климатик. Заявките през сайта не са задължителна поръчка, а запитване, което потвърждаваме
          по телефон или имейл.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-bold text-brand-navy">4. Доставка и монтаж</h2>
        <p className="mt-3 text-muted-foreground">
          Доставката и монтажът се извършват на територията на България, освен ако не е договорено
          друго. Срокът за доставка зависи от наличността и локацията. Монтажът се извършва от
          квалифициран екип на уговорена дата и час. Клиентът е отговорен за осигуряване на достъп
          до мястото за монтаж и необходимите електрически захранвания.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-bold text-brand-navy">5. Плащания</h2>
        <p className="mt-3 text-muted-foreground">
          Плащането се извършва по договорен между страните начин - в брой при доставка, по
          банков път или с наложен платеж. До пълното погасяване на дължимата сума продуктите
          остават собственост на MIK Clima, освен ако не е уговорено друго.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-bold text-brand-navy">6. Гаранция и рекламации</h2>
        <p className="mt-3 text-muted-foreground">
          Продуктите се предоставят с производствена гаранция съгласно условията на съответния
          производител. Монтажните дейности се покриват от гаранция за извършената работа. При
          установен дефект или несъответствие, клиентът следва да уведоми MIK Clima в разумен срок,
          за да организираме оглед и отстраняване.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-bold text-brand-navy">7. Отговорност</h2>
        <p className="mt-3 text-muted-foreground">
          MIK Clima полага грижи за точността на информацията в сайта, но не носи отговорност за
          преки или косвени щети, причинени от неправилно използване на продуктите, забава, която не
          зависи от нас, или от действия на трети страни. Отговорността ни е ограничена до стойността
          на доставените продукти или извършените услуги.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-bold text-brand-navy">8. Интелектуална собственост</h2>
        <p className="mt-3 text-muted-foreground">
          Съдържанието на сайта - текстове, изображения, лога, марки и технически описания - е
          собственост на MIK Clima или на съответните производители и е защитено от законите за
          авторско право и индустриална собственост. Копирането и разпространението му без изрично
          разрешение са забранени.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-bold text-brand-navy">9. Промени в общите условия</h2>
        <p className="mt-3 text-muted-foreground">
          Запазваме си правото да променяме настоящите условия по всяко време. Промените влизат в
          сила от публикуването им в сайта. Продължаващото използване на сайта след промяна означава
          приемането им.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-bold text-brand-navy">10. Контакт</h2>
        <p className="mt-3 text-muted-foreground">
          За въпроси, свързани с общите условия, можете да се свържете с нас на:
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
