import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { money, ORDER_STATUSES, SERVICE_TYPES } from "@/lib/admin";

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

function NewOrderPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    service_type: SERVICE_TYPES[0] as string,
    brand: "",
    model: "",
    btu: "",
    quantity: "1",
    installation_date: "",
    installation_time: "",
    notes: "",
    total_price: "",
    paid_amount: "",
    status: ORDER_STATUSES[0] as string,
  });

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const remaining = Number(form.total_price || 0) - Number(form.paid_amount || 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const phone = form.phone.trim();
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
        .update({ name: form.name.trim(), address: form.address.trim() || null })
        .eq("id", customerId);
    }

    const { error: oErr } = await supabase.from("orders").insert({
      customer_id: customerId,
      service_type: form.service_type,
      brand: form.brand.trim() || null,
      model: form.model.trim() || null,
      btu: form.btu ? Number(form.btu) : null,
      quantity: Number(form.quantity || 1),
      installation_date: form.installation_date || null,
      installation_time: form.installation_time || null,
      notes: form.notes.trim() || null,
      total_price: Number(form.total_price || 0),
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
          <div className="sm:col-span-2">
            <Field label="Адрес">
              <input value={form.address} onChange={set("address")} className={inputClass} />
            </Field>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase text-slate-500">Поръчка</h2>
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
          <Field label="Марка климатик">
            <input value={form.brand} onChange={set("brand")} className={inputClass} />
          </Field>
          <Field label="Модел">
            <input value={form.model} onChange={set("model")} className={inputClass} />
          </Field>
          <Field label="BTU">
            <input type="number" value={form.btu} onChange={set("btu")} className={inputClass} />
          </Field>
          <Field label="Количество">
            <input
              type="number"
              min="1"
              value={form.quantity}
              onChange={set("quantity")}
              className={inputClass}
            />
          </Field>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase text-slate-500">Монтаж</h2>
        <div className="grid gap-4 sm:grid-cols-2">
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
          <Field label="Обща цена">
            <input
              type="number"
              step="0.01"
              value={form.total_price}
              onChange={set("total_price")}
              className={inputClass}
            />
          </Field>
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
