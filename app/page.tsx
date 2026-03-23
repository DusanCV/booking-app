import Image from "next/image";
import Link from "next/link";
import { getUnits } from "@/lib/units";
import type { Unit } from "@/types/unit";
import { UnitCard } from "@/components/units/unit-card";

export default async function HomePage() {
  let units: Unit[] = [];

  try {
    units = await getUnits();
  } catch {
    units = [];
  }

  const featuredUnits = units.slice(0, 4);

  return (
    <main className="bg-[#07111f] text-white">
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/unit-1.jpg"
            alt="Luxury stay"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#06101d]/55 via-[#07111f]/60 to-[#07111f]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_24%),radial-gradient(circle_at_left,rgba(56,189,248,0.16),transparent_18%)]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-20 md:pb-32 md:pt-28 lg:pt-36">
          <div className="grid items-end gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium uppercase tracking-[0.24em] text-white/70 backdrop-blur">
                Premium booking experience
              </div>

              <h1 className="mt-7 text-6xl font-semibold leading-[0.98] tracking-tight text-white md:text-7xl xl:text-8xl">
                Moderna rezervacija
                <span className="block bg-gradient-to-r from-white to-sky-300 bg-clip-text text-transparent">
                  za vrhunski smještaj
                </span>
              </h1>

              <p className="mt-7 max-w-2xl text-xl leading-9 text-white/75 md:text-2xl">
                Elegantna prezentacija jedinica, jasan pregled dostupnosti i
                jednostavan booking flow za goste koji žele brzo rezervirati.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/booking"
                  className="inline-flex items-center justify-center rounded-full bg-white px-7 py-4 text-base font-semibold text-slate-950 shadow-2xl transition hover:scale-[1.02]"
                >
                  Rezerviraj odmah
                </Link>

                <Link
                  href="/units"
                  className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-7 py-4 text-base font-semibold text-white backdrop-blur transition hover:bg-white/10"
                >
                  Pogledaj jedinice
                </Link>
              </div>

              <div className="mt-14 grid max-w-3xl gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                  <p className="text-4xl font-semibold text-white">4</p>
                  <p className="mt-2 text-base text-white/65">
                    Ekskluzivne jedinice
                  </p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                  <p className="text-4xl font-semibold text-white">24/7</p>
                  <p className="mt-2 text-base text-white/65">
                    Online booking upiti
                  </p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                  <p className="text-4xl font-semibold text-white">100%</p>
                  <p className="mt-2 text-base text-white/65">
                    Moderan booking flow
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:justify-self-end">
              <div className="rounded-[2.2rem] border border-white/10 bg-white/8 p-4 shadow-2xl backdrop-blur-xl">
                <div className="overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#0f1b2f]">
                  <div className="relative h-[280px] md:h-[360px]">
                    <Image
                      src="/images/unit-2.jpg"
                      alt="Featured unit"
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="space-y-5 p-7">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm uppercase tracking-[0.24em] text-white/40">
                          Featured stay
                        </p>
                        <h2 className="mt-2 text-3xl font-semibold text-white">
                          Signature Suite
                        </h2>
                      </div>
                      <div className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-300">
                        Dostupno
                      </div>
                    </div>

                    <p className="text-base leading-8 text-white/70">
                      Udoban, sofisticiran prostor s modernim interijerom,
                      idealan za goste koji žele premium dojam od prvog klika.
                    </p>

                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="rounded-2xl bg-white/5 p-4">
                        <p className="text-xl font-semibold text-white">2-4</p>
                        <p className="text-sm text-white/55">gosta</p>
                      </div>
                      <div className="rounded-2xl bg-white/5 p-4">
                        <p className="text-xl font-semibold text-white">42m²</p>
                        <p className="text-sm text-white/55">prostor</p>
                      </div>
                      <div className="rounded-2xl bg-white/5 p-4">
                        <p className="text-xl font-semibold text-white">€110</p>
                        <p className="text-sm text-white/55">od / noć</p>
                      </div>
                    </div>

                    <Link
                      href="/booking"
                      className="inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-3.5 text-base font-semibold text-slate-950 transition hover:scale-[1.01]"
                    >
                      Pošalji booking upit
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-20 grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-7 backdrop-blur">
              <p className="text-lg font-semibold text-white">Brza dostupnost</p>
              <p className="mt-3 text-base leading-8 text-white/65">
                Gosti odmah vide slobodne termine i šalju booking bez zvanja i
                poruka.
              </p>
            </div>
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-7 backdrop-blur">
              <p className="text-lg font-semibold text-white">
                Premium prezentacija
              </p>
              <p className="mt-3 text-base leading-8 text-white/65">
                Smještaj izgleda ozbiljno, elegantno i dovoljno kvalitetno za
                veće cijene.
              </p>
            </div>
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-7 backdrop-blur">
              <p className="text-lg font-semibold text-white">Moderan admin</p>
              <p className="mt-3 text-base leading-8 text-white/65">
                Pregled rezervacija, blokade datuma i kontrola dostupnosti na
                jednom mjestu.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f8fafc] text-slate-900">
        <div className="mx-auto max-w-[1560px] px-6 py-24">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
                Naše jedinice
              </p>
              <h2 className="mt-3 text-5xl font-semibold tracking-tight text-slate-950">
                Smještaj koji izgleda premium i online i uživo
              </h2>
              <p className="mt-4 text-xl leading-9 text-slate-600">
                Svaka jedinica ima vlastiti karakter, jasan opis i direktan put
                do rezervacije.
              </p>
            </div>

            <Link
              href="/units"
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-slate-800"
            >
              Pogledaj sve jedinice
            </Link>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 2xl:grid-cols-4">
            {featuredUnits.map((unit) => (
              <UnitCard key={unit.id} unit={unit} variant="light" />
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_18%)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-24">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/45">
                Zašto ovaj web radi
              </p>
              <h2 className="mt-4 text-5xl font-semibold tracking-tight text-white">
                Osjećaj premium brenda od prvog scrolla
              </h2>
              <p className="mt-5 max-w-xl text-xl leading-9 text-white/70">
                Kombinacija jakog hero dijela, luksuzne tipografije, velikih
                kartica i čistog booking flowa daje ozbiljan dojam i povećava
                povjerenje gostiju.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-[1.8rem] border border-white/10 bg-white/5 p-7 backdrop-blur">
                <p className="text-xl font-semibold text-white">High-end hero</p>
                <p className="mt-3 text-base leading-8 text-white/65">
                  Veliki naslov, jaka fotografija i jasni CTA gumbi za booking.
                </p>
              </div>

              <div className="rounded-[1.8rem] border border-white/10 bg-white/5 p-7 backdrop-blur">
                <p className="text-xl font-semibold text-white">
                  Strukturiran sadržaj
                </p>
                <p className="mt-3 text-base leading-8 text-white/65">
                  Korisnik brzo razumije ponudu, cijene i kako rezervirati.
                </p>
              </div>

              <div className="rounded-[1.8rem] border border-white/10 bg-white/5 p-7 backdrop-blur">
                <p className="text-xl font-semibold text-white">
                  Moderan osjećaj
                </p>
                <p className="mt-3 text-base leading-8 text-white/65">
                  Blur, gradijenti, zaobljeni layout i kartice daju premium UX.
                </p>
              </div>

              <div className="rounded-[1.8rem] border border-white/10 bg-white/5 p-7 backdrop-blur">
                <p className="text-xl font-semibold text-white">
                  Spreman za prodaju
                </p>
                <p className="mt-3 text-base leading-8 text-white/65">
                  Ovaj stil izgleda dovoljno dobro da ga pokažeš pravom klijentu.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur md:flex md:items-center md:justify-between">
            <div>
              <p className="text-4xl font-semibold text-white">
                Spreman za premium booking iskustvo?
              </p>
              <p className="mt-3 max-w-2xl text-lg leading-8 text-white/65">
                Pregledaj jedinice, provjeri dostupnost ili odmah pošalji
                booking upit.
              </p>
            </div>

            <div className="mt-6 flex gap-3 md:mt-0">
              <Link
                href="/availability"
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Dostupnost
              </Link>
              <Link
                href="/booking"
                className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.02]"
              >
                Rezerviraj
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}