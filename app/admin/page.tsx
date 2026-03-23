import { redirect } from "next/navigation";
import { BookingRow } from "@/components/admin/booking-row";
import { LogoutButton } from "@/components/admin/logout-button";
import { BlockDatesForm } from "@/components/admin/block-dates-form";
import { BlockedDatesList } from "@/components/admin/blocked-dates-list";
import { AvailabilityBoard } from "@/components/calendar/availability-board";
import { getBookings, type BookingWithUnitName } from "@/lib/bookings";
import { getBlockedDates } from "@/lib/blocked-dates";
import { getAvailabilityBoard } from "@/lib/availability/get-availability-board";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getUnits } from "@/lib/units";
import type { Unit } from "@/types/unit";

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const units: Unit[] = await getUnits();
  const blockedDates = await getBlockedDates();
  const availabilityBoard = await getAvailabilityBoard(30);

  let bookings: BookingWithUnitName[] = [];

  try {
    bookings = await getBookings();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Nepoznata greška.";

    return (
      <main className="min-h-screen bg-[#07111f] px-6 py-14 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-5xl font-semibold tracking-tight text-white">
                Admin rezervacije
              </h1>
              <p className="mt-3 text-lg text-white/65">
                Pregled rezervacija, blokada i zauzetosti.
              </p>
            </div>

            <LogoutButton />
          </div>

          <div className="mt-10 grid gap-8 xl:grid-cols-2">
            <BlockDatesForm units={units} />
            <BlockedDatesList initialBlockedDates={blockedDates} />
          </div>

          <p className="mt-8 text-red-400">{message}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07111f] px-6 py-14 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/40">
              Admin panel
            </p>
            <h1 className="mt-3 text-5xl font-semibold tracking-tight text-white">
              Upravljanje rezervacijama
            </h1>
            <p className="mt-3 text-lg text-white/65">
              Pregled rezervacija, blokada i zauzetosti za sljedećih 30 dana.
            </p>
          </div>

          <LogoutButton />
        </div>

        <div className="mt-10 grid gap-8 xl:grid-cols-2">
          <BlockDatesForm units={units} />
          <BlockedDatesList initialBlockedDates={blockedDates} />
        </div>

        <div className="mt-10">
          <h2 className="mb-4 text-3xl font-semibold text-white">
            Zauzetost za 30 dana
          </h2>
          <AvailabilityBoard
            dates={availabilityBoard.dates}
            rows={availabilityBoard.rows}
          />
        </div>

        <div className="mt-10 overflow-x-auto rounded-[2rem] border border-white/10 bg-white/5 shadow-sm backdrop-blur">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-white/5 text-left">
              <tr>
                <th className="px-4 py-4 font-semibold text-white">Jedinica</th>
                <th className="px-4 py-4 font-semibold text-white">Gost</th>
                <th className="px-4 py-4 font-semibold text-white">Email</th>
                <th className="px-4 py-4 font-semibold text-white">Telefon</th>
                <th className="px-4 py-4 font-semibold text-white">Check-in</th>
                <th className="px-4 py-4 font-semibold text-white">Check-out</th>
                <th className="px-4 py-4 font-semibold text-white">Gosti</th>
                <th className="px-4 py-4 font-semibold text-white">Ukupno</th>
                <th className="px-4 py-4 font-semibold text-white">Status</th>
                <th className="px-4 py-4 font-semibold text-white">Akcije</th>
              </tr>
            </thead>

            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-6 text-center text-white/50">
                    Nema rezervacija.
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
      </div>
    </main>
  );
}