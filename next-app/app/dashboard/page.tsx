"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://lysanderbackend2005.onrender.com";

export default function DashboardPage() {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [userId, setUserId] = useState<string | number>("");
  const [accessToken, setAccessToken] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const token =
      localStorage.getItem("accessToken") ||
      localStorage.getItem("access_token") ||
      localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    setAccessToken(token);

    try {
      const payloadBase64 = token.split(".")[1];
      if (payloadBase64) {
        const decoded = JSON.parse(atob(payloadBase64));
        setUsername(decoded.username || decoded.name || "User");
        setUserId(decoded.sub ?? decoded.id ?? "—");
      }
    } catch {
      setUsername("User");
    }
  }, [router]);

  const handleCopyToken = async () => {
    if (!accessToken) return;
    await navigator.clipboard.writeText(accessToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const refreshToken =
        localStorage.getItem("refreshToken") ||
        localStorage.getItem("refresh_token");

      if (refreshToken) {
        await fetch(`${API_URL}/auth/logout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });
      }
    } catch {
      // Magpapatuloy pa rin sa local logout kahit may network delay
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("access_token");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("refresh_token");
      router.push("/login");
    }
  };

  if (!accessToken) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-slate-400 animate-pulse">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white p-6 sm:p-10">
      {/* Aurora Background Orbs */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-fuchsia-600/25 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-1/3 h-96 w-96 rounded-full bg-amber-500/15 blur-3xl" />

      <div className="relative z-10 max-w-5xl mx-auto space-y-8">
        {/* Header Bar */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-white/15 bg-white/5 backdrop-blur-2xl p-6 shadow-xl">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              AUTHENTICATED SESSION
            </div>
            <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-amber-300 bg-clip-text text-transparent">
              Welcome back, {username}!
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              User ID: <span className="font-mono text-cyan-300">{userId}</span> • Connected to Lysander Cloud API
            </p>
          </div>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="self-start sm:self-center px-5 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 font-semibold text-sm transition cursor-pointer disabled:opacity-50"
          >
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </header>

        {/* Status Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
              Frontend Host
            </p>
            <p className="mt-2 text-lg font-bold text-white">Vercel Edge</p>
            <p className="mt-1 text-xs text-emerald-400">● Active & Connected</p>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-fuchsia-300">
              Backend API
            </p>
            <p className="mt-2 text-lg font-bold text-white">Render NestJS</p>
            <p className="mt-1 text-xs text-emerald-400 truncate">{API_URL}</p>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">
              Database Engine
            </p>
            <p className="mt-2 text-lg font-bold text-white">Aiven MySQL</p>
            <p className="mt-1 text-xs text-emerald-400">● JWT Auth Verified</p>
          </div>
        </div>

        {/* Token Inspector Card */}
        <div className="rounded-3xl border border-white/15 bg-white/5 backdrop-blur-2xl p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Active JWT Access Token
            </h2>
            <button
              onClick={handleCopyToken}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-semibold text-cyan-300 transition cursor-pointer"
            >
              {copied ? "Copied!" : "Copy Token"}
            </button>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/10 font-mono text-xs text-slate-400 break-all">
            {accessToken}
          </div>
        </div>
      </div>
    </div>
  );
}