import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AdminLayout } from './components/AdminLayout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AppProvider } from './context/AppContext'
import { AdminLoginPage } from './pages/admin/AdminLoginPage'
import { AdminWinnersPage } from './pages/admin/AdminWinnersPage'
import { DashboardPage } from './pages/admin/DashboardPage'
import { CouponsPage } from './pages/admin/CouponsPage'
import { DrawSchedulePage } from './pages/admin/DrawSchedulePage'
import { ImportPage } from './pages/admin/ImportPage'
import { LuckyDrawPage } from './pages/admin/LuckyDrawPage'
import { LuckyDrawsPage } from './pages/admin/LuckyDrawsPage'
import { ParticipantsPage } from './pages/admin/ParticipantsPage'
import { PrizesPage } from './pages/admin/PrizesPage'
import { SettingsPage } from './pages/admin/SettingsPage'
import { HomePage } from './pages/HomePage'
import { PublicWinnersPage } from './pages/PublicWinnersPage'
import { RegisterPage } from './pages/RegisterPage'
import { PublicUserLoginPage } from './pages/PublicUserLoginPage'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<PublicUserLoginPage />} />
          <Route path="/check-ticket" element={<PublicUserLoginPage />} />
          <Route path="/winners" element={<PublicWinnersPage />} />
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
            <Route path="participants" element={<ParticipantsPage />} />
            <Route path="import" element={<ImportPage />} />
            <Route path="lucky-draws" element={<LuckyDrawsPage />} />
            <Route path="winners" element={<AdminWinnersPage />} />
            <Route path="prizes" element={<PrizesPage />} />
            <Route path="draw-schedule" element={<DrawSchedulePage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/register" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
