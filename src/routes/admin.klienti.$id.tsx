import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  formatDate,
  formatTime,
  money,
  orderUnitsLabel,
  STATUS_CLASSES,
  type Customer,
  type Order,
} from "@/lib/admin";

import { ArrowLeft, Pencil } from "lucide-react";

export const Route = createFileRoute("/admin/klienti/$id")({
  component: CustomerDetail,
});

const inputClass =
  "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand-navy";

function CustomerDetail() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "" });

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "customer", id],
    queryFn: async () => {
      const [{ data: customer }, { data: orders }] = await Promise.all([
        supabase.from("customers").select("*").eq("id", id).maybeSingle(),
        supabase
          .from("orders")
          .select("*")
          .eq("customer_id", id)
          .order("created_at", { ascending: false }),
      ]);
      return {
        customer: (customer ?? null) as unknown as Customer | null,
        orders: (orders ?? []) as unknown as Order[],
      };
    },
  });

  const customerData = data?.customer ?? null;

  useEffect(() => {
    if (customerData) {
      setForm({
        name: customerData.name ?? "",
        phone: customerData.phone ?? "",
        email: customerData.email ?? "",
        address: customerData.address ?? "",
      });
    }
  }, [customerData]);

  async function save() {
    setSaving(true);
    await supabase
      .from("customers")
      .update({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || null,
        address: form.address.trim() || null,
      })
      .eq("id", id);
    setSaving(false);
    setEditing(false);
    void qc.invalidateQueries({ queryKey: ["admin"] });
  }

  if (isLoading) return <p className="text-sm text-slate-500">Зареждане...</p>;
  if (!data?.customer) return <p className="text-sm text-slate-500">Клиентът не е намерен.</p>;

  const { customer, orders } = data;

  return (
    <div className="space-y-5">
      <Link to="/admin/klienti" className="inline-flex items-center gap-2 text-sm text-slate-500">
        <ArrowLeft className="h-4 w-4" /> Назад към клиенти
      </Link>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        {editing ? (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Име</span>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Телефон</span>
                <input
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Имейл</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Адрес</span>
                <input
                  value={form.address}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                  className={inputClass}
                />
              </label>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => void save()}
                disabled={saving}
                className="rounded-lg bg-brand-navy px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {saving ? "Запазване..." : "Запази"}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Отказ
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-brand-navy">{customer.name}</h1>
              <p className="mt-1 text-sm text-slate-600">
                {customer.phone}
                {customer.email ? ` · ${customer.email}` : ""}
                {customer.address ? ` · ${customer.address}` : ""}
              </p>
            </div>
            <button
              onClick={() => setEditing(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-brand-navy hover:bg-slate-50"
            >
              <Pencil className="h-4 w-4" /> Редактирай
            </button>
          </div>
        )}
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-[700px] text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">№</th>
              <th className="px-4 py-3">Услуга</th>
              <th className="px-4 py-3">Климатик</th>
              <th className="px-4 py-3">Дата</th>
              <th className="px-4 py-3">Статус</th>
              <th className="px-4 py-3">Цена</th>
              <th className="px-4 py-3">Остатък</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-slate-500">
                  Няма поръчки.
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id}>
                  <td className="px-4 py-3 text-slate-500">
                    <Link
                      to="/admin/porachki/$id"
                      params={{ id: o.id }}
                      className="text-brand-navy underline-offset-2 hover:underline"
                    >
                      {o.order_no}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{o.service_type}</td>
                  <td className="px-4 py-3">{orderUnitsLabel(o)}</td>

                  <td className="px-4 py-3 whitespace-nowrap">
                    {formatDate(o.installation_date)} {formatTime(o.installation_time)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_CLASSES[o.status] ?? "bg-slate-100 text-slate-700"}`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{money(o.total_price)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {money(Number(o.total_price) - Number(o.paid_amount))}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
