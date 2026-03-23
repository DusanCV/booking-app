import Image from "next/image";
import Link from "next/link";
import { getUnits } from "@/lib/units";
import type { Unit } from "@/types/unit";

export default async function UnitsPage() {
  let units: Unit[] = [];

  try {
    units = await getUnits();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Nepoznata greška.";

    return (
      <main className="min-h-screen bg-[#07111f] px-6 py-12 text-white">
        <h1 className="text-4xl font-semibold">Jedinice</h1>
        <p className="mt-4 text-red-400">{message}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07111f] px-6 py-14 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/45">
            Smještajne jedinice
          </p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-white md:text-6xl">
            Prostor koji izgleda premium
            <span className="block text-white/70">i rezervira se jednostavno</span>
          </h1>
          <p className="mt-5 text-xl leading-9 text-white/70">
            Odaberi smještaj koji najbolje odgovara tvom boravku i nastavi prema
            rezervaciji u nekoliko klikova.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {units.map((unit) => (
            <article
              key={unit.id}
              className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-[0_24px_80px_-28px_rgba(0,0,0,0.5)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white/[0.07]"
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={unit.cover_image || "/images/unit-1.jpg"}
                  alt={unit.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-2xl font-semibold text-white">
                    {unit.name}
                  </h2>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
                    {unit.capacity} gosta
                  </span>
                </div>

                <p className="mt-3 text-base leading-8 text-white/70">
                  {unit.short_description ?? "Opis dolazi uskoro."}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-white/35">
                      Veličina
                    </p>
                    <p className="mt-1 text-base font-semibold text-white">
                      {unit.size_m2 ?? "-"} m²
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-white/35">
                      Cijena od
                    </p>
                    <p className="mt-1 text-base font-semibold text-white">
                      €{unit.base_price}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <Link
                    href={`/units/${unit.slug}`}
                    className="inline-flex flex-1 items-center justify-center rounded-full border border-white/15 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Pogledaj detalje
                  </Link>

                  <Link
                    href="/booking"
                    className="inline-flex flex-1 items-center justify-center rounded-full bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.02]"
                  >
                    Rezerviraj
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}