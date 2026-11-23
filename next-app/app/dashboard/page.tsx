"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "../../lib/api";
import { CONFIG } from "../../lib/config";
import {
  clearTokens,
  getUsername,
  isAuthenticated,
} from "../../lib/auth";

interface UserRecord {
  id: number;
  username: string;
  role: string;
  created_at?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<string>("User");
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  // GET /users/:id (Single Record Inspection)
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);

  // POST /users (Create Form State)
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [newUsername, setNewUsername] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");

  // PUT /users/:id (Update Form State)
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
  const [editUsername, setEditUsername] = useState<string>("");
  const [editRole, setEditRole] = useState<string>("user");
  const [editPassword, setEditPassword] = useState<string>("");

  const showToast = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3500);
  };

  // 1. GET ALL (GET /users)
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiClient<UserRecord[]>(CONFIG.ENDPOINTS.USERS, {
        method: "GET",
        requiresAuth: true,
      });
      setUsers(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace(CONFIG.ROUTES.LOGIN);
      return;
    }
    setCurrentUser(getUsername());
    fetchUsers();
  }, [router, fetchUsers]);

  // 2. GET SINGLE (GET /users/:id)
  const handleReadUser = async (id: number) => {
    setError("");
    try {
      const user = await apiClient<UserRecord>(
        `${CONFIG.ENDPOINTS.USERS}/${id}`,
        {
          method: "GET",
          requiresAuth: true,
        }
      );
      setSelectedUser(user);
      setShowCreateForm(false);
      setEditingUser(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch user details.");
    }
  };

  // 3. POST (POST /users)
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await apiClient(CONFIG.ENDPOINTS.USERS, {
        method: "POST",
        body: JSON.stringify({
          username: newUsername.trim(),
          password: newPassword,
        }),
      });
      setNewUsername("");
      setNewPassword("");
      setShowCreateForm(false);
      showToast("New user created successfully (POST /users).");
      await fetchUsers();
    } catch (err: any) {
      setError(err.message || "Failed to create user.");
    } finally {
      setSubmitting(false);
    }
  };

  // Open Update Panel
  const openUpdateForm = (user: UserRecord) => {
    setEditingUser(user);
    setEditUsername(user.username);
    setEditRole(user.role || "user");
    setEditPassword("");
    setShowCreateForm(false);
    setSelectedUser(null);
  };

  // 4. PUT (PUT /users/:id)
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setError("");
    setSubmitting(true);
    try {
      const payload: { username: string; role: string; password?: string } = {
        username: editUsername.trim(),
        role: editRole.trim() || "user",
      };
      if (editPassword.trim()) {
        payload.password = editPassword;
      }

      await apiClient(`${CONFIG.ENDPOINTS.USERS}/${editingUser.id}`, {
        method: "PUT",
        requiresAuth: true,
        body: JSON.stringify(payload),
      });

      setEditingUser(null);
      setEditPassword("");
      showToast(`User #${editingUser.id} updated successfully (PUT /users/${editingUser.id}).`);
      await fetchUsers();
    } catch (err: any) {
      setError(err.message || "Failed to update user.");
    } finally {
      setSubmitting(false);
    }
  };

  // 5. DELETE (DELETE /users/:id)
  const handleDeleteUser = async (user: UserRecord) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete User #${user.id} (${user.username})?`
    );
    if (!confirmed) return;

    setError("");
    try {
      await apiClient(`${CONFIG.ENDPOINTS.USERS}/${user.id}`, {
        method: "DELETE",
        requiresAuth: true,
      });
      if (selectedUser?.id === user.id) setSelectedUser(null);
      if (editingUser?.id === user.id) setEditingUser(null);
      showToast(`User #${user.id} deleted successfully (DELETE /users/${user.id}).`);
      await fetchUsers();
    } catch (err: any) {
      setError(err.message || "Failed to delete user.");
    }
  };

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem(
        CONFIG.STORAGE_KEYS.REFRESH_TOKEN
      );
      if (refreshToken) {
        await apiClient(CONFIG.ENDPOINTS.LOGOUT, {
          method: "POST",
          body: JSON.stringify({ refreshToken }),
        });
      }
    } catch {
      // Proceed with local logout even if backend logout fails
    } finally {
      clearTokens();
      router.push(CONFIG.ROUTES.LOGIN);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white p-6 sm:p-10">
      {/* Aurora Background Orbs */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-fuchsia-600/20 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />

      <div className="relative z-10 max-w-6xl mx-auto space-y-6">
        {/* Top Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-white/15 bg-white/5 backdrop-blur-2xl p-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-amber-300 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Welcome, <span className="font-semibold text-white">{currentUser}</span> — Manage Users (GET, POST, PUT, DELETE)
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="self-start sm:self-center px-5 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 font-semibold text-sm transition cursor-pointer"
          >
            Logout
          </button>
        </header>

        {/* Alerts */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-sm">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-sm">
            {successMsg}
          </div>
        )}

        {/* Single Record Details Card (GET /users/:id) */}
        {selectedUser && (
          <div className="rounded-3xl border border-cyan-400/30 bg-white/5 backdrop-blur-2xl p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-cyan-300">
                  User Details (#{selectedUser.id})
                </h2>
                <p className="text-xs text-slate-400">
                  Fetched directly from GET /users/{selectedUser.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-slate-400 hover:text-white text-sm px-2 py-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div>
                <p className="text-xs text-slate-400">User ID</p>
                <p className="font-mono font-semibold text-white mt-1">
                  {selectedUser.id}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Username</p>
                <p className="font-semibold text-white mt-1">
                  {selectedUser.username}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Role</p>
                <p className="font-semibold text-fuchsia-300 mt-1">
                  {selectedUser.role}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Created At</p>
                <p className="text-sm text-slate-200 mt-1">
                  {selectedUser.created_at
                    ? new Date(selectedUser.created_at).toLocaleDateString()
                    : "—"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Create User Form (POST /users) */}
        {showCreateForm && (
          <form
            onSubmit={handleCreateUser}
            className="rounded-3xl border border-fuchsia-400/30 bg-white/5 backdrop-blur-2xl p-6 space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-fuchsia-300">
                  Create New User
                </h2>
                <p className="text-xs text-slate-400">
                  Submit details to add a new user via POST /users
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="text-slate-400 hover:text-white text-sm px-2 py-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/15 text-white focus:outline-none focus:border-fuchsia-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/15 text-white focus:outline-none focus:border-fuchsia-400"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 rounded-xl border border-white/15 text-sm text-slate-300 hover:bg-white/5 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-90 text-sm font-semibold text-white cursor-pointer disabled:opacity-50"
              >
                {submitting ? "Creating..." : "Create User"}
              </button>
            </div>
          </form>
        )}

        {/* Update User Form (PUT /users/:id) */}
        {editingUser && (
          <form
            onSubmit={handleUpdateUser}
            className="rounded-3xl border border-amber-400/30 bg-white/5 backdrop-blur-2xl p-6 space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-amber-300">
                  Update User #{editingUser.id}
                </h2>
                <p className="text-xs text-slate-400">
                  Modify user details via PUT /users/{editingUser.id}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="text-slate-400 hover:text-white text-sm px-2 py-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/15 text-white focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Role
                </label>
                <input
                  type="text"
                  required
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/15 text-white focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  New Password (Optional)
                </label>
                <input
                  type="password"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  placeholder="Leave blank to keep current"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/15 text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 rounded-xl border border-white/15 text-sm text-slate-300 hover:bg-white/5 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold cursor-pointer disabled:opacity-50"
              >
                {submitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}

        {/* Main Users Table Card */}
        <div className="rounded-3xl border border-white/15 bg-white/5 backdrop-blur-2xl p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white">Users</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                A list of all users stored in the Aiven MySQL backend.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchUsers}
                disabled={loading}
                className="px-4 py-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-sm font-medium text-white transition cursor-pointer disabled:opacity-50"
              >
                {loading ? "Refreshing..." : "↻ Read / Refresh"}
              </button>
              <button
                onClick={() => {
                  setShowCreateForm(true);
                  setEditingUser(null);
                  setSelectedUser(null);
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-fuchsia-600 hover:opacity-90 text-sm font-bold text-white shadow-lg transition cursor-pointer"
              >
                + Create User
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Username</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Created At</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      Loading users from backend...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono text-cyan-300">
                        {user.id}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-white">
                        {user.username}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 text-slate-200">
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {user.created_at
                          ? new Date(user.created_at).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleReadUser(user.id)}
                            className="px-3 py-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-medium text-cyan-300 cursor-pointer"
                          >
                            Read
                          </button>
                          <button
                            onClick={() => openUpdateForm(user)}
                            className="px-3 py-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-medium text-amber-300 cursor-pointer"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user)}
                            className="px-3 py-1.5 rounded-lg border border-rose-500/30 bg-rose-500/15 hover:bg-rose-500/25 text-xs font-medium text-rose-300 cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
