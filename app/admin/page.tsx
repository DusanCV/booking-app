import { redirect } from "next/navigation";
import { BookingRow } from "@/components/admin/booking-row";
import { LogoutButton } from "@/components/admin/logout-button";
import { BlockDatesForm } from "@/components/admin/block-dates-form";
import { getBookings, type BookingWithUnitName } from "@/lib/bookings";
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
  let bookings: BookingWithUnitName[] = [];

  try {
    bookings = await getBookings();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Nepoznata greška.";

    return (
      <main className="min-h-screen bg-white px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Admin rezervacije
              </h1>
              <p className="mt-2 text-gray-600">
                Pregled svih booking upita i rezervacija.
              </p>
            </div>

            <LogoutButton />
          </div>

          <div className="mt-8">
            <BlockDatesForm units={units} />
          </div>

          <p className="mt-6 text-red-600">{message}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Admin rezervacije
            </h1>
            <p className="mt-2 text-gray-600">
              Pregled svih booking upita i rezervacija.
            </p>
          </div>

          <LogoutButton />
        </div>

        <div className="mt-8">
          <BlockDatesForm units={units} />
        </div>

        <div className="mt-8 overflow-x-auto rounded-3xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Jedinica</th>
                <th className="px-4 py-3 font-semibold">Gost</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Telefon</th>
                <th className="px-4 py-3 font-semibold">Check-in</th>
                <th className="px-4 py-3 font-semibold">Check-out</th>
                <th className="px-4 py-3 font-semibold">Gosti</th>
                <th className="px-4 py-3 font-semibold">Ukupno</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Akcije</th>
              </tr>
            </thead>

            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-6 text-center text-gray-500">
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