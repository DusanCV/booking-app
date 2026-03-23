import Image from "next/image";
import Link from "next/link";
import type { Unit } from "@/types/unit";

type UnitCardProps = {
  unit: Unit;
  variant?: "dark" | "light";
};

export function UnitCard({ unit, variant = "dark" }: UnitCardProps) {
  const isDark = variant === "dark";

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-[2rem] border shadow-[0_24px_80px_-30px_rgba(0,0,0,0.25)] transition duration-300 hover:-translate-y-1
      ${
        isDark
          ? "border-white/10 bg-white/5 text-white hover:bg-white/[0.08]"
          : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
      }`}
    >
      {/* IMAGE */}
      <div className="relative h-72 overflow-hidden">
        <Image
          src={unit.cover_image || "/images/unit-1.jpg"}
          alt={unit.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        <div
          className={`absolute left-4 top-4 rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur
          ${
            isDark
              ? "border border-white/20 bg-black/30 text-white"
              : "border border-slate-200 bg-white/90 text-slate-900"
          }`}
        >
          Od €{unit.base_price} / noć
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <h3
            className={`text-3xl font-semibold tracking-tight ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            {unit.name}
          </h3>

          <span
            className={`rounded-full px-3 py-1 text-sm font-semibold ${
              isDark
                ? "bg-white/10 text-white/80"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            {unit.capacity} gosta
          </span>
        </div>

        <p
          className={`mt-4 min-h-[96px] text-lg leading-8 ${
            isDark ? "text-white/70" : "text-slate-600"
          }`}
        >
          {unit.short_description ?? "Opis dolazi uskoro."}
        </p>

        {/* METRICS */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div
            className={`flex min-h-[108px] flex-col justify-between rounded-3xl p-4 ${
              isDark ? "bg-white/5" : "bg-slate-100"
            }`}
          >
            <p
              className={`text-xs uppercase tracking-[0.22em] ${
                isDark ? "text-white/35" : "text-slate-400"
              }`}
            >
              Veličina
            </p>
            <p className="text-2xl font-semibold">
              {unit.size_m2 ?? "-"} m²
            </p>
          </div>

          <div
            className={`flex min-h-[108px] flex-col justify-between rounded-3xl p-4 ${
              isDark ? "bg-white/5" : "bg-slate-100"
            }`}
          >
            <p
              className={`text-xs uppercase tracking-[0.22em] ${
                isDark ? "text-white/35" : "text-slate-400"
              }`}
            >
              Cijena od
            </p>
            <p className="text-2xl font-semibold">
              €{unit.base_price}
            </p>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="mt-6 flex gap-3 pt-2">
          <Link
            href={`/units/${unit.slug}`}
            className={`flex-1 rounded-full px-4 py-3.5 text-center text-sm font-semibold transition ${
              isDark
                ? "border border-white/15 text-white hover:bg-white/10"
                : "border border-slate-200 text-slate-900 hover:bg-slate-100"
            }`}
          >
            Detalji
          </Link>

          <Link
            href="/booking"
            className={`flex-1 rounded-full px-4 py-3.5 text-center text-sm font-semibold transition ${
              isDark
                ? "bg-white text-slate-950 hover:scale-[1.02]"
                : "bg-slate-950 text-white hover:bg-slate-800"
            }`}
          >
            Rezerviraj
          </Link>
        </div>
      </div>
    </article>
  );
}