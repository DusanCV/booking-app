import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getOwnerUnits } from "@/lib/units";

export default async function AdminUnitsPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const units = await getOwnerUnits(supabase, session.user.id);

  return (
    <main className="min-h-screen bg-[#07111f] px-6 py-14 text-white">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/40">
              Admin / Jedinice
            </p>
            <h1 className="mt-3 text-5xl font-semibold tracking-tight text-white">
              Uredi svoje jedinice
            </h1>
            <p className="mt-3 max-w-3xl text-lg text-white/65">
              Ovdje uređuješ naziv, opis, cijenu, kapacitet, dodatne detalje i
              galeriju slika za svoje smještajne jedinice.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              ← Natrag na admin
            </Link>

            <Link
              href="/admin/units/new"
              className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01]"
            >
              + Nova jedinica
            </Link>
          </div>
        </div>

        {units.length === 0 ? (
          <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/5 p-8">
            <p className="text-white/65">
              Trenutno nema jedinica dodijeljenih ovom vlasniku.
            </p>

            <Link
              href="/admin/units/new"
              className="mt-5 inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01]"
            >
              Kreiraj prvu jedinicu
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {units.map((unit) => (
              <article
                key={unit.id}
                className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5"
              >
                <div className="relative h-64">
                  <Image
                    src={unit.cover_image || "/images/unit-1.jpg"}
                    alt={unit.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-2xl font-semibold text-white">
                      {unit.name}
                    </h2>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        unit.is_active
                          ? "bg-emerald-500/15 text-emerald-200"
                          : "bg-white/10 text-white/60"
                      }`}
                    >
                      {unit.is_active ? "Aktivna" : "Neaktivna"}
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-white/65">
                    {unit.short_description || "Kratki opis nije unesen."}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2 text-sm text-white/60">
                    <span>{unit.capacity} gosta</span>
                    <span>•</span>
                    <span>{unit.size_m2 ?? "-"} m²</span>
                    <span>•</span>
                    <span>€{unit.base_price} / noć</span>
                  </div>

                  <Link
                    href={`/admin/units/${unit.id}`}
                    className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01]"
                  >
                    Uredi jedinicu
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}