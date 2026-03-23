import { LoginForm } from "@/components/admin/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#07111f] px-6">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white p-8 shadow-2xl">
        <h1 className="text-3xl font-semibold text-slate-900">
          Admin login
        </h1>

        <p className="mt-2 text-slate-600">
          Prijavi se za pristup admin panelu.
        </p>

        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}