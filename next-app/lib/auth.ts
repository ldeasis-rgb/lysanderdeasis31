import { jwtDecode } from "jwt-decode";
import { CONFIG } from "./config";

const TOKEN_KEY = "token";

export interface DecodedToken {
  sub?: string;
  id?: string | number;
  email?: string;
  username?: string;
  name?: string;
  role?: string;
  exp?: number;
  iat?: number;
}

// --- EXISTING FUNCTIONS (para sa Login & Register) ---
export function setToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(CONFIG.STORAGE_KEYS.ACCESS_TOKEN, token);
  }
}

export function getToken(): string | null {
  if (typeof window !== "undefined") {
    return (
      localStorage.getItem(TOKEN_KEY) ||
      localStorage.getItem(CONFIG.STORAGE_KEYS.ACCESS_TOKEN) ||
      localStorage.getItem("access_token")
    );
  }
  return null;
}

export function removeToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem("access_token");
    localStorage.removeItem(CONFIG.STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem("refresh_token");
  }
}

export function getDecodedToken(): DecodedToken | null {
  const token = getToken();
  if (!token) return null;

  try {
    return jwtDecode<DecodedToken>(token);
  } catch (error) {
    console.error("Invalid JWT token:", error);
    removeToken();
    return null;
  }
}

export function isAuthenticated(): boolean {
  const decoded = getDecodedToken();
  if (!decoded) return false;

  if (decoded.exp) {
    const currentTimeInSeconds = Date.now() / 1000;
    if (decoded.exp < currentTimeInSeconds) {
      removeToken();
      return false;
    }
  }

  return true;
}

// --- NEW CRUD DASHBOARD FUNCTIONS ---
export const getAccessToken = (): string | null => {
  const token = getToken();
  if (!token || token === "undefined" || token === "null") {
    return null;
  }
  return token;
};

export const getUserId = (): number | null => {
  const decoded = getDecodedToken();
  if (!decoded) return null;
  const userId = decoded.sub ?? decoded.id;
  return userId ? Number(userId) : null;
};

export const getUsername = (): string => {
  const decoded = getDecodedToken();
  if (!decoded) return "User";
  return decoded.username || decoded.name || "User";
};

export const setTokens = (accessToken?: string, refreshToken?: string): void => {
  if (typeof window === "undefined") return;

  if (accessToken && accessToken !== "undefined" && accessToken !== "null") {
    setToken(accessToken);
  } else {
    removeToken();
  }

  if (refreshToken && refreshToken !== "undefined" && refreshToken !== "null") {
    localStorage.setItem(CONFIG.STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  } else {
    localStorage.removeItem(CONFIG.STORAGE_KEYS.REFRESH_TOKEN);
  }
};

export const clearTokens = (): void => {
  removeToken();
};