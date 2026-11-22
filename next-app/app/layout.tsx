import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lysander App",
  description: "Modern Web Application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        {/* Global Top Navbar */}
        <nav className="w-full bg-slate-950/70 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <Link
              href="/"
              className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-amber-300 bg-clip-text text-transparent"
            >
              LysanderApp
            </Link>

            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-medium text-slate-200 hover:text-white transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-sm font-semibold px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-orange-500 text-white shadow-md shadow-fuchsia-600/25 hover:opacity-90 transition"
              >
                Get Started
              </Link>
            </div>
          </div>
        </nav>

        {/* Main Page Content */}
        {children}
      </body>
    </html>
  );
}