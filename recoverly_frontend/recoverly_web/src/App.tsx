import { Routes, Route, Link, Navigate } from "react-router-dom";
import PatientPage from "./pages/PatientPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <div>
      <nav
        style={{
          background: "#064E3B",
          color: "white",
          padding: "14px 0",
          borderBottom: "1px solid rgba(255,255,255,0.15)",
        }}
      >
        <div
          className="container"
          style={{ display: "flex", alignItems: "center", gap: 18 }}
        >
          <div style={{ fontWeight: 800, letterSpacing: 0.2 }}>Recoverly</div>

          <Link
            to="/intake"
            style={{ color: "white", textDecoration: "none", fontWeight: 600 }}
          >
            Narrative Intake
          </Link>

          <Link
            to="/dashboard"
            style={{ color: "white", textDecoration: "none", fontWeight: 600 }}
          >
            Dashboard
          </Link>
        </div>
      </nav>

      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/intake"
          element={
            <ProtectedRoute>
              <PatientPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}