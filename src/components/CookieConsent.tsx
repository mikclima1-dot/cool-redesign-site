import { useEffect, useState } from "react";
import { Cookie, X } from "lucide-react";

const STORAGE_KEY = "mikclima_consent_v1";

type Consent = {
  analytics: boolean;
  ads: boolean;
};

type DL = Array<Record<string, unknown>> & { push: (...args: unknown[]) => number };

function getDataLayer(): DL {
  const w = window as unknown as { dataLayer?: DL };
  w.dataLayer = w.dataLayer || ([] as unknown as DL);
  return w.dataLayer;
}

function gtag(...args: unknown[]) {
  const w = window as unknown as { gtag?: (...a: unknown[]) => void };
  if (w.gtag) w.gtag(...args);
  else getDataLayer().push(args);
}

function applyConsent(c: Consent) {
  gtag("consent", "update", {
    ad_storage: c.ads ? "granted" : "denied",
    ad_user_data: c.ads ? "granted" : "denied",
    ad_personalization: c.ads ? "granted" : "denied",
    analytics_storage: c.analytics ? "granted" : "denied",
  });
  getDataLayer().push({
    event: "consent_update",
    consent_analytics: c.analytics ? "granted" : "denied",
    consent_ads: c.ads ? "granted" : "denied",
  });
}

function readStored(): Consent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Consent;
    if (typeof parsed?.analytics !== "boolean") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function openCookieSettings() {
  window.dispatchEvent(new CustomEvent("mikclima:open-cookie-settings"));
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [ads, setAds] = useState(true);

  useEffect(() => {
    const stored = readStored();
    if (stored) {
      applyConsent(stored);
      setAnalytics(stored.analytics);
      setAds(stored.ads);
    } else {
      setVisible(true);
    }
    const open = () => {
      const s = readStored();
      if (s) {
        setAnalytics(s.analytics);
        setAds(s.ads);
      }
      setShowDetails(true);
      setVisible(true);
    };
    window.addEventListener("mikclima:open-cookie-settings", open);
    return () => window.removeEventListener("mikclima:open-cookie-settings", open);
  }, []);

  const save = (c: Consent) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
    applyConsent(c);
    setVisible(false);
    setShowDetails(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] px-3 pb-3 md:px-6 md:pb-6">
      <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-card p-5 shadow-soft">
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 flex-none place-items-center rounded-full bg-brand-sky-soft text-brand-teal">
            <Cookie className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-base font-bold text-brand-navy">Използваме бисквитки</h2>
              <button
                type="button"
                aria-label="Затвори"
                onClick={() => setVisible(false)}
                className="rounded-full p-1 text-muted-foreground hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Използваме бисквитки за коректна работа на сайта, анализ на посещенията и
              маркетинг. Можете да приемете всички, да откажете или да изберете категории.{" "}
              <a href="/politika-za-poveritelnost" className="font-semibold text-brand-teal hover:underline">
                Политика за поверителност
              </a>
            </p>

            {showDetails && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between rounded-xl border border-border/60 px-4 py-3">
                  <div>
                    <div className="text-sm font-semibold text-brand-navy">Необходими</div>
                    <div className="text-xs text-muted-foreground">Винаги активни</div>
                  </div>
                  <input type="checkbox" checked disabled className="h-4 w-4 accent-current" />
                </div>
                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-border/60 px-4 py-3">
                  <div>
                    <div className="text-sm font-semibold text-brand-navy">Аналитични</div>
                    <div className="text-xs text-muted-foreground">Google Analytics статистика</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={(e) => setAnalytics(e.target.checked)}
                    className="h-4 w-4"
                  />
                </label>
                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-border/60 px-4 py-3">
                  <div>
                    <div className="text-sm font-semibold text-brand-navy">Маркетингови</div>
                    <div className="text-xs text-muted-foreground">Реклами и ремаркетинг</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={ads}
                    onChange={(e) => setAds(e.target.checked)}
                    className="h-4 w-4"
                  />
                </label>
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => save({ analytics: true, ads: true })}
                className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-[1.02]"
              >
                Приемам всички
              </button>
              <button
                type="button"
                onClick={() => save({ analytics: false, ads: false })}
                className="rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold text-brand-navy hover:bg-brand-sky-soft"
              >
                Отказвам
              </button>
              {showDetails ? (
                <button
                  type="button"
                  onClick={() => save({ analytics, ads })}
                  className="rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold text-brand-navy hover:bg-brand-sky-soft"
                >
                  Запази избора
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowDetails(true)}
                  className="rounded-full px-5 py-2.5 text-sm font-semibold text-brand-teal hover:underline"
                >
                  Настройки
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
