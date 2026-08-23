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
import { CalendarDays, CheckCircle2, Euro, Plus } from "lucide-react";

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
  const revenue = done.reduce((sum, o) => sum + (Number(o.total_price) || 0), 0);

  const stats = [
    {
      label: "Предстоящи монтажи",
      value: String(upcoming.length),
      icon: CalendarDays,
      accent: "bg-brand-sky-soft text-brand-navy",
    },
    {
      label: "Приключени поръчки",
      value: String(done.length),
      icon: CheckCircle2,
      accent: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Оборот от приключени",
      value: money(revenue),
      icon: Euro,
      accent: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-brand-navy px-5 py-5 text-white shadow-sm">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">
            MIK Clima
          </p>
          <h1 className="mt-1 text-2xl font-semibold">Табло</h1>
        </div>
        <Link
          to="/admin/porachki/nova"
          className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-brand-navy transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Нова поръчка
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-slate-500">{s.label}</p>
              <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${s.accent}`}>
                <s.icon className="h-4.5 w-4.5" />
              </span>
            </div>
            <p className="mt-2 text-3xl font-semibold text-brand-navy">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50/60 px-5 py-3 text-sm font-semibold text-slate-700">
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
