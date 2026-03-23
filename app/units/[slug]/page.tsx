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

  const galleryImages =
    unit.unit_images && unit.unit_images.length > 0
      ? [...unit.unit_images]
          .sort((a, b) => {
            if (a.is_cover && !b.is_cover) return -1;
            if (!a.is_cover && b.is_cover) return 1;
            return a.sort_order - b.sort_order;
          })
          .map((image) => image.image_url)
      : [unit.cover_image || "/images/unit-1.jpg"];

  const mainImage = galleryImages[0];
  const sideImages = galleryImages.slice(1, 5);

  const amenities = [
    `${unit.capacity} gosta`,
    unit.size_m2 ? `${unit.size_m2} m² prostora` : "Prostran smještaj",
    unit.bedroom_count ? `${unit.bedroom_count} spavaće sobe` : "Spavaća soba",
    unit.bathroom_count ? `${unit.bathroom_count} kupaonice` : "Kupaonica",
    unit.bed_count ? `${unit.bed_count} kreveta` : "Krevet",
    ...(unit.amenities && unit.amenities.length > 0
      ? unit.amenities
      : ["Brzi Wi-Fi", "Klima uređaj", "Smart TV"]),
  ];

  return (
    <main className="min-h-screen bg-white px-4 py-8 text-slate-900 md:px-6 md:py-10">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/units"
          className="mb-6 inline-flex items-center text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          ← Natrag na jedinice
        </Link>

        <div className="mb-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
                {unit.name}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
                <span className="font-medium text-slate-900">
                  ★ 4.96 · 28 recenzija
                </span>
                <span>{unit.capacity} gosta</span>
                {unit.size_m2 ? <span>{unit.size_m2} m²</span> : null}
                <span className="underline underline-offset-2">
                  {unit.city || "Premium smještaj"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm text-slate-600">
              <button className="rounded-full border border-slate-200 px-4 py-2 font-medium transition hover:bg-slate-50">
                Podijeli
              </button>
              <button className="rounded-full border border-slate-200 px-4 py-2 font-medium transition hover:bg-slate-50">
                Sačuvaj
              </button>
            </div>
          </div>
        </div>

        <section className="overflow-hidden rounded-[2rem]">
          {galleryImages.length === 1 ? (
            <div className="relative h-[320px] overflow-hidden rounded-[1.6rem] md:h-[560px]">
              <Image
                src={mainImage}
                alt={unit.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          ) : (
            <div className="grid gap-2 md:grid-cols-2">
              <div className="relative h-[280px] overflow-hidden rounded-[1.6rem] md:h-[520px]">
                <Image
                  src={mainImage}
                  alt={unit.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                {sideImages.map((image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className="relative h-[136px] overflow-hidden rounded-[1.4rem] sm:h-[254px]"
                  >
                    <Image
                      src={image}
                      alt={`${unit.name} ${index + 2}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="mt-10 grid gap-10 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="min-w-0">
            <div className="border-b border-slate-200 pb-8">
              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-950">
                    Cijela jedinica za boravak
                  </h2>
                  <p className="mt-2 text-base text-slate-600">
                    Idealno za parove, porodice i goste koji žele komfor,
                    privatnost i moderan ambijent.
                  </p>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-xl font-semibold text-slate-700">
                  {unit.name.charAt(0)}
                </div>
              </div>
            </div>

            <div className="border-b border-slate-200 py-8">
              <div className="grid gap-6">
                <div className="flex items-start gap-4">
                  <div className="mt-1 text-xl">🏡</div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-950">
                      Privatnost i udobnost
                    </h3>
                    <p className="mt-1 text-slate-600">
                      Cijeli prostor je osmišljen za opušten i ugodan boravak.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="mt-1 text-xl">✨</div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-950">
                      Moderan interijer
                    </h3>
                    <p className="mt-1 text-slate-600">
                      Čiste linije, kvalitetni materijali i osjećaj premium
                      smještaja.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="mt-1 text-xl">📍</div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-950">
                      Odličan izbor za kraći ili duži boravak
                    </h3>
                    <p className="mt-1 text-slate-600">
                      Pogodno za vikend odmor, poslovna putovanja ili porodični
                      smještaj.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-b border-slate-200 py-8">
              <h2 className="text-2xl font-semibold text-slate-950">
                O ovom smještaju
              </h2>

              <p className="mt-5 text-[1.05rem] leading-8 text-slate-700">
                {unit.full_description ||
                  unit.short_description ||
                  "Opis ove jedinice bit će uskoro dostupan."}
              </p>
            </div>

            <div className="py-8">
              <h2 className="text-2xl font-semibold text-slate-950">
                Što ovaj smještaj nudi
              </h2>

              <div className="mt-6 grid gap-x-10 gap-y-5 sm:grid-cols-2">
                {amenities.map((item, index) => (
                  <div
                    key={`${item}-${index}`}
                    className="flex items-center gap-3 border-b border-slate-200 pb-4 text-slate-800"
                  >
                    <span className="text-lg">✓</span>
                    <span className="text-base">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="xl:sticky xl:top-24 xl:self-start">
            <div className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.18)]">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-2xl font-semibold text-slate-950">
                    €{unit.base_price}
                    <span className="ml-1 text-base font-normal text-slate-500">
                      / noć
                    </span>
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Bez dodatnih skrivenih troškova
                  </p>
                </div>

                <div className="text-right text-sm text-slate-500">
                  <p className="font-medium text-slate-900">★ 4.96</p>
                  <p>28 recenzija</p>
                </div>
              </div>

              <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
                <div className="grid grid-cols-2">
                  <div className="border-b border-r border-slate-200 p-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                      Check-in
                    </p>
                    <p className="mt-1 text-sm text-slate-900">
                      Dodaj datum
                    </p>
                  </div>

                  <div className="border-b border-slate-200 p-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                      Check-out
                    </p>
                    <p className="mt-1 text-sm text-slate-900">
                      Dodaj datum
                    </p>
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                    Gosti
                  </p>
                  <p className="mt-1 text-sm text-slate-900">
                    1–{unit.capacity} gosta
                  </p>
                </div>
              </div>

              <Link
                href="/booking"
                className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-rose-500 px-6 py-4 text-base font-semibold text-white transition hover:bg-rose-600"
              >
                Rezerviraj
              </Link>

              <Link
                href="/availability"
                className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-slate-300 px-6 py-4 text-base font-semibold text-slate-900 transition hover:bg-slate-50"
              >
                Provjeri dostupnost
              </Link>

              <p className="mt-4 text-center text-sm text-slate-500">
                Rezervacija se potvrđuje nakon odabira termina.
              </p>

              <div className="mt-6 space-y-4 border-t border-slate-200 pt-6 text-sm text-slate-600">
                <div className="flex items-center justify-between gap-4">
                  <span>€{unit.base_price} × 1 noć</span>
                  <span>€{unit.base_price}</span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span>Naknada usluge</span>
                  <span>€0</span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span>Čišćenje</span>
                  <span>€0</span>
                </div>

                <div className="flex items-center justify-between gap-4 border-t border-slate-200 pt-4 text-base font-semibold text-slate-950">
                  <span>Ukupno</span>
                  <span>€{unit.base_price}</span>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}