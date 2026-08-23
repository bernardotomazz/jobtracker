import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export function PublicRoute() {
  const { token } = useAuth();
  return token ? <Navigate to="/jobs" replace /> : <Outlet />;
}
