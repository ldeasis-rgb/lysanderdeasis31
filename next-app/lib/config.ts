import { jwtDecode } from "jwt-decode";

export const CONFIG = {
  API_BASE_URL:
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://lysanderbackend2005.onrender.com",
  STORAGE_KEYS: {
    ACCESS_TOKEN: "accessToken",
    REFRESH_TOKEN: "refreshToken",
  },
  ROUTES: {
    HOME: "/",
    LOGIN: "/login",
    REGISTER: "/register",
    DASHBOARD: "/dashboard",
  },
  ENDPOINTS: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    USERS: "/users",
  },
} as const;

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

// 1. I-save ang JWT token sa localStorage pagkatapos mag-login
export function setToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(CONFIG.STORAGE_KEYS.ACCESS_TOKEN, token);
  }
}

// 2. Kunin ang kasalukuyang nakasave na token
export function getToken(): string | null {
  if (typeof window !== "undefined") {
    return (
      localStorage.getItem(TOKEN_KEY) ||
      localStorage.getItem(CONFIG.STORAGE_KEYS.ACCESS_TOKEN)
    );
  }
  return null;
}

// 3. Burahin ang token (para sa Logout)
export function removeToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(CONFIG.STORAGE_KEYS.REFRESH_TOKEN);
  }
}

// 4. I-decode ang JWT token para makuha ang user info
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

// 5. I-check kung valid pa ang token at hindi pa expired
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