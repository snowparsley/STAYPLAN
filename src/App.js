// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
// import SettingsPage from "./pages/SettingsPage";
import ReservationsPage from "./pages/ReservationsPage";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./contexts/AuthContext";
import Header from "./components/Header";
import ListingDetailPage from "./pages/ListingDetailPage";
import PaymentPage from "./pages/PaymentPage";
import ReservationComplete from "./pages/ReservationComplete";

// ✅ 추가된 부분
import { ThemeProvider } from "./contexts/ThemeContext";

function App() {
  return (
    <AuthProvider>
      {/* ✅ 전체 앱을 ThemeProvider로 감싸기 */}
      <ThemeProvider>
        <Router>
          <Header />
          <Routes>
            {/* 기본 페이지 */}
            <Route path="/" element={<HomePage />} />
            <Route path="/listing/:id" element={<ListingDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* 결제 관련 (로그인 필요) */}
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

            {/* 사용자 관련 페이지 */}
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
            {/* <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <SettingsPage />
                </PrivateRoute>
              }
            /> */}
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
