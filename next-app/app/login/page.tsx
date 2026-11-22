"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      // TODO: Ilagay dito ang existing API call mo (e.g., registerUser({ fullName, email, password }))
      console.log({ fullName, email, password });
    } catch (err: any) {
      setError(err.message || "Failed to register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Left Side: Branding / Welcome Banner */}
        <div className="hidden md:flex flex-col justify-between p-10 bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 text-white">
          <div>
            <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase bg-white/20 rounded-full">
              Welcome
            </span>
            <h2 className="mt-6 text-3xl font-bold leading-tight">
              Start your journey with us today.
            </h2>
            <p className="mt-3 text-sm text-blue-100 leading-relaxed">
              Create an account to access your dashboard, manage your records, and track everything in one place.
            </p>
          </div>
          <div className="text-xs text-blue-100/80">
            © {new Date().getFullYear()} Lysander Project. All rights reserved.
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="p-8 sm:p-10">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">Create an Account</h1>
            <p className="text-sm text-slate-400 mt-1">
              Fill in your details below to get started
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Juan Dela Cruz"
                className="w-full px-4 py-2.5 rounded-lg bg-slate-800/70 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-lg bg-slate-800/70 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-lg bg-slate-800/70 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">
                Confirm Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-lg bg-slate-800/70 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 mt-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold shadow-lg shadow-blue-600/25 transition cursor-pointer"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}