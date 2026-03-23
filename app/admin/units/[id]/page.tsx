import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { UnitForm } from "@/components/admin/unit-form";
import { UnitImagesManager } from "@/components/admin/unit-images-manager";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getOwnerUnitById } from "@/lib/units";

type UnitEditPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminUnitEditPage({
  params,
}: UnitEditPageProps) {
  const { id } = await params;
  const unitId = Number(id);

  if (!Number.isFinite(unitId)) {
    notFound();
  }

  const supabase = await createSupabaseServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const unit = await getOwnerUnitById(supabase, unitId, session.user.id);

  if (!unit) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#07111f] px-6 py-14 text-white">
      <div className="mx-auto max-w-[1400px]">
        <Link
          href="/admin/units"
          className="inline-flex items-center text-sm font-medium text-white/65 transition hover:text-white"
        >
          ← Natrag na moje jedinice
        </Link>

        <div className="mt-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/40">
            Admin / Jedinice / Uređivanje
          </p>
          <h1 className="mt-3 text-5xl font-semibold tracking-tight text-white">
            {unit.name}
          </h1>
          <p className="mt-3 text-lg text-white/65">
            Uredi detalje smještaja i upravljaj galerijom slika.
          </p>
        </div>

        <div className="mt-10 grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
          <UnitForm mode="edit" unit={unit} />
          <UnitImagesManager
            unitId={unit.id}
            initialImages={unit.unit_images ?? []}
          />
        </div>
      </div>
    </main>
  );
}