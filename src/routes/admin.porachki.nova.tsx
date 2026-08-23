import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { money, ORDER_STATUSES, SERVICE_TYPES, type OrderItem } from "@/lib/admin";
import { Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/porachki/nova")({
  component: NewOrderPage,
});

const inputClass =
  "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand-navy";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}

type CatalogItem = {
  slug: string;
  title: string;
  brand: string;
  btu: number | null;
  price: number;
};

const emptyItem: OrderItem = {
  slug: null,
  title: "",
  brand: "",
  btu: null,
  quantity: 1,
  unit_price: 0,
};

function NewOrderPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: catalog } = useQuery({
    queryKey: ["admin", "catalog"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("slug, title, brand, btu, price")
        .order("title", { ascending: true });
      if (error) throw error;
      return (data ?? []) as CatalogItem[];
    },
    staleTime: 5 * 60 * 1000,
  });

  const catalogByTitle = useMemo(() => {
    const map = new Map<string, CatalogItem>();
    for (const p of catalog ?? []) map.set(p.title, p);
    return map;
  }, [catalog]);

  const [items, setItems] = useState<OrderItem[]>([{ ...emptyItem }]);
  const [priceTouched, setPriceTouched] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    service_type: SERVICE_TYPES[0] as string,
    installation_date: "",
    installation_time: "",
    notes: "",
    total_price: "",
    paid_amount: "",
    status: ORDER_STATUSES[0] as string,
  });

  const set =
    (key: keyof typeof form) =>
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    ) => {
      if (key === "total_price") setPriceTouched(true);
      setForm((f) => ({ ...f, [key]: e.target.value }));
    };

  const itemsTotal = items.reduce(
    (sum, it) => sum + Number(it.unit_price || 0) * Number(it.quantity || 0),
    0,
  );

  const effectiveTotal = priceTouched || form.total_price ? Number(form.total_price || 0) : itemsTotal;
  const remaining = effectiveTotal - Number(form.paid_amount || 0);

  function updateItem(index: number, patch: Partial<OrderItem>) {
    setItems((list) => list.map((it, i) => (i === index ? { ...it, ...patch } : it)));
  }

  function onTitleChange(index: number, value: string) {
    const match = catalogByTitle.get(value);
    if (match) {
      updateItem(index, {
        slug: match.slug,
        title: match.title,
        brand: match.brand,
        btu: match.btu,
        unit_price: Number(match.price ?? 0),
      });
    } else {
      updateItem(index, { title: value, slug: null });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const phone = form.phone.trim();
    const email = form.email.trim() || null;

    const { data: existing } = await supabase
      .from("customers")
      .select("id")
      .eq("phone", phone)
      .limit(1)
      .maybeSingle();

    let customerId = existing?.id ?? null;
    if (!customerId) {
      const { data: created, error: cErr } = await supabase
        .from("customers")
        .insert({
          name: form.name.trim(),
          phone,
          email,
          address: form.address.trim() || null,
        })
        .select("id")
        .single();
      if (cErr || !created) {
        setSaving(false);
        setError("Грешка при запис на клиента.");
        return;
      }
      customerId = created.id;
    } else {
      await supabase
        .from("customers")
        .update({
          name: form.name.trim(),
          email,
          address: form.address.trim() || null,
        })
        .eq("id", customerId);
    }

    const cleanItems = items
      .filter((it) => it.title.trim())
      .map((it) => ({
        slug: it.slug,
        title: it.title.trim(),
        brand: it.brand?.trim() || null,
        btu: it.btu ? Number(it.btu) : null,
        quantity: Number(it.quantity || 1),
        unit_price: Number(it.unit_price || 0),
      }));

    const first = cleanItems[0];

    const { error: oErr } = await supabase.from("orders").insert({
      customer_id: customerId,
      service_type: form.service_type,
      items: cleanItems,
      brand: first?.brand ?? null,
      model: first?.title ?? null,
      btu: first?.btu ?? null,
      quantity: cleanItems.reduce((s, it) => s + it.quantity, 0) || 1,
      installation_date: form.installation_date || null,
      installation_time: form.installation_time || null,
      notes: form.notes.trim() || null,
      total_price: effectiveTotal,
      paid_amount: Number(form.paid_amount || 0),
      status: form.status,
    });

    setSaving(false);
    if (oErr) {
      setError("Грешка при запис на поръчката.");
      return;
    }
    void qc.invalidateQueries({ queryKey: ["admin"] });
    navigate({ to: "/admin/porachki" });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold text-brand-navy">Нова поръчка</h1>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase text-slate-500">Клиент</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Име">
            <input required value={form.name} onChange={set("name")} className={inputClass} />
          </Field>
          <Field label="Телефон">
            <input required value={form.phone} onChange={set("phone")} className={inputClass} />
          </Field>
          <Field label="Имейл">
            <input
              type="email"
              value={form.email}
              onChange={set("email")}
              placeholder="по желание"
              className={inputClass}
            />
          </Field>
          <Field label="Адрес">
            <input value={form.address} onChange={set("address")} className={inputClass} />
          </Field>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase text-slate-500">Климатици</h2>
          <button
            type="button"
            onClick={() => setItems((l) => [...l, { ...emptyItem }])}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-brand-navy"
          >
            <Plus className="h-4 w-4" /> Добави климатик
          </button>
        </div>

        <datalist id="products-list">
          {(catalog ?? []).map((p) => (
            <option key={p.slug} value={p.title} />
          ))}
        </datalist>

        <div className="space-y-4">
          {items.map((it, i) => (
            <div key={i} className="rounded-lg border border-slate-200 p-4">
              <div className="grid gap-3 sm:grid-cols-6">
                <div className="sm:col-span-6">
                  <Field label="Модел (от каталога или ръчно)">
                    <input
                      list="products-list"
                      value={it.title}
                      onChange={(e) => onTitleChange(i, e.target.value)}
                      placeholder="Започнете да пишете марка или модел"
                      className={inputClass}
                    />
                  </Field>
                </div>
                <div className="sm:col-span-2">
                  <Field label="Марка">
                    <input
                      value={it.brand ?? ""}
                      onChange={(e) => updateItem(i, { brand: e.target.value })}
                      className={inputClass}
                    />
                  </Field>
                </div>
                <div className="sm:col-span-1">
                  <Field label="BTU">
                    <input
                      type="number"
                      value={it.btu ?? ""}
                      onChange={(e) =>
                        updateItem(i, { btu: e.target.value ? Number(e.target.value) : null })
                      }
                      className={inputClass}
                    />
                  </Field>
                </div>
                <div className="sm:col-span-1">
                  <Field label="Брой">
                    <input
                      type="number"
                      min="1"
                      value={it.quantity}
                      onChange={(e) => updateItem(i, { quantity: Number(e.target.value || 1) })}
                      className={inputClass}
                    />
                  </Field>
                </div>
                <div className="sm:col-span-2">
                  <Field label="Ед. цена (€)">
                    <input
                      type="number"
                      step="0.01"
                      value={it.unit_price || ""}
                      onChange={(e) => updateItem(i, { unit_price: Number(e.target.value || 0) })}
                      className={inputClass}
                    />
                  </Field>
                </div>
              </div>
              {items.length > 1 ? (
                <button
                  type="button"
                  onClick={() => setItems((l) => l.filter((_, idx) => idx !== i))}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-rose-600"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Премахни
                </button>
              ) : null}
            </div>
          ))}
        </div>

        <p className="mt-4 text-sm text-slate-600">
          Сума от климатиците: <span className="font-semibold">{money(itemsTotal)}</span>
        </p>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase text-slate-500">Услуга и монтаж</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Тип услуга">
            <select value={form.service_type} onChange={set("service_type")} className={inputClass}>
              {SERVICE_TYPES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
          <div />
          <Field label="Дата">
            <input
              type="date"
              value={form.installation_date}
              onChange={set("installation_date")}
              className={inputClass}
            />
          </Field>
          <Field label="Час">
            <input
              type="time"
              value={form.installation_time}
              onChange={set("installation_time")}
              className={inputClass}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Бележки">
              <textarea rows={3} value={form.notes} onChange={set("notes")} className={inputClass} />
            </Field>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase text-slate-500">Цена</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Field label="Обща цена">
              <input
                type="number"
                step="0.01"
                value={form.total_price}
                onChange={set("total_price")}
                placeholder={itemsTotal ? String(itemsTotal.toFixed(2)) : ""}
                className={inputClass}
              />
            </Field>
            {itemsTotal > 0 ? (
              <button
                type="button"
                onClick={() => {
                  setPriceTouched(true);
                  setForm((f) => ({ ...f, total_price: itemsTotal.toFixed(2) }));
                }}
                className="mt-1 text-xs font-medium text-brand-navy underline-offset-2 hover:underline"
              >
                Попълни от климатиците
              </button>
            ) : null}
          </div>
          <Field label="Платено">
            <input
              type="number"
              step="0.01"
              value={form.paid_amount}
              onChange={set("paid_amount")}
              className={inputClass}
            />
          </Field>
          <div>
            <span className="text-sm font-medium text-slate-700">Остатък</span>
            <p className="mt-1 rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-brand-navy">
              {money(remaining)}
            </p>
          </div>
        </div>
        <div className="mt-4 max-w-xs">
          <Field label="Статус">
            <select value={form.status} onChange={set("status")} className={inputClass}>
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </section>

      {error ? <p className="text-sm text-rose-600">{error}</p> : null}

      <button
        type="submit"
        disabled={saving}
        className="rounded-lg bg-brand-navy px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {saving ? "Запазване..." : "Запази поръчката"}
      </button>
    </form>
  );
}
