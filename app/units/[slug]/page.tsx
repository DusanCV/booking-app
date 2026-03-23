import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getUnitBySlug } from "@/lib/units";

type UnitDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function UnitDetailPage({
  params,
}: UnitDetailPageProps) {
  const { slug } = await params;
  const unit = await getUnitBySlug(slug);

  if (!unit) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/units"
          className="mb-8 inline-flex text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          ← Natrag na jedinice
        </Link>

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="relative h-[320px] overflow-hidden rounded-3xl border border-gray-200 bg-gray-100 shadow-sm md:h-[420px]">
            <Image
              src={unit.cover_image || "/images/unit-1.jpg"}
              alt={unit.name}
              fill
              className="object-cover"
            />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                {unit.name}
              </h1>

              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                {unit.capacity} gosta
              </span>
            </div>

            <p className="mt-4 text-lg leading-8 text-gray-600">
              {unit.short_description ?? "Opis dolazi uskoro."}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-gray-200 p-5">
                <p className="text-sm text-gray-500">Kapacitet</p>
                <p className="mt-2 text-lg font-semibold text-gray-900">
                  {unit.capacity} gosta
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 p-5">
                <p className="text-sm text-gray-500">Veličina</p>
                <p className="mt-2 text-lg font-semibold text-gray-900">
                  {unit.size_m2 ?? "-"} m²
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 p-5">
                <p className="text-sm text-gray-500">Cijena od</p>
                <p className="mt-2 text-lg font-semibold text-gray-900">
                  {unit.base_price} € / noć
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/booking"
                className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                Rezerviraj sada
              </Link>

              <Link
                href="/availability"
                className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-5 py-3 text-sm font-medium text-gray-900 transition hover:bg-gray-50"
              >
                Provjeri dostupnost
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[2fr_1fr]">
          <section className="rounded-3xl border border-gray-200 p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900">
              Opis jedinice
            </h2>
            <p className="mt-4 leading-8 text-gray-700">
              {unit.full_description}
            </p>
          </section>

          <aside className="rounded-3xl border border-gray-200 p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              Brze informacije
            </h2>

            <div className="mt-5 space-y-4 text-sm text-gray-700">
              <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3">
                <span>Kapacitet</span>
                <span className="font-medium">{unit.capacity} gosta</span>
              </div>

              <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3">
                <span>Veličina</span>
                <span className="font-medium">{unit.size_m2 ?? "-"} m²</span>
              </div>

              <div className="flex items-center justify-between gap-4 pb-1">
                <span>Početna cijena</span>
                <span className="font-medium">{unit.base_price} € / noć</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}