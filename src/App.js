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
