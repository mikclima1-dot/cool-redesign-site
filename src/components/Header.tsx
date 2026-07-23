import { Link } from "@tanstack/react-router";
import { Phone, Menu, X } from "lucide-react";
import { useState } from "react";


const nav = [
  { to: "/", label: "Начало" },
  { to: "/produkti", label: "Продукти" },
  { to: "/uslugi", label: "Услуги" },
  { to: "/kalkulator", label: "Калкулатор" },
  { to: "/za-nas", label: "За нас" },
  { to: "/kontakti", label: "Контакти" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 md:px-8">
        <Link to="/" className="flex items-center" onClick={() => setOpen(false)}>
          <img src="/logo.png" alt="MIK Clima - Климатизация, вентилация, отопление" className="h-16 w-auto md:h-20" />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded-full px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-brand-sky-soft hover:text-brand-navy [&.active]:bg-brand-sky [&.active]:text-brand-navy"
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="tel:+359897203732"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-[1.02]"
          >
            <Phone className="h-4 w-4" />
            <span>Обади се</span>
          </a>
          <button
            type="button"
            aria-label={open ? "Затвори менюто" : "Отвори менюто"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full border border-border bg-background text-brand-navy md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border/60 bg-background md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col px-4 py-2">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-right text-base font-medium text-foreground/80 hover:bg-brand-sky-soft hover:text-brand-navy [&.active]:bg-brand-sky [&.active]:text-brand-navy"
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
