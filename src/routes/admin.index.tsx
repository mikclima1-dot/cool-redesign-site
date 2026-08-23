import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  formatDate,
  formatTime,
  money,
  orderUnitsLabel,
  STATUS_CLASSES,
  type Order,
} from "@/lib/admin";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

function today() {
  return new Date().toISOString().slice(0, 10);
}

function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, customers(*)")
        .order("installation_date", { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as Order[];
    },
  });

  const orders = data ?? [];
  const upcoming = orders.filter(
    (o) =>
      o.installation_date &&
      o.installation_date >= today() &&
      o.status !== "Завършена" &&
      o.status !== "Отказана",
  );
  const done = orders.filter((o) => o.status === "Завършена");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-brand-navy">Табло</h1>
        <Link
          to="/admin/porachki/nova"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-navy px-4 py-2.5 text-sm font-semibold text-white"
        >
          <Plus className="h-4 w-4" /> Нова поръчка
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Предстоящи монтажи</p>
          <p className="mt-1 text-3xl font-semibold text-brand-navy">{upcoming.length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Приключени поръчки</p>
          <p className="mt-1 text-3xl font-semibold text-brand-navy">{done.length}</p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700">
          Най-близки предстоящи монтажи
        </div>
        {isLoading ? (
          <p className="px-5 py-6 text-sm text-slate-500">Зареждане...</p>
        ) : upcoming.length === 0 ? (
          <p className="px-5 py-6 text-sm text-slate-500">Няма предстоящи монтажи.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {upcoming.slice(0, 10).map((o) => (
              <li key={o.id} className="flex flex-wrap items-center justify-between gap-2 px-5 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-800">
                    {o.customers?.name} - {o.customers?.phone}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {o.service_type} - {orderUnitsLabel(o)}
                    {o.customers?.address ? ` - ${o.customers.address}` : ""}
                  </p>

                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-700">
                    {formatDate(o.installation_date)} {formatTime(o.installation_time)}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_CLASSES[o.status] ?? "bg-slate-100 text-slate-700"}`}
                  >
                    {o.status}
                  </span>
                  <span className="hidden text-sm text-slate-600 sm:inline">
                    {money(o.total_price)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
