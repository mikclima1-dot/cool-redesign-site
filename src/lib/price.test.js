import { describe, expect, test } from "bun:test";
import { discountPercent } from "./price";

describe("campaign discount", () => {
  test("keeps the November campaign at 11 percent with corrected installation-inclusive prices", () => {
    expect(discountPercent({ priceEur: 920, oldPriceEur: 1000 })).toBe(11);
    expect(discountPercent({ priceEur: 890, oldPriceEur: 1000 })).toBe(11);
  });

  test("does not mark products without a reduced price as discounted", () => {
    expect(discountPercent({ priceEur: 1000 })).toBe(0);
    expect(discountPercent({ priceEur: 1000, oldPriceEur: 1000 })).toBe(0);
  });
});