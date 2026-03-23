import { LoginForm } from "@/components/admin/login-form";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-12">
      <div className="mx-auto max-w-md rounded-3xl border border-gray-200 p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
          Admin
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
          Prijava
        </h1>
        <p className="mt-3 text-sm leading-6 text-gray-600">
          Prijavi se za pristup admin dijelu booking sustava.
        </p>

        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}