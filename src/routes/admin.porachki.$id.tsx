import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { OrderForm } from "@/components/admin/OrderForm";
import type { Order } from "@/lib/admin";

export const Route = createFileRoute("/admin/porachki/$id")({
  component: EditOrderPage,
});

function EditOrderPage() {
  const { id } = Route.useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "order", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, customers(*)")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return (data ?? null) as unknown as Order | null;
    },
  });

  return (
    <div className="space-y-5">
      <Link to="/admin/porachki" className="inline-flex items-center gap-2 text-sm text-slate-500">
        <ArrowLeft className="h-4 w-4" /> Назад към поръчки
      </Link>
      {isLoading ? (
        <p className="text-sm text-slate-500">Зареждане...</p>
      ) : !data ? (
        <p className="text-sm text-slate-500">Поръчката не е намерена.</p>
      ) : (
        <OrderForm order={data} />
      )}
    </div>
  );
}
