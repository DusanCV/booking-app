import Link from "next/link";

const links = [
  { href: "/", label: "Početna" },
  { href: "/units", label: "Jedinice" },
  { href: "/booking", label: "Booking" },
  { href: "/availability", label: "Dostupnost" },
  { href: "/contact", label: "Kontakt" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#08111d]/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-sm font-semibold text-white shadow-lg ring-1 ring-white/10">
            BA
          </div>

          <div className="leading-tight">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/45">
              Luxury Stay
            </p>
            <p className="text-xl font-semibold text-white">Booking App</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-base font-medium text-white/75 transition hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="hidden rounded-full border border-white/15 px-4 py-2.5 text-sm font-medium text-white/80 transition hover:border-white/30 hover:bg-white/5 hover:text-white md:inline-flex"
          >
            Admin
          </Link>

          <Link
            href="/booking"
            className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:scale-[1.02]"
          >
            Rezerviraj
          </Link>
        </div>
      </div>
    </header>
  );
}