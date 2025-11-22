// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import ReservationsPage from "./pages/ReservationsPage";
import PrivateRoute from "./components/PrivateRoute";
import Header from "./components/Header";
import ListingDetailPage from "./pages/ListingDetailPage";
import PaymentPage from "./pages/PaymentPage";
import ReservationComplete from "./pages/ReservationComplete";

// ⭐ 새 관리자 시스템 import
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminListings from "./pages/admin/AdminListings";
import AdminReservations from "./pages/admin/AdminReservations";
import AdminUsers from "./pages/admin/AdminUsers";

function App() {
  const { user } = useAuth();

  /* -------------------------------------------------------
      관리자 모드
  ------------------------------------------------------- */
  if (user?.admin) {
    return (
      <Router>
        <Routes>
          {/* 기본 admin 경로 */}
          <Route path="/" element={<Navigate to="/admin" replace />} />

          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/listings"
            element={
              <PrivateRoute>
                <AdminListings />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/reservations"
            element={
              <PrivateRoute>
                <AdminReservations />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <PrivateRoute>
                <AdminUsers />
              </PrivateRoute>
            }
          />

          {/* 그 외 모든 경로는 관리자 대시보드로 */}
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </Router>
    );
  }

  /* -------------------------------------------------------
      일반 사용자 모드
  ------------------------------------------------------- */
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/listing/:id" element={<ListingDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route
          path="/payment"
          element={
            <PrivateRoute>
              <PaymentPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/reservation-complete"
          element={
            <PrivateRoute>
              <ReservationComplete />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/reservations"
          element={
            <PrivateRoute>
              <ReservationsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <SettingsPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
