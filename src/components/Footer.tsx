import { Link } from "@tanstack/react-router";
import { Mail, Clock, MapPin, Phone, Facebook, Instagram } from "lucide-react";
import { BrandStrip } from "@/components/BrandStrip";

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
          <div className="mt-6 flex items-center gap-4">
            <a
              href="https://www.facebook.com/share/18u6XAvFDn"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="MIK Clima във Facebook"
              className="grid h-12 w-12 place-items-center rounded-full text-white shadow-soft transition-transform hover:scale-110"
              style={{ backgroundColor: "#1877F2" }}
            >
              <Facebook className="h-6 w-6" />
            </a>
            <a
              href="https://www.instagram.com/mik_clima/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="MIK Clima в Instagram"
              className="grid h-12 w-12 place-items-center rounded-full text-white shadow-soft transition-transform hover:scale-110"
              style={{ background: "linear-gradient(45deg, #F58529, #DD2A7B, #8134AF, #515BD4)" }}
            >
              <Instagram className="h-6 w-6" />
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
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <a href="tel:+359897203732" className="hover:text-brand-navy">+359 897 203 732</a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <a href="tel:+359877918761" className="hover:text-brand-navy">+359 877 918 761</a>
            </li>
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
