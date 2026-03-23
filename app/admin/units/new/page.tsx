import Link from "next/link";
import { redirect } from "next/navigation";
import { UnitForm } from "@/components/admin/unit-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminNewUnitPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-[#07111f] px-6 py-14 text-white">
      <div className="mx-auto max-w-[1100px]">
        <Link
          href="/admin/units"
          className="inline-flex items-center text-sm font-medium text-white/65 transition hover:text-white"
        >
          ← Natrag na moje jedinice
        </Link>

        <div className="mt-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/40">
            Admin / Jedinice / Nova jedinica
          </p>
          <h1 className="mt-3 text-5xl font-semibold tracking-tight text-white">
            Kreiraj novu jedinicu
          </h1>
          <p className="mt-3 text-lg text-white/65">
            Unesi osnovne informacije i spremi novu smještajnu jedinicu.
          </p>
        </div>

        <div className="mt-10">
          <UnitForm mode="create" />
        </div>
      </div>
    </main>
  );
}