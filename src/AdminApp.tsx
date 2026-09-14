'use client'

import React from 'react'
import { BrowserRouter, MemoryRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AdminLayout } from './components/AdminLayout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AdminLoginPage } from './views/admin/AdminLoginPage'
import { AdminWinnersPage } from './views/admin/AdminWinnersPage'
import { DashboardPage } from './views/admin/DashboardPage'
import { CouponsPage } from './views/admin/CouponsPage'
import { CouponsDirectoryPage } from './views/admin/CouponsDirectoryPage'
import { ImportPage } from './views/admin/ImportPage'
import { LuckyDrawPage } from './views/admin/LuckyDrawPage'
import { LuckyDrawsPage } from './views/admin/LuckyDrawsPage'
import { ParticipantsPage } from './views/admin/ParticipantsPage'
import { PrizesPage } from './views/admin/PrizesPage'
import { SettingsPage } from './views/admin/SettingsPage'

export function AdminApp() {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#f8f6f0] flex items-center justify-center text-xs text-slate-500">
        Loading Admin Console...
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
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
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="coupons" element={<CouponsPage />} />
          <Route path="coupons-directory" element={<CouponsDirectoryPage />} />
          <Route path="participants" element={<ParticipantsPage />} />
          <Route path="import" element={<ImportPage />} />
          <Route path="lucky-draws" element={<LuckyDrawsPage />} />
          <Route path="winners" element={<AdminWinnersPage />} />
          <Route path="prizes" element={<PrizesPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
