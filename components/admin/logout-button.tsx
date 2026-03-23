"use client";

import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function LogoutButton() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="inline-flex items-center justify-center rounded-full border border-rose-400/20 bg-rose-500/10 px-5 py-3 text-sm font-semibold text-rose-100 transition hover:bg-rose-500/20"
    >
      Odjava
    </button>
  );
}