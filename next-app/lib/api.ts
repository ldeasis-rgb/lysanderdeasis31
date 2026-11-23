import { CONFIG } from "./config";
import { clearTokens, getAccessToken } from "./auth";

const API_BASE_URL = CONFIG.API_BASE_URL;

interface RequestOptions extends RequestInit {
  token?: string;
}

interface FetchOptions extends RequestInit {
  requiresAuth?: boolean;
}

// --- EXISTING HELPERS (para sa Login & Register pages) ---
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { token, headers, ...customConfig } = options;

  const authToken = token ?? getAccessToken();

  const config: RequestInit = {
    ...customConfig,
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...headers,
    },
  };

  const url = `${API_BASE_URL}${
    endpoint.startsWith("/") ? endpoint : `/${endpoint}`
  }`;

  const response = await fetch(url, config);
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage = Array.isArray(data?.message)
      ? data.message.join(", ")
      : data?.message ||
        data?.detail ||
        data?.error ||
        `Request failed (${response.status})`;
    throw new Error(errorMessage);
  }

  return data as T;
}

export const api = {
  get: <T = any>(endpoint: string, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: "GET" }),

  post: <T = any>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T = any>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T = any>(endpoint: string, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: "DELETE" }),
};

// --- NEW CRUD API CLIENT (mula sa sample code) ---
export async function apiClient<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { requiresAuth = false, headers, ...restOptions } = options;

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (requiresAuth) {
    const token = getAccessToken();
    if (token) {
      defaultHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, {
    headers: {
      ...defaultHeaders,
      ...headers,
    },
    ...restOptions,
  });

  if (response.status === 401 && requiresAuth) {
    clearTokens();
    if (typeof window !== "undefined") {
      window.location.href = CONFIG.ROUTES.LOGIN;
    }
    throw new Error("Session expired. Please log in again.");
  }

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    const errorMessage = Array.isArray(data.message)
      ? data.message.join(", ")
      : data.message || "An unexpected error occurred.";
    throw new Error(errorMessage);
  }

  return data as T;
}