import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Check,
  CheckCircle2,
  ChevronDown,
  Loader2,
  Plus,
  Search,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react";
import type { Product } from "@/data/products";
import { productsQueryOptions } from "@/lib/products-db";

interface Props {
  outdoorUnitModelName: string;
  maxOutdoorPowerKW: number;
  maxIndoorUnits: number;
  product: Product;
}

const SIZE_OPTIONS = [
  { icon: "🏠", label: "До 15 кв.м", kw: 2 },
  { icon: "🛋️", label: "15 - 20 кв.м", kw: 3 },
  { icon: "🏢", label: "20 - 30 кв.м", kw: 4 },
  { icon: "🏰", label: "30 - 40 кв.м", kw: 5 },
  { icon: "🏬", label: "Над 40 кв.м", kw: 6 },
] as const;

interface Room {
  id: number;
  kw: number;
  slug: string | null;
}

function btuToKw(btu: number) {
  return Math.round((btu / 3412) * 10) / 10;
}

function RoomSizeDropdown({ value, onChange }: { value: number; onChange: (kw: number) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = SIZE_OPTIONS.find((o) => o.kw === value) ?? SIZE_OPTIONS[0];

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div ref={ref} className="relative min-w-[170px] flex-1">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl border border-border bg-white px-3 py-2 text-sm font-semibold text-brand-navy transition-colors hover:border-brand-teal/60 focus:border-brand-teal focus:outline-none"
      >
        <span className="inline-flex items-center gap-2">
          <span>{current.icon}</span>
          <span>{current.label}</span>
        </span>
        <ChevronDown className={`h-4 w-4 flex-none text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border border-border bg-white p-1 shadow-soft">
          {SIZE_OPTIONS.map((opt) => {
            const active = value === opt.kw;
            return (
              <button
                key={opt.kw}
                type="button"
                onClick={() => {
                  onChange(opt.kw);
                  setOpen(false);
                }}
                className={`flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                  active
                    ? "bg-brand-teal/10 text-brand-teal"
                    : "text-brand-navy hover:bg-brand-sky-soft/60"
                }`}
              >
                <span>{opt.icon}</span>
                <span className="flex-1">{opt.label}</span>
                <span className="text-xs font-bold text-muted-foreground">{opt.kw} kW</span>
                {active && <Check className="h-4 w-4 flex-none text-brand-teal" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function MultiSplitCompatibilityChecker({
  outdoorUnitModelName,
  maxOutdoorPowerKW,
  maxIndoorUnits,
  product,
}: Props) {
  const MAX_ROOMS = Math.max(2, maxIndoorUnits);
  const [mode, setMode] = useState<"size" | "model">("size");
  const [rooms, setRooms] = useState<Room[]>([{ id: 1, kw: 2, slug: null }]);
  const nextIdRef = useRef(2);
  const [modalOpen, setModalOpen] = useState(false);

  const { data: allProducts, isLoading } = useQuery(productsQueryOptions());

  const indoorUnits = useMemo(
    () =>
      (allProducts ?? [])
        .filter((p) => p.category !== "multi" && p.btu > 0)
        .sort((a, b) => a.brand.localeCompare(b.brand) || a.btu - b.btu),
    [allProducts],
  );

  const totalSelectedKW =
    Math.round(rooms.reduce((sum, r) => sum + r.kw, 0) * 10) / 10;
  const fits = totalSelectedKW <= maxOutdoorPowerKW;
  const percent = Math.round((totalSelectedKW / maxOutdoorPowerKW) * 100);
  const barWidth = Math.min(100, Math.max(percent, 4));

  function addRoom() {
    if (rooms.length >= MAX_ROOMS) return;
    setRooms((prev) => [...prev, { id: nextIdRef.current++, kw: 2, slug: null }]);
  }

  function removeRoom(id: number) {
    setRooms((prev) => prev.filter((r) => r.id !== id));
  }

  function setRoomSize(id: number, kw: number) {
    setRooms((prev) => prev.map((r) => (r.id === id ? { ...r, kw, slug: null } : r)));
  }

  function setRoomModel(id: number, unit: Product | null) {
    setRooms((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, slug: unit?.slug ?? null, kw: unit ? btuToKw(unit.btu) : 2 }
          : r,
      ),
    );
  }

  const combinationSummary = rooms
    .map((r, i) => {
      if (mode === "model" && r.slug) {
        const u = indoorUnits.find((p) => p.slug === r.slug);
        if (u) return `Стая ${i + 1}: ${u.brand} ${u.model} (${u.btu} BTU, ${r.kw} kW)`;
      }
      const size = SIZE_OPTIONS.find((o) => o.kw === r.kw);
      return `Стая ${i + 1}: ${size ? size.label : `${r.kw} kW`} (${r.kw} kW)`;
    })
    .join("; ");

  const tabClass = (active: boolean) =>
    `flex-1 cursor-pointer rounded-full px-4 py-2.5 text-sm font-semibold transition-all ${
      active
        ? "bg-white text-brand-navy shadow-card"
        : "text-brand-navy/60 hover:text-brand-navy"
    }`;

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
        <span
          className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
            fits ? "bg-brand-sky text-brand-navy" : "bg-orange-100 text-orange-700"
          }`}
        >
          Максимален капацитет: {maxOutdoorPowerKW} kW
        </span>
        <span className="rounded-full bg-brand-navy px-4 py-2 text-sm font-bold text-white">
          До {MAX_ROOMS} вътрешни тела
        </span>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex gap-1 rounded-full bg-brand-sky-soft/70 p-1">
        <button type="button" className={tabClass(mode === "size")} onClick={() => setMode("size")}>
          По квадратура на стаите
        </button>
        <button
          type="button"
          className={tabClass(mode === "model")}
          onClick={() => setMode("model")}
        >
          По модел вътрешно тяло
        </button>
      </div>

      <div className="mt-5 space-y-3">
        {rooms.map((room, idx) => (
          <div
            key={room.id}
            className="group flex flex-wrap items-center gap-3 rounded-2xl border border-border/60 bg-white px-4 py-3 shadow-card transition-all hover:border-brand-teal/50"
          >
            <span className="inline-flex items-center gap-2 text-sm font-bold text-brand-navy">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-sky text-xs font-extrabold text-brand-navy">
                {idx + 1}
              </span>
              Стая {idx + 1}
            </span>

            {mode === "size" ? (
              <RoomSizeDropdown
                value={room.kw}
                onChange={(kw) => setRoomSize(room.id, kw)}
              />
            ) : (
              <div className="min-w-[180px] flex-1">
                <IndoorModelPicker
                  units={indoorUnits}
                  isLoading={isLoading}
                  selectedSlug={room.slug}
                  onSelect={(u) => setRoomModel(room.id, u)}
                />
              </div>
            )}

            <span className="rounded-full bg-brand-sky-soft px-3 py-1 text-xs font-bold text-brand-teal">
              {room.kw} kW
            </span>
            {rooms.length > 1 && (
              <button
                type="button"
                onClick={() => removeRoom(room.id)}
                aria-label={`Премахни стая ${idx + 1}`}
                className="grid h-8 w-8 cursor-pointer place-items-center rounded-full text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600"
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
        className="mt-4 flex w-full cursor-pointer items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-brand-teal/50 bg-brand-sky-soft/30 px-5 py-5 text-sm font-bold text-brand-teal transition-all hover:-translate-y-0.5 hover:border-brand-teal hover:bg-brand-sky-soft/70 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
      >
        <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-teal text-white">
          <Plus className="h-5 w-5" />
        </span>
        Добави стая
        {rooms.length >= MAX_ROOMS && (
          <span className="text-xs font-normal">
            (това външно тяло поддържа до {MAX_ROOMS} вътрешни тела)
          </span>
        )}
      </button>

      {/* Capacity bar */}
      <div className="mt-6 rounded-2xl bg-brand-sky-soft/40 p-4">
        <div className="flex items-baseline justify-between text-sm">
          <span className="font-bold text-brand-navy">
            Избрана мощност: {totalSelectedKW} kW
          </span>
          <span
            className={`font-semibold ${fits ? "text-brand-teal" : "text-orange-600"}`}
          >
            {percent}% от {maxOutdoorPowerKW} kW
          </span>
        </div>
        <div className="mt-2 h-4 overflow-hidden rounded-full bg-white">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              fits
                ? "bg-gradient-to-r from-brand-teal to-emerald-500"
                : "bg-gradient-to-r from-orange-500 to-red-500"
            }`}
            style={{ width: `${barWidth}%` }}
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
                Изпрати запитване за тази комбинация
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

interface PickerProps {
  units: Product[];
  isLoading: boolean;
  selectedSlug: string | null;
  onSelect: (unit: Product | null) => void;
}

function IndoorModelPicker({ units, isLoading, selectedSlug, onSelect }: PickerProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const selected = units.find((u) => u.slug === selectedSlug) ?? null;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q
      ? units.filter((u) => `${u.brand} ${u.model} ${u.btu}`.toLowerCase().includes(q))
      : units;
    return list.slice(0, 40);
  }, [units, query]);

  if (selected) {
    return (
      <div className="mt-3 flex items-center gap-4 rounded-2xl border border-brand-teal/40 bg-brand-sky-soft/30 p-3">
        <img
          src={selected.image}
          alt={`${selected.brand} ${selected.model}`}
          loading="lazy"
          className="h-16 w-20 flex-none rounded-xl bg-white object-contain"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-brand-navy">
            {selected.brand} {selected.model}
          </p>
          <p className="text-xs text-muted-foreground">
            {selected.btu} BTU • {btuToKw(selected.btu)} kW
          </p>
          <p className="mt-0.5 text-sm font-extrabold text-brand-teal">
            {selected.priceEur} €
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            onSelect(null);
            setQuery("");
          }}
          className="cursor-pointer rounded-full px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-white hover:text-brand-navy"
        >
          Смени
        </button>
      </div>
    );
  }

  return (
    <div className="relative mt-3">
      <div className="flex items-center gap-2 rounded-xl border border-border bg-white px-3 py-2.5 focus-within:border-brand-teal">
        <Search className="h-4 w-4 flex-none text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={isLoading ? "Зареждане на модели..." : "Търсете модел вътрешно тяло..."}
          className="w-full bg-transparent text-sm text-brand-navy outline-none"
        />
      </div>
      {open && (
        <div className="absolute z-20 mt-2 max-h-72 w-full overflow-auto rounded-2xl border border-border bg-white p-1 shadow-soft">
          {filtered.length === 0 && (
            <p className="p-3 text-sm text-muted-foreground">Няма намерени модели.</p>
          )}
          {filtered.map((u) => (
            <button
              key={u.slug}
              type="button"
              onClick={() => {
                onSelect(u);
                setOpen(false);
              }}
              className="flex w-full cursor-pointer items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-brand-sky-soft/60"
            >
              <img
                src={u.image}
                alt=""
                loading="lazy"
                className="h-10 w-14 flex-none rounded-lg bg-white object-contain"
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-brand-navy">
                  {u.brand} {u.model}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {u.btu} BTU • {btuToKw(u.btu)} kW • {u.priceEur} €
                </span>
              </span>
            </button>
          ))}
        </div>
      )}
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
        className="relative max-h-[90vh] w-full max-w-md overflow-auto rounded-t-2xl border border-border/60 bg-card p-6 shadow-soft sm:rounded-2xl"
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
