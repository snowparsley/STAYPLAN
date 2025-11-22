function App() {
  const { user } = useAuth();

  return (
    <Router>
      {/* ⭐ 관리자 모드일 때 Header 제거 */}
      {!user?.admin && <Header />}

      <Routes>
        {/* 관리자 라우터 */}
        {user?.admin ? (
          <>
            <Route path="/" element={<Navigate to="/admin" replace />} />

            <Route
              path="/admin"
              element={
                <PrivateRoute adminOnly>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />

            <Route
              path="/admin/listings"
              element={
                <PrivateRoute adminOnly>
                  <AdminListings />
                </PrivateRoute>
              }
            />

            <Route
              path="/admin/reservations"
              element={
                <PrivateRoute adminOnly>
                  <AdminReservations />
                </PrivateRoute>
              }
            />

            <Route
              path="/admin/users"
              element={
                <PrivateRoute adminOnly>
                  <AdminUsers />
                </PrivateRoute>
              }
            />

            <Route path="*" element={<Navigate to="/admin" replace />} />
          </>
        ) : (
          <>
            {/* 일반 사용자 라우터 */}
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
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
