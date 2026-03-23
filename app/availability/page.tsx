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
      <main className="min-h-screen bg-[#07111f] px-6 py-14 text-white">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-5xl font-semibold tracking-tight text-white">
            Dostupnost
          </h1>
          <p className="mt-4 text-red-400">{message}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07111f] px-6 py-14 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/45">
            Availability
          </p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-white md:text-6xl">
            Pregled zauzetosti
          </h1>
          <p className="mt-5 text-xl leading-9 text-white/70">
            Jednostavan i jasan pregled zauzetosti za sve jedinice kroz sljedećih
            14 dana.
          </p>
        </div>

        <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-sm backdrop-blur md:p-6">
          <AvailabilityBoard dates={board.dates} rows={board.rows} />
        </div>
      </div>
    </main>
  );
}