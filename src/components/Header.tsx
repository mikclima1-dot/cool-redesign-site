import { Link } from "@tanstack/react-router";
import { Phone } from "lucide-react";
import logoAsset from "@/assets/mik-clima-logo-official.png.asset.json";

const nav = [
  { to: "/", label: "Начало" },
  { to: "/produkti", label: "Продукти" },
  { to: "/uslugi", label: "Услуги" },
  { to: "/za-nas", label: "За нас" },
  { to: "/kontakti", label: "Контакти" },
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
        <Link to="/" className="flex items-center">
          <img src={logoAsset.url} alt="MIK Clima — Климатизация, вентилация, отопление" className="h-12 w-auto md:h-14" />
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
        <a
          href="tel:+359888000000"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-[1.02]"
        >
          <Phone className="h-4 w-4" />
          <span className="hidden sm:inline">Обади се</span>
        </a>
      </div>
    </header>
  );
}
