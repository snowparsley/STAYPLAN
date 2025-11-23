// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useAuth } from "./contexts/AuthContext";

// 공용 페이지
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import ReservationsPage from "./pages/ReservationsPage";
import ListingDetailPage from "./pages/ListingDetailPage";
import PaymentPage from "./pages/PaymentPage";
import ReservationComplete from "./pages/ReservationComplete";
import EditUser from "./pages/admin/EditUser";
// 컴포넌트
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";

// 관리자 페이지
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminListings from "./pages/admin/AdminListings";
import AdminReservations from "./pages/admin/AdminReservations";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminNotices from "./pages/admin/AdminNotices";

function App() {
  const { user, loading } = useAuth();

  if (loading) return null;

  // ⭐ 관리자 로그인 시 일반 유저 UI를 아예 렌더하지 않고 관리자 라우트만 표시
  if (user?.admin) {
    return (
      <Router>
        <Routes>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/listings" element={<AdminListings />} />
          <Route path="/admin/reservations" element={<AdminReservations />} />
          <Route path="/admin/notices" element={<AdminNotices />} />
          <Route path="/admin/notices/new" element={<AdminNoticeNew />} />
          <Route path="/admin/notices/edit/:id" element={<AdminNoticeEdit />} />

          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/users/edit/:id" element={<EditUser />} />

          {/* 없는 관리자 URL → /admin */}
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </Router>
    );
  }

  // ⭐ 일반 유저 라우트
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

        {/* 잘못된 URL → 홈 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
