import { createFileRoute } from "@tanstack/react-router";
import { OrderForm } from "@/components/admin/OrderForm";

export const Route = createFileRoute("/admin/porachki/nova")({
  component: NewOrderPage,
});

function NewOrderPage() {
  return <OrderForm />;
}
