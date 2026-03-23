import { BookingForm } from "@/components/booking/booking-form";
import { getUnits } from "@/lib/units";

export default async function BookingPage() {
  const units = await getUnits();

  return (
    <main className="min-h-screen bg-white px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
              Booking
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900">
              Provjeri dostupnost i pošalji booking upit
            </h1>

            <p className="mt-4 max-w-xl text-lg leading-8 text-gray-600">
              Odaberi jedinicu, unesi željene datume boravka i pošalji upit za
              rezervaciju kroz jednostavnu formu.
            </p>

            <div className="mt-8 space-y-4">
              <div className="rounded-2xl border border-gray-200 p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900">
                  Kako funkcionira?
                </h2>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Prvo provjeriš dostupnost termina, a zatim šalješ booking upit.
                  Admin nakon toga pregledava i potvrđuje rezervaciju.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900">
                  Što trebaš unijeti?
                </h2>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Jedinicu, check-in, check-out, broj gostiju te osnovne kontakt
                  podatke.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
            <BookingForm units={units} />
          </div>
        </div>
      </div>
    </main>
  );
}