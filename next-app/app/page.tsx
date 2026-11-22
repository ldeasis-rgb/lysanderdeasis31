import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white flex flex-col justify-between">
      {/* Background Color Glows */}
      <div className="pointer-events-none absolute top-0 left-1/4 h-96 w-96 rounded-full bg-violet-600/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-1/4 h-96 w-96 rounded-full bg-cyan-500/25 blur-3xl" />

      {/* Top Bar */}
      <header className="relative z-10 max-w-6xl w-full mx-auto px-6 py-6 flex items-center justify-between">
        <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-amber-300 bg-clip-text text-transparent">
          Lysander.dev
        </span>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-200 hover:bg-white/10 transition"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-fuchsia-600 to-orange-500 hover:opacity-90 transition shadow-md shadow-fuchsia-600/25"
          >
            Sign Up
          </Link>
        </div>
      </header>

      {/* Center Hero Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 text-center my-auto py-16">
        <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest bg-white/10 border border-white/15 text-cyan-300 mb-6">
          Welcome to My Web Application
        </span>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
          Manage Everything with{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-amber-400 bg-clip-text text-transparent">
            Speed & Color
          </span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Isang modernong web platform na mabilis, responsive, at madaling gamitin. Gumawa na ng account para masimulan.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/register"
            className="px-7 py-3.5 rounded-2xl font-bold text-white bg-gradient-to-r from-violet-600 via-fuchsia-600 to-orange-500 hover:scale-105 transition shadow-xl shadow-fuchsia-600/30"
          >
            Create Free Account
          </Link>
          <Link
            href="/login"
            className="px-7 py-3.5 rounded-2xl font-semibold text-white bg-white/10 border border-white/15 hover:bg-white/15 transition"
          >
            I Already Have an Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 text-center py-6 text-xs text-slate-400 border-t border-white/10">
        Built with Next.js & Tailwind CSS • {new Date().getFullYear()}
      </footer>
    </main>
  );
}