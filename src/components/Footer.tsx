import { Link } from "@tanstack/react-router";
import { Mail, Clock, MapPin } from "lucide-react";

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
