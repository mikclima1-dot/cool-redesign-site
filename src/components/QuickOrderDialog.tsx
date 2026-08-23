import { useEffect, useRef, useState } from "react";
import { X, Loader2, CheckCircle2 } from "lucide-react";
import type { Product } from "@/data/products";
import { CATEGORY_TYPE } from "@/data/products";

interface Props {
  product: Product;
  open: boolean;
  onClose: () => void;
}

type Errors = { name?: string; phone?: string; email?: string };

export function QuickOrderDialog({ product, open, onClose }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    firstFieldRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const modelName = `${CATEGORY_TYPE[product.category]} ${product.brand} ${product.model}`;

  function validate(): Errors {
    const next: Errors = {};
    if (name.trim().length < 2) next.name = "Моля, въведете вашето име.";
    const digits = phone.replace(/\D/g, "");
    if (!/^[+0-9\s()-]{6,40}$/.test(phone.trim()) || digits.length < 6)
      next.phone = "Моля, въведете валиден телефонен номер.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim()))
      next.email = "Моля, въведете валиден имейл адрес.";
    return next;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/public/quick-order", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          product: {
            title: product.fullName || modelName,
            brand: product.brand,
            model: product.model,
            price: `${product.priceEur} €`,
            url:
              typeof window !== "undefined"
                ? window.location.href
                : `https://www.mikclima.com/produkti/${product.slug}`,
          },
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.ok !== true) throw new Error(json?.error || `HTTP ${res.status}`);
      if (typeof window !== "undefined") {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: "quick_order_submit" });
      }
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Неуспешно изпращане");
    }
  }

  const inputClass = (hasError?: string) =>
    `w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-colors ${
      hasError ? "border-red-500" : "border-border focus:border-brand-teal"
    }`;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-brand-navy/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Бърза поръчка"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-t-2xl border border-border/60 bg-card p-6 shadow-soft sm:rounded-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Затвори"
          className="absolute right-4 top-4 grid h-9 w-9 cursor-pointer place-items-center rounded-full text-muted-foreground transition-colors hover:bg-brand-sky-soft hover:text-brand-navy"
        >
          <X className="h-5 w-5" />
        </button>

        {status === "sent" ? (
          <div className="py-6 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-brand-teal" />
            <h2 className="mt-4 text-xl font-bold text-brand-navy">Благодарим Ви!</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Получихме Вашата заявка за този модел. Наш представител ще се свърже с Вас за
              потвърждение.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 w-full cursor-pointer rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-soft"
            >
              Затвори
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <h2 className="pr-10 text-xl font-bold text-brand-navy">Бърза поръчка</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Изпратете ни данните си и ще се свържем с Вас за потвърждение на поръчката за{" "}
              <span className="font-semibold text-brand-navy">{modelName}</span>.
            </p>

            <div className="mt-5 space-y-3">
              <div>
                <input
                  ref={firstFieldRef}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass(errors.name)}
                  placeholder="Име *"
                  autoComplete="name"
                  maxLength={120}
                />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
              </div>
              <div>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="tel"
                  inputMode="tel"
                  className={inputClass(errors.phone)}
                  placeholder="Телефон *"
                  autoComplete="tel"
                  maxLength={40}
                />
                {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
              </div>
              <div>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className={inputClass(errors.email)}
                  placeholder="Имейл *"
                  autoComplete="email"
                  maxLength={200}
                />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:-translate-y-0.5 disabled:opacity-60"
              >
                {status === "sending" && <Loader2 className="h-4 w-4 animate-spin" />}
                {status === "sending" ? "Изпращане..." : "Изпрати поръчка"}
              </button>

              {status === "error" && (
                <p className="text-center text-xs font-medium text-red-600">
                  Възникна грешка: {errorMsg}. Моля, опитайте отново или се обадете.
                </p>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
