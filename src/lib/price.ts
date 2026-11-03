export function formatEur(v: number): string {
  return v.toLocaleString("bg-BG", { minimumFractionDigits: Number.isInteger(v) ? 0 : 2, maximumFractionDigits: 2 });
}

export function discountPercent(p: { priceEur: number; oldPriceEur?: number }): number {
  if (!p.oldPriceEur || p.oldPriceEur <= p.priceEur) return 0;
  return 11;
}
