import { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  Home,
  Loader2,
  Plus,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react";
import type { Product } from "@/data/products";

interface Props {
  outdoorUnitModelName: string;
  maxOutdoorPowerKW: number;
  product: Product;
}

const INDOOR_OPTIONS = [
  { value: "2", label: "07-ца / 20-ка (2 kW)", hint: "За стаи до 15 кв.м" },
  { value: "3", label: "09-ка / 25-ца (3 kW)", hint: "За стаи до 20 кв.м" },
  { value: "4", label: "12-ка / 35-ца (4 kW)", hint: "За стаи до 30 кв.м" },
  { value: "5", label: "18-ка / 50-ца (5 kW)", hint: "За стаи до 40 кв.м" },
  { value: "6", label: "24-ка / 71-ца (6 kW)", hint: "За стаи до 60 кв.м" },
] as const;

const MAX_ROOMS = 5;

interface Room {
  id: number;
  kw: number;
}

export function MultiSplitCompatibilityChecker({
  outdoorUnitModelName,
  maxOutdoorPowerKW,
  product,
}: Props) {
  const [rooms, setRooms] = useState<Room[]>([{ id: 1, kw: 2 }]);
  const nextIdRef = useRef(2);
  const [modalOpen, setModalOpen] = useState(false);

  const totalSelectedKW = rooms.reduce((sum, r) => sum + r.kw, 0);
  const fits = totalSelectedKW <= maxOutdoorPowerKW;
  const ratio = Math.min(1, totalSelectedKW / maxOutdoorPowerKW);

  function addRoom() {
    if (rooms.length >= MAX_ROOMS) return;
    const id = nextIdRef.current++;
    setRooms((prev) => [...prev, { id, kw: 2 }]);
  }

  function removeRoom(id: number) {
    setRooms((prev) => prev.filter((r) => r.id !== id));
  }

  function updateRoom(id: number, kw: number) {
    setRooms((prev) => prev.map((r) => (r.id === id ? { ...r, kw } : r)));
  }

  const combinationSummary = rooms
    .map((r, i) => {
      const opt = INDOOR_OPTIONS.find((o) => Number(o.value) === r.kw);
      return `Стая ${i + 1}: ${opt?.label ?? `${r.kw} kW`}`;
    })
    .join("; ");

  return (
    <div className="rounded-3xl border border-border/60 bg-white p-6 shadow-card md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-brand-navy md:text-2xl">
            Проверете дали това външно тяло е подходящо за вашите стаи
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Добавете стаите си и вижте дали {outdoorUnitModelName} може да ги захрани.
          </p>
        </div>
        <span className="rounded-full bg-brand-sky px-4 py-2 text-sm font-bold text-brand-navy">
          Максимален капацитет: {maxOutdoorPowerKW} kW
        </span>
      </div>

      <div className="mt-6 space-y-3">
        {rooms.map((room, idx) => (
          <div
            key={room.id}
            className="flex items-center gap-3 rounded-2xl border border-border/60 bg-brand-sky-soft/40 p-3"
          >
            <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-white text-brand-teal shadow-card">
              <Home className="h-4 w-4" />
            </span>
            <div className="flex-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-navy">
                Стая {idx + 1}
              </label>
              <select
                value={room.kw}
                onChange={(e) => updateRoom(room.id, Number(e.target.value))}
                className="mt-1 w-full cursor-pointer rounded-xl border border-border bg-white px-3 py-2 text-sm text-brand-navy outline-none focus:border-brand-teal"
              >
                {INDOOR_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label} - {opt.hint}
                  </option>
                ))}
              </select>
            </div>
            {rooms.length > 1 && (
              <button
                type="button"
                onClick={() => removeRoom(room.id)}
                aria-label={`Премахни стая ${idx + 1}`}
                className="grid h-9 w-9 flex-none cursor-pointer place-items-center rounded-full text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addRoom}
        disabled={rooms.length >= MAX_ROOMS}
        className="mt-4 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-dashed border-brand-teal/50 px-5 py-3 text-sm font-semibold text-brand-teal transition-colors hover:border-brand-teal hover:bg-brand-sky-soft/60 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Plus className="h-4 w-4" /> Добави стая
        {rooms.length >= MAX_ROOMS && (
          <span className="text-xs font-normal">(максимум {MAX_ROOMS})</span>
        )}
      </button>

      <div className="mt-6">
        <div className="flex items-baseline justify-between text-sm">
          <span className="font-semibold text-brand-navy">
            Избрана мощност: {totalSelectedKW} kW
          </span>
          <span className="text-muted-foreground">от {maxOutdoorPowerKW} kW</span>
        </div>
        <div className="mt-2 h-3 overflow-hidden rounded-full bg-brand-sky-soft">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              fits ? "bg-brand-teal" : "bg-orange-500"
            }`}
            style={{ width: `${Math.max(ratio * 100, 4)}%` }}
          />
        </div>
      </div>

      {fits ? (
        <div className="mt-6 rounded-2xl border border-brand-teal/40 bg-brand-teal/10 p-5">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-6 w-6 flex-none text-brand-teal" />
            <div className="flex-1">
              <p className="font-semibold text-brand-navy">
                Отличен избор! Това външно тяло {outdoorUnitModelName} може да захрани избраните от
                вас стаи.
              </p>
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="mt-4 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:-translate-y-0.5 sm:w-auto"
              >
                Заяви оферта за тази комбинация
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-orange-300 bg-orange-50 p-5">
          <div className="flex items-start gap-3">
            <TriangleAlert className="mt-0.5 h-6 w-6 flex-none text-orange-500" />
            <div className="flex-1">
              <p className="font-semibold text-brand-navy">
                Избраните вътрешни тела изискват {totalSelectedKW} kW, а това външно тяло осигурява
                до {maxOutdoorPowerKW} kW.
              </p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <a
                  href="/produkti?cat=multi"
                  className="inline-flex items-center justify-center rounded-full bg-brand-navy px-6 py-3 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5"
                >
                  Вижте по-мощни външни тела
                </a>
                <span className="inline-flex items-center justify-center rounded-full border border-orange-300 bg-white px-6 py-3 text-sm font-semibold text-orange-600">
                  Или намалете мощността на стаите
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <CombinationOfferDialog
        product={product}
        outdoorUnitModelName={outdoorUnitModelName}
        combinationSummary={combinationSummary}
        totalSelectedKW={totalSelectedKW}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}

interface DialogProps {
  product: Product;
  outdoorUnitModelName: string;
  combinationSummary: string;
  totalSelectedKW: number;
  open: boolean;
  onClose: () => void;
}

type Errors = { name?: string; phone?: string; email?: string };

function CombinationOfferDialog({
  product,
  outdoorUnitModelName,
  combinationSummary,
  totalSelectedKW,
  open,
  onClose,
}: DialogProps) {
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
            title: `Мултисистема: ${outdoorUnitModelName} - ${combinationSummary} (общо ${totalSelectedKW} kW)`,
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
        window.dataLayer.push({
          event: "multisplit_offer_request",
          outdoor_unit: outdoorUnitModelName,
          combination: combinationSummary,
          total_kw: totalSelectedKW,
        });
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
        aria-label="Заявка за оферта за мултисистема"
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
              Получихме Вашата заявка за тази комбинация. Ще Ви изпратим оферта възможно най-скоро.
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
            <h2 className="pr-10 text-xl font-bold text-brand-navy">Заявка за оферта</h2>

            <div className="mt-4 rounded-2xl bg-brand-sky-soft/60 p-4 text-sm">
              <p className="font-semibold text-brand-navy">{outdoorUnitModelName}</p>
              <ul className="mt-2 space-y-1 text-muted-foreground">
                {combinationSummary.split("; ").map((line) => (
                  <li key={line}>• {line}</li>
                ))}
              </ul>
              <p className="mt-2 text-xs font-semibold text-brand-teal">
                Общо: {totalSelectedKW} kW вътрешни тела
              </p>
            </div>

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
                {status === "sending" ? "Изпращане..." : "Изпрати заявка"}
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
