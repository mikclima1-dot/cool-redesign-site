import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  formatDate,
  formatDateTime,
  formatTime,
  money,
  orderUnitsLabel,
  ORDER_STATUSES,
  STATUS_CLASSES,
  type Order,
} from "@/lib/admin";

import { Pencil, Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/porachki/")({
  component: OrdersPage,
});

function OrdersPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [dateField, setDateField] = useState<"installation_date" | "created_at">("installation_date");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, customers(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Order[];
    },
  });

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (data ?? []).filter((o) => {
      const matchesQ =
        !q ||
        (o.customers?.name ?? "").toLowerCase().includes(q) ||
        (o.customers?.phone ?? "").toLowerCase().includes(q);
      const matchesStatus = !status || o.status === status;
      const raw = dateField === "created_at" ? o.created_at : o.installation_date;
      const day = raw ? String(raw).slice(0, 10) : "";
      const matchesFrom = !dateFrom || (day && day >= dateFrom);
      const matchesTo = !dateTo || (day && day <= dateTo);
      return matchesQ && matchesStatus && matchesFrom && matchesTo;
    });
  }, [data, search, status, dateField, dateFrom, dateTo]);


  async function updateStatus(id: string, value: string) {
    await supabase.from("orders").update({ status: value }).eq("id", id);
    void qc.invalidateQueries({ queryKey: ["admin"] });
  }

  async function remove(id: string) {
    if (!confirm("Да изтрия ли поръчката?")) return;
    await supabase.from("orders").delete().eq("id", id);
    void qc.invalidateQueries({ queryKey: ["admin"] });
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-brand-navy">Поръчки</h1>
        <Link
          to="/admin/porachki/nova"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-navy px-4 py-2.5 text-sm font-semibold text-white"
        >
          <Plus className="h-4 w-4" /> Нова поръчка
        </Link>
      </div>

      <div className="flex flex-wrap gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Търсене по име или телефон"
          className="w-full max-w-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand-navy"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand-navy"
        >
          <option value="">Всички статуси</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={dateField}
          onChange={(e) => setDateField(e.target.value as "installation_date" | "created_at")}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand-navy"
        >
          <option value="installation_date">Дата за монтаж</option>
          <option value="created_at">Дата на създаване</option>
        </select>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand-navy"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand-navy"
        />
        {(dateFrom || dateTo) && (
          <button
            onClick={() => {
              setDateFrom("");
              setDateTo("");
            }}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
          >
            Изчисти дати
          </button>
        )}
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-[1100px] text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-3 py-3">№</th>
              <th className="px-3 py-3">Клиент</th>
              <th className="px-3 py-3">Телефон</th>
              <th className="px-3 py-3">Услуга</th>
              <th className="px-3 py-3">Климатик</th>
              <th className="px-3 py-3">Дата за монтаж</th>
              <th className="px-3 py-3">Създадена</th>
              <th className="px-3 py-3">Статус</th>
              <th className="px-3 py-3">Обща цена</th>
              <th className="px-3 py-3">Платено</th>
              <th className="px-3 py-3">Остатък</th>
              <th className="px-3 py-3">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={12} className="px-3 py-6 text-slate-500">
                  Зареждане...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={12} className="px-3 py-6 text-slate-500">
                  Няма поръчки.
                </td>
              </tr>
            ) : (
              rows.map((o) => (
                <tr key={o.id} className="align-middle">
                  <td className="px-3 py-3 text-slate-500">{o.order_no}</td>
                  <td className="px-3 py-3 font-medium text-slate-800">{o.customers?.name}</td>
                  <td className="px-3 py-3">
                    <a href={`tel:${o.customers?.phone}`} className="text-brand-navy">
                      {o.customers?.phone}
                    </a>
                  </td>
                  <td className="px-3 py-3">{o.service_type}</td>
                  <td className="px-3 py-3">{orderUnitsLabel(o)}</td>

                  <td className="px-3 py-3 whitespace-nowrap">
                    {formatDate(o.installation_date)} {formatTime(o.installation_time)}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-slate-500">
                    {formatDateTime(o.created_at)}
                  </td>
                  <td className="px-3 py-3">
                    <select
                      value={o.status}
                      onChange={(e) => void updateStatus(o.id, e.target.value)}
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_CLASSES[o.status] ?? "bg-slate-100 text-slate-700"}`}
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">{money(o.total_price)}</td>
                  <td className="px-3 py-3 whitespace-nowrap">{money(o.paid_amount)}</td>
                  <td className="px-3 py-3 whitespace-nowrap font-medium">
                    {money(Number(o.total_price) - Number(o.paid_amount))}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1">
                    <Link
                      to="/admin/porachki/$id"
                      params={{ id: o.id }}
                      aria-label="Редактирай"
                      className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-brand-navy"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => void remove(o.id)}
                      aria-label="Изтрий"
                      className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-rose-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    </div>
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
