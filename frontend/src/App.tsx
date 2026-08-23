import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PublicRoute } from "@/components/PublicRoute";
import { AuthProvider } from "@/context/AuthContext";
import { DashboardPage } from "@/pages/DashboardPage";
import { JobFormPage } from "@/pages/JobFormPage";
import { LandingPage } from "@/pages/LandingPage";
import { LandingV2Page } from "@/pages/LandingV2Page";
import { LoginPage } from "@/pages/LoginPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { RegisterPage } from "@/pages/RegisterPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingV2Page />} />
          <Route path="/landing-original" element={<LandingPage />} />
          <Route path="/landing-v2" element={<Navigate to="/" replace />} />
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/jobs" element={<DashboardPage />} />
            <Route path="/jobs/new" element={<JobFormPage />} />
            <Route path="/jobs/:id/edit" element={<JobFormPage />} />
          </Route>
          <Route path="/dashboard" element={<Navigate to="/jobs" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
