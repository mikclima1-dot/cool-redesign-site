import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatDate, formatTime, orderUnitsLabel, STATUS_CLASSES, type Order } from "@/lib/admin";

export const Route = createFileRoute("/admin/kalendar")({
  component: CalendarPage,
});

function CalendarPage() {
  const [selected, setSelected] = useState<Order | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "calendar"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, customers(*)")
        .not("installation_date", "is", null)
        .order("installation_date", { ascending: true })
        .order("installation_time", { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as Order[];
    },
  });

  const groups = new Map<string, Order[]>();
  for (const o of data ?? []) {
    const key = o.installation_date as string;
    groups.set(key, [...(groups.get(key) ?? []), o]);
  }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold text-brand-navy">Календар</h1>

      {isLoading ? (
        <p className="text-sm text-slate-500">Зареждане...</p>
      ) : groups.size === 0 ? (
        <p className="text-sm text-slate-500">Няма насрочени монтажи.</p>
      ) : (
        <div className="space-y-4">
          {[...groups.entries()].map(([date, items]) => (
            <div key={date} className="rounded-xl border border-slate-200 bg-white">
              <div className="border-b border-slate-200 px-5 py-3 text-sm font-semibold text-brand-navy">
                {formatDate(date)}
              </div>
              <ul className="divide-y divide-slate-100">
                {items.map((o) => (
                  <li key={o.id}>
                    <button
                      onClick={() => setSelected(o)}
                      className="flex w-full flex-wrap items-center justify-between gap-2 px-5 py-3 text-left hover:bg-slate-50"
                    >
                      <span className="text-sm font-medium text-slate-800">
                        {formatTime(o.installation_time) || "-"} · {o.customers?.name}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_CLASSES[o.status] ?? "bg-slate-100 text-slate-700"}`}
                      >
                        {o.status}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {selected ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-md rounded-xl bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-brand-navy">Монтаж №{selected.order_no}</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <Row label="Клиент" value={selected.customers?.name ?? "-"} />
              <Row label="Телефон" value={selected.customers?.phone ?? "-"} />
              <Row label="Имейл" value={selected.customers?.email ?? "-"} />
              <Row label="Адрес" value={selected.customers?.address ?? "-"} />
              <Row label="Климатици" value={orderUnitsLabel(selected)} />

              <Row label="Час" value={formatTime(selected.installation_time) || "-"} />
              <Row label="Бележки" value={selected.notes ?? "-"} />
            </dl>
            <button
              onClick={() => setSelected(null)}
              className="mt-6 w-full rounded-lg bg-brand-navy px-4 py-2 text-sm font-semibold text-white"
            >
              Затвори
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <dt className="w-24 shrink-0 text-slate-500">{label}</dt>
      <dd className="text-slate-800">{value}</dd>
    </div>
  );
}
