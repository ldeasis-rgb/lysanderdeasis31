"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Hindi magkapareho ang password at confirm password.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/register", { username, password });
      if (res?.error) {
        throw new Error(res.error);
      }
      setSuccess("Account created! Redirecting to login...");
      setTimeout(() => router.push("/login"), 1200);
    } catch (err: any) {
      setError(err.message || "May error sa pag-register. Subukan ulit.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden text-white flex items-center justify-center p-4">
      {/* Makulay na Background Orbs (Aurora Effect) */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-fuchsia-600/30 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -right-32 h-96 w-96 -translate-y-1/2 rounded-full bg-cyan-500/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-1/3 h-96 w-96 rounded-full bg-amber-500/20 blur-3xl" />

      {/* Main Glass Card */}
      <div className="relative z-10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-5 rounded-3xl border border-white/15 bg-white/5 backdrop-blur-2xl shadow-[0_20px_70px_rgba(0,0,0,0.6)] overflow-hidden">
        {/* Left Panel */}
        <div className="md:col-span-2 p-8 flex flex-col justify-between bg-gradient-to-br from-violet-600 via-fuchsia-600 to-orange-500 text-white">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/25 backdrop-blur-md text-xs font-semibold tracking-wide">
              <span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
              LYSANDER PORTAL
            </div>

            <h2 className="mt-6 text-3xl font-extrabold tracking-tight leading-snug !text-white !bg-none">
              Build. Connect. Level Up.
            </h2>
            <p className="mt-3 text-sm text-white/90 leading-relaxed">
              Gumawa ng account para ma-unlock ang iyong personalized workspace at real-time dashboard.
            </p>
          </div>

          <div className="mt-8 space-y-3 text-xs text-white/90">
            <div className="flex items-center gap-2.5 bg-white/15 rounded-xl p-3 backdrop-blur-sm">
              <span className="text-base">⚡</span>
              <span>Mabilis at secure na account access</span>
            </div>
            <div className="flex items-center gap-2.5 bg-white/15 rounded-xl p-3 backdrop-blur-sm">
              <span className="text-base">🎨</span>
              <span>Modern cloud-ready interface</span>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="md:col-span-3 p-8 sm:p-10 bg-slate-950/60">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-amber-300 bg-clip-text text-transparent">
              Create an Account
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Fill in your details below to register
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 !bg-transparent !border-0 !shadow-none !p-0">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-cyan-300 mb-1.5">
                Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="lysander31"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-400 focus:outline-none focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-500/30 transition"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-amber-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs text-slate-400 hover:text-white transition cursor-pointer"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/30 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-300 mb-1.5">
                Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 mt-2 rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-orange-500 hover:from-violet-500 hover:via-fuchsia-500 hover:to-orange-400 disabled:opacity-50 text-white font-bold tracking-wide shadow-lg shadow-fuchsia-600/30 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              {loading ? "Creating Account..." : "Register Now →"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-cyan-400 hover:text-cyan-300 underline underline-offset-4"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}