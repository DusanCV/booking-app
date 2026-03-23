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
      <main className="min-h-screen p-10">
        <h1 className="text-3xl font-bold">Jedinice</h1>
        <p className="mt-4 text-red-600">{message}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight">Naše jedinice</h1>
          <p className="mt-3 text-lg text-gray-600">
            Odaberi smještaj koji ti najviše odgovara i provjeri dostupnost za
            željene datume.
          </p>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {units.map((unit) => (
            <article
              key={unit.id}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative h-56 w-full">
                <Image
                  src={unit.cover_image || "/images/unit-1.jpg"}
                  alt={unit.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {unit.name}
                  </h2>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                    {unit.capacity} gosta
                  </span>
                </div>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  {unit.short_description ?? "Opis dolazi uskoro."}
                </p>

                <div className="mt-5 space-y-2 text-sm text-gray-700">
                  <p>
                    <span className="font-medium">Veličina:</span>{" "}
                    {unit.size_m2 ?? "-"} m²
                  </p>
                  <p>
                    <span className="font-medium">Cijena od:</span>{" "}
                    {unit.base_price} € / noć
                  </p>
                </div>

                <div className="mt-6 flex gap-3">
                  <Link
                    href={`/units/${unit.slug}`}
                    className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900 transition hover:bg-gray-50"
                  >
                    Pogledaj detalje
                  </Link>

                  <Link
                    href="/booking"
                    className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
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