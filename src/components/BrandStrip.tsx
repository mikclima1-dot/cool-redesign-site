import { brands } from "@/data/products";

const LOGO_MAP: Record<string, string> = {
  Daikin: "/images/brands/daikin.svg",
  "Mitsubishi Electric": "/images/brands/mitsubishi-electric.svg",
  "Mitsubishi Heavy": "/images/brands/mitsubishi-heavy.svg",
  Toshiba: "/images/brands/toshiba.svg",
  "Fujitsu General": "/images/brands/fujitsu.svg",
  Gree: "/images/brands/gree.svg",
  "Cooper & Hunter": "/images/brands/cooper-hunter.svg",
};

type Variant = "light" | "dark" | "subtle";

export function BrandStrip({
  variant = "light",
  size = "md",
  className = "",
}: {
  variant?: Variant;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const h = size === "lg" ? "h-12 md:h-14" : size === "sm" ? "h-6 md:h-7" : "h-9 md:h-10";
  // On dark backgrounds we invert-tint the logos so they read as monochrome white.
  const imgClass =
    variant === "dark"
      ? `${h} w-auto object-contain opacity-90 brightness-0 invert transition-opacity hover:opacity-100`
      : variant === "subtle"
      ? `${h} w-auto object-contain opacity-60 grayscale transition-all hover:opacity-100 hover:grayscale-0`
      : `${h} w-auto object-contain opacity-90 transition-opacity hover:opacity-100`;

  return (
    <div className={`flex flex-wrap items-center justify-center gap-x-8 gap-y-4 md:gap-x-12 ${className}`}>
      {brands.map((b) => {
        const src = LOGO_MAP[b];
        if (!src) {
          return (
            <span
              key={b}
              className={
                variant === "dark"
                  ? "text-sm font-bold text-white/80"
                  : "text-sm font-bold text-brand-navy/70"
              }
            >
              {b}
            </span>
          );
        }
        return (
          <img
            key={b}
            src={src}
            alt={`${b} лого`}
            loading="lazy"
            className={imgClass}
          />
        );
      })}
    </div>
  );
}
