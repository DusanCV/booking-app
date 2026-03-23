import { AvailabilityBoard } from "@/components/calendar/availability-board";
import { getAvailabilityBoard } from "@/lib/availability/get-availability-board";

export default async function AvailabilityPage() {
  let board;

  try {
    board = await getAvailabilityBoard(14);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Nepoznata greška.";

    return (
      <main className="min-h-screen bg-white px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Dostupnost
          </h1>
          <p className="mt-4 text-red-600">{message}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
            Availability
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900">
            Pregled zauzetosti
          </h1>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Jednostavan pregled zauzetosti za sve jedinice kroz sljedećih 14 dana.
          </p>
        </div>

        <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-4 shadow-sm md:p-6">
          <AvailabilityBoard dates={board.dates} rows={board.rows} />
        </div>
      </div>
    </main>
  );
}