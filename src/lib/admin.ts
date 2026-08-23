export const SERVICE_TYPES = [
  "Продажба + монтаж",
  "Само монтаж",
  "Профилактика",
  "Ремонт",
  "Демонтаж",
  "Друго",
] as const;

export const ORDER_STATUSES = ["Предстояща", "Завършена", "Отказана"] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const STATUS_CLASSES: Record<string, string> = {
  Предстояща: "bg-amber-100 text-amber-800",
  Завършена: "bg-emerald-100 text-emerald-700",
  Отказана: "bg-rose-100 text-rose-700",
};

export function money(value: number | null | undefined) {
  const n = Number(value ?? 0);
  return `${n.toLocaleString("bg-BG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
}

export function formatDateTime(value: string | null | undefined) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString("bg-BG", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDate(value: string | null | undefined) {
  if (!value) return "-";
  const [y, m, d] = value.split("-");
  return `${d}.${m}.${y}`;
}

export function formatTime(value: string | null | undefined) {
  if (!value) return "";
  return value.slice(0, 5);
}

export type Customer = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  neighborhood: string | null;
  created_at: string;
};

export type OrderItem = {
  slug: string | null;
  title: string;
  brand: string | null;
  btu: number | null;
  quantity: number;
  unit_price: number;
};

export type Order = {
  id: string;
  order_no: number;
  customer_id: string;
  service_type: string;
  brand: string | null;
  model: string | null;
  btu: number | null;
  quantity: number;
  items: OrderItem[] | null;
  installation_date: string | null;
  installation_time: string | null;
  notes: string | null;
  total_price: number;
  paid_amount: number;
  status: string;
  created_at: string;
  customers?: Customer | null;
};

export function orderUnitsLabel(o: Order): string {
  const items = Array.isArray(o.items) ? o.items : [];
  if (items.length > 0) {
    return items
      .map((it) =>
        [it.brand, it.title, it.btu ? `${it.btu} BTU` : null, `x${it.quantity}`]
          .filter(Boolean)
          .join(" "),
      )
      .join("; ");
  }
  const legacy = [o.brand, o.model, o.btu ? `${o.btu} BTU` : null, o.quantity ? `x${o.quantity}` : null]
    .filter(Boolean)
    .join(" ");
  return legacy || "-";
}
