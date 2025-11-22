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
import AdminPage from "./pages/AdminPage";

function App() {
  const { user } = useAuth();

  if (user?.admin) {
    return (
      <Router>
        {/* 관리자 페이지에서는 헤더 제거 */}
        <Routes>
          {/* admin 루트로 강제 이동 */}
          <Route path="*" element={<Navigate to="/admin" replace />} />

          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AdminPage />
              </PrivateRoute>
            }
          />
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
