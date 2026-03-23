import Image from "next/image";
import Link from "next/link";
import { getUnits } from "@/lib/units";

export default async function HomePage() {
  let units = [];

  try {
    units = await getUnits();
  } catch {
    units = [];
  }

  return (
    <main className="min-h-screen bg-white">
      <section className="border-b border-gray-200">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
              Booking App
            </p>

            <h1 className="mt-4 text-5xl font-bold tracking-tight text-gray-900">
              Udoban smještaj za opušten i jednostavan booking
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
              Pregledaj naše jedinice, provjeri dostupnost termina i pošalji
              booking upit kroz moderan i jednostavan sustav rezervacija.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/units"
                className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                Pogledaj jedinice
              </Link>

              <Link
                href="/booking"
                className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-5 py-3 text-sm font-medium text-gray-900 transition hover:bg-gray-50"
              >
                Rezerviraj
              </Link>
            </div>
          </div>

          <div className="relative h-[320px] overflow-hidden rounded-3xl border border-gray-200 bg-gray-100 shadow-sm md:h-[460px]">
            <Image
              src="/images/unit-1.jpg"
              alt="Smještaj"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Naše jedinice
          </h2>
          <p className="mt-3 text-lg text-gray-600">
            Odaberi jedinicu koja najbolje odgovara tvom boravku.
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
                  <h3 className="text-xl font-semibold text-gray-900">
                    {unit.name}
                  </h3>
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
                    Detalji
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
      </section>

      <section className="border-t border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">
                Jednostavan booking
              </h3>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                Brzo provjeri slobodne termine i pošalji upit u nekoliko klikova.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">
                Pregled dostupnosti
              </h3>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                Jasno vidi koje su jedinice slobodne za željeni termin.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">
                Direktan kontakt
              </h3>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                Jednostavna komunikacija i potvrda rezervacije bez komplikacija.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}