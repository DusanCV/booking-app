import { BookingForm } from "@/components/booking/booking-form";
import { getUnits } from "@/lib/units";

export default async function BookingPage() {
  const units = await getUnits();

  return (
    <main className="min-h-screen bg-[#07111f] px-6 py-14 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/45">
              Booking
            </p>

            <h1 className="mt-4 text-5xl font-semibold tracking-tight text-white md:text-6xl">
              Provjeri dostupnost
              <span className="block text-white/70">i pošalji booking upit</span>
            </h1>

            <p className="mt-5 max-w-xl text-xl leading-9 text-white/70">
              Odaberi jedinicu, upiši datume i odmah vidi procjenu cijene prije
              slanja rezervacijskog upita.
            </p>

            <div className="mt-10 space-y-4">
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
                <h2 className="text-xl font-semibold text-white">
                  Kako funkcionira?
                </h2>
                <p className="mt-3 text-base leading-8 text-white/65">
                  Prvo provjeriš dostupnost termina, a zatim šalješ booking upit.
                  Admin nakon toga pregledava i potvrđuje rezervaciju.
                </p>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
                <h2 className="text-xl font-semibold text-white">
                  Što trebaš unijeti?
                </h2>
                <p className="mt-3 text-base leading-8 text-white/65">
                  Jedinicu, check-in, check-out, broj gostiju te osnovne kontakt
                  podatke.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2.2rem] border border-white/10 bg-white p-7 shadow-[0_35px_120px_-35px_rgba(0,0,0,0.55)] md:p-9">
            <BookingForm units={units} />
          </div>
        </div>
      </div>
    </main>
  );
}