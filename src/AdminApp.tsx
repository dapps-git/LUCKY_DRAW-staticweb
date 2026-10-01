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
import { LuckyDrawPage } from './views/admin/LuckyDrawPage'
import { LuckyDrawsPage } from './views/admin/LuckyDrawsPage'
import { ParticipantsPage } from './views/admin/ParticipantsPage'

export function AdminApp() {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#FCF9FA] flex items-center justify-center text-xs text-slate-500">
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
          <Route path="lucky-draws" element={<LuckyDrawsPage />} />
          <Route path="winners" element={<AdminWinnersPage />} />
          <Route path="import" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="settings" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="prizes" element={<Navigate to="/admin/lucky-draws" replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AdminApp
