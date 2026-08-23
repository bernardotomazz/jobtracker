import { api } from "@/lib/api";
import type { AuthResponse, User } from "@/types";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readUser(): User | null {
  const stored = localStorage.getItem("job-tracker-user");
  if (!stored) return null;
  try {
    return JSON.parse(stored) as User;
  } catch {
    localStorage.removeItem("job-tracker-user");
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("job-tracker-token"));
  const [user, setUser] = useState<User | null>(readUser);

  const logout = () => {
    localStorage.removeItem("job-tracker-token");
    localStorage.removeItem("job-tracker-user");
    setToken(null);
    setUser(null);
  };

  const storeSession = (response: AuthResponse) => {
    localStorage.setItem("job-tracker-token", response.token);
    localStorage.setItem("job-tracker-user", JSON.stringify(response.user));
    setToken(response.token);
    setUser(response.user);
  };

  useEffect(() => {
    const expire = () => {
      logout();
      if (!window.location.pathname.startsWith("/login")) {
        window.location.assign("/login?expired=1");
      }
    };
    window.addEventListener("job-tracker:session-expired", expire);
    return () => window.removeEventListener("job-tracker:session-expired", expire);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.login(email, password);
    storeSession(response);
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await api.register(name, email, password);
    storeSession(response);
  };

  const value = useMemo(() => ({ user, token, login, register, logout }), [user, token]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
