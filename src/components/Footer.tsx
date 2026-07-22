import { Link } from "@tanstack/react-router";
import { Mail, Clock, MapPin, Facebook, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border/60 bg-brand-sky-soft/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4 md:px-8">
        <div className="md:col-span-2">
          <div className="text-xl font-bold tracking-tight text-brand-navy">
            MIK <span className="text-brand-teal">CLIMA</span>
          </div>
          <p className="mt-3 max-w-md text-sm text-muted-foreground">
            Качествени климатици за вашия дом и офис. Над 17 години опит в доставка, монтаж и
            профилактика на климатични системи.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <a
              href="https://www.facebook.com/share/18u6XAvFDn"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="MIK Clima във Facebook"
              className="grid h-10 w-10 place-items-center rounded-full bg-brand-navy text-white transition-transform hover:scale-110 hover:bg-brand-teal"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a
              href="https://www.instagram.com/mik_clima/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="MIK Clima в Instagram"
              className="grid h-10 w-10 place-items-center rounded-full bg-brand-navy text-white transition-transform hover:scale-110 hover:bg-brand-teal"
            >
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-brand-navy">Навигация</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/produkti" className="hover:text-brand-navy">Продукти</Link></li>
            <li><Link to="/uslugi" className="hover:text-brand-navy">Услуги</Link></li>
            <li><Link to="/za-nas" className="hover:text-brand-navy">За нас</Link></li>
            <li><Link to="/kontakti" className="hover:text-brand-navy">Контакти</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-brand-navy">Контакти</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> info@mikclima.com</li>
            <li className="flex items-center gap-2"><Clock className="h-4 w-4" /> Пон–Пет 09:00–18:00</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> България</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} MIK Clima. Всички права запазени.
      </div>
    </footer>
  );
}
