import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useAuth } from "./contexts/AuthContext";

// 공용
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import ReservationsPage from "./pages/ReservationsPage";
import ListingDetailPage from "./pages/ListingDetailPage";
import PaymentPage from "./pages/PaymentPage";
import ReservationComplete from "./pages/ReservationComplete";

// 관리자 컴포넌트
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminListings from "./pages/admin/AdminListings";
import AdminReservations from "./pages/admin/AdminReservations";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminNotices from "./pages/admin/AdminNotices";
import AdminNoticeNew from "./pages/admin/AdminNoticeNew";
import AdminNoticeEdit from "./pages/admin/AdminNoticeEdit";
import EditUser from "./pages/admin/EditUser";

// 컴포넌트
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  const { user, loading } = useAuth();

  if (loading) return null;

  // 관리자 전용 라우트

  if (user?.admin) {
    return (
      <Router>
        <Routes>
          <Route
            path="/admin"
            element={
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/listings"
            element={
              <AdminLayout>
                <AdminListings />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/reservations"
            element={
              <AdminLayout>
                <AdminReservations />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminLayout>
                <AdminUsers />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/users/edit/:id"
            element={
              <AdminLayout>
                <EditUser />
              </AdminLayout>
            }
          />

          <Route
            path="/admin/notices"
            element={
              <AdminLayout>
                <AdminNotices />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/notices/new"
            element={
              <AdminLayout>
                <AdminNoticeNew />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/notices/edit/:id"
            element={
              <AdminLayout>
                <AdminNoticeEdit />
              </AdminLayout>
            }
          />

          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </Router>
    );
  }

  // 일반 유저 라우트

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

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
