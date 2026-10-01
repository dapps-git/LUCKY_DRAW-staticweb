import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AdminLayout } from './components/AdminLayout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AppProvider } from './context/AppContext'
import { AdminLoginPage } from './views/admin/AdminLoginPage'
import { AdminWinnersPage } from './views/admin/AdminWinnersPage'
import { DashboardPage } from './views/admin/DashboardPage'
import { CouponsPage } from './views/admin/CouponsPage'
import { CouponsDirectoryPage } from './views/admin/CouponsDirectoryPage'
import { LuckyDrawPage } from './views/admin/LuckyDrawPage'
import { LuckyDrawsPage } from './views/admin/LuckyDrawsPage'
import { ParticipantsPage } from './views/admin/ParticipantsPage'
import { HomePage } from './views/HomePage'
import { RegisterPage } from './views/RegisterPage'
import { QrViewerPage } from './views/QrViewerPage'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/qr/:couponId" element={<QrViewerPage />} />
          <Route path="/login" element={<Navigate to="/register" replace />} />
          <Route path="/check-ticket" element={<Navigate to="/register" replace />} />
          <Route path="/winners" element={<Navigate to="/" replace />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin/lucky-draw"
            element={
              <ProtectedRoute>
                <LuckyDrawPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="coupons" element={<CouponsPage />} />
            <Route path="coupons-directory" element={<CouponsDirectoryPage />} />
            <Route path="participants" element={<ParticipantsPage />} />
            <Route path="lucky-draws" element={<LuckyDrawsPage />} />
            <Route path="winners" element={<AdminWinnersPage />} />
            <Route path="import" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="settings" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="prizes" element={<Navigate to="/admin/lucky-draws" replace />} />
          </Route>
          <Route path="*" element={<Navigate to="/register" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
