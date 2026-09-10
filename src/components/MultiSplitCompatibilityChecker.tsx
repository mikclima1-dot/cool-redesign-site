import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  CheckCircle2,
  DoorOpen,
  Mail,
  Ruler,
  Loader2,
  Plus,
  Search,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

function RoomSizeDropdown({ value, onChange, roomNumber }: { value: number; onChange: (kw: number) => void; roomNumber: number }) {
  return (
    <Select value={String(value)} onValueChange={(kw) => onChange(Number(kw))}>
      <SelectTrigger aria-label={`Квадратура на стая ${roomNumber}`} className="h-11 w-full min-w-0 rounded-lg bg-background px-3 font-medium shadow-none">
        <SelectValue />
      </SelectTrigger>
      <SelectContent position="popper" sideOffset={4} collisionPadding={12} className="w-[var(--radix-select-trigger-width)] rounded-lg">
        {SIZE_OPTIONS.map((option) => (
          <SelectItem key={option.kw} value={String(option.kw)} className="min-h-11 whitespace-nowrap rounded-md pr-9 [&>span:last-child]:w-full">
            <span className="flex w-full items-center justify-between gap-3 whitespace-nowrap">
              <span>{option.label}</span>
              <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{option.kw} kW</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
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
    `h-10 min-w-0 flex-1 gap-1.5 rounded-lg px-2 text-xs font-semibold shadow-none sm:text-sm ${
      active
        ? "bg-background text-brand-navy shadow-card hover:bg-background"
        : "text-muted-foreground hover:bg-background/60 hover:text-brand-navy"
    }`;

  return (
    <section aria-label="Калкулатор за мултисистема" className="min-w-0 rounded-2xl border border-border bg-background px-3 py-5 shadow-soft sm:px-6 sm:py-6">
      <h2 className="text-lg font-bold tracking-normal text-brand-navy sm:text-xl">
        Вашата мултисистема
      </h2>
      <div className="mt-4 grid grid-cols-2 gap-3 border-b border-border pb-4">
        <div>
          <p className="whitespace-nowrap text-xs text-muted-foreground">Макс. мощност</p>
          <p className="mt-1 whitespace-nowrap text-lg font-bold tabular-nums text-brand-navy">{maxOutdoorPowerKW} kW</p>
        </div>
        <div className="border-l border-border pl-4">
          <p className="whitespace-nowrap text-xs text-muted-foreground">Вътрешни тела</p>
          <p className="mt-1 whitespace-nowrap text-lg font-bold text-brand-navy">До {MAX_ROOMS}</p>
        </div>
      </div>

      <div className="mt-4 flex gap-1 rounded-xl bg-muted p-1" role="group" aria-label="Начин на избор">
        <Button variant="ghost" type="button" aria-pressed={mode === "size"} className={tabClass(mode === "size")} onClick={() => setMode("size")}>
          <Ruler className="hidden min-[360px]:block" /> По квадратура
        </Button>
        <Button variant="ghost" type="button" aria-pressed={mode === "model"} className={tabClass(mode === "model")} onClick={() => setMode("model")}>
          <DoorOpen className="hidden min-[360px]:block" /> По модел
        </Button>
      </div>

      <div className="mt-4 space-y-3">
        {rooms.map((room, idx) => (
          <div key={room.id} className="min-w-0 rounded-lg border border-border bg-muted p-3">
            <div className="mb-2 flex h-7 items-center justify-between gap-2">
              <span className="flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-brand-navy">
                <DoorOpen className="h-4 w-4 text-muted-foreground" />
                Стая {idx + 1}
              </span>
              <div className="flex items-center gap-2">
                <span className="whitespace-nowrap text-xs font-semibold tabular-nums text-brand-teal">{room.kw} kW</span>
                <Button variant="ghost" size="icon" type="button" disabled={rooms.length === 1} onClick={() => removeRoom(room.id)} aria-label={`Премахни стая ${idx + 1}`} className="h-7 w-7 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                  <Trash2 />
                </Button>
              </div>
            </div>
            {mode === "size" ? (
              <RoomSizeDropdown value={room.kw} roomNumber={idx + 1} onChange={(kw) => setRoomSize(room.id, kw)} />
            ) : (
              <IndoorModelPicker units={indoorUnits} isLoading={isLoading} selectedSlug={room.slug} onSelect={(u) => setRoomModel(room.id, u)} />
            )}
          </div>
        ))}
      </div>

      <Button variant="outline" type="button" onClick={addRoom} disabled={rooms.length >= MAX_ROOMS} className="mt-3 h-11 w-full gap-2 rounded-lg border-dashed border-brand-teal/50 bg-background px-3 text-brand-teal shadow-none hover:bg-brand-sky-soft/50">
        <Plus />
        <span>Добави стая</span>
        <span className="ml-auto text-xs tabular-nums text-muted-foreground">{rooms.length} / {MAX_ROOMS}</span>
      </Button>

      <div className="mt-5 border-t border-border pt-4">
        <div className="flex items-center justify-between gap-2 text-xs">
          <span className="whitespace-nowrap font-medium text-muted-foreground">Обща мощност</span>
          <span className={`whitespace-nowrap font-bold tabular-nums ${fits ? "text-brand-teal" : "text-destructive"}`}>{totalSelectedKW} / {maxOutdoorPowerKW} kW</span>
        </div>
        <div role="progressbar" aria-label="Избрана мощност" aria-valuenow={totalSelectedKW} aria-valuemin={0} aria-valuemax={Math.max(maxOutdoorPowerKW, totalSelectedKW)} aria-valuetext={`${totalSelectedKW} от ${maxOutdoorPowerKW} kW, ${percent}%`} className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
          <div className={`h-full rounded-full transition-all duration-300 motion-reduce:transition-none ${fits ? "bg-brand-teal" : "bg-destructive"}`} style={{ width: `${barWidth}%` }} />
        </div>
      </div>

      <div aria-live="polite" className="mt-4">
        <div className="flex items-start gap-2">
          {fits ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-teal" /> : <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />}
          <p className={`text-sm font-semibold ${fits ? "text-brand-teal" : "text-destructive"}`}>
            {fits ? "Мощността е достатъчна" : "Надвишен капацитет"}
          </p>
        </div>
        {fits ? (
          <Button type="button" onClick={() => setModalOpen(true)} className="mt-3 h-11 w-full rounded-lg px-3 text-sm font-semibold" aria-label="Изпрати запитване за тази комбинация">
            <Mail /> Изпрати запитване
          </Button>
        ) : (
          <>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Намалете мощността или изберете по-мощно тяло.</p>
            <Button asChild variant="outline" className="mt-3 h-11 w-full rounded-lg px-3 text-sm font-semibold">
              <a href="/produkti?cat=multi">По-мощни външни тела</a>
            </Button>
          </>
        )}
      </div>

      <CombinationOfferDialog
        product={product}
        outdoorUnitModelName={outdoorUnitModelName}
        combinationSummary={combinationSummary}
        totalSelectedKW={totalSelectedKW}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </section>
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
      <div className="flex min-w-0 items-center gap-2">
        <img
          src={selected.image}
          alt={`${selected.brand} ${selected.model}`}
          loading="lazy"
          className="h-12 w-12 flex-none rounded-md bg-background object-contain"
        />
        <div className="min-w-0 flex-1">
          <p title={`${selected.brand} ${selected.model}`} className="truncate text-sm font-bold text-brand-navy">
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
    <div className="relative min-w-0">
      <div className="flex items-center gap-2 rounded-xl border border-border bg-white px-3 py-2.5 focus-within:border-brand-teal">
        <Search className="h-4 w-4 flex-none text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={isLoading ? "Зареждане..." : "Търси модел..."}
          aria-label="Търси вътрешно тяло"
          className="min-w-0 w-full bg-transparent text-sm text-brand-navy outline-none"
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
                <span className="block whitespace-nowrap text-xs text-muted-foreground">
                  {u.btu} BTU • {btuToKw(u.btu)} kW
                  <span className="block font-semibold text-brand-teal">{u.priceEur} €</span>
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
