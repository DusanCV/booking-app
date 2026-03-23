"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function LoginForm() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setLoading(true);
      setErrorMessage(null);

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setErrorMessage("Došlo je do greške pri prijavi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-5">
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-800">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-slate-900"
          placeholder="admin@email.com"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-800">
          Lozinka
        </label>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-slate-900"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-base font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
      >
        {loading ? "Prijava..." : "Prijavi se"}
      </button>

      {errorMessage && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorMessage}
        </div>
      )}
    </form>
  );
}