import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Customer } from "@/lib/admin";

export const Route = createFileRoute("/admin/klienti/")({
  component: CustomersPage,
});

type Row = Customer & { orders: { id: string }[] };

function CustomersPage() {
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "customers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customers")
        .select("*, orders(id)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Row[];
    },
  });

  const q = search.trim().toLowerCase();
  const rows = (data ?? []).filter(
    (c) => !q || c.name.toLowerCase().includes(q) || c.phone.toLowerCase().includes(q),
  );

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold text-brand-navy">Клиенти</h1>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Търсене по име или телефон"
        className="w-full max-w-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand-navy"
      />

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Име</th>
              <th className="px-4 py-3">Телефон</th>
              <th className="px-4 py-3">Имейл</th>
              <th className="px-4 py-3">Адрес</th>
              <th className="px-4 py-3">Брой поръчки</th>
            </tr>

          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-slate-500">
                  Зареждане...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-slate-500">
                  Няма клиенти.
                </td>
              </tr>
            ) : (
              rows.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium">
                    <Link
                      to="/admin/klienti/$id"
                      params={{ id: c.id }}
                      className="text-brand-navy underline-offset-2 hover:underline"
                    >
                      {c.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{c.phone}</td>
                  <td className="px-4 py-3">{c.address ?? "-"}</td>
                  <td className="px-4 py-3">{c.orders?.length ?? 0}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
