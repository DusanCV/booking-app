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
    <main className="min-h-screen bg-[#07111f] px-6 py-14 text-white">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/units"
          className="mb-8 inline-flex text-base font-medium text-white/65 hover:text-white"
        >
          ← Natrag na jedinice
        </Link>

        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative h-[360px] overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl md:h-[520px]">
            <Image
              src={unit.cover_image || "/images/unit-1.jpg"}
              alt={unit.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-5xl font-semibold tracking-tight text-white md:text-6xl">
                {unit.name}
              </h1>

              <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white/80">
                {unit.capacity} gosta
              </span>
            </div>

            <p className="mt-5 text-xl leading-9 text-white/70">
              {unit.short_description ?? "Opis dolazi uskoro."}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-white/45">Kapacitet</p>
                <p className="mt-2 text-xl font-semibold text-white">
                  {unit.capacity} gosta
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-white/45">Veličina</p>
                <p className="mt-2 text-xl font-semibold text-white">
                  {unit.size_m2 ?? "-"} m²
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-white/45">Cijena od</p>
                <p className="mt-2 text-xl font-semibold text-white">
                  €{unit.base_price} / noć
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/booking"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 text-base font-semibold text-slate-950 transition hover:scale-[1.02]"
              >
                Rezerviraj sada
              </Link>

              <Link
                href="/availability"
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-white/10"
              >
                Provjeri dostupnost
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[2fr_1fr]">
          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-sm backdrop-blur">
            <h2 className="text-3xl font-semibold text-white">Opis jedinice</h2>
            <p className="mt-5 text-lg leading-9 text-white/75">
              {unit.full_description}
            </p>
          </section>

          <aside className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-sm backdrop-blur">
            <h2 className="text-2xl font-semibold text-white">
              Brze informacije
            </h2>

            <div className="mt-6 space-y-4 text-base text-white/75">
              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
                <span>Kapacitet</span>
                <span className="font-semibold text-white">
                  {unit.capacity} gosta
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
                <span>Veličina</span>
                <span className="font-semibold text-white">
                  {unit.size_m2 ?? "-"} m²
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 pb-1">
                <span>Početna cijena</span>
                <span className="font-semibold text-white">
                  €{unit.base_price} / noć
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}