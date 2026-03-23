import { getUnits } from "@/lib/units";
import type { Unit } from "@/types/unit";
import { UnitCard } from "@/components/units/unit-card";

export default async function UnitsPage() {
  let units: Unit[] = [];

  try {
    units = await getUnits();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Nepoznata greška.";

    return (
      <main className="min-h-screen bg-[#07111f] px-6 py-14 text-white">
        <h1 className="text-4xl font-semibold">Jedinice</h1>
        <p className="mt-4 text-red-400">{message}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07111f] px-6 py-14 text-white">
      <div className="mx-auto max-w-[1560px]">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/45">
            Smještajne jedinice
          </p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-white md:text-6xl">
            Prostor koji izgleda premium
            <span className="block text-white/70">i rezervira se jednostavno</span>
          </h1>
          <p className="mt-5 text-xl leading-9 text-white/70">
            Odaberi smještaj koji najbolje odgovara tvom boravku i nastavi prema
            rezervaciji u nekoliko klikova.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 2xl:grid-cols-4">
          {units.map((unit) => (
            <UnitCard key={unit.id} unit={unit} />
          ))}
        </div>
      </div>
    </main>
  );
}