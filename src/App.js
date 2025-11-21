// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
  return (
    <Router>
      <Header />
      <Routes>
        {/* 기본 페이지 */}
        <Route path="/" element={<HomePage />} />
        <Route path="/listing/:id" element={<ListingDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* 결제 관련 */}
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

        {/* 사용자 관련 */}
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

        {/* 관리자 페이지 */}
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

export default App;
