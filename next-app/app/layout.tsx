import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold tracking-tight text-white">
          Lysander<span className="text-blue-500">App</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-slate-300 hover:text-white transition"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="text-sm font-medium px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}