import Link from "next/link";
import { redirect } from "next/navigation";
import { BookingRow } from "@/components/admin/booking-row";
import { LogoutButton } from "@/components/admin/logout-button";
import { BlockDatesForm } from "@/components/admin/block-dates-form";
import { BlockedDatesList } from "@/components/admin/blocked-dates-list";
import { AvailabilityBoard } from "@/components/calendar/availability-board";
import { getOwnerBookings, type BookingWithUnitName } from "@/lib/bookings";
import { getOwnerBlockedDates } from "@/lib/blocked-dates";
import { getOwnerAvailabilityBoard } from "@/lib/availability/get-availability-board";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getOwnerUnits } from "@/lib/units";
import type { Unit } from "@/types/unit";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("hr-HR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  let units: Unit[] = [];
  let blockedDates = [];
  let availabilityBoard = { dates: [], rows: [] };
  let bookings: BookingWithUnitName[] = [];

  try {
    units = await getOwnerUnits(supabase, session.user.id);
    blockedDates = await getOwnerBlockedDates(supabase, session.user.id);
    availabilityBoard = await getOwnerAvailabilityBoard(
      supabase,
      session.user.id,
      30
    );
    bookings = await getOwnerBookings(supabase, session.user.id);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Nepoznata greška.";

    return (
      <main className="min-h-screen bg-[#07111f] px-6 py-14 text-white">
        <div className="mx-auto max-w-[1600px]">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/40">
                Admin panel
              </p>
              <h1 className="mt-3 text-5xl font-semibold tracking-tight text-white">
                Upravljanje rezervacijama
              </h1>
              <p className="mt-3 text-lg text-white/65">
                Pregled rezervacija, blokada i zauzetosti.
              </p>
            </div>

            <LogoutButton />
          </div>

          <p className="mt-10 rounded-3xl border border-red-400/20 bg-red-500/10 px-5 py-4 text-red-200">
            {message}
          </p>
        </div>
      </main>
    );
  }

  const pendingCount = bookings.filter(
    (booking) => booking.status === "pending"
  ).length;
  const confirmedCount = bookings.filter(
    (booking) => booking.status === "confirmed"
  ).length;
  const cancelledCount = bookings.filter(
    (booking) => booking.status === "cancelled"
  ).length;

  const revenue = bookings
    .filter((booking) => booking.status === "confirmed")
    .reduce((sum, booking) => sum + (booking.total_price ?? 0), 0);

  const totalGuests = bookings.reduce(
    (sum, booking) => sum + booking.adults + booking.children,
    0
  );

  return (
    <main className="min-h-screen bg-[#07111f] px-6 py-14 text-white">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/40">
              Admin dashboard
            </p>

            <h1 className="mt-4 text-5xl font-semibold tracking-tight text-white md:text-6xl">
              Glavni pregled
              <span className="block text-white/70">
                samo za tvoje jedinice
              </span>
            </h1>

            <p className="mt-5 text-xl leading-9 text-white/65">
              Ovdje vidiš samo rezervacije, blokade, dostupnost i smještajne
              jedinice koje su dodijeljene tvom korisničkom računu.
            </p>
          </div>

          <LogoutButton />
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 2xl:grid-cols-5">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p className="text-sm uppercase tracking-[0.22em] text-white/40">
              Pending
            </p>
            <p className="mt-3 text-4xl font-semibold text-white">
              {pendingCount}
            </p>
            <p className="mt-2 text-sm text-white/55">Čekaju potvrdu</p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p className="text-sm uppercase tracking-[0.22em] text-white/40">
              Confirmed
            </p>
            <p className="mt-3 text-4xl font-semibold text-white">
              {confirmedCount}
            </p>
            <p className="mt-2 text-sm text-white/55">Potvrđene rezervacije</p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p className="text-sm uppercase tracking-[0.22em] text-white/40">
              Cancelled
            </p>
            <p className="mt-3 text-4xl font-semibold text-white">
              {cancelledCount}
            </p>
            <p className="mt-2 text-sm text-white/55">Otkazane rezervacije</p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p className="text-sm uppercase tracking-[0.22em] text-white/40">
              Prihod
            </p>
            <p className="mt-3 text-4xl font-semibold text-white">
              {formatCurrency(revenue)}
            </p>
            <p className="mt-2 text-sm text-white/55">Confirmed only</p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p className="text-sm uppercase tracking-[0.22em] text-white/40">
              Gosti
            </p>
            <p className="mt-3 text-4xl font-semibold text-white">
              {totalGuests}
            </p>
            <p className="mt-2 text-sm text-white/55">Ukupno kroz bookinge</p>
          </div>
        </div>

        <section className="mt-10 rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))] p-7 backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/40">
                Units management
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-white">
                Uredi svoje jedinice
              </h2>
              <p className="mt-2 text-base leading-8 text-white/65">
                Promijeni detalje smještaja, cijene, opise i dodaj galeriju
                slika samo za jedinice koje su ti dodijeljene.
              </p>
            </div>

            <Link
              href="/admin/units"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 text-base font-semibold text-slate-950 transition hover:scale-[1.02]"
            >
              Otvori upravljanje jedinicama
            </Link>
          </div>
        </section>

        <div className="mt-10 grid gap-8 2xl:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-7 backdrop-blur">
            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/40">
                Quick actions
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-white">
                Blokiraj termin
              </h2>
              <p className="mt-2 text-base leading-8 text-white/65">
                Ručno zatvori termine samo za svoje jedinice.
              </p>
            </div>

            <BlockDatesForm units={units} />
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-7 backdrop-blur">
            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/40">
                Block management
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-white">
                Aktivne blokade
              </h2>
              <p className="mt-2 text-base leading-8 text-white/65">
                Pregledaj i odblokiraj termine samo za svoje jedinice.
              </p>
            </div>

            <BlockedDatesList initialBlockedDates={blockedDates} />
          </div>
        </div>

        <section className="mt-12 rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))] p-7 backdrop-blur">
          <div className="mb-6 flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/40">
                Availability board
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-white">
                Zauzetost za sljedećih 30 dana
              </h2>
              <p className="mt-2 text-base leading-8 text-white/65">
                Prikaz samo za jedinice koje su ti dodijeljene.
              </p>
            </div>

            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/65">
              Scroll vodoravno za puni pregled
            </div>
          </div>

          <AvailabilityBoard
            dates={availabilityBoard.dates}
            rows={availabilityBoard.rows}
          />
        </section>

        <section className="mt-12 rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))] p-7 backdrop-blur">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/40">
              Reservations
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white">
              Rezervacije za tvoje jedinice
            </h2>
            <p className="mt-2 text-base leading-8 text-white/65">
              Upravljaj statusima i prati rezervacije samo za dodijeljene
              jedinice.
            </p>
          </div>

          <div className="overflow-x-auto rounded-[1.6rem] border border-white/10 bg-black/10">
            <table className="min-w-full border-collapse text-sm">
              <thead className="bg-white/5 text-left">
                <tr>
                  <th className="px-4 py-4 font-semibold text-white">
                    Jedinica
                  </th>
                  <th className="px-4 py-4 font-semibold text-white">Gost</th>
                  <th className="px-4 py-4 font-semibold text-white">Email</th>
                  <th className="px-4 py-4 font-semibold text-white">
                    Telefon
                  </th>
                  <th className="px-4 py-4 font-semibold text-white">
                    Check-in
                  </th>
                  <th className="px-4 py-4 font-semibold text-white">
                    Check-out
                  </th>
                  <th className="px-4 py-4 font-semibold text-white">Gosti</th>
                  <th className="px-4 py-4 font-semibold text-white">Ukupno</th>
                  <th className="px-4 py-4 font-semibold text-white">Status</th>
                  <th className="px-4 py-4 font-semibold text-white">Akcije</th>
                </tr>
              </thead>

              <tbody>
                {bookings.length === 0 ? (
                  <tr>
                    <td
                      colSpan={10}
                      className="px-4 py-10 text-center text-base text-white/50"
                    >
                      Nema rezervacija za tvoje jedinice.
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking) => (
                    <BookingRow key={booking.id} booking={booking} />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}