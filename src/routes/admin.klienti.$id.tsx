import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
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

import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/admin/klienti/$id")({
  component: CustomerDetail,
});

function CustomerDetail() {
  const { id } = Route.useParams();

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

  if (isLoading) return <p className="text-sm text-slate-500">Зареждане...</p>;
  if (!data?.customer) return <p className="text-sm text-slate-500">Клиентът не е намерен.</p>;

  const { customer, orders } = data;

  return (
    <div className="space-y-5">
      <Link to="/admin/klienti" className="inline-flex items-center gap-2 text-sm text-slate-500">
        <ArrowLeft className="h-4 w-4" /> Назад към клиенти
      </Link>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h1 className="text-2xl font-semibold text-brand-navy">{customer.name}</h1>
        <p className="mt-1 text-sm text-slate-600">
          {customer.phone}
          {customer.email ? ` · ${customer.email}` : ""}
          {customer.address ? ` · ${customer.address}` : ""}
        </p>

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
                  <td className="px-4 py-3 text-slate-500">{o.order_no}</td>
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
