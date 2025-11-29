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

// 공지사항
import NoticesPage from "./pages/NoticesPage";
import NoticeDetailPage from "./pages/NoticeDetailPage";

// 관리자
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminListings from "./pages/admin/AdminListings";
import AdminReservations from "./pages/admin/AdminReservations";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminNotices from "./pages/admin/AdminNotices";
import AdminNoticeNew from "./pages/admin/AdminNoticeNew";
import AdminNoticeEdit from "./pages/admin/AdminNoticeEdit";
import EditUser from "./pages/admin/EditUser";

// 판매자
import SellerDashboard from "./pages/seller/SellerDashboard";
import SellerListings from "./pages/seller/SellerListings";
import SellerAddListing from "./pages/seller/SellerAddListing";
import SellerEditListing from "./pages/seller/SellerEditListing";
import SellerReservations from "./pages/seller/SellerReservations";
import SellerSales from "./pages/seller/SellerSales";

// 공용
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";

export default function App() {
  const { user, loading } = useAuth();
  if (loading) return null;

  return (
    <Router>
      {/* 일반 유저만 Header 보임 */}
      {user?.role !== "admin" && user?.role !== "seller" && <Header />}

      <Routes>
        {/* ======================== */}
        {/*        ⭐ 관리자 라우트   */}
        {/* ======================== */}
        <Route
          path="/admin"
          element={
            <PrivateRoute adminOnly>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/listings"
          element={
            <PrivateRoute adminOnly>
              <AdminLayout>
                <AdminListings />
              </AdminLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/reservations"
          element={
            <PrivateRoute adminOnly>
              <AdminLayout>
                <AdminReservations />
              </AdminLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <PrivateRoute adminOnly>
              <AdminLayout>
                <AdminUsers />
              </AdminLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/notices"
          element={
            <PrivateRoute adminOnly>
              <AdminLayout>
                <AdminNotices />
              </AdminLayout>
            </PrivateRoute>
          }
        />

        {/* ======================== */}
        {/*        ⭐ 판매자 라우트   */}
        {/* ======================== */}
        <Route
          path="/seller"
          element={
            <PrivateRoute sellerOnly>
              <SellerDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/seller/listings"
          element={
            <PrivateRoute sellerOnly>
              <SellerListings />
            </PrivateRoute>
          }
        />

        <Route
          path="/seller/add-listing"
          element={
            <PrivateRoute sellerOnly>
              <SellerAddListing />
            </PrivateRoute>
          }
        />

        <Route
          path="/seller/edit/:id"
          element={
            <PrivateRoute sellerOnly>
              <SellerEditListing />
            </PrivateRoute>
          }
        />

        <Route
          path="/seller/reservations"
          element={
            <PrivateRoute sellerOnly>
              <SellerReservations />
            </PrivateRoute>
          }
        />

        <Route
          path="/seller/sales"
          element={
            <PrivateRoute sellerOnly>
              <SellerSales />
            </PrivateRoute>
          }
        />

        {/* ======================== */}
        {/*        ⭐ 사용자 라우트   */}
        {/* ======================== */}

        <Route path="/" element={<HomePage />} />
        <Route path="/listing/:id" element={<ListingDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route path="/notices" element={<NoticesPage />} />
        <Route path="/notices/:id" element={<NoticeDetailPage />} />

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
